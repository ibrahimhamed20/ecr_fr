import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService, TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  ApiResponse,
  Classification,
  DropdownEvent,
  SubCategory,
  CategoriesData,
  Category,
} from '@admin-features/products/interfaces/products.interface';
import { PaginatorState } from 'primeng/paginator';
import { FormControl } from '@angular/forms';
import { AddEditCategoryComponent } from './components/add-edit-category/add-edit-category.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoryTableConfig } from './categories.config';
import { ProductsService } from '@admin-features/products/services/products.service';
import { AddEditSubcategoryComponent } from './components/add-edit-subcategory/add-edit-subcategory.component';

@Component({
  selector: 'admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    DropdownModule,
    DialogModule,
    AddEditCategoryComponent,
    TranslateModule,
  ],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  classifications: Classification[] = [];
  tableConfig!: TableConfig;
  displayDialog = false;
  selectedClassification: Classification | null = null;
  pageSize = 10;
  pageNumber = 1;
  totalRecords = 0;
  first = 0;
  keyword = '';
  searchControl: FormControl = new FormControl();

  constructor(
    private _confirm: ConfirmDialogService,
    private _product: ProductsService,
    private _popup: PopupService,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.tableConfig = CategoryTableConfig;
    this.getAllCategories();
    this.getClassifications();
    this.onSearch();
  }

  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.classifications = res?.data?.classifications;
      });
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE': this.openCreateDialog(); break;
      case 'EDIT': this.getCategoryById(ev.data); break;
      case 'DELETE': this.onActionDelete(ev.data); break;
    }
  }
  onActionDelete(data: { id: number }): void {
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        this._product
          .deleteCategory(data.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((response) => {
            if (response.data) {
              this.getAllCategories();
            }
          });
      }
    });
  }
  onClassificationChange(event: DropdownEvent) {
    this.selectedClassification = event.value as Classification;
    this.filterCategories();
  }
  getAllCategories(): void {
    this._product
      .getAllCategories(this.pageSize, this.pageNumber, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<Category>) => {
        this.tableConfig = {
          ...CategoryTableConfig,
          rows:
            response.data.result.map((el) => ({
              ...el,
              classification: el?.classification
                .map((item: Classification) => item.name)
                .join(', '),
              subCategories: el?.subCategories
                .map((item: SubCategory) => item.name)
                .join(', '),
            })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
      });
  }

  filterCategories(): void {
    if (this.selectedClassification) {
      this._product
        .getAllCategories(this.pageSize, this.pageNumber, this.keyword)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          const filteredCategories = res.data.result.filter((category) => {
            // Check if category.classification is an array and contains the selected classification
            return Array.isArray(category.classification)
              ? category.classification.some(
                  (cls: { id: number }) =>
                    cls.id === this.selectedClassification?.id
                )
              : category.classification?.id === this.selectedClassification?.id;
          });

          // Map the filtered results to update the classification names
          this.tableConfig.rows = filteredCategories.map((el) => ({
            ...el,
            // Join classification names if it is an array, or just use the single name
            classification: Array.isArray(el.classification)
              ? el.classification
                  .map((cls: { name: string }) => cls.name)
                  .join(', ')
              : el.classification?.name,
            subCategories: el.subCategories
              .map((item: { name: string }) => item.name)
              .join(', '),
          }));
        });
    } else {
      this.getAllCategories();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.pageSize = event.rows || 10;
    this.pageNumber = event.page || 1;
    this.getAllCategories();
  }

  onDialogClose(): void {
    this.displayDialog = false;
  }
  onSearch() {
    this.searchControl.valueChanges
      .pipe(
        filter((k: string) => k.trim().length >= 0),
        debounceTime(400),
        switchMap((word) =>
          this._product.getAllCategories(
            this.pageSize,
            this.pageNumber,
            word.trim()
          )
        )
      )
      .subscribe((response: ApiResponse<Category>) => {
        if (response && response.data) {
          this.tableConfig = {
            ...CategoryTableConfig,
            rows:
              response.data.result.map((el) => ({
                ...el,
                classification: el.classification
                  .map((item: { name: string }) => item.name)
                  .join(', '),
                subCategories: el.subCategories
                  .map((item: { name: string }) => item.name)
                  .join(', '),
              })) || [],
            totalRecords: response.data.rowCount,
            rowsActions: ['EDIT', 'DELETE'],
          };
        }
      });
  }
  openCreateDialog(): void {
    this._popup.open(AddEditCategoryComponent, {
      title: this._translate.instant('CATEGORY.ADD_NEW_CATEGORY'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      data:{
        classifications:this.classifications
      },
    }).afterClosed.subscribe((refresh) => refresh && this.getAllCategories());
  }
  id!:number;
  getCategoryById(data: CategoriesData) {
    this.id = data.id;
      this._product.getCategoryById(Number(data.id)).subscribe((res:any) => {
        if (res.data) {
          this._popup.open(AddEditCategoryComponent, {
            title: this._translate.instant('CATEGORY.EDIT_NEW_CATEGORY'),
            position: this._translate.currentLang === 'ar' ? 'left' : 'right',
            data: {
              response:res.data,
              classifications:this.classifications
            }
          }).afterClosed.subscribe((response) => {
            if(response?.action == "EDIT_SUB_CATEGORY") {
              this.openSubCategoryDialog(response?.data?.data)
            } else if(response?.action == "ADD_SUB_CATEGORY"){
              this.openSubCategoryDialog()
            } 
            this.getAllCategories();

          });
        }
      });
  }

  openSubCategoryDialog(item?:any) {
        this._popup.open(AddEditSubcategoryComponent, {
          title: this._translate.instant('CATEGORY.EDIT_NEW_CATEGORY'),
          position: this._translate.currentLang === 'ar' ? 'left' : 'right',
          data: {
            response:item,
            id:this.id,
            categories:this.tableConfig.rows,
            classifications:this.classifications
          }
        }).afterClosed.subscribe((response) => {
          if(response) {
            this.getAllCategories();
          }
        });
 
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
