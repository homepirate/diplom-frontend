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
  router = inject(Router);
  specializationsService = inject(SpecializationsService);
  authService = inject(AuthService);

  isDoctor = signal(true);
  isPasswordVisible = signal<boolean>(false)

  specializations: string[] = [];

  form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6)
    ]),
    phone: new FormControl<string | null>(null, [Validators.required]),
    fullName: new FormControl<string | null>(null, [Validators.required]),
    specialization: new FormControl<string | null>(null),
    birthDate: new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.specializationsService
      .getSpecializationsList()
      .subscribe({
        next: (data) => (this.specializations = data),
        error: (err) => console.error('Ошибка загрузки специализаций:', err)
      });

    this.updateValidators();
  }

  toggleMode() {
    this.isDoctor.update(d => !d);
    this.form.reset();
    this.updateValidators();
  }

  private updateValidators() {
    if (this.isDoctor()) {
      this.form.get('specialization')!
        .setValidators([Validators.required]);
      this.form.get('birthDate')!
        .clearValidators();
    } else {
      this.form.get('birthDate')!
        .setValidators([Validators.required]);
      this.form.get('specialization')!
        .clearValidators();
    }
    this.form.get('specialization')!.updateValueAndValidity();
    this.form.get('birthDate')!.updateValueAndValidity();
  }

  onSubmit(){
      console.log(this.form.value)
      if (this.form.valid){

        const { email, password, phone, fullName, specialization, birthDate } =
        this.form.value as {
          email: string;
          password: string;
          phone: string;
          fullName: string;
          specialization?: string;
          birthDate?: string;
        };
        let register$;

        if (this.isDoctor()) {
          register$ = this.authService.register({
            email,
            password,
            phone,
            fullName,
            specialization: specialization!
          });
        } else {
          register$ = this.authService.register_patient({
            email,
            password,
            phone,
            fullName,
            birthDate: birthDate!
          });
        }

        //@ts-ignore
        register$.pipe(
          switchMap((res: any) => {
            if (res.status === 'CREATED') {
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
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Ошибка при регистрации или логине:', err);
          }
        });
  
      }        
    }
}
