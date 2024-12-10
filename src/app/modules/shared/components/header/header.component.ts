import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthenticationService } from 'src/app/_services';
import { ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ConfirmationDialogModalComponent } from '../confirmation-dialog-modal/confirmation-dialog-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WhatsAppService } from 'src/app/_api/whats-app.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    // user?: User | null;

    title?: any = ' Dashboard';
    data: any;
    userData: any;


    classToggled = false;
    isprofile = false;


    toggleField() {
        this.isprofile = false;
        // this.closeDropdownAndNotification();
        this.classToggled = !this.classToggled;

    }






    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private bnIdle: BnNgIdleService,
        private elRef: ElementRef,
        private renderer: Renderer2,
        private modalService: NgbModal,
        public whatsappService: WhatsAppService,
    ) {
        this.data = localStorage.getItem('userData');
        this.userData = JSON.parse(this.data);


    }



    ngOnInit(): void {
        // this.bnIdle.startWatching(1500).subscribe((isTimedOut: boolean) => {
        //   if (isTimedOut) {
        //     this.logout();
        //   }
        // });




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

    navigateToProfile() {
        this.router.navigate(['/admin/profile']);
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


}
