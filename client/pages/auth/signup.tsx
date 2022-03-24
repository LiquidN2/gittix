import { FormEventHandler, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';

import Head from 'next/head';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SignUp: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password,
      });

      console.log(response.data);
    } catch (e: any) {
      console.log(e.response.data.errors);
    }
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
          <Form.Text className="text-muted">
            We'll never share your email with anyone else
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            required={true}
            pattern=".{4,20}"
            title="4 to 20 characters"
          />
        </Form.Group>

        <Button type="submit">Sign Up</Button>
      </Form>
    </>
  );
};

export default SignUp;
