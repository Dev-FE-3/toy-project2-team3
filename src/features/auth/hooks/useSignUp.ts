import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase';

import {
  initializeUserPayroll,
  saveUserProfile,
} from '@/features/auth/utils/firestoreHelpers';
import { handleFirebaseError } from '@/shared/utils/firebaseErrorHandler';

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
      handleFirebaseError(error, setError, setIsModalOpen);
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
