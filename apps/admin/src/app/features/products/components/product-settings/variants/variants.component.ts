import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BreadcrumbComponent,
  PopupService,
  TableComponent,
  TableConfig,
} from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import {
  debounceTime,
  filter,
  Subject,
  switchMap,
  takeUntil,
  Observable,
} from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {
  Classification,
  Data,
  DropdownEvent,
} from '@admin-features/products/interfaces/products.interface';
import { ProductsService } from '@admin-features/products/services/products.service';
import { MenuItem } from 'primeng/api';
import {
  variantParam,
  variants,
  variantsData,
  variantsResponse,
} from '@admin-features/products/interfaces/variants.interface';
import { ButtonModule } from 'primeng/button';
import { AddEditVariantsComponent } from './components/add-edit-variants/add-edit-variants.component';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddVariantsValueComponent } from './components/add-variants-value/add-variants-value.component';
import { VariantsTableConfig } from './variants.config';
import { VariantsService } from '@admin-features/products/components/product-settings/variants/services/variants.service';

@Component({
  selector: 'admin-variants',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonModule,
    AddEditVariantsComponent,
    DropdownModule,
    DialogModule,
    TranslateModule,
    BreadcrumbComponent,
    AddVariantsValueComponent,
  ],
  templateUrl: './variants.component.html',
})
export class VariantsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  classifications: Classification[] = [];

  selectedClassification: Classification | null = null;
  searchControl: FormControl = new FormControl();
  breadcrumb!: MenuItem[];

  filters: variantParam = { number: 1, size: 10, keyword: '' };
  selectedVariant: variantsData | null = null; // Use the defined interfaces
  tableConfig!: TableConfig;
  displayDialog = false;
  displayVariantValueDialog = false;
  constructor(
    private _confirm: ConfirmDialogService,
    private _product: ProductsService,
    private _variants: VariantsService,
    private _popup: PopupService,
    private _toastr: ToastrService,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getClassifications();
    this.getAllVariants(this.filters);
    this.onSearchData();
  }
  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.classifications = res.data.classifications;
      });
  }
  onSearchData() {
    this.searchControl.valueChanges
      .pipe(
        filter((k: string) => k.trim().length > 0),
        debounceTime(400),
        switchMap((term) => {
          this.filters.keyword = term;
          return this._variants.getAllVariants(this.filters);
        })
      )
      .subscribe((res) => {
        this.tableConfig.rows =
          res.data.result.map((el: any) => ({
            ...el,
            classification: el.classificationIds
              .map((v: any) => v.name)
              .join(', '),
            variantsValueProp: el.variantValues
              .map((v: any) => v.name)
              .join(', '),
          })) || [];
      });
  }

  filterVariants(params: variantParam): void {
    if (this.selectedClassification) {
      this._variants
        .getAllVariants(params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: variantsResponse) => {
          const filteredvariants = res.data.result.filter((variant) =>
            variant.classificationIds.find(
              (value: any) => value.name == this.selectedClassification?.name
            )
          );

          this.tableConfig.rows = filteredvariants.map((el) => ({
            ...el,
            classification: el.classificationIds
              .map((v: any) => v.name)
              .join(', '),
            variantsValueProp: el.variantValues
              .map((v: any) => v.name)
              .join(', '),
          }));
        });
    } else {
      // If no classification is selected, reset the table to show all units
      this.getAllVariants(this.filters);
    }
  }
  onPageChange(event: PaginatorState): void {
    this.filters = {
      size: event.rows || 10,
      number: event.page || 1,
      keyword: '',
    };
    if (this.selectedClassification) {
      this.filterVariants(this.filters);
    } else {
      this.getAllVariants(this.filters);
    }
  }
  getAllVariants(params: any): void {
    this._variants
      .getAllVariants(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: variantsResponse) => {
        this.tableConfig = {
          ...VariantsTableConfig,
          rows: res.data.result,
          totalRecords: res.data.rowCount,
          rowsPerPage: this.filters.size,
        };
        this.tableConfig.rows =
          res.data.result.map((el: any) => ({
            ...el,
            classification: el.classificationIds
              .map((v: Classification) => v.name)
              .join(', '),
            variantsValueProp: el.variantValues
              .map((v: variants) => v.name)
              .join(', '),
          })) || [];
      });
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this.createVariants();
        break;
      case 'ADD_VARIANT_VALUE':
        this.createVariantsValue(ev.data);
        break;
      case 'DELETE':
        this.ondeleteVariant(ev.data);
        break;
      case 'EDIT':
        this.editVariants(ev.data);
        break;
      default:
        break;
    }
  }

  createVariants() {
    this._popup
      .open(AddEditVariantsComponent, {
        title: this._translate.instant('VARIANTS.ADD_NEW_VARIANT'),
        position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      })
      .afterClosed.subscribe(
        (refresh) => refresh && this.getAllVariants(this.filters)
      );
  }

  createVariantsValue(variantsData: variantsData) {
    this._popup
      .open(AddVariantsValueComponent, {
        title: this._translate.instant('VARIANTS.ADD_NEW_VARIANT'),
        position: this._translate.currentLang === 'ar' ? 'left' : 'right',
        data: variantsData,
      })
      .afterClosed.subscribe(
        (refresh) => refresh && this.getAllVariants(this.filters)
      );
  }

  editVariants(variantsData: variantsData) {
    this._popup
      .open(AddEditVariantsComponent, {
        title: this._translate.instant('VARIANTS.EDIT_VARIANT'),
        position: this._translate.currentLang === 'ar' ? 'left' : 'right',
        data: variantsData,
      })
      .afterClosed.subscribe(
        (refresh) => refresh && this.getAllVariants(this.filters)
      );
  }

  onClassificationChange(event: DropdownEvent) {
    this.selectedClassification = event.value as Classification;
    this.filterVariants(this.filters);
  }

  ondeleteVariant(data: variantsData) {
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        if (data.id)
          this._product
            .deleteVariant(data.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: variantsResponse) => {
              if (response.data) {
                // Successful deletion, fetch the updated list of variants
                this._toastr.success('Variant Deleted Successfully');
                this.getAllVariants(this.filters);
              }
            });
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
