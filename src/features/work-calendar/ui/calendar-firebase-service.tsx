import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase';

const USERS_COLLECTION = 'users';

// 타입 정의
export interface EventData {
  id?: string;
  title: string;
  type: string;
  content: string;
  startDate: string;
  endDate: string;
  dateKey: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EventsData {
  [dateKey: string]: EventData[];
}

// 날짜 키 포맷 (Firestore 저장용)
export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 데이터 로드 함수
export const loadCalendarData = async (userId: string) => {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다');
  }

  try {
    // 이벤트 데이터 가져오기
    const eventsCollection = collection(
      db,
      USERS_COLLECTION,
      userId,
      'calendarEvents'
    );
    const eventsSnapshot = await getDocs(eventsCollection);

    const { eventsData, allEvents } = eventsSnapshot.docs.reduce(
      (acc, doc) => {
        const eventData = doc.data() as EventData;

        const dateKey =
          eventData.dateKey || formatDateKey(new Date(eventData.startDate));

        const eventWithId = {
          ...eventData,
          id: doc.id,
        };

        if (!acc.eventsData[dateKey]) {
          acc.eventsData[dateKey] = [];
        }
        acc.eventsData[dateKey].push(eventWithId);

        acc.allEvents.push(eventWithId);

        return acc;
      },
      { eventsData: {} as EventsData, allEvents: [] as EventData[] }
    );

    return { eventsData, allEvents };
  } catch (error) {
    console.error('캘린더 데이터 로드 중 오류:', error);
    throw error;
  }
};

// 이벤트 추가 함수
export const addEvent = async (userId: string, eventData: EventData) => {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다');
  }

  try {
    const eventsCollectionRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      'calendarEvents'
    );

    const newEventRef = await addDoc(eventsCollectionRef, {
      ...eventData,
      createdAt: Timestamp.now(),
    });

    return {
      ...eventData,
      id: newEventRef.id,
    };
  } catch (error) {
    console.error('이벤트 추가 중 오류:', error);
    throw error;
  }
};

// 이벤트 업데이트 함수
export const updateEvent = async (
  userId: string,
  eventId: string,
  eventData: EventData
) => {
  if (!userId || !eventId) {
    throw new Error('사용자 ID와 이벤트 ID가 필요합니다');
  }

  try {
    await updateDoc(
      doc(db, USERS_COLLECTION, userId, 'calendarEvents', eventId),
      {
        ...eventData,
        updatedAt: Timestamp.now(),
      }
    );

    return {
      ...eventData,
      id: eventId,
    };
  } catch (error) {
    console.error('이벤트 업데이트 중 오류:', error);
    throw error;
  }
};

// 이벤트 삭제 함수
export const deleteEvent = async (userId: string, eventId: string) => {
  if (!userId || !eventId) {
    throw new Error('사용자 ID와 이벤트 ID가 필요합니다');
  }

  try {
    await deleteDoc(
      doc(db, USERS_COLLECTION, userId, 'calendarEvents', eventId)
    );
    return { success: true };
  } catch (error) {
    console.error('이벤트 삭제 중 오류:', error);
    throw error;
  }
};

// 특정 월의 모든 이벤트 삭제 함수
export const deleteEventsForMonth = async (
  userId: string,
  year: number,
  month: number
) => {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다');
  }

  try {
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 날짜 형식 변환 (YYYY-MM-DD)
    const firstDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
    const lastDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

    const eventsCollectionRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      'calendarEvents'
    );

    // 이벤트 쿼리 - 시작일이 현재 달에 속하는 이벤트만 필터링
    const eventsQuery = query(
      eventsCollectionRef,
      where('startDate', '>=', firstDayFormatted),
      where('startDate', '<=', lastDayFormatted)
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    // 삭제될 이벤트 ID 목록
    const deletedIds: string[] = [];

    // 이벤트 삭제
    const deletePromises = eventsSnapshot.docs.map((document) => {
      const deletePromise = deleteDoc(
        doc(db, USERS_COLLECTION, userId, 'calendarEvents', document.id)
      );
      deletedIds.push(document.id);
      return deletePromise;
    });

    await Promise.all(deletePromises);

    return { deletedIds };
  } catch (error) {
    console.error('월별 이벤트 삭제 중 오류:', error);
    throw error;
  }
};
