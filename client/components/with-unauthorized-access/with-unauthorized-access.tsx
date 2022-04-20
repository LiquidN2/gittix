import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { UserContext } from '../../contexts/user-context';

// Redirect to home page if user is already authenticated
export function withUnauthorizedAccess<P>(
  WrappedComponent: NextPage<P>
): NextPage<P> {
  return function (props) {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
      if (!user) return;
      router.push('/').catch(e => console.error(e));
    }, []);

    if (user) return <div>Already logged in. Redirecting...</div>;

    return <WrappedComponent {...props} />;
  };
}
