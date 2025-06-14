import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Service } from '../interfaces/service.interface';
import { Patient } from '../interfaces/patient.inerface';
import { VisitDateResponse } from '../interfaces/visitDateResponse.interface';
import { Observable } from 'rxjs';
import { ServiceUpdateRequest } from '../interfaces/ServiceUpdateRequest.interface';
import { StatusResponse } from '../interfaces/status-response.interface';

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

  createVisit(payload: {patientId: string, visitDate: string, notes: string, force: boolean}){
    return this.http.post<Object>(`${this.baseApiUrl}visits`, payload)
  }

  addPatient(payload: {fullName: string, phone: string, birthDate: string}){
    return this.http.post<Object>(`${this.baseApiUrl}add-patient`, payload)
  }

  updatePriceService(payload: {name: string, price: string}){
    return this.http.put<Object>(`${this.baseApiUrl}services/update-price`, payload)
  }

  getDoctorVisits(month: number, year: number): Observable<VisitDateResponse[]> {
    return this.http.get<VisitDateResponse[]>(`${this.baseApiUrl}visits/dates?month=${month}&year=${year}`);
  }

  getDoctorVisitsByDay(date: string): Observable<VisitDateResponse[]> {
    return this.http.get<VisitDateResponse[]>(`${this.baseApiUrl}visits/day?date=${date}`);
  }

  getFinancialDashboardReport(payload: { startDate: string; endDate: string }): Observable<Blob> {
    return this.http.post(`${this.baseApiUrl}report`, payload, { responseType: 'blob' });
  }

  finishVisit(request: {
    id: string;
    services: ServiceUpdateRequest[];
    notes: string;
  }): Observable<StatusResponse> {
    return this.http.put<StatusResponse>(
      `${this.baseApiUrl}visits/finish`,
      request
    );
  }

  cancelVisit(id: string): Observable<StatusResponse> {
    return this.http.delete<StatusResponse>(
      `${this.baseApiUrl}visits/cancel`,
      { params: { id } }
    );
  }

  rearrangeVisit(payload: {visitId: string;  newVisitDate: string;  force: boolean;}){
    return this.http.put<StatusResponse>(`${this.baseApiUrl}visits/rearrange`,
      payload
    )
  }

}
