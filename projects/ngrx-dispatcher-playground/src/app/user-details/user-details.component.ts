import { Component } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { selectRouteParams, userSelectors } from '../+store/selectors';
import * as userActions from '../+store/actions';
import { map, filter, BehaviorSubject, Observable } from 'rxjs';
import { Dispatcher } from 'ngrx-dispatcher';
import { ofType } from '@ngrx/effects';
import { User } from '../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {

  public readonly user$: Observable<User | null> = this.store.select(userSelectors.user);
  public readonly userId$: Observable<string> = this.store.select(selectRouteParams).pipe(
    map(params => params && params['userId']),
    filter(userId => !!userId)
  );
  public readonly reloadData$ = new BehaviorSubject(0);

  ngrxDispatcher: Dispatcher[] = [
    {
      dispatch: (id: string) => this.store.dispatch(userActions.loadUser({ id })),
      cancel: (id: string) => this.store.dispatch(userActions.loadUserCancel({ id })),
      success$: this.storeActions.pipe(ofType(userActions.loadUserSuccess)),
      failed$: this.storeActions.pipe(ofType(userActions.loadUserFailed)),
      dependencies: [this.userId$, this.reloadData$]
    }
  ];

  constructor(
    private store: Store,
    private storeActions: ActionsSubject
  ) { }

  public reloadData(): void {
    this.reloadData$.next(0);
  }
}
