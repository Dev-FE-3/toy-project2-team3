// import React, { ChangeEvent, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import Dropdown, { OptionType } from '../../../shared/dropdown/Dropdown';
// import {
//   ModalGlobalStyle,
//   ModalOverlay,
//   ModalContent,
//   ModalTitle,
//   FormRow,
//   FormLabel,
//   CustomSizeDropdown,
//   MemoInput,
//   LargerTextarea,
//   DateContainer,
//   DateWrapper,
//   DateLabel,
//   DateInput,
//   ButtonContainer,
//   MintButtonModal,
//   DeleteButton,
// } from '../styles/calendar-modal.style';

// interface MemoModalProps {
//   isOpen: boolean;
//   selectedDate: Date | null;
//   titleText: string;
//   contentText: string;
//   eventType: string;
//   startDate: string;
//   endDate: string;
//   isNewEvent: boolean;

//   onDelete: () => void;
// }

// const CalendarDeleteModal: React.FC<MemoModalProps> = ({
//   isOpen,
//   selectedDate,
//   titleText,
//   contentText,
//   eventType,
//   onDelete,
// }) => {
//   // 이벤트 타입에 해당하는 OptionType 찾기
//   const getSelectedOption = (): OptionType | undefined => {
//     const options = [
//       { label: '회의', value: '1' },
//       { label: '출장', value: '2' },
//       { label: '휴가', value: '3' },
//     ];

//     if (!eventType) return undefined;
//     return options.find((option) => option.value === eventType);
//   };

//   // 모달이 열릴 때 스크롤바 너비를 계산하고 body 클래스 추가
//   useEffect(() => {
//     if (isOpen) {
//       const scrollbarWidth =
//         window.innerWidth - document.documentElement.clientWidth;
//       document.body.style.setProperty(
//         '--scrollbar-width',
//         `${scrollbarWidth}px`
//       );
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }

//     // 컴포넌트 언마운트 시 클래스 제거
//     return () => {
//       document.body.classList.remove('modal-open');
//     };
//   }, [isOpen]);

//   if (!isOpen || !selectedDate) return null;

//   // 모달 요소를 document.body에 포탈로 렌더링
//   return ReactDOM.createPortal(
//     <>
//       <ModalGlobalStyle />
//       <ModalOverlay role="dialog" aria-modal="true" onClick={onClose}>
//         <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
//           <ModalTitle>{isNewEvent ? '업무 추가' : '업무 수정'}</ModalTitle>

//           <FormRow>
//             <FormLabel htmlFor="title">일정 제목</FormLabel>
//             <MemoInput
//               id="title"
//               type="text"
//               value={titleText}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 onTitleChange(e.target.value)
//               }
//               placeholder="업무 제목을 입력하세요"
//             />
//           </FormRow>

//           <FormRow>
//             <FormLabel>일정 유형</FormLabel>
//             <CustomSizeDropdown
//               title="일정 유형을 선택 해주세요"
//               options={[
//                 { label: '회의', value: '1' },
//                 { label: '출장', value: '2' },
//                 { label: '휴가', value: '3' },
//               ]}
//               width="100%"
//               height="40px"
//               defaultValue={getSelectedOption()}
//               onSelect={(option: OptionType) =>
//                 onEventTypeChange(option.value.toString())
//               }
//             />
//           </FormRow>

//           <FormRow>
//             <FormLabel htmlFor="content">내용</FormLabel>
//             <LargerTextarea
//               id="content"
//               value={contentText}
//               onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                 onContentChange(e.target.value)
//               }
//               placeholder="업무 내용을 입력하세요"
//             />
//           </FormRow>

//           <DateContainer>
//             <DateWrapper>
//               <DateLabel htmlFor="startDate">시작일</DateLabel>
//               <DateInput
//                 id="startDate"
//                 type="date"
//                 value={startDate}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   onStartDateChange(e.target.value)
//                 }
//               />
//             </DateWrapper>
//             <DateWrapper>
//               <DateLabel htmlFor="endDate">종료일</DateLabel>
//               <DateInput
//                 id="endDate"
//                 type="date"
//                 value={endDate}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   onEndDateChange(e.target.value)
//                 }
//               />
//             </DateWrapper>
//           </DateContainer>

//           <ButtonContainer>
//             {isNewEvent ? (
//               <MintButtonModal
//                 typeStyle="rounded"
//                 variant="outlined"
//                 onClick={onClose}
//               >
//                 취소
//               </MintButtonModal>
//             ) : (
//               <DeleteButton
//                 typeStyle="rounded"
//                 variant="outlined"
//                 onClick={onDelete}
//               >
//                 삭제
//               </DeleteButton>
//             )}
//             <MintButtonModal
//               variant={isNewEvent ? 'filled' : 'outlined'}
//               onClick={onSave}
//             >
//               {isNewEvent ? '추가' : '저장'}
//             </MintButtonModal>
//           </ButtonContainer>
//         </ModalContent>
//       </ModalOverlay>
//     </>,
//     document.body
//   );
// };

// export default CalendarDeleteModal;
