import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { ApiResponse, CategoriesData, Category, ClassificationsResponse, Data, ProductsPagingInteface, UnitData } from '../interfaces/products.interface';
import { Observable } from 'rxjs';
import { variantParam, variantsData, variantsResponse } from '../interfaces/variants.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _http: CustomHttpClient) { }

  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }

  getAllUnits(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<UnitData>>(`${environment.URL_API}Units?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`);
  }
  deleteUnit(id:string | number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(`${environment.URL_API}Units/${id}`);
  }

  addUnit(formData:any) {
    return this._http.post<{ data: ProductsPagingInteface }>(`${environment.URL_API}Units`, formData);
  }
  editUnit(formData:any) {
    return this._http.put<{ data: ProductsPagingInteface }>(`${environment.URL_API}Units`, formData);
  }
  getUnitById(id: number): Observable<Data<UnitData>> {
    return this._http.get<Data<UnitData>>(`/api/units/${id}`);
  }
  getCategoryById(id: number): Observable<Data<CategoriesData>> {
    return this._http.get<Data<CategoriesData>>(`/api/Categories/${id}`);
  }
  getAllCategories(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<Category>>(`${environment.URL_API}Categories?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`);
  }
  getAllProductCatalog(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<Category>>(`${environment.URL_API}Classifications/catalog?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`);
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
  private blobStoreUrl = `${environment.URL_API}BlobsStore/file`;
  public uploadGalaryImage(formData: FormData): Observable<any> {
    return this._http.post(this.blobStoreUrl, formData);
  }

  getAllVariants(page: variantParam ){
    return this._http.get<{ data: ProductsPagingInteface }>(`${environment.URL_API}Variants?PageSize=${page.size}&PageNumber=${page.number}`);
  }
 
  getVariantById(id: number): Observable<Data<variantsData>> {
    return this._http.get<Data<variantsData>>(`${environment.URL_API}Variants/${id}/Details`);
  }
  editVariant(formData: any ) {
    return this._http.put(`${environment.URL_API}Variants`, formData);
  }
  addVariant(formData: any) {
    return this._http.post(`${environment.URL_API}Variants`, formData);
  }
  addVariantValue(formData:any) {
    return this._http.post(`${environment.URL_API}Variants/variantValues`, formData);
  }
  searchVariants(keyword: any): Observable<any> {
    return this._http.get(`${environment.URL_API}Variants/name?name=${keyword}`);
  }

  deleteVariant(id:string | number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(`${environment.URL_API}Variants/${id}`);
  }

}

