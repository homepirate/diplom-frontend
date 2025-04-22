import { Component, Input } from '@angular/core';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { DatePipe } from '@angular/common';
import { PatientVisitDetailsResponse } from '../../data/interfaces/PatientVisitDetailsResponse.interface';

@Component({
  selector: 'app-visit-card',
  imports: [DatePipe],
  templateUrl: './visit-card.component.html',
  styleUrl: './visit-card.component.scss'
})
export class VisitCardComponent {

  @Input() visit!: VisitDateResponse | PatientVisitDetailsResponse;
  @Input() hidePatient: boolean = false;

  isVisitDateResponse(v: VisitDateResponse | PatientVisitDetailsResponse): v is VisitDateResponse {
    return (v as VisitDateResponse).patientName !== undefined;
  }

  isPatientVisitDetailsResponse(v: VisitDateResponse | PatientVisitDetailsResponse): v is PatientVisitDetailsResponse {
    return (v as PatientVisitDetailsResponse).attachmentUrls !== undefined;
  }


  onViewAttachments(){

  }
}
