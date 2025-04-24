import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attachment',
  imports: [],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.scss'
})
export class AttachmentComponent implements OnInit{
  @Input() attachmentUrl: string = "";

  fileName = '';

  ngOnInit() {
    const raw = (this.attachmentUrl.split('/').pop() || '').split('?')[0];

    const idx = raw.indexOf('_');
    this.fileName = idx !== -1
      ? raw.substring(idx + 1)
      : raw;
  }

}
