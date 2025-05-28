import { Component, ElementRef, EventEmitter, inject, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DecodedToken } from '../../auth/auth.interface';
import { Chat } from '../../data/interfaces/chat.interface';
import { ChatService } from '../../data/services/chat.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatMessage } from '../../data/interfaces/chatMessage.interface';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnChanges {
  @Input() chat!: Chat;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;

  me: DecodedToken | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';

  private chatService = inject(ChatService);
  private cookieService = inject(CookieService);
  private ngZone = inject(NgZone);
  @Output() newMessageEvent = new EventEmitter<{ conversationId: string; content: string }>();


  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat) {
      this.setupUser();
      this.loadHistory();
      // Подключаемся к WebSocket и гарантируем, что колбэк внутри NgZone
      this.chatService.connect(this.chat.conversationId, (msg) => {
        this.ngZone.run(() => {
          this.messages.push(msg);
          this.scrollToBottom();
          this.newMessageEvent.emit({ conversationId: this.chat.conversationId, content: msg.content });
        });
      });
    }
  }

  private setupUser() {
    if (this.me) return;
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
      } catch {
        console.error('Не удалось декодировать токен');
      }
    }
  }

  private loadHistory() {
    if (!this.me) return;
    this.chatService
      .getChatHistory(this.me.id, this.chat.partnerId)
      .subscribe((hist) => {
        this.messages = hist;
        setTimeout(() => this.scrollToBottom(), 0);
      });
  }

  send() {
    if (!this.me || !this.newMessage.trim()) return;
    const msg: ChatMessage = {
      senderId: this.me.id,
      receiverId: this.chat.partnerId,
      content: this.newMessage.trim(),
      timestamp: '',
      type: 'CHAT',
    };
    this.scrollToBottom();

    // Отправка по STOMP
    this.chatService.sendMessage(msg);
    this.newMessageEvent.emit({ conversationId: this.chat.conversationId, content: msg.content });
    this.newMessage = '';
  }

  private scrollToBottom() {
    if (!this.messagesContainer) return;
    const el = this.messagesContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}