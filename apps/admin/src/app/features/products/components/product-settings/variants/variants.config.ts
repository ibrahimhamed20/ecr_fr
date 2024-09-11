import { TableConfig } from "@shared-ui";

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
    rowsActions: ['EDIT', 'DELETE'],
    paginator: true,
    locale:'FIELDS.',
    dataLoading:'server'
  };