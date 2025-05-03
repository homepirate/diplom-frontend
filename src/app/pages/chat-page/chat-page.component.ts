import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../data/services/chat.service';
import { Chat } from '../../data/interfaces/chat.interface';
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { ChatPrevComponent } from "../../common-ui/chat-prev/chat-prev.component";
import { ChatWindowComponent } from "../../common-ui/chat-window/chat-window.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  imports: [ChatPrevComponent, ChatWindowComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit {

  chatService = inject(ChatService)
  cookieService = inject(CookieService);
  router = inject(Router)
  
  me: DecodedToken | null = null;
  chats: Chat[] = [];

  selectedChat: Chat | null = null;


  ngOnInit(): void {
    // 1) Декодируем токен и загружаем список диалогов
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
        this.loadChats(() => this.openFromState());
      } catch (err) {
        console.error('Ошибка декодирования токена', err);
      }
    }
  }

  private loadChats(callback?: () => void) {
    if (!this.me) return;
    this.chatService.getChatList(this.me.id).subscribe({
      next: list => {
        this.chats = list;
        if (callback) callback();
      },
      error: err => console.error('Не удалось загрузить чаты', err)
    });
  }

  private openFromState() {
    const nav = this.router.getCurrentNavigation();
    const partnerId = nav?.extras.state?.['partnerId'] ?? history.state.partnerId;
    const partnerName = nav?.extras.state?.['partnerName'] ?? history.state.partnerId;
    if (partnerId && this.me) {
      this.openOrCreateChat(partnerId, partnerName);
    }
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  private openOrCreateChat(partnerId: string, partnerName: string) {
    const exists = this.chats.find(c => c.partnerId === partnerId);
    if (exists) {
      this.selectChat(exists);
    } else {
      const newChat: Chat = {
        conversationId: uuidv4(),                // или Date.now().toString()
        partnerId,
        partnerName,
        lastMessage: '',
        timestamp: new Date().toISOString()
      };
  
      this.chats.push(newChat);
      this.selectChat(newChat);
    }
  }


onNewMessage(event: { conversationId: string; content: string }) {
  const { conversationId, content } = event;

  this.chats = this.chats.map(c =>
    c.conversationId === conversationId
      ? { ...c, lastMessage: content }
      : c
  );

  if (this.selectedChat?.conversationId === conversationId) {
    this.selectedChat = 
      this.chats.find(c => c.conversationId === conversationId)!
  }
}


}
function uuidv4(): string {
  throw new Error('Function not implemented.');
}

