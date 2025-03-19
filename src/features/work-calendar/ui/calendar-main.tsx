import React, { useState, useEffect } from 'react';
import CalendarCell from './calendar-cell';
import CalendarModal from './calendar-modal';
import CalendarHeader from './calendar-header';
import ConfirmationModal from './confirmation-modal';
import EventListModal from './event-list-modal';
import { toast } from 'react-toastify';
import * as S from '../styles/calendar-main.styles';
import loadingAnimation from '@/assets/animations/loading.json';

// Firebase 임포트
import { db } from '@/firebase';
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

import { auth } from '../../../firebase';
import Lottie from 'lottie-react';

const USERS_COLLECTION = 'users';

// 타입 정의
interface EventData {
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

interface EventsData {
  [dateKey: string]: EventData[];
}

// 날짜 범위에 있는 이벤트를 표시하기 위한 인터페이스
interface DateEventInfo {
  event: EventData;
  isStart: boolean;
  isEnd: boolean;
}

const CalendarMain: React.FC = () => {
  // 현재 표시중인 년월을 저장하는 상태 (달력 헤더에 표시되는 날짜)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // 사용자가 선택한 날짜를 저장하는 상태 (클릭한 날짜 셀)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 일정 추가/편집 모달의 열림/닫힘 상태
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // 일정 제목 입력값 (모달 내 제목 입력 필드)
  const [titleText, setTitleText] = useState<string>('');
  // 일정 내용 입력값 (모달 내 상세 내용 입력 필드)
  const [contentText, setContentText] = useState<string>('');
  // 모든 이벤트 데이터를 날짜별로 저장하는 객체
  // 키는 "YYYY-M-D" 형식의 날짜 문자열, 값은 해당 날짜의 이벤트 데이터 배열
  const [events, setEvents] = useState<EventsData>({});
  // 일정 유형 선택값 (회의(1), 출장(2), 휴가(3) 등)
  const [eventType, setEventType] = useState<string>('');
  // 일정 시작일 (YYYY-MM-DD 형식)
  const [startDate, setStartDate] = useState<string>('');
  // 일정 종료일 (YYYY-MM-DD 형식)
  const [endDate, setEndDate] = useState<string>('');
  // 현재 모달이 새 일정 작성 모드인지(true), 기존 일정 수정 모드인지(false) 구분
  const [isNewEvent, setIsNewEvent] = useState<boolean>(true);
  // 일정 삭제 확인 모달의 열림/닫힘 상태
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  // 데이터 로딩 중 상태 표시
  // true일 때 로딩 인디케이터 표시, Firebase 데이터 요청 중에 활성화됨
  const [loading, setLoading] = useState<boolean>(true);
  // 전체 삭제 모드인지(true), 개별 일정 삭제 모드인지(false) 구분
  // "모든 일정 삭제" 버튼 클릭 시 true로 설정됨
  const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);
  // 현재 선택된 이벤트 (이벤트 수정 시 사용)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  // 이벤트 목록 모달 표시 여부
  const [showEventList, setShowEventList] = useState<boolean>(false);
  // 현재 사용자 ID 상태
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // 전체 이벤트 데이터 (시작일과 종료일 기준 범위 계산용)
  const [allEventsData, setAllEventsData] = useState<EventData[]>([]);

