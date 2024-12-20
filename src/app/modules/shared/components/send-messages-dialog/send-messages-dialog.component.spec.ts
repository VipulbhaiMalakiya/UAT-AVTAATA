import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessagesDialogComponent } from './send-messages-dialog.component';

describe('SendMessagesDialogComponent', () => {
  let component: SendMessagesDialogComponent;
  let fixture: ComponentFixture<SendMessagesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendMessagesDialogComponent]
    });
    fixture = TestBed.createComponent(SendMessagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
