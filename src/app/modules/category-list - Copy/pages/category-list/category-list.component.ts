import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AddEditeCategoryComponent } from '../../components/add-edite-category/add-edite-category.component';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AppService } from 'src/app/_services/app.service';
import { CategoryMasterModel } from 'src/app/_models/category';
import { ViewCategoryComponent } from '../../components/view-category/view-category.component';
import * as moment from 'moment';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { Subscription, delay, take, takeWhile } from 'rxjs';
import { CategoryRepository } from 'src/app/State/repository/category-repository';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit, OnDestroy, AfterViewInit {
    isProceess: boolean = true;
    data: CategoryMasterModel[] = [];
    loading = false;
    error = false;
    isAlive = true;
    subscription?: Subscription;
    term: any;
    userData: any;
    masterName?: any;
    page: number = 1;
    count: number = 0;
    message: any;
    tableSize: number = 10;
    tableSizes: any = [3, 6, 9, 12];
    displayedColumns: string[] = ['index', 'category', 'createdDate', 'createdBy', 'updatedDate', 'updatedBy', 'status', 'action'];
    // dataSource!: MatTableDataSource<any>;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private titleService: Title,
        private appService: AppService,
        private apiService: ApiService,
        private NgRxAPI: CategoryRepository,
        private dialog: MatDialog
    ) {
        this.titleService.setTitle('CDC -Category');
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
    }

    ngOnInit(): void {
        this.fatchData();
    }

    ngAfterViewInit(): void {
        // if (this.sort) {
        //     this.sort.active = 'createdDate'; // Column to sort by
        //     this.sort.direction = 'desc'; // Sort direction (asc or desc)
        // }
        // Ensure sort and paginator are available
        if (this.sort && this.paginator) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;



            // Optional custom sorting logic (you can uncomment and use if needed)
            this.dataSource.sortingDataAccessor = (item, property) => {
                if (property === 'category') {
                    return item.categoryName.toLowerCase(); // Ensure sorting is case-insensitive
                }
                return item[property];
            };
        } else {
            console.error('Sort or paginator not found!');
        }
    }


    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }

    fatchData() {
        this.isProceess = true;
        this.masterName = '/category';
        try {
            this.subscription = this.apiService
                .getAll(this.masterName)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.data = response;
                        this.dataSource = new MatTableDataSource(this.data);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;

                        this.count = this.data.length;
                        this.isProceess = false;
                        this.cd.detectChanges();
                    },
                    (error) => {
                        console.error('Error fetching items:', error);
                        this.isProceess = false;
                    }
                );
        } catch (error) {
            console.error('An error occurred:', error);
            this.isProceess = false;
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    trackByFn(index: number, item: any): number {
        return item.categoryId;
    }

    onTableDataChange(event: any) {
        this.page = event;
    }
    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }

    // onAdd() {
    //     this.isProceess = true;
    //     const modalRef = this.modalService.open(AddEditeCategoryComponent, {
    //         size: 'sm',
    //     });
    //     if (modalRef) {
    //         this.isProceess = false;
    //     } else {
    //         this.isProceess = false;
    //     }
    //     modalRef.result
    //         .then((data: CategoryMasterModel) => {
    //             if (data) {
    //                 var model: CategoryMasterModel = {
    //                     categoryName: data.categoryName.trim(),
    //                     createdBy: this.userData.userId,
    //                     status: data.status,
    //                 };
    //                 this.masterName = `/category`;
    //                 let addData: any = {
    //                     url: this.masterName,
    //                     model: model,
    //                 };
    //                 this.isProceess = true;
    //                 this.subscription = this.apiService
    //                     .add(addData)
    //                     .pipe(take(1))
    //                     .subscribe(
    //                         (response) => {
    //                             this.isProceess = false;
    //                             this.fatchData();
    //                             this.message = response.message;
    //                             this.toastr.success(this.message);
    //                         },
    //                         (error) => {
    //                             this.isProceess = false;
    //                             this.toastr.error(error.messages);
    //                         }
    //                     );
    //             }
    //         })
    //         .catch(() => { });
    // }
    // onEdit(dataItem: CategoryMasterModel) {
    //     this.isProceess = true;
    //     const modalRef = this.modalService.open(AddEditeCategoryComponent, {
    //         size: 'sm',
    //     });
    //     if (modalRef) {
    //         this.isProceess = false;
    //     } else {
    //         this.isProceess = false;
    //     }
    //     var componentInstance =
    //         modalRef.componentInstance as AddEditeCategoryComponent;
    //     componentInstance.categoryMaster = dataItem;
    //     modalRef.result
    //         .then((data: CategoryMasterModel) => {
    //             if (data) {
    //                 var model: CategoryMasterModel = {
    //                     updatedBy: this.userData.userId,
    //                     categoryName: data.categoryName.trim(),
    //                     status: data.status,
    //                     categoryId: dataItem.categoryId,
    //                 };
    //                 this.masterName = `/category/${dataItem?.categoryId}`;
    //                 let updateData: any = {
    //                     url: this.masterName,
    //                     model: model,
    //                 };
    //                 this.isProceess = true;
    //                 this.subscription = this.apiService
    //                     .update(updateData)
    //                     .pipe(take(1))
    //                     .subscribe(
    //                         (res) => {
    //                             this.toastr.success(res.message);
    //                             this.isProceess = false;
    //                             this.fatchData();
    //                         },
    //                         (error) => {
    //                             this.toastr.error(error.messages);
    //                             this.isProceess = false;
    //                         }
    //                     );
    //             }
    //         })
    //         .catch(() => { });
    // }

    // onViewDetail(dataItem: CategoryMasterModel) {
    //     this.isProceess = true;
    //     const modalRef = this.modalService.open(ViewCategoryComponent, {
    //         size: 'lg',
    //         centered: true,
    //         backdrop: 'static',
    //     });
    //     if (modalRef) {
    //         this.isProceess = false;
    //     } else {
    //         this.isProceess = false;
    //     }
    //     var componentInstance = modalRef.componentInstance as ViewCategoryComponent;
    //     componentInstance.categoryMaster = dataItem;
    // }

    onAdd() {
        this.isProceess = true;

        const dialogRef = this.dialog.open(AddEditeCategoryComponent, {
            width: '400px'   // Adjust the size
        });

        dialogRef.afterClosed().subscribe((data: CategoryMasterModel) => {
            if (data) {
                const model: CategoryMasterModel = {
                    categoryName: data.categoryName.trim(),
                    createdBy: this.userData.userId,
                    status: data.status,
                };

                this.apiService.add({ url: `/category`, model })
                    .pipe(take(1))
                    .subscribe(
                        (response) => {
                            this.toastr.success(response.message);
                            this.fatchData();  // Refresh data
                            dialogRef.close();  // Close the dialog only after success
                        },
                        (error) => {
                            this.toastr.error(error.message || 'Error occurred');
                        }
                    );
            }
            this.isProceess = false;
        });
    }

    onEdit(dataItem: CategoryMasterModel) {
        this.isProceess = true;

        const dialogRef = this.dialog.open(AddEditeCategoryComponent, {
            width: '400px',
            data: { categoryMaster: dataItem }  // Passing data for editing
        });

        dialogRef.afterClosed().subscribe((data: CategoryMasterModel) => {
            // Check if data exists and compare with initial data
            if (data && (data.categoryName.trim() !== dataItem.categoryName || data.status !== dataItem.status)) {
                const model: CategoryMasterModel = {
                    updatedBy: this.userData.userId,
                    categoryName: data.categoryName.trim(),
                    status: data.status,
                    categoryId: dataItem.categoryId,
                };

                this.apiService.update({ url: `/category/${dataItem.categoryId}`, model })
                    .pipe(take(1))
                    .subscribe(
                        (response) => {
                            this.toastr.success(response.message);
                            this.fatchData();  // Refresh data
                            dialogRef.close();  // Close the dialog only after success
                        },
                        (error) => {
                            this.toastr.error(error.message || 'Error occurred');
                        }
                    );
            } else {
                // If no data change, just close the dialog without making the API call
                dialogRef.close();
                this.isProceess = false;  // Ensure the processing state is cleared
            }
        });
    }




    onViewDetail(dataItem: CategoryMasterModel): void {
        this.isProceess = true;

        // Open the dialog with the specified component and configuration
        const dialogRef = this.dialog.open(ViewCategoryComponent, {
            width: '700px', // Equivalent to 'lg' size in ng-bootstrap
            disableClose: true, // Equivalent to 'backdrop: static'
            data: { categoryMaster: dataItem }, // Pass data to the dialog
        });

        // Handle dialog close event to reset processing status
        dialogRef.afterClosed().subscribe(() => {
            this.isProceess = false;
        });
    }
    onDelete(dataItem: CategoryMasterModel) {
        this.isProceess = true;
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, {
            size: 'sm',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance =
            modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = 'Are you sure you want to delete this Delete ?';
        modalRef.result
            .then((canDelete: boolean) => {
                if (canDelete) {
                    this.masterName = `/category/${dataItem?.categoryId}`;
                    this.isProceess = true;
                    this.subscription = this.apiService
                        .deleteID(this.masterName)
                        .pipe(take(1))
                        .subscribe(
                            (res) => {
                                this.isProceess = false;
                                this.toastr.success(res.message);
                                this.fatchData();
                            },
                            (error) => {
                                this.isProceess = false;
                                this.toastr.error(error.message);
                            }
                        );
                }
            })
            .catch(() => { });
    }
    onDownload() {
        const exportData = this.data.map((x) => {
            let updatedBy: any = ' ';
            if (x.updatedBy?.firstName != undefined) {
                updatedBy = x.updatedBy?.firstName + ' ' + x.updatedBy?.lastName;
            } else {
                updatedBy = '';
            }
            return {
                Id: x.categoryId || '',
                'Category Name': x.categoryName || '',
                'Created By':
                    x.createdBy?.firstName + ' ' + x.createdBy?.lastName || '',
                'Created Date': moment(x.createdDate || '').format('llll'),
                'Updated By': updatedBy,
                'Updated Date': moment(x.updatedDate || '').format('llll'),
                Status: x.status ? 'Active' : 'Deactivate',
            };
        });
        const headers = [
            'Id',
            'Category Name',
            'Created By',
            'Created Date',
            'Updated By',
            'Updated Date',
            'Status',
        ];
        this.appService.exportAsExcelFile(exportData, 'Category-Master', headers);
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
