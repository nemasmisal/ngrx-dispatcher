# Getting Started with ngrx-dispatcher and it playground

This is simple directive, that will handle the dispatch of a request, as will re-dispatch if one of the dependencies
has changed, listen for success either failure and cancel ongoing requests in case of destroying the component before
request is done. Directive gives you 3 possible states as loading(isLoading), ready(isReady), error(hasError) which can
be used to show proper template at time.Setup accept Object(which is described few lines down) or Array of Objects.
Here some basic examples:

## Install && Setup

clone the entire project to your local machine.First thing you have to do is build the ngrx-dispatcher module from terminal at the main folder:

```javascript
ng build ngrx-dispatcher
```

then you can start the playground simple as:

```javascript
ng serve
```

## Object info
```javascript
{
    dispatch: function;
    cancel: function;
    success$: Observable<any>
    failed$: Observable<any>
    dependencies?: Optional Array of Observables;
}
```

## Example without dependencies

example.component.ts

```typescript
 ngrxDispatcher: Dispatcher[] = [
    {
      dispatch: () => this.store.dispatch(userActions.loadUsers()),
      cancel: () => this.store.dispatch(userActions.loadUsersCancel()),
      success$: this.storeActions.pipe(ofType(userActions.loadUsersSuccess)),
      failed$: this.storeActions.pipe(ofType(userActions.loadUsersFailed)),
    }
  ];
```

exmaple.component.html

```html
<div [ngrxDispatcher]="ngrxDispatcher" #userDispatcher="ngrxDispatcher">

    <ng-container *ngIf="userDispatcher.isLoading">
        <p>Loading..</p>
    </ng-container>

    <ng-container *ngIf="userDispatcher.isReady">
        <h1>Users: </h1>
        <div *ngFor="let user of (users$ | async)">
            <p>{{ user.id }}.</p>
            <p>{{ user.name }}</p>
        </div>
    </ng-container>

    <ng-container *ngIf="userDispatcher.hasError">
        <p>error</p>
    </ng-container>

</div>
```
## Exmaple with dependencies

exmaple.component.ts
```typescript
user$ = this.store.select(userSelectors.user);
userId$ = this.store.select(selectRouteParams).pipe(
  map(params => params && params['userId']),
  filter(userId => userId)
);
reloadData$ = new BehaviorSubject('');

ngrxDispatcher: Dispatcher[] = [
  {
    dispatch: ([id]: [string]) => this.store.dispatch(userActions.loadUser({ id })),
    cancel: ([id]: [string]) => this.store.dispatch(userActions.loadUserCancel({ id })),
    success$: this.storeActions.pipe(ofType(userActions.loadUserSuccess)),
    failed$: this.storeActions.pipe(ofType(userActions.loadUserFailed)),
    dependencies: [this.userId$, this.reloadData$]
    }
  ];
```

example.component.html

```typescript
<div [ngrxDispatcher]="ngrxDispatcher" #userDispatcher="ngrxDispatcher">

  <ng-container *ngIf="userDispatcher.isLoading">
    <p>Loading..</p>
  </ng-container>

  <ng-container *ngIf="userDispatcher.isReady">

    <h1>Details for user: </h1>
    <div *ngIf="(user$ | async) as user">
      <div>
        <p>ID:</p>
        <p>{{ user.id }}</p>
      </div>

      <div>
        <p>Name:</p>
        <p>{{ user.name }}</p>
      </div>
    </div>
  </ng-container>

  <ng-container *ngIf="userDispatcher.hasError">
    <p>error</p>
  </ng-container>

  <button [disabled]="userDispatcher.isLoading" [ngClass]="{'isLoading': userDispatcher.isLoading }"
    (click)="reloadData()">Reload</button>

</div>
```
