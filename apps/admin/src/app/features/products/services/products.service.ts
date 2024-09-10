import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { ApiResponse, Category, ClassificationsResponse } from '../interfaces/products.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _http: CustomHttpClient) { }

  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }


  getAllProductCatalog(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<Category>>(`${environment.URL_API}Classifications/catalog?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`);
  }


  private blobStoreUrl = `${environment.URL_API}BlobsStore/file`;
  public uploadGalaryImage(formData: FormData): Observable<any> {
    return this._http.post(this.blobStoreUrl, formData);
  }

}

