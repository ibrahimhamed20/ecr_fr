import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogService } from './confirm-dialog.service';
import { first, last, Subject } from 'rxjs';

@Component({
  selector: 'shared-ui-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule],
  providers: [ConfirmationService]
})
export class ConfirmDialogComponent {
  private confirmed$: Subject<boolean> = new Subject<boolean>();
  protected severity: any = 'primary';

  constructor(
    private _confirmation: ConfirmationService,
    private _confirm: ConfirmDialogService) {
    this._confirm.confirm = this.confirm.bind(this);
  }

  private confirm(type: 'delete' | 'warn' | 'confirm') {
    let config: any = {};

    switch (type) {
      case 'delete':
        this.severity = 'danger';
        config = {
          message: 'Are you sure you want to delete this item?',
          header: 'Delete Confirmation',
          icon: 'pi pi-trash',
          acceptLabel: 'Yes, Delete',
          rejectLabel: 'No, Cancel',
        };
        break;

      case 'warn':
        this.severity = 'warning';
        config = {
          message: 'This action might have unintended consequences. Proceed with caution!',
          header: 'Warning',
          icon: 'pi pi-exclamation-circle',
          acceptLabel: 'Proceed',
          rejectLabel: 'Cancel',
        };
        break;

      case 'confirm':
      default:
        this.severity = 'primary';
        config = {
          message: 'Do you want to proceed with this action?',
          header: 'Confirmation',
          icon: 'pi pi-question-circle',
          acceptLabel: 'Yes',
          rejectLabel: 'No',
        };
        break;
    }

    this._confirmation.confirm({
      ...config,
      accept: () => {
        console.log(`${type} action confirmed`);
        this.confirmed$.next(true);
      },
      reject: () => {
        console.log(`${type} action rejected`);
        this.confirmed$.next(false);
      }
    });
    return this.confirmed$.asObservable().pipe(first());
  }


}
