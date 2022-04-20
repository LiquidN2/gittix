import styled from 'styled-components';

export const FormAuthContainer = styled.div`
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;

  .form-floating:focus-within {
    z-index: 2;
  }

  input[type='email'] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  input[id='signin-password'] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  input[id='signup-password'] {
    margin-bottom: -2px;
    border-radius: 0;
  }

  input[id='password-confirm'] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;
