import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, TabsComponent } from '@shared-ui';
import { ClassificationsComponent } from './classifications/classifications.component';
import { UnitsComponent } from './units/units.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { VariantsComponent } from './variants/variants.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-product-settings',
  standalone: true,
  imports: [CommonModule, TabsComponent, BreadcrumbComponent],
  templateUrl: './product-settings.component.html'
})
export class ProductSettingsComponent {

  breadcrumb: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Products Management' },
    { label: 'Product Metadata', route: '/product-settings' },
  ];

  tabs: MenuItem[] = [
    { label: 'Classifications', component: ClassificationsComponent },
    { label: 'Categories', component: CategoriesComponent },
    { label: 'Variants', component: VariantsComponent },
    { label: 'Brands', component: BrandsComponent },
    { label: 'Units', component: UnitsComponent },
    { label: 'Tags', component: TagsComponent }
  ];
}
