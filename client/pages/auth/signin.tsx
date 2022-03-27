import { NextPage } from 'next';
import FormAuth from '../../components/forms/form-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface SignInPageProps {
  currentUser: Record<string, any> | null;
}

const SignIn: NextPage<SignInPageProps> = ({ currentUser }) => {
  return <FormAuth type="signin" />;
};

export default SignIn;
