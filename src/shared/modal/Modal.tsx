import ReactDOM from 'react-dom';
import { styled } from 'styled-components';
import Button from '../button/Button';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  confirmText: string;
  onConfirm: () => void;
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 88px;
  width: 480px;
`;

const ModalMessage = styled.p`
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
  display: flex;
  justify-content: start;
`;

const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: end;
`;

const CommonModal = ({
  isOpen,
  setIsOpen,
  message,
  onConfirm,
  confirmText,
}: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Modal role="dialog" aria-modal="true">
      <ModalContent>
        <ModalMessage>{message}</ModalMessage>
        <ModalButtonWrapper>
          <Button
            variant="outlined"
            isDelete={true}
            onClick={() => setIsOpen(false)}
          >
            닫기
          </Button>
          <Button isDelete={true} onClick={onConfirm}>
            {confirmText}
          </Button>
        </ModalButtonWrapper>
      </ModalContent>
    </Modal>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default CommonModal;
