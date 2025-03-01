import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as S from './style';
import Button from '../../shared/button/Button';
import { auth } from '@/firebase';

interface LoginType {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginType>();
  const handleLogin = async (data: LoginType) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential.user); // 추후 저장 필요
      alert('로그인 성공!'); // 임시
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

  return (
    <S.Container>
      <S.Title>로그인</S.Title>
      <S.Form onSubmit={handleSubmit(handleLogin)}>
        <S.InputContainer>
          <S.InputBox>
            <S.Label>이메일</S.Label>
            <S.Input
              {...register('email', {
                required: '이메일을 입력하세요.',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: '유효한 이메일 주소를 입력해 주세요.',
                },
              })}
              placeholder="이메일 주소를 입력하세요"
            />
            {errors.email && <S.ErrorText>{errors.email.message}</S.ErrorText>}
          </S.InputBox>
          <S.InputBox>
            <S.Label>비밀번호</S.Label>
            <S.Input
              {...register('password', { required: '비밀번호를 입력하세요.' })}
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <S.ErrorText>{errors.password.message}</S.ErrorText>
            )}
          </S.InputBox>
        </S.InputContainer>
        <S.FindAccountWrapper>
          <S.FindAccountLink>이메일/비밀번호</S.FindAccountLink> 찾기
        </S.FindAccountWrapper>
        <Button type="submit">로그인</Button>
        <S.SignUpWrapper>
          아직 회원이 아니신가요?
          <S.SignUpLink>회원가입</S.SignUpLink>
        </S.SignUpWrapper>
      </S.Form>
    </S.Container>
  );
};

export default LoginPage;
