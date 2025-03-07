import styled from 'styled-components';

export interface CalendarCellStyledProps {
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $isClickable: boolean;
}

// 이벤트 범위 표시자 (선) - 시작일에는 텍스트 표시
export const EventRangeIndicator = styled.div<{
  $isStart?: boolean;
  $isEnd?: boolean;
  $color: string;
  $hasText?: boolean;
}>`
  ${({ theme }) => theme.typography.body3}
  height: 15px;
  background-color: ${(props) => props.$color};
  width: 100%;
  position: relative;
  margin-top: 2px;
  display: ${(props) => (props.$hasText ? 'flex' : 'block')};
  align-items: center;
  color: white;
  padding-left: ${(props) => (props.$hasText ? '6px' : '0')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  border-top-left-radius: ${(props) => (props.$isStart ? '5px' : '0')};
  border-bottom-left-radius: ${(props) => (props.$isStart ? '5px' : '0')};
  border-top-right-radius: ${(props) => (props.$isEnd ? '5px' : '0')};
  border-bottom-right-radius: ${(props) => (props.$isEnd ? '5px' : '0')};
`;

export const CalendarCellStyled = styled.div<CalendarCellStyledProps>`
  position: relative;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  gap: 2px;

  /* 현재 달과 이전/다음 달 구분 */
  background-color: ${(props) => (props.$isCurrentMonth ? '#fff' : '#eaeaea')};
  opacity: ${(props) => (props.$isCurrentMonth ? 1 : 0.6)};
  color: ${(props) => (props.$isCurrentMonth ? '#000' : '#666')};

  ${(props) => props.$isToday && `border: 2px solid #B2B2B2;`}

  /* 클릭 가능한 셀에만 호버 효과와 포인터 적용 */
  ${(props) =>
    props.$isClickable
      ? `
    cursor: pointer;
    &:hover {
      background-color: ${props.$isCurrentMonth ? '#EEFAFA' : '#d9d9d9'};
    }
  `
      : `
    cursor: default;
  `}
`;

export const DateContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
`;

export const DateNumber = styled.div`
  ${({ theme }) => theme.typography.body2};
`;

export const MemoPreview = styled.div`
  ${({ theme }) => theme.typography.body3}
  color: #666;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #d4f3f2;
  padding: 2px 4px;
  border-radius: 4px;
  width: 100%;
  flex: 1;
`;

export const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2px;
  overflow: hidden;
  max-height: 50px;
`;
