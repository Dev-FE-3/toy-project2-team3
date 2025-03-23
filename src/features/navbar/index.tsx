import { JSX, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import styled from 'styled-components';

import { auth } from '@/firebase';
import CommonModal from '@/shared/modal/Modal';

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

const MenuItem = styled.li<{ $active: boolean }>`
  ${({ theme }) => theme.typography.menu1};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.point1 : theme.colors.black};
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
          <MenuItem $active={location.pathname === '/'}>
            <Link style={{ all: 'unset' }} to="/">
              마이페이지
            </Link>
          </MenuItem>
          <MenuItem $active={location.pathname === '/work-calendar'}>
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
        <CommonModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          message={'로그아웃 하시겠습니까?'}
          confirmText={'로그아웃'}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default NavBar;
