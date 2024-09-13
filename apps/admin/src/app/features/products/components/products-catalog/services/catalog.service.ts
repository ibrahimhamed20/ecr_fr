import { environment } from '@admin-env/environment';
import { ApiResponse } from '@admin-features/products/interfaces/products.interface';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private _http: CustomHttpClient) { }

  getAllPaidProduct(id:number,pageNumber:number,pageSize:number) {
    return this._http.get<ApiResponse<any>>(
      `${environment.URL_API}Products/paid-product/classification/${id}?PageSize=${pageSize}&PageNumber=${pageNumber}`
    );
  }

}
