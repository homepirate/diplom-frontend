import { Component, Input } from '@angular/core';
import { Service } from '../../data/interfaces/service.interface';

@Component({
  selector: 'app-service-card',
  imports: [],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() service!: Service;

}
