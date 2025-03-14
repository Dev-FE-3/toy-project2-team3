import React from 'react';
import { theme } from '@/shared/config/theme';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import * as MS from '../styles/calendar-modal.style';
import * as S from '../styles/event-list-modal.styles';

// EventData 인터페이스 정의
interface EventData {
  id?: string;
  title: string;
  type: string;
  content: string;
  startDate: string;
  endDate: string;
  dateKey: string;
}

interface EventListModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  events: EventData[];
  onSelectEvent: (event: EventData) => void;
  onAddNewEvent: (date: Date) => void;
  onClose: () => void;
}

// 이벤트 타입 이름 가져오기
const getEventTypeName = (typeValue: string): string => {
  switch (typeValue) {
    case '1':
      return '회의';
    case '2':
      return '출장';
    case '3':
      return '휴가';
    default:
      return '';
  }
};

// 이벤트 타입 색상 가져오기
const getEventTypeColor = (typeValue: string): string => {
  switch (typeValue) {
    case '1':
      return theme.colors.orange;
    case '2':
      return theme.colors.red;
    case '3':
      return theme.colors.green;
    default:
      return theme.colors.grey1;
  }
};

// 날짜 형식 변환 (YYYY-MM-DD -> YYYY년 MM월 DD일)
const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const EventListModal: React.FC<EventListModalProps> = ({
  isOpen,
  selectedDate,
  events,
  onSelectEvent,
  onAddNewEvent,
  onClose,
}) => {
  if (!isOpen || !selectedDate) return null;

  const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

  const handleAddNewEvent = () => {
    if (events.length >= 3) {
      toast.error('하루에 최대 3개까지만 일정을 추가할 수 있습니다.');
      return;
    }
    onAddNewEvent(selectedDate);
  };

  // 모달 요소를 document.body에 포탈로 렌더링
  return ReactDOM.createPortal(
    <>
      <MS.ModalGlobalStyle />
      <MS.ModalOverlay role="dialog" aria-modal="true" onClick={onClose}>
        <MS.ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <S.EventListModalContainer>
            <MS.ModalTitle>{formattedDate} 일정</MS.ModalTitle>

            <S.EventListModalContent>
              <S.EventListContainer>
                {events.map((event) => (
                  <S.EventItem
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                  >
                    <S.EventTitle>{event.title}</S.EventTitle>
                    <S.EventTypeTag
                      style={{ backgroundColor: getEventTypeColor(event.type) }}
                    >
                      {getEventTypeName(event.type)}
                    </S.EventTypeTag>
                    <S.EventDate>
                      {formatDateDisplay(event.startDate)} ~{' '}
                      {formatDateDisplay(event.endDate)}
                    </S.EventDate>
                  </S.EventItem>
                ))}
                <S.EventListModalButtonWrapper>
                  <S.AddNewEventButton
                    onClick={handleAddNewEvent}
                    style={{ marginTop: '15px', marginBottom: '15px' }}
                  >
                    + 새 일정 추가하기
                  </S.AddNewEventButton>
                </S.EventListModalButtonWrapper>
              </S.EventListContainer>
            </S.EventListModalContent>

            <S.EventListModalFooter>
              <MS.ButtonContainer>
                <MS.MintButtonModal
                  typeStyle="rounded"
                  variant="outlined"
                  onClick={onClose}
                >
                  닫기
                </MS.MintButtonModal>
              </MS.ButtonContainer>
            </S.EventListModalFooter>
          </S.EventListModalContainer>
        </MS.ModalContent>
      </MS.ModalOverlay>
    </>,
    document.body
  );
};

export default EventListModal;
