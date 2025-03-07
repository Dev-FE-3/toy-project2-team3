import styled from 'styled-components';

export const EventListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

// 스크롤 가능한 컨텐츠 영역
export const ModalContentScroll = styled.div`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 40px;
  margin-bottom: 10px;
`;

// 고정 위치의 푸터
export const ModalFixedFooter = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.grey2};
  border-radius: 0 0 8px 8px;
`;

export const EventItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-right: 5px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.grey3};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.point2};
  }
`;

export const EventTitle = styled.h3`
  margin: 0 0 8px 0;
  ${({ theme }) => theme.typography.body2}
`;

export const EventTypeTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.body3}
  margin-bottom: 8px;
  align-self: flex-start;
`;

export const EventDate = styled.div`
  ${({ theme }) => theme.typography.body3}
`;

export const AddNewEventButton = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px dashed ${({ theme }) => theme.colors.point1};
  color: ${({ theme }) => theme.colors.point1};
  padding: 10px;
  border-radius: 8px;
  ${({ theme }) => theme.typography.body2}
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.point2};
  }
`;

export const EventListModalButtonWrapper = styled.div`
  padding-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EventListModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
  position: relative;
`;

export const EventListModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 65px;
`;

export const EventListModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid #eee;
`;
