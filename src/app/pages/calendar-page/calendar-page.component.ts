import { Component, inject, ViewChild } from '@angular/core';
import { VisitCardComponent } from '../../common-ui/visit-card/visit-card.component';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { CalendarComponent } from '../../common-ui/calendar/calendar.component';
import { AddVisitComponent } from "../../common-ui/add-visit/add-visit.component";

@Component({
  selector: 'app-calendar-page',
  imports: [VisitCardComponent, CalendarComponent, AddVisitComponent],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {

  @ViewChild(CalendarComponent)
  calendarComponent!: CalendarComponent;
  
  selectedDate: string | undefined;
  visitsByDay: VisitDateResponse[] = [];

  doctorService = inject(DoctorService)

  onDaySelected(date: string) {
    this.selectedDate = date;
    this.loadVisits();
  }

  refreshVisits(): void {
    this.loadVisits();
    if (this.calendarComponent) {
      this.calendarComponent.loadVisits();
    }
  }

  loadVisits() {
    if (this.selectedDate) {
      this.doctorService.getDoctorVisitsByDay(this.selectedDate)
        .subscribe((visits: VisitDateResponse[]) => {
          // Сортировка массива по дате визита (от ранней к поздней)
          this.visitsByDay = visits.sort((a, b) => {
            const dateA = new Date(a.visitDate);
            const dateB = new Date(b.visitDate);
            return dateA.getTime() - dateB.getTime();
          });
        });
    }
  }
}
