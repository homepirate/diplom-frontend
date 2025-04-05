import { Component, inject } from '@angular/core';
import { VisitCardComponent } from '../../common-ui/visit-card/visit-card.component';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { CalendarComponent } from '../../common-ui/calendar/calendar.component';

@Component({
  selector: 'app-calendar-page',
  imports: [VisitCardComponent, CalendarComponent],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  selectedDate: string | undefined;
  visitsByDay: VisitDateResponse[] = [];

  doctorService = inject(DoctorService)

  onDaySelected(date: string) {
    this.selectedDate = date;
    this.loadVisits();
  }

  loadVisits() {
    if (this.selectedDate) {
      this.doctorService.getDoctorVisitsByDay(this.selectedDate)
        .subscribe((visits: VisitDateResponse[]) => {
          this.visitsByDay = visits;
        });
    }
  }
}
