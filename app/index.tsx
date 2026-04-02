import { Redirect } from 'expo-router';

export default function EntryPoint() {
  const isAuthenticated = false; 

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}