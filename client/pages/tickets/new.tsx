import { NextPage } from 'next';
import Head from 'next/head';

import FormTicket from '../../components/forms/form-ticket';

const CreateNewTicket: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create your ticket to sell</title>
      </Head>
      <FormTicket />
    </>
  );
};

export default CreateNewTicket;
