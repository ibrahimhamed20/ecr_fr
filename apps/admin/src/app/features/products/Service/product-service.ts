import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@admin-env/environment';
import {
  ProductPagingInteface,
  ProductParams,
} from '../interfaces/product.interface';
import { map, Observable } from 'rxjs';
import { Classification, Brand, Category } from '@admin-features/products/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/api/Products';

  constructor(private _http: HttpClient) { }

  // { size: number, number: number,ClassificationId?:number,Keyword?:string, BrandId?:number  }
  // getProducts(page: ProductParams) {
  //   return this._http.get<{ data: any }>(
  //     // &BrandId=${page.BrandId}&CategoryId=${page.CategoryId}
  //     `${environment.URL_API}Products?Pagination.PageSize=${page.pageSize}&Pagination.PageNumber=${page.pageNumber}&ClassificationId=${page.ClassificationId}&Keyword=${page.Keyword}`
  //   );
  // }
  getProducts(page: ProductParams) {
    let queryParams = `Pagination.PageSize=${page.pageSize}&Pagination.PageNumber=${page.pageNumber}`;

    if (page.ClassificationId) {
      queryParams += `&ClassificationId=${page.ClassificationId}`;
    }

    if (page.Keyword) {
      queryParams += `&Keyword=${page.Keyword}`;
    }

    if (page.BrandId) {
      queryParams += `&BrandId=${page.BrandId}`;
    }
    if (page.CategoryId) {
      queryParams += `&CategoryId=${page.CategoryId}`;
    }

    return this._http.get<{ data: any }>(
      `${environment.URL_API}Products?${queryParams}`
    );
  }



  deleteProduct(id?: number) {
    return this._http.delete(`${environment.URL_API}Products/${id}`);
  }




  getCountries() {
    return this._http.get(`${environment.URL_API}Addresses/country`);
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


  getCountry() {
    return this._http.get(`${environment.URL_API}Addresses/country`);

  }

  getTags() {
    return this._http.get(`${environment.URL_API}Tags`);
  }

  downloadProdctsAsCsv() {
    return this._http.get(`${environment.URL_API}Products/export/csv`, {
      responseType: "blob",
    });
  }
}
