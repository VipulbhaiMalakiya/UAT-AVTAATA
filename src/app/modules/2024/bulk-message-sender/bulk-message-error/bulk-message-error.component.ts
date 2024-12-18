import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-bulk-message-error',
    templateUrl: './bulk-message-error.component.html',
    styleUrls: ['./bulk-message-error.component.css']
})
export class BulkMessageErrorComponent implements OnInit {
    private _customersMaster: any | undefined;
    isProceess: boolean = false;
    data: any;



    set customersMaster(value: any) {
        this._customersMaster = value;

    }

    constructor(
        private activeModal: NgbActiveModal,
    ) {

    }

    ngOnInit(): void {
        this.data = this._customersMaster;
    }

    onCancel() {
        this.isProceess = false;
        this.activeModal.dismiss();
    }
}
