import React from 'react';
import styled from 'styled-components';

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  memo?: string;
  event?: EventData;
  isEventStart?: boolean;
  eventTypeName?: string;
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

const EventMarker = styled.div`
  width: 100%;
  height: 10px;
  background-color: red;
  margin-top: 2px;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: white;
  padding-left: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CalendarCellStyled = styled.div<CalendarCellStyledProps>`
  display: flex;
  height: 80px;
  width: auto; // min-width 제거하고 width: auto로 변경
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

  // 셀이 그리드 내에서 자동으로 크기 조정되도록 설정
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    background-color: ${(props) =>
      props.isCurrentMonth ? 'rgba(42, 193, 188, 0.2)' : '#e0e0e0 '};
  }
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
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #b2b2b2;
  padding: 2px 4px;
  border-radius: 4px;
  width: 100%;
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
  eventTypeName,
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
      <DateNumber>{date.getDate()}</DateNumber>
      {memo && <MemoPreview>{formatMemoPreview(memo)}</MemoPreview>}
      {event && <EventMarker>{isEventStart && eventTypeName}</EventMarker>}
    </CalendarCellStyled>
  );
};

export default CalendarCell;
