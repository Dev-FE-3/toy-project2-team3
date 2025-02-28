import { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { FirebaseError } from 'firebase/app';
import app from '../../fireBase';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import * as S from './style';

import Button from '../../shared/button/Button';
import SignupGraphic from '../../assets/imgs/signup_graphic.svg?react';

interface SignUpPageProps {
  children?: React.ReactNode;
}

interface SignUpType {
  email: string;
  password: string;
}

const SignUpPage = ({ children }: SignUpPageProps): JSX.Element => {
  const auth = getAuth(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpType>();
  const handleSignUp = async (data: SignUpType) => {
    try {
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      alert('회원가입 성공!'); // 임시
      console.log(createdUser);
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
            message: '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.',
          });
          break;
      }
    }
  };

  return (
    <S.Container>
      <S.FormContainer>
        <S.Title>사원 계정 생성하기</S.Title>
        <S.Form onSubmit={handleSubmit(handleSignUp)}>
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
                hasError={!!errors.email}
              />
              {errors.email && (
                <S.ErrorText>{errors.email.message}</S.ErrorText>
              )}
            </S.InputBox>
            <S.InputBox>
              <S.Label>비밀번호</S.Label>
              <S.Input
                {...register('password', {
                  required: '비밀번호를 입력하세요.',
                })}
                type="password"
                placeholder="사용할 비밀번호를 입력하세요(8자리 이상, 특수문자 포함)"
                hasError={!!errors.password}
              />
              {errors.password && (
                <S.ErrorText>{errors.password.message}</S.ErrorText>
              )}
            </S.InputBox>
          </S.InputContainer>

          <Button type="submit">제출하기</Button>
          <S.SignUpWrapper>
            이미 계정이 있나요?
            <S.SignUpLink to="/login">로그인</S.SignUpLink>
          </S.SignUpWrapper>
        </S.Form>
      </S.FormContainer>
      <SignupGraphic />
    </S.Container>
  );
};

export default SignUpPage;
