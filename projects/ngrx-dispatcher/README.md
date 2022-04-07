# NgrxDispatcher

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

## Code scaffolding
in our users.component.ts: 
//WITHOUT dependencies

ngrxDispatcher: Dispatcher[] = [
    {
      dispatch: () => this.store.dispatch(userActions.loadUsers()),
      cancel: () => this.store.dispatch(userActions.loadUsersCancel()),
      success$: this.storeActions.pipe(ofType(userActions.loadUsersSuccess)),
      failed$: this.storeActions.pipe(ofType(userActions.loadUsersFailed)),
    }
];

in our users.component.html:

<div [ngrxDispatcher]="ngrxDispatcher" #userDispatcher="ngrxDispatcher">

    <ng-container *ngIf="userDispatcher.isLoading">
        <p>Loading..</p>
    </ng-container>

    <ng-container *ngIf="userDispatcher.isReady">
        <h1>Users: </h1>
        <div class="user" *ngFor="let user of users$ | async">
            <p>{{ user.id }}</p>
            <p>{{ user.name }}</p>
        </div>
    </ng-container>

    <ng-container *ngIf="userDispatcher.hasError">
        <p>error</p>
    </ng-container>

</div>

--------------------------------------------------------------------------
in our user-detail.component.ts
//WITH dependencies

userId$ = this.store.select(selectRouteParams).pipe(
    map(params => params && params['userId'])
);

ngrxDispatcher: Dispatcher[] = [
    {
      dispatch: ([id]: [string]) => this.store.dispatch(userActions.loadUser({ id })),
      cancel: ([id]: [string]) => this.store.dispatch(userActions.loadUserCancel({ id })),
      success$: this.storeActions.pipe(ofType(userActions.loadUserSuccess)),
      failed$: this.storeActions.pipe(ofType(userActions.loadUserFailed)),
      dependencies: [this.userId$]
    }
];

in our user-detail.component.html

<div [ngrxDispatcher]="ngrxDispatcher" #userDispatcher="ngrxDispatcher">

    <ng-container *ngIf="userDispatcher.isLoading">
        <p>Loading..</p>
    </ng-container>

    <ng-container *ngIf="userDispatcher.isReady">
        <h1>Users: </h1>
        <div class="user" *ngIf="(user$ | async) as user">
            <p>{{ user.id }}</p>
            <p>{{ user.name }}</p>
        </div>
    </ng-container>

    <ng-container *ngIf="userDispatcher.hasError">
        <p>error</p>
    </ng-container>

</div>
