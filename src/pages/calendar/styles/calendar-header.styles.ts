import styled from 'styled-components';
import Button from '../../../shared/button/Button';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: #2ac1bc;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  color: #2ac1bc;
  font-size: 18px;
  cursor: pointer;
  padding: 0 6px;
  &:hover {
    background-color: #d4f3f2;
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
       background-color: #fff;
       color: #2ac1bc;
       border-radius: 8px;
       border: 1px solid ${props.theme.colors.point1};
     }
   `}
`;
