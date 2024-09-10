import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ApiResponse, Classification, ClassificationsResponse, DropdownEvent, SubCategory, CategoriesData, Category } from '@admin-features/products/interfaces/products.interface';
import { PaginatorState } from 'primeng/paginator';
import { FormControl } from '@angular/forms';
import { AddEditCategoryComponent } from './components/add-edit-category/add-edit-category.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoryService } from './services/category.service';
import { CategoryTableConfig } from './categories.config';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    DropdownModule,
    DialogModule,
    BreadcrumbComponent,
    AddEditCategoryComponent,
    TranslateModule
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
  keyword= "";
  searchControl: FormControl = new FormControl();
  breadcrumb!: MenuItem[];

  constructor(
    private _confirm: ConfirmDialogService,
    private _category: CategoryService,
    private _toastr: ToastrService,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getClassifications();
    this.getAllCategories();
    this.setBreadcrumb();
    this.onSearch();
    this.tableConfig = CategoryTableConfig;
  }
  setBreadcrumb(): void {
    this.breadcrumb = [
      { icon: 'pi pi-home', route: '/' },
      { label: this._translate.instant('CATEGORY.PRODUCT_MANAGEMENT') },
      { label: this._translate.instant('CATEGORY.NAME'), route: '/categories' },
    ];
  }
  getClassifications(): void {
    this._category
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: ClassificationsResponse) => {
        this.classifications = res.data.classifications;
      });
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this.selectedData = null;
        this.openCreateDialog();
        break;
        case 'EDIT':
          this.getCategoryById(ev.data);
        break;
      case 'DELETE':
        this.onActionDelete(ev.data);
        break;
      default:
        break;
    }
  }
  onActionDelete(data: {id:number}): void {
    console.log('data',data)
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        this._category
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
    this._category
      .getAllCategories(this.pageSize, this.pageNumber, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<Category>) => {
        this.tableConfig = {
          ...CategoryTableConfig,
          rows: response.data.result.map((el) => ({
            ...el,
            classification: el?.classification.map((item: Classification) => item.name).join(', '),
            subCategories: el?.subCategories.map((item: SubCategory) => item.name).join(', '),
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
      });
  }

  filterCategories(): void {
    if (this.selectedClassification) {
      this._category
        .getAllCategories(this.pageSize, this.pageNumber, this.keyword)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          const filteredCategories = res.data.result.filter((category) => {
            // Check if category.classification is an array and contains the selected classification
            return Array.isArray(category.classification)
              ? category.classification.some((cls:{id:number}) => cls.id === this.selectedClassification?.id)
              : category.classification?.id === this.selectedClassification?.id;
          });

          // Map the filtered results to update the classification names
          this.tableConfig.rows = filteredCategories.map((el) => ({
            ...el,
            // Join classification names if it is an array, or just use the single name
            classification: Array.isArray(el.classification)
              ? el.classification.map((cls:{name:string}) => cls.name).join(', ')
              : el.classification?.name,
            subCategories: el.subCategories.map((item:{name:string}) => item.name).join(', '),

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
  openCreateDialog(): void {
    this.displayDialog = true;
  }
  onDialogClose(): void {
    this.displayDialog = false;
  }
  onSearch() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length >= 0),
      debounceTime(400),
      switchMap(word => this._category.getAllCategories(
        this.pageSize,
        this.pageNumber,
        word.trim()
      ))
    ).subscribe((response: ApiResponse<Category>) => {
      if (response && response.data) {
        this.tableConfig = {
          ...CategoryTableConfig,
          rows: response.data.result.map((el) => ({
            ...el,
            classification: el.classification.map((item:{name:string}) => item.name).join(', '),
            subCategories: el.subCategories.map((item:{name:string}) => item.name).join(', '),
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
      }
    });
  }

  selectedData: CategoriesData | null = null; // Use the defined interface
  getCategoryById(data: CategoriesData) {
    const id = typeof data.id === 'string' ? Number(data.id) : data.id;
    if (id) {
      this._category.getCategoryById(id).subscribe((res) => {
        if (res.data) {
          this.displayDialog = true;
          this.selectedData = res.data;
        }
      });
    }
  }
  handleSave(data: CategoriesData): void {
    if (!this.selectedData) {
      this._category
        .addCategory(data)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.getAllCategories();
          this.displayDialog = false;
          this._toastr.success(this._translate.instant('GENERAL.ADDED_SUCCESSFULLY', { name: 'CATEGORY.NAME' }));

        });
    } else {
      this._category
        .editCategory({ ...data, id: this.selectedData.id })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response) => {
          if (response.data) {
            this._toastr.success(this._translate.instant('GENERAL.UPDATED_SUCCESSFULLY', { name: 'CATEGORY.NAME' }));
            this.getAllCategories();
            this.displayDialog = false;
          }
        });
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
