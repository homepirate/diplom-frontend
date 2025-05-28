import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { CalendarDay } from '../../data/interfaces/calendarDay.interface';
import { DatePipe, NgClass } from '@angular/common';
import { PatientService } from '../../data/services/patient.sevice';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken } from '../../auth/auth.interface';
import { jwtDecode } from 'jwt-decode';
import { PatientVisitDetailsResponse } from '../../data/interfaces/PatientVisitDetailsResponse.interface';

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
  selectedDay: string | null = null;

  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);
  private cookieService = inject(CookieService);

  private me!: DecodedToken;
  isPatient = false;

  ngOnInit(): void {
    // Декодируем токен и определяем роль
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
        this.isPatient = this.me.roles.includes('PATIENT');
      } catch {
        console.error('Не удалось декодировать токен');
      }
    }

    // Инициализируем месяц/год и загружаем визиты
    const now = new Date();
    this.currentMonth = now.getMonth() + 1;
    this.currentYear = now.getFullYear();
    this.loadVisits();
  }

  loadVisits(): void {
    const dayMap: Record<string, number> = {};
    const callback = () => this.buildCalendar(dayMap);

    if (this.isPatient) {
      // Для пациента — один запрос всех его визитов
      this.patientService.getPatientVisits(this.me.id).subscribe({
        next: (visits: PatientVisitDetailsResponse[]) => {
          visits.forEach(v => {
            const dateStr = new Date(v.visitDate).toLocaleDateString('en-CA');
            dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;
          });
          callback();
        },
        error: err => console.error('Ошибка загрузки визитов пациента', err)
      });
    } else {
      // Для доктора — запрос по месяцу/году
      this.doctorService.getDoctorVisits(this.currentMonth, this.currentYear)
        .subscribe({
          next: (visits: VisitDateResponse[]) => {
            visits.forEach(v => {
              const dateStr = new Date(v.visitDate).toLocaleDateString('en-CA');
              dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;
            });
            callback();
          },
          error: err => console.error('Ошибка загрузки визитов доктора', err)
        });
    }
  }

  private buildCalendar(dayMap: Record<string, number>) {
    const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    this.days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.currentYear, this.currentMonth - 1, d);
      const dateStr = date.toLocaleDateString('en-CA');
      this.days.push({
        date: dateStr,
        visitsCount: dayMap[dateStr] || 0
      });
    }
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
    this.selectedDay = null;
    this.loadVisits();
  }

  nextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDay = null;
    this.loadVisits();
  }
}
