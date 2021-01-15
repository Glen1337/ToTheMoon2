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

  existingErrorMessage: string = '';
  existingNoticeMessage: string = '';
  existingWarningMessage: string = '';

  @Output() okClickEvent = new EventEmitter();

  isError: boolean = false;
  isNotice: boolean = false;
  isWarning: boolean = false;

  constructor() {}

  okClick(){
    this.okClickEvent.emit('ok');
  }

  // existing messages need to be stored as a 'history' of the last message provided to the message component
  // to avoid bugs when another message appears but the OK button was NOT clicked to dismiss the previous message
  ngOnChanges(){
    if(this.inputErrorMessage && (this.existingNoticeMessage || this.existingWarningMessage)){
      this.inputNoticeMessage = '';
      this.inputWarningMessage = '';
      this.existingNoticeMessage = '';
      this.existingWarningMessage = '';
      this.existingErrorMessage = this.inputErrorMessage;
      this.isError = true;
      this.isNotice = false;
      this.isWarning = false;
    }
    if(this.inputNoticeMessage && (this.existingErrorMessage || this.existingWarningMessage)){
      this.inputErrorMessage = '';
      this.inputWarningMessage = '';
      this.existingErrorMessage = '';
      this.existingWarningMessage = '';
      this.existingNoticeMessage = this.inputNoticeMessage;
      this.isNotice = true;
      this.isError = false;
      this.isWarning = false;
    }
    if(this.inputWarningMessage && (this.existingNoticeMessage || this.existingErrorMessage)){
      this.inputErrorMessage = '';
      this.inputNoticeMessage = '';
      this.existingErrorMessage = '';
      this.existingNoticeMessage = '';
      this.existingWarningMessage = this.inputWarningMessage;
      this.isWarning = true;
      this.isError = false;
      this.isNotice = false;
    }
      if(this.inputErrorMessage){
        this.existingErrorMessage = this.inputErrorMessage;
        this.isError = true;
      }
      if(this.inputNoticeMessage){
        this.existingWarningMessage = this.inputNoticeMessage;
        this.isNotice = true;
      }
      if(this.inputWarningMessage){
        this.existingWarningMessage = this.inputWarningMessage;
        this.isWarning = true;
      }
  }
}
