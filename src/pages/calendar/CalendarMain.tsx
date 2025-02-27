import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CalendarCell from './CalendarCell';
import CalendarModal from './CalendarModal';
import CalendarHeader from './CalendarHeader';
import { json } from 'stream/consumers';

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

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  margin-top: 200px;
`;

// 업무관리 타이틀
const Title = styled.h1`
  width: 100%;
  position: relative;
  padding: 10px 0;
  margin-bottom: 10px;
  font-size: 32px;
  font-style: normal;
  margin-right: 1100px;
  font-weight: 700;
  line-height: 125%;
  letter-spacing: -0.64px;
`;

const CalendarContainer = styled.div`
  width: 1240px;
  margin: 0 auto;
  border: 1px solid #2ac1bc;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden; // 다시 hidden으로 변경 (모든 셀 크기가 수정된 후)
  box-sizing: border-box;
  position: relative;
`;
const WeekdaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgba(42, 193, 188, 0.2);
  border-bottom: 1px solid #e0e0e0;
`;

const Weekday = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: white;
  gap: 2px;

  // 그리드 셀이 동일한 크기로 정렬되도록 설정
  & > div {
    min-width: 0; // 셀이 너무 넓어지는 것을 방지
    width: 100%; // 부모 컨테이너 내에서 동일한 너비
  }
`;

const CalendarMain: React.FC = () => {
  // 상태 관리
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

  // 날짜 클릭 핸들러(모달 열기)
  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);

    // memoText 대신 titleText와 contentText 사용
    const memoData = memos[dateKey] || '';
    setTitleText(memoData);

    const eventData = events[dateKey];
    if (eventData) {
      setContentText(eventData.content || '');
      setEventType(eventData.type || '');
      setStartDate(eventData.startDate || '');
      setEndDate(eventData.endDate || '');
    } else {
      setContentText('');
      setEventType('');
      setStartDate('');
      setEndDate('');
    }

    setModalOpen(true);
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

  // 메모 저장 핸들러
  const saveMemo = (): void => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
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
        return '회의';
      case '2':
        return '출장';
      case '3':
        return '회식';
      case '4':
        return '휴가';
      case '5':
        return '회의';
      default:
        return '';
    }
  };

  const clearAllData = (): void => {
    // 확인 대화상자 표시

    // 모든 상태 초기화
    setMemos({});
    setEvents({});

    // 로컬 스토리지에서도 삭제
    localStorage.removeItem('calendarMemos');
    localStorage.removeItem('calendarEvents');
  };

  return (
    <PageContainer>
      <Title>업무관리</Title>

      <CalendarContainer>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onAddTask={handleDateClick}
          onClearAll={clearAllData}
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
            let isInEvent = false;
            let isEventStart = false;
            let eventTypeName = '';

            Object.values(events).forEach((event) => {
              if (!event.startDate || !event.endDate) return;

              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);

              // 시작일과 종료일 사이에 있는지 확인
              if (currentDate >= startDate && currentDate <= endDate) {
                isInEvent = true;

                // 이벤트의 시작일인지 확인
                if (
                  currentDate.getDate() === startDate.getDate() &&
                  currentDate.getMonth() === startDate.getMonth() &&
                  currentDate.getFullYear() === startDate.getFullYear()
                ) {
                  isEventStart = true;
                  eventTypeName = getEventTypeName(event.type);
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
                event={isInEvent ? ({ type: 'event' } as EventData) : undefined}
                isEventStart={isEventStart}
                eventTypeName={eventTypeName}
                onDateClick={handleDateClick}
              />
            );
          })}
        </CalendarGrid>
      </CalendarContainer>

      {/* 수정된 props를 사용하여 MemoModal 렌더링 */}
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
        />
      )}
    </PageContainer>
  );
};

export default CalendarMain;
