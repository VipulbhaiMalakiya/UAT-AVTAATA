import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingDetailsListComponent } from './pages/booking-details-list/booking-details-list.component';

const routes: Routes = [{ path: '', component: BookingDetailsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingDetailsRoutingModule { }
