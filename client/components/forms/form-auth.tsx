import { FC, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useRequest } from '../../hooks/use-request';

interface FormAuthProps {
  type: 'signup' | 'signin';
}

const FormAuth: FC<FormAuthProps> = ({ type }) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const { doRequest, errors } = useRequest(
    `/api/users/${type}`,
    'post',
    {
      email: email.trim(),
      password: password.trim(),
    },
    async () => {
      await router.push('/');
    }
  );

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (password !== passwordConfirm) return;
    await doRequest();
  };

  return (
    <>
      <Head>
        <title>Gittix</title>
      </Head>
      <Form onSubmit={onSubmit}>
        {type === 'signup' && <h1>Sign Up A New Account</h1>}
        {type === 'signin' && <h1>Sign In</h1>}

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required={true}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            required={true}
            // pattern=".{4,20}"
            // title="4 to 20 characters"
          />
        </Form.Group>

        {type === 'signup' && (
          <Form.Group className="mb-3" controlId="passwordConfirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.currentTarget.value)}
              required={true}
              // pattern=".{4,20}"
              // title="4 to 20 characters"
            />
          </Form.Group>
        )}

        {type === 'signin' && <Button type="submit">Sign In</Button>}
        {type === 'signup' && <Button type="submit">Sign Up</Button>}

        {errors}
      </Form>
    </>
  );
};

export default FormAuth;
