import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
  recoverSession: (phoneOrCode: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginLocal: () => {},
  signOut: () => {},
  recoverSession: async () => false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// Cookie Helpers for Dual Storage Persistence (PWA + Browser)
const setCookie = (name: string, value: string, days = 365) => {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie write error:', e);
  }
};

const getCookie = (name: string): string | null => {
  try {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
  } catch (e) {
    return null;
  }
};

const eraseCookie = (name: string) => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  } catch (e) {}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Try reading from localStorage
    const storedUser = localStorage.getItem('red_identidad_user');
    // 2. Try reading from Cookie fallback
    const cookieUser = getCookie('red_identidad_user');

    const validData = storedUser || cookieUser;

    if (validData) {
      try {
        const parsed = JSON.parse(validData);
        setUser(parsed);
        // Ensure both storages are synced
        localStorage.setItem('red_identidad_user', validData);
        setCookie('red_identidad_user', validData);
      } catch (e) {
        localStorage.removeItem('red_identidad_user');
        eraseCookie('red_identidad_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginLocal = (newUser: LocalUser) => {
    setUser(newUser);
    const json = JSON.stringify(newUser);
    localStorage.setItem('red_identidad_user', json);
    setCookie('red_identidad_user', json);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('red_identidad_user');
    eraseCookie('red_identidad_user');
  };

  const recoverSession = async (phoneOrCode: string): Promise<boolean> => {
    const clean = phoneOrCode.trim().toUpperCase();
    if (!clean) return false;

    try {
      // Search by code or by phone in Supabase
      const { data, error } = await supabase
        .from('stickers')
        .select('*')
        .or(`code.eq.${clean},phone.eq.${clean.toLowerCase()},phone.eq.${phoneOrCode.trim()}`)
        .not('phone', 'is', null)
        .limit(1);

      if (error || !data || data.length === 0) {
        return false;
      }

      const sticker = data[0];
      loginLocal({
        phone: sticker.phone,
        member_number: sticker.member_number,
        level: sticker.level,
        code: sticker.code,
      });

      return true;
    } catch (err) {
      console.error('Error recovering session:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginLocal, signOut, recoverSession }}>
      {children}
    </AuthContext.Provider>
  );
};
