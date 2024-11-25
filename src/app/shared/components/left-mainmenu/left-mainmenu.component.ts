import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services';
import { Router } from '@angular/router';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription, take } from 'rxjs';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { WebSocketSubject } from 'rxjs/webSocket';

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

    constructor(private authenticationService: AuthenticationService,
        public whatsappService: WhatsAppService,
        private router: Router,
        private modalService: NgbModal,) {
        this.data = localStorage.getItem("userData");
        this.userData = JSON.parse(this.data);

    }
    ngOnInit() {
        // Start polling every 10 seconds
        this.pollingSubscription = interval(10000).subscribe(() => {
            this.getContactList();
        });
    }


    ngOnDestroy() {
        // Cleanup subscriptions
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getContactList() {
        if (this.userData?.role?.roleName === 'Admin') {
            this.subscription = this.whatsappService
                .getContactList()
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.contactList = response;
                        this.open = this.contactList[0].open;
                        this.unreadMessages = this.open.reduce((sum: number, contact: any) => sum + contact.count, 0);
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
                        this.unreadMessages = this.open.reduce((sum: number, contact: any) => sum + contact.count, 0);
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
                }
            })
            .catch(() => { });
    }

}
