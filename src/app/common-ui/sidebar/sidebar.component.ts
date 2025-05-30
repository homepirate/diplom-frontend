import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [SvgIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  cookieService = inject(CookieService);
  authService = inject(AuthService);


  me!: DecodedToken;

  menuItems = [
    {
      label: 'Записи',
      icon: 'calendar', 
      link: 'calendar',
    },
    {
      label: 'Чаты',
      icon: 'chats', 
      link: 'chats',
    },
    {
      label: 'Пациенты',
      icon: 'people', 
      link: 'patients',
    },
    {
      label: 'Услуги',
      icon: 'services', 
      link: 'services',
    },
    {
      label: 'Добавить пациента',
      icon: 'add-user', 
      link: 'add-patient',
    },
    {
      label: 'Сформировать отчет',
      icon: 'report', 
      link: 'report',
    },
  ]

  menuItemsPatient = [
    {
      label: 'Записи',
      icon: 'calendar', 
      link: 'calendar',
    },
    {
      label: 'Чаты',
      icon: 'chats', 
      link: 'chats',
    },
    {
      label: 'Врачи',
      icon: 'people', 
      link: 'doctors',
    },
    {
      label: 'Настройки',
      icon: 'settings',
      link: 'settings',
    }
  ]
  
  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
      } catch (err) {
        console.error('Ошибка декодирования токена', err);
      }
    }
  }

  logout(event: any){
    this.authService.logout()
  
  }
}
