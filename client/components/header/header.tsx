import { FC, MouseEventHandler, useContext } from 'react';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import NavLinkText from '../navigation/nav-link-text';
import NavLinkButton from '../navigation/nav-link-button';
import NavButtonGroup from '../navigation/nav-button-group';

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
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/">
          <Navbar.Brand>Gittix 🎫</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLinkText href="/" name="Home" />
            <NavLinkText href="/tickets" name="Tickets" />
          </Nav>
          {user && <span className="me-3">Welcome, {user.email}</span>}
          <NavButtonGroup>
            {!user && (
              <NavLinkButton
                href="/auth/signin"
                name="Login"
                variant="outline-primary"
              />
            )}
            {!user && (
              <NavLinkButton
                href="/auth/signup"
                name="Sign Up"
                variant="primary"
              />
            )}
            {user && (
              <Button onClick={signOut} variant="outline-primary">
                Sign Out
              </Button>
            )}
          </NavButtonGroup>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
