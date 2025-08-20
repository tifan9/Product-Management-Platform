import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, LoginCredentials, AuthContextType } from '../types';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: false,
    error: null,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login(credentials);
      
      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
        token: response.token,
        refreshToken: response.refreshToken,
      };

      // Save to localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Save to sessionStorage for session-only persistence
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    user: state.user,
    login,
    logout,
    loading: state.loading,
    error: state.error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};