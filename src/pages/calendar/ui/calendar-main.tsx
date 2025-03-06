import React, { useState, useEffect } from 'react';
import CalendarCell from './calendar-cell';
import CalendarModal from './calendar-modal';
import CalendarHeader from './calendar-header';
import ConfirmationModal from './confirmation-modal';

import {
  PageContainer,
  Title,
  CalendarContainer,
  WeekdaysContainer,
  Weekday,
  CalendarGrid,
} from '../styles/calendar-main.styles';

// Firebase 임포트
import { db } from '../../../firebase';
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
  [dateKey: string]: EventData;
}

// Firebase 컬렉션 이름
const EVENTS_COLLECTION = 'calendarEvents';

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
  // 키는 "YYYY-M-D" 형식의 날짜 문자열, 값은 해당 날짜의 이벤트 데이터
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

  // Firebase에서 데이터 로드하기
  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // 이벤트 데이터 가져오기
      const eventsSnapshot = await getDocs(collection(db, EVENTS_COLLECTION));
      const eventsData: EventsData = {};

      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data() as EventData;
        // dateKey를 기준으로 사용
        const dateKey =
          eventData.dateKey || formatDateKey(new Date(eventData.startDate));

        eventsData[dateKey] = {
          ...eventData,
          id: doc.id,
        };
      });

      setEvents(eventsData);
    } catch (error) {
      console.error('캘린더 데이터 로드 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 Firebase에서 데이터 로드
  useEffect(() => {
    loadCalendarData();
  }, []);

  // 새 일정 추가 버튼 핸들러 - 항상 새 일정 모드로 설정
  const handleAddTask = (date: Date): void => {
    setSelectedDate(date);
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

    setModalOpen(true);
  };

  // 날짜 클릭 핸들러(모달 열기) - 기존 일정이 있으면 수정 모드, 없으면 새 일정 모드
  const handleDateClick = (date: Date): void => {
    const dateKey = formatDateKey(date);

    // 해당 날짜에 이벤트가 있는지 확인
    const hasEvent = events[dateKey];

    // 이벤트가 있는 경우에만 모달 열기
    if (hasEvent) {
      setSelectedDate(date);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      setIsNewEvent(false);

      setTitleText(hasEvent.title || '');
      setContentText(hasEvent.content || '');
      setEventType(hasEvent.type || '');
      setStartDate(hasEvent.startDate || formattedDate);
      setEndDate(hasEvent.endDate || formattedDate);

      setModalOpen(true);
    }
    // 이벤트가 없는 경우는 아무 동작도 하지 않음
  };

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
    // 필수값 검증
    if (!titleText.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }

    if (!eventType) {
      alert('일정 유형을 선택해주세요.');
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        alert('종료일은 시작일보다 이후여야 합니다.');
        return;
      }
    }

    if (selectedDate) {
      setLoading(true);

      try {
        // 선택된 날짜 대신 시작일을 기준으로 dateKey 생성
        let dateKey;

        if (startDate) {
          // 시작일이 있으면 그 날짜의 키를 생성
          const startDateObj = new Date(startDate);
          dateKey = formatDateKey(startDateObj);
        } else {
          // 시작일이 없으면 선택된 날짜의 키를 사용
          dateKey = formatDateKey(selectedDate);
        }

        const updatedEvents = { ...events };

        // 이벤트 데이터 생성
        const eventData: EventData = {
          title: titleText,
          type: eventType,
          content: contentText,
          startDate: startDate,
          endDate: endDate,
          dateKey: dateKey, // dateKey 추가
        };

        // 기존 이벤트가 있는지 확인
        const eventQuery = query(
          collection(db, EVENTS_COLLECTION),
          where('dateKey', '==', dateKey)
        );
        const eventSnapshot = await getDocs(eventQuery);

        // 이벤트 저장 또는 업데이트
        if (!eventSnapshot.empty) {
          // 기존 이벤트 업데이트
          const eventDoc = eventSnapshot.docs[0];
          await updateDoc(doc(db, EVENTS_COLLECTION, eventDoc.id), {
            ...eventData,
            updatedAt: Timestamp.now(),
          });

          // 상태 업데이트
          updatedEvents[dateKey] = {
            ...eventData,
            id: eventDoc.id,
          };
        } else {
          // 새 이벤트 추가
          const newEventRef = await addDoc(collection(db, EVENTS_COLLECTION), {
            ...eventData,
            createdAt: Timestamp.now(),
          });

          // 상태 업데이트
          updatedEvents[dateKey] = {
            ...eventData,
            id: newEventRef.id,
          };
        }

        // 상태 업데이트
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Firebase에 데이터 저장 중 오류:', error);
      } finally {
        setLoading(false);
        setModalOpen(false);
      }
    }
  };

  // 이벤트 타입 이름 가져오기
  const getEventTypeName = (typeValue: string): string => {
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

  // 전체 삭제 버튼 클릭 핸들러
  const handleClearAllClick = (): void => {
    setIsDeleteAll(true);
    setConfirmModalOpen(true);
  };

  // 모든 데이터 삭제
  const clearAllData = async (): Promise<void> => {
    setLoading(true);

    try {
      // 현재 표시중인 달의 시작일과 끝일 계산
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);

      // 날짜 형식 변환 (YYYY-MM-DD)
      const firstDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
      const lastDayFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

      // 이벤트 쿼리 - 시작일이 현재 달에 속하는 이벤트만 필터링
      const eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('startDate', '>=', firstDayFormatted),
        where('startDate', '<=', lastDayFormatted)
      );
      const eventsSnapshot = await getDocs(eventsQuery);

      // 이벤트 삭제
      for (const document of eventsSnapshot.docs) {
        await deleteDoc(doc(db, EVENTS_COLLECTION, document.id));
      }

      // 이벤트 상태 업데이트 (현재 달의 데이터만 제거)
      const updatedEvents = { ...events };

      Object.keys(updatedEvents).forEach((dateKey) => {
        const [eventYear, eventMonth] = dateKey.split('-').map(Number);
        if (eventYear === year && eventMonth === month + 1) {
          delete updatedEvents[dateKey];
        }
      });

      setEvents(updatedEvents);
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
    if (isDeleteAll) {
      // 전체 삭제 실행
      await clearAllData();
    } else if (selectedDate) {
      // 개별 일정 삭제 로직
      setLoading(true);

      try {
        const dateKey = formatDateKey(selectedDate);

        // 이벤트 삭제 쿼리
        const eventQuery = query(
          collection(db, EVENTS_COLLECTION),
          where('dateKey', '==', dateKey)
        );
        const eventSnapshot = await getDocs(eventQuery);

        // 이벤트 삭제
        for (const document of eventSnapshot.docs) {
          await deleteDoc(doc(db, EVENTS_COLLECTION, document.id));
        }

        // 상태 업데이트
        const updatedEvents = { ...events };
        delete updatedEvents[dateKey];
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Firebase에서 데이터 삭제 중 오류:', error);
      } finally {
        setLoading(false);
        setConfirmModalOpen(false);
      }
    }
  };

  // 달력 일 계산
  const calendarDays = generateCalendarDays();

  // 요일 이름 배열
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <PageContainer $isModalOpen={modalOpen}>
      <Title>업무관리</Title>

      <CalendarContainer>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onAddTask={handleAddTask}
          onClearAll={handleClearAllClick}
        />

        <WeekdaysContainer>
          {weekdays.map((day, index) => (
            <Weekday key={index}>{day}</Weekday>
          ))}
        </WeekdaysContainer>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
        ) : (
          <CalendarGrid>
            {calendarDays.map((dayData, index) => {
              const dateKey = formatDateKey(dayData.date);
              const currentDate = dayData.date;
              const event = events[dateKey];

              // 현재 날짜가 포함된 이벤트 찾기
              let isInEventRange = false;
              let isEventStart = false;
              let isEventEnd = false;
              let eventTypeName = '';
              let eventColor = '';
              let foundEventInfo = null;

              Object.values(events).forEach((event) => {
                if (!event.startDate || !event.endDate || !event.type) return;

                // 시간 정보를 제거한 날짜 객체 생성
                const [startYear, startMonth, startDay] = event.startDate
                  .split('-')
                  .map(Number);
                const [endYear, endMonth, endDay] = event.endDate
                  .split('-')
                  .map(Number);

                const startDate = new Date(startYear, startMonth - 1, startDay);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                // 현재 날짜도 시간 정보 제거
                const currentDateNoTime = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate()
                );

                // 시작일과 종료일 사이에 있는지 확인 (시간 정보 없이)
                const isInRange =
                  currentDateNoTime.getTime() >= startDate.getTime() &&
                  currentDateNoTime.getTime() <= endDate.getTime();

                if (isInRange) {
                  isInEventRange = true;
                  foundEventInfo = event;

                  // 이벤트의 시작일인지 확인
                  if (currentDateNoTime.getTime() === startDate.getTime()) {
                    isEventStart = true;
                  }

                  // 종료일 확인
                  if (currentDateNoTime.getTime() === endDate.getTime()) {
                    isEventEnd = true;
                  }

                  eventTypeName = getEventTypeName(event.type);

                  switch (event.type) {
                    case '1':
                      eventColor = '#FFB74D';
                      break;
                    case '2':
                      eventColor = '#E57373';
                      break;
                    case '3':
                      eventColor = '#4DB6AC';
                      break;
                    default:
                      eventColor = '';
                  }
                }
              });

              return (
                <CalendarCell
                  key={index}
                  date={dayData.date}
                  isCurrentMonth={dayData.isCurrentMonth}
                  isToday={isToday(dayData.date)}
                  memo={event ? event.title : ''}
                  event={
                    isEventStart && foundEventInfo ? foundEventInfo : undefined
                  }
                  isEventStart={isEventStart}
                  isEventEnd={isEventEnd}
                  isInEventRange={isInEventRange}
                  eventTypeName={eventTypeName}
                  eventColor={eventColor}
                  onDateClick={handleDateClick}
                />
              );
            })}
          </CalendarGrid>
        )}
      </CalendarContainer>

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
    </PageContainer>
  );
};

export default CalendarMain;
