import { ReactNode, JSX } from 'react';

interface NotFoundPageProps {
  children?: ReactNode;
}

const NotFoundPage = ({ children }: NotFoundPageProps): JSX.Element => {
  return <>notfound</>;
};

export default NotFoundPage;
