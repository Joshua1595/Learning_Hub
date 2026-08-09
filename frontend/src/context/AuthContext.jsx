import { createContext, useEffect, useState } from "react";
import { loginUser, getMe } from "../services/authService";
import { saveToken, removeToken, getToken } from "../utils/storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
         const response = await getMe();
         const userData = {
            id: response.user.id,
            name: response.user.name,
            role: response.user.role,
          };
         console.log("AUTH USER:", userData);
         setUser(userData);
      } catch (error) {
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    await loginUser(credentials);

    const response = await getMe();

    const userData = {
      id: response.user.id,
      name: response.user.name,
      role: response.user.role,
    };

    setUser(userData);

    console.log("AUTH USER:", userData);

    return userData;
  };
  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}