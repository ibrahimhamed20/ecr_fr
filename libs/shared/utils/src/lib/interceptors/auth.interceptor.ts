import { AuthService } from "@shared-auth/lib/services/auth.service";
import { TokenStorageService } from "@shared-auth/lib/services/token-storage.service";
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

export const AuthInterceptorFn: HttpInterceptorFn = (req, next) => {
    const _auth = inject(AuthService);
    const _tokenStorage = inject(TokenStorageService);

    const accessToken = _tokenStorage.getAccessToken() || '';
    const refreshToken = _tokenStorage.getRefreshToken() || '';

    if (accessToken) req = addToken(req, accessToken)

    return next(req).pipe(
        catchError(error => {
            debugger
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Access token expired, try refreshing
                return _auth.refreshToken({ accessToken, refreshToken, mId: 'tg' }).pipe(
                    switchMap(() => {
                        const newAccessToken = _tokenStorage.getAccessToken();
                        if (newAccessToken) {
                            req = addToken(req, newAccessToken);
                            return next(req);
                        }
                        return throwError(() => error);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
// Define a type for headers with dynamic keys
type Headers = {
  [key: string]: string;
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    // Initialize headers object with basic headers
    const headers: Headers = {
        Authorization: `Bearer ${token}`,
        Accept: "*/*"
    };

    // Conditionally add Content-Type header based on body type
    if (!(request.body instanceof FormData)) {
        headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return request.clone({
        setHeaders: headers
    });
}
