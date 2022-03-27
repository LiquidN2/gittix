import { FC } from 'react';
import Header from '../header/header';

const Layout: FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
