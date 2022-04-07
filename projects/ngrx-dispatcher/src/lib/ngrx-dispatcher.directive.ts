import { Directive, Input } from '@angular/core';
import { combineLatest, map, Observable, Observer, race, Subject, switchMap, take, takeUntil } from 'rxjs';

export interface Dispatcher {
  dispatch: (...args: any[]) => void;
  cancel: (...args: any[]) => void;
  success$: Observable<any>;
  failed$: Observable<any>;
  dependencies?: Observable<any>[];
}

@Directive({
  selector: '[ngrxDispatcher]',
  exportAs: 'ngrxDispatcher'
})
export class NgrxDispatcherDirective {

  private destroySubscriptions$$ = new Subject<void>();
  private loadingIndex: { [key: number]: boolean } = {};
  private indexDeps: { [key: number]: any[] } = {};
  private cancelList: ((...args: any[]) => void)[] = [];
  private errors: boolean[] = [];

  get hasError(): boolean {
    return this.errors.includes(true);
  }

  get isLoading(): boolean {
    return Object.values(this.loadingIndex).includes(true);
  }

  get isReady(): boolean {
    return !this.isLoading && !this.hasError;
  }

  @Input() set ngrxDispatcher(dispatcherList: Dispatcher[]) {

    for (let i = 0; i < dispatcherList.length; i++) {
      const dispatcher = dispatcherList[i];
      const { dependencies, cancel } = dispatcher;
      this.errors[i] = false;
      this.cancelList.push(cancel);
      this.loadingIndex[i] = false;
      if (dependencies?.length) {
        this.dispatchWithDeps(i, dispatcher);
        return;
      }
      this.dispatch(i, dispatcher, []).subscribe(this.observer(i));
    }
  }

  dispatchWithDeps = (i: number, dispatcher: Dispatcher): void => {
    const { dependencies } = dispatcher;
    combineLatest(dependencies || []).pipe(
      takeUntil(this.destroySubscriptions$$),
      switchMap((deps) => this.dispatch(i, dispatcher, deps))
    ).subscribe(this.observer(i));
  }

  dispatch = (i: number, config: Dispatcher, deps: any[]): Observable<boolean> => {
    const { dispatch, success$, failed$ } = config
    this.errors[i] = false;
    this.loadingIndex[i] = true;
    this.indexDeps[i] = deps;
    dispatch(deps);
    return race(
      success$.pipe(map(() => true)),
      failed$.pipe(map(() => false)),
    ).pipe(take(1));
  }

  observer(i: number): Observer<boolean> {
    return {
      next: (value: boolean) => this.next(i, value),
      error: () => this.error(i),
      complete: () => this.complete(i)
    }
  }

  next = (i: number, result: boolean | void): void => {
    this.errors[i] = !result;
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  error = (i: number): void => {
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  complete = (i: number): void => {
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$$.next();
    this.destroySubscriptions$$.complete();
    for (let i = 0; i < this.cancelList.length; i++) {
      if(!this.loadingIndex[i]) { continue; }
      const dispatchCancel = this.cancelList[i];
      const deps = this.indexDeps[i];
      dispatchCancel(...(deps || []));
      this.loadingIndex[i] = false;
    }
  }
}
