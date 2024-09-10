import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { ErrorHandlingService } from "../services";


export const ErrorInterceptorFn: HttpInterceptorFn = (req, next) => {
    const _errorHandler = inject(ErrorHandlingService);
    return next(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                if (!req.headers.get('skip')) _errorHandler.handleError(error);
                return throwError(() => error);
            })
        );
}