import * as S from './style';
import Button from '@/shared/button/Button';
import { useLogin } from '@/hooks/useLogin';

const Login = () => {
  const { register, handleSubmit, handleLogin, errors } = useLogin();

  return (
    <S.Container>
      <S.FormContainer>
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
                placeholder="비밀번호를 입력하세요"
                hasError={!!errors.password}
              />
              {errors.password && (
                <S.ErrorText>{errors.password.message}</S.ErrorText>
              )}
            </S.InputBox>
          </S.InputContainer>

          <Button type="submit" style={{ width: '100%' }}>
            로그인
          </Button>
          <S.Switcher>
            아직 회원이 아니신가요?
            <S.SignUpLink to="/signup">회원가입</S.SignUpLink>
          </S.Switcher>
        </S.Form>
      </S.FormContainer>
    </S.Container>
  );
};

export default Login;
