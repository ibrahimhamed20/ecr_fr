import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { ProductsService } from '@admin-features/products/services/products.service';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ApiResponse, Classification, ClassificationsResponse, Data, DropdownEvent, ProductInterface, UnitData, UnitResponse } from '@admin-features/products/interfaces/products.interface';
import { AddEditUnitsComponent } from './components/add-edit-units/add-edit-units.component';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'libs/shared/ui/src/lib/confirm-dialog/confirm-dialog.service';
import { FormControl } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { TranslateService, LangChangeEvent, TranslateModule } from '@ngx-translate/core'; // Import LangChangeEvent
import { UnitsTableConfig } from './units.config';

@Component({
  selector: 'admin-units',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    DropdownModule,
    AddEditUnitsComponent,
    TranslateModule,
    BreadcrumbComponent,
    DialogModule
  ],
  templateUrl: './units.component.html',
})
export class UnitsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  displayDialog = false;
  pageSize = 10;
  pageNumber = 1;
  totalRecords = 0;
  first = 0;
  keyword = "";
  searchControl: FormControl = new FormControl();
  breadcrumb!: MenuItem[];

  tableConfig!: TableConfig;
  classifications: Classification[] = [];
  selectedClassification: Classification | null = null;

  constructor(
    private _toastr: ToastrService,
    private _confirm: ConfirmDialogService,
    private _translate: TranslateService,
    private _product: ProductsService
  ) { }

  ngOnInit(): void {
    this.tableConfig = UnitsTableConfig;
    this.setBreadcrumb();
    this.getClassifications();
    this.getAllUnits();
    this.onSearch();

    // Subscribe to language change events
    this._translate.onLangChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((event: LangChangeEvent) => {
      this.setBreadcrumb(); // Update the breadcrumb when the language changes
    });
  }

  setBreadcrumb(): void {
    this.breadcrumb = [
      { icon: 'pi pi-home', route: '/' },
      { label: this._translate.instant('UNITS.PRODUCT_MANAGEMENT') },
      { label: this._translate.instant('UNITS.NAME'), route: '/units' },
    ];
  }

  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.classifications = res.data.classifications;
      });
  }

  getAllUnits(): void {
    this._product
      .getAllUnits(this.pageSize, this.pageNumber, this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<UnitData>) => {
        this.tableConfig = {
          ...UnitsTableConfig,
          rows: response.data.result.map((el) => ({
            ...el,
            classification: el.classification?.name,
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
      });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first || 0;
    this.pageSize = event.rows || 10;
    this.pageNumber = event.page || 1;
    this.getAllUnits();
  }

  onActionClicked(ev: { action: string; data?: any }): void {
    switch (ev.action) {
      case 'CREATE':
        this.selectedUnit = null;
        this.openCreateDialog();
        break;
      case 'EDIT':
        this.getUnitById(ev.data);
      break;
      case 'DELETE':
        this.onActionDelete(ev.data);
        break;
      default:
        break;
    }
  }

  openCreateDialog(): void {
    this.displayDialog = true;
  }

  onDialogClose(): void {
    this.displayDialog = false;
  }

  onActionDelete(data: ProductInterface): void {
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        this._product
          .deleteUnit(data.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((response) => {
            if (response.data) {
              this.getAllUnits();
            }
          });
      }
    });
  }

  handleSave(data: UnitData): void {
    if (!this.selectedUnit) {
      this._product
        .addUnit(data)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.getAllUnits();
          this.displayDialog = false;
          this._toastr.success(this._translate.instant('GENERAL.ADDED_SUCCESSFULLY', { name: 'UNITS.NAME' }));

        });
    } else {
      this._product
        .editUnit({ ...data, id: this.selectedUnit.id })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response) => {
          if (response.data) {
            this._toastr.success(this._translate.instant('GENERAL.UPDATED_SUCCESSFULLY', { name: 'UNITS.NAME' }));
            this.getAllUnits();
            this.displayDialog = false;
          }
        });
    }
  }

  selectedUnit: UnitData | null = null; // Use the defined interface
  getUnitById(data: UnitData) {
    const id = typeof data.id === 'string' ? Number(data.id) : data.id;
    if (id) {
      this._product.getUnitById(id).subscribe((res: Data<UnitData>) => {
        if (res.data) {
          this.displayDialog = true;
          this.selectedUnit = res.data; // Should match UnitData
        }
      });
    }
  }

  onClassificationChange(event: DropdownEvent) {
    this.selectedClassification = event.value as Classification;
    this.filterUnits();
  }

  filterUnits(): void {
    if (this.selectedClassification) {
      this._product.getAllUnits(this.pageSize, this.pageNumber, this.keyword).pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: UnitResponse) => {
          const filteredUnits = res.data.result.filter((unit) =>
            unit.classification?.id === this.selectedClassification?.id
          );
          this.tableConfig.rows = filteredUnits.map((el) => ({
            ...el,
            classification: el.classification?.name,
          }));
        });
    } else {
      // If no classification is selected, reset the table to show all units
      this.getAllUnits();
    }
  }

  onSearch() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length >= 0),
      debounceTime(400),
      switchMap(word => this._product.getAllUnits(
        this.pageSize,
        this.pageNumber,
        word.trim()
      ))
    ).subscribe((response:ApiResponse<UnitData>) => {
      if (response && response.data) {
        this.tableConfig = {
          ...UnitsTableConfig,
          rows: response.data.result.map((el) => ({
            ...el,
            classification: el.classification?.name,
          })) || [],
          totalRecords: response.data.rowCount,
          rowsActions: ['EDIT', 'DELETE'],
        };
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
