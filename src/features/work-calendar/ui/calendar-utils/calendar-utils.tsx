import { theme } from '@/shared/config/theme';

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
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
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
