import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebase';

interface LoginType {
  email: string;
  password: string;
}

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginType>();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginType) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential.user); // 임시
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
          setError('password', {
            message:
              '이메일 또는 비밀번호가 잘못되었습니다. 다시 입력해 주세요.',
          });
          break;
        case 'auth/too-many-requests':
          setError('email', {
            message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
          });
          break;
        case 'auth/network-request-failed':
          setError('email', {
            message:
              '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.',
          });
          break;
        default:
          setError('email', {
            message: '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.',
          });
          break;
      }
    }
  };

  return { register, handleSubmit, handleLogin, errors };
};
