import { TableConfig } from "@shared-ui";

export const BrandTableConfig: TableConfig = {
  columns: [
    {
      field: 'name',
      header: 'BRANDNAME',
      type: 'label',
      exported: false,
    },
    {
      field: 'classifications',
      header: 'CLASSIFICATION',
      type: 'label',
      exported: true,
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
  paginator: true,
  globalFilterFields:['name'],
  hasFilters: true,

};
