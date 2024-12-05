import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryMasterModel } from 'src/app/_models/category';
import { noLeadingSpaceValidator } from 'src/app/shared/directives/noLeadingSpaceValidator.validatot';
import { noBlankSpacesValidator } from 'src/app/shared/directives/noWhitespace.validator';
@Component({
    selector: 'app-add-edite-category',
    templateUrl: './add-edite-category.component.html',
    styleUrls: ['./add-edite-category.component.css']
})
export class AddEditeCategoryComponent {
    private _categoryMaster: CategoryMasterModel | undefined;
    isProceess: boolean = false;
    CategoryMasterForm: any;

    get title(): string {
        return this._categoryMaster
            ? 'Edit Category Master'
            : 'Add Category Master';
    }

    constructor(
        private dialogRef: MatDialogRef<AddEditeCategoryComponent>, // MatDialogRef instead of NgbActiveModal
        @Inject(MAT_DIALOG_DATA) public data: any, // Inject data for editing
        private formBuilder: FormBuilder
    ) {
        this.CategoryMasterForm = this.formBuilder.group({
            categoryName: [
                '',
                [Validators.required, noLeadingSpaceValidator()],
            ],
            status: [true, [Validators.required]],
        });

        if (data?.categoryMaster) {
            this.categoryMaster = data.categoryMaster;
        }
    }

    set categoryMaster(value: CategoryMasterModel) {
        this.isProceess = true;
        this._categoryMaster = value;
        if (this._categoryMaster) {
            this.CategoryMasterForm.patchValue({
                categoryName: this._categoryMaster.categoryName,
                status: this._categoryMaster.status,
            });
            this.isProceess = false;
        }
    }

    onCancel(): void {
        this.isProceess = false;
        this.dialogRef.close(); // Close dialog without returning data
    }

    onSubmit(): void {
        if (this.CategoryMasterForm.valid) {
            this.dialogRef.close(this.CategoryMasterForm.value); // Return form data to the parent
        } else {
            this.CategoryMasterForm.controls['categoryName'].markAsTouched();
            this.CategoryMasterForm.controls['status'].markAsTouched();
        }
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return (
            this.CategoryMasterForm.controls[controlName].touched &&
            this.CategoryMasterForm.controls[controlName].hasError(errorName)
        );
    }
}
