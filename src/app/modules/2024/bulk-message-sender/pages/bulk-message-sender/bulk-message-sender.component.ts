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




    constructor(public whatsappService: WhatsAppService, private toastr: ToastrService, private router: Router,
        private modalService: NgbModal, private apiService: ApiService, private cd: ChangeDetectorRef,

    ) {
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
        this.logInUserName = this.userData.firstName + ' ' + this.userData.lastName;
    }

    ngOnInit(): void {
        this.getContactList();
    }

    sendMessages(dataItem: any) {


        this.masterName = "/customer";
        this.apiService.getAll(this.masterName).pipe(take(1)).subscribe(data => {
            if (data) {
                this.customerData = data;
                // Filter customers by a specific contact
                const filteredCustomers = this.customerData.filter(customer => customer.contact === dataItem.mobile);

                // Log the filtered customers
                const customerId = [filteredCustomers[0].customerId];
                this.router.navigate([`/admin/inbox/${customerId}`]);
                this.cd.detectChanges();
            }
        }, error => {
            this.isProceess = false;
        })


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
                    console.error('Error fetching contact list:', err);
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
        } else if (diffDays === 1) {
            // Add time for "Yesterday"
            const time = givenDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `Yesterday at ${time}`;
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
                next: (response) => {
                    this.toastr.success('Message sent successfully!');
                    this.router.navigate(['/admin/inbox']); // Navigate to inbox

                },
                error: (error) => {
                    this.handleErrors(error);
                },
                complete: () => {
                    this.isProceess = false;
                }
            });
    }

    private handleErrors(error: any) {
        // Handling HTTP status codes for server errors
        if (error.status === 500) {
            if (error.error?.message?.includes('SerializationException')) {
                this.toastr.error('A server issue occurred while processing chat data. Please contact support.', 'Deserialization Error');
            } else {
                this.toastr.error('A server error occurred. Please try again later.', 'Server Error');
            }
        } else if (error.status === 0) {
            // Handling case when no server response (Network error)
            this.toastr.error('No connection to the server. Please check your internet connection and try again.', 'Network Error');
        } else if (error.status === 404) {
            // Server not found
            this.toastr.error('The requested resource was not found. Please check the URL or contact support.', 'Resource Not Found');
        } else if (error.status === 403) {
            // Forbidden access
            this.toastr.error('You do not have permission to access this data. Please contact support.', 'Access Denied');
        } else if (error.status === 408) {
            // Handling Timeout error (Request Timeout)
            this.toastr.error('The server took too long to respond. Please try again later.', 'Request Timeout');
        } else if (error.status === 400) {
            // Bad Request error
            this.toastr.error('The request was invalid. Please check your input and try again.', 'Bad Request');
        } else if (error.status === 401) {
            // Unauthorized access
            this.toastr.error('You are not authorized to access this data. Please log in and try again.', 'Unauthorized');
        } else if (error.status === 429) {
            // Too Many Requests (rate limiting)
            this.toastr.error('You are making too many requests. Please try again later.', 'Rate Limit Exceeded');
        } else if (error.status === 502) {
            // Bad Gateway
            this.toastr.error('There is an issue with the server. Please try again later.', 'Bad Gateway');
        } else if (error.status === 503) {
            // Service Unavailable
            this.toastr.error('The service is temporarily unavailable. Please try again later.', 'Service Unavailable');
        } else if (error.status === 504) {
            // Gateway Timeout
            this.toastr.error('The server took too long to respond. Please try again later.', 'Gateway Timeout');
        } else {
            // General handling for unknown HTTP status errors
            this.toastr.error('Failed to load chat history. Please try again later.', 'Unknown Error');
        }

        // Handling client-side errors or network-related issues
        if (error.name === 'TimeoutError') {
            this.toastr.error('The request timed out. Please try again later.', 'Request Timeout');
        } else if (error.name === 'AbortError') {
            this.toastr.error('The request was aborted. Please try again later.', 'Request Aborted');
        } else if (error.message && error.message.includes('timeout')) {
            this.toastr.error('The request took too long to process. Please try again later.', 'Timeout Error');
        } else if (error.message && error.message.includes('NetworkError')) {
            // Handling network error
            this.toastr.error('A network error occurred. Please check your internet connection and try again.', 'Network Error');
        } else if (error instanceof TypeError) {
            // Handling JavaScript type errors (e.g., undefined or null references)
            this.toastr.error('An unexpected error occurred. Please try again later.', 'Type Error');
        } else if (error instanceof SyntaxError) {
            // Handling syntax errors in the request
            this.toastr.error('There was an issue with the request format. Please try again later.', 'Syntax Error');
        } else if (error instanceof Error) {
            // General handling for generic JavaScript errors
            this.toastr.error(`An unexpected error occurred: ${error.message}. Please try again later.`, 'General Error');
        } else {
            // Catch-all for any other error types
            this.toastr.error('An unknown error occurred. Please try again later.', 'Unknown Error');
        }
    }

    submitForm(form: any) {



        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');

        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = `Are you sure to send text for ${selectedCustomerCount} customer(s)?`;

        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.sendMessage(form, 'text');
            }
        }).catch(() => { });
    }

    submitNoteForm(form: any) {

        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');

        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
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

        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        const selectedContacts = this.contactList.filter(contact => contact.selected);

        let selectedCustomerNames = selectedContacts.map(contact => contact.name).join(', ');
        const selectedCustomerCount = selectedContacts.length;

        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
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
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });

        if (modalRef) {
            this.isProceess = false;
            const componentInstance = modalRef.componentInstance as TempletsComponent;
            componentInstance.issuesMaster = e;
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
                    componentInstance.message = `Are you sure to send template for ${selectedCustomerCount} customer(s)?`;

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
