import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { clone } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService, EncrDecrService } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-default-login',
    templateUrl: './default-login.component.html',
    styleUrls: ['./default-login.component.css']
})
export class DefaultLoginComponent implements OnInit {
    loading = false;
    error = '';
    logUser: any;
    loginForm: any;
    logUsers: any;
    subdomains: string[] = environment._subdomains;
    public showPassword: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService,
        private titleService: Title,
        private EncrDecr: EncrDecrService
    ) {
        this.titleService.setTitle('CDC - Login');
        this.loginForm = this.formBuilder.group({ username: [null, Validators.required] });
    }
    toggleFieldTextType() {
        this.showPassword = !this.showPassword;
    }
    ngOnInit(): void {
        const d: any = localStorage.getItem('userData');
        this.logUsers = JSON.parse(d);
        if (this.logUsers) {
            if (this.logUsers.role?.roleName == 'Admin') {
                this.router.navigate(['/admin/inbox']);
            } else if (this.logUsers.role?.roleName == 'User') {
                this.router.navigate(['/inbox']);
            } else if (this.logUsers.role?.roleName == 'Resolver') {
                this.router.navigate(['/inbox']);
            }
            else if (this.logUsers.role?.roleName == 'Approver') {
                this.router.navigate(['/assigned-ticket-list']);
                this.toastr.success('You are successfully logged in!');
            }
        }
    }
    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.controls['username'].markAsTouched();
            return;
        }

        let data: any = { loginUrl: this.loginForm.value.username };
        const subdomain = this.getSubdomainFromUrl(data.loginUrl).toLowerCase() ?? '';
        localStorage.setItem('loginUrl', subdomain ?? '');

        const validSubdomains = environment._subdomains.map(sub => sub.toLowerCase());

        // Redirect logic
        if (!subdomain) {
            window.location.href = `${environment.ReqUrl}${environment.appUrl}`;
        } else if (validSubdomains.includes(subdomain)) {
            window.location.href = `${environment.ReqUrl}${subdomain}.${environment.appUrl}`;
        } else {
            window.location.href = `${environment.ReqUrl}${environment.appUrl}`;
        }
    }

    getSubdomainFromUrl(loginUrl: string): string {
        try {
            // Remove protocol (http:// or https://) if present
            let urlWithoutProtocol = loginUrl.replace(/(^\w+:|^)\/\//, '');

            // Split by dots and slashes to handle subdomains like 'subdomain.domain.com'
            const urlParts = urlWithoutProtocol.split(/[.:\/]+/);

            // Ensure there are enough parts to extract the subdomain
            if (urlParts.length >= 1) {
                return urlParts[0].toLowerCase();  // Return the first part as the subdomain, converted to lowercase
            } else {
                console.warn('Invalid login URL format.');
                return '';  // Fallback if the URL format is not valid
            }
        } catch (error) {
            console.error('Error parsing the login URL:', error);
            return '';  // Fallback if an error occurs
        }
    }




    shouldShowError(controlName: string, errorName: string) {
        return (
            this.loginForm.controls[controlName].touched &&
            this.loginForm.controls[controlName].hasError(errorName)
        );
    }
}
