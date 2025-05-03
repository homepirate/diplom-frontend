import { Component, inject } from '@angular/core';
import { DoctorService } from '../../data/services/doctor.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-page',
  imports: [ReactiveFormsModule],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss'
})
export class ReportPageComponent {

  doctorService = inject(DoctorService)
  sanitizer = inject(DomSanitizer);
  pdfUrl: SafeResourceUrl | null = null;



  form = new FormGroup({
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, Validators.required)
  })


  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  onSubmit() {
    if (this.form.valid) {
      const rawStartDate = this.form.value.startDate as string;
      const rawEndDate = this.form.value.endDate as string;
      
      const payload = {
        startDate: this.formatDate(rawStartDate),
        endDate: this.formatDate(rawEndDate)
      };

      this.doctorService.getFinancialDashboardReport(payload).subscribe(blob => {
        const objectUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      }, error => {
        console.error("Ошибка при получении отчёта:", error);
      });
    }
  }

}
