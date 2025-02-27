import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Dropdown, { OptionType } from '../../widgets/dropdown/Dropdown';
import Button from '../../widgets/button/Button';

// 전역 스타일 적용
const ModalGlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    padding-right: var(--scrollbar-width, 0px); // 스크롤바 너비만큼 패딩 추가
  }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.article`
  background-color: #fff;
  border-radius: 12px;
  width: 400px;
  height: 550px;
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
  margin: 0 0 10px 0;
  width: 100%;
  text-align: center;
`;

const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const FormLabel = styled.label`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;

const MemoInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #b2b2b2;
  box-sizing: border-box;
  &::placeholder {
    vertical-align: middle;
  }
`;

const MemoTextarea = styled.textarea`
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #b2b2b2;
  resize: none;
  line-height: 20px;
  box-sizing: border-box;
  &::placeholder {
    vertical-align: middle;
  }
  appearance: none;
`;

const LargerTextarea = styled(MemoTextarea)`
  height: 90px;
`;

const DateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 48%;
`;

const DateLabel = styled.label`
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 5px;
`;

const DateInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #b2b2b2;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
`;

const ActionButton = styled(Button)`
  width: 120px;
  height: 40px;
  border-radius: 4px;
`;

interface MemoModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  titleText: string;
  contentText: string;
  eventType: string;
  startDate: string;
  endDate: string;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onEventTypeChange: (type: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const CalendarModal: React.FC<MemoModalProps> = ({
  isOpen,
  selectedDate,
  titleText,
  contentText,
  eventType,
  startDate,
  endDate,
  onTitleChange,
  onContentChange,
  onEventTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSave,
  onClose,
}) => {
  // 이벤트 타입에 해당하는 OptionType 찾기
  const getSelectedOption = (): OptionType | undefined => {
    const options = [
      { label: '회의', value: '1' },
      { label: '출장', value: '2' },
      { label: '회식', value: '3' },
      { label: '휴가', value: '4' },
      { label: '회의', value: '5' },
    ];

    if (!eventType) return undefined;
    return options.find((option) => option.value === eventType);
  };

  // 모달이 열릴 때 스크롤바 너비를 계산하고 body 클래스 추가
  React.useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`
      );
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  // 모달 요소를 document.body에 포탈로 렌더링
  return ReactDOM.createPortal(
    <>
      <ModalGlobalStyle />
      <ModalOverlay role="dialog" aria-modal="true" onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>업무추가</ModalTitle>

          <FormRow>
            <FormLabel htmlFor="title">일정 제목</FormLabel>
            <MemoInput
              id="title"
              type="text"
              value={titleText}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="업무 제목을 입력하세요"
            />
          </FormRow>

          <FormRow>
            <FormLabel>일정 유형</FormLabel>
            <Dropdown
              title="일정 유형을 선택 해주세요"
              options={[
                { label: '회의', value: '1' },
                { label: '출장', value: '2' },
                { label: '회식', value: '3' },
                { label: '휴가', value: '4' },
                { label: '회의', value: '5' },
              ]}
              width="100%"
              height="40px"
              defaultValue={getSelectedOption()}
              onSelect={(option: OptionType) =>
                onEventTypeChange(option.value.toString())
              }
            />
          </FormRow>

          <FormRow>
            <FormLabel htmlFor="content">내용</FormLabel>
            <LargerTextarea
              id="content"
              value={contentText}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="업무 내용을 입력하세요"
            />
          </FormRow>

          <DateContainer>
            <DateWrapper>
              <DateLabel htmlFor="startDate">시작일</DateLabel>
              <DateInput
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </DateWrapper>
            <DateWrapper>
              <DateLabel htmlFor="endDate">종료일</DateLabel>
              <DateInput
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </DateWrapper>
          </DateContainer>

          <ButtonContainer>
            <ActionButton
              typeStyle="rounded"
              variant="outlined"
              onClick={onClose}
            >
              삭제
            </ActionButton>
            <ActionButton onClick={onSave}>저장</ActionButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </>,
    document.body // 모달을 body에 직접 렌더링
  );
};

export default CalendarModal;
