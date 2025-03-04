import { JSX, ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {  onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';

interface ProtectedRouteType {
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteType): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (isLoading) {
    return <div>Loading...</div>; // 임시 로딩
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
