import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { AudioComponent } from 'src/app/modules/chat/components/audio/audio.component';
import { DocumentComponent } from 'src/app/modules/chat/components/document/document.component';
import { ImageUplodComponent } from 'src/app/modules/chat/components/image-uplod/image-uplod.component';
import { LocationDetailsComponent } from 'src/app/modules/chat/components/location-details/location-details.component';
import { QuickReplyComponent } from 'src/app/modules/chat/components/quick-reply/quick-reply.component';
import { TempletsComponent } from 'src/app/modules/chat/components/templets/templets.component';
import { VideoComponent } from 'src/app/modules/chat/components/video/video.component';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { MarketingCampaignErrorComponent } from '../../marketing-campaign-error/marketing-campaign-error.component';

@Component({
    selector: 'app-marketing-campaign',
    templateUrl: './marketing-campaign.component.html',
    styleUrls: ['./marketing-campaign.component.css']
})
export class MarketingCampaignComponent implements OnInit, OnDestroy {
    term: any;
    contactList: any[] = [];
    allContacts: any[] = [];
    open: any = [];
    message: string = '';
    showupload = false;

    userData: any;
    isProceess: boolean = true;
    isAllSelected = false;
    logInUserName: any;
    isCartPopupOpen: boolean = false;
    searchTerm: string = '';
    private destroy$ = new Subject<void>();


    selectedValue?: any = 7;
    startDate?: any;
    endDate?: any;
    dateRangeError: boolean = false;

    maxSelection = 100;

    masterName?: any;
    customerData: any[] = [];

    page: number = 1;
    count: number = 0;
    tableSize: number = 10;
    tableSizes: any = [3, 6, 9, 12];


    constructor(public whatsappService: WhatsAppService, private toastr: ToastrService, private router: Router,
        private modalService: NgbModal, private datePipe: DatePipe,
        private apiService: ApiService, private cd: ChangeDetectorRef,


    ) {
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
        this.logInUserName = this.userData.firstName + ' ' + this.userData.lastName;


    }

    ngOnInit(): void {
        this.getContactList();
    }





    // Getter for total customers
    get totalCustomers(): number {
        return this.contactList.length;
    }

    // Getter for selected customers count
    get selectedCustomersCount(): number {
        return this.contactList.filter(contact => contact.selected).length;
    }
    ngOnDestroy(): void {
        this.destroy$.next(); // Emit a value to complete all subscriptions
        this.destroy$.complete(); // Complete the subject
    }

    selectedContacts() {
        return this.contactList.filter(contact => contact.selected);
    }
    getContactList() {
        this.isProceess = true;


        this.isProceess = true;
        this.masterName = "/customer";
        this.apiService.getAll(this.masterName).pipe(take(1)).subscribe(data => {
            if (data) {
                this.contactList = data;
                this.count = this.contactList.length;
                this.isProceess = false;
                this.cd.detectChanges();
            }
        }, error => {
            this.isProceess = false;
        })
        // this.whatsappService.activeContactList()
        //     .pipe(
        //         takeUntil(this.destroy$)
        //     )
        //     .subscribe({
        //         next: (response: any[]) => {
        //             const contactLists = response;
        //             const allContacts = [
        //                 ...contactLists[0]?.open ?? [],
        //                 ...contactLists[0]?.closed ?? [],
        //                 ...contactLists[0]?.missed ?? []
        //             ];



        //             const uniqueContacts = Array.from(new Set(allContacts.map(c => c.phoneNo)))
        //                 .map(phoneNo => allContacts.find(contact => contact.phoneNo === phoneNo))
        //                 .sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime());


        //             // Assign to the main array
        //             this.contactList = uniqueContacts;

        //             // Store all contacts for future filtering
        //             this.allContacts = this.contactList;
        //             this.count = this.allContacts.length;



        //         },
        //         error: (err) => {
        //             console.error('Error fetching contact list:', err);
        //             this.isProceess = false;
        //         },
        //         complete: () => {
        //             console.log('Contact list fetching completed.');
        //             this.isProceess = false;
        //         }
        //     });



    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }


