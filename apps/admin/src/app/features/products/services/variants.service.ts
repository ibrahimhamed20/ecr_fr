import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Data, ProductsPagingInteface, VariantParam, VariantsData } from '@admin-features/products/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {

  constructor(private _http: CustomHttpClient) { }


  getAll(page: VariantParam) {
    return this._http.get<{ data: ProductsPagingInteface }>(`${environment.URL_API}Variants/name`, page);
  }

  getById(id: number) {
    return this._http.get<Data<VariantsData>>(`${environment.URL_API}Variants/${id}/Details`);
  }

  update(payload: any) {
    return this._http.put(`${environment.URL_API}Variants`, payload);
  }

  create(payload: any) {
    return this._http.post(`${environment.URL_API}Variants`, payload);
  }

  delete(id: number) {
    return this._http.delete<{ data: ProductsPagingInteface }>(`${environment.URL_API}Variants/${id}`);
  }

  addValues(payload: any) {
    return this._http.post(`${environment.URL_API}Variants/variantValues`, payload);
  }
}
