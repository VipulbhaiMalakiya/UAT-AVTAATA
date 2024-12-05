import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthenticationService } from 'src/app/_services';
import { ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ConfirmationDialogModalComponent } from '../confirmation-dialog-modal/confirmation-dialog-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
        private modalService: NgbModal
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
                }
            })
            .catch(() => { });
    }


}
