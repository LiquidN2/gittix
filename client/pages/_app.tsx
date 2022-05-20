import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.scss';

import App, { AppProps, AppContext } from 'next/app';

import Layout from '../components/layout/layout';
import { buildClient } from '../api/build-client';
import { UserContext } from '../contexts/user-context';

interface MyAppProps extends AppProps {
  currentUser: Record<string, any> | null;
}

const MyApp = ({ Component, pageProps, currentUser = null }: MyAppProps) => {
  return (
    <UserContext.Provider value={currentUser}>
      <Layout>
        <Component currentUser={currentUser} {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
};

export default MyApp;

// getInitialProps runs on server on initial page load
// it runs on the browser on subsequent page nav
MyApp.getInitialProps = async (appContext: AppContext) => {
  let appProps = {},
    pageProps = {},
    currentUser = null;

  try {
    const client = buildClient<AppContext>(appContext);

    // fetch current user
    const { data } = await client.get('/api/users/currentuser');

    currentUser = data.currentUser;

    appProps = await App.getInitialProps(appContext);

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
  } catch (e) {
    console.error('🥷🙅‍♂️ Unauthenticated request 🙅‍♂️🥷');
  }

  return { ...appProps, pageProps, currentUser };
};
