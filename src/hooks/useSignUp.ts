import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase';

import {
  initializeUserPayroll,
  saveUserProfile,
} from '@/utils/firestoreHelpers';

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
  } = useForm<SignUpType>({ mode: 'onChange' });

  const handleSignUp = async (data: SignUpType) => {
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (createdUser.user) {
        await updateProfile(createdUser.user, { displayName: data.name });
        await saveUserProfile(createdUser.user);
        await initializeUserPayroll(createdUser.user.uid);
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
