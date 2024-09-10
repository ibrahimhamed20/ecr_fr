import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./home.component').then(c => c.HomeComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./components').then(c => c.DashboardComponent)
            }
        ]
    }
];
