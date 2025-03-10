import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalContent = styled.div`
  width: 1000px;
  height: 670px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading2}
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  span {
    color: ${({ theme }) => theme.colors.point1};
  }
`;

export const DateText = styled.p`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.colors.grey1};
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
`;

export const ModalBody = styled.div`
  height: 480px;
  background: ${({ theme }) => theme.colors.point3};
  padding: 2.5rem;
  border-radius: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SalaryDetails = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10rem;
  margin-left: 5rem;
`;

export const SalaryTable = styled.table`
  width: auto;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  ${({ theme }) => theme.typography.heading3}
  text-align: left;
  padding-top: 5rem;
  padding-bottom: 2.25rem;
`;

export const TableRow = styled.tr`
  height: 3rem;
  text-align: left;
`;

export const TableData = styled.td`
  ${({ theme }) => theme.typography.body2}
  text-align: left;
`;

export const TableDataRight = styled.td`
  ${({ theme }) => theme.typography.body2}
  font-weight: bold;
  padding-left: 2.5rem;
`;

export const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 1.25rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 240px;
  line-height: 140%;
  margin-top: 0.25rem;
`;

export const TotalText = styled.p`
  ${({ theme }) => theme.typography.heading4}
  font-weight: bold;
`;

export const TotalAmount = styled.p`
  ${({ theme }) => theme.typography.body2}
  text-align: right;
  &.highlight {
    color: ${({ theme }) => theme.colors.point1};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  margin-top: 1.25rem;
`;
