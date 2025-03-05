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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface MemoData {
  [dateKey: string]: string;
}

interface EventsData {
  [dateKey: string]: EventData;
}

// Firebase 컬렉션 이름
const EVENTS_COLLECTION = 'calendarEvents';
const MEMOS_COLLECTION = 'calendarMemos';

const CalendarMain: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [memos, setMemos] = useState<MemoData>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [titleText, setTitleText] = useState<string>('');
  const [contentText, setContentText] = useState<string>('');
  const [events, setEvents] = useState<EventsData>({});
  const [eventType, setEventType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isNewEvent, setIsNewEvent] = useState<boolean>(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);

  // 달력 데이터 계산 함수들
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

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
        // startDate를 키로 사용
        const startDateObj = new Date(eventData.startDate);
        const dateKey = formatDateKey(startDateObj);

        eventsData[dateKey] = {
          ...eventData,
          id: doc.id,
        };
      });

      // 메모 데이터 가져오기
      const memosSnapshot = await getDocs(collection(db, MEMOS_COLLECTION));
      const memosData: MemoData = {};

      memosSnapshot.forEach((doc) => {
        const memoData = doc.data();
        memosData[memoData.dateKey] = memoData.text;
      });

      setEvents(eventsData);
      setMemos(memosData);
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

    // 해당 날짜에 메모나 이벤트가 있는지 확인
    const hasEvent = events[dateKey];
    const hasMemo = memos[dateKey];

    // 메모나 이벤트가 있는 경우에만 모달 열기
    if (hasEvent || hasMemo) {
      setSelectedDate(date);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      setIsNewEvent(false);

      if (hasEvent) {
        setTitleText(hasEvent.title || '');
        setContentText(hasEvent.content || '');
        setEventType(hasEvent.type || '');
        setStartDate(hasEvent.startDate || formattedDate);
        setEndDate(hasEvent.endDate || formattedDate);
      } else {
        // 메모만 있는 경우
        setTitleText(hasMemo || '');
        setContentText('');
        setEventType('');
        setStartDate(formattedDate);
        setEndDate(formattedDate);
      }

      setModalOpen(true);
    }
    // 메모나 이벤트가 없는 경우는 아무 동작도 하지 않음
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

  // Firebase에 메모와 이벤트 저장
  const saveEventAndMemo = async (): Promise<void> => {
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

        const updatedMemos = { ...memos };
        const updatedEvents = { ...events };

        // 이벤트 데이터 생성
        const eventData: EventData = {
          title: titleText,
          type: eventType,
          content: contentText,
          startDate: startDate,
          endDate: endDate,
        };

        // 기존 이벤트가 있는지 확인
        const eventQuery = query(
          collection(db, EVENTS_COLLECTION),
          where('startDate', '==', startDate)
        );
        const eventSnapshot = await getDocs(eventQuery);

        // 메모 확인
        const memoQuery = query(
          collection(db, MEMOS_COLLECTION),
          where('dateKey', '==', dateKey)
        );
        const memoSnapshot = await getDocs(memoQuery);

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

        // 메모 저장 또는 업데이트
        if (!memoSnapshot.empty) {
          // 기존 메모 업데이트
          const memoDoc = memoSnapshot.docs[0];
          await updateDoc(doc(db, MEMOS_COLLECTION, memoDoc.id), {
            text: titleText,
            updatedAt: Timestamp.now(),
          });
        } else {
          // 새 메모 추가
          await addDoc(collection(db, MEMOS_COLLECTION), {
            dateKey: dateKey,
            text: titleText,
            createdAt: Timestamp.now(),
          });
        }

        // 메모 상태 업데이트
        updatedMemos[dateKey] = titleText;

        // 상태 업데이트
        setMemos(updatedMemos);
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
      const firstDayOfMonth = new Date(year, month, 1);
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

      // 메모 쿼리 구성 - Firebase에서는 복합 쿼리 제한으로 인해 dateKey 범위 쿼리가 어려울 수 있음
      // 대신 모든 메모를 가져온 다음 JavaScript로 필터링
      const memosSnapshot = await getDocs(collection(db, MEMOS_COLLECTION));

      // 이벤트 삭제
      for (const document of eventsSnapshot.docs) {
        await deleteDoc(doc(db, EVENTS_COLLECTION, document.id));
      }

      // 메모 삭제 (현재 달에 속하는 메모만)
      for (const document of memosSnapshot.docs) {
        const memoData = document.data();
        const dateKey = memoData.dateKey;

        // dateKey 형식이 YYYY-M-D 또는 YYYY-MM-DD 형식이라고 가정
        if (dateKey) {
          const [memoYear, memoMonth] = dateKey.split('-').map(Number);

          if (memoYear === year && memoMonth === month + 1) {
            await deleteDoc(doc(db, MEMOS_COLLECTION, document.id));
          }
        }
      }

      // 메모 및 이벤트 상태 업데이트 (현재 달의 데이터만 제거)
      const updatedMemos = { ...memos };
      const updatedEvents = { ...events };

      // 업데이트된 메모와 이벤트 객체에서 현재 달의 항목만 제거
      Object.keys(updatedMemos).forEach((dateKey) => {
        const [memoYear, memoMonth] = dateKey.split('-').map(Number);
        if (memoYear === year && memoMonth === month + 1) {
          delete updatedMemos[dateKey];
        }
      });

      Object.keys(updatedEvents).forEach((dateKey) => {
        const [eventYear, eventMonth] = dateKey.split('-').map(Number);
        if (eventYear === year && eventMonth === month + 1) {
          delete updatedEvents[dateKey];
        }
      });

      setMemos(updatedMemos);
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
          where('startDate', '==', startDate)
        );
        const eventSnapshot = await getDocs(eventQuery);

        // 메모 삭제 쿼리
        const memoQuery = query(
          collection(db, MEMOS_COLLECTION),
          where('dateKey', '==', dateKey)
        );
        const memoSnapshot = await getDocs(memoQuery);

        // 이벤트 삭제
        for (const document of eventSnapshot.docs) {
          await deleteDoc(doc(db, EVENTS_COLLECTION, document.id));
        }

        // 메모 삭제
        for (const document of memoSnapshot.docs) {
          await deleteDoc(doc(db, MEMOS_COLLECTION, document.id));
        }

        // 상태 업데이트
        const updatedMemos = { ...memos };
        const updatedEvents = { ...events };

        delete updatedMemos[dateKey];
        delete updatedEvents[dateKey];

        setMemos(updatedMemos);
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
                  memo={memos[dateKey]}
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
          onSave={saveEventAndMemo}
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
