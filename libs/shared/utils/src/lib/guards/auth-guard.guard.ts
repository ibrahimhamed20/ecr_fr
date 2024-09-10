import { AuthService } from '@shared-auth/lib/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';

export const AuthGuardFn: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
    const _auth = inject(AuthService);
    const _router = inject(Router);
    if (_auth.isLoggedIn) {
        return true;
    } else {
        _router.navigate(['/auth/login']);
        return false;
    }
}