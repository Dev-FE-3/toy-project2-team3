import React from 'react';
import ReactDOM from 'react-dom';
import {
  ModalGlobalStyle,
  ModalOverlay,
} from '@/features/work-calendar/styles/calendar-modal.style';
import * as S from '@/features/work-calendar/styles/confirmation-modal.style';

import { ReactNode } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: ReactNode;
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
        <S.CompactModalContent
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <S.ConfirmationTitle>{title}</S.ConfirmationTitle>
          <S.MessageContainer>{message}</S.MessageContainer>
          <S.ConfirmButtonContainer>
            <S.CancelButton
              typeStyle="rounded"
              variant="outlined"
              onClick={onCancel}
            >
              취소
            </S.CancelButton>
            <S.ConfirmDeleteButton
              typeStyle="rounded"
              variant="filled"
              onClick={onConfirm}
            >
              삭제
            </S.ConfirmDeleteButton>
          </S.ConfirmButtonContainer>
        </S.CompactModalContent>
      </ModalOverlay>
    </>,
    document.body
  );
};

export default ConfirmationModal;