    onTableDataChange(event: any) {
        this.page = event;
    }
    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }

    // Getter to filter contacts based on the search term
    get filteredContactList() {
        return this.contactList.filter(contact =>
            contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            contact.contact.includes(this.searchTerm)
        );
    }




    toggleSelectAll(): void {
        if (this.isAllSelected) {
            const canSelectCount = this.maxSelection - this.selectedCustomersCount;
            let count = 0;

            this.filteredContactList.forEach(contact => {
                if (!contact.selected && count < canSelectCount && !this.isWithinLast24Hours(contact.time)) {
                    contact.selected = true;
                    count++;
                }
            });

            // If we couldn't select all due to restrictions, reset the "Select All" checkbox
            this.isAllSelected = this.filteredContactList.every(
                contact => contact.selected || this.isWithinLast24Hours(contact.time)
            );
        } else {
            // Deselect all contacts except those within the last 24 hours
            this.filteredContactList.forEach(contact => {
                if (!this.isWithinLast24Hours(contact.time)) {
                    contact.selected = false;
                }
            });
        }
    }




    onCheckboxChange(contact: any): void {
        const selectedCount = this.selectedCustomersCount;
        if (contact.selected && selectedCount > this.maxSelection) {
            contact.selected = false;
            alert('You can select a maximum of 5 customers.');
        }
        this.isAllSelected =
            this.filteredContactList.every(contact => contact.selected) && selectedCount <= this.maxSelection;
    }


    isWithinLast24Hours(time: string): boolean {
        const contactTime = new Date(time).getTime();
        const currentTime = Date.now();
        const hoursDifference = (currentTime - contactTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        return hoursDifference <= 24;
    }

    sendMessage(form: any, type: 'text' | 'notes' | 'interactive' | 'template' | 'audio' | 'video' | 'image' | 'document' | 'location') {
        this.isProceess = true; // Indicate the process has started.

        const selectedContacts = this.contactList.filter(contact => contact.selected);
        const allRequests: any[] = []; // Array to store all requests


        // let request: any;
        selectedContacts.forEach(contact => {
            let contactList: any;
            // Create a request for each selected contact
            contactList = {

                name: contact.firstName,
                number: contact.contact
            }
            // Push the request into the allRequests array
            allRequests.push(contactList);

        });



        let request: any;


        if (type == 'template') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'template',
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                templateName: form.templateName,
                templateBody: form.templateBody,
                templateHeader: form.templateHeader,
                logInUserName: form.logInUserName,
            };
        }


        const formData = new FormData();
        formData.append('messageEntry', JSON.stringify(request));
        formData.append('contactList', JSON.stringify(allRequests));
        form.file && formData.append('file', form.file);


        this.whatsappService.sendMarketingCampaign(formData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {

                    if (response) {
                        this.toastr.success(response.message);

                        if (response.sentDetails.length >= 0) {

                            this.isProceess = true;
                            const modalRef = this.modalService.open(MarketingCampaignErrorComponent, { size: "xl" });
                            if (modalRef) {
                                this.isProceess = false;
                            }
                            else {
                                this.isProceess = false;
                            }

                            var componentInstance = modalRef.componentInstance as MarketingCampaignErrorComponent;
                            componentInstance.customersMaster = response.sentDetails;

                            modalRef.result.then((data: any) => {
                                if (data) {

                                }
                            }).catch(() => {
                                this.router.navigate(['/admin/inbox']); // Navigate to inbox

                            });
                        }

                    }





                },
                error: (error) => {
                    this.isProceess = false;

                },
                complete: () => {
                    this.isProceess = false;
                }
            });
    }




    getTemplates(e: any) {
        this.isCartPopupOpen = false;
        const modalRef = this.modalService.open(TempletsComponent, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
        });

        if (modalRef) {
            this.isProceess = false;
            const componentInstance = modalRef.componentInstance as TempletsComponent;
            const apiData: any = 'marketing'
            componentInstance.issuesMaster = { eventData: e, apiData };

            modalRef.result
                .then((data: any) => {
                    // this.message = data;
                    // this.sendMessage(data, 'template');

                    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
                    componentInstance.message = `Are you sure to send marketing Campaign for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'template');
                        }
                    }).catch(() => { });

                })
                .catch(() => { });
        } else {
            console.error('Failed to open modal: modalRef is undefined.');
            this.isProceess = false;
        }

    }


    formatDate(date: string | Date): string {
        const now = new Date();
        const givenDate = new Date(date);

        const diffTime = now.getTime() - givenDate.getTime(); // Difference in milliseconds
        const diffMinutes = Math.floor(diffTime / (1000 * 60)); // Difference in minutes
        const diffHours = Math.floor(diffMinutes / 60); // Difference in hours
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // Difference in days

        if (diffDays === 0) {
            if (diffHours > 0) {
                return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffMinutes > 0) {
                return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
            } else {
                return 'Just now';
            }
        } else {
            // For dates older than yesterday, include both date and time
            const dateString = givenDate.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            const timeString = givenDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `${dateString} at ${timeString}`;
        }
    }



}
