// app/services/database/use-auth.tsx
import {User} from '@supabase/supabase-js';
import {supabase} from './supabase';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AuthContextType = {
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  signOut: () => Promise<void>;
  signedIn: boolean;
  loading: boolean;
  error: string;
  user: User | null;
};

// We initialize the context with null to ensure that it is not used outside of the provider
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider manages the authentication state and provides the necessary methods to sign in, sign up and sign out.
 */
export const AuthProvider = ({children}: PropsWithChildren<any>) => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // Sign in with provided email and password
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError('');
      setUser(null);

      try {
        // get the session and user from supabase
        const {
          data: {session, user},
          error,
        } = await supabase.auth.signInWithPassword({email, password});

        // if we have a session and user, sign them in
        if (session && user) {
          setSignedIn(true);
          setUser(user);
          // otherwise sign them out and set an error
        } else {
          throw new Error(error?.message);
          setSignedIn(false);
          setUser(null);
        }
      } catch (error: any) {
        setError(error?.message ?? 'Unknown error');
        setSignedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [setSignedIn, setLoading, setError, setUser],
  );

  // Create a new account with provided email and password
  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError('');
      setUser(null);
      try {
        const {data, error} = await supabase.auth.signUp({email, password});
        if (error) {
          setSignedIn(false);
          setError(error.message);
        } else if (data.session) {
          await supabase.auth.setSession(data.session);
          setSignedIn(true);
          setUser(data.user);
        }
      } catch (error: any) {
        setUser(null);
        setSignedIn(false);
        setError(error?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [setSignedIn, setLoading, setError, setUser],
  );

  // Sign out the current user
  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setError('');
    setSignedIn(false);
    setLoading(false);
    setUser(null);
  }, [setSignedIn, setLoading, setError, setUser]);

  // Always memoize context values as they can cause unnecessary re-renders if they aren't stable!
  const value = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      signedIn,
      loading,
      error,
      user,
    }),
    [signIn, signOut, signUp, signedIn, loading, error, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  // It's a good idea to throw an error if the context is null, as it means the hook is being used outside of the provider
  if (context === null) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
