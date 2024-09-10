import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomHttpClient {

    constructor(private _http: HttpClient) { }

    get<T>(url: string, params?: HttpParams): Observable<T> {
        return this._http.get<T>(url, { params });
    }

    post<T>(url: string, body: T): Observable<T> {
        return this._http.post<T>(url, body);
    }

    put<T>(url: string, body: T, params?: HttpParams): Observable<T> {
        return this._http.put<T>(url, body, { params });
    }

    delete<T>(url: string, params?: HttpParams): Observable<T> {
        return this._http.delete<T>(url, { params });
    }
}