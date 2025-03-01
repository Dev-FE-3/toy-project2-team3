import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  margin-top: 200px;
`;

// 업무관리 타이틀
export const Title = styled.h1`
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

export const CalendarContainer = styled.div`
  width: 1240px;
  margin: 0 auto;
  border: 1px solid #2ac1bc;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden; // 다시 hidden으로 변경 (모든 셀 크기가 수정된 후)
  box-sizing: border-box;
  position: relative;
`;

export const WeekdaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgba(42, 193, 188, 0.2);
  border-bottom: 1px solid #e0e0e0;
`;

export const Weekday = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: none;
  border-left: none;
  gap: 2px;
`;
