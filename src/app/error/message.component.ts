import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  @Input() inputErrorMessage: string = '';
  @Input() inputNoticeMessage: string = '';
  @Input() inputWarningMessage: string = '';

  @Output() okClickEvent = new EventEmitter();

  isVisible: boolean = true;

  isError: boolean = false;
  isNotice: boolean = false;
  isWarning: boolean = false;

  constructor() {}

  ngOnChanges(){
    if(this.inputErrorMessage){this.isError = true;}
    if(this.inputNoticeMessage){this.isNotice = true;}
    if(this.inputWarningMessage){this.isWarning = true;}
  }

  okClick(){
    this.okClickEvent.emit('ok');
  }

}
