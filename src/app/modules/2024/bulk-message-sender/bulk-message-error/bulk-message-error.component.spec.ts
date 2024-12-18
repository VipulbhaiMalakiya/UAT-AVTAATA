import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMessageErrorComponent } from './bulk-message-error.component';

describe('BulkMessageErrorComponent', () => {
  let component: BulkMessageErrorComponent;
  let fixture: ComponentFixture<BulkMessageErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkMessageErrorComponent]
    });
    fixture = TestBed.createComponent(BulkMessageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
