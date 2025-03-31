import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DoctorService } from '../../data/services/doctor.service';
import { Patient } from '../../data/interfaces/patient.inerface';
import { PatientCardComponent } from "../../common-ui/patient-card/patient-card.component";

@Component({
  selector: 'app-patients-page',
  imports: [PatientCardComponent],
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.scss'
})
export class PatientsPageComponent {

  doctorService = inject(DoctorService)
  patients = toSignal(this.doctorService.getDoctorPatients(), { initialValue: [] as Patient[] });

}
