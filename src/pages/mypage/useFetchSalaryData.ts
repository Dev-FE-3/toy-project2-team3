import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAvailableSalaryDates } from '@/redux/salary-slice';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { SalaryData } from './salaryTypes';

export const useFetchSalaryData = () => {
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
      const querySnapshot = await getDocs(salaryRef);
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
        } as SalaryData;
      });

      salaries.sort((a, b) => b.rawDate - a.rawDate);
      setSalaryData(salaries);
      dispatch(setAvailableSalaryDates(salaries.map((s) => s.date)));
    } catch (err) {
      setError('급여 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  return { salaryData, isLoading, error };
};
