import { environment } from "@admin-env/environment";
import { UserCheckInterface } from "@admin-shared/interfaces";
import { Injectable } from "@angular/core";
import { CustomHttpClient } from "@shared-utils";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private _http: CustomHttpClient) { }

    checkUser(keyword: string) {
        return this._http.get<{ data: UserCheckInterface }>(`${environment.URL_API}Users/search/${keyword}`);
    }
}