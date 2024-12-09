import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services';
import { Router } from '@angular/router';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription, take } from 'rxjs';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-left-mainmenu',
    templateUrl: './left-mainmenu.component.html',
})
export class LeftMainmenuComponent implements OnInit {
    data: any;
    userData: any;
    contactList: any;
    closed: any = [];
    open: any = [];
    unreadMessages: any

    subscription!: Subscription;
    pollingSubscription!: Subscription;
    private socket$!: WebSocketSubject<any>;
    private socket!: WebSocket;


    constructor(private authenticationService: AuthenticationService,
        public whatsappService: WhatsAppService,
        private router: Router,
        private modalService: NgbModal,
    ) {
        this.data = localStorage.getItem("userData");
        this.userData = JSON.parse(this.data);

    }


    ngOnInit() {
        this.connectWebSocket();
        this.processContactList();
    }

    ngOnDestroy() {
        if (this.socket) {
            this.socket.close();  // Close the WebSocket connection on component destruction
        }
    }

    private connectWebSocket() {
        const socketUrl = environment.SOCKET_ENDPOINT;
        this.socket = new WebSocket(socketUrl);

        this.socket.onopen = () => {
            console.log('WebSocket connected successfully.');
        };

        this.socket.onmessage = (event) => {
            // console.log('WebSocket message received:', event.data);
            try {
                const data = JSON.parse(event.data);
                this.processContactList();
            } catch (error) {
                console.error('Error parsing WebSocket data:', error);
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.warn(`WebSocket closed: ${event.reason}`);
            setTimeout(() => this.connectWebSocket(), 5000);
        };
    }


    processContactList() {
        if (this.userData?.role?.roleName === 'Admin') {
            this.subscription = this.whatsappService
                .getContactList()
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.contactList = response;
                        this.open = this.contactList[0].open;

                        // Filter to get only items where count !== 0
                        const filteredOpen = this.open.filter((contact: any) => contact.count !== 0);

                        // Calculate total unread messages from filtered data
                        // this.unreadMessages = filteredOpen.reduce((sum: number, contact: any) => sum + contact.count, 0);

                        this.unreadMessages = filteredOpen.length;

                    },
                    (error) => {
                        console.error('Error fetching contact list for admin', error);
                    }
                );
        } else {
            this.subscription = this.whatsappService
                .getContactListForUser(this.userData?.userId)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.contactList = response;
                        this.open = this.contactList[0].open;

                        // Filter to get only items where count !== 0
                        const filteredOpen = this.open.filter((contact: any) => contact.count !== 0);

                        // Calculate total unread messages from filtered data
                        // this.unreadMessages = filteredOpen.reduce((sum: number, contact: any) => sum + contact.count, 0);

                        this.unreadMessages = filteredOpen.length;
                    },
                    (error) => {
                        console.error('Error fetching contact list for user', error);
                    }
                );
        }
    }
    get isAuditor() {
        return this.userData?.department?.departmentName == 'Zenoti' || this.userData?.department?.departmentName == 'Admin';
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

    reloadCurrentPage() {
        this.router.navigate(['/admin/inbox/']);
    }

    reloadCurrentPage1() {
        this.router.navigate(['/inbox/']);
    }

    logout() {

        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, {
            size: 'sm',
            centered: true,
            backdrop: 'static',
        });

        var componentInstance =
            modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = 'Are you sure you want to logout?';
        modalRef.result
            .then((canDelete: boolean) => {
                if (canDelete) {
                    this.authenticationService.logout();
                    const currentContact = sessionStorage.getItem('currentContact');

                    if (currentContact) {
                        this.handleMessageStatus(currentContact, false);
                    } else {
                        // console.warn('No current contact found in session storage.');
                    }
                }
            })
            .catch(() => { });
    }


    checkCurrentContact(): void {
        const currentContact = sessionStorage.getItem('currentContact');

        if (currentContact) {
            this.handleMessageStatus(currentContact, false);
        } else {
            // Optional: Log or handle the absence of currentContact.
            // console.warn('No current contact found in session storage.');
        }
    }

    handleMessageStatus(contact: string, isSeen: boolean): void {

        this.whatsappService.updateSeenByMobileNo(contact, isSeen).subscribe({
            next: response => {
                // console.log('Update successful:', response);
                // alert('Status updated successfully!');
            },
            error: error => {
                // console.error('Error updating status:', error);
                // alert('Failed to update status. Please try again.');
            }
        });


    }

}
