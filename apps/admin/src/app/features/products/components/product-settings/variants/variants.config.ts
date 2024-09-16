import { TableConfig } from '@shared-ui';
import { TableComponent } from '@shared-ui';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const VariantsTableConfig: TableConfig = {
  columns: [
    {
      field: 'arabicName',
      header: 'VARIANTNAME',
      type: 'label',
      exported: false,
    },
    {
      field: 'variantsValueProp',
      header: 'VARIANTVALUE',
      type: 'label',
      exported: false,
    },
    {
      field: 'classification',
      header: 'CLASSIFICATION',
      type: 'label',
      exported: false,
    },
    { field: 'actions', header: 'ACTIONS', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  actions: ['CREATE'],
  rowsActions: ['EDIT', 'DELETE', 'ADD_VARIANT_VALUE'],
  paginator: true,
  locale: 'FIELDS.',
  dataLoading: 'server',
  hasFilters: true,
};

export const SHARED_MODULES = [
  CommonModule,
  DropdownModule,
  DialogModule,
  ButtonModule,
  TableComponent,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule
];