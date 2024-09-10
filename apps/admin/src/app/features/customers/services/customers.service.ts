import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _http: CustomHttpClient) { }

  getAllPendingCustomers(phoneConfirmed: boolean, keyword: string) {
    return this._http.get(`${environment.URL_API}Users/pending?phoneConfirmed=${phoneConfirmed}&keyword=${keyword}`);
  }

  getAllBlockedCustomers() {
    return this._http.get(`${environment.URL_API}users/trials/blocked`);
  }

  verifyCustomer(customerId: number) {
    return this._http.put(`${environment.URL_API}Users/Pending?id=${customerId}`, customerId);
  }

  unblockCustomer(customerId: number) {
    return this._http.put(`${environment.URL_API}Users/${customerId}/trials/reset`, customerId);
  }

  deleteCustomer(id: number) {
    return this._http.delete(`${environment.URL_API}Users/${id}`);
  }
}
