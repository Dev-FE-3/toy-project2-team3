import { JSX, ReactNode, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';
import loadingAnimation from '@/assets/animations/loading.json';
import { styled } from 'styled-components';

interface AuthRouteProps {
  children: ReactNode;
  type: 'protected' | 'public';
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    return (
      <LoadingWrapper>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: '180px', height: '180px' }}
        />
      </LoadingWrapper>
    );
  }

  if (type === 'protected' && !user) {
    return <Navigate to="/login" replace />;
  }

  if (type === 'public' && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
