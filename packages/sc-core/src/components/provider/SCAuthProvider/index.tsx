import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import sessionServices from '../../../services/session';
import { SCContext, SCContextType } from '../SCContextProvider'
import {setAuthorizeToken} from '../../../utils/http';

/**
 * Interface SCUser
 */
export interface SCUserType {
  username: string;
  avatar?: string;
  slogan?: string;
}

/**
 * Interface SCAuthContextType
 */
export interface SCAuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: SCUserType;
  loading: boolean;
  error?: any;
  logout: () => void;
}

export const SCAuthContext = createContext<SCAuthContextType>({} as SCAuthContextType);

// Export the provider as we need to wrap the entire app with it
export default function SCAuthProvider({ children, }: { children: React.ReactNode; }): JSX.Element {
  const [user, setUser] = useState<SCUserType>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const scContext: SCContextType = useContext(SCContext);
  setAuthorizeToken(scContext.settings.session.token.access_token);

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, []);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  // If there is an error, it means there is no session.
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    sessionServices.getCurrentUser()
      .then((_user) => setUser(_user))
      .catch((_error) => {setError(_error)})
      .finally(() => setLoading(false));
  }, []);

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    setUser(undefined);
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
    }),
    [user, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  // <SCAuthContext.Provider value={memoedValue}>
  return (
    <SCAuthContext.Provider value={memoedValue}>
        {!loading && children}
    </SCAuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useSCAuth() {
  return useContext(SCAuthContext);
}
