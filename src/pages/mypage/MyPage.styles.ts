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
  min-height: 50px;
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.point1};
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  margin-top: 10rem;
`;

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
  min-height: 200px;
  padding: 1.5rem;
  border-top: 2px solid ${({ theme }) => theme.colors.point1};
  border-bottom: 2px solid ${({ theme }) => theme.colors.point1};
  margin-bottom: 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SalarySection = styled.section`
  width: 100%;
  min-height: 220px;
  padding-top: 2rem;
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
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
  right: 20px;
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
  bottom: 60px;
  right: -1px;
  cursor: pointer;

  img {
    width: 25px;
    height: 25px;
  }
`;

export const InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
`;

export const InfoItem = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ theme }) => theme.typography.body1}
  padding: 8px 12px;

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

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
`;

export const TableRow = styled.tr`
  height: 50px;
`;

export const TableHeader = styled.th`
  padding: 0.75rem;
  ${({ theme }) => theme.typography.body2}
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
`;

export const TableData = styled.td`
  padding: 0.75rem;
  ${({ theme }) => theme.typography.body2}
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};
`;

export const SalaryControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
