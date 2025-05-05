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
  fileToUpload: File | null = null;

  viewExpandedVisitIds = new Set<string>();

  addFormVisitIds = new Set<string>();
 


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


  onToggleViewAttachments(visitId: string) {
    if (this.viewExpandedVisitIds.has(visitId)) {
      this.viewExpandedVisitIds.delete(visitId);
    } else {
      this.viewExpandedVisitIds.add(visitId);
      this.addFormVisitIds.delete(visitId);
    }
  }


  onToggleAddForm(visitId: string) {
    if (this.addFormVisitIds.has(visitId)) {
      this.addFormVisitIds.delete(visitId);
      this.fileToUpload = null;
    } else {
      this.addFormVisitIds.add(visitId);
      this.viewExpandedVisitIds.delete(visitId);

    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileToUpload = input.files[0];
    }
  }

  onSubmitAttachment(visitId: string) {
    if (!this.fileToUpload) return;
    const fd = new FormData();
    fd.append('visitId', visitId);
    fd.append('file', this.fileToUpload);
    fd.append('description', 'added from calendar');

    this.patientService.addAttachment(fd).subscribe({
      next: () => {
        this.loadPatientVisits()
        this.addFormVisitIds.delete(visitId)
      },
      error: err => console.error('Ошибка загрузки вложения', err)
    });
  }
}

