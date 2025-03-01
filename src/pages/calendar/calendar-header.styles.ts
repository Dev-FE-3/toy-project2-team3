import styled from 'styled-components';

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
