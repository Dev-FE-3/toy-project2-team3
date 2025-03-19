import React, { useState, useEffect } from 'react';
import CalendarCell from './calendar-cell';
import CalendarModal from './calendar-modal';
import CalendarHeader from './calendar-header';
import ConfirmationModal from './confirmation-modal';
import EventListModal from './event-list-modal';
import * as S from '@/features/work-calendar/styles/calendar-main.styles';
import loadingAnimation from '@/assets/animations/loading.json';
import Lottie from 'lottie-react';
import {
  EventData,
  EventsData,
  formatDateKey,
  loadCalendarData,
  deleteEvent,
  deleteEventsForMonth,
} from './calendar-firebase-service';
import { useCalendarEvents } from './useCalendarEvents';

// Firebase 및 Auth 임포트
import { auth } from '@/firebase';

// 캘린더 유틸리티 함수들 가져오기
import {
  isToday,
  getEventsForDate,
  generateCalendarDays,
} from './calendar-utils/calendar-utils';

// Firebase 서비스 함수들 가져오기

const CalendarMain: React.FC = () => {
  // 현재 표시중인 년월을 저장하는 상태 (달력 헤더에 표시되는 날짜)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // 사용자가 선택한 날짜를 저장하는 상태 (클릭한 날짜 셀)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 일정 추가/편집 모달의 열림/닫힘 상태
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // 모든 이벤트 데이터를 날짜별로 저장하는 객체
  // 키는 "YYYY-M-D" 형식의 날짜 문자열, 값은 해당 날짜의 이벤트 데이터 배열
  const [events, setEvents] = useState<EventsData>({});

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

  const {
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
    initializeForm,
    setEventData,
  } = useCalendarEvents({
    events,
    allEventsData,
    setEvents,
    setAllEventsData,
    setModalOpen,
    setSelectedEvent,
    selectedDate,
    currentUserId,
  });

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
  const fetchCalendarData = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const { eventsData, allEvents } = await loadCalendarData(currentUserId);
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
      fetchCalendarData();
    }
  }, [currentUserId]);

  // 새 일정 추가 버튼 핸들러 - 항상 새 일정 모드로 설정
  const handleAddTask = (date: Date): void => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsNewEvent(true);

    // 훅의 폼 초기화 함수 사용
    initializeForm(date);

    setShowEventList(false);
    setModalOpen(true);
  };

  // // 특정 날짜에 표시할 이벤트 정보 계산 (날짜 범위 포함)
  // const getEventsForSelectedDate = (date: Date): DateEventInfo[] => {
  //   return getEventsForDate(date, allEventsData);
  // };

  // 날짜 클릭 핸들러(모달 열기) - 기존 일정이 있으면 이벤트 목록 모달, 없으면 새 일정 모드
  const handleDateClick = (date: Date): void => {
    const dateKey = formatDateKey(date);
    const dateEvents = events[dateKey] || [];

    // 날짜 범위에 포함된 이벤트 확인
    const eventsInRange = getEventsForDate(date, allEventsData);
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

    // 훅의 이벤트 데이터 설정 함수 사용
    setEventData(event);

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
      // 현재 표시중인 달의 년도와 월
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Firebase 서비스 함수 호출
      const { deletedIds } = await deleteEventsForMonth(
        currentUserId,
        year,
        month
      );

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

        // Firebase 서비스 함수 호출
        await deleteEvent(currentUserId, selectedEvent.id);

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

  // 달력 일 계산 - 유틸 함수 사용
  const calendarDays = generateCalendarDays(currentDate);

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
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: '180px', height: '180px' }}
              />
            </div>
          ) : (
            <S.CalendarGrid>
              {calendarDays.map((dayData, index) => {
                const dateKey = formatDateKey(dayData.date);
                const dateEvents = events[dateKey] || [];

                // 날짜 범위에 포함된 이벤트 확인
                const eventsInRange = getEventsForDate(
                  dayData.date,
                  allEventsData
                );

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
          events={getEventsForDate(selectedDate, allEventsData).map(
            (item) => item.event
          )}
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
