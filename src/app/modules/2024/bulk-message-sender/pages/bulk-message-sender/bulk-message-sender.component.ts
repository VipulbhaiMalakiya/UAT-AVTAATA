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
import { BulkMessageErrorComponent } from '../../bulk-message-error/bulk-message-error.component';
import { AppService } from 'src/app/_services/app.service';
import { error } from 'jquery';
import { SendMessagesDialogComponent } from 'src/app/modules/shared/components/send-messages-dialog/send-messages-dialog.component';

@Component({
    selector: 'app-bulk-message-sender',
    templateUrl: './bulk-message-sender.component.html',
    styleUrls: ['./bulk-message-sender.component.css']
})

export class BulkMessageSenderComponent implements OnInit, OnDestroy {
    term: any;
    contactList: any[] = [];
    open: any = [];
    message: string = '';
    showupload = false;

    userData: any;
    isProceess: boolean = true;
    isAllSelected = false;
    logInUserName: any;
    isCartPopupOpen: boolean = false;
    searchTerm: string = ''; // Variable to hold the search term
    maxSelection = 100;

    masterName?: any;
    customerData: any[] = [];


    private destroy$ = new Subject<void>();

    page: number = 1;
    count: number = 0;
    tableSize: number = 10;
    tableSizes: any = [3, 6, 9, 12];


    constructor(public whatsappService: WhatsAppService, private toastr: ToastrService, private router: Router,
        private modalService: NgbModal, private apiService: ApiService, private cd: ChangeDetectorRef,
        private appService: AppService,

    ) {
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
        this.logInUserName = this.userData.firstName + ' ' + this.userData.lastName;
    }

    ngOnInit(): void {
        this.getContactList();
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

        // Call the function to get the observable and then subscribe to it
        this.whatsappService.last24hours()
            .pipe(takeUntil(this.destroy$)).subscribe({
                next: (response: any) => {
                    const contactLists = response.data;
                    // Sort the contact list by lastMessageTime in descending order
                    this.contactList = contactLists.sort((a: any, b: any) =>
                        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                    );

                    this.isProceess = false; this.isProceess = false;
                },
                error: (err) => {
                    // console.log(err.error.message)
                    this.toastr.error(err.error.message, 'error');
                    this.isProceess = false;
                },
                complete: () => {
                    console.log('Contact list fetch completed.');
                }
            });
    }
    // Getter to filter contacts based on the search term
    get filteredContactList() {
        return this.contactList.filter(contact =>
            contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            contact.mobile.includes(this.searchTerm)
        );
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


    // Method to toggle "Check All" checkbox
    toggleSelectAll(): void {
        if (this.isAllSelected) {
            const canSelectCount = this.maxSelection - this.selectedCustomersCount;
            let count = 0;
            this.filteredContactList.forEach(contact => {
                if (!contact.selected && count < canSelectCount) {
                    contact.selected = true;
                    count++;
                } else if (count >= canSelectCount) {
                    this.isAllSelected = false;
                }
            });
        } else {
            this.filteredContactList.forEach(contact => (contact.selected = false));
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


    quickReply() {
        this.showupload = false;
        this.isCartPopupOpen = false;
        const modalRef = this.modalService.open(QuickReplyComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                this.message = data;
            })
            .catch(() => { });

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
                name: contact.name,
                number: contact.mobile
            }
            // Push the request into the allRequests array
            allRequests.push(contactList);

        });



