import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewOrderFilterPipe } from 'src/app/_helpers/new-orderlist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderUpdateComponent } from './components/order-update/order-update.component';


@NgModule({
    declarations: [
        OrderListComponent, NewOrderFilterPipe, OrderDetailComponent, OrderUpdateComponent
    ],
    imports: [
        CommonModule,
        OrderListRoutingModule,
        SharedModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class OrderListModule { }
