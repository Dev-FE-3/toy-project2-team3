import styled from 'styled-components';

export const SalarySection = styled.section`
  width: 100%;
  height: auto;
  position: relative;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: 1rem;
  position: absolute;
  top: -50px;
  left: 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
`;

export const TableRow = styled.tr`
  height: 50px;
`;

export const TableHeader = styled.th`
  padding: 0.75rem;
  ${({ theme }) => theme.typography.body2}
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  width: 25%;
`;

export const TableData = styled.td`
  padding: 0.75rem;
  ${({ theme }) => theme.typography.body2}
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};
  width: 25%;
  text-align: center;
`;

export const SalaryControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Message = styled.div`
  ${({ theme }) => theme.typography.body2}
  color:   ${({ theme }) => theme.colors.grey2}
`;
