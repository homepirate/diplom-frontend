import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    http: HttpClient = inject(HttpClient)
    baseApiUrl = 'https://localhost:8888/'
    cookieService = inject(CookieService)
    router = inject(Router)

    token: string | null = null


    get isAuth(){
      if (!this.token){
        this.token = this.cookieService.get('token')
      }
      return !!this.token
    }

    getToken(): string | null {
      if (!this.token) {
          this.token = this.cookieService.get('token') || null;
      }
      return this.token;
  }

    login(payload: {email: string, password: string}) {
      return this.http.post<TokenResponse>(`${this.baseApiUrl}auth/login`, payload).pipe(
        tap(val =>  this.saveTokens(val))
      )
    }

    register(payload: {email: string, password: string, phone: string, fullName: string, specialization: string}){
      return this.http.post<Object>(`${this.baseApiUrl}register/doctor`, payload)
    }

    register_patient(payload: {email: string, password: string, phone: string, fullName: string, birthDate: string}){
      return this.http.post<Object>(`${this.baseApiUrl}register/patient`, payload)
    }

    logout(){
      this.cookieService.deleteAll()
      this.token = null
      this.router.navigate(['login'])
    }


    saveTokens(res: TokenResponse) {
      this.token = res.token
      this.cookieService.set('token', this.token)
    }
}
