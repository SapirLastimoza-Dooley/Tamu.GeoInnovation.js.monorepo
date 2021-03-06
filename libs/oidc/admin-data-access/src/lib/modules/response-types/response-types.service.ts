import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvironmentService } from '@tamu-gisc/common/ngx/environment';
import { ResponseType } from '@tamu-gisc/oidc/common';

@Injectable({
  providedIn: 'root'
})
export class ResponseTypesService {
  public resource: string;

  constructor(private env: EnvironmentService, private http: HttpClient) {
    this.resource = this.env.value('api_url') + '/client-metadata/response-type';
  }

  public getResponseType(guid: string) {
    return this.http.get<Partial<ResponseType>>(`${this.resource}/${guid}`, {
      withCredentials: true
    });
  }

  public getResponseTypes() {
    return this.http.get<Array<Partial<ResponseType>>>(this.resource, {
      withCredentials: true
    });
  }

  public updateResponseType(updatedResponseType: Partial<ResponseType>) {
    return this.http.patch<Partial<ResponseType>>(`${this.resource}/update`, updatedResponseType, {
      withCredentials: true
    });
  }

  public createResponseType(newResponseType: Partial<ResponseType>) {
    return this.http
      .post<Partial<ResponseType>>(this.resource, newResponseType, {
        withCredentials: true
      })
      .subscribe((newestResponseType) => {
        console.log('Added response type', newestResponseType);
      });
  }

  public deleteResponseType(newResponseType: ResponseType) {
    return this.http.delete<Partial<ResponseType>>(`${this.resource}/delete/${newResponseType.guid}`, {
      withCredentials: true
    });
  }
}
