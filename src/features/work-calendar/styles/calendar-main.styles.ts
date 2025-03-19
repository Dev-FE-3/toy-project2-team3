import styled from 'styled-components';

export const PageContainer = styled.div<{ $isModalOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 1240px;
  margin: 50px auto;
  position: relative;
  margin-top: 150px;
`;

// 업무관리 타이틀
export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading2};
  margin-bottom: 20px;
`;

export const CalendarContainer = styled.div<{
  $isModalOpen?: boolean;
}>`
  width: 1240px;
  border: 1px solid ${({ theme }) => theme.colors.point1};
  padding: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
`;

export const WeekdaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: ${({ theme }) => theme.colors.point2};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};
  margin-bottom: 2px;
`;

export const Weekday = styled.div`
  ${({ theme }) => theme.typography.body2};
  padding: 10px;
  text-align: center;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: none;
  border-left: none;
  gap: 2px;
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;
