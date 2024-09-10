import { Injectable } from '@angular/core';

const TOKEN_KEY = 'admin-auth-token';
const REFRESH_TOKEN_KEY = 'admin-auth-refresh-token';
const ACTIONS_KEY = 'admin-auth-permissions';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    constructor() { }

    public setAccessToken(token: string): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.setItem(TOKEN_KEY, token);
    }

    public getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }


    public setRefreshToken(token: string): void {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }


    public setPermissions(actions: string[]): void {
        localStorage.removeItem(ACTIONS_KEY);
        localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
    }

    public getPermissions(): string[] | any {
        const actions = localStorage.getItem(ACTIONS_KEY);
        if (actions) return JSON.parse(actions);
        return [];
    }

    public clearToken() {
        localStorage.clear();
    }
}