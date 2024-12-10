import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    contactList: any[] = [];
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
        private cdr: ChangeDetectorRef
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
            this.socket.close();
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
        this.subscription = this.whatsappService.contactList$.subscribe(response => {
            this.contactList = response;

            // Ensure 'this.contactList[0]?.open' is defined and is an array
            this.open = this.contactList[0]?.open ?? [];  // If undefined or null, set to an empty array

            // Filter the open contacts only if it's a valid array
            const filteredOpen = Array.isArray(this.open) ? this.open.filter((contact: any) => contact?.count !== 0) : [];

            // Now 'filteredOpen' should be a safe array to check its length
            this.unreadMessages = filteredOpen.length;

            this.cdr.detectChanges();
        });

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
                    console.log(currentContact)
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
                sessionStorage.removeItem('currentContact');

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
