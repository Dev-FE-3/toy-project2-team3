import React from 'react';
import {
  HeaderContainer,
  TitleGroup,
  Title,
  NavButton,
  ButtonGroup,
  MintButtonHeader,
} from '../styles/calendar-header.styles';

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
        <MintButtonHeader
          variant="filled"
          typeStyle="rounded"
          onClick={() => onAddTask(currentDate)}
        >
          일정추가
        </MintButtonHeader>
        <MintButtonHeader
          variant="filled"
          typeStyle="rounded"
          onClick={onClearAll}
        >
          전체삭제
        </MintButtonHeader>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default CalendarHeader;
