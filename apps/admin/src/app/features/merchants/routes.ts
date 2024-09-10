import { Route } from '@angular/router';

export const merchantsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./merchants.component').then((c) => c.MerchantsComponent),
    children: [
      {
        path: 'stores',
        loadComponent: () => import('./components').then((c) => c.StoresComponent),
      },
      {
        path: 'stores/:id',
        loadComponent: () => import('./components').then((c) => c.StoresFormComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./components').then((c) => c.ReportsComponent)
      },
      {
        path: 'trackers',
        loadComponent: () => import('./components').then((c) => c.TrackersComponent)
      }
    ]
  }
];
