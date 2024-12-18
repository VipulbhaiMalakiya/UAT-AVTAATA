import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkMessageSenderRoutingModule } from './bulk-message-sender-routing.module';
import { BulkMessageSenderComponent } from './pages/bulk-message-sender/bulk-message-sender.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketingCampaignComponent } from './pages/marketing-campaign/marketing-campaign.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MarketingCampaignErrorComponent } from './marketing-campaign-error/marketing-campaign-error.component';
import { BulkMessageErrorComponent } from './bulk-message-error/bulk-message-error.component';

@NgModule({
    declarations: [
        BulkMessageSenderComponent,
        MarketingCampaignComponent,
        MarketingCampaignErrorComponent,
        BulkMessageErrorComponent,
    ],
    imports: [
        CommonModule,
        BulkMessageSenderRoutingModule,
        SharedModule,
        NgbModalModule,
        FormsModule,
        NgxPaginationModule,
        ReactiveFormsModule,

    ]
})
export class BulkMessageSenderModule { }
