import { ConfirmDialogService, PopupService, TableConfig } from '@shared-ui';
import { debounceTime, filter, Subject, switchMap, takeUntil, Observable, map, of } from 'rxjs';
import { SHARED_MODULES, VariantsTableConfig } from './variants.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PaginatorState } from 'primeng/paginator';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AddEditVariantsComponent, AddVariantsValueComponent } from './components';
import { VariantsService, ProductsService } from '@admin-features/products/services';
import { Classification, ProductsPagingInteface, VariantParam, VariantsData, VariantsResponse } from '@admin-features/products/interfaces';


@Component({
  selector: 'admin-variants',
  standalone: true,
  imports: [...SHARED_MODULES, AddEditVariantsComponent, AddVariantsValueComponent],
  templateUrl: './variants.component.html',
})
export class VariantsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public classifications$!: Observable<Classification[]>;
  public tableConfig$!: Observable<TableConfig>;

  public searchControl: FormControl = new FormControl();

  public filters: VariantParam = { PageNumber: 1, PageSize: 10, name: '', classification: null };

  constructor(
    private _confirm: ConfirmDialogService,
    private _product: ProductsService,
    private _variants: VariantsService,
    private _popup: PopupService,
    private _toastr: ToastrService,
    private _translate: TranslateService) { }

  ngOnInit(): void {
    //console.log(this.tableConfig$)
    this.getClassifications();
    this.getAllVariants(this.filters);
    this.onSearchData();
  }

  private getClassifications(): void {
    this.classifications$ = this._product.getClassifications().pipe(map(res => res.data.classifications));
  }

  private onSearchData() {
     this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length > 0),
      debounceTime(400),
      switchMap((term) => this._variants.getAll(this.filters = { ...this.filters, name: term }))
    ).subscribe((response:any) => {
      this.tableConfig$ = of(
        this.mappedVariants(response)
      )}
    );
  }

  public onPageChange(event: PaginatorState): void {
    this.filters = {
      ...this.filters,
      PageSize: event.rows || 10,
      PageNumber: event.page || 1
    };
    this.getAllVariants(this.filters);
  }

  public getAllVariants(params: VariantParam): void {
    this.tableConfig$ = this._variants.getAll(params).pipe(map(res => this.mappedVariants(res)));
  }

  public onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this.createVariant();
        break;
      case 'ADD_VARIANT_VALUE':
        ev.data && this.createVariantValues(ev.data);
        break;
      case 'DELETE':
        ev.data && this.deleteVariant(ev.data);
        break;
      case 'EDIT':
        ev.data && this.editVariant(ev.data);
        break;
      default:
        break;
    }
  }

  private createVariant() {
    this._popup.open(AddEditVariantsComponent, {
      title: this._translate.instant('VARIANTS.ADD_NEW_VARIANT'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right',
    }).afterClosed.subscribe((refresh) => refresh && this.getAllVariants(this.filters));
  }

  private createVariantValues(variantsData: VariantsData) {
    this._popup.open(AddVariantsValueComponent, {
      title: this._translate.instant('VARIANTS.ADD_NEW_VARIANT'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      data: variantsData,
    }).afterClosed.subscribe((refresh) => refresh && this.getAllVariants(this.filters));
  }

  private editVariant(variantsData: VariantsData) {
    this._popup.open(AddEditVariantsComponent, {
      title: this._translate.instant('VARIANTS.EDIT_VARIANT'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      data: variantsData,
    }).afterClosed.subscribe((refresh) => refresh && this.getAllVariants(this.filters));
  }

  private deleteVariant(data: VariantsData) {
    this._confirm.confirm('delete').subscribe((confirmed) => {
      confirmed && this._variants.delete(data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: VariantsResponse) => {
          if (response.data) {
            this._toastr.success('Variant Deleted Successfully');
            this.getAllVariants(this.filters);
          }
        });
    });
  }

  private mappedVariants(res: { data: ProductsPagingInteface; }): any {
    console.log('API Response:', res);
    return {
      ...VariantsTableConfig,
      totalRecords: res.data.rowCount,
      rowsPerPage: this.filters.PageSize,
      rows: res.data.result.map((el: any) => ({
        ...el,
        classification: el.classificationIds.map((v: any) => v.name).join(', '),
        variantsValueProp: el.variantValues.map((v: any) => v.name).join(', '),
      })) || []
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
