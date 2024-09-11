import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { TagsTableConfig } from '@admin-features/products/components/product/product.config';
import { BrandsFormComponent } from './brans-form/brands-form.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  Classification,
  ApiResponse,
  DropdownEvent,
  BransResponse,
  PaginationParams,
  BrandData,
  ClassificationsResponse,
} from '@admin-features/products/interfaces/products.interface';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrandTableConfig } from './brands.config';
import { BrandService } from './services/brands.service';

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
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  displayDialog = false;
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Product Management' },
    { label: 'Tags', route: '/tags' },
  ];
  currentPage: number = 1;
  totalRecords: number = 0;
  first: number = 0;
  pageSize: number = 10;
  rows: number = 10;
  tableConfig!: TableConfig;
  classifications: Classification[] = [];
  selectedClassification: Classification | null = null;
  searchControl: FormControl = new FormControl();
  selectedBrands: any;

  constructor(
    private _toastr: ToastrService,
    private _confirm: ConfirmDialogService,
    private _brands: BrandService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.tableConfig = BrandTableConfig;
    this.getClassifications();
    this.getBrands({ pageSize: this.rows, pageNumber: this.currentPage });
    this.onSearch();
  }

  private getClassifications(): void {
    this._brands
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: ClassificationsResponse) => {
          this.classifications = res.data.classifications;
        },
      });
  }

  private getBrands(params: PaginationParams): void {
    this._brands
      .getBrands(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: BransResponse) => {
          this.tableConfig.actions = ['CREATE'];
          this.tableConfig.rows =
            res.data.result.map((el) => ({
              ...el,
              classifications: Array.isArray(el['classifications'])
                ? el['classifications']
                    .map((c: Classification) => c.name)
                    .join(', ')
                : '',
            })) || [];
          this.tableConfig.totalRecords = res.data.rowCount;
        },
      });
  }

  openCreateDialog(): void {
    this.selectedBrands = null;
    this.displayDialog = true;
  }

  onDialogClose(): void {
    this.displayDialog = false;
  }

  handleSave(data: any): void {
    const save$ = this.selectedBrands
      ? this._brands.editBrand({ ...data, id: this.selectedBrands.id })
      : this._brands.addBrand(data);

    save$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: () => {
        this.getBrands({ pageSize: this.rows, pageNumber: this.currentPage });
        this.displayDialog = false;
        this._toastr.success(
          this.selectedBrands
            ? 'Brand Updated successfully'
            : 'Brand Added successfully'
        );
      },
    });
  }

  getBrandsById(id: number): void {
    this._brands
      .getBrandById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: ApiResponse<BrandData>) => {
          if (res.data) {
            this.displayDialog = true;
            this.selectedBrands = res.data;
            this.selectedBrands.classificationIds = (
              this.selectedBrands.classificationModels || []
            ).map((model: Classification) => model.id || 0);
          }
        },
      });
  }

  filterBrands(): void {
    if (this.selectedClassification) {
      this._brands
        .getBrands({ pageSize: this.rows, pageNumber: this.currentPage })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res: BransResponse) => {
            const filteredBrands = res.data.result.filter((brand) =>
              brand['classifications'].some(
                (classification: Classification) =>
                  classification.id === this.selectedClassification?.id
              )
            );
            this.tableConfig.rows =
              filteredBrands.map((el) => ({
                ...el,
                classifications: Array.isArray(el['classifications'])
                  ? el['classifications'].map((c) => c.name).join(', ')
                  : '',
              })) || [];
          },
        });
    } else {
      this.getBrands({ pageSize: this.rows, pageNumber: this.currentPage });
    }
  }

  onClassificationChange(event: DropdownEvent): void {
    this.selectedClassification = event.value as Classification;
    this.filterBrands();
  }

  private onSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((term) => term.trim().length > 0),
        debounceTime(400),
        switchMap((term) =>
          this._brands.getBrands({
            pageSize: this.rows,
            pageNumber: this.currentPage,
            Keyword: term.trim(),
          })
        )
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.tableConfig = {
              ...TagsTableConfig,
              rows: response.data.result,
              totalRecords: response.data.rowCount,
              rowsActions: ['EDIT', 'DELETE'],
            };
            this.totalRecords = response.data.rowCount || 0;
          }
        },
      });
  }

  onActionDelete(data: { id: number }): void {
    if (data.id) {
      this._confirm.confirm('delete').subscribe((res) => {
        if (res) {
          this._brands
            .deleteBrand(data.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: () => {
                const successMessage = this.translate.instant(
                  'GENERAL.BRAND_DELETED_SUCCESS'
                );
                this._toastr.success(successMessage);
                this.getBrands({
                  pageSize: this.rows,
                  pageNumber: this.currentPage,
                });
              },
              error: () => {
                const errorMessage = this.translate.instant(
                  'GENERAL.BRAND_DELETE_FAILED'
                );
                this._toastr.show(errorMessage);
              },
            });
        }
      });
    }
  }

  onActionClicked(ev: { action: string; data?: any }): void {
    switch (ev.action) {
      case 'CREATE':
        this.openCreateDialog();
        break;
      case 'EDIT':
        if (ev.data) {
          this.getBrandsById(ev.data.id);
        }
        break;
      case 'DELETE':
        if (ev.data && ev.data.id) {
          this.onActionDelete(ev.data);
        }
        break;
      default:
        break;
    }
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    this.currentPage = event.page || 1;
    this.getBrands({ pageSize: this.rows, pageNumber: this.currentPage });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
