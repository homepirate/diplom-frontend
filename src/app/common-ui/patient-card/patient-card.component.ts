import { Component, inject, Input } from '@angular/core';
import { Patient } from '../../data/interfaces/patient.inerface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-card',
  imports: [RouterLink],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss'
})
export class PatientCardComponent {
  @Input() patient!: Patient;
  router = inject(Router)

  openChat() {
    this.router.navigate(['/chats'], {
      state: { 
        partnerId: this.patient.id,
        partnerName: this.patient.fullName
      }
    });
  }

}
