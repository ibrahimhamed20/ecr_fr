import { Component } from '@angular/core';
import {ActivatedRoute,NavigationEnd,Router,RouterOutlet} from '@angular/router';
import { BreadcrumbComponent } from '@shared-ui';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { filter } from 'rxjs';

@Component({
  selector: 'admin-products',
  standalone: true,
  imports: [RouterOutlet, TabMenuModule, BreadcrumbComponent],
template: `<router-outlet />`
})
export class ProductsComponent {
  breadcrumb: MenuItem[] = [];
  activeItem!: MenuItem;

  // breadcrumb: MenuItem[] = [
  //   { icon: 'pi pi-home', route: '/' },
  //   { label: 'Pages' },
  //   { label: 'Products' },
  //   { label: 'Product', route: '/products/product' },
  // ];

  items: any[] = [
    {
      label: 'Product',
      route: '/Product',
      command: () => {
        this._router.navigate(['/products/product']);
      },
    },
    {
      label: 'Merchant products',
      route: '/merchant-products',
      command: () => {
        this._router.navigate(['/products/merchant-products']);
      },
    },
    {
      label: 'Brands',
      command: () => {
        this._router.navigate(['/products/brands']);
      },
    },
    {
      label: 'Categories',
      command: () => {
        this._router.navigate(['/products/categories']);
      },
    },
    {
      label: 'Classifications',
      command: () => {
        this._router.navigate(['/products/classifications']);
      },
    },
    {
      label: 'Variants',
      command: () => {
        this._router.navigate(['/products/variants']);
      },
    },
    {
      label: 'Tags',
      command: () => {
        this._router.navigate(['/products/tags']);
      },
    },
    {
      label: 'Units',
      command: () => {
        this._router.navigate(['/products/units']);
      },
    },
  ];

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  /**
   * Initializes the component. Sets up the breadcrumb on initialization and subscribes to router events to 
     update the breadcrumb on navigation end.
   */
  ngOnInit(): void {
    this.updateBreadcrumb();
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });
    this.activeItem = this.items[0];
  }

  /**
   * Updates the breadcrumb based on the current route path.
   * Retrieves the path from the current route and updates the breadcrumb array with appropriate labels and routes.
   */
  updateBreadcrumb(): void {
    const routePath = this._route.snapshot.firstChild?.routeConfig?.path;

    if (routePath) {
      const label = this.getLabelByRoute(routePath);

      this.breadcrumb = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Pages' },
        { label: 'Products' },
        { label, route: `/products/${routePath}` },
      ];
    }
  }

  getLabelByRoute(routePath: string): string {
    const labels: { [key: string]: string } = {
      product: 'Product',
      'merchant-products': 'Merchant Products',
      brands: 'Brands',
      categories: 'Categories',
      classifications: 'Classifications',
      variants: 'Variants',
      tags: 'Tags',
      units: 'Units',
    };
    return labels[routePath] || 'Product';
  }
}
