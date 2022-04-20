import { NextPage } from 'next';
import Head from 'next/head';

import FormAuth from '../../components/forms/form-auth';
import { PageContainer } from '../../components/pages/auth/signup.styles';
import { withUnauthorizedAccess } from '../../components/with-unauthorized-access/with-unauthorized-access';

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>🎫 Gittix | Sign Up</title>
      </Head>
      <PageContainer>
        <FormAuth type="signup" />
      </PageContainer>
    </>
  );
};

export default withUnauthorizedAccess(SignUp);
