import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private baseUrl = environment.apiUrl;
    private serverErrorToast: any = null;

    constructor(private http: HttpClient,
        private auth: AuthenticationService,
        private toastr: ToastrService) {

        window.addEventListener('online', () => {
            this.handleOnline();
        });
    }

    get(url: string, params?: any): Observable<any> {
        const data = { params, headers: this.getAuthHeader() };
        // console.log(data)
        return this.http.get(this.baseUrl + url, data)
            .pipe(catchError(this.errorHandler.bind(this)));
    }

    deleteID(url: string): Observable<any> {
        const data = { headers: this.getAuthHeader() };
        return this.http.delete(this.baseUrl + url, data)
            .pipe(catchError(this.errorHandler.bind(this)));
    }

    Update(url: any): Observable<any> {
        const data = { headers: this.getAuthHeader() };
        return this.http.put(this.baseUrl + url.url, url?.model, data)
            .pipe(catchError(this.errorHandler.bind(this)));
    }

    Add(url: any): Observable<any> {
        const data = { headers: this.getAuthHeader() };
        return this.http.post(this.baseUrl + url.url, url?.model, data)
            .pipe(catchError(this.errorHandler.bind(this)));
    }


    public errorHandler(responce: any) {
        const error = responce.error;
        const keys = Object.keys(error);
        const key = keys[0];
        let message = error[key];

        if (responce.status === 401) {
            this.auth.logout();
        }
        if (error[key] instanceof Array) {
            message = error[key][0];
        }
        if (key === 'isTrusted') {
            this.showServerError();
        }



        else {
            message = key + ' : ' + message;
        }
        return throwError({ messages: message, error: error })
    }


    // Show the server error toast
    public showServerError(): void {
        // If server error toast already exists, don't show a new one
        if (this.serverErrorToast) {
            return;
        }

        // Show the server error toast
        this.serverErrorToast = this.toastr.error(
            "The server is currently unavailable. Please try again later.",
            "Server Error",
            {
                timeOut: 0,          // Ensures the toast does not automatically close
                closeButton: true,   // Adds a close button for manual dismissal
                progressBar: true,   // Displays the progress bar
                tapToDismiss: false  // Disables dismissal when the toast is clicked
            }
        );
    }

    // Handle online event and close server error toast
    private handleOnline(): void {
        // Close the server error toast if it exists
        if (this.serverErrorToast) {
            this.toastr.clear(this.serverErrorToast.toastId); // Clear the server error toast using its ID
            this.serverErrorToast = null; // Reset the reference
        }
    }

    private getAuthHeader(): { [Header: string]: string | string[]; } {
        return {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Access-Control-Allow-Origin': '*',
            //   'X-Telnet' : localStorage.getItem('loginUrl')  || ''
            'X-Telnet': (localStorage.getItem('loginUrl') || '').charAt(0)

            // 'Content-Type':'application/json'
        }
    }
}
