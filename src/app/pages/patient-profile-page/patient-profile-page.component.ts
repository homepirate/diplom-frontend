import { Component, inject, OnInit } from '@angular/core';
import { AddVisitComponent } from "../../common-ui/add-visit/add-visit.component";
import { ActivatedRoute } from '@angular/router';
import { PatientProfile } from '../../data/interfaces/PatientProfile.interface';
import { PatientService } from '../../data/services/patient.sevice';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { VisitCardComponent } from '../../common-ui/visit-card/visit-card.component';
import { PatientVisitDetailsResponse } from '../../data/interfaces/PatientVisitDetailsResponse.interface';
import { AttachmentComponent } from '../../common-ui/attachment/attachment.component';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { ServiceUpdateRequest } from '../../data/interfaces/ServiceUpdateRequest.interface';
import { StatusResponse } from '../../data/interfaces/status-response.interface';
import { FormsModule } from '@angular/forms';
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-patient-profile-page',
  imports: [AddVisitComponent, AsyncPipe, ProfileHeaderComponent, VisitCardComponent, AttachmentComponent, FormsModule],
  templateUrl: './patient-profile-page.component.html',
  styleUrl: './patient-profile-page.component.scss'
})
export class PatientProfilePageComponent  implements OnInit{
  patientId!: string;
  patient$!: Observable<PatientProfile>;
  visits: PatientVisitDetailsResponse[] = [];
  attachmentUrls: string[] = [];

  expandedVisitIds = new Set<string>();
  private me!: DecodedToken;



  serviceList: { name: string; price: number }[] = [];
  finishFormVisitId: string | null = null;
  quantities: Record<string, number> = {};
  finishNotes = '';


  route = inject(ActivatedRoute)
  patientService = inject(PatientService)
  doctorService = inject(DoctorService)
  cookieService = inject(CookieService)


  onToggleAttachments(visitId: string) {
    if (this.expandedVisitIds.has(visitId)) {
      this.expandedVisitIds.delete(visitId);
    } else {
      this.expandedVisitIds.add(visitId);
      this.finishFormVisitId = null
    }
  }
  
  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patient$ = this.patientService.getPatientProfile(this.patientId)
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
      } catch {
        console.error('Не удалось декодировать токен');
      }
    }
    this.loadVisits();

    this.doctorService.getDoctorServices().subscribe(list => {
      this.serviceList = list;
      for (const s of list) this.quantities[s.name] = 0;
    });
  }
  onVisitCreated(){
    this.loadVisits();
  }

  onStartFinish(visit: PatientVisitDetailsResponse | VisitDateResponse) {
    if (this.finishFormVisitId === visit.visitId) {
      this.finishFormVisitId = null;
    } else {
      this.expandedVisitIds.delete(visit.visitId);
      this.finishFormVisitId = visit.visitId;
      this.finishNotes = visit.notes;
    }
  }

  private loadVisits() {
    this.patientService.getPatientVisits(this.patientId)
      .subscribe({
        next: visits => {
          if (this.me?.fullName) {
            this.visits = visits.filter(v => v.doctorName === this.me.fullName);
          } else {
            this.visits = visits;
          }
        },
        error: err => console.error('Ошибка при загрузке визитов', err)
      });
  }

  onSubmitFinish(visitId: string) {
    const servicesPayload: ServiceUpdateRequest[] = Object.entries(this.quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => ({ name, quantity: qty }));

    this.doctorService.finishVisit({
      id: visitId,
      services: servicesPayload,
      notes: this.finishNotes
    }).subscribe({
      next: (res: StatusResponse) => {
        this.finishFormVisitId = null;
        this.loadVisits();
      },
      error: err => console.error('Не удалось завершить визит', err)
    });
  }


  onCancelVisit(visitId: string) {
    this.doctorService.cancelVisit(visitId).subscribe({
      next: (res: StatusResponse) => {
        this.loadVisits();
      },
      error: err => console.error('Не удалось отменить визит', err)
    });
  }
}
