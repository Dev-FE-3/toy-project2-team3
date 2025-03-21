import { theme } from '@/shared/config/theme';
import { EventData } from '@/features/work-calendar/ui/calendar-firebase-service';
import dayjs from 'dayjs';

export enum EventType {
  Meeting = '1',
  BusinessTrip = '2',
  Vacation = '3',
}

export const EVENT_TYPE_NAMES: Record<EventType, string> = {
  [EventType.Meeting]: '회의',
  [EventType.BusinessTrip]: '출장',
  [EventType.Vacation]: '휴가',
};

export const getEventTypeName = (typeValue: string): string => {
  return EVENT_TYPE_NAMES[typeValue as EventType] || '';
};

// 날짜 형식 변환 (YYYY-MM-DD -> YYYY년 MM월 DD일)
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';

  try {
    // dayjs로 날짜 파싱 및 포맷팅
    const formatted = dayjs(dateString).format('YYYY년 M월 D일');

    // 유효하지 않은 날짜인 경우 (예: 'Invalid Date')
    if (formatted === 'Invalid Date') {
      return '';
    }

    return formatted;
  } catch (error) {
    console.error('날짜 변환 오류: ', error);
    return '';
  }
};

export const formatTitlePreview = (text: string): string => {
  return text.length > 13 ? text.substring(0, 13) + '...' : text;
};

// 이벤트 색상 가져오기
export const getEventColor = (type: string): string => {
  switch (type) {
    case '1':
      return theme.colors.orange; // 회의
    case '2':
      return theme.colors.red; // 출장
    case '3':
      return theme.colors.green; // 휴가
    default:
      return theme.colors.grey1;
  }
};

// 날짜 범위에 있는 이벤트를 표시하기 위한 인터페이스
export interface DateEventInfo {
  event: EventData;
  isStart: boolean;
  isEnd: boolean;
}

// 한 달의 일수 계산
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 해당 월의 첫 날의 요일 구하기
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// 오늘 날짜인지 확인
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// 특정 날짜에 표시할 이벤트 정보 계산 (날짜 범위 포함)
export const getEventsForDate = (
  date: Date,
  allEventsData: EventData[]
): DateEventInfo[] => {
  const currentDateNoTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const dateTimestamp = currentDateNoTime.getTime();

  // 날짜 변환 헬퍼 함수
  const getDateTimestamp = (dateString: string): number => {
    const dateParts = dateString.split('-').map(Number);
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime();
  };

  return allEventsData
    .filter((event) => {
      if (!event.startDate || !event.endDate) return false;

      const startTimestamp = getDateTimestamp(event.startDate);
      const endTimestamp = getDateTimestamp(event.endDate);

      // 현재 날짜가 시작일과 종료일 사이에 있는지 확인 (이벤트 기간내에 있는지 확인)
      return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
    })
    .map((event) => {
      const startTimestamp = getDateTimestamp(event.startDate);
      const endTimestamp = getDateTimestamp(event.endDate);

      return {
        event,
        isStart: dateTimestamp === startTimestamp,
        isEnd: dateTimestamp === endTimestamp,
      };
    });
};

// 달력 그리드에 표시할 날짜 배열 생성
export const generateCalendarDays = (
  currentDate: Date
): {
  date: Date;
  isCurrentMonth: boolean;
}[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // 이전 달의 마지막 날짜들
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const prevMonthDays: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    prevMonthDays.push({
      date,
      isCurrentMonth: false,
    });
  }

  // 현재 달의 날짜들
  const currentMonthDays: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    currentMonthDays.push({
      date,
      isCurrentMonth: true,
    });
  }

  // 다음 달의 시작 날짜들 (7의 배수가 되도록)
  const nextMonthDays: { date: Date; isCurrentMonth: boolean }[] = [];
  const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
  const daysToAdd = 7 - (totalDaysSoFar % 7);

  if (daysToAdd < 7) {
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push({
        date,
        isCurrentMonth: false,
      });
    }
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};
