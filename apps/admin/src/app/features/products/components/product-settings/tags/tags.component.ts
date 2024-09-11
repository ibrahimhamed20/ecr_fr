import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { TagsTableConfig } from '@admin-features/products/components/product/product.config';
import { TagsFormComponent } from './component/tags-form/tags-form.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '@admin-features/products/services/products.service';
import {
  ApiResponse,
  Classification,
  DropdownEvent,
  ProductParams,
  TagData,
  TagsResponse,
} from '@admin-features/products/interfaces/products.interface';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'admin-tags',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagsFormComponent,
    DialogModule,
  ],
  templateUrl: './tags.component.html',
})
export class TagsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  items: MenuItem[] = [{ label: 'Stores' }, { label: 'Pending' }];
  activeItem!: MenuItem;
  displayDialog = false;
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Product Management' },
    { label: 'Tags', route: '/tags' },
  ];
  currentPage: number = 1;
  totalRecords: number = 0;
  first: number = 0;

  rows: number = 10;
  tableConfig!: TableConfig;
  classifications: Classification[] = [];
  selectedClassification: Classification | null = null;
  searchControl: FormControl = new FormControl();

  constructor(
    private _toastr: ToastrService,
    private _confirm: ConfirmDialogService,
    private _product: ProductsService
  ) {}

  ngOnInit(): void {
    this.tableConfig = TagsTableConfig;
    this.getClassifications();
    this.getTags({ pageSize: this.rows, pageNumber: this.currentPage });
    this.onSearch();
  }

  // getClassifications(): void {
  //   this._product
  //     .getClassificationsForTag()
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((res: ClassificationsResponse) => {
  //       this.classifications = res.data.classifications;
  //     });
  // }

  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: Classification[]) => {
        this.classifications = res;
      });
  }

  getTags(page: ProductParams): void {
    this._product
      .getAllTags(page)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: TagsResponse) => {
        this.tableConfig.actions = ['CREATE'];
        this.tableConfig.rows =
          res.data.result.map((el) => ({
            ...el,
            classifications: Array.isArray(el['classifications'])
              ? el['classifications'].map((c: any) => c.name).join(', ')
              : '',
          })) || [];
        this.tableConfig.totalRecords = res.data.rowCount;
      });
  }

  openCreateDialog(): void {
    this.displayDialog = true;
  }
  onDialogClose(): void {
    this.displayDialog = false;
  }

  handleSave(data: any): void {
    if (!this.selectedTags) {
      this._product
        .addTags(data)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.getTags({ pageSize: this.rows, pageNumber: this.currentPage });
          this.displayDialog = false;
          this._toastr.success('Unit Added successfully');
        });
    } else {
      this._product
        .editTags({ ...data, id: this.selectedTags.id })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response) => {
          if (response.data) {
            this._toastr.success('Unit Updated successfully');
            this.getTags({ pageSize: this.rows, pageNumber: this.currentPage });
            this.displayDialog = false;
          }
        });
    }
  }

  selectedTags: any; //Ask  ibrahim
  // selectedTags: TagData | null = null; // Use the defined interface

  getTagsById(data: { tagId: number }) {
    const id = typeof data.tagId === 'string' ? Number(data.tagId) : data.tagId;
    if (id && !isNaN(id)) {
      this._product.getTagsById(id).subscribe((res: ApiResponse<TagData>) => {
        console.log('Response:', res.data);
        if (res.data) {
          this.displayDialog = true;
          this.selectedTags = res.data;
          this.selectedTags.classificationIds = this.selectedTags[
            'classificationIds'
          ].map((obj: any) => obj.id);
          console.log('Selected Tags:', this.selectedTags);
        } else {
          console.error('No data received from API');
        }
      });
    }
  }

  filterTags(): void {
    if (this.selectedClassification) {
      this._product
        .getAllTags({ pageSize: this.rows, pageNumber: this.currentPage })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: TagsResponse) => {
          const filteredTags = res.data.result.filter((tag) =>
            tag['classifications'].some(
              (classification: Classification) =>
                classification.id === this.selectedClassification?.id
            )
          );
          this.tableConfig.rows =
            filteredTags.map((el) => ({
              ...el,
              classifications: Array.isArray(el['classifications'])
                ? el['classifications'].map((c) => c.name).join(', ')
                : '',
            })) || [];
        });
    } else {
      this.getTags({ pageSize: this.rows, pageNumber: this.currentPage });
    }
  }
  onClassificationChange(event: DropdownEvent): void {
    this.selectedClassification = event.value as Classification;
    this.filterTags();
  }

  onSearch() {
    this.searchControl.valueChanges
      .pipe(
        filter((k: string) => k.trim().length >= 0),
        debounceTime(400),
        switchMap((term) =>
          this._product.getAllTags({
            pageSize: this.rows,
            pageNumber: this.currentPage,
            Keyword: term.trim(),
          })
        )
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.tableConfig = {
            ...TagsTableConfig,
            rows: response.data.result,
            totalRecords: response.data.rowCount,
            rowsActions: ['EDIT', 'DELETE'],
          };
          this.totalRecords = response.data.rowCount;
        }
      });
  }
  onActionDelete(data: { tagId: number }): void {
    if (data.tagId) {
      this._confirm.confirm('delete').subscribe((res) => {
        if (res) {
          this._product
            .deleteTags(data.tagId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
              if (response.data) {
                this.getTags({
                  pageSize: this.rows,
                  pageNumber: this.currentPage,
                });
              }
            });
        }
      });
    }
  }
  onActionClicked(ev: { action: string; data?: any }): void {
    switch (ev.action) {
      case 'CREATE':
        this.selectedTags = null; // Clear the selectedTags for creation
        this.openCreateDialog();
        break;
      case 'EDIT':
        if (ev.data) {
          console.log('Data received for EDIT action:', ev.data); // Log data to check structure
          this.getTagsById(ev.data);
        } else {
          console.error('No data received for EDIT action');
        }
        break;
      case 'DELETE':
        if (ev.data && ev.data.tagId) {
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
    this.getTags({ pageSize: this.rows, pageNumber: this.currentPage });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
