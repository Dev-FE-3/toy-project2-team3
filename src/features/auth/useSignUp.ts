import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import app from '../../firebase';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

interface SignUpType {
  email: string;
  name: string;
  password: string;
  pwdCheck: string;
}

const useSignUp = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const navigate = useNavigate();

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

      // 임시 데이터
      const userData = {
        name: user.displayName,
        email: user.email,
        position: 'Frontend', // 직책
        department: '개발팀', // 부서
        joinDate: new Date(), // 입사일
      };

      // Firestore에 유저 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

      navigate('/');
    } catch (error) {
      const firebaseError = error as FirebaseError;

      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('email', { message: '이미 가입된 이메일입니다.' });
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
  };
};

export default useSignUp;
