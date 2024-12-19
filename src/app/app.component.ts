import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WhatsAppService } from './_api/whats-app.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'avataara';
    private offlineToast: any = null;

    constructor(private authenticationService: AuthenticationService,
        private router: Router, private toastr: ToastrService, public whatsappService: WhatsAppService,) {

    }

    ngOnDestroy() {
        localStorage.clear();
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: any) {
        localStorage.clear();
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
                timeOut: 0,
                closeButton: true,
                progressBar: true,
                tapToDismiss: false
            }
        );

    }

    // Handle online event and close offline toast
    private handleOnline(): void {
        this.toastr.success('You are back online. All features are now accessible.', 'Connection Restored', {
            closeButton: true,
            progressBar: true
        });
        if (this.offlineToast) {
            this.toastr.clear(this.offlineToast.toastId);
            this.offlineToast = null;
        }
    }



    checkCurrentContact(): void {
        const currentContact = sessionStorage.getItem('currentContact');
        if (currentContact) { this.handleMessageStatus(currentContact, false); } else { }
    }

    handleMessageStatus(contact: string, isSeen: boolean): void {

        this.whatsappService.updateSeenByMobileNo(contact, isSeen).subscribe({
            next: response => { sessionStorage.removeItem('currentContact'); },
            error: error => { }
        });


    }




}
