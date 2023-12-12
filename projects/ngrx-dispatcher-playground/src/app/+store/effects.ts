import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, takeUntil, map, of } from "rxjs";
import { UserService } from "../user.service";
import { loadUser, loadUserCancel, loadUserFailed, loadUsers, loadUsersCancel, loadUserSuccess, UsersActionTypes } from "./actions";

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) { }

  public readonly loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(loadUsers),
    switchMap(() => this.userService.loadUsers().pipe(
      map(users => ({ type: UsersActionTypes.loadUsersSuccess, users })),
      catchError(error => of(({ type: UsersActionTypes.loadUsersFailed, error }))),
      takeUntil(this.actions$.pipe(ofType(loadUsersCancel))),
    ))
  ));

  public readonly loadUserById$ = createEffect(() => this.actions$.pipe(
    ofType(loadUser),
    switchMap(({ id }: { id: string }) => this.userService.loadUserById(id).pipe(
      map(user => loadUserSuccess({ user, id })),
      catchError(error => of(loadUserFailed({ error, id }))),
      takeUntil(this.actions$.pipe(ofType(loadUserCancel.type)))
    ))
  ));
}
