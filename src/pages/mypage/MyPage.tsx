import React from 'react';
import { Container, Header, ContentWrapper } from './MyPage.styles';
import UserInfoSection from './components/UserInfoSection';
import SalaryInfoSection from './components/SalaryInfoSection';

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
