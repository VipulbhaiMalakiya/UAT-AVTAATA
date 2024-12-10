import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMessageSenderComponent } from './bulk-message-sender.component';

describe('BulkMessageSenderComponent', () => {
  let component: BulkMessageSenderComponent;
  let fixture: ComponentFixture<BulkMessageSenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkMessageSenderComponent]
    });
    fixture = TestBed.createComponent(BulkMessageSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
