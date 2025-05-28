import { Injectable, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../auth/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private stompClient: Client | null = null;
  private tokenData: any;

  constructor(
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  initialize(): void {
    const tokenString = this.cookieService.get('token');
    if (!tokenString) {
      console.warn('Токен не найден в cookie');
      return;
    }

    try {
      this.tokenData = jwtDecode<DecodedToken>(tokenString);
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return;
    }

    const userId: string = this.tokenData.id;
    const role: string = (this.tokenData.roles && this.tokenData.roles.length > 0)
      ? this.tokenData.roles[0]
      : '';

    if (userId && role) {
      this.connectWebSocket(userId, role);
    } else {
      console.error('Не удалось получить id и/или роль из токена');
    }
  }


  private connectWebSocket(userId: string, role: string): void {
    const socketUrl = 'https://localhost:8888/ws-notifications';

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    stompClient.onConnect = frame => {
      console.log('WebSocket подключен: ' + frame);
      let destination: string;

      if (role.toUpperCase() === 'DOCTOR') {
        destination = `/topic/doctor/${userId}`;
      } else if (role.toUpperCase() === 'PATIENT') {
        destination = `/topic/patient/${userId}`;
      } else {
        console.error('Неизвестная роль пользователя:', role);
        return;
      }

      stompClient.subscribe(destination, message => {
        if (message.body) {
          this.showPopupNotification(message.body);
        }
      });
    };

    stompClient.onStompError = frame => {
      console.error('Ошибка STOMP:', frame);
    };

    stompClient.activate();
    this.stompClient = stompClient;
  }

  private showPopupNotification(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  ngOnDestroy(): void {
    this.stompClient?.deactivate();
  }
}
