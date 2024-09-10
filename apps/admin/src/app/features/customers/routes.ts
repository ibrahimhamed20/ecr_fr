import { Route } from '@angular/router';

export const customersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./customers.component').then((c) => c.CustomersComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components').then((c) => c.CustomersListComponent),
      },
    ],
  },
];
