import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { issueMasterModel } from 'src/app/_models/issue';
import { labelMasterModel } from 'src/app/_models/labels';
import { noLeadingSpaceValidator } from 'src/app/shared/directives/noLeadingSpaceValidator.validatot';

@Component({
    selector: 'app-label-add-edite',
    templateUrl: './label-add-edite.component.html',
    styleUrls: ['./label-add-edite.component.css']
})
export class LabelAddEditeComponent implements OnInit {
    isProceess: boolean = false;
    issueForm: FormGroup;

    get title(): string {
        return this.dataItem ? 'Edit Labels Master' : 'Add Labels Master';
    }

    constructor(
        private dialogRef: MatDialogRef<LabelAddEditeComponent>, // MatDialogRef for dialog handling
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public dataItem: labelMasterModel // Inject dialog data
    ) {
        this.issueForm = this.formBuilder.group({
            labelName: ['', [
                Validators.required,
                noLeadingSpaceValidator(),
            ]],
            status: [true, [Validators.required]],
        });
    }

    ngOnInit(): void {
        if (this.dataItem) {
            this.issueForm.patchValue({
                labelName: this.dataItem.labelName,
                status: this.dataItem.status,
            });
        }
    }

    onCancel() {
        this.dialogRef.close(); // Close the dialog
    }

    onSubmit() {
        if (this.issueForm.valid) {
            this.dialogRef.close(this.issueForm.value); // Close and send form data to parent
        } else {
            this.issueForm.controls['labelName'].markAsTouched();
            this.issueForm.controls['status'].markAsTouched();
        }
    }

    shouldShowError(controlName: string, errorName: string) {
        return this.issueForm.controls[controlName].touched && this.issueForm.controls[controlName].hasError(errorName);
    }
}
