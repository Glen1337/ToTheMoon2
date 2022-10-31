import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolControlComponent } from './symbol-control.component';

describe('SymbolControlComponent', () => {
  let component: SymbolControlComponent;
  let fixture: ComponentFixture<SymbolControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbolControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
