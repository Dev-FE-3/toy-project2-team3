/*import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '@/redux/store';
import Dropdown from './../../shared/dropdown/Dropdown';

// Dropdown 컴포넌트의 Option 타입 정의 (Dropdown.tsx 파일에 있는 타입과 일치해야 함)
interface OptionType {
  label: string;
  value: string | number;
}

// Extract query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SalaryCorrection= () => {
  const query = useQuery();
  const monthFromQuery = query.get('month');

  // 드롭다운 기본값 설정
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    monthFromQuery
  );

  // Redux에서 급여 날짜 리스트 가져오기
  const availableSalaryDates = useSelector(
    (state: RootState) => state.salary.availableSalaryDates
  );

  // 드롭다운 옵션 구성
  const options: OptionType[] = availableSalaryDates.map((date) => {
    const month = date.includes('년')
      ? date.split('년 ')[1].split('월')[0] + '월'
      : date;

    return {
      label: month,
      value: month,
    };
  });

  // 드롭다운 선택 처리 - OptionType 타입으로 변경
  const handleMonthSelect = (option: OptionType) => {
    setSelectedMonth(String(option.value));
  };

  return (
    <div>
      <h1>급여 정정 신청</h1>
      <Dropdown
        title="급여 월을 선택해주세요"
        options={options}
        defaultValue={
          monthFromQuery
            ? { label: monthFromQuery, value: monthFromQuery }
            : undefined
        }
        onSelect={handleMonthSelect}
      />

      
    </div>
  );
};

export default SalaryCorrection;
*/
