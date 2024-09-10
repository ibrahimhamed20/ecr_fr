import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableConfig } from '@shared-ui';
import { Subject, takeUntil } from 'rxjs';
import { ClassificationsData } from '@admin-features/products/interfaces/classifications.interface';
import { ClassificationsService } from '@admin-features/products/services/classifications.service';
import {  Data } from '@admin-features/products/interfaces/products.interface';
import { DialogModule } from 'primeng/dialog';
import { AddEditClassificationComponent } from './components/add-edit-classification.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClassificationTableConfig } from './classification.config';

@Component({
  selector: 'admin-classifications',
  standalone: true,
  imports: [CommonModule, TableComponent,DialogModule,AddEditClassificationComponent,TranslateModule],
  templateUrl: './classifications.component.html',
})
export class ClassificationsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  displayDialog = false;
  filters: any = { number: 1, size: 10 };

  constructor(
    private _classifications: ClassificationsService
  ) {}

  ngOnInit(): void {
    this.getAllClassifications(this.filters);
  }
  getAllClassifications(params: any): void {
    this._classifications
      .getAllClassifications(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.tableConfig =  {...ClassificationTableConfig,rows: res.data.classifications,  totalRecords: res.data.rowCount} || [];
      });
  }

  tableConfig!: TableConfig;
  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'CREATE':
      
        break;
      case 'EDIT':
        this.getClassificationById(ev.data)
        break;
      default:
        break;
    }
  }
  selectedClassification: ClassificationsData | null = null; // Use the defined interface
  getClassificationById(data: ClassificationsData) {
    const id = typeof data.id === 'string' ? Number(data.id) : data.id;
    if (id) {
      this._classifications.getClassificationById(id).subscribe((res: Data<ClassificationsData>) => {
        if (res.data) {
          this.displayDialog = true;
          this.selectedClassification = res.data; // Should match UnitData
        }
      });
    }
  }
  handleSave(ev :any){

  }
  openCreateDialog(): void {
    this.displayDialog = true;
  }
  onDialogClose(): void {
    this.displayDialog = false;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
