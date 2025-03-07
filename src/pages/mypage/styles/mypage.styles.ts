import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  margin-top: 12rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;
