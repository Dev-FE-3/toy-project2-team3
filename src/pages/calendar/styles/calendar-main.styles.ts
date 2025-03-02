import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1240px;
  margin: 50px auto;
  position: relative;
`;

// 업무관리 타이틀
export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.colors.grey1};
  margin-bottom: 20px;
`;

export const CalendarContainer = styled.div`
  width: 1240px;
  margin: 0 auto;

  border: 1px solid #2ac1bc;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden;
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
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.grey1};
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
