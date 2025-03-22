// src/hooks/useCalendarFirebase.ts
import { useState, useCallback } from 'react';
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
  DocumentData,
  QueryDocumentSnapshot,
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

interface CalendarResult {
  eventsData: EventsData;
  allEvents: EventData[];
}

interface DeleteResult {
  deletedIds: string[];
}

// 날짜 키 포맷 (Firestore 저장용)
export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 데이터 로드 훅
export const useLoadCalendarData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CalendarResult | null>(null);

  const loadCalendarData = useCallback(
    async (userId: string): Promise<CalendarResult | null> => {
      if (!userId) {
        const err = new Error('사용자 ID가 필요합니다');
        setError(err);
        throw err;
      }

      setLoading(true);
      setError(null);

      try {
        // 이벤트 데이터 가져오기
        const eventsCollection = collection(
          db,
          USERS_COLLECTION,
          userId,
          'calendarEvents'
        );
        const eventsSnapshot = await getDocs(eventsCollection);

        const result = eventsSnapshot.docs.reduce(
          (acc, doc: QueryDocumentSnapshot<DocumentData>) => {
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

        setData(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        console.error('캘린더 데이터 로드 중 오류:', err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    loadCalendarData,
    data,
    loading,
    error,
  };
};

// 이벤트 추가 훅
export const useAddEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [addedEvent, setAddedEvent] = useState<EventData | null>(null);

  const addEvent = useCallback(
    async (userId: string, eventData: EventData): Promise<EventData> => {
      if (!userId) {
        const err = new Error('사용자 ID가 필요합니다');
        setError(err);
        throw err;
      }

      setLoading(true);
      setError(null);

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

        const newEvent = {
          ...eventData,
          id: newEventRef.id,
        };

        setAddedEvent(newEvent);
        setLoading(false);
        return newEvent;
      } catch (error) {
        const err = error as Error;
        console.error('이벤트 추가 중 오류:', err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    addEvent,
    addedEvent,
    loading,
    error,
  };
};

// 이벤트 업데이트 훅
export const useUpdateEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedEvent, setUpdatedEvent] = useState<EventData | null>(null);

  const updateEvent = useCallback(
    async (
      userId: string,
      eventId: string,
      eventData: EventData
    ): Promise<EventData> => {
      if (!userId || !eventId) {
        const err = new Error('사용자 ID와 이벤트 ID가 필요합니다');
        setError(err);
        throw err;
      }

      setLoading(true);
      setError(null);

      try {
        await updateDoc(
          doc(db, USERS_COLLECTION, userId, 'calendarEvents', eventId),
          {
            ...eventData,
            updatedAt: Timestamp.now(),
          }
        );

        const result = {
          ...eventData,
          id: eventId,
        };

        setUpdatedEvent(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        console.error('이벤트 업데이트 중 오류:', err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    updateEvent,
    updatedEvent,
    loading,
    error,
  };
};

// 이벤트 삭제 훅
export const useDeleteEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleteResult, setDeleteResult] = useState<{ success: boolean } | null>(
    null
  );

  const deleteEvent = useCallback(
    async (userId: string, eventId: string): Promise<{ success: boolean }> => {
      if (!userId || !eventId) {
        const err = new Error('사용자 ID와 이벤트 ID가 필요합니다');
        setError(err);
        throw err;
      }

      setLoading(true);
      setError(null);

      try {
        await deleteDoc(
          doc(db, USERS_COLLECTION, userId, 'calendarEvents', eventId)
        );

        const result = { success: true };
        setDeleteResult(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        console.error('이벤트 삭제 중 오류:', err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    deleteEvent,
    deleteResult,
    loading,
    error,
  };
};

// 특정 월의 모든 이벤트 삭제 훅
export const useDeleteEventsForMonth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthDeleteResult, setMonthDeleteResult] =
    useState<DeleteResult | null>(null);

  const deleteEventsForMonth = useCallback(
    async (
      userId: string,
      year: number,
      month: number
    ): Promise<DeleteResult> => {
      if (!userId) {
        const err = new Error('사용자 ID가 필요합니다');
        setError(err);
        throw err;
      }

      setLoading(true);
      setError(null);

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

        const result = { deletedIds };
        setMonthDeleteResult(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        console.error('월별 이벤트 삭제 중 오류:', err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    deleteEventsForMonth,
    monthDeleteResult,
    loading,
    error,
  };
};

// 통합 훅 (선택적으로 사용)
export const useCalendar = (userId: string) => {
  const {
    loadCalendarData,
    data,
    loading: loadingData,
    error: loadError,
  } = useLoadCalendarData();
  const { addEvent, loading: addingEvent, error: addError } = useAddEvent();
  const {
    updateEvent,
    loading: updatingEvent,
    error: updateError,
  } = useUpdateEvent();
  const {
    deleteEvent,
    loading: deletingEvent,
    error: deleteError,
  } = useDeleteEvent();
  const {
    deleteEventsForMonth,
    loading: deletingMonth,
    error: deleteMonthError,
  } = useDeleteEventsForMonth();

  // 모든 로딩 상태 결합
  const loading =
    loadingData ||
    addingEvent ||
    updatingEvent ||
    deletingEvent ||
    deletingMonth;

  // 모든 에러 중 가장 최근 것
  const error =
    deleteMonthError || deleteError || updateError || addError || loadError;

  // 통합 데이터 및 메서드 반환
  return {
    // 원래 함수명 유지
    loadCalendarData: () => loadCalendarData(userId),
    addEvent: (eventData: EventData) => addEvent(userId, eventData),
    updateEvent: (eventId: string, eventData: EventData) =>
      updateEvent(userId, eventId, eventData),
    deleteEvent: (eventId: string) => deleteEvent(userId, eventId),
    deleteEventsForMonth: (year: number, month: number) =>
      deleteEventsForMonth(userId, year, month),

    // 데이터 및 상태
    data,
    loading,
    error,
  };
};
