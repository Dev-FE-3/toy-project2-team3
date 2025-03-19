import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

import { handleFirebaseError } from '@/utils/firebaseErrorHandler';

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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      handleFirebaseError(error, setError);
    }
  };

  return { register, handleSubmit, handleLogin, errors };
};
