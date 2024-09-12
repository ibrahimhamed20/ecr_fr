import { environment } from "@admin-env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly api = environment.URL_API;

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _tokenStorage: TokenStorageService) { }

    public get isLoggedIn(): boolean {
        return !!this._tokenStorage.getAccessToken();
    }


    login(payload: { username: string, password: string }) {
        return this._http.post(`${this.api}Users/Login`, payload)
            .pipe(map(res => this.setTokenAndPermissions(res)));
    }

    setTokenAndPermissions(res: any): { hasToken: boolean, hasPermissions: boolean } {
        const permissions = res.data.granted;
        const token = res.data.token;
        const refresh = res.data.refreshToken;

        this._tokenStorage.setAccessToken(token);
        this._tokenStorage.setRefreshToken(refresh);
        this._tokenStorage.setPermissions(permissions);

        return { hasToken: !!token, hasPermissions: !!permissions };
    }

    refreshToken(tokenData: { accessToken: string, refreshToken: string, mId: string }) {
        return this._http.patch(`​/api​/Users​/renew-token`, tokenData)
            .pipe(map(res => this.setTokenAndPermissions(res)));
    }

    logout() {
        this._tokenStorage.clearToken();
        this._router.navigateByUrl('/auth/login');
    }

    register(payload: any) {
        return this._http.post(`${this.api}Users/Register`, payload);
    }

    getRoles() {
        return this._http.get(`${this.api}Role`);
    }

    forgotPassword(phone: string) {
        return this._http.post(`${this.api}Users/ForgotPassword`, phone);
    }
    requestOTP(phone: string) {
        return this._http.post(`${this.api}Users/request-otp`, phone);
    }

    verifyCode(payload: any) {
        return this._http.post(`${this.api}Users/Verify`, payload);
    }

    resetPassword(payload: any) {
        return this._http.post(`${this.api}Users/ResetPassword`, payload);
    }
}