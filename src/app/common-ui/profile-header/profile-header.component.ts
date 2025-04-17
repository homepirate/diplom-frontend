import { Component, Input, input } from '@angular/core';
import { PatientProfile } from '../../data/interfaces/PatientProfile.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {

  @Input() profile!: PatientProfile;

}
