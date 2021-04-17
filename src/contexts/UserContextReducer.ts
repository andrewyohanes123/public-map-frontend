import { UserContextAttributes } from './UserContext';

export interface reducerArgs {
  type: "LOGIN" | "LOGOUT" | "SET_AUTH";
  payload: UserContextAttributes;
  // action
}

export default function UserContextReducer(state: UserContextAttributes, { type, payload }: reducerArgs): UserContextAttributes {
  switch (type) {
    case "LOGIN":
      return { ...payload };
    case "LOGOUT":
      return { login: false, auth: payload.auth, user: null };
    case "SET_AUTH": 
      return { login: false, auth: payload.auth, user: null }
    default:
      return state;
  }
}