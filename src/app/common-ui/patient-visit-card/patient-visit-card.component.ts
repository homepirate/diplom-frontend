import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatientVisitDetailsResponse } from '../../data/interfaces/PatientVisitDetailsResponse.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-visit-card',
  imports: [DatePipe],
  templateUrl: './patient-visit-card.component.html',
  styleUrl: './patient-visit-card.component.scss'
})
export class PatientVisitCardComponent {

  @Input() visit!: PatientVisitDetailsResponse;
  @Output() viewAttachments = new EventEmitter<void>();
  @Output() loadAttachment = new EventEmitter<void>()


  onViewAttachments() {
    this.viewAttachments.emit();
  }

  onLoadAttachment() {
    this.loadAttachment.emit()
  }


}
