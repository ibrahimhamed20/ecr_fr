import { environment } from '@admin-env/environment';
import { ApiResponse, ClassificationsResponse, ProductsPagingInteface } from '@admin-features/products/interfaces';
import { TagsParam, TagsData } from '@admin-features/products/interfaces/tags.interface';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private _http: CustomHttpClient) { }

  getClassifications(): Observable<ClassificationsResponse> {
    return this._http.get<ClassificationsResponse>(`${environment.URL_API}Classifications`);
  }
  getAllTags(page: TagsParam) {
    return this._http.get<{ data: ProductsPagingInteface }>(
      `${environment.URL_API}Tags?TagTypeIds=2&PageSize=${page.size}&PageNumber=${page.number}`
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
  getTagsById(id: number): Observable<ApiResponse<TagsData>> {
    return this._http.get<ApiResponse<TagsData>>(`/api/Tags/${id}`);
  }
}
