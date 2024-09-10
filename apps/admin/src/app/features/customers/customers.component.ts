import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, TableComponent } from '@shared-ui';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'admin-customers',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    BreadcrumbComponent,
    TableComponent,
    TabViewModule,
    TabMenuModule,
  ],
  template: `<router-outlet />`,
})
export class CustomersComponent {
  items: MenuItem[] = [
    { label: 'Verified' },
    { label: 'Pending' },
    { label: 'Blocked' },
  ];
  activeItem!: MenuItem;
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Pages' },
    { label: 'Customers' },
    // { label: 'pending', route: '/customers/pending-customers' }
  ];

  constructor() {}
}
