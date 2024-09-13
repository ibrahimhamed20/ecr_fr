import { environment } from '@admin-env/environment';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';
import { Classification } from '../interfaces/product.interface';
import { ClassificationsResponse, Data, ProductsPagingInteface } from '../interfaces/products.interface';
import { ClassificationsData, ClassificationsParam } from '../interfaces/classifications.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassificationsService {

  constructor(private _http: CustomHttpClient) {

   }
   
  deleteClassification(id:number) {
    return this._http.delete<ClassificationsResponse>(`${environment.URL_API}Classifications/${id}`);
  }

  addClassification(formData:Classification) {
    return this._http.post(`${environment.URL_API}Classifications`, formData);
  }
  editClassification(formData:Classification) {
    return this._http.put(`${environment.URL_API}Classifications`, formData);
  }
  
  getAllClassifications(page: ClassificationsParam ){
    return this._http.get<{ data: ProductsPagingInteface }>(`${environment.URL_API}Classifications?PageSize=${page.size}&PageNumber=${page.number}`);
  }
  getClassificationById(id: number): Observable<Data<ClassificationsData>> {
    return this._http.get<Data<ClassificationsData>>(`${environment.URL_API}Classifications/${id}`);
  }

  public uploadGalaryImage(image:any): Observable<any> {
    let fd = new FormData();
    fd.append('file', image);
    return this._http.post<any>(`${environment.URL_API}BlobsStore/file`, fd);
  }
  getAllMerchantClassification(){
    return this._http.get(`${environment.URL_API}Merchants/Classifications`);

  }
}
