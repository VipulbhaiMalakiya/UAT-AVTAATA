import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, Subscription, take, throwError } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { OrderUpdateComponent } from '../../components/order-update/order-update.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../../Model/oder-model';
import { AppService } from 'src/app/_services/app.service';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {


    isProceess: boolean = true;
    masterName?: any;
    subscription?: Subscription;
    term: any;
    data: Order[] = [];
    page: number = 1;
    count: number = 0;
    tableSize: number = 7;
    tableSizes: any = [3, 6, 9, 12];

    constructor(private apiService: ApiService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appService: AppService,

    ) { }


    ngOnInit(): void {
        this.fatchData();
    }


    fatchData() {
        this.isProceess = true;
        this.masterName = "/orders/details";
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

    onDownload() {
        let recordNumber = 1;

        const exportData = this.data.map((x) => {
            return x.orderProducts.map(product => {
                const price = parseFloat(product.price) || 0;
                const quantity = product.quantity;

                return {
                    // 'SR.No': (recordNumber++).toString(),
                    // Id: x.id || '',
                    'Order ID': x.orderId || '',
                    'Customer Name': x.customerName || '',
                    'Mobile Number': x.mobileNumber || '',
                    'Delivery Address': x.deliveryAddress || '',
                    'Order Status': x.orderStatus || '',
                    'Order Date': x.orderDate ? new Date(x.orderDate).toLocaleDateString() : '',
                    'Product ID': product.productId || '',
                    'Product Name': product.productName || '',
                    'Product Description': product.productDescription || '',
                    'Price': price.toString(),
                    'Currency': product.currency || '',
                    'Availability': product.availability || '',
                    'Quantity': quantity.toString(),
                    'Total Amount': (quantity * price).toString()
                };
            });
        }).flat();

        const headers = [
            // 'SR.No',
            // 'Id',
            'Order ID',
            'Customer Name',
            'Mobile Number',
            'Delivery Address',
            'Order Status',
            'Order Date',
            'Product ID',
            'Product Name',
            'Product Description',
            'Price',
            'Currency',
            'Availability',
            'Quantity',
            'Total Amount'
        ];

        this.appService.exportAsExcelFile(exportData, 'Order-Details', headers);
    }


    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }

    onTableDataChange(event: any) {
        this.page = event;
    }

    onEdit(dataItem: any) {
        this.isProceess = true;
        const modalRef = this.modalService.open(OrderUpdateComponent, { size: "sm" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as OrderUpdateComponent;
        componentInstance.issuesMaster = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                var model: any = {
                    orderId: dataItem.orderId,
                    Status: data.status,
                }
                this.masterName = `/orders/updateStatus/${model.orderId}/Status/${model.Status}`;
                let updateData: any = {
                    url: this.masterName,
                    model: model
                }
                this.isProceess = true;
                this.subscription = this.apiService.update(updateData)
                    .pipe(
                        take(1),
                        catchError((error) => {
                            // Handle error

                            this.isProceess = false; // Corrected typo
                            this.fatchData(); // Corrected typo

                            // Check if the error response structure is as expected
                            const errorMessage = error.error.message || 'An unexpected error occurred';
                            this.toastr.error(errorMessage, 'Error');

                            return throwError(() => new Error(errorMessage));
                        })
                    )
                    .subscribe(
                        (res: any) => {
                            // Check if the response indicates success
                            if (res?.status === 'success') {
                                this.toastr.success(res.message || 'Update successful!', 'Success');
                            }

                            this.isProceess = false; // Corrected typo
                            this.fatchData(); // Corrected typo
                        },
                        (error) => {
                            console.error('Subscription error:', error);
                            this.isProceess = false; // Corrected typo
                            this.fatchData(); // Corrected typo
                        }
                    );




            }
        }).catch(() => { });
    }

}
