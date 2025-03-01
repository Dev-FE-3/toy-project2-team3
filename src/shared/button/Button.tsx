import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number | string; // 버튼 너비 (숫자 또는 "100px" 문자열 가능)
  variant?: 'filled' | 'outlined'; // 버튼 스타일
  typeStyle?: 'rounded' | 'square'; // 버튼 모양
}

// 기본 스타일
const StyledButton = styled.button<{
  $typeStyle?: 'rounded' | 'square';
  width?: number | string;
  variant?: 'filled' | 'outlined';
}>`
  box-sizing: border-box;
  white-space: nowrap;
  height: 40px;
  padding: 0 40px;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  font-weight: ${({ $typeStyle }) =>
    $typeStyle === 'rounded' ? 'bold' : 'normal'};
  border-radius: ${({ $typeStyle }) =>
    $typeStyle === 'rounded' ? '8px' : '4px'};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  // variant에 따른 스타일 변화
  ${({ variant }) =>
    variant === 'filled'
      ? `
      background-color: green;
      color: white;
      border: green 1px;

      &:hover {
        background-color: white;
        color : green;
        border : none;
      }
    `
      : `
      background-color: white;
      color: green;
      border: green 1px;

      &:hover {
        background-color: green;
        color: white;
      }
    `}
`;

// 버튼 컴포넌트
const Button: React.FC<ButtonProps> = ({
  children,
  width = 'auto',
  variant = 'filled',
  typeStyle = 'rounded',
  ...props
}) => {
  return (
    <StyledButton
      width={width}
      variant={variant}
      $typeStyle={typeStyle}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
