import type { NextPage, GetServerSideProps } from 'next';
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

export const getServerSideProps: GetServerSideProps = async context => {
  return { props: {} };
};

// Home.getInitialProps = async context => {
//   console.log('executing...');
//   const client = buildClient(context.req);
//   const { data } = await client.get('/api/users/currentuser');
//   return { currentUser: data.currentUser };
// };

export default Home;
