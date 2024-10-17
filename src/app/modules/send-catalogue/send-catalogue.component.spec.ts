import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCatalogueComponent } from './send-catalogue.component';

describe('SendCatalogueComponent', () => {
  let component: SendCatalogueComponent;
  let fixture: ComponentFixture<SendCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
