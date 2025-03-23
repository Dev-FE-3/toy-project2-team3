import React from 'react';
import * as S from '@/pages/mypage/styles';
import UserInfoSection from '@/features/mypage/ui/user-section';
import SalaryInfoSection from '@/features/mypage/ui/salary-section';

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
