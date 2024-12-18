import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingCampaignErrorComponent } from './marketing-campaign-error.component';

describe('MarketingCampaignErrorComponent', () => {
  let component: MarketingCampaignErrorComponent;
  let fixture: ComponentFixture<MarketingCampaignErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingCampaignErrorComponent]
    });
    fixture = TestBed.createComponent(MarketingCampaignErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
