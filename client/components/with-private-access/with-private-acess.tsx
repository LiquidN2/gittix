import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { UserContext } from '../../contexts/user-context';

// Redirect to login page if unauthenticated
export function withPrivateAccess<P extends object>(
  WrappedComponent: NextPage<P>
): NextPage<P> {
  return function Component(props) {
    const router = useRouter();
    const user = useContext(UserContext);

    useEffect(() => {
      if (user) return;
      router.push('/auth/signin').catch(e => console.error(e));
    }, []);

    if (!user)
      return <div>Unauthorized access. Redirecting to login page...</div>;

    return <WrappedComponent {...props} />;
  };
}
