import React from 'react';
import * as S from './styles/mypage.styles';
import UserInfoSection from './ui/user-section';
import SalaryInfoSection from './ui/salary-section';

const MyPage: React.FC = () => {
  return (
    <S.Container>
      <S.Header></S.Header>
      <S.ContentWrapper>
        <UserInfoSection />
        <SalaryInfoSection />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default MyPage;
