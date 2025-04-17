import { Component, Input } from '@angular/core';
import { Patient } from '../../data/interfaces/patient.inerface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-card',
  imports: [RouterLink],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss'
})
export class PatientCardComponent {
  @Input() patient!: Patient;


}
