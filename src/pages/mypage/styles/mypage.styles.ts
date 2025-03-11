import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin-top: 12rem;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;
