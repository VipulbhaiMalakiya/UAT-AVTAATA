import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WhatsAppService } from './_api/whats-app.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'avataara';
    constructor(private authenticationService: AuthenticationService,
        private router: Router, private toastr: ToastrService, public whatsappService: WhatsAppService,) {

    }


    ngOnInit() {
        // Initial online/offline check
        if (navigator.onLine) {
            // this.toastr.success('You are online!', 'Status');
        } else {
            this.toastr.error('You are currently offline. Some features may be unavailable. Please check your connection.',
                'Connection Status');
        }

        // Listen to the 'online' event
        window.addEventListener('online', () => {
            this.toastr.success('You are back online. All features are now accessible.',
                'Connection Restored');
        });

        // Listen to the 'offline' event
        window.addEventListener('offline', () => {
            this.toastr.error('You have lost your internet connection. Some features may be restricted.',
                'Connection Lost');
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.checkCurrentContact();
            }
        });
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
