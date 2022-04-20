import { FC, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FormAuthContainer } from './form-auth.styles';
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
    if (type === 'signup' && password !== passwordConfirm) return;
    await doRequest();
  };

  return (
    <FormAuthContainer>
      <Form onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">
          {type === 'signin' ? 'Please sign in' : 'Register a new account'}
        </h1>

        <Form.Group className="form-floating" controlId="email">
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required={true}
            placeholder="Email Address"
          />
          <Form.Label>Email Address</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating" controlId={`${type}-password`}>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            required={true}
            placeholder="Password"
            // pattern=".{4,20}"
            // title="4 to 20 characters"
          />
          <Form.Label>Password</Form.Label>
        </Form.Group>

        {type === 'signup' && (
          <Form.Group
            className="mb-3 form-floating"
            controlId="password-confirm"
          >
            <Form.Control
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.currentTarget.value)}
              required={true}
              placeholder="Confirm Password"
              // pattern=".{4,20}"
              // title="4 to 20 characters"
            />
            <Form.Label>Confirm Password</Form.Label>
          </Form.Group>
        )}

        <Button type="submit" className="w-100 btn btn-lg btn-primary">
          {type === 'signin' ? 'Login' : 'Sign Up'}
        </Button>

        {errors}
      </Form>
    </FormAuthContainer>
  );
};

export default FormAuth;
