import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkMessageSenderComponent } from './pages/bulk-message-sender/bulk-message-sender.component';
import { MarketingCampaignComponent } from './pages/marketing-campaign/marketing-campaign.component';

const routes: Routes = [
    { path: '', component: BulkMessageSenderComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BulkMessageSenderRoutingModule { }
