import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getSession,
  onAuthStateChange,
  signOut as signOutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const currentSession = await getSession();

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user || null);
      } catch (error) {
        console.error("Session loading error:", error);

        if (!mounted) return;

        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await signOutUser();

    setSession(null);
    setUser(null);
  }

  const value = {
    session,
    user,
    authLoading,
    isAuthenticated: Boolean(user),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}