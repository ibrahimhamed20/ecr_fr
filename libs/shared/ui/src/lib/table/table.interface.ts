type ColumnType = 'checkbox' | 'link' | 'label' | 'image' | 'money' | 'rating' | 'status' | 'actions' | 'date';
type SelectionMode = 'single' | 'multiple';
type LoadingType = 'client' | 'server';
export interface TableConfig {
    rows?: any[];
    actions?: string[];
    rowsActions?: any[];
    columns: {
        field: string;
        header: string;
        type: ColumnType;
        sortable?: boolean;
        exported: boolean;
    }[];
    rowsPerPage?: number;
    locale?: string;
    rowsPerPageOptions?: number[];
    selectionMode?: SelectionMode;
    globalFilterFields?: string[];
    exportFilename?: string;
    totalRecords?: number;
    paginator: boolean;
    dataLoading?: LoadingType;
    hasFilters?: boolean;
}
