import { Component, OnInit, OnDestroy } from '@angular/core';
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
        this.whatsappService.activeContactList()
            .pipe(takeUntil(this.destroy$)).subscribe({
                next: (response: any[]) => {
                    const contactLists = response;

                    // Safely access 'open' property of the first contact or fallback to an empty array
                    this.open = contactLists[0]?.open ?? [];

                    // Get the current time and calculate the threshold (24 hours ago)
                    const now = new Date();
                    const threshold = now.getTime() - (24 * 60 * 60 * 1000); // 24 hours ago in milliseconds

                    // Filter the open array to include only entries before 24 hours
                    // this.contactList = this.open.filter((contact: any) => {
                    //     const contactTime = new Date(contact.time).getTime();
                    //     return contactTime >= threshold;
                    // });

                    this.contactList = this.open
                        .filter((contact: any) => {
                            const contactTime = new Date(contact.time).getTime();
                            return contactTime >= threshold;
                        })
                        .sort((a: any, b: any) => {
                            // Assuming the contact has a 'name' property to sort alphabetically
                            const nameA = a.fullName.toLowerCase(); // Convert to lower case for case-insensitive comparison
                            const nameB = b.fullName.toLowerCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0; // If names are equal, return 0
                        });

                    this.isProceess = false;  // End processing flag
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
        this.isProceess = true; // Indicate the process has started.

        const selectedContacts = this.contactList.filter(contact => contact.selected);

        // Track the number of API calls
        let successCount = 0;
        let errorCount = 0;
        let processedCount = 0; // Track the total number of processed API calls

        selectedContacts.forEach(contact => {
            // Create a request for each selected contact

            let request: any;
            if (type == 'text') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,
                    type: 'text',
                    fromId: this.userData?.userId,
                    logInUserName: this.logInUserName,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
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
                    to: contact.phoneNo,
                    type: 'text',
                    fromId: this.userData?.userId,
                    logInUserName: this.logInUserName,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
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
                    to: contact.phoneNo,  // Sending to the contact's phone number
                    type: 'interactive',
                    fromId: this.userData?.userId,
                    logInUserName: this.logInUserName,
                    assignedto: this.userData?.userId,
                    fullname: contact.fullName || null,
                    interactiveName: form,  // Sending catalog name
                };
            }

            else if (type == 'template') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,  // Sending to the contact's phone number
                    type: 'template',
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    fullname: contact.fullName || null,
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
                    to: contact.phoneNo,  // Sending to the contact's phone number
                    type: 'audio',
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
                    logInUserName: form.logInUserName,
                };
            }
            else if (type == 'video') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,
                    type: 'video',
                    caption: form.caption,
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
                    logInUserName: this.logInUserName,
                };
            }

            else if (type == 'image') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,
                    type: 'image',
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
                    logInUserName: this.logInUserName,
                };
            }
            else if (type == 'document') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,
                    type: 'document',
                    caption: form.caption,
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
                    logInUserName: this.logInUserName,
                };
            }
            else if (type == 'location') {
                request = {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: contact.phoneNo,
                    type: 'location',
                    fromId: this.userData?.userId,
                    assignedto: this.userData?.userId,
                    names: contact.fullName || null,
                    latitude: form.latitude,
                    longitude: form.longitude,
                    locationAddress: form.address,
                    locationName: form.locationName,
                    logInUserName: this.logInUserName,
                };
            }


            let formData = new FormData();
            formData.append('messageEntry', JSON.stringify(request));

            form.file && formData.append('file', form.file);

            // Make the API call for each selected contact
            this.whatsappService.sendWhatsAppMessage(formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => {
                        let data: any = response;
                        successCount++; // Increment success count
                        this.toastr.success(data.message); // Show success notification
                        const audio = new Audio('../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3');
                        audio.play();
                    },
                    error: (error) => {
                        errorCount++; // Increment error count
                        this.toastr.error(error.error.message); // Show error notification
                    },
                    complete: () => {
                        processedCount++; // Increment processed count
                        if (processedCount === selectedContacts.length) {
                            // If all API calls are processed
                            this.isProceess = false; // Mark process as complete

                            if (successCount === selectedContacts.length) {
                                // If all requests were successful
                                this.router.navigate(['/admin/inbox']); // Navigate to inbox
                                this.message = ''; // Clear the message field
                                this.contactList.forEach(contact => contact.selected = false); // Unselect all contacts
                            } else {
                                this.toastr.warning(
                                    `${successCount} ${type} messages sent successfully. ${errorCount} failed.`
                                );
                            }
                        }
                    },
                });
        });
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
                    this.message = data;
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
