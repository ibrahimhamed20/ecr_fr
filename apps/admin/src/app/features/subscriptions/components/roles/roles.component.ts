import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared-ui';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-roles',
  standalone: true,
  imports: [CommonModule,BreadcrumbComponent],
  templateUrl: './roles.component.html',
  styles: ``,
})
export class RolesComponent {
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Pages' },
    { label: 'Subscriptions' },
    { label: 'Roles', route: '/subscriptions/role' }
  ];
}
