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
  overflow: visible;
  z-index: 1;

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
  overflow: visible;
  z-index: 1;
`;

// 날짜 범위 표시 (여러 날짜에 걸친 이벤트)
export const EventRangeIndicator = styled.div<{
  $isStart?: boolean;
  $isEnd?: boolean;
  $color: string;
  $hasText: boolean;
  $position?: number;
}>`
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.body3};
  padding: 4px;
  height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  z-index: ${(props) =>
    props.$position !== undefined ? 10 - (props.$position % 10) : 1};

  /* 시작, 중간, 끝 부분에 따른 스타일 설정 */
  ${(props) => {
    if (props.$isStart && props.$isEnd) {
      // 시작과 끝이 같은 날인 경우 (단일 날짜 이벤트)
      return css`
        border-radius: 4px;
        margin: 0;
        overflow: hidden;
      `;
    } else if (props.$isStart) {
      // 시작 날짜인 경우
      return css`
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-right: -8px; /* 셀 패딩을 넘어서 확장 */
        padding-right: 8px;
        overflow: visible;
      `;
    } else if (props.$isEnd) {
      // 끝 날짜인 경우
      return css`
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        margin-left: -8px; /* 셀 패딩을 넘어서 확장 */
        padding-left: 8px;
        overflow: visible;
      `;
    } else {
      // 중간 날짜인 경우 (좌우로 넓게 확장)
      return css`
        border-radius: 0;
        margin-left: -9px; /* 좌측으로 확장 (테두리 1px 포함) */
        margin-right: -9px; /* 우측으로 확장 (테두리 1px 포함) */
        padding-left: 8px;
        padding-right: 8px;
        overflow: visible;
      `;
    }
  }}

  /* 시작 부분에만 텍스트 표시 */
  ${(props) =>
    !props.$hasText &&
    css`
      justify-content: center;
    `}
`;

// 더 많은 이벤트 표시기
export const MoreEventsIndicator = styled.div`
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.grey1};
  text-align: center;
  padding: 2px 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
