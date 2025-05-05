import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { VisitCardComponent } from '../../common-ui/visit-card/visit-card.component';
import { DoctorService } from '../../data/services/doctor.service';
import { VisitDateResponse } from '../../data/interfaces/visitDateResponse.interface';
import { CalendarComponent } from '../../common-ui/calendar/calendar.component';
import { AddVisitComponent } from "../../common-ui/add-visit/add-visit.component";
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { PatientVisitCardComponent } from '../../common-ui/patient-visit-card/patient-visit-card.component';
import { PatientVisitDetailsResponse } from '../../data/interfaces/PatientVisitDetailsResponse.interface';
import { PatientService } from '../../data/services/patient.sevice';
import { AttachmentComponent } from "../../common-ui/attachment/attachment.component";

@Component({
  selector: 'app-calendar-page',
  imports: [VisitCardComponent, CalendarComponent, AddVisitComponent, PatientVisitCardComponent, AttachmentComponent],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent  implements OnInit{

  @ViewChild(CalendarComponent)
  calendarComponent!: CalendarComponent;

  me!: DecodedToken;

  isPatient = false;

  selectedDate: string | undefined;
  visitsByDay: VisitDateResponse[] = [];
  patientVisitsByDay: PatientVisitDetailsResponse[] = [];


  doctorService = inject(DoctorService);
  cookieService = inject(CookieService);
  patientService = inject(PatientService);

  expandedVisitIds = new Set<string>();




  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
        this.isPatient = this.me.roles.includes('PATIENT');
      } catch {
        console.error('Ошибка декодирования токена');
      }
    }
  }

  onDaySelected(date: string) {
    this.selectedDate = date;
    if (this.isPatient) {
      this.loadPatientVisits();
    } else {
      this.loadDoctorVisits();
    }
  }

  refreshVisits(): void {
    if (!this.isPatient) {
      this.loadDoctorVisits();
      if (this.calendarComponent) {
        this.calendarComponent.loadVisits();
      }
    }
  }

  private loadDoctorVisits() {
    if (!this.selectedDate) return;
    this.doctorService.getDoctorVisitsByDay(this.selectedDate)
      .subscribe((visits: VisitDateResponse[]) => {
        this.visitsByDay = visits.sort((a, b) =>
          new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
        );
      });
  }

  private loadPatientVisits() {
    if (!this.selectedDate) return;
    this.patientService.getPatientVisits(this.me.id)
      .subscribe((visits: PatientVisitDetailsResponse[]) => {
        this.patientVisitsByDay = visits
          .filter(v => new Date(v.visitDate).toLocaleDateString('en-CA') === this.selectedDate)
          .sort((a, b) =>
            new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
          );
      });
  }


  onToggleAttachments(visitId: string) {
    if (this.expandedVisitIds.has(visitId)) {
      this.expandedVisitIds.delete(visitId);
    } else {
      this.expandedVisitIds.add(visitId);
    }
  }
}
