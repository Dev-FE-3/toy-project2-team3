import { JSX, ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { RootState } from '@/app/store';

interface ProtectedRouteType {
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteType): JSX.Element => {
  // const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isLoggedIn = true;

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};
