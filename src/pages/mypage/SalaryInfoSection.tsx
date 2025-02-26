import React, { useState } from 'react';
import {
  SalarySection,
  Title,
  SalaryControls,
  Button,
  Table,
  TableRow,
  TableHeader,
  TableData,
} from './MaPageStyles';
import Modal from './SalaryModal';

const SalaryInfoSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <SalarySection>
      <Title style={{ position: 'relative', top: '0' }}>급여 내역</Title>
      <SalaryControls>
        <Button>급여 일자를 선택해주세요 ▼</Button>
        <div>
          <Button>Excel</Button>
          <Button>CSV</Button>
        </div>
      </SalaryControls>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>급여일</TableHeader>
            <TableHeader style={{ color: '#14b8a6' }}>총 지급액</TableHeader>
            <TableHeader>실지급액</TableHeader>
            <TableHeader style={{ color: '#14b8a6' }}>급여 명세서</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {[1, 2, 3].map((_, index) => (
            <TableRow key={index}>
              <TableData>2025/02/25</TableData>
              <TableData style={{ color: '#14b8a6' }}>5,000,000</TableData>
              <TableData>4,480,000</TableData>
              <TableData>
                <Button onClick={openModal}>급여 명세서 확인</Button>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </SalarySection>
  );
};

export default SalaryInfoSection;
