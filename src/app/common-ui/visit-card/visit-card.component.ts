import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() viewAttachments = new EventEmitter<void>();
  @Output() startFinish = new EventEmitter<void>();
  @Output() rerrange = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  private today = new Date(new Date().toDateString());


  get canCancel(): boolean {
    if (!this.visit?.visitDate) return false;
    const visitDate = new Date(this.visit.visitDate);
    return !this.visit.isFinished && visitDate > this.today;
  }

  isVisitDateResponse(v: VisitDateResponse | PatientVisitDetailsResponse): v is VisitDateResponse {
    return (v as VisitDateResponse).patientName !== undefined;
  }

  isPatientVisitDetailsResponse(v: VisitDateResponse | PatientVisitDetailsResponse): v is PatientVisitDetailsResponse {
    return (v as PatientVisitDetailsResponse).attachmentUrls !== undefined;
  }


  onViewAttachments() {
    if (this.isPatientVisitDetailsResponse(this.visit)){
        console.log(this.visit.attachmentUrls)
    }
    this.viewAttachments.emit();
  }

  endVisit(){
    this.startFinish.emit();
  }

  onCancel()  { 
    this.cancel.emit(); 
  }

  rerrangeVisit(){
    this.rerrange.emit();
  }


}
