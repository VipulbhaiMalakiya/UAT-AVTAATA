import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../_services/headers.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {

    private socket$!: WebSocketSubject<any>;
    private baseUrl: string = environment.apiUrl;
    constructor(private http: HttpClient,
        private header: HeadersService) {
    }

    chatHistory(request: any) {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.get(this.baseUrl + `/chatlist/history/number/${request}`, httpOptions);
    }

    // chatHistorynew(request: any) {
    //     let headers = this.header.getJWTHeaders();
    //     const httpOptions = { headers: headers };
    //     return this.http.get(this.baseUrl + `/chatlist/history/number/${request}`, httpOptions);
    // }

    // chatHistorynew(contact: string, currentPage: number, pageSize: number) {
    //     let headers = this.header.getJWTHeaders();
    //     const httpOptions = { headers: headers };
    //     const url = `${this.baseUrl}/chatlist/history/number/${contact}?page=${currentPage}&size=${pageSize}`;
    //     return this.http.get(url, httpOptions);
    // }

    chatHistorynew(contact: string, currentPage: number, pageSize: number) {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.get(this.baseUrl + `/chatlist/history/number/${contact}`, httpOptions);
    }


    updateSeenByMobileNo(mobileNo: string, seen: boolean): Observable<any> {
        const url = `${this.baseUrl}/customer/seen-ByMobileNo/${mobileNo}/seen/${seen}`;

        // Assuming this.header.getJWTHeaders() is your custom method to get JWT headers
        const headers = this.header.getJWTHeaders() || new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.put(url, null, { headers });
    }


    getContactList() {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.get(this.baseUrl + `/chatlist/latest-messages`, httpOptions);

        // return this.http.get(this.baseUrl + `/message-history/latest-messages`, httpOptions);
    }

    getContactListForUser(data: any) {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.get(this.baseUrl + `/message-history/latest-messages/assignedto/${data}`, httpOptions);
    }

    close() {
        this.socket$.complete();
    }
    sendWhatsAppMessage(formData: FormData) {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.post(this.baseUrl + '/outgoing/send-message', formData, httpOptions);
        // return this.http.post(this.baseUrl + '/outgoing-message', request, httpOptions);
    }

    sendnotesMessage(request: any) {
        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        return this.http.post(this.baseUrl + '/outgoing-message', request, httpOptions);
    }
}
