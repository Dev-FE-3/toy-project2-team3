import React from 'react';
import * as S from '../styles/calendar-cell.styles';
import {
  getEventColor,
  formatTitlePreview,
} from './calendar-utils/calendar-utils';

// EventData 인터페이스 정의
interface EventData {
  id?: string;
  title: string;
  type: string;
  content: string;
  startDate: string;
  endDate: string;
  dateKey: string;
}

// 날짜 범위 정보
interface RangeInfo {
  eventId?: string;
  isStart: boolean;
  isEnd: boolean;
  type: string;
}

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events?: EventData[]; // 이벤트 배열로 변경
  rangeInfo?: RangeInfo[]; // 날짜 범위 정보 (시작일, 종료일)
  onDateClick: (date: Date) => void;
}

// 이벤트 ID로 그룹화하여 중복 제거와 정렬을 위한 함수
const groupAndSortEvents = (
  events: EventData[],
  rangeInfo: RangeInfo[]
): {
  rangeEvents: { event: EventData; rangeInfo: RangeInfo }[];
  regularEvents: EventData[];
} => {
  // 범위 이벤트 그룹화
  const rangeEvents: { event: EventData; rangeInfo: RangeInfo }[] = [];

  // 범위 정보를 가진 이벤트 찾아서 매핑
  rangeInfo.forEach((info) => {
    const event = events.find((e) => e.id === info.eventId);
    if (event) {
      rangeEvents.push({ event, rangeInfo: info });
    }
  });

  // 범위에 포함되지 않은 일반 이벤트
  const rangeEventIds = new Set(rangeInfo.map((info) => info.eventId));
  const regularEvents = events.filter((event) => !rangeEventIds.has(event.id));

  return { rangeEvents, regularEvents };
};

const MAX_VISIBLE_EVENTS = 3;

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  events = [],
  rangeInfo = [],
  onDateClick,
}) => {
  // 이벤트를 그룹화하고 정렬하지 않음
  const { rangeEvents, regularEvents } = groupAndSortEvents(events, rangeInfo);

  const sortedRangeEvents = [...rangeEvents];
  const sortedRegularEvents = [...regularEvents];
  // 최대 표시할 이벤트 수

  const totalEvents = events.length;
  const visibleCount = Math.min(MAX_VISIBLE_EVENTS, totalEvents);

  // 이벤트가 있는 날짜와 현재 달의 날짜만 클릭 가능하도록 설정
  const hasAnyEvents = totalEvents > 0 || rangeInfo.length > 0;
  const isClickable = isCurrentMonth && hasAnyEvents;

  const handleCellClick = (): void => {
    if (isClickable) {
      onDateClick(date);
    }
  };

  return (
    <S.CalendarCellStyled
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      $isClickable={isClickable}
      onClick={handleCellClick}
    >
      <S.DateContainer>
        <S.DateNumber>{date.getDate()}</S.DateNumber>
      </S.DateContainer>

      <S.EventsContainer>
        {/* 범위 이벤트 먼저 표시 */}
        {sortedRangeEvents
          .slice(0, visibleCount)
          .map(({ event, rangeInfo }, index) => (
            <S.EventRangeIndicator
              key={`range-${event.id || index}`}
              $isStart={rangeInfo.isStart}
              $isEnd={rangeInfo.isEnd}
              $color={getEventColor(event.type)}
              $hasText={rangeInfo.isStart}
            >
              {rangeInfo.isStart ? formatTitlePreview(event.title) : ''}
            </S.EventRangeIndicator>
          ))}
        {/* 남은 공간에 일반 이벤트 표시 */}
        {sortedRegularEvents
          .slice(0, Math.max(0, visibleCount - sortedRangeEvents.length))
          .map((event, index) => (
            <S.EventRangeIndicator
              key={`event-${event.id || index}`}
              $isStart={true}
              $isEnd={true}
              $color={getEventColor(event.type)}
              $hasText={true}
            >
              {formatTitlePreview(event.title)}
            </S.EventRangeIndicator>
          ))}
      </S.EventsContainer>
    </S.CalendarCellStyled>
  );
};

export default CalendarCell;
