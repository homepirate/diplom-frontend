import { Component, Input } from '@angular/core';
import { Patient } from '../../data/interfaces/patient.inerface';

@Component({
  selector: 'app-patient-card',
  imports: [],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss'
})
export class PatientCardComponent {
  @Input() patient!: Patient;


}
