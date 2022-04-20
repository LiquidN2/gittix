import { NextPage } from 'next';
import Head from 'next/head';

import { PageContainer } from '../../components/pages/auth/signin.styles';
import FormAuth from '../../components/forms/form-auth';
import { withUnauthorizedAccess } from '../../components/with-unauthorized-access/with-unauthorized-access';

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>🎫 Gittix | Sign In</title>
      </Head>
      <PageContainer className="text-center">
        <FormAuth type="signin" />
      </PageContainer>
    </>
  );
};

export default withUnauthorizedAccess(SignIn);
