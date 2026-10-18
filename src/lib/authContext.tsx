import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoAdminActive: boolean;
  setDemoAdminActive: (active: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  demoAdminActive: false,
  setDemoAdminActive: () => {},
});

export const ADMIN_EMAILS = ['dragonballsam86@gmail.com', 'dragonballsam86@gmai.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoAdminActive, setDemoAdminActive] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if admin by email
        const isEmailAdmin = ADMIN_EMAILS.some(
          (email) => currentUser.email?.toLowerCase() === email.toLowerCase()
        );

        if (isEmailAdmin) {
          setIsAdmin(true);
        } else {
          // Check admins collection in Firestore
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdmin(adminDoc.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In failed or was blocked by iframe sandbox:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDemoAdminActive(false);
    } catch (err) {
      console.error('Sign-Out error:', err);
    }
  };

  const effectiveIsAdmin = isAdmin || demoAdminActive;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: effectiveIsAdmin,
        isLoading,
        loginWithGoogle,
        logout,
        demoAdminActive,
        setDemoAdminActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
