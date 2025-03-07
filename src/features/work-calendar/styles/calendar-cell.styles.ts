import styled, { css } from 'styled-components';
import { theme } from '../../../shared/config/theme';

// 날짜 셀 컨테이너
export const CalendarCellStyled = styled.div<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $isClickable: boolean;
}>`
  position: relative;
  height: 90px;
  min-width: 0;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  border-radius: 8px;
  gap: 2px;
  background-color: ${(props) =>
    props.$isCurrentMonth ? theme.colors.white : theme.colors.grey3};
  color: ${(props) =>
    props.$isCurrentMonth ? theme.colors.black : theme.colors.grey2};
  cursor: ${(props) => (props.$isClickable ? 'pointer' : 'default')};
  overflow: hidden;

  ${(props) =>
    props.$isToday &&
    css`
      background-color: ${({ theme }) => theme.colors.point3};
      border: 1px solid ${({ theme }) => theme.colors.point1};
    `}

  &:hover {
    background-color: ${(props) =>
      props.$isClickable && props.$isCurrentMonth
        ? theme.colors.grey3
        : props.$isCurrentMonth
          ? theme.colors.white
          : theme.colors.grey3};
  }
`;
// 날짜 숫자 컨테이너
export const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

// 날짜 숫자
export const DateNumber = styled.span`
  ${({ theme }) => theme.typography.body2}
`;

// 메모 표시 컨테이너
export const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`;

// 날짜 범위 표시 (여러 날짜에 걸친 이벤트)
export const EventRangeIndicator = styled.div<{
  $isStart?: boolean;
  $isEnd?: boolean;
  $color: string;
  $hasText: boolean;
}>`
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.body3};
  padding: 4px;
  height: 18px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  ${(props) =>
    props.$isStart &&
    css`
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    `}

  ${(props) =>
    props.$isEnd &&
    css`
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    `}
`;
