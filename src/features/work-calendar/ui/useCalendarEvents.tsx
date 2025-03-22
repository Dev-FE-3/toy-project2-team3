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

// 기존 함수 유지 (훅 내부에서 사용될 함수)
const _loadCalendarData = async (userId: string): Promise<CalendarResult> => {
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

// 데이터 로드 훅 (내부적으로 _loadCalendarData 사용)
export const useLoadCalendarData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CalendarResult | null>(null);

  const loadCalendarData = useCallback(
    async (userId: string): Promise<CalendarResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = await _loadCalendarData(userId);
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

// 기존 함수 그대로 export (외부 컴포넌트에서 직접 사용할 함수)
export const loadCalendarData = async (
  userId: string
): Promise<CalendarResult> => {
  return _loadCalendarData(userId);
};

// 이벤트 추가 함수 (기존 함수 유지)
export const addEvent = async (
  userId: string,
  eventData: EventData
): Promise<EventData> => {
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

// 이벤트 추가 훅 (내부적으로 addEvent 사용)
export const useAddEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [addedEvent, setAddedEvent] = useState<EventData | null>(null);

  const addEventHook = useCallback(
    async (userId: string, eventData: EventData): Promise<EventData> => {
      setLoading(true);
      setError(null);

      try {
        const result = await addEvent(userId, eventData);
        setAddedEvent(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    addEvent: addEventHook,
    addedEvent,
    loading,
    error,
  };
};

// 이벤트 업데이트 함수 (기존 함수 유지)
export const updateEvent = async (
  userId: string,
  eventId: string,
  eventData: EventData
): Promise<EventData> => {
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

// 이벤트 업데이트 훅 (내부적으로 updateEvent 사용)
export const useUpdateEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedEvent, setUpdatedEvent] = useState<EventData | null>(null);

  const updateEventHook = useCallback(
    async (
      userId: string,
      eventId: string,
      eventData: EventData
    ): Promise<EventData> => {
      setLoading(true);
      setError(null);

      try {
        const result = await updateEvent(userId, eventId, eventData);
        setUpdatedEvent(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    updateEvent: updateEventHook,
    updatedEvent,
    loading,
    error,
  };
};

// 이벤트 삭제 함수 (기존 함수 유지)
export const deleteEvent = async (
  userId: string,
  eventId: string
): Promise<{ success: boolean }> => {
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

// 이벤트 삭제 훅 (내부적으로 deleteEvent 사용)
export const useDeleteEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleteResult, setDeleteResult] = useState<{ success: boolean } | null>(
    null
  );

  const deleteEventHook = useCallback(
    async (userId: string, eventId: string): Promise<{ success: boolean }> => {
      setLoading(true);
      setError(null);

      try {
        const result = await deleteEvent(userId, eventId);
        setDeleteResult(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    deleteEvent: deleteEventHook,
    deleteResult,
    loading,
    error,
  };
};

// 특정 월의 모든 이벤트 삭제 함수 (기존 함수 유지)
export const deleteEventsForMonth = async (
  userId: string,
  year: number,
  month: number
): Promise<DeleteResult> => {
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

// 월별 이벤트 삭제 훅 (내부적으로 deleteEventsForMonth 사용)
export const useDeleteEventsForMonth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [monthDeleteResult, setMonthDeleteResult] =
    useState<DeleteResult | null>(null);

  const deleteEventsForMonthHook = useCallback(
    async (
      userId: string,
      year: number,
      month: number
    ): Promise<DeleteResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = await deleteEventsForMonth(userId, year, month);
        setMonthDeleteResult(result);
        setLoading(false);
        return result;
      } catch (error) {
        const err = error as Error;
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    deleteEventsForMonth: deleteEventsForMonthHook,
    monthDeleteResult,
    loading,
    error,
  };
};

// 통합 훅 (선택적으로 사용)
export const useCalendar = (userId: string) => {
  const {
    loadCalendarData: loadDataHook,
    data,
    loading: loadingData,
    error: loadError,
  } = useLoadCalendarData();
  const {
    addEvent: addEventHook,
    loading: addingEvent,
    error: addError,
  } = useAddEvent();
  const {
    updateEvent: updateEventHook,
    loading: updatingEvent,
    error: updateError,
  } = useUpdateEvent();
  const {
    deleteEvent: deleteEventHook,
    loading: deletingEvent,
    error: deleteError,
  } = useDeleteEvent();
  const {
    deleteEventsForMonth: deleteMonthHook,
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
    // 기존 함수명 유지하면서 userId 자동 적용
    loadCalendarData: () => loadDataHook(userId),
    addEvent: (eventData: EventData) => addEventHook(userId, eventData),
    updateEvent: (eventId: string, eventData: EventData) =>
      updateEventHook(userId, eventId, eventData),
    deleteEvent: (eventId: string) => deleteEventHook(userId, eventId),
    deleteEventsForMonth: (year: number, month: number) =>
      deleteMonthHook(userId, year, month),

    // 데이터 및 상태
    data,
    loading,
    error,
  };
};
