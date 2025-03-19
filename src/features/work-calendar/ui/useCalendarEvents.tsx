import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  EventData,
  EventsData,
  formatDateKey,
  addEvent,
  updateEvent,
} from './calendar-firebase-service';
import { getEventsForDate } from './calendar-utils/calendar-utils';

interface UseCalendarEventsProps {
  events: EventsData;
  allEventsData: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventsData>>;
  setAllEventsData: React.Dispatch<React.SetStateAction<EventData[]>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventData | null>>;
  selectedDate: Date | null;
  currentUserId: string | null;
}

interface UseCalendarEventsReturn {
  titleText: string;
  contentText: string;
  eventType: string;
  startDate: string;
  endDate: string;
  handleTitleChange: (text: string) => void;
  handleContentChange: (text: string) => void;
  handleEventTypeChange: (type: string) => void;
  handleStartDateChange: (date: string) => void;
  handleEndDateChange: (date: string) => void;
  saveEvent: () => Promise<void>;
  loading: boolean;
  initializeForm: (date: Date) => void;
  setEventData: (event: EventData) => void;
}

export const useCalendarEvents = ({
  events,
  allEventsData,
  setEvents,
  setAllEventsData,
  setModalOpen,
  setSelectedEvent,
  selectedDate,
  currentUserId,
}: UseCalendarEventsProps): UseCalendarEventsReturn => {
  // 상태 관리
  const [titleText, setTitleText] = useState<string>('');
  const [contentText, setContentText] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isNewEvent, setIsNewEvent] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  // 제목 텍스트 변경 핸들러
  const handleTitleChange = (text: string): void => {
    setTitleText(text);
  };

  // 내용 텍스트 변경 핸들러
  const handleContentChange = (text: string): void => {
    setContentText(text);
  };

  // 이벤트 타입 변경 핸들러
  const handleEventTypeChange = (type: string): void => {
    setEventType(type);
  };

  // 시작일 변경 핸들러
  const handleStartDateChange = (date: string): void => {
    setStartDate(date);
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (date: string): void => {
    setEndDate(date);
  };

  // 특정 날짜에 표시할 이벤트 정보 계산 (날짜 범위 포함)
  const getEventsForSelectedDate = (date: Date) => {
    return getEventsForDate(date, allEventsData);
  };

  // Firebase에 이벤트 저장
  const saveEvent = async (): Promise<void> => {
    if (!currentUserId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // 필수값 검증
    if (!titleText.trim()) {
      toast.error('일정 제목을 입력해주세요.');
      return;
    }

    if (!eventType) {
      toast.error('일정 유형을 선택해주세요.');
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        toast.error('종료일은 시작일보다 이후여야 합니다.');
        return;
      }
    }

    if (!selectedDate) {
      return;
    }

    // 시작일 기준으로 dateKey 생성
    let dateKey;
    if (startDate) {
      const startDateObj = new Date(startDate);
      dateKey = formatDateKey(startDateObj);
    } else {
      dateKey = formatDateKey(selectedDate);
    }

    // 새 일정 추가 시 일정 개수 제한 체크
    if (isNewEvent) {
      const startDateObj = new Date(startDate);
      const startDateKey = formatDateKey(startDateObj);
      const startDateEvents = events[startDateKey] || [];
      const startEventsInRange = getEventsForSelectedDate(startDateObj);

      // 이벤트 ID를 기반으로 중복 제거
      const uniqueEventIds = new Set<string>();
      startDateEvents.forEach(
        (event) => event.id && uniqueEventIds.add(event.id)
      );
      startEventsInRange.forEach(
        (item) => item.event.id && uniqueEventIds.add(item.event.id)
      );
      const totalStartEvents = uniqueEventIds.size;

      if (totalStartEvents >= 3) {
        toast.error(
          `시작일(${startDate})에 이미 3개의 일정이 있어 추가할 수 없습니다.`
        );
        return;
      }

      if (endDate !== startDate) {
        const endDateObj = new Date(endDate);
        const endDateKey = formatDateKey(endDateObj);
        const endDateEvents = events[endDateKey] || [];
        const endEventsInRange = getEventsForSelectedDate(endDateObj);
        const totalEndEvents = endDateEvents.length + endEventsInRange.length;

        if (totalEndEvents >= 3) {
          toast.error(
            `종료일(${endDate})에 이미 3개의 일정이 있어 추가할 수 없습니다.`
          );
          return;
        }

        // 시작일과 종료일 사이의 모든 날짜 체크
        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentDate = new Date(start);

        while (currentDate <= end) {
          if (
            formatDateKey(currentDate) !== startDateKey &&
            formatDateKey(currentDate) !== formatDateKey(end)
          ) {
            const curDateKey = formatDateKey(currentDate);
            const curDateEvents = events[curDateKey] || [];
            const curEventsInRange = getEventsForSelectedDate(
              new Date(currentDate)
            );
            const totalCurEvents =
              curDateEvents.length + curEventsInRange.length;

            if (totalCurEvents >= 3) {
              const curDateFormatted = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(
                2,
                '0'
              )}-${String(currentDate.getDate()).padStart(2, '0')}`;
              toast.error(
                `일정 범위 내 날짜(${curDateFormatted})에 이미 3개의 일정이 있어 추가할 수 없습니다`
              );
              return;
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    setLoading(true);

    try {
      // 이벤트 데이터 생성
      const eventData: EventData = {
        id: eventId,
        title: titleText,
        type: eventType,
        content: contentText,
        startDate: startDate,
        endDate: endDate,
        dateKey: dateKey,
      };

      // 업데이트된 이벤트 상태
      const updatedEvents = { ...events };
      const updatedAllEvents = [...allEventsData];

      if (isNewEvent) {
        // 새 이벤트 추가
        const newEvent = await addEvent(currentUserId, eventData);

        // 해당 날짜 배열이 없으면 초기화
        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = [];
        }

        // 상태 업데이트 - 배열에 새 이벤트 추가
        updatedEvents[dateKey].push(newEvent);
        updatedAllEvents.push(newEvent);
      } else {
        const selectedEvent = updatedAllEvents.find(
          (event) => event.id === eventData.id
        );

        if (selectedEvent && selectedEvent.id) {
          // 기존 이벤트 업데이트
          const updatedEvent = await updateEvent(
            currentUserId,
            selectedEvent.id,
            eventData
          );

          // 이전 dateKey에서 이벤트 제거
          const oldDateKey = selectedEvent.dateKey;
          if (updatedEvents[oldDateKey]) {
            updatedEvents[oldDateKey] = updatedEvents[oldDateKey].filter(
              (event) => event.id !== selectedEvent.id
            );

            // 배열이 비어있으면 키 자체를 제거
            if (updatedEvents[oldDateKey].length === 0) {
              delete updatedEvents[oldDateKey];
            }
          }

          // 새 dateKey에 이벤트 추가
          if (!updatedEvents[dateKey]) {
            updatedEvents[dateKey] = [];
          }

          updatedEvents[dateKey].push(updatedEvent);

          // 전체 이벤트 목록에서도 업데이트
          const eventIndex = updatedAllEvents.findIndex(
            (e) => e.id === selectedEvent.id
          );
          if (eventIndex !== -1) {
            updatedAllEvents[eventIndex] = updatedEvent;
          }
        }
      }

      // 상태 업데이트
      setEvents(updatedEvents);
      setAllEventsData(updatedAllEvents);
    } catch (error) {
      console.error('Firebase에 데이터 저장 중 오류:', error);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setSelectedEvent(null);
    }

    useEffect(() => {
      if (!loading) {
        setRefreshKey((prev) => prev + 1);
      }
    }, [loading]);
  };

  // 폼 초기화 함수
  const initializeForm = (date: Date): void => {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    setTitleText('');
    setContentText('');
    setEventType('');
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    setIsNewEvent(true);
  };

  // 이벤트 데이터 설정 함수
  const setEventData = (event: EventData): void => {
    setTitleText(event.title || '');
    setContentText(event.content || '');
    setEventType(event.type || '');
    setStartDate(event.startDate || '');
    setEndDate(event.endDate || '');
    setIsNewEvent(false);
    setEventId(event.id);
  };

  // 반환 객체에 새 함수들 추가
  return {
    titleText,
    contentText,
    eventType,
    startDate,
    endDate,
    handleTitleChange,
    handleContentChange,
    handleEventTypeChange,
    handleStartDateChange,
    handleEndDateChange,
    saveEvent,
    loading,
    initializeForm,
    setEventData,
  };
};
