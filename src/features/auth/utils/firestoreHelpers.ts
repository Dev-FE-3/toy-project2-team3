import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '@/firebase';

const SPECIFIC_DATES = Object.freeze([
  new Date(2025, 0, 15),
  new Date(2025, 1, 15),
  new Date(2025, 2, 15),
]);

export const saveUserProfile = async (user: User) => {
  const userData = {
    name: user.displayName,
    email: user.email,
    position: 'Frontend',
    department: '개발팀',
    joinDate: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), userData);
};

export const initializeUserPayroll = async (userId: string) => {
  const salaryData = SPECIFIC_DATES.map((date) => ({
    actualPayment: 4600000,
    base: 3000000,
    bonus: 500000,
    care: -50000,
    date: Timestamp.fromDate(date),
    health: -150000,
    job: -80000,
    night: 100000,
    overtime: 200000,
    position: 300000,
    tax: -120000,
    totalDeduct: -400000,
    totalPayment: 5000000,
  }));

  await Promise.all(
    salaryData.map((data) =>
      addDoc(collection(db, 'users', userId, 'salary'), data)
    )
  );
};
