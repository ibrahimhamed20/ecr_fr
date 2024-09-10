import { environment } from '@admin-env/environment';
import { ApiResponse, BrandData, BransResponse, ClassificationsResponse, Data, PaginationParams, ProductsPagingInteface, UnitData } from '@admin-features/products/interfaces/products.interface';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private _http: CustomHttpClient) { }

  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }
  getBrands(params: PaginationParams): Observable<BransResponse> {
    return this._http.get<BransResponse>(`${environment.URL_API}Brands?PageSize=${params.pageSize}&PageNumber=${params.pageNumber}`);
  }

  addBrand(formData:any){
    return this._http.post<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Brands`,
      formData
    );
  }

  deleteBrand(id:number){
    return this._http.delete<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Brands/${id}`
    );
  }

  editBrand(formData:any){
    return this._http.put<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Brands`,
      formData
    );
  }



getBrandById(id: number): Observable<ApiResponse<BrandData>> {
  return this._http.get<ApiResponse<BrandData>>(`/api/Brands/${id}`);
}
}
