import dayjs from 'dayjs';

export const formatDate = (rawDate?: number) => {
  if (!rawDate) return '날짜 없음';
  return dayjs(rawDate).format('YYYY년 MM월 DD일');
};
