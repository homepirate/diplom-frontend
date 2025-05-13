import { Component, inject, Input } from '@angular/core';
import { Doctor } from '../../data/interfaces/doctor.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-card',
  imports: [],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.scss'
})
export class DoctorCardComponent {
  @Input() doctor!: Doctor;
  router = inject(Router)

  openChat() {
    this.router.navigate(['/chats'], {
      state: { 
        partnerId: this.doctor.id,
        partnerName: this.doctor.fullName
      }
    });
  }
}
