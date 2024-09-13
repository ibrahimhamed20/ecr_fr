import { TableConfig } from '@shared-ui';


// Configuration for the Catalog table
export const CatalogTableConfig: TableConfig = {
  columns: [
    {
      field: 'classificationName',
      header: 'CLASSIFICATION',
      type: 'label',
      exported: false,
    },
    {
      field: 'freeProdouctCount',
      header: 'PRODUCT_NO',
      type: 'label',
      exported: false,
    },
    {
      field: 'price',
      header: 'PRODUCT_PRICE',
      type: 'label',
      exported: false,
    },
    {
      field: 'freeProdouctCount',
      header: 'FREE_PRODUCT_NO',
      type: 'label',
      exported: false,
    },
    {
      field: 'paidProduct',
      header: 'PAID_PRODUCT',
      type: 'label',
      exported: false,
    },
    { field: 'actions', header: 'ACTIONS', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  rowsActions: ['EDIT', 'DELETE'],
  dataLoading: 'server',
  locale:'FIELDS.',
  paginator: true,
};
export const ProductSelectedTableConfig: TableConfig = {
  columns: [
    { field: 'catalog', header: 'catalog', type: 'checkbox', exported: false },
    { field: 'productName', header: 'PRODUCTNAME', type: 'label', exported: false },
    {
      field: 'categoryName',
      header: 'CATEGORY_NAME',
      type: 'label',
      exported: false,
    },
    {
      field: 'brandName',
      header: 'BRAND_NAME',
      type: 'label',
      exported: false,
    },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  rowsActions: [],
  dataLoading: 'server',
  locale:'FIELDS.',
  paginator: true,
};

export const SelectedProductTableConfig: TableConfig = {
  columns: [
    { field: 'catalog', header: 'catalog', type: 'checkbox', exported: false },
    { field: 'productName', header: 'PRODUCTNAME', type: 'label', exported: false },
    {
      field: 'categoryName',
      header: 'CATEGORY_NAME',
      type: 'label',
      exported: false,
    },
    {
      field: 'brandName',
      header: 'BRAND_NAME',
      type: 'label',
      exported: false,
    },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  rowsActions: [],
  dataLoading: 'server',
  locale:'FIELDS.',
  paginator: true,
};
