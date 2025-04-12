import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../data/services/notification.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  authService = inject(AuthService)
  router = inject(Router)
  notificationService = inject(NotificationService)

  isPasswordVisible = signal<boolean>(false)

  form = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  })

  onSubmit(){
    console.log(this.form.value)
    if (this.form.valid){
      //@ts-ignore
      this.authService.login(this.form.value).subscribe(
        (        res: any) => {
          this.notificationService.initialize()
          this.router.navigate([''])
          console.log(res)
        }
      )
    }
  }
}
