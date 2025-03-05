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

const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="14"
    viewBox="0 0 11 14"
    fill="none"
  >
    <path
      d="M0.499999 6.13398C-0.166667 6.51888 -0.166667 7.48112 0.5 7.86603L9.5 13.0622C10.1667 13.4471 11 12.966 11 12.1962V1.80385C11 1.03405 10.1667 0.552922 9.5 0.937822L0.499999 6.13398Z"
      fill="#2AC1BC"
    />
  </svg>
);

const NextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="14"
    viewBox="0 0 11 14"
    fill="none"
  >
    <path
      d="M10.5 6.13398C11.1667 6.51888 11.1667 7.48112 10.5 7.86603L1.5 13.0622C0.833333 13.4471 0 12.966 0 12.1962V1.80385C0 1.03405 0.833333 0.552922 1.5 0.937822L10.5 6.13398Z"
      fill="#2AC1BC"
    />
  </svg>
);

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
        <NavButton onClick={onPrevMonth}>
          <PrevIcon />
        </NavButton>
        <Title>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </Title>
        <NavButton onClick={onNextMonth}>
          <NextIcon />
        </NavButton>
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
