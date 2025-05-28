import { Component, Input } from '@angular/core';
import { PatientProfile } from '../../data/interfaces/PatientProfile.interface';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {

  @Input() profile!: PatientProfile;

}
