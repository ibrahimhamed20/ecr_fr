import { Route } from '@angular/router';
import { AuthGuardFn } from '@shared-utils';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('@admin-layout/layout.component').then(c => c.LayoutComponent),
        loadChildren: () => import('@admin-features/routes').then(r => r.featuresRoutes),
        canActivate: [AuthGuardFn]
    },
    {
        path: 'auth',
        loadChildren: () => import('@shared-auth/index').then(r => r.authRoutes)
    },
    {
        path: 'access-denied',
        loadComponent: () => import('@admin-shared/components').then(c => c.ErrorComponent),
        data: { mode: 'access_denied' }
    },
    {
        path: 'error',
        loadComponent: () => import('@admin-shared/components').then(c => c.ErrorComponent),
        data: { mode: 'error' }
    },
    {
        path: '**',
        loadComponent: () => import('@admin-shared/components').then(c => c.ErrorComponent),
        data: { mode: 'not_found' }
    }
];
