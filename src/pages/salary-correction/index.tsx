import { JSX, useEffect, useState, useMemo } from 'react';
import * as S from '../../pages/salary-correction/style';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dropdown, { OptionType } from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { auth, db } from '@/firebase';
import { collection, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import CorrectionList from './ui/correctionList';

interface FormDataType {
  salaryLabel: OptionType | null;
  personInCharge: string;
  reason: string;
  details: string;
}

export interface CorrectionDataType {
  id: string;
  correctionDate: Timestamp;
  title: string;
  reason: string;
  details: string;
}

const SalaryCorrectionPage = (): JSX.Element => {
  const [user, setUser] = useState(auth.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    salaryLabel: null,
    personInCharge: '',
    reason: '',
    details: '',
  });
  const [correctionData, setCorrectionData] = useState<CorrectionDataType[]>(
    []
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const availableSalaryDates = useSelector(
    (state: RootState) => state.salary.availableSalaryDates
  );

  //드롭다운 객체 생성
  const dropdownOptions: OptionType[] = useMemo(
    () =>
      availableSalaryDates.map((date, index) => ({
        label: date + ' 급여',
        value: index,
      })),
    [availableSalaryDates]
  );

  //드롭다운 관련 query parameter 파싱
  const selectedMonth = useMemo(
    () => searchParams.get('month'),
    [searchParams]
  );

  //드롭다운 옵션 query parameter 기본 값 할당
  const defaultOption = useMemo(() => {
    return dropdownOptions.find(
      (option) => selectedMonth && option.label.includes(selectedMonth)
    );
  }, [dropdownOptions, selectedMonth]);

  //정정 내역 데이터 불러오기
  const fetchCorrectionData = async () => {
    //로그아웃 필터링
    try {
      if (!user) {
        throw new Error('사용자가 로그인되지 않았습니다.');
      }
      const correctionRef = collection(db, 'users', user.uid, 'correction');
      const querySnapshot = await getDocs(correctionRef);
      const corrections: CorrectionDataType[] = querySnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as CorrectionDataType;
        }
      );
      setCorrectionData(() => corrections);
    } catch (err) {
      console.log(err);
    }
  };

  const validateFormData = (formData: FormDataType): string | null => {
    if (!formData.salaryLabel) return '정정할 급여를 선택해주세요.';
    if (!formData.personInCharge.trim()) return '담당자를 입력해주세요.';
    if (!formData.reason.trim()) return '사유를 입력해주세요.';
    if (!formData.details.trim()) return '상세 사유를 입력해주세요.';
    return null;
  };

  const postCorrectionFrom = async (correctionForm: FormDataType) => {
    if (!user?.uid) {
      console.warn('사용자가 로그인되지 않았습니다.');
      return;
    }
    try {
      const correctionRef = collection(db, 'users', user.uid, 'correction');
      await addDoc(correctionRef, {
        correctionDate: Timestamp.now(),
        title: correctionForm.salaryLabel?.label,
        personInCharge: correctionForm.personInCharge.trim(),
        reason: correctionForm.reason.trim(),
        details: correctionForm.details.trim(),
      });

      console.log(`추가 성공, 문서 ID: ${correctionRef.id}`);
    } catch (error) {
      console.error('추가 실패:', error);
    }
  };

  useEffect(() => {
    //로그아웃 추적
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    //언마운트 시 클린업
    return () => unsubscribe();
  }, []);

  // defaultOption이 설정되면 formData에도 반영
  useEffect(() => {
    if (defaultOption) {
      setFormData((prev) => ({
        ...prev,
        salaryLabel: defaultOption,
      }));
    }
  }, [defaultOption]);

  useEffect(() => {
    fetchCorrectionData();
  }, [user, searchParams]);

  //제출하기 버튼 동작함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting === true) return;
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    if (submitter.name !== 'submitBtn') return;
    const validationError = validateFormData(formData);
    if (validationError) {
      alert(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      await postCorrectionFrom(formData);
      await fetchCorrectionData();
      setFormData(() => ({
        salaryLabel: null,
        personInCharge: '',
        reason: '',
        details: '',
      }));
      console.log('제출하기 작업 완료');
    } catch (error) {
      console.warn(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //드롭다운 선택 시 state 업데이트 함수
  const handleSelect = (option: OptionType) => {
    if (formData.salaryLabel !== option) {
      setFormData((prev) => ({ ...prev, salaryLabel: option }));
    }
  };

  //input 태그 입력 시 state 업데이트 함수
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
          <CorrectionList correctionData={correctionData} />
        </S.ListTile>
        <S.FormTile onSubmit={() => {}}>
          <S.TileTitle>정정 신청서 작성</S.TileTitle>

          <S.InputForm
            onSubmit={(event) => {
              handleSubmit(event);
            }}
          >
            <Dropdown
              title="급여 일자를 선택해주세요"
              options={dropdownOptions}
              defaultValue={defaultOption}
              width="100%"
              onSelect={(option) => handleSelect(option)}
            />
            <S.Input
              value={formData.personInCharge}
              name="personInCharge"
              onChange={(event) => handleInputChange(event)}
              placeholder="정정을 요청할 담당자를 입력해주세요"
              disabled={isSubmitting}
            />
            <S.Input
              value={formData.reason}
              name="reason"
              onChange={(event) => handleInputChange(event)}
              placeholder="정정 사유를 입력해주세요"
              disabled={isSubmitting}
            />
            <S.Textarea
              value={formData.details}
              name="details"
              onChange={(event) => handleInputChange(event)}
              placeholder="상세 설명을 입력해주세요"
              rows={1}
              disabled={isSubmitting}
            />
            <Button
              name="submitBtn"
              type="submit"
              typeStyle="rounded"
              variant="filled"
              disabled={isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '제출하기'}
            </Button>
          </S.InputForm>
        </S.FormTile>
      </S.TileContainer>
    </>
  );
};

export default SalaryCorrectionPage;
