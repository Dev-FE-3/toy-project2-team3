import { useState, useMemo, useCallback } from 'react';
import * as S from '@/pages/mypage/styles/salary-section.styles';
import Modal from '@/pages/mypage/ui/salary-modal';
import Dropdown from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useFetchSalaryData } from '@/pages/mypage/useFetchSalaryData';
import { formatCurrency } from '@/utils/formatCurrency';

export interface SalaryData {
  id: string;
  date: string;
  rawDate: number;
  base: number;
  bonus: number;
  position: number;
  overtime: number;
  night: number;
  health: number;
  care: number;
  job: number;
  tax: number;
  totalPayment: number;
  totalDeduct: number;
  actualPayment: number;
}

interface DropdownOption {
  label: string;
  value: string;
}

const SalaryInfoSection = () => {
  const { salaryData } = useFetchSalaryData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleModalOpen = useCallback((salaryDetail: SalaryData) => {
    setSelectedSalary(salaryDetail);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSalary(null);
  }, []);

  // 드롭다운 옵션 구성
  const options: DropdownOption[] = useMemo(
    () =>
      salaryData.map((salary) => ({
        label: salary.date,
        value: salary.date,
      })),
    [salaryData]
  );

  //드롭다운 선택 시 필터링
  const handleDateChange = useCallback((selectedValue: string) => {
    setSelectedDate(selectedValue);
  }, []);

  const filteredData = useMemo(
    () =>
      selectedDate
        ? salaryData.filter((salary) => salary.date === selectedDate)
        : salaryData,
    [selectedDate, salaryData]
  );

  return (
    <S.SalarySection>
      <S.Title style={{ position: 'relative', top: '0' }}>급여 내역</S.Title>
      {salaryData.length > 0 ? (
        <>
          <S.SalaryControls>
            <Dropdown
              title="급여 일자를 선택해주세요"
              options={options}
              onSelect={(option) => handleDateChange(String(option.value))}
            />
          </S.SalaryControls>{' '}
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
              {filteredData.slice(0, 3).map((salary, index) => (
                <S.TableRow key={index}>
                  <S.TableData>{salary.date}</S.TableData>
                  <S.TableData style={{ color: '#14b8a6' }}>
                    {formatCurrency(salary.totalPayment)}
                  </S.TableData>
                  <S.TableData>
                    {formatCurrency(salary.actualPayment)}
                  </S.TableData>
                  <S.TableData>
                    <S.ButtonWrapper>
                      <Button onClick={() => handleModalOpen(salary)}>
                        급여 명세서 확인
                      </Button>
                    </S.ButtonWrapper>
                  </S.TableData>
                </S.TableRow>
              ))}
            </tbody>
          </S.Table>
        </>
      ) : (
        <S.MessageWrapper>
          <S.Message>급여 내역이 없습니다.</S.Message>
        </S.MessageWrapper>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedSalary={selectedSalary}
      />
    </S.SalarySection>
  );
};

export default SalaryInfoSection;
