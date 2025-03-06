import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useSelector } from 'react-redux';
//import { RootState } from '@/redux/store';
import * as S from '../styles/salary-modal.styles';
import Button from '../../../shared/button/Button';

// 모달 props 인터페이스
interface ModalProps {
  isOpen: boolean;
  onClose: (keepState?: boolean) => void;
  selectedSalary: any | null;
}

const formatCurrency = (value: number | undefined) => {
  if (typeof value !== 'number' || isNaN(value)) return '₩0';
  return value < 0
    ? `-₩${Math.abs(value).toLocaleString()}`
    : `₩${value.toLocaleString()}`;
};

// 테이블 props 인터페이스
interface SalaryTableProps {
  title: string;
  data: { label: string; value: number | undefined }[];
}

// 급여 테이블 컴포넌트 (메모이제이션)
const SalaryTable = ({ title, data }: SalaryTableProps) => (
  <S.SalaryTable>
    <thead>
      <tr>
        <S.TableHeader>{title}</S.TableHeader>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <S.TableRow key={index}>
          <S.TableData>{item.label}</S.TableData>
          <S.TableDataRight>{formatCurrency(item.value)}</S.TableDataRight>
        </S.TableRow>
      ))}
    </tbody>
  </S.SalaryTable>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedSalary }) => {
  const navigate = useNavigate();

  const handleCorrectionRequest = () => {
    onClose(true);
    const month = getMonth(selectedSalary);
    navigate(`/salary-correction?month=${encodeURIComponent(month)}`);
  };

  // 월 정보 추출 함수
  const getMonth = (salary: any) => {
    if (!salary) return '';
    if (typeof salary.date === 'string' && salary.date.includes('년')) {
      return salary.date.split('년 ')[1].split('월')[0] + '월';
    }
    return '';
  };

  // 월 정보 추출 (메모이제이션)
  const month = useMemo(() => {
    return getMonth(selectedSalary);
  }, [selectedSalary]);

  const formattedDate = useMemo(() => {
    return selectedSalary?.rawDate
      ? new Date(selectedSalary.rawDate).toLocaleDateString()
      : '날짜 없음';
  }, [selectedSalary?.rawDate]);

  // 지급 항목 데이터 (메모이제이션)
  const paymentData = useMemo(() => {
    if (!selectedSalary) return [];
    return [
      { label: '기본급', value: selectedSalary.base },
      { label: '상여금', value: selectedSalary.bonus },
      { label: '직책수당', value: selectedSalary.position },
      { label: '특근수당', value: selectedSalary.overtime },
      { label: '야근수당', value: selectedSalary.night },
    ];
  }, [selectedSalary]);

  // 공제 항목 데이터 (메모이제이션)
  const deductionData = useMemo(() => {
    if (!selectedSalary) return [];
    return [
      { label: '건강보험', value: selectedSalary.health },
      { label: '장기요양보험', value: selectedSalary.care },
      { label: '고용보험', value: selectedSalary.job },
      { label: '소득세', value: selectedSalary.tax },
    ];
  }, [selectedSalary]);

  // 렌더링 조건
  if (!isOpen) return null;

  if (!selectedSalary) {
    return (
      <S.ModalOverlay>
        <S.ModalContent>
          <S.ModalHeader>
            <S.Title>급여 명세서</S.Title>
          </S.ModalHeader>
          <S.ModalBody>
            <p>급여 데이터를 불러오는 중...</p>
          </S.ModalBody>
          <S.ModalFooter>
            <Button onClick={() => onClose()} variant="outlined">
              닫기
            </Button>
          </S.ModalFooter>
        </S.ModalContent>
      </S.ModalOverlay>
    );
  }

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.ModalHeader>
          <S.Title>
            <span>{month}</span> 급여 명세서
          </S.Title>
          <S.DateText>{formattedDate}</S.DateText>
        </S.ModalHeader>

        <S.ModalBody>
          <S.SalaryDetails>
            <SalaryTable title="지급 항목" data={paymentData} />

            <SalaryTable title="공제 항목" data={deductionData} />
          </S.SalaryDetails>

          <S.TotalSection>
            <S.TotalRow>
              <S.TotalText>지급합계</S.TotalText>
              <S.TotalAmount>
                {formatCurrency(selectedSalary.totalPayment)}
              </S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>공제합계</S.TotalText>
              <S.TotalAmount>
                {formatCurrency(selectedSalary.totalDeduct)}
              </S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>실지급액</S.TotalText>
              <S.TotalAmount className="highlight">
                {formatCurrency(selectedSalary.actualPayment)}
              </S.TotalAmount>
            </S.TotalRow>
          </S.TotalSection>
        </S.ModalBody>

        <S.ModalFooter>
          <Button onClick={() => onClose()} variant="outlined">
            닫기
          </Button>
          <Button onClick={handleCorrectionRequest}>정정 신청하기</Button>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default React.memo(Modal);
