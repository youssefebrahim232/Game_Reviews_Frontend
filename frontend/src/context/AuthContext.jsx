import { createContext, useContext, useReducer, useEffect } from 'react';
import { getRoleFromToken, isTokenExpired, getEmailFromToken } from '../utils/jwt';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.email,
        token: action.payload.token,
        role: getRoleFromToken(action.payload.token),
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'LOADED':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user');

    if (token && !isTokenExpired(token)) {
      dispatch({ type: 'LOGIN', payload: { email, token } });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOADED' });
    }
  }, []);

  const login = (email, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', email);
    dispatch({ type: 'LOGIN', payload: { email, token } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const isAdmin = state.role === 'Admin' || state.role === 'SuperAdmin';
  const isSuperAdmin = state.role === 'SuperAdmin';

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
