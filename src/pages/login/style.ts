import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormContainer = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 56px;
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
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;

  border-radius: 8px;
  border: 1px solid #b2b2b2;
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
`;

export const ErrorText = styled.p`
  margin-left: 8px;
  margin-top: 2px;
  color: rgba(229, 115, 115, 1);

  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0.1px;
`;

export const FindSwitcher = styled.div`
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

  margin-top: 4px;

  ${({ theme }) => theme.typography.body4}
  color: ${({ theme }) => theme.colors.grey1};
`;

export const SignUpLink = styled(Link)`
  color: ${({ theme }) => theme.colors.point1};
  text-decoration: none;
`;
