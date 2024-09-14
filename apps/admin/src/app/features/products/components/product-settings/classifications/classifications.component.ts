import { map, Observable } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService, TableComponent, TableConfig } from '@shared-ui';
import { Subject, takeUntil } from 'rxjs';
import { ClassificationsData } from '@admin-features/products/interfaces/classifications.interface';
import { ClassificationsService } from '@admin-features/products/services/classifications.service';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassificationTableConfig } from './classifications.config';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { ClassificationFormComponent } from './classification-form/classification-form.component';

@Component({
  selector: 'admin-classifications',
  standalone: true,
  imports: [CommonModule, TableComponent, DialogModule, TranslateModule],
  templateUrl: './classifications.component.html',
})
export class ClassificationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public tableConfig$!: Observable<TableConfig>;
  private filters: any = { number: 1, size: 10 };

  constructor(
    private _classifications: ClassificationsService,
    private _confirm: ConfirmDialogService,
    private _translate: TranslateService,
    private _popup: PopupService,
    private _toast: ToastrService) { }

  ngOnInit(): void {
    this.getAllClassifications(this.filters);
  }

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE': this.createClassification(); break;
      case 'EDIT': this.editClassification(ev.data); break;
      case 'DELETE': this.deleteClassification(ev.data); break;
    }
  }

  private getAllClassifications(params: any): void {
    this.tableConfig$ = this._classifications.getAllClassifications(params)
      .pipe(map(res => ({
        ...ClassificationTableConfig,
        rows: res.data?.['classifications'],
        totalRecords: res.data.rowCount
      })));
  }

  private createClassification() {
    this._popup.open(ClassificationFormComponent, {
      title: this._translate.instant('CLASSIFICATIONS.ADD_NEW_CLASSIFICATION'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right'
    }).afterClosed.subscribe((refresh) => refresh && this.getAllClassifications(this.filters));
  }

  private editClassification(classification: ClassificationsData) {
    this._popup.open(ClassificationFormComponent, {
      title: this._translate.instant('CLASSIFICATIONS.EDIT_CLASSIFICATION'),
      position: this._translate.currentLang === 'ar' ? 'left' : 'right',
      data: classification
    }).afterClosed.subscribe((refresh) => refresh && this.getAllClassifications(this.filters));
  }

  private deleteClassification(classification: ClassificationsData) {
    if (classification.id)
      this._confirm.confirm('delete').subscribe((confirmed) => {
        confirmed && this._classifications
          .deleteClassification(classification.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this._toast.success(this._translate.instant('CLASSIFICATIONS.DELETE_CLASSIFICATION_SUCCESS'));
            this.getAllClassifications(this.filters);
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
