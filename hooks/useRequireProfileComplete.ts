import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/User';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

function isProfileComplete(user: User | null): boolean {
  if (!user) return false;
  return Boolean(
    user.telefone &&
    user.cpf &&
    user.dataNascimento &&
    user.pais &&
    user.estado &&
    user.cidade &&
    user.cep &&
    user.rua &&
    user.numero
  );
}

// Hook para ser usado em botões/ações bloqueadas
export function useRequireProfileComplete() {
  const { user } = useAuth();
  const router = useRouter();

  // useCallback para memoizar a função
  const requireComplete = useCallback(
    (onAllowed: () => void, onBlocked?: () => void) => {
      if (isProfileComplete(user)) {
        onAllowed();
      } else {
        if (onBlocked) {
          onBlocked();
        } else {
          // Default: redireciona para editar perfil
          router.push('/');
        }
      }
    },
    [user, router]
  );

  return {
    isComplete: isProfileComplete(user),
    requireComplete,
  };
}
