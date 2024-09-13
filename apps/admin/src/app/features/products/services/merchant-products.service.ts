import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';
import { MerchantProductParams, ProductParams } from '../interfaces/product.interface';


@Injectable({
  providedIn: 'root'
})
export class MerchantProductsService {


  constructor(private _http: CustomHttpClient) { }

  geMerchantProductDefination(page: ProductParams,) {
    let queryParams = `Pagination.PageSize=${page.pageSize}&Pagination.PageNumber=${page.pageNumber}`;
    return this._http.get<{ data: any }>(
      `${environment.URL_API}definitions?Status=new${queryParams}`
    );
  }
  getMerchantProduct(page: MerchantProductParams) {
    let queryParams = `Pagination.PageSize=${page.pageSize}&Pagination.PageNumber=${page.pageNumber}&Status=${page.Status}`;
    return this._http.get<{ data: any }>(
      `${environment.URL_API}MerchantProducts/definitions?${queryParams}`
    );
  }
  getMerchantProductById(id: number): Observable<any> {
    return this._http.get(`${environment.URL_API}MerchantProducts/definitions/${id}`)
  }

  searchForMerchantProduct(keyword: any): Observable<any> {
    return this._http.get(`${environment.URL_API}MerchantProducts/true/${keyword}`)
  }

  linkProducts(data: any) {
    return this._http.put(`${environment.URL_API}MerchantProducts/link`, data)
  }
  rejectProduct(data: { productDefinitionId: number, merchantProductStatus: 'rejected' }) {
    return this._http.put(`${environment.URL_API}MerchantProducts/change-status`, data)
  }
  approveProduct(data: { productDefinitionId: number, merchantProductStatus: 'approved' }) {
    return this._http.put(`${environment.URL_API}MerchantProducts/change-status`, data)
  }


}
