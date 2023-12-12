import { Component } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { userSelectors } from '../+store/selectors';
import * as userActions from '../+store/actions';
import { Dispatcher } from 'ngrx-dispatcher';
import { ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { User } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {

  public readonly users$: Observable<User[] | null> = this.store.select(userSelectors.users);

  public readonly ngrxDispatcher: Dispatcher[] = [
    {
      dispatch: () => this.store.dispatch(userActions.loadUsers()),
      cancel: () => this.store.dispatch(userActions.loadUsersCancel()),
      success$: this.storeActions.pipe(ofType(userActions.loadUsersSuccess)),
      failed$: this.storeActions.pipe(ofType(userActions.loadUsersFailed)),
    }
  ];

  constructor(private store: Store, private storeActions: ActionsSubject) { }

}
