import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@shared-ui';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-subscription',
  standalone: true,
  templateUrl: './subscription.component.html',
  imports: [CommonModule,BreadcrumbComponent]
})
export class SubscriptionComponent {
  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Pages' },
    { label: 'Subscriptions' },
    { label: 'subscription', route: '/subscriptions/subscription' }
  ];

}
