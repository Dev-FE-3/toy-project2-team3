import CurationImg from '@/assets/images/curation.svg';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Code = styled.p`
  font-family: 'Hanna 11yrs';
  color: ${({ theme }) => theme.colors.point1};
  font-size: 80px;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: -0.8px;
  text-align: center;
`;

const Message = styled.p`
  text-align: center;
  ${({ theme }) => theme.typography.menu1};
`;

const StyledImg = styled.img`
  height: auto;

  position: absolute;
  right: 128px;
  bottom: 0;
`;

const NotFoundPage = () => {
  return (
    <Container>
      <div>
        <Code>404</Code>
        <Message>요청하신 페이지를 찾을 수 없어요!</Message>
      </div>
      <StyledImg src={CurationImg} alt="Curation Icon" />
    </Container>
  );
};

export default NotFoundPage;
