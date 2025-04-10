import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../data/services/doctor.service';
import { Patient } from '../../data/interfaces/patient.inerface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-visit',
  imports: [ReactiveFormsModule],
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.scss'
})
export class AddVisitComponent {

  doctorService = inject(DoctorService)
  patients = toSignal(this.doctorService.getDoctorPatients(), { initialValue: [] as Patient[] })
  @Output() visitCreated = new EventEmitter<void>();


  form = new FormGroup({
    patientId: new FormControl<string | null>(null, Validators.required),
    visitDate: new FormControl<string | null>(null, Validators.required),
    notes: new FormControl<string | null>(null, Validators.required),
  })
   
  onSubmit(): void {
    // Проверка заполненности формы
    if (!this.form.valid) {
      console.warn('Форма невалидна!');
      return;
    }

    const { patientId, visitDate, notes } = this.form.value;
    if (!patientId || !visitDate || !notes) {
      console.warn('Не все поля заполнены!');
      return;
    }

    const payload = {
      patientId: patientId,
      visitDate: visitDate,
      notes: notes,
      force: false 
    };

    this.doctorService.createVisit(payload).subscribe({
      next: () => {
        this.visitCreated.emit();
      },
      error: (err) => {
        console.error('Ошибка при создании визита:', err);
      }
    });
  }
}
