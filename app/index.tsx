/* eslint-disable import/no-unresolved */
import useUser from '@/hooks/auth/useUser';
import { Redirect } from 'expo-router';
import Loader from '@/components/loader/loader';

export default function TabsIndex() {
  const { loading, user } = useUser();
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        //TODO
        // <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
        <Redirect href={!user ? '/(routes)/login' : '/(tabs)'} />
      )}
    </>
  );
}
