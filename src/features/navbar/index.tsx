
import { JSX } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';

import { toast } from 'react-toastify';

import styled from 'styled-components';

import { auth } from '@/firebase';
import Button from '@/shared/button/Button';

const NavBox = styled.nav`
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  height: 80px;
  width: 100vw;
  position: fixed;
  display: flex;
  top: 0px;
  left: 0px;
  align-items: center;
  padding-left: 56px;
  border-bottom: ${({ theme }) => theme.colors.grey2} 1px solid;
  z-index: 99;
`;

const Logo = styled.img`
  width: 96px;
  cursor: pointer;
`;

const Menu = styled.ul`
  margin-left: 120px;
  display: flex;
  flex-direction: row;
  width: auto;
  gap: 40px;
`;

const MenuItem = styled.li<{ active: boolean }>`
  ${({ theme }) => theme.typography.menu1};
  color: ${({ theme, active }) =>
    active ? theme.colors.point1 : theme.colors.black};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.point1};
  }
  transition: color 0.2s ease-in-out;
`;

const LogoutBtn = styled.button`
  box-sizing: border-box;
  height: 32px;
  width: 108px;
  border-radius: 4px;
  position: absolute;
  right: 56px;
  background-color: ${({ theme }) => theme.colors.point2};
  color: ${({ theme }) => theme.colors.point1};
  border: none;
  padding: auto;
  cursor: pointer;
  ${({ theme }) => theme.typography.menu1};
  &:hover {
    transform: scale(1.05);
  }
  transition: 0.2s ease-in-out;
`;

const PageContainer = styled.section`
  margin: 80px auto auto auto;
  width: 100%;
  max-width: 1240px;
  height: auto;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 88px;
  width: 480px;
`;

export const ModalMessage = styled.p`
  font-size: 24px;
  font-weight: 700;
  line-height: 133%;
  letter-spacing: -0.24px;
  display: flex;
  justify-content: start;
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: end;
`;

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    toast.success('로그아웃 성공!');
    navigate('/login');
  };

  return (
    <>
      <NavBox>
        <Logo
          src="./src/assets/images/logo.svg"
          alt="logo"
          onClick={() => navigate('/')}
        />
        <Menu>
          <MenuItem active={location.pathname === '/'}>
            <Link style={{ all: 'unset' }} to="/">
              마이페이지
            </Link>
          </MenuItem>
          <MenuItem active={location.pathname === '/work-calendar'}>
            <Link style={{ all: 'unset' }} to="/work-calendar">
              업무관리
            </Link>
          </MenuItem>
        </Menu>
        <LogoutBtn onClick={() => setIsModalOpen(true)}>로그아웃</LogoutBtn>
      </NavBox>
      <PageContainer>
        <Outlet />
      </PageContainer>

      {/* 모달 */}
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalMessage>로그아웃 하시겠습니까?</ModalMessage>
            <ModalButtonWrapper>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
                닫기
              </Button>
              <Button onClick={handleLogout}>로그아웃</Button>
            </ModalButtonWrapper>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default NavBar;
