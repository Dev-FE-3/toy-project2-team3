import styled, { createGlobalStyle } from 'styled-components';
import Button from '../../../shared/button/Button';
import Dropdown, {
  DropdownHeader,
  DropdownList,
  DropdownItem,
} from '../../../shared/dropdown/Dropdown';

// 전역 스타일 적용
export const ModalGlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
    padding-right: var(--scrollbar-width, 0px);
  }
`;

export const ModalOverlay = styled.div`
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

export const ModalContent = styled.article`
  background-color: #fff;
  border-radius: 12px;
  width: 400px;
  height: 550px;
  display: flex;
  padding: 25px 25px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
`;

export const ModalTitle = styled.div`
  ${({ theme }) => theme.typography.heading3};
  margin: 0 0 10px 0;
  width: 100%;
  text-align: center;
`;

export const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const FormLabel = styled.label`
  ${({ theme }) => theme.typography.heading4};
  margin-bottom: 5px;
  width: 100%;
  text-align: left;
`;

export const CustomSizeDropdown = styled(Dropdown)`
  font-size: 12px;
  & ${DropdownHeader}, & ${DropdownList}, & ${DropdownItem} {
    font-size: 12px;
  }
`;

export const MemoInput = styled.input`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.grey1};
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  box-sizing: border-box;
  &::placeholder {
    vertical-align: middle;
  }
`;

export const MemoTextarea = styled.textarea`
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  resize: none;
  line-height: 20px;
  box-sizing: border-box;
  &::placeholder {
    vertical-align: middle;
    text-align: left;
  }
  appearance: none;
`;

export const LargerTextarea = styled(MemoTextarea)`
  height: 90px;
  ${({ theme }) => theme.typography.body3};
  vertical-align: middle;
`;

export const DateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 48%;
`;

export const DateLabel = styled.label`
  ${({ theme }) => theme.typography.heading4};
  text-align: left;
`;

export const DateInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  > button {
    width: 178px;
  }
`;

export const EventModalButton = styled(Button)`
  ${({ variant, theme }) =>
    variant === 'filled' &&
    `
    background-color: ${theme.colors.point1};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.point1};
    font-size: ${theme.typography.menu1.fontSize};
    font-weight: ${theme.typography.menu1.fontWeight};
    &:hover {
      background-color: ${theme.colors.white};
      color: ${theme.colors.point1};
      border: 1px solid ${theme.colors.point1};
    } 
  `}

  ${({ variant, theme }) =>
    variant === 'outlined' &&
    `
    background-color: ${theme.colors.white};
    color: ${theme.colors.point1};
    border: 1px solid ${theme.colors.point1};
    font-size: ${theme.typography.menu1.fontSize};
    font-weight: ${theme.typography.menu1.fontWeight};
    &:hover {
      background-color: ${theme.colors.point1};
      color: ${theme.colors.white};
    }
  `}
`;

export const MintButtonModal = styled(Button)`
  ${(props) =>
    props.variant === 'filled' &&
    `
      background-color: ${props.theme.colors.point1};
      border: 1px solid ${props.theme.colors.point1};
      color: white;
      font-size: ${props.theme.typography.menu1.fontSize};
      font-weight: ${props.theme.typography.menu1.fontWeight};
      &:hover {
        background-color: white;
        color: ${props.theme.colors.point1};
        border: 1px solid ${props.theme.colors.point1};
      }
    `}

  ${(props) =>
    props.variant === 'outlined' &&
    `
      background-color: white;
      color: ${props.theme.colors.point1};
      border: 1px solid ${props.theme.colors.point1};
      font-size: ${props.theme.typography.menu1.fontSize};
      font-weight: ${props.theme.typography.menu1.fontWeight};
      &:hover {
        background-color: ${props.theme.colors.point1};
        color: white;
      }
    `}
`;

export const ActionButton = styled(EventModalButton)`
  width: 120px;
  height: 40px;
  border-radius: 4px;
`;

export const DeleteButton = styled(Button)`
  ${(props) =>
    props.variant === 'outlined' &&
    `
  background-color: white;
      color: ${props.theme.colors.red};
      border: 1px solid ${props.theme.colors.red};
font-size: ${props.theme.typography.menu1.fontSize};
       &:hover {
        background-color: ${props.theme.colors.red};
        color: white;
        border: 1px solid ${props.theme.colors.red};
      }
    `}

  ${(props) =>
    props.variant === 'filled' &&
    `
      background-color: ${props.theme.colors.red};
      color: white;
      border: 1px solid ${props.theme.colors.red};
      font-size: ${props.theme.typography.menu1.fontSize};
      &:hover {
        background-color: white;
        color: ${props.theme.colors.red};
        border: 1px solid ${props.theme.colors.red};
      }
    `}
`;
