import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-marketing-campaign-error',
    templateUrl: './marketing-campaign-error.component.html',
    styleUrls: ['./marketing-campaign-error.component.css']
})
export class MarketingCampaignErrorComponent implements OnInit {
    private _customersMaster: any | undefined;
    isProceess: boolean = false;


    set customersMaster(value: any) {
        this._customersMaster = value;

    }

    constructor(
        private activeModal: NgbActiveModal,
    ) {

    }

    ngOnInit(): void {
        console.log(this._customersMaster)
    }

    onCancel() {
        this.isProceess = false;
        this.activeModal.dismiss();
    }
}

