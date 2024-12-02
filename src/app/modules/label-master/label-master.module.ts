import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelMasterRoutingModule } from './label-master-routing.module';
import { LabelsListComponent } from './pages/labels-list/labels-list.component';
import { LabelAddEditeComponent } from './components/label-add-edite/label-add-edite.component';
import { LabelViewComponent } from './components/label-view/label-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { labelFilterPipe } from 'src/app/_helpers/label-filter';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';  // Import MatCardModule

import { MatSelectModule } from '@angular/material/select';

import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
    declarations: [
        LabelsListComponent,
        LabelAddEditeComponent,
        LabelViewComponent,
        labelFilterPipe
    ],
    imports: [
        CommonModule,
        LabelMasterRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatCardModule,
        MatSelectModule
    ]
})
export class LabelMasterModule { }
