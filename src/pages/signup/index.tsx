import * as S from './style';

import Button from '@/shared/button/Button';
import useSignUp from '@/features/auth/useSignUp';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    errors,
    handleSignUp,
    watch,
    isModalOpen,
    setIsModalOpen,
  } = useSignUp();

  const handleClick = () => {
    setIsModalOpen(false);
    navigate('/login');
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
              <S.Label>이름</S.Label>
              <S.Input
                {...register('name', {
                  required: '이름을 입력하세요.',
                })}
                placeholder="이름을 입력하세요"
                hasError={!!errors.name}
              />
              {errors.name && <S.ErrorText>{errors.name.message}</S.ErrorText>}
            </S.InputBox>
            <S.InputBox>
              <S.Label>비밀번호</S.Label>
              <S.Input
                {...register('password', {
                  required: '비밀번호를 입력하세요.',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8자리 이상이어야 합니다.',
                  },
                  maxLength: {
                    value: 16,
                    message: '비밀번호는 16자리 이하여야 합니다.',
                  },
                })}
                type="password"
                placeholder="사용할 비밀번호를 입력하세요(8자리 이상)"
                hasError={!!errors.password}
              />
              {errors.password && (
                <S.ErrorText>{errors.password.message}</S.ErrorText>
              )}
            </S.InputBox>
            <S.InputBox>
              <S.Label>비밀번호 확인</S.Label>
              <S.Input
                {...register('pwdCheck', {
                  required: '비밀번호를 다시 입력하세요.',
                  validate: (value) =>
                    value === watch('password') ||
                    '비밀번호가 일치하지 않습니다.',
                })}
                type="password"
                placeholder="비밀번호를 다시 입력하세요(8자리 이상)"
                hasError={!!errors.pwdCheck}
              />
              {errors.pwdCheck && (
                <S.ErrorText>{errors.pwdCheck.message}</S.ErrorText>
              )}
            </S.InputBox>
          </S.InputContainer>

          <Button type="submit" style={{ width: '100%' }}>
            제출하기
          </Button>
          <S.Switcher>
            이미 계정이 있나요?
            <S.SignUpLink to="/login">로그인</S.SignUpLink>
          </S.Switcher>
        </S.Form>
      </S.FormContainer>
      <S.ResponsiveSignupGraphic />

      {/* 모달 */}
      {isModalOpen && (
        <S.Modal>
          <S.ModalContent>
            <S.ModalMessage>이미 가입된 계정이 있습니다.</S.ModalMessage>
            <S.ButtonWrapper>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
                닫기
              </Button>
              <Button onClick={handleClick}>로그인으로 이동</Button>
            </S.ButtonWrapper>
          </S.ModalContent>
        </S.Modal>
      )}
    </S.Container>
  );
};

export default SignUp;
