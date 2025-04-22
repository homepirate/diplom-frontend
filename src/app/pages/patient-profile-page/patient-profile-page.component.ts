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

@Component({
  selector: 'app-patient-profile-page',
  imports: [AddVisitComponent, AsyncPipe, ProfileHeaderComponent, VisitCardComponent],
  templateUrl: './patient-profile-page.component.html',
  styleUrl: './patient-profile-page.component.scss'
})
export class PatientProfilePageComponent  implements OnInit{
  patientId!: string;
  patient$!: Observable<PatientProfile>;
  visits: PatientVisitDetailsResponse[] = [];
  attachmentUrls: string[] = [];
  

  route = inject(ActivatedRoute)
  patientService = inject(PatientService)

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patient$ = this.patientService.getPatientProfile(this.patientId)
    this.loadVisits();
  }
  onVisitCreated(){
    this.loadVisits();
  }

  private loadVisits() {
    this.patientService
      .getPatientVisits(this.patientId)
      .subscribe(
        visits => this.visits = visits,
        err => console.error('Ошибка при загрузке визитов', err)
      );
  }

}
