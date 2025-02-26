import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DayCell from './CalendarCell';
import MemoModal from './CalendarModal';
import CalendarHeader from './CalendarHeader';

// 타입 정의
interface MemoData {
  [dateKey: string]: string;
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
  position: relative;
  padding: 10px 0;
  margin-bottom: 10px;
  font-size: 32px;
  font-style: normal;
  margin-right: 1150px;
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
  overflow: hidden;
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
`;

const Calendar: React.FC = () => {
  // 상태 관리
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [memos, setMemos] = useState<MemoData>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [memoText, setMemoText] = useState<string>('');

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

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    setMemoText(memos[dateKey] || '');
    setModalOpen(true);
  };

  // 날짜 키 포맷 (로컬 스토리지 저장용)
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // 메모 텍스트 변경 핸들러
  const handleMemoTextChange = (text: string): void => {
    setMemoText(text);
  };

  // 메모 저장 핸들러
  const saveMemo = (): void => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const updatedMemos = { ...memos };

      if (memoText.trim() === '') {
        delete updatedMemos[dateKey];
      } else {
        updatedMemos[dateKey] = memoText;
      }

      setMemos(updatedMemos);
      setModalOpen(false);

      // 로컬 스토리지에 저장
      localStorage.setItem('calendarMemos', JSON.stringify(updatedMemos));
    }
  };

  // 모달 닫기 핸들러
  const closeModal = (): void => {
    setModalOpen(false);
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem('calendarMemos');
    if (savedMemos) {
      try {
        const parsedMemos = JSON.parse(savedMemos);
        setMemos(parsedMemos);
      } catch (error) {
        console.error('Failed to parse saved memos:', error);
      }
    }
  }, []);

  // 요일 이름 배열
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  const calendarDays = generateCalendarDays();

  return (
    <PageContainer>
      <Title>업무관리</Title>

      <CalendarContainer>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />

        <WeekdaysContainer>
          {weekdays.map((day, index) => (
            <Weekday key={index}>{day}</Weekday>
          ))}
        </WeekdaysContainer>

        <CalendarGrid>
          {calendarDays.map((dayData, index) => {
            const dateKey = formatDateKey(dayData.date);
            return (
              <DayCell
                key={index}
                date={dayData.date}
                isCurrentMonth={dayData.isCurrentMonth}
                isToday={isToday(dayData.date)}
                memo={memos[dateKey]}
                onDateClick={handleDateClick}
              />
            );
          })}
        </CalendarGrid>

        <MemoModal
          isOpen={modalOpen}
          selectedDate={selectedDate}
          memoText={memoText}
          onTextChange={handleMemoTextChange}
          onSave={saveMemo}
          onClose={closeModal}
        />
      </CalendarContainer>
    </PageContainer>
  );
};

export default Calendar;
