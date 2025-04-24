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

@Component({
  selector: 'app-patient-profile-page',
  imports: [AddVisitComponent, AsyncPipe, ProfileHeaderComponent, VisitCardComponent, AttachmentComponent],
  templateUrl: './patient-profile-page.component.html',
  styleUrl: './patient-profile-page.component.scss'
})
export class PatientProfilePageComponent  implements OnInit{
  patientId!: string;
  patient$!: Observable<PatientProfile>;
  visits: PatientVisitDetailsResponse[] = [];
  attachmentUrls: string[] = [];

  expandedVisitIds = new Set<string>();

  onToggleAttachments(visitId: string) {
    if (this.expandedVisitIds.has(visitId)) {
      this.expandedVisitIds.delete(visitId);
    } else {
      this.expandedVisitIds.add(visitId);
    }
  }
  

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
