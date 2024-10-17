import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { slaMasterModel } from 'src/app/_models/sla';
import { AppService } from 'src/app/_services/app.service';
import { ViewSlaComponent } from '../sla/components/view-sla/view-sla.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-poor-review',
    templateUrl: './poor-review.component.html',
    styleUrls: ['./poor-review.component.css']
})
export class PoorReviewComponent {

    isProceess: boolean = true;
    term: any;
    data: any[] = [];
    subscription?: Subscription;
    userData: any;
    masterName?: any;
    page: number = 1;
    count: number = 0;
    tableSize: number = 10;
    tableSizes: any = [3, 6, 9, 12];
    level?: any;
    customerData: any = [];


    constructor(
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private titleService: Title,
        private appService: AppService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.titleService.setTitle("CDC -Escalation Level");
        const d: any = localStorage.getItem("userData");
        this.userData = JSON.parse(d);
    }

    ngOnInit(): void {




        this.masterName = `/chatlist/bad-review`;
        this.fatchData();
        this.fatchCustomerData();


    }


    fatchCustomerData() {

        this.subscription = this.apiService.getAll("/customer").pipe(take(1)).subscribe(data => {
            if (data) {
                this.customerData = data;
                this.cd.detectChanges();
            }
        }, error => {
            this.isProceess = false;
        })
    }

    sendMessage(dataItem: any) {
        // Filter customers by a specific contact
        const filteredCustomers = this.customerData.filter((customer: any) => customer.contact === dataItem.mobileNumber);

        if (filteredCustomers.length > 0) {
            // If there are filtered customers, log the first one and navigate to the inbox
            const customerId = filteredCustomers[0].customerId;
            this.router.navigate([`/admin/inbox/${customerId}`]);
        } else {
            // If no customers were found, show a message
            this.toastr.warning('No customers found with the specified contact.');
        }
    }


    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }

    fatchData() {
        this.isProceess = true;

        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1)).subscribe(data => {
            if (data) {
                this.data = data.data;
                this.count = this.data.length;
                this.isProceess = false;
                this.cd.detectChanges();
            }

        }, error => {
            this.isProceess = false;
        })
    }
    onTableDataChange(event: any) {
        this.page = event;
    }
    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }
    onDownload() {
        const exportData = this.data.map(x => {


            return {
                "Customer Name": x.customerName || '',
                "Mobile Number": x.mobileNumber || '',
                "Feedback": x.feedback || '',
                "Date & Time": x.feedbackDate || '',


            }
        });
        const headers = [
            "Customer Name", 'Mobile Number', 'Level', 'Date & Time'
        ];
        this.appService.exportAsExcelFile(exportData, "Bad Review", headers);
    }



    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    onViewDetail(dataItem: slaMasterModel) {
        this.isProceess = true;
        const modalRef = this.modalService.open(ViewSlaComponent, { size: "xl", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as ViewSlaComponent;
        componentInstance.serviceTitleMaster = dataItem;
    }
}
