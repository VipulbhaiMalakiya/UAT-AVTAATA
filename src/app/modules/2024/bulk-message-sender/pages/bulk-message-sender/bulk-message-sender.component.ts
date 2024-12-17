import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { AudioComponent } from 'src/app/modules/chat/components/audio/audio.component';
import { DocumentComponent } from 'src/app/modules/chat/components/document/document.component';
import { ImageUplodComponent } from 'src/app/modules/chat/components/image-uplod/image-uplod.component';
import { LocationDetailsComponent } from 'src/app/modules/chat/components/location-details/location-details.component';
import { QuickReplyComponent } from 'src/app/modules/chat/components/quick-reply/quick-reply.component';
import { TempletsComponent } from 'src/app/modules/chat/components/templets/templets.component';
import { VideoComponent } from 'src/app/modules/chat/components/video/video.component';

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


    private destroy$ = new Subject<void>();




    constructor(public whatsappService: WhatsAppService, private toastr: ToastrService, private router: Router,
        private modalService: NgbModal,

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

    formatDate(contactTime: string): string {
        const now = new Date();
        const date = new Date(contactTime);

        const differenceInMilliseconds = now.getTime() - date.getTime();
        const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000); // difference in minutes
        const differenceInHours = Math.floor(differenceInMinutes / 60); // difference in hours
        const differenceInDays = Math.floor(differenceInHours / 24); // difference in days

        if (differenceInHours === 0) {
            if (differenceInMinutes < 1) {
                return `${differenceInMilliseconds / 1000} seconds ago`; // Show seconds if < 1 minute
            } else {
                return `${differenceInMinutes} minutes ago`; // Show minutes if < 1 hour
            }
        } else if (differenceInHours < 24) {
            return `${differenceInHours} hours ago`;
        } else if (differenceInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: true });
        }
    }


    // Method to toggle "Check All" checkbox
    toggleSelectAll() {
        this.contactList.forEach(contact => {
            contact.selected = this.isAllSelected;
        });
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
        // this.isProceess = true; // Indicate the process has started.

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
                type: 'text',
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

        console.log('All Requests:', allRequests);
        console.log(' Requests:', request);


        // allRequests.forEach(request => {
        //     const formData = new FormData();
        //     formData.append('messageEntry', JSON.stringify(request));
        //     form.file && formData.append('file', form.file);

        //     this.whatsappService.sendWhatsAppMessage(formData)
        //         .pipe(takeUntil(this.destroy$))
        //         .subscribe({
        //             next: (response) => {
        //                 this.toastr.success('Message sent successfully!');
        //                 this.router.navigate(['/admin/inbox']); // Navigate to inbox

        //             },
        //             error: (error) => {
        //                 this.handleErrors(error);
        //             },
        //             complete: () => {
        //                 this.isProceess = false;
        //             }
        //         });
        // });
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
        this.sendMessage(form, 'text');
    }

    submitNoteForm(form: any) {
        this.sendMessage(form, 'notes');
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
        this.sendMessage(e, 'interactive');
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
                    this.sendMessage(data, 'document');
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
                    this.sendMessage(data, 'location');
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
                    this.sendMessage(data, 'image');
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
                    this.sendMessage(data, 'template');

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
                    this.sendMessage(data, 'audio');
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
                    this.sendMessage(data, 'video');
                }
            })
            .catch(() => { });
    }
}
