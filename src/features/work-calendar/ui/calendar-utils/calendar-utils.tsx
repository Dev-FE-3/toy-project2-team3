import { theme } from '@/shared/config/theme';

// 이벤트 타입 이름 가져오기
export const getEventTypeName = (typeValue: string): string => {
  switch (typeValue) {
    case '1':
      return '회의';
    case '2':
      return '출장';
    case '3':
      return '휴가';
    default:
      return '';
  }
};

// 이벤트 타입 색상 가져오기
export const getEventTypeColor = (typeValue: string): string => {
  switch (typeValue) {
    case '1':
      return theme.colors.orange;
    case '2':
      return theme.colors.red;
    case '3':
      return theme.colors.green;
    default:
      return theme.colors.grey1;
  }
};

// 날짜 형식 변환 (YYYY-MM-DD -> YYYY년 MM월 DD일)
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-');
  return `${year}년 ${month}월 ${day}일`;
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
