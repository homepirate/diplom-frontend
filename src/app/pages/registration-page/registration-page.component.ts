import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpecializationsService } from '../../data/services/specializations.service';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-registration-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {

  router = inject(Router)
  specializationsService = inject(SpecializationsService)
  authService = inject(AuthService)


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
      if (this.form.valid){
        //@ts-ignore
        this.authService.register(this.form.value).pipe(
          switchMap((res: any) => {
            // Здесь можно проверить статус ответа, если нужно:
            if (res.status === 'CREATED') {
              // Если регистрация успешна, вызываем логин
              return this.authService.login({
                email: this.form.value.email!,
                password: this.form.value.password!
              });
            } else {
              throw new Error('Ошибка регистрации');
            }
          })
        ).subscribe({
          next: (loginRes) => {
            console.log('Логин успешен', loginRes);
            // Переход на основную страницу
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Ошибка при регистрации или логине:', err);
          }
        });
  
      }        
    }
}
