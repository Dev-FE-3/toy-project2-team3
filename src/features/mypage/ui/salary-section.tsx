import { useState, useMemo, useCallback } from 'react';
import * as S from '@/features/mypage/styles/salary-section.styles';
import Modal from '@/features/mypage/ui/salary-modal';
import Dropdown from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useFetchSalaryData } from '@/features/mypage/hooks/useFetchSalaryData';
import { formatCurrency } from '@/utils/formatCurrency';
import { SalaryData } from '@/features/mypage/types/salaryTypes';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/loading.json';

interface DropdownOption {
  label: string;
  value: string;
}

const SalaryInfoSection = () => {
  const { salaryData, isLoading, error } = useFetchSalaryData();
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
    () => [
      { label: '전체', value: 'all' },
      ...salaryData.map((salary) => ({
        label: salary.date,
        value: salary.date,
      })),
    ],
    [salaryData]
  );

  //드롭다운 선택 시 필터링
  const handleDateChange = useCallback((selectedValue: string) => {
    setSelectedDate(selectedValue === 'all' ? null : selectedValue);
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
      <S.Title>급여 내역</S.Title>
      {isLoading ? (
        <S.MessageWrapper>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: '180px', height: '180px' }}
          />
        </S.MessageWrapper>
      ) : error ? (
        <S.MessageWrapper>
          <S.Message>데이터를 불러오는 중 오류가 발생했습니다</S.Message>
        </S.MessageWrapper>
      ) : salaryData.length > 0 ? (
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
                <S.TableHeader>
                  <S.HighlightText>총 지급액</S.HighlightText>
                </S.TableHeader>
                <S.TableHeader>실지급액</S.TableHeader>
                <S.TableHeader>
                  <S.HighlightText>급여 명세서</S.HighlightText>
                </S.TableHeader>
              </S.TableRow>
            </thead>

            <tbody>
              {filteredData.slice(0, 3).map((salary, index) => (
                <S.TableRow key={index}>
                  <S.TableData>{salary.date}</S.TableData>
                  <S.TableData>
                    <S.HighlightText>
                      {formatCurrency(salary.totalPayment)}
                    </S.HighlightText>
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
