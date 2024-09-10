import { Route } from '@angular/router';

export const subscriptionRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./subscriptions.component').then((c) => c.SubscriptionsComponent),
    children: [
      {
        path: 'subscription',
        loadComponent: () =>
          import('./components').then((c) => c.SubscriptionComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./components').then((c) => c.RolesComponent),
      },
    ],
  },
];
