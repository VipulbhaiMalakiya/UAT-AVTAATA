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
                "Full Name": x.name || '',
                "Phone No": x.number || '',
                "Reason": x.status || '',
                "Status": x.sentDetail || '',
            }
        });

        const headers = ["Full Name", "Phone No", "Reason", 'Status'];
        this.appService.exportAsExcelFile(exportData, "sendMessages", headers);
    }


    countStatus(status: string): number {
        return this.data.filter((customer: any) => customer.status === status).length;
    }
}
