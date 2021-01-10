import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  @Input() inputMessage: string = '';
  isVisible: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  okClick(){
    this.inputMessage = '';
  }

}
