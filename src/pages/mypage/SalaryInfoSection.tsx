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
import Dropdown from '../../widgets/dropdown/Dropdown';
//import Button from '../../widgets/button/Button';

const SalaryInfoSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const options = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  return (
    <SalarySection>
      <Title style={{ position: 'relative', top: '0' }}>급여 내역</Title>
      <SalaryControls>
        <Dropdown title="급여 일자를 선택해주세요" options={options} />
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
