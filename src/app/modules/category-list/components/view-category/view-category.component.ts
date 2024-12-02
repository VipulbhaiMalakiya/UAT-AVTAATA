import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CategoryMasterModel } from 'src/app/_models/category';
@Component({
    selector: 'app-view-category',
    templateUrl: './view-category.component.html',
    styleUrls: ['./view-category.component.css']
})
export class ViewCategoryComponent {
    categoryMasterForm: FormGroup;
    isProcess = false;

    // Define form fields dynamically
    categoryFields = [
        { id: 'categoryName', label: 'Name', formControlName: 'categoryName', placeholder: 'Enter Category Name' },
        { id: 'createdDate', label: 'Created Date', formControlName: 'createdDate', placeholder: 'Enter Created Date' },
        { id: 'createdBy', label: 'Created By', formControlName: 'createdBy', placeholder: 'Enter Creator Name' },
        { id: 'updatedDate', label: 'Updated Date', formControlName: 'updatedDate', placeholder: 'Enter Updated Date' },
        { id: 'updatedBy', label: 'Updated By', formControlName: 'updatedBy', placeholder: 'Enter Updater Name' },
        { id: 'status', label: 'Status', formControlName: 'status', placeholder: 'Enter Status' },
    ];

    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe,
        public dialogRef: MatDialogRef<ViewCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // Initialize the form with the data passed

        this.categoryMasterForm = this.fb.group({
            categoryName: [{ value: data.categoryMaster.categoryName, disabled: true }],
            createdDate: [{ value: this.formatDate(data.categoryMaster.createdDate), disabled: true }],
            createdBy: [{ value: `${data.categoryMaster.createdBy?.firstName ?? ''} ${data.categoryMaster.createdBy?.lastName ?? ''}`.trim(), disabled: true }],
            updatedDate: [{ value: this.formatDate(data.categoryMaster.updatedDate), disabled: true }],
            updatedBy: [{ value: `${data.categoryMaster.updatedBy?.firstName ?? ''} ${data.categoryMaster.updatedBy?.lastName ?? ''}`.trim(), disabled: true }],
            status: [{ value: data.categoryMaster.status, disabled: true }],
        });


    }

    formatDate(date: any): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm a') || '';
    }


    onCancel(): void {
        this.dialogRef.close(); // Close the dialog
    }

}
