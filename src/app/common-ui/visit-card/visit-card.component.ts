import { Component, Input } from '@angular/core';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-card',
  imports: [DatePipe],
  templateUrl: './visit-card.component.html',
  styleUrl: './visit-card.component.scss'
})
export class VisitCardComponent {

  @Input() visit!: VisitDateResponse;


}
