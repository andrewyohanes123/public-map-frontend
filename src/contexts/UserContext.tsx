import React, { useReducer, createContext } from 'react'
import AuthProvider from '@edgarjeremy/sirius.adapter/dist/libs/AuthProvider'
import UserContextReducer from './UserContextReducer';
import ModelInstance from '@edgarjeremy/sirius.adapter/dist/libs/ModelInstance';

export interface UserAttributes extends ModelInstance {
	// name: string;
	// username: string;
	// password: string;
	// type: "admin" | "operator";
	// created_at?: Date;
	// updated_at?: Date;
}

export interface UserContextAttributes {
  auth?: AuthProvider,
  login: boolean,
  user: UserAttributes | null,
  setAuth?: (auth: AuthProvider) => void;
  setLogin?: (user: UserAttributes) => void;
  setLogout?: () => void;
}

const initialState: UserContextAttributes = { login: false, user: null }

export const UserContext = createContext<UserContextAttributes>(initialState);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(UserContextReducer, initialState);

  const setAuth = (auth: AuthProvider) => {
    dispatch({
      type: "SET_AUTH",
      payload: { auth, login: false, user: null }
    });
  }

  const setLogin = (user: ModelInstance) => {
    dispatch({
      type: "LOGIN",
      payload: {auth: state.auth, login: true, user}
    });
  }

  const setLogout = () => {
    dispatch({
      type: "LOGOUT",
      payload: {auth: state.auth, login: false, user: null}
    });
  }

  return (
    <UserContext.Provider value={{ ...state, setAuth, setLogin, setLogout }}>
      {children}
    </UserContext.Provider>
  )
}