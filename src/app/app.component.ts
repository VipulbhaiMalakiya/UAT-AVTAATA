import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'avataara';
    constructor(private authenticationService: AuthenticationService,
        private router: Router, private toastr: ToastrService,) {

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
    }


}
