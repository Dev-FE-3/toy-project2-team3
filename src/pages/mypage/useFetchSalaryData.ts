import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAvailableSalaryDates } from '@/redux/salary-slice';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { SalaryData } from './salaryTypes';

export const useFetchSalaryData = () => {
  const dispatch = useDispatch();
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);

  const fetchSalaryData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

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
  }, [dispatch]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  return { salaryData };
};
