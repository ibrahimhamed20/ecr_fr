import { TableConfig } from "@shared-ui";

export const StoreTableConfig: TableConfig = {
    columns: [
        { field: 'store', header: 'Store', type: 'checkbox', exported: false },
        { field: 'merchantName', header: 'Store', type: 'link', exported: true, sortable: true },
        { field: 'classificationName', header: 'Classification', type: 'label', exported: true, sortable: true },
        { field: 'owner', header: 'Owner', type: 'label', exported: true, sortable: true },
        { field: 'mobileNumber', header: 'Owner Phone', type: 'label', exported: true, sortable: true },
        { field: 'countryIsoCode', header: 'Country', type: 'label', exported: true, sortable: true },
        { field: 'registerDate', header: 'Register Date', type: 'date', exported: true, sortable: true },
        // { field: 'subscribtionType', header: 'Subscription', type: 'label', exported: true, sortable: true },
        { field: 'domainStatus', header: 'Status', type: 'status', exported: true, sortable: true },
        // { field: 'expireDate', header: 'Expiry', type: 'date', exported: true, sortable: true },
        { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Accepted Stores',
    globalFilterFields: ['merchantName', 'owner', 'mobileNumber'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    actions: ['CREATE'],
    rowsActions: ['EDIT', 'DELETE'],
    paginator: true
};

export const PendingTableConfig: TableConfig = {
    columns: [
        { field: 'store', header: 'Store', type: 'checkbox', exported: false },
        { field: 'merchantName', header: 'Store', type: 'link', exported: true, sortable: true },
        { field: 'classificationName', header: 'Classification', type: 'label', exported: true, sortable: true },
        { field: 'owner', header: 'Owner', type: 'label', exported: true, sortable: true },
        { field: 'merchantTypeName', header: 'Type', type: 'label', exported: true, sortable: true },
        { field: 'subscribtionType', header: 'Register To', type: 'label', exported: true, sortable: true },
        { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Pending Stores',
    globalFilterFields: ['merchantName', 'owner', 'merchantTypeName'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    paginator: true
};
