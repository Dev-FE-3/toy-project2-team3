import { JSX, useEffect } from 'react';
import * as S from '@/pages/salary-correction/style';
import { CorrectionDataType } from '..';

interface CorrectionListProps {
  correctionData: CorrectionDataType[];
}

const correctionList = ({
  correctionData,
}: CorrectionListProps): JSX.Element => {
  useEffect(() => {
    console.log(correctionData);
  }, [correctionData]);
  return (
    <>
      <S.TileTitle>신청 내역</S.TileTitle>
      <S.ListBox>
        <S.ListItem>1</S.ListItem>
        <S.ListItem>1</S.ListItem>
        <S.ListItem>1</S.ListItem>
      </S.ListBox>
    </>
  );
};

export default correctionList;
