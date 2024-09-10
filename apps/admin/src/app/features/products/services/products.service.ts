import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import {ApiResponse, CategoriesData,Brand,BrandData,BransResponse,Category,Classification,ClassificationsResponse, Data, ProductsPagingInteface, UnitData,PaginationParams,ProductParams,ProductsPagingInteface,TagData,UnitData,} from '../interfaces/products.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { buildQueryParams } from '../helpers/helpers';
import { variantParam, variantsData, variantsResponse } from '../interfaces/variants.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private _http: CustomHttpClient, private http: HttpClient) {}

  getProducts(page: ProductParams) {
    const queryParams = buildQueryParams({
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
    return this._http.get<{ data: { result: Category[] } }>(`${environment.URL_API}Categories`)
      .pipe(map(res => res.data.result || []));
  }

  getClassifications(): Observable<Classification[]> {
    return this._http.get<{ data: { classifications: Classification[] } }>(`${environment.URL_API}Classifications`)
      .pipe(map(res => res.data.classifications || []));
  }

  getAllBrands(pageSize: any, pageNumber: any): Observable<Brand[]> {
    return this._http.get<{ data: { result: Brand[] } }>(`${environment.URL_API}Brands?PageSize=${pageSize}&PageNumber=${pageNumber}`)
      .pipe(map(res => res.data.result || []));
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

  getAllTags(page: ProductParams) {
    return this._http.get<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Tags?TagTypeIds=2&PageSize=${page.pageSize}&PageNumber=${page.pageNumber}`
    );
  }

  deleteTags(id: string | number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Tags/${id}`
    );
  }

  addTags(formData: any) {
    return this._http.post<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Tags`,
      formData
    );
  }

  editTags(formData: any) {
    return this._http.put<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Tags`,
      formData
    );
  }
  getTagsById(id: number): Observable<ApiResponse<TagData>> {
    return this._http.get<ApiResponse<TagData>>(`/api/Tags/${id}`);
  }

 
}
