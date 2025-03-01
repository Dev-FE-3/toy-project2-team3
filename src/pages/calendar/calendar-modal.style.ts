// calendar-modal.styles.ts 파일을 생성하거나 경로 확인
import styled, { createGlobalStyle } from 'styled-components';
import Button from '../../shared/button/Button';

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

// 나머지 스타일 컴포넌트...
export const ModalContent = styled.article`
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

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
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
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;

export const MemoInput = styled.input`
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

export const MemoTextarea = styled.textarea`
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

export const LargerTextarea = styled(MemoTextarea)`
  height: 90px;
`;

export const DateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 48%;
`;

export const DateLabel = styled.label`
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 5px;
`;

export const DateInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #b2b2b2;
  box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
`;

export const ActionButton = styled(Button)`
  width: 120px;
  height: 40px;
  border-radius: 4px;
`;
