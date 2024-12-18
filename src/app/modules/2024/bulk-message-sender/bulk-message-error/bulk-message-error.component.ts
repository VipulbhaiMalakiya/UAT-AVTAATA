import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/_services/app.service';

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
        private activeModal: NgbActiveModal, private appService: AppService,
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
                "Id": x.id || '',
                "Full Name": x.full_name || '',
                "Phone No": x.phone_no || '',
                "Reason": x.reason || '',
                "Status": x.status || '',

            }
        });

        const headers = ["Id", "Full Name", "Phone No", "Reason", 'Status'];
        this.appService.exportAsExcelFile(exportData, "Failed-Bulk-Messages", headers);
    }

}
