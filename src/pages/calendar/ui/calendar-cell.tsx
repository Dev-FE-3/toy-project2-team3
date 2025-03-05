import React from 'react';
import {
  CalendarCellStyled,
  DateContainer,
  DateNumber,
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

const formatTitlePreview = (text: string): string => {
  return text.length > 15 ? text.substring(0, 15) + '...' : text;
};

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  memo,
  event,
  isEventStart,
  isEventEnd,
  isInEventRange,
  eventColor,
  onDateClick,
}) => {
  const isClickable = Boolean(memo || isInEventRange);

  const handleCellClick = (): void => {
    if (isCurrentMonth && isClickable) {
      onDateClick(date);
    }
  };

  const showEventTitle = Boolean(isEventStart && event && event.title);

  const displayTitle =
    showEventTitle && event ? formatTitlePreview(event.title) : '';

  return (
    <CalendarCellStyled
      isCurrentMonth={isCurrentMonth}
      isToday={isToday}
      isClickable={isClickable}
      onClick={handleCellClick}
    >
      <DateContainer>
        <DateNumber>{date.getDate()}</DateNumber>
      </DateContainer>

      {isInEventRange && eventColor && (
        <EventsContainer>
          <EventRangeIndicator
            isStart={Boolean(isEventStart)}
            isEnd={Boolean(isEventEnd)}
            color={eventColor}
            hasText={showEventTitle}
          >
            {displayTitle}
          </EventRangeIndicator>
        </EventsContainer>
      )}
    </CalendarCellStyled>
  );
};

export default CalendarCell;
