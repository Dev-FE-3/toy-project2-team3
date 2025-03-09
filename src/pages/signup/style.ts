import { Link } from 'react-router-dom';
import styled from 'styled-components';

import SignupGraphic from '@/assets/images/signup_graphic.svg?react';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: calc(100% - 518px);
`;

export const FormContainer = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 100px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading2}
`;

export const InputBox = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  gap: 2px;
`;

export const Label = styled.label`
  ${({ theme }) => theme.typography.body2}
  font-weight: 700;
  margin-left: 0.4rem;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  box-sizing: border-box;

  border-radius: 8px;
  border: 1px solid
    ${({ hasError, theme }) =>
      hasError ? theme.colors.red : theme.colors.grey2};
  padding: 11px 16px;

  ${({ theme }) => theme.typography.body3}

  &:focus {
    outline: none;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-bottom: 40px;
`;

export const ErrorText = styled.p`
  margin-left: 8px;
  margin-top: 2px;
  color: rgba(229, 115, 115, 1);

  ${({ theme }) => theme.typography.body4}
`;

export const FindAccountWrapper = styled.div`
  ${({ theme }) => theme.typography.body4}

  display: flex;
  justify-content: end;
  gap: 2px;

  margin-top: 4px;
  margin-bottom: 36px;
`;

export const FindAccountLink = styled.p`
  color: ${({ theme }) => theme.colors.point1};
`;

export const Switcher = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;

  margin-top: 6px;

  ${({ theme }) => theme.typography.body4}
  color: ${({ theme }) => theme.colors.grey1}
`;

export const AuthWrapper = styled.div`
  width: 100%;
`;

export const SignUpLink = styled(Link)`
  color: ${({ theme }) => theme.colors.point1};
  text-decoration: none;
`;

export const ResponsiveSignupGraphic = styled(SignupGraphic)`
  width: auto;
  height: calc(100% - 106px);
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 88px;
  width: 480px;
`;

export const ModalMessage = styled.p`
  ${({ theme }) => theme.typography.heading3}

  display: flex;
  justify-content: start;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: end;
`;
