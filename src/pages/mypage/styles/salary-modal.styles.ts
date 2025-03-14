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
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 3.6rem 4rem 2.8rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin: 0 1.2rem 1.2rem;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading2}

  span {
    color: ${({ theme }) => theme.colors.point1};
  }
`;

export const DateText = styled.p`
  ${({ theme }) => theme.typography.body3}
  color: ${({ theme }) => theme.colors.grey2};
`;

export const ModalBody = styled.div`
  height: 480px;
  background: ${({ theme }) => theme.colors.point3};
  padding: 4rem 4.8rem;
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
`;

export const SalaryTable = styled.table`
  width: auto;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  ${({ theme }) => theme.typography.heading3}
  text-align: left;
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
  margin-top: 2rem;
  margin-right: 1.2rem;
`;
