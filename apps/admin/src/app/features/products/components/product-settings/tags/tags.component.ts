import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorState } from 'primeng/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { PopupService, TableComponent, TableConfig } from '@shared-ui';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';

import { DropdownEvent } from '@admin-features/products/interfaces/products.interface';
import { TagsService } from './services/tags.service';
import { TagsFormComponent } from './tags-form/tags-form.component';
import { TagsTableConfig } from './tags.config';
import { Classification, TagsData, TagsParam, TagsResponse } from '@admin-features/products/interfaces';

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
    TranslateModule
  ],
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public tableConfig$!: Observable<TableConfig>;
  public searchControl: FormControl = new FormControl();
  public classifications: Classification[] = [];
  public currentPage: number = 1;
  public totalRecords: number = 0;
  public first: number = 0;
  public pageSize: number = 10;
  public rows: number = 10;
  public selectedClassification: Classification | null = null;

  private filters: any = { number: 1, size: 10 };

  constructor(
    private tagService: TagsService,
    private confirmService: ConfirmDialogService,
    private translateService: TranslateService,
    private popupService: PopupService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTags(this.filters);
    this.getClassifications();
  }

  getTags(params: TagsParam): void {
    this.tagService.getAllTags(params).pipe(
      map((res: TagsResponse) => ({
        ...TagsTableConfig,
        rows: res.data.result.map((tag: TagsData) => ({
          ...tag,
          classifications: (tag.classifications || [])
            .map(c => c.name)
            .join(', ')
        })) || [],
        totalRecords: res.data.rowCount
      }))
    ).subscribe({
      next: tableConfig => this.tableConfig$ = of(tableConfig)
    });
  }



  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
        this.createTags();
        break;
      case 'EDIT':
        this.editTags(ev.data);
        break;
      case 'DELETE':
        this.deleteTags(ev.data);
        break;
    }
  }

  createTags() {
    this.popupService.open(TagsFormComponent, {
      title: this.translateService.instant('TAGS.ADD_NEW_TAG'),
      position: this.translateService.currentLang === 'ar' ? 'left' : 'right'
    }).afterClosed.subscribe(refresh => {
      if (refresh) this.getTags(this.filters);
    });
  }

  editTags(tag: TagsData) {
    this.popupService.open(TagsFormComponent, {
      title: this.translateService.instant('Tags.EDIT_TAG'),
      position: this.translateService.currentLang === 'ar' ? 'left' : 'right',
      data: tag
    }).afterClosed.subscribe(refresh => {
      if (refresh) this.getTags(this.filters);
    });
  }

  deleteTags(data: { tagId: number }): void {
    if (data.tagId) {
      this.confirmService.confirm('delete').subscribe(res => {
        if (res) {
          this.tagService.deleteTags(data.tagId).pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response.data) {
                this.toastrService.success('Tag deleted successfully');
                this.getTags({ size: this.rows, number: this.currentPage });
              }
            });
        }
      });
    }
  }

  getClassifications(): void {
    this.tagService.getClassifications().pipe(takeUntil(this.destroy$))
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
      this.tagService.getAllTags({ size: this.rows, number: this.currentPage })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          const filteredTags = res.data.result.filter((tag: TagsData) =>
            tag.classifications?.some((classification: Classification) =>
              classification.id === this.selectedClassification?.id
            ) ?? false
          );

          this.tableConfig$ = of({
            ...TagsTableConfig,
            rows: filteredTags.map((tag: TagsData) => ({
              ...tag,
              classifications: (tag.classifications || [])
                .map((c: Classification) => c.name)
                .join(', ')
            })) || [],
            totalRecords: filteredTags.length
          });
        });
    } else {
      this.getTags({ size: this.rows, number: this.currentPage });
    }
  }



  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    this.currentPage = event.page || 1;
    this.getTags({ size: this.rows, number: this.currentPage });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
