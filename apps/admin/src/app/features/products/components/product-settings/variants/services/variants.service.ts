import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, ProductsPagingInteface } from '../../../../interfaces/products.interface';
import { variantParam, variantsData } from '../../../../interfaces/variants.interface';
import { CustomHttpClient } from '@shared-utils';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {

  constructor(private _http: CustomHttpClient,) { }
  getAllVariants(page: variantParam) {
    return this._http.get<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Variants?PageSize=${page.size}&PageNumber=${page.number}`
    );
  }

  getVariantById(id: number): Observable<Data<variantsData>> {
    return this._http.get<Data<variantsData>>(
      `${environment.URL_API}Variants/${id}/Details`
    );
  }
  editVariant(formData: any) {
    return this._http.put(`${environment.URL_API}Variants`, formData);
  }
  addVariant(formData: any) {
    return this._http.post(`${environment.URL_API}Variants`, formData);
  }
  addVariantValue(formData: any) {
    return this._http.post(
      `${environment.URL_API}Variants/variantValues`,
      formData
    );
  }
}
