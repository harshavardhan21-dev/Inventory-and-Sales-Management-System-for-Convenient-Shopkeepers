// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    // Firebase calls this whenever the auth state changes (login / logout / page reload).
    // It returns an unsubscribe function — call it on cleanup to avoid memory leaks.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // null when logged out, User object when logged in
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere you need auth info
export function useAuth() {
  return useContext(AuthContext);
}
