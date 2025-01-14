import { TableConfig } from "@shared-ui";

// Configuration for the Units table
export const UnitsTableConfig: TableConfig = {
  columns: [
    { field: 'name', header: 'UNIT_NAME', type: 'label', exported: false },
    {
      field: 'shortName',
      header: 'SHORT_NAME',
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
  locale:'FIELDS.',
  actions: ['CREATE'],
  rowsActions: ['EDIT', 'DELETE'],
  dataLoading: 'server',
  paginator: true
};
