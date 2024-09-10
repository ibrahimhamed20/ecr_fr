import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TableComponent, TableConfig } from '@shared-ui';
import { MenuItem } from 'primeng/api';
import { ProductService } from '@admin-shared/services';

@Component({
  selector: 'admin-store-tracker',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, TableComponent],
  templateUrl: './trackers.component.html'
})
export class TrackersComponent implements OnInit {
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Stores Management' },
    { label: 'Trackers', route: '/stores/trackers' }
  ];

  tableConfig: TableConfig = {
    columns: [
      { field: 'product', header: 'Product', type: 'checkbox', exported: false },
      { field: 'code', header: 'Code', type: 'label', exported: true, sortable: true },
      { field: 'name', header: 'Name', type: 'label', exported: true, sortable: true },
      { field: 'price', header: 'Price', type: 'money', exported: true, sortable: true },
      { field: 'category', header: 'Category', type: 'label', exported: true, sortable: true },
      { field: 'rating', header: 'Reviews', type: 'rating', exported: true, sortable: true },
      { field: 'inventoryStatus', header: 'Status', type: 'status', exported: true, sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', exported: false }
    ],
    exportFilename: 'Products',
    globalFilterFields: ['name'],
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100],
    selectionMode: 'single',
    paginator: true
  };

  constructor(private _product: ProductService) { }

  ngOnInit(): void {
    this._product.getProducts().then(data => {
      this.tableConfig.actions = ['CREATE', 'DELETE_ALL', 'EXPORT'];
      this.tableConfig.rows = data;
    });
  }

  onActionClicked(ev: { action: string, data?: any }) {
    alert(JSON.stringify(ev));
  }
}
