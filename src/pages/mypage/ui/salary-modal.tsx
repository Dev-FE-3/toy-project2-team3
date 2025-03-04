import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../styles/salary-modal.styles';
import Button from '../../../shared/button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryDetail: any | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, salaryDetail }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  if (!salaryDetail) {
    return (
      <S.ModalOverlay>
        <S.ModalContent>
          <S.ModalHeader>
            <S.Title>급여 명세서</S.Title>
          </S.ModalHeader>
          <S.ModalBody>
            <p>급여 데이터를 불러오는 중...</p>
          </S.ModalBody>
          <S.ModalFooter>
            <Button onClick={onClose} variant="outlined">
              닫기
            </Button>
          </S.ModalFooter>
        </S.ModalContent>
      </S.ModalOverlay>
    );
  }

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return '₩0';
    return value < 0
      ? `-₩${Math.abs(value).toLocaleString()}`
      : `₩${value.toLocaleString()}`;
  };

  const formattedDate = salaryDetail.date ?? '날짜 없음';

  //'월' 값만 추출
  const month =
    typeof salaryDetail.date === 'string' && salaryDetail.date.includes('년')
      ? salaryDetail.date.split('년 ')[1].split('월')[0] + '월'
      : '월 정보 없음';

  const handleCorrectionRequest = () => {
    navigate('/salary-correction');
  };

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.ModalHeader>
          <S.Title>
            <span>{month}</span> 급여 명세서
          </S.Title>
          <S.DateText>{formattedDate}</S.DateText>
        </S.ModalHeader>

        <S.ModalBody>
          <S.SalaryDetails>
            <S.SalaryTable>
              <thead>
                <tr>
                  <S.TableHeader>지급 항목</S.TableHeader>
                </tr>
              </thead>
              <tbody>
                <S.TableRow>
                  <S.TableData>기본급</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.base)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>상여금</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.bonus)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>직책수당</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.position)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>특근수당</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.overtime)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>야근수당</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.night)}
                  </S.TableDataRight>
                </S.TableRow>
              </tbody>
            </S.SalaryTable>
            <S.SalaryTable>
              <thead>
                <tr>
                  <S.TableHeader>공제 항목</S.TableHeader>
                </tr>
              </thead>
              <tbody>
                <S.TableRow>
                  <S.TableData>건강보험</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.health)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>장기요양보험</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.care)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>고용보험</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.job)}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>소득세</S.TableData>
                  <S.TableDataRight>
                    {formatCurrency(salaryDetail.tax)}
                  </S.TableDataRight>
                </S.TableRow>
              </tbody>
            </S.SalaryTable>
          </S.SalaryDetails>

          <S.TotalSection>
            <S.TotalRow>
              <S.TotalText>지급합계</S.TotalText>
              <S.TotalAmount>
                {formatCurrency(salaryDetail.totalPayment)}
              </S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>공제합계</S.TotalText>
              <S.TotalAmount>
                {formatCurrency(salaryDetail.totalDeduct)}
              </S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>실지급액</S.TotalText>
              <S.TotalAmount className="highlight">
                {formatCurrency(salaryDetail.actualPayment)}
              </S.TotalAmount>
            </S.TotalRow>
          </S.TotalSection>
        </S.ModalBody>

        <S.ModalFooter>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
          <Button onClick={handleCorrectionRequest}>정정 신청하기</Button>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default Modal;
