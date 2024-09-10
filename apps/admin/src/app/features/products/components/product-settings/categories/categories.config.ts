import { TableConfig } from "@shared-ui";

// Configuration for the Category table
export const CategoryTableConfig: TableConfig = {
  columns: [
    {
      field: 'name',
      header: 'CATEGORY_NAME',
      type: 'label',
      exported: false,
    },
    {
      field: 'subCategories',
      header: 'SUB_CATAGORY',
      type: 'label',
      exported: true,
    },
    {
      field: 'classification',
      header: 'CLASSIFICATION',
      type: 'label',
      exported: true,
    },
    { field: 'actions', header: 'ACTIONS', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  actions: ['CREATE'],
  rowsActions: ['EDIT', 'DELETE'],
  paginator: true,
  locale:'FIELDS.',
  dataLoading: 'server'
};
