import styled from 'styled-components';
import {
  ModalContent,
  ModalTitle,
  ButtonContainer,
} from './calendar-modal.style';
import Button from '../../../shared/button/Button';

export const CompactModalContent = styled(ModalContent)`
  height: 200px;
  max-height: 480px;
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
`;

export const CancelButton = styled(Button)`
  ${({ theme }) => `
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
