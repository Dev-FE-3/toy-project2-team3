import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

interface SignUpType {
  email: string;
  name: string;
  password: string;
  pwdCheck: string;
}

const useSignUp = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignUpType>({
    mode: 'onChange',
  });

  const handleSignUp = async (data: SignUpType) => {
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (createdUser.user) {
        await updateProfile(createdUser.user, { displayName: data.name });
      }

      const user = createdUser.user;

      // 기본 인사 정보데이터
      const userData = {
        name: user.displayName,
        email: user.email,
        position: 'Frontend', // 직책
        department: '개발팀', // 부서
        joinDate: new Date(), // 입사일
      };

      // Firestore에 유저 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

      // 2025년 1월 15일, 2월 15일, 3월 15일 날짜 생성
      const specificDates = [
        new Date(2025, 0, 15),
        new Date(2025, 1, 15),
        new Date(2025, 2, 15),
      ];

      // 각 날짜에 대해 Timestamp로 변환 후 저장
      const salaryData = specificDates.map((date) => {
        return {
          actualPayment: 4600000, // 실지급액
          base: 3000000, // 기본급
          bonus: 500000, // 상여금
          care: -50000, // 예시로 공제 항목 설정
          date: Timestamp.fromDate(date), // 날짜를 Timestamp로 변환
          health: -150000, // 예시로 공제 항목 설정
          job: -80000, // 예시로 공제 항목 설정
          night: 100000, // 예시로 야근수당 설정
          overtime: 200000, // 예시로 초과근무수당 설정
          position: 300000, // 직급
          tax: -120000, // 세금
          totalDeduct: -400000, // 공제합계
          totalPayment: 5000000, // 지급합계
        };
      });

      // Firestore에 급여 내역 정보 저장
      for (const data of salaryData) {
        await addDoc(collection(db, 'users', user.uid, 'salary'), data);
      }

      toast.success('회원가입 성공!');
      navigate('/');
    } catch (error) {
      const firebaseError = error as FirebaseError;

      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setIsModalOpen(true);
          break;
        case 'auth/invalid-email':
          setError('email', { message: '이메일 형식이 잘못되었습니다.' });
          break;
        case 'auth/weak-password':
          setError('password', {
            message: '비밀번호를 6자 이상 입력해 주세요.',
          });
          break;
        default:
          setError('email', {
            message: '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.',
          });
          break;
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    handleSignUp,
    watch,
    isModalOpen,
    setIsModalOpen,
  };
};

export default useSignUp;
