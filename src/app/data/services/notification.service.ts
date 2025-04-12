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

  /**
   * Инициализирует подключение к WebSocket‑сервису уведомлений.
   * Этот метод следует вызывать сразу после успешного логина.
   */
  initialize(): void {
    // Извлекаем токен из cookie (имя cookie — "token")
    const tokenString = this.cookieService.get('token');
    if (!tokenString) {
      console.warn('Токен не найден в cookie');
      return;
    }

    try {
      // Декодируем JWT-токен, используя jwtDecode с типизацией
      this.tokenData = jwtDecode<DecodedToken>(tokenString);
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return;
    }

    // Извлекаем id пользователя и его роль
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

  /**
   * Устанавливает WebSocket‑подключение и подписывается на соответствующий топик.
   * @param userId Идентификатор пользователя
   * @param role Роль пользователя (например, DOCTOR или PATIENT)
   */
  private connectWebSocket(userId: string, role: string): void {
    // URL конечной точки WebSocket (не забудьте обновить адрес/порт по необходимости)
    const socketUrl = 'https://localhost:8888/ws-notifications';

    // Создаем клиент STOMP, используя SockJS в качестве транспорта
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000, // Автоматическое переподключение через 5 сек.
      debug: (str) => console.log(str)
    });

    // Определяем действие при успешном подключении
    stompClient.onConnect = frame => {
      console.log('WebSocket подключен: ' + frame);
      let destination: string;

      // Выбираем топик в зависимости от роли пользователя
      if (role.toUpperCase() === 'DOCTOR') {
        destination = `/topic/doctor/${userId}`;
      } else if (role.toUpperCase() === 'PATIENT') {
        destination = `/topic/patient/${userId}`;
      } else {
        console.error('Неизвестная роль пользователя:', role);
        return;
      }

      // Подписываемся на выбранный топик и отображаем уведомления при получении сообщений
      stompClient.subscribe(destination, message => {
        if (message.body) {
          this.showPopupNotification(message.body);
        }
      });
    };

    // Обработка ошибок STOMP
    stompClient.onStompError = frame => {
      console.error('Ошибка STOMP:', frame);
    };

    // Активируем подключение
    stompClient.activate();
    this.stompClient = stompClient;
  }

  /**
   * Отображает всплывающее уведомление
   * @param message Текст уведомления
   */
  private showPopupNotification(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 5000,              // Время показа: 5000 мс
      verticalPosition: 'top',     // Позиция: сверху
      horizontalPosition: 'center' // Выравнивание по центру
    });
  }

  ngOnDestroy(): void {
    // Отключаем WebSocket при уничтожении сервиса (если он больше не нужен)
    this.stompClient?.deactivate();
  }
}
