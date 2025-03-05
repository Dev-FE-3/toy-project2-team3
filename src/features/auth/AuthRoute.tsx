import { JSX, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';

interface AuthRouteProps {
  children: ReactNode;
  type: 'protected' | 'public';
}

export const AuthRoute = ({ children, type }: AuthRouteProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 임시 로딩
  }

  if (type === 'protected' && !user) {
    return <Navigate to="/login" replace />;
  }

  if (type === 'public' && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
