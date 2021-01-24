import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VietnameseService {

  constructor(private http: HttpClient) {
  }

  getVietnamese(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/vietnamese/${id}`);
  }

  createVietnamese(vietnamese: object): Observable<object> {
    console.log(vietnamese);
    return this.http.post(environment.apiUrl + '/vietnamese', vietnamese);
  }

  updateVietnamese(id: number, value: any): Observable<object> {
    return this.http.put(environment.apiUrl + `/vietnamese/${id}`, value);
  }

  deleteVietnamese(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/vietnamese/${id}`);
  }

  getVietnamesesList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/vietnamese');
  }

  getVietnamesesByName(name: string): Observable<any> {
    return this.http.post(environment.apiUrl + `/vietnamese/search/`, name);
  }
}
