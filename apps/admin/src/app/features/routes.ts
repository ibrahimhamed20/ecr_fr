import { Route } from '@angular/router';

export const featuresRoutes: Route[] = [
    {
        path: '',
        children: [
            { path: 'home', loadChildren: () => import('./home/routes').then(r => r.homeRoutes) },
            { path: 'merchants', loadChildren: () => import('./merchants/routes').then(r => r.merchantsRoutes) },
            { path: 'subscriptions', loadChildren: () => import('./subscriptions/routes').then(r => r.subscriptionRoutes) },
            { path: 'customers', loadChildren: () => import('./customers/routes').then(r => r.customersRoutes) },
            { path: 'products', loadChildren: () => import('./products/routes').then(r => r.productsRoutes) }
        ]
    }
];
