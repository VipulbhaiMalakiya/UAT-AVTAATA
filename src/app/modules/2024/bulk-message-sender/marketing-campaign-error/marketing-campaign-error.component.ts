import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/_services/app.service';

@Component({
    selector: 'app-marketing-campaign-error',
    templateUrl: './marketing-campaign-error.component.html',
    styleUrls: ['./marketing-campaign-error.component.css']
})
export class MarketingCampaignErrorComponent implements OnInit {
    private _customersMaster: any | undefined;
    isProceess: boolean = false;
    data: any;


    set customersMaster(value: any) {
        this._customersMaster = value;

    }

    constructor(
        private activeModal: NgbActiveModal, private appService: AppService
    ) {

    }

    ngOnInit(): void {
        this.data = this._customersMaster;
    }

    onCancel() {
        this.isProceess = false;
        this.activeModal.dismiss();
    }

    onDownload() {
        const exportData = this.data.map((x: any) => {

            return {
                "Full Name": x.name || '',
                "Phone No": x.number || '',
                "Reason": x.status || '',
                "Status": x.sentDetail || '',
            }
        });

        const headers = ["Full Name", "Phone No", "Reason", 'Status'];
        this.appService.exportAsExcelFile(exportData, "Failed-Marketing-Campaigns", headers);
    }
}

