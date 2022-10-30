import { ViewportScroller } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnChanges {

  @Input() inputErrorMessage: string = '';
  @Input() inputNoticeMessage: string = '';
  @Input() inputWarningMessage: string = '';

  @Output() okClickEvent = new EventEmitter();

  isError: boolean = false;
  isNotice: boolean = false;
  isWarning: boolean = false;

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event: ElementRef): void {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(private scroll: ViewportScroller) {}

  okClick(): void {
    this.okClickEvent.emit('ok');
  }

  // to avoid bugs when another message appears but the OK button was NOT clicked to dismiss the previous message
  ngOnChanges(): void {

    //TODO
    // can this simpler method be used instead?
    window.scrollTo(0, 0);

    this.scroll.scrollToPosition([0, 0]);

    if (this.inputErrorMessage) {
        this.isError = true;
        this.isWarning = false;
        this.isNotice = false;
        this.inputWarningMessage = '';
        this.inputNoticeMessage = '';

    }
    if (this.inputNoticeMessage) {
        this.isNotice = true;
        this.isWarning = false;
        this.isError = false;
        this.inputErrorMessage = '';
        this.inputWarningMessage = '';
    }
    if (this.inputWarningMessage) {
        this.isWarning = true;
        this.isError = false;
        this.isNotice = false;
        this.inputErrorMessage = '';
        this.inputNoticeMessage = '';
    }
  }

}
