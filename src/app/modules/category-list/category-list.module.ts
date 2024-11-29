import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListRoutingModule } from './category-list-routing.module';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { SharedModule } from "../shared/shared.module";
import { AddEditeCategoryComponent } from './components/add-edite-category/add-edite-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewCategoryComponent } from './components/view-category/view-category.component';
import { CustomFilterPipe } from 'src/app/_helpers/custom-filter.pipe';
import { CategoryRepository } from 'src/app/State/repository/category-repository';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';  // Import MatButtonModule
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        CategoryListComponent,
        AddEditeCategoryComponent,
        ViewCategoryComponent,
        CustomFilterPipe
    ],
    imports: [
        CommonModule,
        CategoryListRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,


    ],
    providers: [
        CategoryRepository
    ]
})
export class CategoryListModule { }
