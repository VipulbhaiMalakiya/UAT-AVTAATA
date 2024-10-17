import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoorReviewComponent } from './poor-review.component';

describe('PoorReviewComponent', () => {
  let component: PoorReviewComponent;
  let fixture: ComponentFixture<PoorReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoorReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoorReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
