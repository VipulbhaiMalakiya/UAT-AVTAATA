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
    isProcess = false;

    // Define fields dynamically
    categoryFields = [
        { label: 'Name', value: '' },
        { label: 'Created Date', value: '' },
        { label: 'Created By', value: '' },
        { label: 'Updated Date', value: '' },
        { label: 'Updated By', value: '' },
        { label: 'Status', value: '' },
    ];

    constructor(
        private datePipe: DatePipe,
        public dialogRef: MatDialogRef<ViewCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // Populate the fields with data
        this.categoryFields = [
            { label: 'Name', value: data.categoryMaster.categoryName },
            { label: 'Created Date', value: this.formatDate(data.categoryMaster.createdDate) },
            { label: 'Created By', value: this.formatName(data.categoryMaster.createdBy) },
            { label: 'Updated Date', value: this.formatDate(data.categoryMaster.updatedDate) },
            { label: 'Updated By', value: this.formatName(data.categoryMaster.updatedBy) },
            { label: 'Status', value: data.categoryMaster.status },
        ];
    }

    private formatDate(date: any): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm a') || 'N/A';
    }

    private formatName(user: any): string {
        if (!user) return 'N/A';
        const firstName = user.firstName ?? '';
        const lastName = user.lastName ?? '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
    }

    onCancel(): void {
        this.dialogRef.close(); // Close the dialog
    }

}
