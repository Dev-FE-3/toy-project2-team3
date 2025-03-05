import { ReactNode, JSX, useRef, useEffect, useState } from 'react';
import * as S from '../../pages/salary-correction/style';
import { useNavigate } from 'react-router-dom';
import Dropdown from '@/shared/dropdown/Dropdown';
import Button from '@/shared/button/Button';

interface SalaryCorrectionPageProps {
  children?: ReactNode;
}

const SalaryCorrectionPage = ({
  children,
}: SalaryCorrectionPageProps): JSX.Element => {
  const navigate = useNavigate();

  const options = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  return (
    <>
      <S.BackLink onClick={() => navigate(-1)}>&lt; 이전 페이지로</S.BackLink>
      <S.Title>급여 정정 신청하기</S.Title>
      <S.TileContainer>
        <S.ListTile>
          <S.TileTitle>신청 내역</S.TileTitle>
        </S.ListTile>
        <S.FormTile>
          <S.TileTitle>급여 신청서 작성</S.TileTitle>
          <Dropdown title="급여 일자를 선택해주세요" options={options} />
          <S.InputForm onSubmit={() => {}}>
            <S.Input placeholder="사번을 입력해주세요" />
            <S.Input placeholder="정정 사유를 입력해주세요" />
            <S.Input placeholder="상세 설명을 입력해주세요" />
            <Button typeStyle="rounded" variant="filled">
              제출하기
            </Button>
          </S.InputForm>
        </S.FormTile>
      </S.TileContainer>
    </>
  );
};

export default SalaryCorrectionPage;
