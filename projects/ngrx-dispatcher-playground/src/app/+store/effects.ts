import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap, of, takeUntil } from "rxjs";
import { UserService } from "../user.service";
import { loadUser, loadUserCancel, loadUserFailed, loadUsers, loadUsersCancel, loadUsersSuccess, loadUserSuccess, UserActionTypes, UsersActionTypes } from "./actions";

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(loadUsers),
        mergeMap(() => this.userService.loadUsers().pipe(
            takeUntil(this.actions$.pipe(ofType(loadUsersCancel))),
            mergeMap(users => [({ type: UsersActionTypes.loadUsersSuccess, users })]),
            catchError(error => [({ type: UsersActionTypes.loadUsersFailed, error })])
        ))
    ));

    loadUserById$ = createEffect(() => this.actions$.pipe(
        ofType(loadUser),
        mergeMap(({ id }: { id: string }) => this.userService.loadUserById([id]).pipe(
            takeUntil(this.actions$.pipe(ofType(loadUserCancel.type))),
            mergeMap(user => [loadUserSuccess({ user, id })]),
            catchError(error => [loadUserFailed({ error, id })])
        ))
    ));
}
