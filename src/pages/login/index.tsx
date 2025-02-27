import { ReactNode, JSX } from 'react';

interface LoginPageProps {
  children?: ReactNode;
}

const LoginPage = ({ children }: LoginPageProps): JSX.Element => {
  return <>login</>;
};

export default LoginPage;
