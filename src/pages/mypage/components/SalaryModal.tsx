import React from 'react';
import styled from 'styled-components';
import Button from '../../../widgets/button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const salaryData = {
  date: '2025년 01월 25일',
  month: '1월',
  pay: {
    base: '3,000,000원',
    bonus: '3,000,000원',
    position: '3,000,000원',
    overtime: '3,000,000원',
    night: '3,000,000원',
  },
  deduct: {
    health: '-3,000,000원',
    care: '-3,000,000원',
    job: '-3,000,000원',
    tax: '-3,000,000원',
  },
  total: {
    pay: '563,443,234원',
    deduct: '-1,231,500원',
    net: '562,211,734원',
  },
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>
            <span>{salaryData.month}</span> 급여 명세서
          </Title>
          <DateText>{salaryData.date}</DateText>
        </ModalHeader>

        <ModalBody>
          <SalaryDetails>
            <SalaryTable>
              <thead>
                <tr>
                  <TableHeader>지급 항목</TableHeader>
                  <TableHeader></TableHeader>
                </tr>
              </thead>
              <tbody>
                <TableRow>
                  <TableData>기본급</TableData>
                  <TableDataRight>{salaryData.pay.base}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>상여금</TableData>
                  <TableDataRight>{salaryData.pay.bonus}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>직책수당</TableData>
                  <TableDataRight>{salaryData.pay.position}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>특근수당</TableData>
                  <TableDataRight>{salaryData.pay.overtime}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>야근수당</TableData>
                  <TableDataRight>{salaryData.pay.night}</TableDataRight>
                </TableRow>
              </tbody>
            </SalaryTable>

            <SalaryTable>
              <thead>
                <tr>
                  <TableHeader>공제 항목</TableHeader>
                  <TableHeader></TableHeader>
                </tr>
              </thead>
              <tbody>
                <TableRow>
                  <TableData>건강보험</TableData>
                  <TableDataRight>{salaryData.deduct.health}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>장기요양보험</TableData>
                  <TableDataRight>{salaryData.deduct.care}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>고용보험</TableData>
                  <TableDataRight>{salaryData.deduct.job}</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>소득세</TableData>
                  <TableDataRight>{salaryData.deduct.tax}</TableDataRight>
                </TableRow>
              </tbody>
            </SalaryTable>
          </SalaryDetails>

          <TotalSection>
            <TotalRow>
              <TotalText>지급합계</TotalText>
              <TotalAmount>{salaryData.total.pay}</TotalAmount>
            </TotalRow>
            <TotalRow>
              <TotalText>공제합계</TotalText>
              <TotalAmount>{salaryData.total.deduct}</TotalAmount>
            </TotalRow>
            <TotalRow>
              <TotalText>실지급액</TotalText>
              <TotalAmount className="highlight">
                {salaryData.total.net}
              </TotalAmount>
            </TotalRow>
          </TotalSection>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
          <Button>정정 신청하기</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ModalContent = styled.div`
  width: 1000px;
  height: 670px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.heading2}
  margin-top: 20px;
  margin-bottom: 8px;
  span {
    color: ${({ theme }) => theme.colors.point1};
  }
`;

const DateText = styled.p`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.colors.grey1};
  margin-top: 20px;
  margin-bottom: 8px;
`;

const ModalBody = styled.div`
  width: 920px;
  height: 480px;
  background: ${({ theme }) => theme.colors.point3};
  padding: 40px;
  border-radius: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SalaryDetails = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 80px;
  margin-left: 80px;
`;

const SalaryTable = styled.table`
  width: auto;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  ${({ theme }) => theme.typography.heading3}
  text-align: left;
  padding-top: 80px;
  padding-bottom: 36px;
`;

const TableRow = styled.tr`
  height: 40px;
  text-align: left;
`;

const TableData = styled.td`
  ${({ theme }) => theme.typography.body2}
  text-align: left;
`;

const TableDataRight = styled.td`
  ${({ theme }) => theme.typography.body2}
  font-weight: bold;
  padding-left: 40px;
`;

const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 240px;
  line-height: 140%;
  margin-top: 4px;
`;

const TotalText = styled.p`
  ${({ theme }) => theme.typography.body2}
  font-weight: bold;
`;

const TotalAmount = styled.p`
  ${({ theme }) => theme.typography.body2}
  text-align: right;
  &.highlight {
    color: ${({ theme }) => theme.colors.point1};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

// const Button = styled.button<{ primary?: boolean }>`
//   width: 150px;
//   height: 40px;
//   background-color: ${({ primary }) => (primary ? '#14b8a6' : 'white')};
//   color: ${({ primary }) => (primary ? 'white' : '#14b8a6')};
//   border: 2px solid #14b8a6;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;
//   font-weight: bold;
// `;
