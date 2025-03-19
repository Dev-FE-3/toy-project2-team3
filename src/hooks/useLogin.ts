import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

interface LoginType {
  email: string;
  password: string;
}

const firebaseErrorMessages: Record<
  string,
  { field: 'email' | 'password'; message: string }
> = {
  'auth/invalid-credential': {
    field: 'password',
    message: '이메일 또는 비밀번호가 잘못되었습니다. 다시 입력해 주세요.',
  },
  'auth/too-many-requests': {
    field: 'email',
    message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  'auth/network-request-failed': {
    field: 'email',
    message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.',
  },
  default: {
    field: 'email',
    message: '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.',
  },
};

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginType>();

  const navigate = useNavigate();

  const handleFirebaseError = (error: unknown, setError: Function) => {
    const firebaseError = error as FirebaseError;

    const { field, message } =
      firebaseErrorMessages[firebaseError.code] ||
      firebaseErrorMessages.default;

    setError(field, { message });
  };

  const handleLogin = async (data: LoginType) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      handleFirebaseError(error, setError);
    }
  };

  return { register, handleSubmit, handleLogin, errors };
};
