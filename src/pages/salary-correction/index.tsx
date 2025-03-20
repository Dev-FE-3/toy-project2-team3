import { JSX, useEffect, useState, useMemo } from 'react';
import * as S from '../../pages/salary-correction/style';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dropdown, { OptionType } from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { auth, db } from '@/firebase';
import { collection, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { formatDate } from '@/features/mypage/utils/formatDate';

interface FormDataType {
  salaryLabel: OptionType | null;
  reason: string;
  details: string;
}

export interface CorrectionDataType {
  id: string;
  correctionDate: Timestamp;
  title: string;
  reason: string;
  details: string;
  progress: 'approved' | 'pending' | 'rejected';
}

const progressLabel: {
  approved: string;
  pending: string;
  rejected: string;
} = {
  approved: '승인됨',
  pending: '처리중',
  rejected: '반려됨',
};

const SalaryCorrectionPage = (): JSX.Element => {
  const [user, setUser] = useState(auth.currentUser);
  const [selectedCorrection, setSelectedCorrection] =
    useState<CorrectionDataType>({
      id: '',
      correctionDate: Timestamp.now(),
      title: '급여 정정 신청',
      reason: '사유 없음',
      details: '상세 사유 없음',
      progress: 'pending',
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitMode, setSubmitMode] = useState(true);
  const [formData, setFormData] = useState<FormDataType>({
    salaryLabel: null,

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
      const sortedCorrections = corrections.sort((a, b) =>
        a.correctionDate.seconds > b.correctionDate.seconds ? -1 : 1
      );
      setCorrectionData(() => sortedCorrections);
      console.log('sorted :', sortedCorrections);
    } catch (err) {
      console.log(err);
    }
  };

  //유효성 검사 함수
  const validateFormData = (formData: FormDataType): string | null => {
    if (!formData.salaryLabel) return '정정할 급여를 선택해주세요.';
    if (!formData.reason.trim()) return '사유를 입력해주세요.';
    if (!formData.details.trim()) return '상세 사유를 입력해주세요.';
    return null;
  };

  //파이어 베이스 post 처리 함수
  const postCorrectionFrom = async (correctionForm: FormDataType) => {
    if (!user?.uid) {
      throw new Error('사용자가 로그인되지 않았습니다.');
    }
    try {
      const correctionRef = collection(db, 'users', user.uid, 'correction');
      await addDoc(correctionRef, {
        correctionDate: Timestamp.now(),
        title: correctionForm.salaryLabel?.label,
        reason: correctionForm.reason.trim(),
        details: correctionForm.details.trim(),
        progress: 'pending',
      });

      console.log(`추가 성공, 문서 ID: ${correctionRef.id}`);
    } catch (error) {
      console.error('추가 실패:', error);
    }
  };

  //타임스탬프 -> 날짜 형식 문자열로 변환
  const formatTimestampToDate = (timestamp: Timestamp): string => {
    const rawDate = timestamp.toDate().getTime();
    return formatDate(rawDate);
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
      // alert(validationError);
      toast.warn(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      await postCorrectionFrom(formData);
      await fetchCorrectionData();
      setFormData(() => ({
        salaryLabel: null,
        reason: '',
        details: '',
      }));
      toast.success('제출되었습니다');
    } catch (error) {
      console.log(error);
      toast.error('제출에 실패했습니다');
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

  const handleListItemClick = (item: CorrectionDataType) => {
    if (!item) {
      console.log('리스트 정보 불러오기 실패');
    }
    setSubmitMode(false);
    setSelectedCorrection(item);
  };

  return (
    <>
      <S.BackLink onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
        >
          <path d="M0.499999 6.13398C-0.166667 6.51888 -0.166667 7.48112 0.5 7.86603L9.5 13.0622C10.1667 13.4471 11 12.966 11 12.1962V1.80385C11 1.03405 10.1667 0.552922 9.5 0.937822L0.499999 6.13398Z" />
        </svg>{' '}
        이전 페이지로
      </S.BackLink>
      <S.Title>급여 정정 신청하기</S.Title>
      <S.TileContainer>
        <S.ListTile>
          <S.TileTitle>신청 내역</S.TileTitle>
          <S.ListBox>
            <S.AddListBtn onClick={() => setSubmitMode(true)}>
              <S.IconWrapper
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.37054 9.11714H0.595703V6.88314H7.37054V0.181152H9.62882V6.88314H16.4037V9.11714H9.62882V15.8191H7.37054V9.11714Z" />
              </S.IconWrapper>
            </S.AddListBtn>
            {correctionData.map(
              (item: CorrectionDataType): JSX.Element => (
                <S.ListItem onClick={() => handleListItemClick(item)}>
                  <S.ListTitle>{item.title + ' 정정 신청'}</S.ListTitle>
                  <S.ListBadge $progress={item.progress}>
                    {progressLabel[item.progress]}
                  </S.ListBadge>
                </S.ListItem>
              )
            )}
          </S.ListBox>
        </S.ListTile>

        {isSubmitMode ? (
          <S.FormTile>
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
        ) : (
          <S.InfoTile>
            <S.TileTitle>
              <S.TextColorPoint>{selectedCorrection.title}</S.TextColorPoint>{' '}
              {' 정정신청 내역'}
            </S.TileTitle>
            <S.InfoBox>
              <S.InfoList>
                <S.InfoListTitle>정정 신청일 </S.InfoListTitle>
                <S.InfoListData>
                  {formatTimestampToDate(selectedCorrection.correctionDate)}
                </S.InfoListData>
              </S.InfoList>
              <S.InfoList>
                <S.InfoListTitle>진행상황 </S.InfoListTitle>
                <S.InfoListData>
                  {progressLabel[selectedCorrection.progress]}
                </S.InfoListData>
              </S.InfoList>
              <S.InfoList>
                <S.InfoListTitle>사유 </S.InfoListTitle>
                <S.InfoListData>{selectedCorrection.reason}</S.InfoListData>
              </S.InfoList>
              <S.InfoList>
                <S.InfoListTitle>상세 사유 </S.InfoListTitle>
                <S.InfoListData>{selectedCorrection.details}</S.InfoListData>
              </S.InfoList>
            </S.InfoBox>
          </S.InfoTile>
        )}
      </S.TileContainer>
    </>
  );
};

export default SalaryCorrectionPage;
