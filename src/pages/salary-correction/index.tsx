import {
  ReactNode,
  JSX,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as S from '../../pages/salary-correction/style';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dropdown, { OptionType } from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { auth, app, db } from '@/firebase';
import { collection, getDocs, Timestamp, addDoc } from 'firebase/firestore';

interface SalaryCorrectionPageProps {
  children?: ReactNode;
}

interface FormDataType {
  salaryLabel: OptionType | null;
  userName: string;
  reason: string;
  details: string;
}

interface CorrectionData {
  id: string;
  correctionDate: Timestamp;
  salaryDate: Timestamp;
  title: string;
  reason: string;
  details: string;
}

const SalaryCorrectionPage = ({
  children,
}: SalaryCorrectionPageProps): JSX.Element => {
  const [user, setUser] = useState(auth.currentUser);
  const [formData, setFormData] = useState<FormDataType>({
    salaryLabel: null,
    userName: '',
    reason: '',
    details: '',
  });
  const [correctionData, setCorrectionData] = useState<CorrectionData[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const availableSalaryDates = useSelector(
    (state: RootState) => state.salary.availableSalaryDates
  );
  const selectedMonth = useMemo(
    () => searchParams.get('month'),
    [searchParams]
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

  const fetchCorrectionData = async () => {
    if (!user) {
      console.warn('사용자가 로그인되지 않았습니다.');
      return;
    }
    try {
      const correctionRef = collection(db, 'users', user.uid, 'correction');
      const querySnapshot = await getDocs(correctionRef);
      console.log(querySnapshot.docs);
      const corrections: CorrectionData[] = querySnapshot.docs.map((doc) => {
        console.log(doc.data());
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as CorrectionData;
      });
      setCorrectionData(() => corrections);
    } catch (err) {
      console.log(err);
    }
  };

  const addCorrectionFrom = async (correctionForm: FormDataType) => {
    try {
      const docRef = await addDoc(collection(db, 'correction'), {
        correctionDate: Timestamp.now(),
        salaryDate: Timestamp.now(),
        title: 'test1',
        reason: 'testreason1',
        details: 'testdetail1',
      });

      console.log(`문서 추가 완료! 문서 ID: ${docRef.id}`);
    } catch (error) {
      console.error('문서 추가 실패:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchCorrectionData();
  }, [user, searchParams]);

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
      addCorrectionFrom(formData);
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
