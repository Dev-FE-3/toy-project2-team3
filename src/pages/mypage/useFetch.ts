import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './../../firebase';

// 사용자 데이터 타입 정의
interface UserData {
  name: string;
  position: string;
  joinedDate: string;
  department: string;
  email: string;
}

export const useFetch = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '사용자',
    position: '직책 없음',
    joinedDate: '입사일 없음',
    department: '부서 없음',
    email: '이메일 없음',
  });

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) return;

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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData };
};
