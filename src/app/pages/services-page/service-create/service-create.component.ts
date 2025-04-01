import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../../data/services/doctor.service';

@Component({
  selector: 'app-service-create',
  imports: [ReactiveFormsModule],
  templateUrl: './service-create.component.html',
  styleUrl: './service-create.component.scss'
})
export class ServiceCreateComponent {
  fb = inject(FormBuilder)
  doctorService = inject(DoctorService)

  @Output() serviceCreated = new EventEmitter<void>();


  addServiceForm = this.fb.group({
    name: [''],
    price: [''],
  })


  onSubmit(){
    if (this.addServiceForm.valid){
      //@ts-ignore
      this.doctorService.createService(this.addServiceForm.value).subscribe(() => {
        this.serviceCreated.emit();
        this.addServiceForm.reset();
      });
    }
  }
}
