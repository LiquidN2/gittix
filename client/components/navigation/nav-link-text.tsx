import { FC } from 'react';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';

const NavLinkText: FC<{ href: string; name: string }> = ({ href, name }) => (
  <Link href={href} passHref>
    <Nav.Link>{name}</Nav.Link>
  </Link>
);

export default NavLinkText;
