import type { NextPage } from 'next';
import Head from 'next/head';

interface HomePageProps {
  currentUser: Record<string, any> | null;
}

const Home: NextPage<HomePageProps> = ({ currentUser }) => {
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
    </div>
  );
};

export default Home;
