import { TableConfig } from "@shared-ui";

export const VerifiedTableConfig: TableConfig = {
    columns: [
        { field: 'name', header: 'Name', type: 'label', exported: false, sortable: true },
        { field: 'email', header: 'Email', type: 'label', exported: false, sortable: true },
        { field: 'phoneNumber', header: 'Phone', type: 'label', exported: false, sortable: true },
        { field: 'registerAppTypes', header: 'Mobile/Web', type: 'label', exported: false, sortable: true },
        { field: 'countryIsoCode', header: 'Country code ', type: 'label', exported: true, sortable: true },
        { field: 'userType', header: 'Type', type: 'label', exported: true, sortable: true },
        { field: 'createdAt', header: 'Created at', type: 'date', exported: false, sortable: true },
        { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Pending Customers',
    globalFilterFields: ['merchantName', 'owner', 'merchantTypeName'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    paginator: true
};
export const PendingTableConfig: TableConfig = {
    columns: [
        { field: 'name', header: 'Name', type: 'label', exported: false, sortable: true },
        { field: 'email', header: 'Email', type: 'label', exported: false, sortable: true },
        { field: 'phoneNumber', header: 'Phone', type: 'label', exported: false, sortable: true },
        { field: 'registerAppTypes', header: 'Mobile/Web', type: 'label', exported: false, sortable: true },
        { field: 'countryIsoCode', header: 'Country code ', type: 'label', exported: true, sortable: true },
        { field: 'userType', header: 'Type', type: 'label', exported: true, sortable: true },
        { field: 'createdAt', header: 'Created at', type: 'date', exported: false, sortable: true },
        { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Pending Customers',
    globalFilterFields: ['merchantName', 'owner', 'merchantTypeName'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    paginator: true
};

export const BlockedTableConfig: TableConfig = {
    columns: [
        { field: 'firstName', header: 'First Name', type: 'label', exported: false, sortable: false },
        { field: 'lastName', header: 'Last Name', type: 'label', exported: false, sortable: false },
        { field: 'phoneNumber', header: 'Phone Number', type: 'label', exported: false, sortable: false },
        { field: 'createdAt', header: 'Created at', type: 'date', exported: false, sortable: false },
        { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Pending Customers',
    globalFilterFields: ['merchantName', 'owner', 'merchantTypeName'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    paginator: true
};
