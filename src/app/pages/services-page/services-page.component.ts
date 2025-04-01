import { Component, inject, signal } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { ServiceCardComponent } from '../../common-ui/service-card/service-card.component';
import { Service } from '../../data/interfaces/service.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiceCreateComponent } from './service-create/service-create.component';

@Component({
  selector: 'app-services-page',
  imports: [ServiceCardComponent, ServiceCreateComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {

  doctorService = inject(DoctorService)
  services = signal<Service[]>([]);

  constructor(){
    this.loadServices();
  }

  loadServices() {
    this.doctorService.getDoctorServices().subscribe((data: Service[]) => {
      this.services.set(data);
    });
  }

  // Метод, вызываемый из дочернего компонента для обновления списка
  refreshServices() {
    this.loadServices();
  }
}
