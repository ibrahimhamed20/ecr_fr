import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { VariantsTableConfig } from '@admin-features/products/products.config';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {
  Classification,
  ClassificationsResponse,
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

  filters: any = { number: 1, size: 10 };
  selectedVariant: variantsData | null = null; // Use the defined interfaces
  tableConfig!: TableConfig;
  displayDialog = false;
  displayVariantValueDialog = false;
  constructor(
    private _confirm: ConfirmDialogService,
    private _product: ProductsService,
    private _toastr: ToastrService,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getClassifications();
    this.getAllVariants(this.filters);
    this.onSearchData();
    this.setBreadcrumb();
  }
  setBreadcrumb(): void {
    this.breadcrumb = [
      { icon: 'pi pi-home', route: '/' },
      { label: this._translate.instant('VARIANTS.PRODUCT_MANAGEMENT') },
      { label: this._translate.instant('VARIANTS.NAME'), route: '/variants' },
    ];
  }

  onSearchData() {
    this.searchControl.valueChanges
      .pipe(
        filter((k: string) => k.trim()?.length > 0),
        debounceTime(400),
        switchMap((term) => this._product.searchVariants(term))
      )
      .subscribe(
        (res) =>
          (this.tableConfig.rows =
            res.data.result.map((el: any) => ({
              ...el,
              classification: el.classificationIds
                .map((v: any) => v.name)
                .join(', '),
              variantsValueProp: el.variantValues
                .map((v: any) => v.name)
                .join(', '),
            })) || [])
      );
  }
  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: ClassificationsResponse) => {
        this.classifications = res.data.classifications;
      });
  }
  filterVariants(params: variantParam): void {
    if (this.selectedClassification) {
      this._product
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
    this.filters = { size: event.rows || 10, number: event.page || 1 };
    this.getAllVariants(this.filters);
  }
  getAllVariants(params: any): void {
    this._product
      .getAllVariants(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: variantsResponse) => {
        this.tableConfig = {...VariantsTableConfig,   rows: res.data.result,   totalRecords: res.data.rowCount};
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
        this.selectedVariant = null; // Clear the selectedUnit for creation
        this.openCreateDialog('ADD_FULL');
        break;
      case 'ADD_VARIANT_VALUE':
        this.selectedVariant = ev.data; // Clear the selectedUnit for creation
        this.openCreateDialog('ADD_VARIANT_VALUE');
        break;
      case 'DELETE':
        this.ondeleteVariant(ev.data);
        break;
      case 'EDIT':
        this.getVariantById(+ev.data.id);
        break;
      default:
        break;
    }
  }

  getVariantById(id: number) {
    this._product
      .getVariantById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: Data<variantsData>) => {
        this.selectedVariant = res.data || [];
        this.openCreateDialog('ADD_FULL');
      });
  }
  openCreateDialog(type: 'ADD_FULL' | 'ADD_VARIANT_VALUE'): void {
    if (type === 'ADD_FULL') this.displayDialog = true;
    else if (type === 'ADD_VARIANT_VALUE')
      this.displayVariantValueDialog = true;
  }
  onDialogClose(type: 'ADD_FULL' | 'ADD_VARIANT_VALUE'): void {
    if (type === 'ADD_FULL') this.displayDialog = false;
    else if (type === 'ADD_VARIANT_VALUE')
      this.displayVariantValueDialog = false;
  }

  onClassificationChange(event: DropdownEvent) {
    this.selectedClassification = event.value as Classification;
    this.filterVariants(this.filters);
  }
  handleSave(data: any): void {
    if (data.classificationIds) {
      data.classificationIds = data.classificationIds.map((item: any) =>
        item.id ? item.id : item
      );
    }
    if (!this.selectedVariant) {
      this._product
        .addVariant(data)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.getAllVariants(this.filters);
          this.displayDialog = false;
          const currentLang = this._translate.currentLang; // Get the current language
          const nameToUse = currentLang === 'ar' ? 'متغير' : 'Variant';
          this._translate
            .get('GENERAL.ADDED_SUCCESSFULLY', { nameToUse })
            .subscribe((translatedMessage: string) => {
              this._toastr.success(translatedMessage);
            });
        });
    } else {
      this._product
        .editVariant({ ...data, id: this.selectedVariant.id })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response) => {
          if (response.data) {
            const currentLang = this._translate.currentLang; // Get the current language
            const nameToUse =
              currentLang === 'ar'
                ? this.selectedVariant?.arabicName
                : this.selectedVariant?.englishName;
            this._translate
              .get('GENERAL.UPDATED_SUCCESSFULLY', { name: nameToUse })
              .subscribe((translatedMessage: string) => {
                this._toastr.success(translatedMessage);
              });
            this.getAllVariants(this.filters);
            this.displayDialog = false;
          }
        });
    }
  }

  ondeleteVariant(data: variantsData) {
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        if (data.id)
          this._product
            .deleteVariant(data.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response:variantsResponse) => {
              if (response.data) {
                // Successful deletion, fetch the updated list of variants
                this.getAllVariants(this.filters);
              }
            });
      }
    });
  }

  handleVariantValueSave(data: any) {
    this._product
      .addVariantValue(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.getAllVariants(this.filters);
        this.displayVariantValueDialog = false;
        this._translate
          .get('GENERAL.ADDED_SUCCESSFULLY')
          .subscribe((translatedMessage: string) => {
            this._toastr.success(translatedMessage);
          });
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
