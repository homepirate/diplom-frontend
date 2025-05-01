// src/app/services/chat.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../interfaces/chat.interface'
import { Client, Frame, IMessage } from '@stomp/stompjs';
import { ChatMessage } from '../interfaces/chatMessage.interface';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class ChatService {
    http: HttpClient = inject(HttpClient)
    baseApiUrl = 'https://localhost:8888'
    private stompClient: Client | null = null;



  getChatList(currentUserId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseApiUrl}/api/chat/list?userId=${currentUserId}`)
  }

  getChatHistory(user1: string, user2: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.baseApiUrl}/api/chat/history?user1=${user1}&user2=${user2}`
    );
  }

  connect(conversationId: string, onMessage: (msg: ChatMessage) => void): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.baseApiUrl}/ws-chat`),
      reconnectDelay: 5000,
      debug: (str: string) => console.log('[STOMP]', str)
    });

    this.stompClient.onConnect = (frame: Frame) => {
      console.log('STOMP connected:', frame);

      this.stompClient!.subscribe(
        `/topic/chat.${conversationId}`,
        (message: IMessage) => {
          if (message.body) {
            onMessage(JSON.parse(message.body) as ChatMessage);
          }
        }
      );
    };

    this.stompClient.onStompError = (frame: Frame) => {
      console.error('STOMP error:', frame);
    };

    this.stompClient.activate();
  }


  sendMessage(msg: ChatMessage): void {
    if (!this.stompClient || !this.stompClient.active) {
      console.warn('STOMP client is not connected');
      return;
    }
    this.stompClient.publish({
      destination: `/app/chat.sendMessage`,
      body: JSON.stringify(msg),
    });
  }


  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}
