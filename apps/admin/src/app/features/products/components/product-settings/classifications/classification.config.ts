import { TableConfig } from "@shared-ui";

// Configuration for the Units table
export const ClassificationTableConfig: TableConfig = {
  columns: [
    { field: 'id', header: 'ID', type: 'label', exported: false },
    {
      field: 'name',
      header: 'CLASSIFICATION',
      type: 'label',
      exported: false,
    },
    { field: 'actions', header: 'ACTIONS', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  locale:'FIELDS.',
  actions: ['CREATE'],
  rowsActions: ['EDIT', 'DELETE'],
  dataLoading: 'client',
  paginator: true
  
};
