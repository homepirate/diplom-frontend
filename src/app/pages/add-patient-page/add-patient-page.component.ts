import { Component, inject } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient-page',
  imports: [ReactiveFormsModule],
  templateUrl: './add-patient-page.component.html',
  styleUrl: './add-patient-page.component.scss'
})
export class AddPatientPageComponent {

  doctorService = inject(DoctorService)
  router = inject(Router)


  form = new FormGroup({
    fullName: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required),
    birthDate: new FormControl<string | null>(null, Validators.required),
  })

  onSubmit(): void {
    const { fullName, phone, birthDate } = this.form.value;
    if (!this.form.valid || !fullName || !phone || !birthDate) {
      console.warn('Не все поля заполнены!');
      return;
    }
  
    const payload = {
      fullName: fullName,
      phone: phone,
      birthDate: birthDate
    };
  
    this.doctorService.addPatient(payload).subscribe({
      next: () => {
        this.router.navigate(['patients']);
      },
      error: (err) => {
        console.error('Ошибка при добавлении пациента:', err);
      }
    });
  }

}
