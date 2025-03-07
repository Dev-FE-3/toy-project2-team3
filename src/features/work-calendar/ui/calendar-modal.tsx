import React, { ChangeEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dropdown, { OptionType } from '../../../shared/dropdown/Dropdown';
import {
  ModalGlobalStyle,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormRow,
  FormLabel,
  CustomSizeDropdown,
  MemoInput,
  LargerTextarea,
  DateContainer,
  DateWrapper,
  DateLabel,
  DateInput,
  ButtonContainer,
  MintButtonModal,
  DeleteButton,
} from '../styles/calendar-modal.style';

interface MemoModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  titleText: string;
  contentText: string;
  eventType: string;
  startDate: string;
  endDate: string;
  isNewEvent: boolean;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onEventTypeChange: (type: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
}

const CalendarModal: React.FC<MemoModalProps> = ({
  isOpen,
  selectedDate,
  titleText,
  contentText,
  eventType,
  startDate,
  endDate,
  isNewEvent,
  onTitleChange,
  onContentChange,
  onEventTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSave,
  onClose,
  onDelete,
  loading = false,
}) => {
  // 이벤트 타입에 해당하는 OptionType 찾기
  const getSelectedOption = (): OptionType | undefined => {
    const options = [
      { label: '회의', value: '1' },
      { label: '출장', value: '2' },
      { label: '휴가', value: '3' },
    ];

    if (!eventType) return undefined;
    return options.find((option) => option.value === eventType);
  };

  // 모달이 열릴 때 스크롤바 너비를 계산하고 body 클래스 추가
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '17px'; // 스크롤바 너비만큼 패딩 추가
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  // 모달 요소를 document.body에 포탈로 렌더링
  return ReactDOM.createPortal(
    <>
      <ModalGlobalStyle />
      <ModalOverlay role="dialog" aria-modal="true" onClick={onClose}>
        <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <ModalTitle>{isNewEvent ? '업무 추가' : '업무 수정'}</ModalTitle>

          <FormRow>
            <FormLabel htmlFor="title">일정 제목</FormLabel>
            <MemoInput
              id="title"
              type="text"
              value={titleText}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onTitleChange(e.target.value)
              }
              placeholder="업무 제목을 입력하세요"
              disabled={loading}
            />
          </FormRow>

          <FormRow>
            <FormLabel>일정 유형</FormLabel>
            <CustomSizeDropdown
              title="일정 유형을 선택 해주세요"
              options={[
                { label: '회의', value: '1' },
                { label: '출장', value: '2' },
                { label: '휴가', value: '3' },
              ]}
              width="100%"
              height="40px"
              defaultValue={getSelectedOption()}
              onSelect={(option) => onEventTypeChange(option.value as string)}
            />
          </FormRow>

          <FormRow>
            <FormLabel htmlFor="content">내용</FormLabel>
            <LargerTextarea
              id="content"
              value={contentText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                onContentChange(e.target.value)
              }
              placeholder="업무 내용을 입력하세요"
              disabled={loading}
            />
          </FormRow>

          <DateContainer>
            <DateWrapper>
              <DateLabel htmlFor="startDate">시작일</DateLabel>
              <DateInput
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onStartDateChange(e.target.value)
                }
                disabled={loading}
              />
            </DateWrapper>
            <DateWrapper>
              <DateLabel htmlFor="endDate">종료일</DateLabel>
              <DateInput
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onEndDateChange(e.target.value)
                }
                disabled={loading}
              />
            </DateWrapper>
          </DateContainer>

          <ButtonContainer>
            {isNewEvent ? (
              <MintButtonModal
                typeStyle="rounded"
                variant="outlined"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </MintButtonModal>
            ) : (
              <DeleteButton
                typeStyle="rounded"
                variant="outlined"
                onClick={onDelete}
                disabled={loading}
              >
                삭제
              </DeleteButton>
            )}
            <MintButtonModal
              variant={isNewEvent ? 'filled' : 'outlined'}
              onClick={onSave}
              disabled={loading}
            >
              {loading ? '처리 중...' : isNewEvent ? '추가' : '저장'}
            </MintButtonModal>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </>,
    document.body
  );
};

export default CalendarModal;
