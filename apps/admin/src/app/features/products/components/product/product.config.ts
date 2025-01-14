import { TableConfig } from '@shared-ui';

export const ProductTableConfig: TableConfig = {
  columns: [
    {
      field: 'name',
      header: 'NAME',
      type: 'link',
      exported: false,
      sortable: true,
    },
    {
      field: 'sKU',
      header: 'SKU',
      type: 'label',
      exported: true,
      sortable: true,
    },
    {
      field: 'unit',
      header: 'Unit',
      type: 'label',
      exported: true,
      sortable: true,
    },
    {
      field: 'barcode',
      header: 'Barcode',
      type: 'label',
      exported: true,
      sortable: true,
    },
    {
      field: 'cost',
      header: 'Cost',
      type: 'label',
      exported: true,
      sortable: true,
    },
    {
      field: 'price',
      header: 'Price',
      type: 'label',
      exported: true,
      sortable: true,
    },
    { field: 'actions', header: 'Actions', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  actions: ['EXPORT', 'IMPORT', 'CREATE'],
  rowsActions: ['EDIT', 'DELETE'],
  paginator: true,
  dataLoading: 'server',
  locale: 'FIELDS.',
  hasFilters: true
};

// Configuration for the Merchant Products table
export const MerchantProductsTableConfig: TableConfig = {
  columns: [
    { field: 'name', header: 'Name', type: 'label', exported: false },
    { field: 'category', header: 'Category', type: 'label', exported: true },
    { field: 'brand', header: 'Brand', type: 'label', exported: true },
    { field: 'actions', header: 'Actions', type: 'actions', exported: false },
  ],
  rows: [
    {
      name: 'Product 1',
      category: 'category',
      brand: 'brand',
    },
    {
      name: 'Product 2',
      category: 'category',
      brand: 'brand',
    },
    {
      name: 'Product 3',
      category: 'category',
      brand: 'brand',
    },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  paginator: true,
  dataLoading: 'server',
};

// Configuration for the Category table
export const CategoryTableConfig: TableConfig = {
  columns: [
    {
      field: 'name',
      header: 'Category name',
      type: 'label',
      exported: false,
    },
    {
      field: 'subCategories',
      header: 'Subcategory',
      type: 'label',
      exported: true,
    },
    {
      field: 'classification',
      header: 'Classification',
      type: 'label',
      exported: true,
    },
    { field: 'actions', header: 'Actions', type: 'actions', exported: false },
  ],
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
  selectionMode: 'single',
  actions: ['CREATE'],
  rowsActions: ['EDIT', 'DELETE'],
  paginator: true,
};

// Configuration for the Variants table


// Configuration for the Tags table


