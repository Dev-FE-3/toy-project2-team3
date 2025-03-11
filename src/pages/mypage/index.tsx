import React from 'react';
import * as S from '@/pages/mypage/styles/mypage.styles';
import UserInfoSection from '@/pages/mypage/ui/user-section';
import SalaryInfoSection from '@/pages/mypage/ui/salary-section';

const MyPage: React.FC = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <UserInfoSection />
        <SalaryInfoSection />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default MyPage;
