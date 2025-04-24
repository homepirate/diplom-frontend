import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  imports: [SvgIconComponent, RouterLink, AsyncPipe, ImgUrlPipe, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  cookieService = inject(CookieService)


  me!: DecodedToken;

  menuItems = [
    {
      label: 'Записи',
      icon: 'calendar', 
      link: 'calendar',
    },
    {
      label: 'Чат',
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
}
