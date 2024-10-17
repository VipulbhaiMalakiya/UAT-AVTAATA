import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoorReviewComponent } from './poor-review.component';

const routes: Routes = [{ path: '', component: PoorReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoorReviewRoutingModule { }
