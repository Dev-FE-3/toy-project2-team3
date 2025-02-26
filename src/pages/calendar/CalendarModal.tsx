// MemoModal.tsx
import React from 'react';
import styled from 'styled-components';
import Dropdown from '../../widgets/dropdown/Dropdown';
import Button from '../../widgets/button/Button';

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

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 12px;
  width: 400px;
  display: flex;
  width: 400px;
  padding: 32px 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ModalHeader = styled.div`
  text-align: 'left'
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
`;

const MemoHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1px;
  width: 360px;
  height: 22px;
`;

const MemoTextarea = styled.textarea`
  display: flex;
  width: 360px;
  height: 40px;
  padding: 4px 16px;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  width: 176px;
  height: 34px;
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid #b2b2b2;
`;

interface MemoModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  memoText: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const CalendarModal: React.FC<MemoModalProps> = ({
  isOpen,
  selectedDate,
  memoText,
  onTextChange,
  onSave,
  onClose,
}) => {
  if (!isOpen || !selectedDate) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>업무추가</ModalHeader>
        <MemoHeader>일정 제목</MemoHeader>
        <MemoTextarea
          value={memoText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="업무 제목을 입력하세요"
        />
        <MemoHeader>일정 유형</MemoHeader>

        <Dropdown
          title="일정 유형을 선택 해주세요"
          options={[
            { label: '회의', value: '1' },
            { label: '출장', value: '2' },
            { label: '회식', value: '3' },
            { label: '휴가', value: '4' },
            { label: '회의', value: '5' },
          ]}
          width="395px"
          height="40px"
          border-radius="4px"
        />

        <MemoHeader>내용</MemoHeader>
        <MemoTextarea
          style={{ width: '360px', height: '90px' }}
          value={memoText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="업무 내용을 입력하세요"
        />
        <DateContainer>
          <label>
            StyledInput시작일
            <StyledInput type="date" />
          </label>
          <label style={{ marginLeft: '16px' }}>
            종료일
            <StyledInput type="date" />
          </label>
        </DateContainer>
        <ModalActions>
          <Button onClick={onClose}>삭제</Button>

          <Button onClick={onSave}>저장</Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CalendarModal;
