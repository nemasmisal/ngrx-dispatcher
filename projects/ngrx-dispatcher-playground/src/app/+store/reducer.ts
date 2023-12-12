import { createReducer, on } from "@ngrx/store";
import * as user from "./actions";
import { User } from "../user.service";

export interface IUserState {
  users: User[] | null;
  user: User | null;
}

export const initialState: IUserState = {
  users: null,
  user: null
}

export const userReducer = createReducer(
  initialState,
  on(user.loadUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(user.loadUserSuccess, (state, { user }) => ({ ...state, user }))
);
