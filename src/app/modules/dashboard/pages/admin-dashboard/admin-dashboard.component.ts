import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartType } from 'angular-google-charts';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { ToastrService } from 'ngx-toastr';
import { Subscription, delay, take } from 'rxjs';
import { TickitService } from 'src/app/_api/masters/tickit.service';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { ticketMasterModel } from 'src/app/_models/ticket';
import { AddEditeTicketComponent } from 'src/app/modules/assigne-ticket/components/add-edite-ticket/add-edite-ticket.component';
import { UpdateTicketComponent } from 'src/app/modules/ticket/update-ticket/update-ticket.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

    isProceess: boolean = true;
    userData: any;
    masterName?: any;
    data?: any;
    resolverData: any;
    dateRangeError: boolean = false;

    subscription?: Subscription;
    statuswiseticketscount: any = [];
    ticketassigntousers: any = [];
    recenttickets: any = [];
    ticketOvertheSLAtousers: any = [];
    departmentticketsstatus: any = [];
    epartmentticketsstatus: any = [];
    ticketOvertheSLAcreatedbymedepartmentwise: any = [];
    pieChart = ChartType.PieChart;
    ColumnChart = ChartType.ColumnChart;
    customerdata: any[] = [];
    conversationsdata: any[] = [];
    escalationdata: any[] = [];
    term: any;
    firstAgentResponseData: any;
    data1: any[] = [];
    data2: any[] = [];
    width = 231;
    width1 = 530;
    height = 215;
    width_t = 850;
    height_t = 250;
    title: any;
    selectedValue?: any = 7;
    startDate?: any;
    endDate?: any;

    options = {
        bars: 'vertical',
        legend: { position: 'none' },
        is3D: true,
        vAxis: {
            gridlines: {
                color: 'transparent', // Set gridline color to transparent
            },
        },
        enableInteractivity: false,
    };


    chartOptions = {
        // title: 'Ticket assign to users',
        bars: 'vertical',
        legend: { position: 'none' },
        is3D: true,
        vAxis: {
            gridlines: {
                color: 'transparent', // Set gridline color to transparent
            },
        },
        enableInteractivity: false,
    };

    option = {
        bars: 'vertical',
        legend: { position: 'none' },
        is3D: true,
        vAxis: {
            gridlines: {
                color: 'transparent', // Set gridline color to transparent
            },
        },
        enableInteractivity: false,
    }
    donutOptions = {
        pieHole: 1
    }
    AgentResponsedata1: any;
    graphresolutiondata: any;




    dataQW: any[] = [];
    dataQW1: any[] = [];
    dataQW2: any[] = [];
    columnNames = ['Browser', 'Percentage'];
    options123 = {
        colors: ['#00abc5', '#67BB75', '#E1CE17', '#f3b49f', '#f6c7b6'], is3D: true, vAxis: {
            gridlines: {
                color: 'transparent',
            },
        },
    };

    chartOptionsNew: any;
    chartOptionsNew1: any;
    chartOptionsNew2: any;


    constructor(private titleService: Title,
        private apiService: ApiService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        public masterAPI: TickitService,
        private router: Router,
        private datePipe: DatePipe,) {
        this.titleService.setTitle("CDC - Dashboard");
        const d: any = localStorage.getItem("userData");
        this.userData = JSON.parse(d);

        const oneWeekFromNow = new Date();
        this.endDate = this.datePipe.transform(
            oneWeekFromNow.toISOString().split('T')[0],
            'yyyy-MM-dd'
        );
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
        this.startDate = this.datePipe.transform(
            oneWeekFromNow.toISOString().split('T')[0],
            'yyyy-MM-dd'
        );
    }

    ngOnInit() {

        // this.fatchData();
        // this.GetResolver();
        // this.Recenttickets();


        // if (this.userData?.role?.roleName === 'Admin') {
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        // this.ISAdminFirstAgentResponsedata(model);
        // this.Statuswiseticketscount();
        // this.Ticketassigntousers();
        // this.TicketOvertheSLAtousers();
        this.isAdminconversationsdata(model);
        this.isAdminescalationdata(model);
        this.isAdmincustomerdata(model);
        // }
        // else if (this.userData?.role?.roleName === 'Resolver') {
        //     this.Departmentticketsstatus();
        // }

        // else if (this.userData?.role?.roleName === 'User') {
        //     this.TicketOvertheSLAcreatedbymedepartmentwise();
        // }



    }

    onValueChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        }

        else if (this.selectedValue === 'custom data') {
            return;
        }
        this.isProceess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };

        // this.ISAdminFirstAgentResponsedata(model);
        this.isAdminconversationsdata(model);
        this.isAdminescalationdata(model);
        this.isAdmincustomerdata(model);

        // this.isProceess = false;
    }


    submitDateRange() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };

            // this.ISAdminFirstAgentResponsedata(model);
            this.isAdminconversationsdata(model);
            this.isAdminescalationdata(model);
            this.isAdmincustomerdata(model);
            // this.isProceess = false;

        }
    }



    // ISAdminFirstAgentResponsedata(model: any) {
    //     this.masterName = `/dashboard/firstAgentResponse-data?startDate=${model.startDate}&endDate=${model.endDate}`;

    //     this.isProceess = true;
    //     this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
    //         .subscribe(data => {
    //             this.firstAgentResponseData = data.data;
    //             // Access properties of firstAgentResponseData correctly
    //             this.dataQW = [
    //                 ['< 5', this.firstAgentResponseData.lessThan5mins],
    //                 ['5 - 10', this.firstAgentResponseData.between5to10mins],
    //                 ['10 - 15', this.firstAgentResponseData.between10to15mins],
    //                 ['15 - 20', this.firstAgentResponseData.between15to20mins],
    //                 ['> 20', this.firstAgentResponseData.moreThan20mins]
    //             ];

    //             this.chartOptionsNew = {

    //                 theme: 'light2',
    //                 animationEnabled: true,
    //                 exportEnabled: false,
    //                 axisY: {
    //                     includeZero: true,
    //                     gridThickness: 0,
    //                 },
    //                 data: [{
    //                     type: "column",

    //                     indexLabelFontColor: "#5A5757",
    //                     dataPoints: this.dataQW.map(([label, value], index) => ({
    //                         x: index,
    //                         y: value,
    //                         // indexLabel: label,
    //                         color: this.getColorForColumn(index)

    //                     }))
    //                 }],
    //                 axisX: {
    //                     labelFormatter: function (e: any) {
    //                         const intervals = ['< 5', '5 - 10', '10 - 15', '15 - 20', '> 20'];
    //                         return intervals[e.value];
    //                     }
    //                 }

    //             };

    //             this.ISAdminAgentResponsedata(model)
    //             this.cd.detectChanges();
    //         }, error => {
    //             this.isProceess = false;
    //         })
    // }


    // ISAdminAgentResponsedata(model: any) {
    //     this.masterName = `/dashboard/AgentResponse-data?startDate=${model.startDate}&endDate=${model.endDate}`;

    //     this.isProceess = true;
    //     this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
    //         .subscribe(data => {
    //             this.AgentResponsedata1 = data.data;
    //             this.dataQW1 = [
    //                 ['< 5', this.AgentResponsedata1.lessThan5mins],
    //                 ['5 - 10', this.AgentResponsedata1.between5to10mins],
    //                 ['10 - 15', this.AgentResponsedata1.between10to15mins],
    //                 ['15 - 20', this.AgentResponsedata1.between15to20mins],
    //                 ['> 20', this.AgentResponsedata1.moreThan20mins]
    //             ];

    //             this.chartOptionsNew1 = {

    //                 theme: 'light2',
    //                 animationEnabled: true,
    //                 exportEnabled: false,
    //                 axisY: {
    //                     includeZero: true,
    //                     gridThickness: 0,
    //                 },
    //                 data: [{
    //                     type: "column",
    //                     indexLabelFontColor: "#5A5757",
    //                     dataPoints: this.dataQW1.map(([label, value], index) => ({
    //                         x: index,
    //                         y: value,
    //                         // indexLabel: label,
    //                         color: this.getColorForColumn(index)
    //                     }))
    //                 }],
    //                 axisX: {
    //                     labelFormatter: function (e: any) {
    //                         const intervals = ['< 5', '5 - 10', '10 - 15', '15 - 20', '> 20'];
    //                         return intervals[e.value];
    //                     }
    //                 }
    //             };

    //             this.ISAdmingraphresolutiondata(model);
    //             this.cd.detectChanges();
    //         }, error => {
    //             this.isProceess = false;
    //         })
    // }

    // ISAdmingraphresolutiondata(model: any) {
    //     this.masterName = `/dashboard/graphresolution-data?startDate=${model.startDate}&endDate=${model.endDate}`;

    //     this.isProceess = true;
    //     this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
    //         .subscribe(data => {
    //             this.graphresolutiondata = data.data;
    //             this.dataQW2 = [
    //                 ['< 5', this.graphresolutiondata.lessThan5mins],
    //                 ['5 - 10', this.graphresolutiondata.between5to10mins],
    //                 ['10 - 15', this.graphresolutiondata.between10to15mins],
    //                 ['15 - 20', this.graphresolutiondata.between15to20mins],
    //                 ['> 20', this.graphresolutiondata.moreThan20mins]
    //             ];

    //             const xAxisLabels = ['Less than 5', 'Between 5 to 10', 'Between 10 to 15', 'Between 15 to 20', 'More than 20'];

    //             this.chartOptionsNew2 = {

    //                 theme: 'light2',
    //                 animationEnabled: true,
    //                 // exportEnabled: true,
    //                 axisY: {
    //                     includeZero: true,
    //                     gridThickness: 0,

    //                 },
    //                 data: [{
    //                     type: "column",
    //                     indexLabelFontColor: "#5A5757",
    //                     dataPoints: this.dataQW2.map(([label, value], index) => ({
    //                         x: index,
    //                         y: value,
    //                         //   indexLabel: label,
    //                         color: this.getColorForColumn(index)
    //                     }))
    //                 }],
    //                 axisX: {
    //                     labelFormatter: function (e: any) {
    //                         const intervals = ['< 5', '5 - 10', '10 - 15', '15 - 20', '> 20'];
    //                         return intervals[e.value];
    //                     }
    //                 }
    //             };
    //             this.isProceess = false;
    //             this.cd.detectChanges();
    //         }, error => {
    //             this.isProceess = false;
    //         })
    // }

    getColorForColumn(index: any) {
        var colors = ['#00abc5', '#61B979', '#DBCD1C', '#DF7970', '#BF864D'];
        ;
        return colors[index % colors.length];
    }

    isAdmincustomerdata(model: any) {
        this.masterName = `/dashboard/customer-data?startDate=${model.startDate}&endDate=${model.endDate}`;

        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.customerdata = data.data;
                this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }

    isAdminconversationsdata(model: any) {
        this.masterName = `/dashboard/conversations-data?startDate=${model.startDate}&endDate=${model.endDate}`;

        // this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.conversationsdata = data.data;

                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    isAdminescalationdata(model: any) {
        this.masterName = `/dashboard/escalation-data?startDate=${model.startDate}&endDate=${model.endDate}`;
        // this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.escalationdata = data.data;

                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    get isAdmin() {
        return this.userData?.role?.roleName == 'Admin';
    }
    get isUser() {
        return this.userData?.role?.roleName == 'User';
    }

    get isResolver() {
        return this.userData?.role?.roleName == 'Resolver';
    }

    get isApprover() {
        return this.userData?.role?.roleName == 'Approver';
    }


    TicketOvertheSLAcreatedbymedepartmentwise() {
        this.masterName = `/ticket/department-wise/${this.userData.department.departmentId}/user/${this.userData.userId}`;
        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                console.log(data);
                this.ticketOvertheSLAcreatedbymedepartmentwise = data;
                this.ticketOvertheSLAcreatedbymedepartmentwise = [];
                for (let i in data) {
                    this.ticketOvertheSLAcreatedbymedepartmentwise.push([
                        data[i].departmentName.toString(),
                        data[i].count,
                    ]);
                }
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }
    Departmentticketsstatus() {
        this.masterName = `/ticket/resolver-departmentWiseTicket/${this.userData.department.departmentId}`;
        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.departmentticketsstatus = data;
                this.departmentticketsstatus = [];
                for (let i in data) {
                    this.departmentticketsstatus.push([
                        data[i].name.toString(),
                        data[i].total,
                    ]);
                }

                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }

    onUpdateTicket(dataItem: ticketMasterModel) {
        const modalRef = this.modalService.open(UpdateTicketComponent, { size: "xl" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as UpdateTicketComponent;
        componentInstance.ticketsMaster = dataItem;
        modalRef.result.then((data: ticketMasterModel) => {
            if (data) {
                let Tstatus: any;
                if (this.userData?.role?.roleName !== 'Admin') {
                    Tstatus = dataItem.ticketStatus;
                }
                else {
                    Tstatus = data.ticketStatus;
                }

                var model: any = {
                    createForUser: dataItem.createForUser?.userId,
                    status: dataItem.status,
                    shortNotes: dataItem.shortNotes,
                    assignedTo: data.assignedTo,
                    departmentId: dataItem.department?.departmentId,
                    issueId: dataItem.issue?.issueId,
                    priority: dataItem.priority?.id,
                    alternativeContactNo: dataItem.alternativeContactNo,
                    serviceTitleId: data.serviceTitle,
                    subCategoryId: data.subCategory,
                    categoryId: dataItem.category?.categoryId,
                    emailId: this.userData.email,
                    updatedBy: this.userData.userId,
                    ticketStatus: Tstatus,
                    comment: data.additionalComments || ' '
                }
                let formData = new FormData();
                formData.append('file', data.file);
                formData.append("userData", JSON.stringify(model));
                this.isProceess = true;
                this.subscription = this.masterAPI.updateMasterData(formData, dataItem.ticketId).pipe(take(1)).subscribe(responseData => {
                    if (responseData) {
                        this.toastr.success("Ticket Updated!");
                        this.Recenttickets();
                        // this.isProceess = false;
                    }
                }, error => {
                    this.isProceess = false;
                    this.toastr.error("Error while saving Ticket!");
                });
            }
        }).catch(() => { });
    }


    onUpdateResolverTicket(dataItem: ticketMasterModel) {
        const modalRef = this.modalService.open(AddEditeTicketComponent, { size: "xl" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as AddEditeTicketComponent;
        componentInstance.ticketsMaster = dataItem;
        modalRef.result.then((data: ticketMasterModel) => {
            if (data) {
                var model: any = {
                    createForUser: dataItem.createForUser?.userId,
                    status: dataItem.status,
                    shortNotes: dataItem.shortNotes,
                    assignedTo: data.assignedTo,
                    departmentId: dataItem.department?.departmentId,
                    issueId: dataItem.issue?.issueId,
                    priority: dataItem.priority?.id,
                    alternativeContactNo: dataItem.alternativeContactNo,
                    serviceTitleId: data.serviceTitle,
                    subCategoryId: data.subCategory,
                    categoryId: dataItem.category?.categoryId,
                    emailId: this.userData.email,
                    updatedBy: this.userData.userId,
                    ticketStatus: data.ticketStatus,
                    comment: data.additionalComments || ' '
                }
                let formData = new FormData();
                if (data.file === null) {

                } else {
                    formData.append('file', data.file);
                }
                formData.append("userData", JSON.stringify(model));
                this.isProceess = true;
                this.subscription = this.masterAPI.updateMasterData(formData, dataItem.ticketId).pipe(take(1)).subscribe(responseData => {
                    this.toastr.success("Ticket Updated!");
                    this.Recenttickets();
                }, error => {
                    this.isProceess = false;
                    this.toastr.error("Error while saving Ticket!");
                });
            }
        }).catch(() => { });
    }

    Recenttickets() {
        if (this.userData?.role?.roleName === 'Admin') {
            this.masterName = "/ticket/resentAllTickets";
        }
        else if (this.userData?.role?.roleName === 'Resolver') {
            this.masterName = `/ticket/resentTicketsByAssignedTo/${this?.userData?.userId}`;
        }
        else if (this.userData?.role?.roleName === 'User') {
            this.masterName = `/ticket/resentTicketsBycreatedBy/${this?.userData?.userId}`;
        }
        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.recenttickets = data;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }

    TicketOvertheSLAtousers() {
        this.masterName = "/ticket/SlaOver-counts";

        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.ticketOvertheSLAtousers = data;
                this.ticketOvertheSLAtousers = [];
                for (let i in data) {
                    this.ticketOvertheSLAtousers.push([
                        data[i].firstName.toString() + ' ' + data[i].lastName.toString(),
                        data[i].totalOverCount,
                    ]);
                }
                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    Ticketassigntousers() {
        this.masterName = "/ticket/assignto-counts";

        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(data => {
                this.ticketassigntousers = data;
                this.ticketassigntousers = [];
                for (let i in data) {
                    this.ticketassigntousers.push([
                        data[i].firstName.toString() + ' ' + data[i].lastName.toString(),
                        data[i].totalTicketAssigned,
                    ]);
                }
                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    Statuswiseticketscount() {
        this.masterName = "/ticket/status-count";

        // this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(result => {
                this.statuswiseticketscount = result;
                this.statuswiseticketscount = [];
                for (let row in result) {
                    this.statuswiseticketscount.push([
                        result[row].name.toString(),
                        result[row].total,
                    ]);
                }
                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    fatchData() {
        if (this.userData?.role?.roleName === 'Admin') {
            this.masterName = "/ticket/admin/statistics";
        }
        else if (this.userData?.role?.roleName !== 'Admin') {
            this.masterName = `/ticket/createdBy/statistics/${this.userData?.userId}`;
            this.title = "My Tickets";
        }

        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(result => {
                this.data = result;
                this.data1 = [];
                for (let row in result) {
                    this.data1.push([
                        result[row].name.toString(),
                        result[row].total,
                    ]);
                }
                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }


    GetResolver() {
        if (this.userData?.role?.roleName == 'Resolver' || 'User' || 'Admin') {
            this.masterName = `/ticket/resolver-assigned/statistics/${this.userData.userId}`;
        }
        this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1))
            .subscribe(result => {
                this.resolverData = result;
                this.data2 = [];
                for (let row in result) {
                    this.data2.push([
                        result[row].name.toString(),
                        result[row].total,
                    ]);
                }
                // this.isProceess = false;
                this.cd.detectChanges();
            }, error => {
                this.isProceess = false;
            })
    }
}
