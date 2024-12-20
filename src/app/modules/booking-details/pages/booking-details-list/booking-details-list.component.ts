import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { AppService } from 'src/app/_services/app.service';
import { AddEditeRoomsComponent } from 'src/app/modules/rooms/components/add-edite-rooms/add-edite-rooms.component';
import { ViewRoomsComponent } from 'src/app/modules/rooms/components/view-rooms/view-rooms.component';
import { BulkUploadComponent } from 'src/app/modules/shared/components/bulk-upload/bulk-upload.component';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AddUpdateComponent } from '../../components/add-update/add-update.component';
import { ViewBookComponent } from '../../components/view-book/view-book.component';

@Component({
    selector: 'app-booking-details-list',
    templateUrl: './booking-details-list.component.html',
    styleUrls: ['./booking-details-list.component.css']
})
export class BookingDetailsListComponent implements OnInit, OnDestroy {
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
    constructor(
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private titleService: Title,
        private appService: AppService,
        private apiService: ApiService,
    ) {
        this.titleService.setTitle("CDC -booking-details");
        const d: any = localStorage.getItem("userData");
        this.userData = JSON.parse(d);
    }

    ngOnInit(): void {
        this.fatchData();
    }

    fatchData() {
        this.isProceess = true;
        this.masterName = "/booking-details";
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

    onAdd() {
        this.isProceess = true;
        const modalRef = this.modalService.open(AddUpdateComponent, { size: "md" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        modalRef.result.then((data: any) => {
            if (data) {
                var model: any = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobileNo: data.mobileNo,
                    checkindate: data.checkindate
                }
                this.masterName = `/booking-details`;
                let addData: any = {
                    url: this.masterName,
                    model: model
                }
                this.isProceess = true;
                this.subscription = this.apiService.add(addData)
                    .pipe(take(1))
                    .subscribe({
                        next: (res) => { // Handle success response
                            this.isProceess = false;
                            this.fatchData();
                            this.toastr.success(res.message);
                        },
                        error: (error) => { // Handle error response
                            console.log(error.error.message)
                            this.isProceess = false;
                            this.toastr.error(error.error.message || 'Something went wrong.');
                        },
                        complete: () => { // Called when observable completes
                            console.log('Operation completed');
                            // Perform any final actions here, like logging or cleanup
                        }
                    });

            }
        }).catch(() => { });
    }


    onEdit(dataItem: any) {
        this.isProceess = true;
        const modalRef = this.modalService.open(AddUpdateComponent, { size: "md" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as AddUpdateComponent;
        componentInstance.categoryMaster = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                var model: any = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobileNo: data.mobileNo,
                    checkindate: data.checkindate

                }
                this.masterName = `/booking-details/update-by-id/${dataItem.bookId}`;
                let updateData: any = {
                    url: this.masterName,
                    model: model
                }
                this.isProceess = true;
                this.subscription = this.apiService.update(updateData).pipe(take(1)).subscribe(res => {
                    this.toastr.success(res.message);
                    this.isProceess = false;
                    this.fatchData();
                }, error => {
                    this.toastr.error(error.error.message);
                    this.isProceess = false;
                });
            }
        }).catch(() => { });
    }


    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }
    onViewDetail(dataItem: any) {

        const modalRef = this.modalService.open(ViewBookComponent, { size: "md", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as ViewBookComponent;
        componentInstance.categoryMaster = dataItem;
    }

    onDownload() {
        const exportData = this.data.map(x => {

            return {
                "Id": x.bookId,
                "First Name": x.firstName,
                "Last Name": x.lastName,
                "Mobile No": x.mobileNo,
                "Check In Date": x.checkindate,
                "Booking Date": x.bookingDate,
            }
        });
        const headers = ["Id", "First Name", "Last Name", "Mobile No", "Check In Date", "Booking Date"];
        this.appService.exportAsExcelFile(exportData, "Booking Master", headers);
    }

    // onDelete(dataItem: any) {
    //     this.isProceess = true;
    //     const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    //     if (modalRef) {
    //         this.isProceess = false;
    //     }
    //     else {
    //         this.isProceess = false;
    //     }
    //     var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    //     componentInstance.message = "Are you sure you want to delete this ?";
    //     modalRef.result.then((canDelete: boolean) => {
    //         if (canDelete) {
    //             this.masterName = `/rooms/roomId/${dataItem?.roomId}`;
    //             this.isProceess = true;
    //             this.subscription = this.apiService.deleteID(this.masterName).pipe(take(1)).subscribe(data => {
    //                 this.isProceess = false;
    //                 this.toastr.success(data.message);
    //                 this.fatchData();
    //             }, error => {
    //                 this.isProceess = false;
    //                 this.toastr.error(error.error.message);
    //             });
    //         }
    //     }).catch(() => { });
    // }
    // onbulkUpload() {
    //     this.isProceess = true;
    //     const modalRef = this.modalService.open(BulkUploadComponent, { size: "md", centered: true, backdrop: "static" });
    //     if (modalRef) {
    //         this.isProceess = false;
    //     } else {
    //         this.isProceess = false;
    //     }
    //     var componentInstance = modalRef.componentInstance as BulkUploadComponent;
    //     componentInstance.heading = "Company"
    //     componentInstance.message = "Are you sure you want to delete this ?";
    // }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

}
