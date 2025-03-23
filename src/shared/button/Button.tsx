import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number | string; // 버튼 너비 (숫자 또는 "100px" 문자열 가능)
  variant?: 'filled' | 'outlined'; // 버튼 스타일
  typeStyle?: 'rounded' | 'square'; // 버튼 모양
  isDelete?: boolean;
}

// styled-components용 props 타입
interface StyledButtonProps {
  $width?: number | string;
  $variant?: 'filled' | 'outlined';
  $typeStyle?: 'rounded' | 'square';
  $isDelete?: boolean;
}

// 기본 스타일
const StyledButton = styled.button<StyledButtonProps>`
  box-sizing: border-box;
  white-space: nowrap;
  min-height: 40px;
  width: fit-content;
  padding: 0 40px;
  width: ${({ $width }) =>
    typeof $width === 'number' ? `${$width}px` : $width};
  font: ${({ $typeStyle }) =>
    $typeStyle === 'rounded'
      ? ({ theme }) => theme.typography.menu1
      : ({ theme }) => theme.typography.body2};
  border-radius: ${({ $typeStyle }) =>
    $typeStyle === 'rounded' ? '8px' : '4px'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  // variant에 따른 스타일 변화
  ${({ $variant }) =>
    $variant === 'filled'
      ? ({ theme, $isDelete }) =>
          $isDelete
            ? `
      background-color: ${theme.colors.red} ;
      color: ${theme.colors.white};
      border: ${theme.colors.red} 1px solid;

      &:hover {
        background-color: ${theme.colors.white};
        color : ${theme.colors.red};
        border : ${theme.colors.red} 1px solid;
      }
    `
            : `
      background-color: ${theme.colors.point1} ;
      color: ${theme.colors.white};
      border: ${theme.colors.point1} 1px solid;

      &:hover {
        background-color: ${theme.colors.white};
        color : ${theme.colors.point1};
        border : ${theme.colors.point1} 1px solid;
      }
    `
      : ({ theme, $isDelete }) =>
          $isDelete
            ? `
      background-color: ${theme.colors.white};
      color: ${theme.colors.red};
      border: ${theme.colors.red} 1px solid;

      &:hover {
        background-color: ${theme.colors.red};
        color: ${theme.colors.white};
        border: ${theme.colors.red} 1px solid;
      }
    `
            : `
      background-color: ${theme.colors.white};
      color: ${theme.colors.point1};
      border: ${theme.colors.point1} 1px solid;

      &:hover {
        background-color: ${theme.colors.point1};
        color: ${theme.colors.white};
        border: ${theme.colors.point1} 1px solid;
      }
    `}
`;

// 버튼 컴포넌트
const Button: React.FC<ButtonProps> = ({
  children,
  width = 'fit-content',
  variant = 'filled',
  typeStyle = 'rounded',
  isDelete = false,
  ...props
}) => {
  return (
    <StyledButton
      $width={width}
      $variant={variant}
      $typeStyle={typeStyle}
      $isDelete={isDelete}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
