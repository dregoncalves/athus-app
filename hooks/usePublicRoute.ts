// hooks/usePublicRoute.ts
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';

export function usePublicRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)');
    }
  }, [user, loading, router]);
}
