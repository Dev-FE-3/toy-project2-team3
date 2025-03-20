import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// 사용자 데이터 타입 정의
interface UserData {
  name: string;
  position: string;
  joinedDate: string;
  department: string;
  email: string;
}

export const useFetchUserData = () => {
  const defaultUserData: UserData = {
    name: '사용자',
    position: '직책',
    joinedDate: '입사일',
    department: '부서',
    email: '이메일',
  };
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (user: User | null) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        setUserData(defaultUserData);
        return;
      }
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        return;
      }

      const data = docSnap.data();

      // 사용자 정보 설정
      setUserData({
        name: data.name || '사용자',
        position: data.position || '직책 없음',
        joinedDate: data.joinDate?.toDate()
          ? `${data.joinDate.toDate().getFullYear()}년 ${data.joinDate.toDate().getMonth() + 1}월 ${data.joinDate.toDate().getDate()}일`
          : `입사일 없음`,
        department: data.department || `부서 없음`,
        email: data.email || `이메일 없음`,
      });
    } catch (err) {
      setError('사용자 데이터를 불러오는 중 오류가 발생했습니다.');
      setUserData(defaultUserData);
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase 인증 상태 감지하여 사용자 데이터 가져오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  return { userData, isLoading, error };
};
