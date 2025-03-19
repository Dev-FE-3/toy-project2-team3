import styled from 'styled-components';
import {
  ModalContent,
  ModalTitle,
  ButtonContainer,
} from './calendar-modal.style';
import Button from '@/shared/button/Button';

export const CompactModalContent = styled(ModalContent)`
  width: 480px;
  height: 200px;
`;

export const MessageContainer = styled.div`
  margin: 20px 0;
  text-align: left;
  line-height: 1.5;
`;

export const ConfirmationTitle = styled(ModalTitle)`
  ${({ theme }) => theme.typography.heading3};
  text-align: left;
`;

export const ConfirmButtonContainer = styled(ButtonContainer)`
  justify-content: flex-end;
  margin-top: auto;
`;

export const CancelButton = styled(Button)`
  ${({ theme }) => `
    width: 112px;
    height: 40px;
    background-color: white;
    color: ${theme.colors.red};
    border: 1px solid ${theme.colors.red};
    font-size: ${theme.typography.menu1.fontSize};
    font-weight: ${theme.typography.menu1.fontWeight};
    &:hover {
      background-color: ${theme.colors.red};
      color: white;
      border: 1px solid ${theme.colors.red};
    }
  `}
`;

export const ConfirmDeleteButton = styled(Button)`
  ${({ theme }) => `
    width: 112px;
    height: 40px;
    background-color: ${theme.colors.red};
    color: white;
    border: 1px solid ${theme.colors.red};
    font-size: ${theme.typography.menu1.fontSize};
    font-weight: ${theme.typography.menu1.fontWeight};
    &:hover {
      background-color: white;
      color: ${theme.colors.red};
      border: 1px solid ${theme.colors.red};
    }
  `}
`;
