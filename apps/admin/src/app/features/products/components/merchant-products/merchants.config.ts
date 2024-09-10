import { TableConfig } from "@shared-ui";

// Configuration for the Merchant Products table
export const MerchantProductsTableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'PRODUCTNAME', type: 'label', exported: false },
      { field: 'category', header: 'CATEGORY', type: 'label', exported: true },
      { field: 'brand', header: 'BRAND', type: 'label', exported: true },
      { field: 'actions', header: 'ACTIONS', type: 'actions', exported: false },
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
    rowsActions: ['EDIT', 'DELETE'],
    actions:['Link'],
    paginator: true,
    dataLoading:'server',
   locale:'FIELDS.',
  };

  export const LinkTableConfig: TableConfig = {
    columns: [
      { field: 'productName', header: 'Product Name', type: 'label', exported: false },
      { field: 'barCode', header: 'Barcode', type: 'label', exported: true },
      { field: 'cost', header: 'Cost', type: 'label', exported: true },
      { field: 'price', header: 'Price', type: 'label', exported: false },
    ],
    rows: [
      {
        productName: 'Product 1',
        category: 'category',
        brand: 'brand',
      },
      {
        productName: 'Product 2',
        category: 'category',
        brand: 'brand',
      },
      {
        productName: 'Product 3',
        category: 'category',
        brand: 'brand',
      },
    ],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    rowsActions: ['EDIT', 'DELETE'],
    actions:['Link',],
    paginator: true,
    dataLoading:'server',
    locale:'FIELDS.',
  };