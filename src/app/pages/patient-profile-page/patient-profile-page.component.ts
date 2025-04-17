import { Component, inject, OnInit } from '@angular/core';
import { AddVisitComponent } from "../../common-ui/add-visit/add-visit.component";
import { ActivatedRoute } from '@angular/router';
import { PatientProfile } from '../../data/interfaces/PatientProfile.interface';
import { PatientService } from '../../data/services/patient.sevice';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';

@Component({
  selector: 'app-patient-profile-page',
  imports: [AddVisitComponent, AsyncPipe, ProfileHeaderComponent],
  templateUrl: './patient-profile-page.component.html',
  styleUrl: './patient-profile-page.component.scss'
})
export class PatientProfilePageComponent  implements OnInit{
  patientId!: string;
  patient$!: Observable<PatientProfile>;

  route = inject(ActivatedRoute)
  patientService = inject(PatientService)

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patient$ = this.patientService.getPatientProfile(this.patientId)
  }
  onVisitCreated(){
  }
}
