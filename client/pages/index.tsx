import type { NextPage, GetServerSideProps } from 'next';
import axios, { AxiosRequestHeaders } from 'axios';

interface HomePageProps {
  currentUser: Record<string, any> | null;
}

const Home: NextPage<HomePageProps> = ({ currentUser }) => {
  return (
    <div>
      <h1>Landing page</h1>
      <p>{currentUser ? 'Logged in' : 'Not logged in'}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async context => {
  // This is the same request from the browser
  const headers = context.req.headers as AxiosRequestHeaders;

  // To make a request from client container to ingress-nginx, use the domain formay
  // http://[SERVICE_NAME].[NAMESPACE].svc.cluster.local
  let currentUser = null;
  try {
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      { headers }
    );

    currentUser = response.data.currentUser;
  } catch (e) {
    currentUser = null;
  }

  return { props: { currentUser } };
};

export default Home;
