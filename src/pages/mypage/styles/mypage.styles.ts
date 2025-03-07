import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.header`
  width: 100%;
  min-height: 4.375rem;
  display: flex;
  border-bottom: 0.125rem solid ${({ theme }) => theme.colors.point1};
`;

export const ContentWrapper = styled.div`
  margin-top: 12rem;
  margin-bottom: 1rem;
`;
