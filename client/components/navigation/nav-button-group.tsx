import styled from 'styled-components';
import Nav from 'react-bootstrap/Nav';

const NavButtonGroup = styled(Nav)`
  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export default NavButtonGroup;
