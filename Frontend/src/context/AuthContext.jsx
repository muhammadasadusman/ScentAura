import { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Synchronize on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser && firebaseUser) {
        try {
          const { data } = await API.post("/users/google", {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
          });
          login(data.user, data.token);
        } catch (e) {
          console.error("Auto sync error:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase logout error:", e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { data } = await API.post("/users/google", {
        name: result.user.displayName || result.user.email.split("@")[0],
        email: result.user.email,
      });

      login(data.user, data.token);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
