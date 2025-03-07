import styled from 'styled-components';
import Button from '../../../shared/button/Button';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: ${({ theme }) => theme.colors.point3}
  background-color: ${({ theme }) => theme.colors.white}
  border-bottom: 1px solid #f0f0f0;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.div`
  ${({ theme }) => theme.typography.heading3};
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  color:  ${({ theme }) => theme.colors.point1}
   ${({ theme }) => theme.typography.menu1}
  cursor: pointer;
  padding: 0 6px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.point2};
    border-radius: 4px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const MintButtonHeader = styled(Button)`
  ${(props) =>
    props.variant === 'filled' &&
    `
     font-family: ${props.theme.typography.menu1.fontFamily};
     font-size: ${props.theme.typography.menu1.fontSize};
     font-weight: ${props.theme.typography.menu1.fontWeight};
     letter-spacing: ${props.theme.typography.menu1.letterSpacing};
     line-height: ${props.theme.typography.menu1.lineHeight};

     background-color: ${props.theme.colors.point1};
     border: 1px solid ${props.theme.colors.point1};

     &:hover {
       background-color: ${props.theme.colors.white};
       color: ${props.theme.colors.point1};
       border-radius: 8px;
       border: 1px solid ${props.theme.colors.point1};
     }
   `}
`;
