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

  const links = [
    {
      url: '/auth/signin',
      name: 'Sign In',
      isHidden: !!user,
    },
    { url: '/auth/signup', name: 'Sign Up', isHidden: !!user },
  ];

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

      {links.map((link, index) =>
        !link.isHidden ? (
          <Link key={index} href={link.url}>
            <Button className={index === links.length - 1 ? '' : 'me-2'}>
              {link.name}
            </Button>
          </Link>
        ) : null
      )}
    </header>
  );
};

export default Header;