  // 한 달의 일수 계산
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 해당 월의 첫 날의 요일 구하기
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // 오늘 날짜인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 날짜 키 포맷 (Firestore 저장용)
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // 달력 그리드에 표시할 날짜 배열 생성
  const generateCalendarDays = (): {
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

  // 이전 달로 이동
  const prevMonth = (): void => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prev.getMonth() - 1);
      return prevMonth;
    });
  };

  // 다음 달로 이동
  const nextMonth = (): void => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(prev.getMonth() + 1);
      return nextMonth;
    });
  };

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid);
    } else {
      console.error('로그인이 필요합니다');
    }
  }, []);

  // Firebase에서 데이터 로드하기
  const loadCalendarData = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      // 이벤트 데이터 가져오기
      const eventsCollection = collection(
        db,
        USERS_COLLECTION,
        currentUserId,
        'calendarEvents'
      );
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData: EventsData = {};
      const allEvents: EventData[] = [];

      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data() as EventData;
        // dateKey를 기준으로 사용
        const dateKey =
          eventData.dateKey || formatDateKey(new Date(eventData.startDate));

        if (!eventsData[dateKey]) {
          eventsData[dateKey] = [];
        }

        const eventWithId = {
          ...eventData,
          id: doc.id,
        };

        eventsData[dateKey].push(eventWithId);
        allEvents.push(eventWithId);
      });

      setEvents(eventsData);
      setAllEventsData(allEvents);
    } catch (error) {
      console.error('캘린더 데이터 로드 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 Firebase에서 데이터 로드
  useEffect(() => {
    if (currentUserId) {
      loadCalendarData();
    }
  }, [currentUserId]);

  // 새 일정 추가 버튼 핸들러 - 항상 새 일정 모드로 설정
  const handleAddTask = (date: Date): void => {
    setSelectedDate(date);
    setSelectedEvent(null);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // 항상 새 일정 모드로 설정
    setIsNewEvent(true);

    // 폼 초기화
    setTitleText('');
    setContentText('');
    setEventType('');
    setStartDate(formattedDate);
    setEndDate(formattedDate);

    setShowEventList(false);
    setModalOpen(true);
  };

  // 특정 날짜에 표시할 이벤트 정보 계산 (날짜 범위 포함)
  const getEventsForDate = (date: Date): DateEventInfo[] => {
    const result: DateEventInfo[] = [];
    const currentDateNoTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dateTimestamp = currentDateNoTime.getTime();

    allEventsData.forEach((event) => {
      if (event.startDate && event.endDate) {
        const startDateParts = event.startDate.split('-').map(Number);
        const endDateParts = event.endDate.split('-').map(Number);

        const startDate = new Date(
          startDateParts[0],
          startDateParts[1] - 1,
          startDateParts[2]
        );
        const endDate = new Date(
          endDateParts[0],
          endDateParts[1] - 1,
          endDateParts[2]
        );

        const startTimestamp = startDate.getTime();
        const endTimestamp = endDate.getTime();

        // 현재 날짜가 시작일과 종료일 사이에 있는지 확인 (이벤트 기간내에 있는지 확인)
        if (dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp) {
          result.push({
            event,
            isStart: dateTimestamp === startTimestamp,
            isEnd: dateTimestamp === endTimestamp,
          });
        }
      }
    });

    return result;
  };

  // 날짜 클릭 핸들러(모달 열기) - 기존 일정이 있으면 이벤트 목록 모달, 없으면 새 일정 모드
  const handleDateClick = (date: Date): void => {
    const dateKey = formatDateKey(date);
    const dateEvents = events[dateKey] || [];

    // 날짜 범위에 포함된 이벤트 확인
    const eventsInRange = getEventsForDate(date);
    const allDateEvents = [...dateEvents];

    // dateKey에 없지만 날짜 범위에 포함된 이벤트 추가
    eventsInRange.forEach((item) => {
      if (!allDateEvents.some((e) => e.id === item.event.id)) {
        allDateEvents.push(item.event);
      }
    });

    setSelectedDate(date);

    if (allDateEvents.length > 0) {
      // 이벤트가 있으면 이벤트 목록 모달 열기
      setShowEventList(true);
    } else {
      // 이벤트가 없으면 새 일정 추가 모달 열기
      handleAddTask(date);
    }
  };

  // 이벤트 선택 핸들러 - 선택한 이벤트 편집 모달 열기
  const handleEventSelect = (event: EventData): void => {
    setSelectedEvent(event);
    setIsNewEvent(false);

    setTitleText(event.title || '');
    setContentText(event.content || '');
    setEventType(event.type || '');
    setStartDate(event.startDate || '');
    setEndDate(event.endDate || '');

    setShowEventList(false);
    setModalOpen(true);
  };

  // 이벤트 목록 모달 닫기
  const closeEventList = (): void => {
    setShowEventList(false);
  };

  // 일정 모달 닫기
  const closeModal = (): void => {
    setModalOpen(false);
  };

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
      const startEventsInRange = getEventsForDate(startDateObj);
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
        const endEventsInRange = getEventsForDate(endDateObj);
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
            const curEventsInRange = getEventsForDate(new Date(currentDate));
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
        title: titleText,
        type: eventType,
        content: contentText,
        startDate: startDate,
        endDate: endDate,
        dateKey: dateKey,
      };

      const eventsCollectionRef = collection(
        db,
        USERS_COLLECTION,
        currentUserId,
        'calendarEvents'
      );

      // 업데이트된 이벤트 상태
      const updatedEvents = { ...events };
      const updatedAllEvents = [...allEventsData];

      if (isNewEvent) {
        // 새 이벤트 추가
        const newEventRef = await addDoc(eventsCollectionRef, {
          ...eventData,
          createdAt: Timestamp.now(),
        });

        const newEvent = {
          ...eventData,
          id: newEventRef.id,
        };

        // 해당 날짜 배열이 없으면 초기화
        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = [];
        }

        // 상태 업데이트 - 배열에 새 이벤트 추가
        updatedEvents[dateKey].push(newEvent);
        updatedAllEvents.push(newEvent);
      } else if (selectedEvent && selectedEvent.id) {
        // 기존 이벤트 업데이트
        await updateDoc(
          doc(
            db,
            USERS_COLLECTION,
            currentUserId,
            'calendarEvents',
            selectedEvent.id
          ),
          {
            ...eventData,
            updatedAt: Timestamp.now(),
          }
        );

        const updatedEvent = {
          ...eventData,
          id: selectedEvent.id,
        };

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
  };

  // 전체 삭제 버튼 클릭 핸들러
  const handleClearAllClick = (): void => {
    setIsDeleteAll(true);
    setConfirmModalOpen(true);
  };

  // 모든 데이터 삭제
  const clearAllData = async (): Promise<void> => {
    if (!currentUserId) return;

    setLoading(true);

    try {
      // 현재 표시중인 달의 시작일과 끝일 계산
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);

      // 날짜 형식 변환 (YYYY-MM-DD)
      const firstDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
      const lastDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

      const eventsCollectionRef = collection(
        db,
        USERS_COLLECTION,
        currentUserId,
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
      for (const document of eventsSnapshot.docs) {
        await deleteDoc(
          doc(
            db,
            USERS_COLLECTION,
            currentUserId,
            'calendarEvents',
            document.id
          )
        );
        deletedIds.push(document.id);
      }

      // 이벤트 상태 업데이트 (현재 달의 데이터만 제거)
      const updatedEvents = { ...events };

      Object.keys(updatedEvents).forEach((dateKey) => {
        const [eventYear, eventMonth] = dateKey.split('-').map(Number);
        if (eventYear === year && eventMonth === month + 1) {
          delete updatedEvents[dateKey];
        }
      });

      // 전체 이벤트 목록에서도 삭제
      const updatedAllEvents = allEventsData.filter(
        (event) => !deletedIds.includes(event.id || '')
      );

      setEvents(updatedEvents);
      setAllEventsData(updatedAllEvents);
    } catch (error) {
      console.error('Firebase에서 현재 달의 데이터 삭제 중 오류:', error);
    } finally {
      setLoading(false);
      setConfirmModalOpen(false);
      setIsDeleteAll(false);
    }
  };
  const handleDeleteClick = (): void => {
    setConfirmModalOpen(true);
    setModalOpen(false);
  };

  // 확인 모달 취소 핸들러
  const handleCancelDelete = (): void => {
    setConfirmModalOpen(false);
    setIsDeleteAll(false);
    // 개별 삭제였을 경우 모달 다시 열기
    if (!isDeleteAll && selectedDate) {
      setModalOpen(true);
    }
  };

  // 확인 모달 확인 핸들러
  const confirmDelete = async (): Promise<void> => {
    if (!currentUserId) return;

    if (isDeleteAll) {
      // 전체 삭제 실행
      await clearAllData();
    } else if (selectedEvent && selectedEvent.id) {
      // 개별 일정 삭제 로직
      setLoading(true);

      try {
        const dateKey = selectedEvent.dateKey;

        // Firebase에서 삭제
        await deleteDoc(
          doc(
            db,
            USERS_COLLECTION,
            currentUserId,
            'calendarEvents',
            selectedEvent.id
          )
        );

        // 상태 업데이트 - 배열에서 해당 이벤트만 제거
        const updatedEvents = { ...events };
        if (updatedEvents[dateKey]) {
          updatedEvents[dateKey] = updatedEvents[dateKey].filter(
            (event) => event.id !== selectedEvent.id
          );

          // 배열이 비어있으면 키 자체를 제거
          if (updatedEvents[dateKey].length === 0) {
            delete updatedEvents[dateKey];
          }
        }

        // 전체 이벤트 목록에서도 삭제
        const updatedAllEvents = allEventsData.filter(
          (event) => event.id !== selectedEvent.id
        );

        setEvents(updatedEvents);
        setAllEventsData(updatedAllEvents);
      } catch (error) {
        console.error('Firebase에서 데이터 삭제 중 오류:', error);
      } finally {
        setLoading(false);
        setConfirmModalOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  // 달력 일 계산
  const calendarDays = generateCalendarDays();

  // 요일 이름 배열
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    if (modalOpen) {
      // 모달이 열리면 timeout을 이용해 overflow: hidden 속성을 덮어씀
      const timer = setTimeout(() => {
        document.body.style.overflow = 'scroll';
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [modalOpen]);

  return (
    <S.PageContainer $isModalOpen={modalOpen}>
      <S.Title>업무관리</S.Title>
      <div style={{ width: '1240px', overflow: 'hidden' }}>
        <S.CalendarContainer $isModalOpen={modalOpen}>
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onAddTask={handleAddTask}
            onClearAll={handleClearAllClick}
          />

          <S.WeekdaysContainer>
            {weekdays.map((day, index) => (
              <S.Weekday key={index}>{day}</S.Weekday>
            ))}
          </S.WeekdaysContainer>

          {loading ? (
            <S.LoadingContainer>
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: '180px', height: '180px' }}
              />
            </S.LoadingContainer>
          ) : (
            <S.CalendarGrid>
              {calendarDays.map((dayData, index) => {
                const dateKey = formatDateKey(dayData.date);
                const dateEvents = events[dateKey] || [];

                // 날짜 범위에 포함된 이벤트 확인
                const eventsInRange = getEventsForDate(dayData.date);

                // 표시할 이벤트 데이터 만들기
                const displayEvents = [...dateEvents];

                // dateKey에 없지만 날짜 범위에 포함된 이벤트 추가
                eventsInRange.forEach((item) => {
                  const eventExists = displayEvents.some(
                    (e) => e.id === item.event.id
                  );
                  if (!eventExists) {
                    displayEvents.push(item.event);
                  }
                });

                // 날짜 범위 정보 (시작일, 종료일)
                const rangeInfo = eventsInRange.map((item) => ({
                  eventId: item.event.id,
                  isStart: item.isStart,
                  isEnd: item.isEnd,
                  type: item.event.type,
                }));

                return (
                  <CalendarCell
                    key={index}
                    date={dayData.date}
                    isCurrentMonth={dayData.isCurrentMonth}
                    isToday={isToday(dayData.date)}
                    events={displayEvents}
                    rangeInfo={rangeInfo}
                    onDateClick={handleDateClick}
                  />
                );
              })}
            </S.CalendarGrid>
          )}
        </S.CalendarContainer>
      </div>

      {/* 이벤트 목록 모달 */}
      {showEventList && selectedDate && (
        <EventListModal
          isOpen={showEventList}
          selectedDate={selectedDate}
          events={getEventsForDate(selectedDate).map((item) => item.event)}
          onSelectEvent={handleEventSelect}
          onAddNewEvent={handleAddTask}
          onClose={closeEventList}
        />
      )}

      {/* 일정 추가/편집 모달 */}
      {modalOpen && (
        <CalendarModal
          isOpen={modalOpen}
          selectedDate={selectedDate}
          titleText={titleText}
          contentText={contentText}
          eventType={eventType}
          startDate={startDate}
          endDate={endDate}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onEventTypeChange={handleEventTypeChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onSave={saveEvent}
          onClose={closeModal}
          isNewEvent={isNewEvent}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
        title={
          isDeleteAll
            ? `${currentDate.getMonth() + 1}월 일정을 삭제하시겠습니까?`
            : '일정을 삭제하시겠습니까?'
        }
        message=""
      />
    </S.PageContainer>
  );
};

export default CalendarMain;
