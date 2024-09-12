import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ProductFilterComponent } from './filter/product-filter.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { downloadFile } from '../../helpers/helpers';
import { ProductsService } from '@admin-features/products/services/products.service';
import { FormControl } from '@angular/forms';
import { ProductInterface, ProductParams } from '@admin-features/products/interfaces/products.interface';
import { ProductTableConfig } from '@admin-features/products/components/product/product.config';
import { Subject, takeUntil, filter, debounceTime, switchMap } from 'rxjs';


@Component({
  selector: 'admin-product',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    BreadcrumbComponent,
    MenuModule,
    ProductFilterComponent,
    PaginatorModule,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  tableConfig!: TableConfig;
  items: MenuItem[] | undefined;
  currentPage: number = 1;
  totalRecords: number = 0;
  first: number = 0;

  rows: number = 10;

  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Products Management' },
    { label: 'Product', route: '/product' },
  ];
  searchControl: FormControl = new FormControl();
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirm: ConfirmDialogService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.getProducts({ pageSize: this.rows, pageNumber: this.currentPage });
    this.onSearch();
  }
  getProducts(page: ProductParams): void {
    this.productService
      .getProducts(page)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response && response.data) {
          const mappedProducts = response.data.result.map((product: ProductInterface) => ({
            ...product,
            unit: product.unit ? product.unit.name : '-', 
            classification: product.classification
              ? product.classification.name
              : 'No Classification',
          }));
  
          this.tableConfig = {
            ...ProductTableConfig,
            rows: mappedProducts,
            totalRecords: response.data.rowCount,
            rowsActions: ['EDIT', 'DELETE'],
          };
  
          this.totalRecords = response.data.rowCount;
        }
      });
  }
  
  // getProducts(page: ProductParams): void {
  //   this.productService
  //     .getProducts(page)
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((response) => {
  //       if (response && response.data) {
  //         this.tableConfig = {
  //           ...ProductTableConfig,
  //           rows: response.data.result,
  //           totalRecords: response.data.rowCount,
  //           rowsActions: ['EDIT', 'DELETE'],
  //         };
  //         this.totalRecords = response.data.rowCount;
  //       }
  //     });
  // }
  deleteProduct(id?: any): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.getProducts({
          pageSize: this.rows,
          pageNumber: this.currentPage,
        });
      },
    });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    this.currentPage = event.page || 1;
    this.getProducts({ pageSize: this.rows, pageNumber: this.currentPage });
  }

  exportProducts(): void {
    this.productService.downloadProdctsAsCsv().subscribe({
      next: (blob) => {
        downloadFile(blob, 'products.csv');
      },
    });
  }

  onActionClicked(ev: { action: string; data?: any }): void {
    switch (ev.action) {
      case 'CREATE':
        this._router.navigate(['product/id'], { relativeTo: this._route });
        break;
      case 'DELETE':
        this._confirm.confirm('delete').subscribe((confirmed) => {
          if (confirmed && ev.data?.id) {
            this.deleteProduct(ev.data.id);
          }
        });
        // case 'DELETE':
        //   this._confirm.confirm('delete').subscribe((res) => {
        //     console.log('delete', res);
        //     res && console.log("Nothing, it's just delete for test");
        //   });
        break;
        case 'EXPORT':
          this.exportProducts();
        break;
      case 'NAVIGATE':
        this._router.navigate(['products/product-details', ev.data?.id]);
        break;
      default:
        break;
    }
  }
  onFilter(e: any) {
    console.log(e);
    this.getProducts({
      pageSize: this.rows,
      pageNumber: this.currentPage,
      ClassificationId: e.ClassificationId,
      BrandId: e.BrandId,
      CategoryId: e.CategoryId,
    });
  }

  onSearch() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length >= 0),
      debounceTime(400),
      switchMap(term => this.productService.getProducts({
        pageSize: this.rows,
        pageNumber: this.currentPage,
        Keyword: term.trim()
      }))
    ).subscribe((response) => {
      if (response && response.data) {
        this.tableConfig = {
          ...ProductTableConfig,
          rows: response.data.result,
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
        this.totalRecords = response.data.rowCount;
      }
    });
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
