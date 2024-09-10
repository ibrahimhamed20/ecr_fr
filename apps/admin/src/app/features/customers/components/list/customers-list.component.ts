import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { BlockedTableConfig, PendingTableConfig, VerifiedTableConfig } from './customers-list.config';
import { CustomersService } from '@admin-features/customers/services/customers.service';
import { CustomersTypeEnum } from '@shared-utils';
import {TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TableComponent,
    TabViewModule,
    TabMenuModule,
    TranslateModule
  ],
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  keyword: any = ''

  items: MenuItem[] = [
    { label: 'Verified' },
    { label: 'Pending' },
    { label: 'Blocked' },
  ];
  activeItem!: MenuItem;
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Pages' },
    { label: 'Customers' },
  ];
  customers_Status = CustomersTypeEnum;
  tableConfig!: TableConfig;

  constructor(private _customers: CustomersService, _transalte :TranslateService) { }

  ngOnInit(): void {
    this.activateTab(this.items[0]);
  }

  activateTab(item: MenuItem) {
    this.activeItem = item;
    if (item.label === 'Verified') {
      this.tableConfig = VerifiedTableConfig;
      this.getVerifiedCustomers();
    } else if (item.label == 'Pending') {
      this.tableConfig = PendingTableConfig;
      this.getPendeingCutomers()
    } else if (item.label == 'Blocked') {
      this.tableConfig = BlockedTableConfig;
      this.getBLockedCustomers();
    }
  }

  getBLockedCustomers() {
    this._customers.getAllBlockedCustomers()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.tableConfig.actions = [];
        this.tableConfig.rows = res.data || [];
      });
  }

  getVerifiedCustomers() {
    this._customers.getAllPendingCustomers(true, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.tableConfig.actions = [];
        this.tableConfig.rows = res.data || [];
      });
  }

  getPendeingCutomers() {
    this._customers.getAllPendingCustomers(false, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.tableConfig.actions = [];
        this.tableConfig.rows = res.data || [];
      });
  }

  onActionClicked(ev: any) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
