import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authStateListener, signOut } from '../firebase/auth';

type User = any;

const AuthContext = createContext<{ user: User | null; loading: boolean; signOut: () => Promise<void> } | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authStateListener((u: any) => {
      setUser(u || null);
      setLoading(false);
      if (u) {
        const toStore = { ...u, claims: u.claims || {} };
        try {
          // eslint-disable-next-line no-console
          console.debug('[AuthProvider] persist user:', {
            uid: (toStore as any).uid || (toStore as any).user?.uid || null,
            type: (toStore as any).userType || (toStore as any).type || null,
            approved: !!(toStore as any).approved,
          });
          localStorage.setItem('bloodlink_user', JSON.stringify(toStore));
        } catch (e) {
          // ignore storage errors
        }
      } else {
        try { localStorage.removeItem('bloodlink_user'); } catch (e) {}
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
