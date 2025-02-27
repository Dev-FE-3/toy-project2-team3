import { ReactNode, JSX } from 'react';
import { Outlet } from 'react-router-dom';

const NavBar = (): JSX.Element => {
  return (
    <>
      {/* 내비게이션 UI */}
      <Outlet />
    </>
  );
};

export default NavBar;
