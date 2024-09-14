import { TableConfig } from "@shared-ui";

export const TagsTableConfig: TableConfig = {
    columns: [
      { field: 'tagName', header: 'TAGNAME', type: 'label', exported: false },
      {
        field: 'classifications',
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
    dataLoading: 'server',
    paginator: true,
    globalFilterFields: ['tagName', 'classifications'],
    locale:'FIELDS.',
    hasFilters: true,

  };