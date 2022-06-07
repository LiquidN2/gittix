import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

import Container from 'react-bootstrap/Container';

import { buildClient } from '../api/build-client';
import TicketList from '../components/ticket/ticket-list';

interface HomePageProps {
  currentUser: Record<string, any> | null;
  tickets?: any;
}

const Home: NextPage<HomePageProps> = ({ currentUser, tickets }) => {
  useEffect(() => {
    console.log(tickets);
  }, [tickets]);

  return (
    <>
      <Head>
        <title>
          Welcome to Gittix 🎫 | A place to buy & sell tickets of your favorite
          events
        </title>
      </Head>
      <div>
        <Container>
          <h1>Landing page !</h1>
          <TicketList tickets={tickets} />
        </Container>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const client = buildClient(context);

  const { data } = await client.get('/api/tickets');

  return {
    props: {
      tickets: data.tickets,
    },
  };
};
