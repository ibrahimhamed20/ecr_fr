import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared-ui';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-reports',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Stores Management' },
    { label: 'Reports', route: '/merchants/reports' }
  ];
}
