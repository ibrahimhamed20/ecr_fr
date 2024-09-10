import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { MenuItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { StoresService } from '@admin-features/merchants/services/stores.service';
import { Subject, takeUntil } from 'rxjs';
import { PendingTableConfig, StoreTableConfig } from './stores.config';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TablePageEvent } from 'primeng/table';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'admin-stores',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, TableComponent, TabViewModule, TabMenuModule],
  templateUrl: './stores.component.html'
})
export class StoresComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  items: MenuItem[] = [{ label: 'Stores' }, { label: 'Pending' }];
  activeItem!: MenuItem;

  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Stores Management' },
    { label: 'Stores', route: '/stores' }
  ];

  tableConfig!: TableConfig;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _stores: StoresService,
    private _confirm: ConfirmDialogService) { }

  ngOnInit(): void {
    this.activateTab(this.items[0]);
  }

  activateTab(item: MenuItem) {
    this.activeItem = item;
    if (item.label === 'Stores') {
      this.tableConfig = StoreTableConfig;
      this.getAcceptedStores();
    } else {
      this.tableConfig = PendingTableConfig;
      this.getPendingStores();
    }
  }

  getAcceptedStores() {
    this._stores.getAcceptedStores()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.tableConfig.actions = ['CREATE', 'DELETE_ALL'];
        this.tableConfig.rows = res.data.map(el => ({
          ...el,
          classificationName: el.classificationName?.name,
          owner: el.user?.userName,
          expireDate: el.merchantSubscriptionPlan?.expireDate,
          mobileNumber: el.user?.mobileNumber,
          registerDate: el.user?.registerDate
        })) || [];
      })
  }

  getPendingStores() {
    this._stores.getPendingStores()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.tableConfig.actions = ['CREATE', 'DELETE_ALL'];
        this.tableConfig.rows = res.data.result.map(el => ({
          ...el,
          classificationName: el.classificationName?.name,
          owner: el.user?.userName,
          merchantTypeName: el.merchantTypeName?.type
        })) || [];
      })
  }

  onPaginate(ev: PaginatorState){
    console.info(ev);
  }

  onActionClicked(ev: { action: string, data?: any }) {
    alert(JSON.stringify(ev));
    switch (ev.action) {
      case 'CREATE':
        this._router.navigate(['0'], { relativeTo: this._route });
        break;
      case 'DELETE':
        this._confirm.confirm('delete').subscribe(res => {
          res && console.log('Nothing its just delete for test');
        })
        break;
      default:
        console.log('Nothing to do');
        break;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
