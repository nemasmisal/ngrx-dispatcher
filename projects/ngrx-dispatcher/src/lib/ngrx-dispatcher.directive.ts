import { Directive, Input, OnDestroy } from '@angular/core';
import { combineLatest, map, Observable, Observer, race, Subscription, switchMap, take } from 'rxjs';

export interface Dispatcher {
  dispatch: (...args: any[]) => void;
  cancel: (...args: any[]) => void;
  success$: Observable<boolean>;
  failed$: Observable<boolean>;
  dependencies?: Observable<any>[];
}

@Directive({
  selector: '[ngrxDispatcher]',
  exportAs: 'ngrxDispatcher',
  standalone: true,
})
export class NgrxDispatcherDirective implements OnDestroy {

  private readonly subscription = new Subscription();
  private readonly loadingIndex: { [key: number]: boolean } = {};
  private readonly indexDeps: { [key: number]: any[] } = {};
  private readonly cancelList: ((...args: any[]) => void)[] = [];
  private readonly errors: boolean[] = [];

  get hasError(): boolean {
    return this.errors.includes(true);
  }

  get isLoading(): boolean {
    return Object.values(this.loadingIndex).includes(true);
  }

  get isReady(): boolean {
    return !this.isLoading && !this.hasError;
  }

  @Input() set ngrxDispatcher(entries: Dispatcher[]) {

    for (let i = 0; i < entries.length; i++) {
      const dispatcher = entries[i];
      const { dependencies, cancel } = dispatcher;
      this.errors[i] = false;
      this.cancelList.push(cancel);
      this.loadingIndex[i] = true;
      if (dependencies?.length) {
        this.dispatchWithDeps(i, dispatcher);
        continue;
      }
      this.subscription.add(
        this.dispatch(i, dispatcher, []).subscribe(this.observer(i))
      );
    }
  }

  private dispatchWithDeps = (i: number, dispatcher: Dispatcher): void => {
    this.subscription.add(
      combineLatest(dispatcher.dependencies!).pipe(
        switchMap((deps) => this.dispatch(i, dispatcher, deps)))
        .subscribe(this.observer(i))
    );
  }

  private dispatch = (i: number, config: Dispatcher, deps: any[]): Observable<boolean> => {
    const { dispatch, success$, failed$ } = config;
    this.errors[i] = false;
    this.indexDeps[i] = deps;
    dispatch(...deps);
    return race(
      success$.pipe(map(() => true)),
      failed$.pipe(map(() => false)),
    ).pipe(take(1));
  }

  private observer(i: number): Observer<boolean> {
    return {
      next: (value: boolean) => this.next(i, value),
      error: () => this.error(i),
      complete: () => this.complete(i)
    }
  }

  private next = (i: number, result: boolean | void): void => {
    this.errors[i] = !result;
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  private error = (i: number): void => {
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  private complete = (i: number): void => {
    this.loadingIndex[i] = false;
    this.indexDeps[i] = [];
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    for (let i = 0; i < this.cancelList.length; i++) {
      if (this.loadingIndex[i]) {
        this.cancelList[i](...this.indexDeps[i]);
      }
    }
  }
}
