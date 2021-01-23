import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EnglishService {

  constructor(private http: HttpClient) {

  }

  getEnglish(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/english/${id}`);
  }

  createEnglish(english: object): Observable<object> {
    console.log(english);
    return this.http.post(environment.apiUrl + '/english', english);
  }

  updateEnglish(id: number, value: any): Observable<object> {
    return this.http.put(environment.apiUrl + `/english/${id}`, value);
  }

  deleteEnglish(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/english/${id}`);
  }

  getEnglishsList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/english');
  }

  getEnglishsByName(name: string): Observable<any> {
    return this.http.post(environment.apiUrl + `/english/search/`, name);
  }
}
