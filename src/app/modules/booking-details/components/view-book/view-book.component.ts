import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-view-book',
    templateUrl: './view-book.component.html',
    styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent {

    private _categoryMaster: any | undefined;
    isProceess: boolean = false;
    data: any;
    CategoryMasterForm: any;
    get title(): string {
        return this._categoryMaster ? "Edit Booking Master" : " Add Booking Master";
    }
    set categoryMaster(value: any) {
        this.data = value;
        this.isProceess = true;
        this._categoryMaster = value;
        if (this._categoryMaster) {
            this.CategoryMasterForm.patchValue({
                firstName: this._categoryMaster.firstName,
                lastName: this._categoryMaster.lastName,
                mobileNo: this._categoryMaster.mobileNo,
                checkindate: this._categoryMaster.checkindate,
            });
            this.CategoryMasterForm.controls["firstName"].disable();
            this.CategoryMasterForm.controls["lastName"].disable();
            this.CategoryMasterForm.controls["mobileNo"].disable();
            this.CategoryMasterForm.controls["checkindate"].disable();

            this.isProceess = false;
        }
    }
    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) {
        this.CategoryMasterForm = this.formBuilder.group({
            firstName: ["", [Validators.required,]],
            lastName: ["", [Validators.required,]],
            mobileNo: ["", [Validators.required,]],
            checkindate: ["", [Validators.required,]],
        });
    }


    onCancel() {
        this.isProceess = false;
        this.activeModal.dismiss();
    }
    onSubmit() {
        if (this.CategoryMasterForm.valid) {
            this.activeModal.close(this.CategoryMasterForm.value)
        } else {
            this.CategoryMasterForm.controls['firstName'].markAsTouched();
            this.CategoryMasterForm.controls['lastName'].markAsTouched();
            this.CategoryMasterForm.controls['mobileNo'].markAsTouched();
            this.CategoryMasterForm.controls['checkindate'].markAsTouched();
        }
    }
    shouldShowError(controlName: string, errorName: string) {
        return this.CategoryMasterForm.controls[controlName].touched && this.CategoryMasterForm.controls[controlName].hasError(errorName);
    }
}

