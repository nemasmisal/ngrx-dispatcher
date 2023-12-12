import { getRouterSelectors } from "@ngrx/router-store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUserState } from "./reducer";

const getUserState = createFeatureSelector<IUserState>('user');

const getUsers = createSelector(getUserState, (state: IUserState) => state.users);
const getUser = createSelector(getUserState, (state: IUserState) => state.user);

export const userSelectors = {
    users: getUsers,
    user: getUser
}

export const { selectRouteParams } = getRouterSelectors();
