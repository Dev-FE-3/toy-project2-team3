import React from 'react';
import styled from 'styled-components';

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  memo?: string;
  event?: EventData;
  isEventStart?: boolean;
  isEventEnd?: boolean;
  isInEventRange?: boolean;
  eventTypeName?: string;
  eventColor?: string;
  onDateClick: (date: Date) => void;
}

interface EventData {
  title: string;
  type: string;
  content: string;
  startDate: string;
  endDate: string;
}

interface CalendarCellStyledProps {
  isCurrentMonth: boolean;
  isToday: boolean;
}

// 이벤트 범위 표시자 (선) - 시작일에는 텍스트 표시
const EventRangeIndicator = styled.div<{
  isStart: boolean;
  isEnd: boolean;
  color: string;
  hasText: boolean;
}>`
  height: ${(props) => (props.hasText ? '15px' : '15px')};
  background-color: ${(props) => props.color || 'pink'};
  width: 100%;
  position: relative;
  margin-top: 2px;
  display: ${(props) => (props.hasText ? 'flex' : 'block')};
  align-items: center;
  font-size: 12px;
  color: white;
  padding-left: ${(props) => (props.hasText ? '6px' : '0')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  border-top-left-radius: ${(props) => (props.isStart ? '5px' : '0')};
  border-bottom-left-radius: ${(props) => (props.isStart ? '5px' : '0')};
  border-top-right-radius: ${(props) => (props.isEnd ? '5px' : '0')};
  border-bottom-right-radius: ${(props) => (props.isEnd ? '5px' : '0')};
`;

const CalendarCellStyled = styled.div<CalendarCellStyledProps>`
  display: flex;
  height: 80px;
  width: auto;
  padding: 6px;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #b2b2b2;
  border-radius: 8px;
  cursor: pointer;
  gap: 2px;
  background-color: ${(props) => (!props.isCurrentMonth ? '#b2b2b2' : 'white')};
  opacity: ${(props) => (!props.isCurrentMonth ? 0.2 : 1)};
  color: ${(props) => (props.isToday ? '#2AC1BC' : 'inherit')};
  font-weight: ${(props) => (props.isToday ? 'bold' : 'normal')};

  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    background-color: ${(props) =>
      props.isCurrentMonth ? 'rgba(42, 193, 188, 0.2)' : '#e0e0e0 '};
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
`;

const DateNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1px;
`;

const MemoPreview = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: rgba(42, 193, 188, 0.2);
  padding: 2px 4px;
  border-radius: 4px;
  width: 100%;
  flex: 1;
`;

const formatMemoPreview = (text: string): string => {
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
  eventTypeName,
  eventColor = 'pink',
  onDateClick,
}) => {
  const handleCellClick = (): void => {
    if (isCurrentMonth) {
      onDateClick(date);
    }
  };

  return (
    <CalendarCellStyled
      isCurrentMonth={isCurrentMonth}
      isToday={isToday}
      onClick={handleCellClick}
    >
      <DateContainer>
        <DateNumber>{date.getDate()}</DateNumber>
        {memo && <MemoPreview>{formatMemoPreview(memo)}</MemoPreview>}
      </DateContainer>

      {/* 이벤트 기간 표시 - 시작일에는 선 안에 텍스트 포함 */}
      {isInEventRange && (
        <EventRangeIndicator
          isStart={!!isEventStart}
          isEnd={!!isEventEnd}
          color={eventColor}
          hasText={!!isEventStart && !!eventTypeName}
        >
          {isEventStart && eventTypeName ? eventTypeName : ''}
        </EventRangeIndicator>
      )}
    </CalendarCellStyled>
  );
};

export default CalendarCell;
