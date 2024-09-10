import { environment } from "@admin-env/environment";
import { Injectable } from "@angular/core";
import { StoreInterface, StorePagingInteface } from "../interfaces/stores.interface";
import { CustomHttpClient } from "@shared-utils";

@Injectable({
    providedIn: 'root'
})
export class StoresService {
    constructor(private _http: CustomHttpClient) { }

    getAcceptedStores() {
        return this._http.get<{ data: StoreInterface[] }>(`${environment.URL_API}Merchants/accepted`);
    }

    getPendingStores(page: { size: number, number: number } = { number: 1, size: 20 }) {
        return this._http.get<{ data: StorePagingInteface }>(`${environment.URL_API}Merchants/Pending?PageSize=${page.size}&PageNumber=${page.number}`);
    }


}