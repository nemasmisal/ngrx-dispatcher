import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

export const UsersActionTypes = {
    loadUsers: '[User] Load Users',
    loadUsersCancel: '[User] Load Users Cancel',
    loadUsersSuccess: '[User] Load Users Success',
    loadUsersFailed: '[User] Load Users Failed',
}

export const UserActionTypes = {
    loadUser: '[User] Load User',
    loadUserCancel: '[User] Load User Cancel',
    loadUserSuccess: '[User] Load User Success',
    loadUserFailed: '[User] Load User Failed',
}

export const loadUsers = createAction(UsersActionTypes.loadUsers);
export const loadUsersCancel = createAction(UsersActionTypes.loadUsersCancel);
export const loadUsersSuccess = createAction(
    UsersActionTypes.loadUsersSuccess,
    props<{ users: any[] }>()
);
export const loadUsersFailed = createAction(
    UsersActionTypes.loadUsersFailed,
    props<{ error: HttpErrorResponse }>()
);

export const loadUser = createAction(
    UserActionTypes.loadUser,
    props<{ id: string }>()
);
export const loadUserCancel = createAction(
    UserActionTypes.loadUserCancel,
    props<{ id: string }>()
);
export const loadUserSuccess = createAction(
    UserActionTypes.loadUserSuccess,
    props<{ id: string, user: any }>()
);
export const loadUserFailed = createAction(
    UserActionTypes.loadUserFailed,
    props<{ error: HttpErrorResponse, id: string }>()
);