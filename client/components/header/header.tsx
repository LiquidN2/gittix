import { FC, MouseEventHandler, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';

import { UserContext } from '../../contexts/user-context';
import { useRequest } from '../../hooks/use-request';
import { useRouter } from 'next/router';

const Header: FC = () => {
  const user = useContext(UserContext);
  const router = useRouter();
  const { doRequest, errors } = useRequest(
    '/api/users/signout',
    'post',
    {},
    async () => {
      await router.push('/');
    }
  );

  const signOut: MouseEventHandler<HTMLButtonElement> = async () => {
    await doRequest();
  };

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <Link href="/">
        <a
          className="flex-grow-1 text-muted fs-4"
          style={{ textDecoration: 'none' }}
        >
          🎫 Gittix
        </a>
      </Link>

      {user && <Button onClick={signOut}>Sign Out</Button>}

      {!user && (
        <>
          <Link href="/auth/signup">
            <Button variant="outline-primary" className="me-2">
              Sign Up
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </>
      )}
    </header>
  );
};

export default Header;
