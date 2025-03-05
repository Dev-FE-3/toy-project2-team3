import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSalary, clearSelectedSalary } from '@/redux/salary-slice';
import * as S from '../styles/salary-section.styles';
import Modal from './salary-modal';
import Dropdown from '../../../shared/dropdown/Dropdown';
import Button from '../../../shared/button/Button';
import { auth, db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

// 급여 데이터 인터페이스 정의
export interface SalaryData {
  id: string;
  date: string;
  rawDate: Date;
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

// 드롭다운 옵션 인터페이스
interface DropdownOption {
  label: string;
  value: string;
}

const SalaryInfoSection: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const user = auth.currentUser;

  //급여 데이터 가져오기
  const fetchSalaryData = useCallback(async () => {
    if (!user) return;

    const salaryRef = collection(db, 'users', user.uid, 'salary');
    const querySnapshot = await getDocs(salaryRef);

    const salaries: SalaryData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Timestamp → Date 변환 후 포맷팅
      const rawDate = data.date?.toDate();
      const formattedDate = rawDate
        ? `${rawDate.getFullYear()}년 ${rawDate.getMonth() + 1}월 ${rawDate.getDate()}일`
        : '날짜 없음';

      return {
        id: doc.id,
        ...data,
        rawDate,
        date: formattedDate, // 변환된 날짜 값 저장
      } as SalaryData;
    });

    salaries.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    setSalaryData(salaries);
  }, [user]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  // 모달 열기 + Redux에 급여 데이터 저장
  const handleModalOpen = useCallback(
    (salaryDetail: SalaryData) => {
      dispatch(setSelectedSalary(salaryDetail)); // Redux에 저장
      setIsModalOpen(true);
    },
    [dispatch]
  );

  // 모달 닫기
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    dispatch(clearSelectedSalary()); // 모달 닫을 때 Redux 상태 초기화
  }, [dispatch]);

  // Memoize currency formatting function
  const formatCurrency = useCallback((value: number) => {
    return value < 0
      ? `-₩${Math.abs(value).toLocaleString()}`
      : `₩${value.toLocaleString()}`;
  }, []);

  const options: DropdownOption[] = useMemo(
    () =>
      salaryData.map((salary) => ({
        label: salary.date,
        value: salary.date,
      })),
    [salaryData]
  );

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
      <S.SalaryControls>
        <Dropdown
          title="급여 일자를 선택해주세요"
          options={options}
          onSelect={(option) => handleDateChange(String(option.value))}
        />
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
          {filteredData.slice(0, 3).map((salary, index) => (
            <S.TableRow key={index}>
              <S.TableData>{salary.date}</S.TableData>
              <S.TableData style={{ color: '#14b8a6' }}>
                {formatCurrency(salary.totalPayment)}
              </S.TableData>
              <S.TableData>{formatCurrency(salary.actualPayment)}</S.TableData>
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
      <Modal isOpen={isModalOpen} onClose={handleModalClose} />
    </S.SalarySection>
  );
};

export default React.memo(SalaryInfoSection);
