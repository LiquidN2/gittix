import { FC, ReactNode } from 'react';
import Header from '../header/header';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
