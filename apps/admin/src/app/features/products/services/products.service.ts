import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import {
  ApiResponse,
  CategoriesData,
  Brand,
  Category,
  Data,
  ProductParams,
  ProductsPagingInteface,
  UnitData,
} from '../interfaces/products.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductHelper } from '../helpers/helpers';
import { TagsData, TagsParam } from '../interfaces/tags.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private _http: CustomHttpClient, private http: HttpClient) { }

  getProducts(page: ProductParams) {
    const queryParams = ProductHelper.buildQueryParams({
      'Pagination.PageSize': page.pageSize,
      'Pagination.PageNumber': page.pageNumber,
      ClassificationId: page.ClassificationId,
      Keyword: page.Keyword,
      BrandId: page.BrandId,
      CategoryId: page.CategoryId,
    });
    return this._http.get<{ data: any }>(
      `${environment.URL_API}Products?${queryParams}`
    );
  }

  deleteProduct(id?: number) {
    return this._http.delete(`${environment.URL_API}Products/${id}`);
  }
  getCategories(): Observable<Category[]> {
    return this._http
      .get<{ data: { result: Category[] } }>(`${environment.URL_API}Categories`)
      .pipe(map((res) => res.data.result || []));
  }

  getClassifications(): Observable<any> {
    return this._http.get<any>(`${environment.URL_API}Classifications`);
  }

  getAllBrands(pageSize: any, pageNumber: any): Observable<Brand[]> {
    return this._http
      .get<{ data: { result: Brand[] } }>(
        `${environment.URL_API}Brands?PageSize=${pageSize}&PageNumber=${pageNumber}`
      )
      .pipe(map((res) => res.data.result || []));
  }

  // getCategories() {
  //   return this._http.get(`${environment.URL_API}Categories`);
  // }

  // getAllBrands(pageSize: any, pageNumber: any) {
  //   return this._http.get(
  //     `${environment.URL_API}Brands?PageSize=${pageSize}&PageNumber=${pageNumber}`
  //   );
  // }

  getCountries() {
    return this._http.get(`${environment.URL_API}Addresses/country`);
  }

  getTags() {
    return this._http.get(`${environment.URL_API}Tags`);
  }

  downloadProdctsAsCsv() {
    return this.http.get(`${environment.URL_API}Products/export/csv`, {
      responseType: 'blob',
    });
  }

  // getClassificationsForTag(): Observable<ClassificationsResponse> {
  //   return this._http.get<ClassificationsResponse>(
  //     `${environment.URL_API}Classifications`
  //   );
  // }

  getAllUnits(pageSize: number, pageNumber: number, keyword: string) {
    return this._http.get<ApiResponse<UnitData>>(
      `${environment.URL_API}Units?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`
    );
  }
  deleteUnit(id: string | number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Units/${id}`
    );
  }

  addUnit(formData: any) {
    return this._http.post<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Units`,
      formData
    );
  }
  editUnit(formData: any) {
    return this._http.put<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Units`,
      formData
    );
  }
  getUnitById(id: number): Observable<Data<UnitData>> {
    return this._http.get<Data<UnitData>>(`${environment.URL_API}units/${id}`);
  }
  getCategoryById(id: number): Observable<Data<CategoriesData>> {
    return this._http.get<Data<CategoriesData>>(`${environment.URL_API}Categories/${id}`);
  }
  getAllCategories(pageSize: number, pageNumber: number, keyword: string) {
    return this._http.get<ApiResponse<Category>>(
      `${environment.URL_API}Categories?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`
    );
  }
  getAllProductCatalog(pageSize: number, pageNumber: number, keyword: string) {
    return this._http.get<ApiResponse<Category>>(
      `${environment.URL_API}Classifications/catalog?Pagination.PageSize=${pageSize}&Pagination.PageNumber=${pageNumber}&Keyword=${keyword}`
    );
  }

  deleteCategory(id: number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Categories/${id}`
    );
  }

  addCategory(formData: any) {
    return this._http.post(`${environment.URL_API}Categories`, formData);
  }
  editCategory(formData: any) {
    return this._http.put(`${environment.URL_API}Categories`, formData);
  }
  private blobStoreUrl = `${environment.URL_API}BlobsStore/file`;
  public uploadGalaryImage(formData: FormData): Observable<any> {
    return this._http.post(this.blobStoreUrl, formData);
  }


  searchVariants(keyword: any): Observable<any> {
    return this._http.get(
      `${environment.URL_API}Variants/name?name=${keyword}`
    );
  }

  getProductById(id:number) {
    return this._http.get(`${environment.URL_API}Products/${id}`);
  }
 
}
