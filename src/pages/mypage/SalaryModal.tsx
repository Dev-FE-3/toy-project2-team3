import React from 'react';
import styled from 'styled-components';
import Button from '../../widgets/button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {/* 상단 헤더 */}
        <ModalHeader>
          <Title>
            <span>1월</span> 급여 명세서
          </Title>
          <DateText>2025년 01월 25일</DateText>
        </ModalHeader>

        {/* 급여 명세서 내용 */}
        <ModalBody>
          <SalaryDetails>
            {/* 지급 항목 테이블 */}
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
                  <TableDataRight>3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>상여금</TableData>
                  <TableDataRight>3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>직책수당</TableData>
                  <TableDataRight>3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>특근수당</TableData>
                  <TableDataRight>3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>야근수당</TableData>
                  <TableDataRight>3,000,000원</TableDataRight>
                </TableRow>
              </tbody>
            </SalaryTable>

            {/* 공제 항목 테이블 */}
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
                  <TableDataRight>-3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>장기요양보험</TableData>
                  <TableDataRight>-3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>고용보험</TableData>
                  <TableDataRight>-3,000,000원</TableDataRight>
                </TableRow>
                <TableRow>
                  <TableData>소득세</TableData>
                  <TableDataRight>-3,000,000원</TableDataRight>
                </TableRow>
              </tbody>
            </SalaryTable>
          </SalaryDetails>

          {/* 지급/공제 합계 및 실지급액 */}
          <TotalSection>
            <TotalRow>
              <TotalText>지급합계</TotalText>
              <TotalAmount>563,443,234원</TotalAmount>
            </TotalRow>
            <TotalRow>
              <TotalText>공제합계</TotalText>
              <TotalAmount>-1,231,500원</TotalAmount>
            </TotalRow>
            <TotalRow>
              <TotalText>실지급액</TotalText>
              <TotalAmount className="highlight">562,211,734원</TotalAmount>
            </TotalRow>
          </TotalSection>
        </ModalBody>

        {/* 하단 버튼 */}
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
  background: white;
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
  font-size: 32px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 8px;
  span {
    color: #14b8a6;
  }
`;

const DateText = styled.p`
  font-size: 16px;
  color: #555;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const ModalBody = styled.div`
  width: 920px;
  height: 480px;
  background: #eaf8f8;
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
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  padding-top: 80px;
  padding-bottom: 36px;
`;

const TableRow = styled.tr`
  height: 40px;
  text-align: left;
`;

const TableData = styled.td`
  font-size: 16px;
  text-align: left;
`;

const TableDataRight = styled.td`
  font-size: 16px;
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
  width: 220px;
  line-height: 140%; /* 22.4px */
  margin-top: 4px;
`;

const TotalText = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const TotalAmount = styled.p`
  font-size: 16px;
  text-align: right;
  &.highlight {
    color: #14b8a6;
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
