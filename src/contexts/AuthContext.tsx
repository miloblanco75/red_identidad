import React, { createContext, useContext, useEffect, useState } from 'react';

interface LocalUser {
  phone: string;
  member_number: number;
  level: string;
  code: string;
}

interface AuthContextType {
  user: LocalUser | null;
  isLoading: boolean;
  loginLocal: (user: LocalUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginLocal: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('red_identidad_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('red_identidad_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginLocal = (newUser: LocalUser) => {
    setUser(newUser);
    localStorage.setItem('red_identidad_user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('red_identidad_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginLocal, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
