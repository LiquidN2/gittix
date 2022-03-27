import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';

const Header: FC = () => {
  const { isReady, asPath } = useRouter();
  console.log(asPath);

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <Link href="/">
        <span className="fs-4 flex-grow-1">🎫 Gittix</span>
      </Link>
      <Link href="/auth/signup">
        <Button variant="outline-primary" className="me-2">
          Sign Up
        </Button>
      </Link>
      <Link href="/auth/signin">
        <Button>Sign In</Button>
      </Link>
    </header>
  );
};

export default Header;
