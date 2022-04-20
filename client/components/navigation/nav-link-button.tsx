import { FC } from 'react';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

interface NavLinkButtonProps {
  href: string;
  name: string;
  variant: string;
}

const NavLinkButton: FC<NavLinkButtonProps> = ({ href, name, variant }) => {
  return (
    <Nav.Item>
      <Link href={href}>
        <Button variant={variant}>{name}</Button>
      </Link>
    </Nav.Item>
  );
};

export default NavLinkButton;
