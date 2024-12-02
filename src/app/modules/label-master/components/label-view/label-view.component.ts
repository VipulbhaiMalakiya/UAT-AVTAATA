import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { labelMasterModel } from 'src/app/_models/labels';
import { noLeadingSpaceValidator } from 'src/app/shared/directives/noLeadingSpaceValidator.validatot';

@Component({
    selector: 'app-label-view',
    templateUrl: './label-view.component.html',
    styleUrls: ['./label-view.component.css']
})
export class LabelViewComponent {
    public _labelsMaster: labelMasterModel | undefined;
    issueForm: FormGroup;
    isProcess: boolean = false;

    // Array to hold label items dynamically
    labelItems: Array<{ label: string; value: string | undefined }> = [];

    constructor(
        private dialogRef: MatDialogRef<LabelViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: labelMasterModel,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.issueForm = this.formBuilder.group({
            labelName: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                this.noLeadingSpaceValidator(),
                Validators.pattern('^(?!\\s*$)[a-zA-Z\\s]*$')
            ]],
            status: ['', [Validators.required]],
            categoryId: [''],
            createdDate: [''],
            createdBy: [''],
            updatedDate: [''],
            updatedBy: ['']
        });
        this.issuesMaster = this.data;  // Populate data on load
    }

    // Set data and populate form fields
    set issuesMaster(value: labelMasterModel) {
        this._labelsMaster = value;

        if (this._labelsMaster) {
            this.issueForm.patchValue({
                labelName: value.labelName,
                status: value.status ? 'Active' : 'Deactivate',
                createdDate: moment(value.createdDate || '').format("llll"),
                createdBy: `${value.createdBy?.firstName} ${value.createdBy?.lastName}`,
                updatedDate: moment(value.updatedDate || '').format("llll"),
                updatedBy: `${value.updatedBy?.firstName} ${value.updatedBy?.lastName}`,
            });

            // Disable fields to make them read-only
            Object.keys(this.issueForm.controls).forEach(control => {
                this.issueForm.controls[control].disable();
            });

            // Populate the labelItems array dynamically
            this.labelItems = [
                { label: 'Label Name', value: this._labelsMaster.labelName },
                { label: 'Created Date', value: moment(this._labelsMaster.createdDate).format("llll") },
                { label: 'Created By', value: `${this._labelsMaster.createdBy?.firstName} ${this._labelsMaster.createdBy?.lastName}` },
                { label: 'Updated Date', value: moment(this._labelsMaster.updatedDate).format("llll") },
                { label: 'Updated By', value: `${this._labelsMaster.updatedBy?.firstName} ${this._labelsMaster.updatedBy?.lastName}` },
                { label: 'Status', value: this._labelsMaster.status ? 'Active' : 'Deactivated' }
            ];
        }
    }

    // Custom validator for no leading space
    noLeadingSpaceValidator() {
        return (control: any) => control.value.startsWith(' ') ? { leadingSpace: true } : null;
    }

    // Close the dialog without saving
    onCancel(): void {
        this.dialogRef.close();
    }

}
