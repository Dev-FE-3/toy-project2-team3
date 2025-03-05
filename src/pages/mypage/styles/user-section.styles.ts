import styled from 'styled-components';

export const Button = styled.button`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.point1};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.point1};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
`;

export const InfoSection = styled.section`
  width: 100%;
  min-height: 260px;
  border-top: 2px solid ${({ theme }) => theme.colors.point1};
  border-bottom: 2px solid ${({ theme }) => theme.colors.point1};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ProfileContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const ProfileImage = styled.div`
  width: 270px;
  height: 270px;
  background-color: ${({ theme }) => theme.colors.grey2};
  overflow: hidden;
  border-radius: 16px;
  position: absolute;
  top: -150px;
  right: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
`;

export const ProfileEditButton = styled.button`
  width: 45px;
  height: 45px;
  background-color: ${({ theme }) => theme.colors.point2};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 2.2rem;
  right: -1px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease-in-out;
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;

export const InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  padding: 30px;
`;

export const InfoItem = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  ${({ theme }) => theme.typography.body1}
  padding: 0.5rem 0.75rem;

  strong {
    font-weight: 700;
    font-size: 22px;
  }
`;
export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: 1rem;
  position: absolute;
  top: -50px;
  left: 0;
`;
