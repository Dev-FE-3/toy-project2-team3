import { JSX } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
`;

const Logo = styled.img`
  width: 96px;
`;

const Menu = styled.ul`
  margin-left: 120px;
  display: flex;
  flex-direction: row;
  width: auto;
  gap: 40px;
`;

const MenuItem = styled.li`
  font: ${({ theme }) => theme.typography.menu1};
  color: ${({ theme }) => theme.colors.black};
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
  font: ${({ theme }) => theme.typography.menu1};
  &:hover {
    transform: scale(1.05);
  }
  transition: 0.2s ease-in-out;
`;

const NavBar = (): JSX.Element => {
  return (
    <>
      <NavBox>
        <Logo src="./src/assets/images/devHR_logo.png" alt="logo" />
        <Menu>
          <MenuItem>
            <Link style={{ all: 'unset' }} to="/">
              마이페이지
            </Link>
          </MenuItem>
          <MenuItem>
            <Link style={{ all: 'unset' }} to="/work-calendar">
              업무관리
            </Link>
          </MenuItem>
        </Menu>
        <LogoutBtn>
          <Link style={{ all: 'unset' }} to="/login">
            로그아웃
          </Link>
        </LogoutBtn>
      </NavBox>
      <Outlet />
    </>
  );
};

export default NavBar;
