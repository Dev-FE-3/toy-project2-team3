import React from 'react';
import * as S from '../styles/salary-modal.styles';
import Button from '../../../widgets/button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const salaryData = {
  date: '2025년 01월 25일',
  month: '1월',
  pay: {
    base: '3,000,000원',
    bonus: '3,000,000원',
    position: '3,000,000원',
    overtime: '3,000,000원',
    night: '3,000,000원',
  },
  deduct: {
    health: '-3,000,000원',
    care: '-3,000,000원',
    job: '-3,000,000원',
    tax: '-3,000,000원',
  },
  total: {
    pay: '563,443,234원',
    deduct: '-1,231,500원',
    net: '562,211,734원',
  },
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.ModalHeader>
          <S.Title>
            <span>{salaryData.month}</span> 급여 명세서
          </S.Title>
          <S.DateText>{salaryData.date}</S.DateText>
        </S.ModalHeader>

        <S.ModalBody>
          <S.SalaryDetails>
            <S.SalaryTable>
              <thead>
                <tr>
                  <S.TableHeader>지급 항목</S.TableHeader>
                  <S.TableHeader></S.TableHeader>
                </tr>
              </thead>
              <tbody>
                <S.TableRow>
                  <S.TableData>기본급</S.TableData>
                  <S.TableDataRight>{salaryData.pay.base}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>상여금</S.TableData>
                  <S.TableDataRight>{salaryData.pay.bonus}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>직책수당</S.TableData>
                  <S.TableDataRight>{salaryData.pay.position}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>특근수당</S.TableData>
                  <S.TableDataRight>{salaryData.pay.overtime}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>야근수당</S.TableData>
                  <S.TableDataRight>{salaryData.pay.night}</S.TableDataRight>
                </S.TableRow>
              </tbody>
            </S.SalaryTable>
            <S.SalaryTable>
              <thead>
                <tr>
                  <S.TableHeader>공제 항목</S.TableHeader>
                  <S.TableHeader></S.TableHeader>
                </tr>
              </thead>
              <tbody>
                <S.TableRow>
                  <S.TableData>건강보험</S.TableData>
                  <S.TableDataRight>
                    {salaryData.deduct.health}
                  </S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>장기요양보험</S.TableData>
                  <S.TableDataRight>{salaryData.deduct.care}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>고용보험</S.TableData>
                  <S.TableDataRight>{salaryData.deduct.job}</S.TableDataRight>
                </S.TableRow>
                <S.TableRow>
                  <S.TableData>소득세</S.TableData>
                  <S.TableDataRight>{salaryData.deduct.tax}</S.TableDataRight>
                </S.TableRow>
              </tbody>
            </S.SalaryTable>
          </S.SalaryDetails>

          <S.TotalSection>
            <S.TotalRow>
              <S.TotalText>지급합계</S.TotalText>
              <S.TotalAmount>{salaryData.total.pay}</S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>공제합계</S.TotalText>
              <S.TotalAmount>{salaryData.total.deduct}</S.TotalAmount>
            </S.TotalRow>
            <S.TotalRow>
              <S.TotalText>실지급액</S.TotalText>
              <S.TotalAmount className="highlight">
                {salaryData.total.net}
              </S.TotalAmount>
            </S.TotalRow>
          </S.TotalSection>
        </S.ModalBody>

        <S.ModalFooter>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
          <Button>정정 신청하기</Button>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default Modal;
