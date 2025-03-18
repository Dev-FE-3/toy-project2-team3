//
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAvailableSalaryDates } from '@/redux/salary-slice';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { SalaryData } from './salaryTypes';

type FetchMode = 'overview' | 'details'; // 모드 정의

interface FetchOptions {
  mode: FetchMode;
  salaryId?: string; // details 모드에서 특정 급여 ID를 가져오기 위해 사용
}

export const useFetchSalaryData = (options: FetchOptions) => {
  const { mode, salaryId } = options;
  const dispatch = useDispatch();
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalaryData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const salaryRef = collection(db, 'users', user.uid, 'salary');
      let querySnapshot;

      if (mode === 'overview') {
        // salary-section에서 필요한 최소한의 데이터만 가져오기
        querySnapshot = await getDocs(salaryRef);
        const salaries: SalaryData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const formattedDate = data.date.toDate();
          const rawDate = formattedDate.getTime();
          const formattedDateString = `${formattedDate.getFullYear()}년 ${
            formattedDate.getMonth() + 1
          }월 ${formattedDate.getDate()}일`;

          return {
            id: doc.id,
            date: formattedDateString,
            rawDate,
            totalPayment: data.totalPayment,
            actualPayment: data.actualPayment,
          } as SalaryData; // 필요한 필드만 포함
        });

        salaries.sort((a, b) => b.rawDate - a.rawDate);
        setSalaryData(salaries);
        dispatch(setAvailableSalaryDates(salaries.map((s) => s.date)));
      } else if (mode === 'details' && salaryId) {
        // salary-modal에서 특정 급여의 상세 데이터 가져오기
        const specificSalaryRef = query(
          salaryRef,
          where('__name__', '==', salaryId)
        );
        querySnapshot = await getDocs(specificSalaryRef);
        const salaries: SalaryData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const formattedDate = data.date.toDate();
          const rawDate = formattedDate.getTime();
          const formattedDateString = `${formattedDate.getFullYear()}년 ${
            formattedDate.getMonth() + 1
          }월 ${formattedDate.getDate()}일`;

          return {
            id: doc.id,
            ...data,
            rawDate,
            date: formattedDateString,
          } as SalaryData; // 모든 필드 포함
        });

        setSalaryData(salaries);
      }
    } catch (err) {
      setError('급여 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, mode, salaryId]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  return { salaryData, isLoading, error };
};
