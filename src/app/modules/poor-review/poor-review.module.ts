import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoorReviewRoutingModule } from './poor-review-routing.module';
import { PoorReviewComponent } from './poor-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from "../shared/shared.module";
import { PoorFilterPipe } from 'src/app/_helpers/poor-filter';


@NgModule({
    declarations: [
        PoorReviewComponent,
        PoorFilterPipe
    ],
    imports: [
        CommonModule,
        PoorReviewRoutingModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule,
        SharedModule
    ]
})
export class PoorReviewModule { }
