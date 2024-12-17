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
    private offlineToast: any = null;

    constructor(private authenticationService: AuthenticationService,
        private router: Router, private toastr: ToastrService, public whatsappService: WhatsAppService,) {

    }


    ngOnInit() {
        // Initial check for online status
        if (!navigator.onLine) {
            this.handleOffline();
        }

        // Listen to the 'online' event
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        // Listen to the 'offline' event
        window.addEventListener('offline', () => {
            this.handleOffline();
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.checkCurrentContact();
            }
        });
    }

    // Show the offline toast
    private handleOffline(): void {
        // If offline toast already exists, don't show a new one
        if (this.offlineToast) {
            return;
        }

        // Show the offline toast
        this.offlineToast = this.toastr.error(
            'You have lost your internet connection. Some features may be restricted.',
            'Connection Lost',
            {
                timeOut: 0,          // Ensures the toast does not automatically close
                closeButton: true,   // Adds a close button for manual dismissal
                progressBar: true,   // Displays the progress bar
                tapToDismiss: false  // Disables dismissal when the toast is clicked
            }
        );

    }

    // Handle online event and close offline toast
    private handleOnline(): void {
        // Show the "Connection Restored" toast
        this.toastr.success('You are back online. All features are now accessible.', 'Connection Restored', {
            closeButton: true,
            progressBar: true
        });
        // Close the offline toast if it exists
        if (this.offlineToast) {
            this.toastr.clear(this.offlineToast.toastId); // Clear the offline toast using its ID
            this.offlineToast = null; // Reset the reference
        }
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
