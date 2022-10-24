import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-symbol-control',
  templateUrl: './symbol-control.component.html',
  styleUrls: ['./symbol-control.component.css']
})
export class SymbolControlComponent {

  public form = new FormGroup({
    formControl: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(8)
      ],
      nonNullable: true
    })
  });

  @Output() stockSymbolEvent = new EventEmitter<string>();

  get formControl() { return this.form.get('formControl')!; }

  constructor() { }

  public submitForm(): void {
    this.stockSymbolEvent.emit(this.formControl.value);
  }
}
