import { Component, inject } from '@angular/core';
import { PatientService } from '../../data/services/patient.sevice';
import { StatusResponse } from '../../data/interfaces/status-response.interface';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings-page',
  imports: [],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  patientService = inject(PatientService)
  authService = inject(AuthService)


  deleteAllPatientData(): void {
    if (!confirm('Вы точно хотите удалить все персональные данные?')) { return; }

    this.patientService.deleteAllPatientData()
      .pipe(take(1))
      .subscribe({
        next : (res: StatusResponse) =>{
          alert(res.message ?? 'Данные успешно удалены')
          this.authService.logout()},

        error: err => {
          console.error(err);
          alert('Не удалось удалить данные');
        }
      });
  }

  deleteAllAttachments(): void {
    if (!confirm('Вы точно хотите удалить все вложения?')) { return; }
  }
}
