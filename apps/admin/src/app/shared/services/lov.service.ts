import { environment } from "@admin-env/environment";
import { Injectable } from "@angular/core";
import { CustomHttpClient } from "@shared-utils";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LovService {
    constructor(private _http: CustomHttpClient) { }

    getAllClassfications(): Observable<any> {
        return this._http.get<any>(`${environment.URL_API}Classifications`);
    }

    //get merchant types
    getMerchantTypes(): Observable<any> {
        return this._http.get<any>(`${environment.URL_API}Merchants/types`);
    }

    //get all cities
    getAllCities(countryId: number): Observable<any> {
        return this._http.get<any>(
            `${environment.URL_API}BranchSearch/Cities/${countryId}`
        );
    }

    //get all localities based on city id
    getAllLocalities(id: number): Observable<any> {
        return this._http.get<any>(
            `${environment.URL_API}BranchSearch/Cities/${id}/Localities`
        );
    }

    //get all sublocalitis based on local id
    getAllSubLocalities(id: number): Observable<any> {
        return this._http.get<any>(
            `${environment.URL_API}BranchSearch/Localities/${id}/subLocalities`
        );
    }
}