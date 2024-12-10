import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkMessageSenderRoutingModule } from './bulk-message-sender-routing.module';
import { BulkMessageSenderComponent } from './pages/bulk-message-sender/bulk-message-sender.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        BulkMessageSenderComponent,
    ],
    imports: [
        CommonModule,
        BulkMessageSenderRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class BulkMessageSenderModule { }
