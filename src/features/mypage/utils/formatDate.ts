import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

export const formatDate = (rawDate?: number | Timestamp) => {
  if (!rawDate) return '날짜 없음';

  // Firebase Timestamp 처리
  if (rawDate instanceof Timestamp) {
    rawDate = rawDate.toDate().getTime();
  }

  return dayjs(rawDate).format('YYYY년 MM월 DD일');
};
