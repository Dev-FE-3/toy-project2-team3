import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import app from '../../firebase';

interface SignUpType {
  email: string;
  name: string;
  password: string;
  pwdCheck: string;
}

const useSignUp = () => {
  const auth = getAuth(app);

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

      alert('회원가입 성공!'); // 임시
      console.log(createdUser);
      // TODO: 회원가입 후 홈으로 이동하는 로직 추가
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
