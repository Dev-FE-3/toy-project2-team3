import React from 'react';
import { Container, Header, ContentWrapper } from './MaPageStyles';
import UserInfoSection from './UserInfoSection';
import SalaryInfoSection from './SalaryInfoSection';

const MyPage: React.FC = () => {
  return (
    <Container>
      <Header></Header>
      <ContentWrapper>
        <UserInfoSection />
        <SalaryInfoSection />
      </ContentWrapper>
    </Container>
  );
};

export default MyPage;
