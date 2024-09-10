import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableConfig } from '@shared-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { Subject } from 'rxjs';
import { VariantsTableConfig } from '@admin-features/products/products.config';

@Component({
  selector: 'admin-variants',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './variants.component.html',
})
export class VariantsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.tableConfig = VariantsTableConfig;
  }

  tableConfig!: TableConfig;
  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this._router.navigate(['0'], { relativeTo: this._route });
        break;
      case 'DELETE':
        this._confirm.confirm('delete').subscribe((res) => {
          res && console.log('Nothing its just delete for test');
        });
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
