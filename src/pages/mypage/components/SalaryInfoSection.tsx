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
} from '../MyPage.styles';
import Modal from './SalaryModal';
import Dropdown from '../../../widgets/dropdown/Dropdown';

// 🔹 급여 내역 더미 데이터
const salaryData = [
  {
    date: '2025/02/25',
    totalPayment: '5,000,000',
    actualPayment: '4,480,000',
  },
  {
    date: '2025/01/25',
    totalPayment: '5,200,000',
    actualPayment: '4,650,000',
  },
  {
    date: '2024/12/25',
    totalPayment: '5,000,000',
    actualPayment: '4,480,000',
  },
];

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
          {salaryData.map((salary, index) => (
            <TableRow key={index}>
              <TableData>{salary.date}</TableData>
              <TableData style={{ color: '#14b8a6' }}>
                {salary.totalPayment}
              </TableData>
              <TableData>{salary.actualPayment}</TableData>
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
