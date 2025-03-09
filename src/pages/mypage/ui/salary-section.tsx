import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAvailableSalaryDates } from '@/redux/salary-slice';
import * as S from '../styles/salary-section.styles';
import Modal from './salary-modal';
import Dropdown from '../../../shared/dropdown/Dropdown';
import Button from '../../../shared/button/Button';
import { auth, db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const user = auth.currentUser;

  //Firebase에서 급여 데이터 가져오기
  const fetchSalaryData = useCallback(async () => {
    if (!user) return;

    const salaryRef = collection(db, 'users', user.uid, 'salary');
    const querySnapshot = await getDocs(salaryRef);
    const salaries: SalaryData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Firestore Timestamp -> Date 변환
      const formattedDate = data.date.toDate();
      const rawDate = formattedDate.getTime();
      const formattedDateString = `${formattedDate.getFullYear()}년 ${formattedDate.getMonth() + 1}월 ${formattedDate.getDate()}일`;

      return {
        id: doc.id,
        ...data,
        rawDate,
        date: formattedDateString, // 변환된 날짜 값 저장
      } as SalaryData;
    });

    salaries.sort((a, b) => b.rawDate - a.rawDate);

    setSalaryData(salaries);

    // Redux에 "급여 일자 리스트" 저장
    const salaryDates = salaries.map((salary) => salary.date);
    dispatch(setAvailableSalaryDates(salaryDates));
  }, [user, dispatch]);

  //컴포넌트 마운트 시 급여 데이터 로드
  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  const handleModalOpen = useCallback((salaryDetail: SalaryData) => {
    setSelectedSalary(salaryDetail);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSalary(null);
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return value < 0
      ? `-${Math.abs(value).toLocaleString()}원`
      : `${value.toLocaleString()}원`;
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
      <S.SalaryControls>
        <Dropdown
          title="급여 일자를 선택해주세요"
          options={options}
          onSelect={(option) => handleDateChange(String(option.value))}
        />
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedSalary={selectedSalary}
      />
    </S.SalarySection>
  );
};

export default SalaryInfoSection;
