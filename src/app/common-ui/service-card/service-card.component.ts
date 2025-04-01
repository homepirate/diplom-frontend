import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Service } from '../../data/interfaces/service.interface';
import { DoctorService } from '../../data/services/doctor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-card',
  imports: [FormsModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Output() priceUpdated = new EventEmitter<void>();


  doctorService = inject(DoctorService)

  editing: boolean = false;
  newPrice: number = 0;


  toggleEdit() {
    if (this.editing) {
      this.editing = false;
    } else {
      this.editing = true;
      this.newPrice = this.service.price;
    }
  }

  submitPrice() {
    const payload = { name: this.service.name, price: this.newPrice.toString() };
    this.doctorService.updatePriceService(payload).subscribe(() => {
      this.editing = false;
      this.priceUpdated.emit();
    });
  }


}
