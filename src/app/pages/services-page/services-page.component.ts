import { Component, inject } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { ServiceCardComponent } from '../../common-ui/service-card/service-card.component';
import { Service } from '../../data/interfaces/service.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-services-page',
  imports: [ServiceCardComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {

  doctorService = inject(DoctorService)
  services = toSignal(this.doctorService.getDoctorServices(), { initialValue: [] as Service[] });

}
