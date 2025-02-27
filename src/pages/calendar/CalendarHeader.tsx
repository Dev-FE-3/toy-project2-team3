// CalendarHeader.tsx 수정
import React from 'react';
import styled from 'styled-components';
import Button from '../../widgets/button/Button';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  color: #2ac1bc;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #2ac1bc;
  font-size: 18px;
  cursor: pointer;
  padding: 0 6px;
  &:hover {
    background-color: rgba(42, 193, 188, 0.2);
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

// const ActionButton = styled.button`
//   background-color: #2ac1bc;
//   color: white;
//   border: none;
//   padding: 0px 40px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 18px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 133%;
//   letter-spacing: -0.24px;
//   display: flex;
//   height: 40px;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   &:hover {
//     background-color: rgba(42, 193, 188, 0.8);
//   }
// `;

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <HeaderContainer>
      <TitleGroup>
        <NavButton onClick={onPrevMonth}>&lt;</NavButton>
        <Title>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </Title>
        <NavButton onClick={onNextMonth}>&gt;</NavButton>
      </TitleGroup>

      <ButtonGroup>
        <Button>일정추가</Button>
        <Button>전체삭제</Button>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default CalendarHeader;
