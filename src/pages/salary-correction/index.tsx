import { ReactNode, JSX, useRef, useEffect, useState, useMemo } from 'react';
import * as S from '../../pages/salary-correction/style';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dropdown, { OptionType } from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SalaryCorrectionPageProps {
  children?: ReactNode;
}

interface FormDataType {
  salaryLabel: OptionType | null;
  userName: string;
  reason: string;
  details: string;
}

const SalaryCorrectionPage = ({
  children,
}: SalaryCorrectionPageProps): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMonth = useMemo(
    () => searchParams.get('month'),
    [searchParams]
  );
  console.log(selectedMonth);

  const [formData, setFormData] = useState<FormDataType>({
    salaryLabel: null,
    userName: '',
    reason: '',
    details: '',
  });

  const availableSalaryDates = useSelector(
    (state: RootState) => state.salary.availableSalaryDates
  );

  //드롭다운 객체 생성
  const dropdownOptions: OptionType[] = useMemo(
    () =>
      availableSalaryDates.map((date, index) => ({
        label: date,
        value: index,
      })),
    [availableSalaryDates]
  );

  const defaultOptionValue = dropdownOptions.find((option) => {
    if (selectedMonth) {
      return option.label.includes(selectedMonth);
    } else return;
  });

  useEffect(() => {}, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    if (submitter.name === 'submitBtn') {
      setFormData(() => ({
        salaryLabel: null,
        userName: '',
        reason: '',
        details: '',
      }));
      console.log('제출하기 완료');
    }
  };

  const handleSelect = (option: OptionType) => {
    if (formData.salaryLabel !== option) {
      setFormData((prev) => ({ ...prev, salaryLabel: option }));
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <S.BackLink onClick={() => navigate(-1)}>&lt; 이전 페이지로</S.BackLink>
      <S.Title>급여 정정 신청하기</S.Title>
      <S.TileContainer>
        <S.ListTile>
          <S.TileTitle>신청 내역</S.TileTitle>
        </S.ListTile>
        <S.FormTile onSubmit={() => {}}>
          <S.TileTitle>급여 신청서 작성</S.TileTitle>

          <S.InputForm
            onSubmit={(event) => {
              handleSubmit(event);
            }}
          >
            <Dropdown
              title="급여 일자를 선택해주세요"
              options={dropdownOptions}
              defaultValue={defaultOptionValue}
              width="100%"
              onSelect={(option) => handleSelect(option)}
            />
            <S.Input
              value={formData.userName}
              name="userName"
              onChange={(event) => handleInputChange(event)}
              placeholder="이름을 입력해주세요"
            />
            <S.Input
              value={formData.reason}
              name="reason"
              onChange={(event) => handleInputChange(event)}
              placeholder="정정 사유를 입력해주세요"
            />
            <S.Textarea
              value={formData.details}
              name="details"
              onChange={(event) => handleInputChange(event)}
              placeholder="상세 설명을 입력해주세요"
              rows={1} // 최소 1줄
            />
            <Button
              name="submitBtn"
              type="submit"
              typeStyle="rounded"
              variant="filled"
            >
              제출하기
            </Button>
          </S.InputForm>
        </S.FormTile>
      </S.TileContainer>
    </>
  );
};

export default SalaryCorrectionPage;
