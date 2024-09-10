import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { MerchantProductsTableConfig } from './merchants.config';
import { MerchantProductsService } from '@admin-features/products/services/merchant-products-services.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormControl } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { MerchantProductParams } from '@admin-features/products/interfaces/products.interface';

@Component({
  selector: 'admin-merchantproducts',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonModule, RippleModule,BreadcrumbComponent],
  templateUrl: './merchant-products.component.html',
})
export class MerchantproductsComponent implements OnInit {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  tableConfig!: TableConfig;
  searchControl: FormControl = new FormControl();
  filters: MerchantProductParams = { pageNumber: 1, pageSize: 10 };
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Merchant Management' },
    { label: 'merchant', route: '' },
  ];
  constructor(
    private _router: Router,
    private _toast: ToastrService,
    private _confirm: ConfirmDialogService,
    private _merchantProducts: MerchantProductsService) { }

  ngOnInit(): void {
    this.getMerchantProducts(this.filters);
    this.onSearchData();
  }

  onSearchData() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim()?.length > 0),
      debounceTime(400),
      switchMap((term) => this._merchantProducts.searchForMerchantProduct(term))
    ).subscribe((res) => (this.tableConfig.rows = res.data));
  }

  onPageChange(event: PaginatorState): void {
    this.filters = { pageSize: event.rows || 10, pageNumber: event.page || 1 };
    this.getMerchantProducts(this.filters);
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'APPROVE':
        this.approveMerchantProduct(ev.data);
        break;
      case 'REJECT':
        this.rejectMerchantProduct(ev.data);
        break;
      case 'LINK':
      default:
        this._router.navigate([`/products/link-products/${ev.data.id}`]);
        break;
    }
  }

  getMerchantProducts(params: MerchantProductParams) {
    this._merchantProducts.getMerchantProduct({ ...params, Status: 'new' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) =>
        this.tableConfig = { ...MerchantProductsTableConfig, rows: res.data.result, totalRecords: res.data.rowCount });
  }

  approveMerchantProduct(row: any) {
    this._confirm.confirm('confirm').subscribe(confirmed => {
      if (confirmed)
        this._merchantProducts.approveProduct({ productDefinitionId: row.id, merchantProductStatus: 'approved' })
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res: any) => {
            if (res) {
              this._toast.success('Product Aproved Successfully');
              this.getMerchantProducts(this.filters);
            }
          });
    });
  }

  rejectMerchantProduct(row: any) {
    this._confirm.confirm('warn').subscribe((res) => {
      if (res)
        this._merchantProducts.rejectProduct({ productDefinitionId: row.id, merchantProductStatus: 'rejected' })
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res: any) => {
            if (res) {
              this._toast.success('Product Rejected Successfully');
              this.getMerchantProducts(this.filters);
            }
          });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
