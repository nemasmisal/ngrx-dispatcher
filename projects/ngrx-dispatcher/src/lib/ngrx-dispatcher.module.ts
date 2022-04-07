import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgrxDispatcherDirective } from './ngrx-dispatcher.directive';

@NgModule({
  declarations: [NgrxDispatcherDirective],
  imports: [CommonModule],
  exports: [NgrxDispatcherDirective]
})
export class NgrxDispatcherModule { }
