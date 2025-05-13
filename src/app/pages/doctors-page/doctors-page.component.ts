import { Component, inject, OnInit, signal } from '@angular/core';
import { PatientService } from '../../data/services/patient.sevice';
import { Doctor } from '../../data/interfaces/doctor.interface';
import { DoctorCardComponent } from "../../common-ui/doctor-card/doctor-card.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctors-page',
  imports: [DoctorCardComponent, ReactiveFormsModule],
  templateUrl: './doctors-page.component.html',
  styleUrl: './doctors-page.component.scss'
})
export class DoctorsPageComponent implements OnInit{

  fb = inject(FormBuilder);
  patientService = inject(PatientService);

  doctors = signal<Doctor[]>([]);

  addDoctorForm: FormGroup = this.fb.group({
    code: ['', Validators.required]
  });

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.patientService.getPatientDoctors().subscribe({
      next: (list) => this.doctors.set(list),
      error: (err) => console.error('Ошибка загрузки врачей:', err)
    });
  }

  onSubmit() {
    if (this.addDoctorForm.invalid) return;

    const code = this.addDoctorForm.value.code;

    this.patientService.linkDoctor(code).subscribe({
      next: () => {
        this.loadDoctors();
        this.addDoctorForm.reset();
      },
      error: (err) => {
        console.error('Ошибка при добавлении врача:', err);
      }
    });
  }
}