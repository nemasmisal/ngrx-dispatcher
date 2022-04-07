import { Action, createReducer, on } from "@ngrx/store";
import * as user from "./actions";

export interface IUserState {
    users: any[] | null;
    user: any | null;
}

export const initialState: IUserState = {
    users: null,
    user: null
}

export const userReducer = createReducer(
    initialState,
    on(user.loadUsersSuccess, (state, { users }) => ({ ...state, users })),
    on(user.loadUserSuccess, (state, { user, id }) => ({ ...state, user }))
);
