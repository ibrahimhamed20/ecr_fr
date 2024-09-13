import { DialogModule } from 'primeng/dialog';
import { Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfig } from './dialog.config';
import { CustomDialogService } from './dialog.service';
import { first, of, Subject } from 'rxjs';

@Component({
  selector: 'shared-ui-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  private dynamicContainer!: ViewContainerRef;

  toggle: boolean = false;
  config: DialogConfig = { position: 'right', title: 'Dialog' };

  private closed$: Subject<any> = new Subject<any>();

  constructor(public _customDialog: CustomDialogService) {
    this._customDialog.open = this.open.bind(this);
    this._customDialog.getData = this.getData.bind(this);
    this._customDialog.close = this.close.bind(this);
  }

  open(component: Type<any>, config: DialogConfig) {
    this.toggle = true;
    this.config = config;
    this.dynamicContainer.clear();
    component && this.dynamicContainer.createComponent(component);

    const afterClosed = this.closed$.asObservable().pipe(first());
    return { afterClosed };
  }

  getData<T>(): T {
    return this.config.data || <T>{};
  }

  close(data?: any) {
    this.toggle = false;
    this.closed$.next(data);
  }
}
