import React from 'react';
import Button from '../../shared/button/Button';
import {
  HeaderContainer,
  TitleGroup,
  Title,
  NavButton,
  ButtonGroup,
} from './calendar-header.styles';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddTask: (date: Date) => void;
  onClearAll: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddTask,
  onClearAll,
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
        <Button onClick={() => onAddTask(currentDate)}>일정추가</Button>
        <Button onClick={onClearAll}>전체삭제</Button>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default CalendarHeader;
