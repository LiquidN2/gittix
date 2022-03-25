import type { NextPage, GetServerSideProps } from 'next';
// import axios, { AxiosRequestHeaders } from 'axios';
import { buildClient } from '../api/build-client';

interface HomePageProps {
  currentUser: Record<string, any> | null;
}

const Home: NextPage<HomePageProps> = ({ currentUser }) => {
  return (
    <div>
      <h1>Landing page !</h1>
      <p>{currentUser ? 'Logged in' : 'Not logged in'}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async context => {
  let currentUser = null;

  try {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    currentUser = data.currentUser;
  } catch (e) {
    currentUser = null;
  }

  return { props: { currentUser } };
};

export default Home;
