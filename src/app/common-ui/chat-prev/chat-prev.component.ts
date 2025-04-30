import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Chat } from '../../data/interfaces/chat.interface';

@Component({
  selector: 'app-chat-prev',
  imports: [],
  templateUrl: './chat-prev.component.html',
  styleUrl: './chat-prev.component.scss'
})
export class ChatPrevComponent {
  @Input() chat!: Chat;


  @Input()  active = false;
  @Output() clicked = new EventEmitter<void>();

  @HostBinding('class.chat-prev') hostClass = true;
  @HostBinding('class.active') get isActive() { return this.active; }

  onClick() {
    this.clicked.emit();
  }

}
