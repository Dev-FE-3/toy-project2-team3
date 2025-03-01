import React from 'react';

import {
  CalendarCellStyled,
  DateContainer,
  DateNumber,
  MemoPreview,
  EventsContainer,
  EventRangeIndicator,
} from '../styles/calendar-cell.styles';

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  memo?: string;
  event?: {
    title: string;
    type: string;
    content: string;
    startDate: string;
    endDate: string;
  };
  isEventStart?: boolean;
  isEventEnd?: boolean;
  isInEventRange?: boolean;
  eventTypeName?: string;
  eventColor?: string;
  onDateClick: (date: Date) => void;
}

const formatMemoPreview = (text: string): string => {
  return text.length > 15 ? text.substring(0, 15) + '...' : text;
};

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  memo,
  isEventStart,
  isEventEnd,
  isInEventRange,
  eventTypeName,
  eventColor,
  onDateClick,
}) => {
  const isClickable = Boolean(memo || isInEventRange);

  const handleCellClick = (): void => {
    if (isCurrentMonth && isClickable) {
      onDateClick(date);
    }
  };

  // 텍스트를 표시해야 하는지 여부를 명시적으로 계산
  const showEventText = Boolean(isEventStart && eventTypeName);

  return (
    <CalendarCellStyled
      isCurrentMonth={isCurrentMonth}
      isToday={isToday}
      isClickable={isClickable}
      onClick={handleCellClick}
    >
      <DateContainer>
        <DateNumber>{date.getDate()}</DateNumber>
        {memo && <MemoPreview>{formatMemoPreview(memo)}</MemoPreview>}
      </DateContainer>

      {isInEventRange && eventColor && (
        <EventsContainer>
          <EventRangeIndicator
            isStart={Boolean(isEventStart)}
            isEnd={Boolean(isEventEnd)}
            color={eventColor}
            hasText={showEventText}
          >
            {showEventText ? eventTypeName : ''}
          </EventRangeIndicator>
        </EventsContainer>
      )}
    </CalendarCellStyled>
  );
};

export default CalendarCell;
