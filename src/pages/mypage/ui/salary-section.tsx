import React, { useState } from 'react';
import * as S from '../styles/salary-section.styles';
import Modal from './salary-modal';
import Dropdown from '../../../shared/dropdown/Dropdown';
import Button from '../../../shared/button/Button';

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

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const options = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  return (
    <S.SalarySection>
      <S.Title style={{ position: 'relative', top: '0' }}>급여 내역</S.Title>
      <S.SalaryControls>
        <Dropdown title="급여 일자를 선택해주세요" options={options} />
        <S.ButtonGroup>
          <Button>Excel</Button>
          <Button>CSV</Button>
        </S.ButtonGroup>
      </S.SalaryControls>
      <S.Table>
        <thead>
          <S.TableRow>
            <S.TableHeader>급여일</S.TableHeader>
            <S.TableHeader style={{ color: '#14b8a6' }}>
              총 지급액
            </S.TableHeader>
            <S.TableHeader>실지급액</S.TableHeader>
            <S.TableHeader style={{ color: '#14b8a6' }}>
              급여 명세서
            </S.TableHeader>
          </S.TableRow>
        </thead>
        <tbody>
          {salaryData.map((salary, index) => (
            <S.TableRow key={index}>
              <S.TableData>{salary.date}</S.TableData>
              <S.TableData style={{ color: '#14b8a6' }}>
                {salary.totalPayment}
              </S.TableData>
              <S.TableData>{salary.actualPayment}</S.TableData>
              <S.TableData>
                <S.ButtonWrapper>
                  <Button onClick={handleModalOpen}>급여 명세서 확인</Button>
                </S.ButtonWrapper>
              </S.TableData>
            </S.TableRow>
          ))}
        </tbody>
      </S.Table>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} />
    </S.SalarySection>
  );
};

export default SalaryInfoSection;
