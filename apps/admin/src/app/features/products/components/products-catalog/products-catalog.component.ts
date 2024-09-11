import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AddEditUnitsComponent } from '../product-settings/units/components/add-edit-units/add-edit-units.component';
import { Classification } from '@admin-features/products/interfaces/products.interface';
import { CatalogTableConfig } from '@admin-features/products/components/product/product.config';
import { ProductsService } from '@admin-features/products/services/products.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Subject, takeUntil, filter, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'admin-products-catalog',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TableComponent,
    DropdownModule,
    AddEditUnitsComponent,
    DialogModule
  ],
  templateUrl: './products-catalog.component.html'
})
export class ProductsCatalogComponent implements OnInit, OnDestroy {
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Products' },
    { label: 'Products Catalog', route: '/products/products-catalog' }
  ];
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  tableConfig!: TableConfig;
  selectedClassification: Classification | null = null;
  pageSize = 10;
  pageNumber = 1;
  totalRecords = 0;
  first = 0;
  keyword= "";
  searchControl: FormControl = new FormControl();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _product: ProductsService
  ) {}

  ngOnInit(): void {
    this.getAllProductCatalog();
    this.onSearch();
    this.tableConfig = CatalogTableConfig;
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this._router.navigate(['0'], { relativeTo: this._route });
        break;
      default:
        break;
    }
  }

  getAllProductCatalog(): void {
    this._product
      .getAllProductCatalog(this.pageSize, this.pageNumber, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response:any) => {
        this.tableConfig = {
          ...CatalogTableConfig,
          rows: response.data.map((el:any) => ({
            ...el,
            paidProduct:  el.numberOfPrdoucts + ' Product ' + ' '  + el.price + ' EGP'
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT'],
        };
      });
  }


  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.pageSize = event.rows || 10;
    this.pageNumber = event.page || 1;
    this.getAllProductCatalog();
  }

  handleSave(data: any): void {
  }
  onSearch() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length >= 0),
      debounceTime(400),
      switchMap(word => this._product.getAllProductCatalog(
        this.pageSize,
        this.pageNumber,
        word.trim()
      ))
    ).subscribe((response:any) => {
      if (response && response.data) {
        this.tableConfig = {
          ...CatalogTableConfig,
          rows: response.data.map((el:any) => ({
            ...el,
            paidProduct: el.numberOfPrdoucts + ' Product ' + ' '  + el.price + ' EGP'
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT'],
        };
      }
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

