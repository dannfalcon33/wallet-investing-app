import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('falcon_auth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
    return { isAuthenticated: false, user: null };
  });

  useEffect(() => {
    localStorage.setItem('falcon_auth', JSON.stringify(auth));
  }, [auth]);

  const login = (username: string, pass: string) => {
    if (username === 'Dann33' && pass === 'compra33') {
      setAuth({ isAuthenticated: true, user: username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
