import { NextPage } from 'next';
import Head from 'next/head';

import FormTicket from '../../components/forms/form-ticket';
import { withPrivateAccess } from '../../components/with-private-access/with-private-acess';
import { PageContainer } from '../../components/pages/tickets/new.styles';

const CreateNewTicket: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create your ticket to sell</title>
      </Head>
      <PageContainer>
        <FormTicket />
      </PageContainer>
    </>
  );
};

export default withPrivateAccess(CreateNewTicket);
