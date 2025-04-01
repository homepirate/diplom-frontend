import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Service } from '../interfaces/service.interface';
import { Patient } from '../interfaces/patient.inerface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  http: HttpClient = inject(HttpClient)
  baseApiUrl = 'https://localhost:8888/api/doctors/'


  getDoctorServices() {
    return this.http.get<Service[]>(`${this.baseApiUrl}services`);
  }

  getDoctorPatients(){
    return this.http.get<Patient[]>(`${this.baseApiUrl}patients`);
  }

  createService(payload: {name: string, price: string}){
    return this.http.post<Object>(`${this.baseApiUrl}services`, payload)
  }

  updatePriceService(payload: {name: string, price: string}){
    return this.http.put<Object>(`${this.baseApiUrl}services/update-price`, payload)
  }
}
