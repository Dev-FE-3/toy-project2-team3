import React from 'react';
import ReactDOM from 'react-dom';
import { ModalGlobalStyle, ModalOverlay } from '../styles/calendar-modal.style';
import {
  CompactModalContent,
  MessageContainer,
  ConfirmationTitle,
  CancelButton,
  ConfirmDeleteButton,
  ConfirmButtonContainer,
} from '../styles/confirmation-modal.style';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <ModalGlobalStyle />
      <ModalOverlay role="dialog" aria-modal="true" onClick={onCancel}>
        <CompactModalContent
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <ConfirmationTitle>{title}</ConfirmationTitle>
          <MessageContainer>{message}</MessageContainer>
          <ConfirmButtonContainer>
            <CancelButton
              typeStyle="rounded"
              variant="outlined"
              onClick={onCancel}
              style={{ width: '112px', height: '40px' }}
            >
              취소
            </CancelButton>
            <ConfirmDeleteButton
              typeStyle="rounded"
              variant="filled"
              onClick={onConfirm}
              style={{ width: '112px', height: '40px' }}
            >
              삭제
            </ConfirmDeleteButton>
          </ConfirmButtonContainer>
        </CompactModalContent>
      </ModalOverlay>
    </>,
    document.body
  );
};

export default ConfirmationModal;
