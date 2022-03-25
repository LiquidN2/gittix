import { FormEventHandler, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useRequest } from '../../hooks/use-request';

const SignUp: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { doRequest, errors } = useRequest(
    '/api/users/signup',
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
    await doRequest();
  };

  return (
    <>
      <Head>
        <title>Gittix | Sign Up A New Account</title>
      </Head>
      <Form onSubmit={onSubmit}>
        <h1>Sign Up</h1>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required={true}
          />
          {}
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

        {errors}
        <Button type="submit">Sign Up</Button>
      </Form>
    </>
  );
};

export default SignUp;
