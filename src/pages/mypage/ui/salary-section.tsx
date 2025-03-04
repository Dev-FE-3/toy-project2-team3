import React, { useState, useEffect } from 'react';
import * as S from '../styles/salary-section.styles';
import Modal from './salary-modal';
import Dropdown from '../../../shared/dropdown/Dropdown';
import Button from '../../../shared/button/Button';
import { auth, db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SalaryInfoSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalaryDetail, setSelectedSalaryDetail] = useState<any>(null);
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const user = auth.currentUser;

  // Firestore에서 여러 개의 급여 데이터 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchSalaryData = async () => {
      if (!user) return;

      const salaryRef = collection(db, 'users', user.uid, 'salary');
      const querySnapshot = await getDocs(salaryRef);

      const salaries = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        // Timestamp → Date 변환 후 포맷팅
        const rawDate = data.date?.toDate();
        const formattedDate = rawDate
          ? `${rawDate.getFullYear()}년 ${rawDate.getMonth() + 1}월 ${rawDate.getDate()}일`
          : '날짜 없음';

        return {
          id: doc.id,
          ...data,
          date: formattedDate, // 변환된 날짜 값 저장
        };
      });

      setSalaryData(salaries);
    };

    fetchSalaryData();
  }, [user]);

  // 🔹 특정 급여 내역을 선택하여 모달 열기
  const handleModalOpen = (salaryDetail: any) => {
    setSelectedSalaryDetail(salaryDetail);
    setIsModalOpen(true);
  };

  // 🔹 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSalaryDetail(null);
  };

  // 🔹 숫자를 화폐 단위(₩)로 변환하는 함수
  const formatCurrency = (value: number) => {
    return value < 0
      ? `-₩${Math.abs(value).toLocaleString()}`
      : `₩${value.toLocaleString()}`;
  };

  const options = salaryData.map((salary) => ({
    label: salary.date, // 드롭다운에 표시될 텍스트
    value: salary.date, // 선택 시 저장될 값
  }));

  const handleDateChange = (selectedValue: string) => {
    setSelectedDate(selectedValue); // 선택된 급여일 업데이트
  };

  const filteredData = selectedDate
    ? salaryData.filter((salary) => salary.date === selectedDate)
    : salaryData; // 선택된 값이 없으면 전체 표시

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
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        salaryDetail={selectedSalaryDetail}
      />
    </S.SalarySection>
  );
};

export default SalaryInfoSection;
