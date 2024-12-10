import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { QuickReplyComponent } from 'src/app/modules/chat/components/quick-reply/quick-reply.component';

@Component({
    selector: 'app-bulk-message-sender',
    templateUrl: './bulk-message-sender.component.html',
    styleUrls: ['./bulk-message-sender.component.css']
})

export class BulkMessageSenderComponent implements OnInit, OnDestroy {
    term: any;
    subscription?: Subscription;
    contactList: any[] = [];
    open: any = [];
    message: string = '';

    userData: any;
    isProceess: boolean = true;
    isAllSelected = false;
    logInUserName: any;



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
        if (this.subscription) {
            this.subscription.unsubscribe(); // Clean up the subscription to prevent memory leaks
        }
    }
    getContactList() {
        this.isProceess = true;

        // Call the function to get the observable and then subscribe to it
        this.subscription = this.whatsappService.activeContactList().subscribe({
            next: (response: any[]) => {
                const contactLists = response;

                // Safely access 'open' property of the first contact or fallback to an empty array
                this.open = contactLists[0]?.open ?? [];

                // Get the current time and calculate the threshold (24 hours ago)
                const now = new Date();
                const threshold = now.getTime() - (24 * 60 * 60 * 1000); // 24 hours ago in milliseconds

                // Filter the open array to include only entries before 24 hours
                this.contactList = this.open.filter((contact: any) => {
                    const contactTime = new Date(contact.time).getTime();
                    return contactTime >= threshold;
                });

                console.log(this.contactList)

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

    sendMessage() {
        // console.log('Message:', this.message);
        // console.log('Selected contacts:', this.contactList.filter(contact => contact.selected));

        this.isProceess = true; // Set processing flag to true to indicate the process has started.

        const selectedContacts = this.contactList.filter(contact => contact.selected,);

        // Track the number of API calls
        let successCount = 0;
        let errorCount = 0;

        selectedContacts.forEach(contact => {
            // Create a request for each selected contact
            const request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: contact.phoneNo, // Use the phone number of the selected contact
                type: 'text',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                names: contact.fullName || null,
                text: {
                    preview_url: false,
                    body: this.message,
                },
            };

            let formData = new FormData();
            formData.append('messageEntry', JSON.stringify(request));

            // Make the API call for each selected contact
            this.whatsappService.sendWhatsAppMessage(formData)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        let data: any = response;
                        successCount++; // Increment success count
                        this.toastr.success(data.message); // Optionally show success notification
                        const audio = new Audio('../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3');
                        audio.play();
                    },
                    (error) => {
                        errorCount++; // Increment error count
                        this.toastr.error(error.error.message); // Handle error and show error notification
                    }
                );
        });

        // After all API calls are done, check if all were successful
        setTimeout(() => {
            this.isProceess = false; // Set processing flag to false after the loop is finished.
            if (successCount === selectedContacts.length) {
                // If all requests are successful, navigate to the inbox page
                this.router.navigate(['/admin/inbox']);
                // Empty the message after success
                this.message = '';
                // Unselect all contacts after success
                this.contactList.forEach(contact => {
                    if (contact.selected) {
                        contact.selected = false; // Set selected to false
                    }
                });
            }
        }, 2000); // Delay to ensure the last API call response has time to be received
    }



    quickReply() {
        const selectedContacts = this.contactList.filter(contact => contact.selected,);

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

}
