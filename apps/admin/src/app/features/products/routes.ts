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
        loadComponent: () => import('./components/product/product-form/product-form.component').then((c) => c.ProductFormComponent),
      },
      {
        path: 'product-details/:id',
        loadComponent: () => import('../products/components/product/product-details/product-details.component').then((c) => c.ProductDetailsComponent),
      },
      {
        path: 'brands',
        loadComponent: () => import('./components').then((c) => c.BrandsComponent),
      },
      {
        path: 'merchant',
        loadComponent: () => import('./components/merchant-products/merchant-products.component').then((c) => c.MerchantproductsComponent),
      },
      {
        path: 'categories',
        loadComponent: () => import('./components').then((c) => c.CategoriesComponent),
      },
      {
        path: 'classifications',
        loadComponent: () => import('./components').then((c) => c.ClassificationsComponent),
      },
      {
        path: 'variants',
        loadComponent: () => import('./components').then((c) => c.VariantsComponent),
      },
      {
        path: 'tags',
        loadComponent: () => import('./components').then((c) => c.TagsComponent),
      },
      {
        path: 'units',
        loadComponent: () => import('./components').then((c) => c.UnitsComponent),
      },
      {
        path: 'categories',
        loadComponent: () => import('./components').then((c) => c.CategoriesComponent),
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
