import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

import { buildClient } from '../api/build-client';

interface HomePageProps {
  currentUser: Record<string, any> | null;
  tickets?: any;
}

const Home: NextPage<HomePageProps> = ({ currentUser, tickets }) => {
  useEffect(() => {
    console.log(tickets);
  }, []);

  return (
    <div>
      <Head>
        <title>
          Welcome to Gittix 🎫 | A place to buy & sell tickets of your favorite
          events
        </title>
      </Head>
      <h1>Landing page !</h1>
      <p>{currentUser ? 'Logged in' : 'Not logged in'}</p>
      {tickets.length > 0 &&
        tickets.map((ticket: any) => <div key={ticket.id}>{ticket.title}</div>)}
    </div>
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
