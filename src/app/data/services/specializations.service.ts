import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {
  http: HttpClient = inject(HttpClient)
  baseApiUrl = 'https://localhost:8888/'



  getSpecializationsList() {
      return this.http.get<string[]>(`${this.baseApiUrl}api/specializations`)
    }
}
