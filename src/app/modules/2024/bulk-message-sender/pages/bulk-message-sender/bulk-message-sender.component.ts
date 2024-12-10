import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WhatsAppService } from 'src/app/_api/whats-app.service';

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

    userData: any;
    isProceess: boolean = true;



    constructor(public whatsappService: WhatsAppService,) { }

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
                this.contactList = response;

                // Safely access 'open' property of the first contact or fallback to an empty array
                this.open = this.contactList[0]?.open ?? [];

                // Get the current time and calculate the threshold (24 hours ago)
                const now = new Date();
                const threshold = now.getTime() - (24 * 60 * 60 * 1000); // 24 hours ago in milliseconds

                // Filter the open array to include only entries before 24 hours
                this.open = this.open.filter((contact: any) => {
                    const contactTime = new Date(contact.time).getTime();
                    return contactTime <= threshold;
                });

                console.log(this.open);
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


}
