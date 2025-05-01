import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../data/services/chat.service';
import { Chat } from '../../data/interfaces/chat.interface';
import { DecodedToken } from '../../auth/auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { ChatPrevComponent } from "../../common-ui/chat-prev/chat-prev.component";
import { ChatWindowComponent } from "../../common-ui/chat-window/chat-window.component";

@Component({
  selector: 'app-chat-page',
  imports: [ChatPrevComponent, ChatWindowComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit {

  chatService = inject(ChatService)
  cookieService = inject(CookieService);
  
  me: DecodedToken | null = null;
  chats: Chat[] = [];

  selectedChat: Chat | null = null;


  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      try {
        this.me = jwtDecode<DecodedToken>(token);
        this.loadChats();
      } catch (err) {
        console.error('Ошибка декодирования токена', err);
      }
    }
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  private loadChats(): void {
    if (!this.me) return;
    this.chatService.getChatList(this.me.id)
      .subscribe({
        next: list => this.chats = list,
        error: err => console.error('Не удалось загрузить чаты', err)
      });
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
