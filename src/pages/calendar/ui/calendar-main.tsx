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

// 타입 정의
interface EventData {
  title: string;
  type: string;
  content: string;
  startDate: string;
  endDate: string;
}

interface MemoData {
  [dateKey: string]: string;
}

interface EventsData {
  [dateKey: string]: EventData;
}

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
  const [deleteMode, setDeleteMode] = useState<string>('single'); // 'single' 또는 'month'

  // 달력 데이터 계산
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
        setStartDate(hasEvent.startDate || '');
        setEndDate(hasEvent.endDate || '');
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

  // 날짜 키 포맷 (로컬 스토리지 저장용)
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

  const saveMemo = (): void => {
    if (!titleText.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }
    if (!eventType) {
      alert('일정 유형을 선택해주세요.');
      return;
    }
    if (!startDate) {
      alert('시작일을 선택해주세요.');
      return;
    }
    if (!endDate) {
      alert('종료일을 선택해주세요.');
      return;
    }

    // 시작일이 종료일보다 나중인 경우 검증
    if (new Date(startDate) > new Date(endDate)) {
      alert('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    if (selectedDate) {
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

      if (titleText.trim() === '') {
        delete updatedMemos[dateKey];
        delete updatedEvents[dateKey];
      } else {
        updatedMemos[dateKey] = titleText;

        updatedEvents[dateKey] = {
          title: titleText,
          type: eventType,
          content: contentText,
          startDate: startDate,
          endDate: endDate,
        };
      }

      setMemos(updatedMemos);
      setEvents(updatedEvents);
      setModalOpen(false);

      // 로컬 스토리지에 저장
      localStorage.setItem('calendarMemos', JSON.stringify(updatedMemos));
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem('calendarMemos');
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedMemos) {
      try {
        const parsedMemos = JSON.parse(savedMemos);
        setMemos(parsedMemos);
      } catch (error) {
        console.error('Failed to parse saved memos:', error);
      }
    }

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.log('Failed to parse saved events: ', error);
      }
    }
  }, []);

  // 요일 이름 배열
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  const calendarDays = generateCalendarDays();

  const getEventTypeName = (typeValue: string): string => {
    switch (typeValue) {
      case '1':
        return '일정을 선택해주세요.';
      case '2':
        return '회의';
      case '3':
        return '출장';
      case '4':
        return '휴가';
      default:
        return '';
    }
  };

  // 현재 월만 삭제하는 함수 (이전에 전체 삭제였던 부분)
  const clearCurrentMonthData = (): void => {
    // 현재 월에 해당하는 일정만 삭제
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 필터링을 위해 기존 데이터 복사
    const filteredMemos = { ...memos };
    const filteredEvents = { ...events };

    // 각 데이터의 키(날짜)를 확인하여 현재 월에 해당하는 것만 삭제
    Object.keys(filteredMemos).forEach((dateKey) => {
      const [keyYear, keyMonth] = dateKey.split('-').map(Number);
      if (keyYear === year && keyMonth === month) {
        delete filteredMemos[dateKey];
      }
    });

    Object.keys(filteredEvents).forEach((dateKey) => {
      const [keyYear, keyMonth] = dateKey.split('-').map(Number);
      if (keyYear === year && keyMonth === month) {
        delete filteredEvents[dateKey];
      }
    });

    setMemos(filteredMemos);
    setEvents(filteredEvents);

    // 로컬 스토리지 업데이트
    localStorage.setItem('calendarMemos', JSON.stringify(filteredMemos));
    localStorage.setItem('calendarEvents', JSON.stringify(filteredEvents));
  };

  // 전체 삭제 버튼 클릭 핸들러 (월별 삭제로 기능 변경)
  const handleClearAll = (): void => {
    setDeleteMode('month');
    setConfirmModalOpen(true);
  };

  const handleDeleteClick = (): void => {
    setDeleteMode('single');
    setConfirmModalOpen(true);
    setModalOpen(false);
  };

  const handleCancelDelete = (): void => {
    setConfirmModalOpen(false);
    // 단일 일정 삭제 취소 시 모달 다시 열기
    if (deleteMode === 'single') {
      setModalOpen(true);
    }
  };

  const confirmDelete = (): void => {
    if (deleteMode === 'month') {
      // 현재 월의 일정만 삭제
      clearCurrentMonthData();
    } else if (selectedDate) {
      // 단일 일정 삭제
      const dateKey = formatDateKey(selectedDate);
      const updatedMemos = { ...memos };
      const updatedEvents = { ...events };

      delete updatedMemos[dateKey];
      delete updatedEvents[dateKey];

      setMemos(updatedMemos);
      setEvents(updatedEvents);

      localStorage.setItem('calendarMemos', JSON.stringify(updatedMemos));
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    }

    setConfirmModalOpen(false);
  };

  return (
    <PageContainer isModalOpen={modalOpen}>
      <Title>업무관리</Title>

      <CalendarContainer>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onAddTask={handleAddTask}
          onClearAll={handleClearAll}
        />

        <WeekdaysContainer>
          {weekdays.map((day, index) => (
            <Weekday key={index}>{day}</Weekday>
          ))}
        </WeekdaysContainer>

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
                onDateClick={handleDateClick} // 달력 셀 클릭은 handleDateClick 함수를 사용
              />
            );
          })}
        </CalendarGrid>
      </CalendarContainer>

      {/* CalendarModal 렌더링 */}
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
          onSave={saveMemo}
          onClose={closeModal}
          isNewEvent={isNewEvent}
          onDelete={handleDeleteClick}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
        title={
          deleteMode === 'month' ? (
            <>{currentDate.getMonth() + 1}월 일정을 삭제하시겠습니까?</>
          ) : (
            '일정을 삭제하시겠습니까?'
          )
        }
        message=""
      />
    </PageContainer>
  );
};

export default CalendarMain;
