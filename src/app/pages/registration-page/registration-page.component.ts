import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpecializationsService } from '../../data/services/specializations.service';

@Component({
  selector: 'app-registration-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {

  router = inject(Router)
  specializationsService = inject(SpecializationsService)

  isPasswordVisible = signal<boolean>(false)
  specializations: string[] = [];


  form = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required),
    fullName: new FormControl<string | null>(null, Validators.required),
    specialization: new FormControl<string | null>(null, Validators.required),
  })

  ngOnInit(): void {
    // Подписка на получение списка специализаций
    this.specializationsService.getSpecializationsList().subscribe(
      (data) => {
        this.specializations = data;
      },
      (error) => {
        console.error('Ошибка загрузки специализаций:', error);
      }
    );
  }

  onSubmit(){
      console.log(this.form.value)
    //   if (this.form.valid){
    //     //@ts-ignore
    //     this.authService.login(this.form.value).subscribe(
    //       res => {
    //         this.router.navigate([''])
    //         console.log(res)
    //       }
    //     )
    //   }
    }
}
