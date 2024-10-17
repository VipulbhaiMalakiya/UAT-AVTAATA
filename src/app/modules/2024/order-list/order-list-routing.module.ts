import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderUpdateComponent } from './components/order-update/order-update.component';

const routes: Routes = [
    { path: '', component: OrderListComponent },
    { path: 'order-detail/:id', component: OrderDetailComponent },
    { path: 'order-edit/:id', component: OrderUpdateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderListRoutingModule { }
