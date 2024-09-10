import { environment } from '@admin-env/environment';
import { ApiResponse, ClassificationsResponse, Data, ProductsPagingInteface, UnitData } from '@admin-features/products/interfaces/products.interface';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private _http: CustomHttpClient) { }

  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }
  getAllUnits(pageSize: number,pageNumber: number,keyword: string){
    return this._http.get<ApiResponse<UnitData>>(`${environment.URL_API}Units?PageSize=${pageSize}&PageNumber=${pageNumber}&Keyword=${keyword}`);
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
}
