import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser && savedUser.token) {
        try {
          const { data } = await axios.get('/auth/profile', {
            headers: { Authorization: `Bearer ${savedUser.token}` },
          });
          const updatedUser = { 
            ...savedUser, 
            name: data.name, 
            email: data.email, 
            role: data.role, 
            skills: data.skills || [], 
            resume: data.resume || '' 
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);