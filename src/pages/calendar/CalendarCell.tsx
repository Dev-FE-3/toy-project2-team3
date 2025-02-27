// DayCell.tsx
import React from 'react';
import styled from 'styled-components';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  memo?: string;
  onDateClick: (date: Date) => void;
}

interface DayCellStyledProps {
  isCurrentMonth: boolean;
  isToday: boolean;
}

const DayCellStyled = styled.div<DayCellStyledProps>`
  display: flex;
  height: 80px;
  min-width: 160px;
  padding: 6px;
  flex: 1 0 0;
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
`;

const formatMemoPreview = (text: string): string => {
  return text.length > 15 ? text.substring(0, 15) + '...' : text;
};

const DayCell: React.FC<DayCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  memo,
  onDateClick,
}) => {
  const handleCellClick = (): void => {
    if (isCurrentMonth) {
      onDateClick(date);
    }
  };

  return (
    <DayCellStyled
      isCurrentMonth={isCurrentMonth}
      isToday={isToday}
      onClick={handleCellClick}
    >
      <DateNumber>{date.getDate()}</DateNumber>
      {memo && <MemoPreview>{formatMemoPreview(memo)}</MemoPreview>}
    </DayCellStyled>
  );
};

export default DayCell;
