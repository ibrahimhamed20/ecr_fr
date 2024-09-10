import { Route } from '@angular/router';

export const authRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
    { path: 'forget', loadComponent: () => import('./components/forget-password/forget-password.component').then(c => c.ForgetPasswordComponent) },
    { path: 'reset', loadComponent: () => import('./components/reset-password/reset-password.component').then(c => c.ResetPasswordComponent) },
    { path: 'verify', loadComponent: () => import('./components/verify/verify.component').then(c => c.VerifyComponent) },
];