        let request: any;
        if (type == 'text') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'text',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                text: {
                    preview_url: false,
                    body: form.value.chat
                },
            };
        }
        else if (type == 'notes') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'notes',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                text: {
                    preview_url: false,
                    body: form.value.note,
                },
            };
        }

        else if (type == 'interactive') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'interactive',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                interactiveName: form,  // Sending catalog name
            };
        }

        else if (type == 'template') {
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

        else if (type == 'audio') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'audio',
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                logInUserName: form.logInUserName,
            };
        }
        else if (type == 'video') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'video',
                caption: form.caption,
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                logInUserName: this.logInUserName,
            };
        }

        else if (type == 'image') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'image',
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                logInUserName: this.logInUserName,
            };
        }
        else if (type == 'document') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'document',
                caption: form.caption,
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                logInUserName: this.logInUserName,
            };
        }
        else if (type == 'location') {
            request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                type: 'location',
                fromId: this.userData?.userId,
                assignedto: this.userData?.userId,
                latitude: form.latitude,
                longitude: form.longitude,
                locationAddress: form.address,
                locationName: form.locationName,
                logInUserName: this.logInUserName,
            };
        }


        const formData = new FormData();
        formData.append('messageEntry', JSON.stringify(request));
        formData.append('contactList', JSON.stringify(allRequests));
        form.file && formData.append('file', form.file);


        this.whatsappService.sendBroadcastMessage(formData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {

                    if (response) {
                        this.toastr.success(response.message);
                        if (response.sentDetails.length >= 0) {
                            this.isProceess = true;
                            const modalRef = this.modalService.open(BulkMessageErrorComponent, { size: "xl" });
                            if (modalRef) {
                                this.isProceess = false;
                            }
                            else {
                                this.isProceess = false;
                            }

                            var componentInstance = modalRef.componentInstance as BulkMessageErrorComponent;
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
                    this.toastr.error(error.error.message, 'error');

                    this.isProceess = false;
                },
                complete: () => {
                    this.isProceess = false;
                }
            });
    }



    submitForm(form: any) {



        const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');

        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;


        componentInstance.message = `This action will send the text to  ${selectedCustomerCount} customers.Would you like to continue ?`;

        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.sendMessage(form, 'text');
            }
        }).catch(() => { });
    }

    submitNoteForm(form: any) {

        const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');

        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
        componentInstance.message = `Are you sure to send notes for ${selectedCustomerCount} customer(s)?`;

        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.sendMessage(form, 'notes');
            }
        }).catch(() => { });
    }



    // This method will be triggered to open/close the popup
    toggleCartPopup() {
        this.isCartPopupOpen = !this.isCartPopupOpen;
    }


    toggleupload() {
        this.isCartPopupOpen = false;
        this.showupload = !this.showupload;
    }

    closeUploadTray() {
        this.showupload = false;
        // this.isCartPopupOpen = false;
    }
    closeUploadTray1() {
        // this.showupload = false;
        this.isCartPopupOpen = false;
    }
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const attachTray = document.getElementById('attach-tray');
        if (attachTray && !attachTray.contains(event.target as Node)) {
            this.closeUploadTray();
        }

        const attachTray1 = document.getElementById('attach-tray1');
        if (attachTray1 && !attachTray1.contains(event.target as Node)) {
            this.closeUploadTray1();
        }

    }
    sendingCatalog(e: any) {
        this.showupload = false;
        this.isCartPopupOpen = false;

        const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');
        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
        componentInstance.message = `Are you sure to send interactive for ${selectedCustomerCount} customer(s)?`;

        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.sendMessage(e, 'interactive');
            }
        }).catch(() => { });

    }



    documentAdd() {
        this.showupload = false;
        const modalRef = this.modalService.open(DocumentComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {

                    this.showupload = false;
                    this.isCartPopupOpen = false;

                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `Are you sure to send document for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'document');
                        }
                    }).catch(() => { });
                }
            })
            .catch(() => { });
    }

    onLocationAdd() {
        this.showupload = false;
        const modalRef = this.modalService.open(LocationDetailsComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    // this.sendMessage(data, 'location');

                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `Are you sure to send location for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'location');
                        }
                    }).catch(() => { });
                }
            })
            .catch(() => { });
    }

    onimageAdd() {
        this.showupload = false;
        const modalRef = this.modalService.open(ImageUplodComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    // this.sendMessage(data, 'image');

                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `Are you sure to send image for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'image');
                        }
                    }).catch(() => { });
                }
            })
            .catch(() => { });
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

            const apiData: any = 'all'
            componentInstance.issuesMaster = { eventData: e, apiData };
            modalRef.result
                .then((data: any) => {
                    // this.message = data;
                    // this.sendMessage(data, 'template');

                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `This action will send the marketing campaign to ${selectedCustomerCount} customers.Would you like to continue?`;

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

    onaudioAdd() {
        this.showupload = false;
        const modalRef = this.modalService.open(AudioComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    // this.sendMessage(data, 'audio');

                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `Are you sure to send audio message for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'audio');
                        }
                    }).catch(() => { });
                }
            })
            .catch(() => { });
    }

    onvideoAdd() {
        this.showupload = false;

        const modalRef = this.modalService.open(VideoComponent, {
            size: 'md',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    // this.sendMessage(data, 'video');


                    const modalRef = this.modalService.open(SendMessagesDialogComponent, { size: "sm", centered: true, backdrop: "static" });
                    if (modalRef) {
                        this.isProceess = false;
                    }
                    else {
                        this.isProceess = false;
                    }
                    const selectedContacts = this.contactList.filter(contact => contact.selected);
                    const selectedCustomerCount = selectedContacts.length;


                    var componentInstance = modalRef.componentInstance as SendMessagesDialogComponent;
                    componentInstance.message = `Are you sure to send video message for ${selectedCustomerCount} customer(s)?`;

                    modalRef.result.then((canDelete: boolean) => {
                        if (canDelete) {
                            this.sendMessage(data, 'video');
                        }
                    }).catch(() => { });
                }
            })
            .catch(() => { });
    }
}
