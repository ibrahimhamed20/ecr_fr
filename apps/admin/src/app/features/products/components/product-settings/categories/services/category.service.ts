import { environment } from '@admin-env/environment';
import { CategoriesData, ApiResponse, Category, ProductsPagingInteface, ClassificationsResponse, Data } from '@admin-features/products/interfaces/products.interface';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: CustomHttpClient) { }
  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }
  getCategoryById(id: number): Observable<Data<CategoriesData>> {
    return this._http.get<Data<CategoriesData>>(`/api/Categories/${id}`);
  }
  getAllCategories(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<Category>>(`${environment.URL_API}Categories?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`);
  }
  deleteCategory(id: number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(`${environment.URL_API}Categories/${id}`);
  }

  addCategory(formData:any) {
    return this._http.post(`${environment.URL_API}Categories`, formData);
  }
  editCategory(formData:any) {
    return this._http.put(`${environment.URL_API}Categories`, formData);
  }
}
