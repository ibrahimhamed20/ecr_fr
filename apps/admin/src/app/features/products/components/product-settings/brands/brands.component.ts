import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService, TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { BrandsFormComponent } from './brans-form/brands-form.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginatorState } from 'primeng/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrandTableConfig } from './brands.config';
import { BrandService } from './services/brands.service';
import {
  BrandData,
  BrandParam,
  BrandResponse,
  Classification,
} from '@admin-features/products/interfaces/brand.interface';
import { DropdownEvent } from '@admin-features/products/interfaces/products.interface';

@Component({
  selector: 'admin-brands',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    BrandsFormComponent,
    DialogModule,
    TranslateModule,
  ],
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public tableConfig$!: Observable<TableConfig>;
  private filters: any = { number: 1, size: 10 };
  searchControl: FormControl = new FormControl();
  classifications: Classification[] = [];
  currentPage: number = 1;
  totalRecords: number = 0;
  first: number = 0;
  pageSize: number = 10;
  rows: number = 10;
  selectedClassification: Classification | null = null;

  constructor(
    private _brands: BrandService,
    private _confirm: ConfirmDialogService,
    private _translate: TranslateService,
    private _popup: PopupService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllBrand(this.filters);
    this.getClassifications();
  }

  getAllBrand(params: BrandParam): void {
    this._brands
      .getBrands(params)
      .pipe(
        map((res: BrandResponse) => ({
          ...BrandTableConfig,
          rows:
            res.data?.result.map((brand) => ({
              ...brand,
              classifications: (brand.classifications || []).map(
                (classification) => classification.name
              ),
            })) || [],
          totalRecords: res.data?.rowCount,
        }))
      )
      .subscribe({
        next: (tableConfig) => {
          this.tableConfig$ = of(tableConfig);
        },
      });
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this.createBrand();
        break;
      case 'EDIT':
        this.editBrand(ev.data);
        break;
      case 'DELETE':
        this.deleteBrand(ev.data);
        break;
    }
  }

  createBrand() {
    this._popup
      .open(BrandsFormComponent, {
        title: this._translate.instant('BRANDS.ADD_NEW_BRAND'),
        position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      })
      .afterClosed.subscribe(
        (refresh) => refresh && this.getAllBrand(this.filters)
      );
  }

  editBrand(classification: BrandData) {
    this._popup
      .open(BrandsFormComponent, {
        title: this._translate.instant('BRANDS.EDIT_BRAND'),
        position: this._translate.currentLang === 'ar' ? 'left' : 'right',
        data: classification,
      })
      .afterClosed.subscribe(
        (refresh) => refresh && this.getAllBrand(this.filters)
      );
  }

  deleteBrand(brand: any) {
    if (brand.id)
      this._confirm.confirm('delete').subscribe((confirmed) => {
        confirmed &&
          this._brands
            .deleteBrand(brand.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this._toast.success(
                this._translate.instant('BRANDS.DELETE_BRAND_SUCCESS')
              );
              this.getAllBrand(this.filters);
            });
      });
  }
  getClassifications(): void {
    this._brands
      .getClassifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.classifications = res.data.classifications;
      });
  }
  onClassificationChange(event: DropdownEvent): void {
    this.selectedClassification = event.value as Classification;
    this.filterWithClassifications();
  }

  filterWithClassifications(): void {
    if (this.selectedClassification) {
      this._brands
        .getBrands({ size: this.rows, number: this.currentPage })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: BrandResponse) => {
            const filteredBrands = res.data.result.filter((brand: any) =>
              brand['classifications'].some(
                (classification: { id: number; name: string }) =>
                  classification.id === this.selectedClassification?.id
              )
            );
            this.tableConfig$ = of({
              ...BrandTableConfig,
              rows:
                filteredBrands.map((el) => ({
                  ...el,
                  classifications: (el.classifications || [])
                    .map((c) => c.name)
                    .join(', '),
                })) || [],
              totalRecords: filteredBrands.length,
            });
          },
        });
    } else {
      this.getAllBrand({ size: this.rows, number: this.currentPage });
    }
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    this.currentPage = event.page || 1;

    console.log('PageSize:', this.rows, 'PageNumber:', this.currentPage);

    this.getAllBrand({ size: this.rows, number: this.currentPage });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
