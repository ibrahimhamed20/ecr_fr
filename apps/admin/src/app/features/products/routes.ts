import { Route } from '@angular/router';


export const productsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components').then((c) => c.ProductComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./components').then((c) => c.ProductFormComponent),
      },
      {
        path: 'product-details/:id',
        loadComponent: () => import('../products/components').then((c) => c.ProductDetailsComponent),
      },
      {
        path: 'merchant',
        loadComponent: () => import('./components').then((c) => c.MerchantproductsComponent),
      },
      {
        path: 'metadata',
        loadComponent: () => import('./components').then((c) => c.ProductSettingsComponent),
      },
      {
        path: 'products-catalog',
        loadComponent: () => import('./components').then((c) => c.ProductsCatalogComponent),
      },
      {
        path: 'link-products/:id',
        loadComponent: () => import('./components').then((c) => c.LinkProductsComponent),
      },
    ],
  },
];
