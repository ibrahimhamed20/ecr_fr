import { HttpInterceptorFn } from "@angular/common/http";
import { AuthInterceptorFn } from "./auth.interceptor";
import { ErrorInterceptorFn } from "./error.interceptor";
import { LoaderInterceptorFn } from "./loader.interceptor";

export const APP_INTERCEPTORS: HttpInterceptorFn[] = [
    AuthInterceptorFn,
    ErrorInterceptorFn,
    LoaderInterceptorFn
];

export * from "./auth.interceptor";
export * from "./error.interceptor";
export * from "./loader.interceptor";