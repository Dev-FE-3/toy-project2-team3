// MemoModal.tsx
import React from 'react';
import styled from 'styled-components';
import DropdownSample from '../../widgets/dropdown/dropdownSample';

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
  font-weight: bold;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #333;
`;

const MemoHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.1px;
  margin-bottom: 5px;
`;

const MemoTextarea = styled.textarea`
  width: 360px;
  min-height: 90px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  margin-bottom: 16px;
  resize: vertical;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  display: flex;
  width: 178px;
  height: 40px;
  padding: 0px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 400;

  &.cancel {
    background-color: #f5f5f5;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  }

  &.save {
    background-color: #2ac1bc;
    color: white;
    &:hover {
      background-color: #2ac1bc;
    }
  }
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
        <label>
          <DropdownSample />
        </label>
        <MemoHeader>내용</MemoHeader>
        <MemoTextarea
          value={memoText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="업무 내용을 입력하세요"
        />
        <label>
          시작일
          <input type="date" />
        </label>
        <label>
          종료일
          <input type="date" />
        </label>
        <ModalActions>
          <Button className="cancel" onClick={onClose}>
            취소
          </Button>
          <Button className="save" onClick={onSave}>
            저장
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CalendarModal;
