import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { CalendarDay } from '../../data/interfaces/calendarDay.interface';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [DatePipe, NgClass]
})
export class CalendarComponent implements OnInit {
  @Output() daySelected = new EventEmitter<string>();
  days: CalendarDay[] = [];
  currentMonth!: number;
  currentYear!: number;
  // selectedDay теперь хранит строковое представление выбранной даты
  selectedDay: string | null | CalendarDay = null;

  doctorService = inject(DoctorService)

  ngOnInit(): void {
    const now = new Date();
    this.currentMonth = now.getMonth() + 1;
    this.currentYear = now.getFullYear();
    this.loadVisits();
  }

  loadVisits(): void {
    this.doctorService.getDoctorVisits(this.currentMonth, this.currentYear)
      .subscribe((visits: VisitDateResponse[]) => {
        const dayMap: { [date: string]: number } = {};
        visits.forEach(visit => {
          // Форматируем дату в виде 'YYYY-MM-DD' с использованием локального представления (en-CA)
          const date = new Date(visit.visitDate);
          const dateStr = date.toLocaleDateString('en-CA');
          dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;
        });

        const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
        this.days = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(this.currentYear, this.currentMonth - 1, day);
          const dateStr = date.toLocaleDateString('en-CA');
          this.days.push({
            date: dateStr,
            visitsCount: dayMap[dateStr] || 0
          });
        }
      });
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day.date;
    this.daySelected.emit(day.date);
  }

  prevMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadVisits();
    this.selectedDay = null;
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadVisits();
    this.selectedDay = null;
  }

}