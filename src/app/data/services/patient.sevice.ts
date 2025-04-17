import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Patient } from '../interfaces/patient.inerface';
import { Observable } from 'rxjs';
import { PatientVisitDetailsResponse } from '../interfaces/PatientVisitDetailsResponse.interface';
import { PatientProfile } from '../interfaces/PatientProfile.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  http: HttpClient = inject(HttpClient)
  baseApiUrl = 'https://localhost:8888/api/patients/'



  getPatientVisits(id?: string): Observable<PatientVisitDetailsResponse[]> {
    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }
    return this.http.get<PatientVisitDetailsResponse[]>(
      `${this.baseApiUrl}get-patient-visits`,
      { params }
    );
  }

  getPatientProfile(id?: string): Observable<PatientProfile> {
    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }
    return this.http.get<PatientProfile>(
      `${this.baseApiUrl}profile`,
      { params }
    );
  }
}