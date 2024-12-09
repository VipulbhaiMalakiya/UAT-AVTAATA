import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../_services/headers.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {

    private socket$!: WebSocketSubject<any>;
    private baseUrl: string = environment.apiUrl;

    private chatCache = new Map<string, Observable<any>>();
    private ongoingRequests = new Map<string, boolean>();

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
    //     const url = `${this.baseUrl}/chatlist/historypagination/number/${contact}?page=${currentPage}&pageSize=${pageSize}`;
    //     return this.http.get(url, httpOptions);
    // }

    chatHistorynew(contact: string, page: number, pageSize: number): Observable<any> {
        const cacheKey = `${contact}_${page}`;


        let headers = this.header.getJWTHeaders();
        const httpOptions = { headers: headers };
        const url = `${this.baseUrl}/chatlist/historypagination/number/${contact}?page=${page}&pageSize=${pageSize}`;

        // Check if the request is already ongoing
        if (this.chatCache.has(cacheKey)) {
            return this.chatCache.get(cacheKey)!; // Return the cached observable
        }

        // Fetch data and cache it
        const request = this.http
            .get<any>(url, httpOptions)
            .pipe(
                tap(() => {
                    // Mark request as complete
                    this.ongoingRequests.delete(cacheKey);
                }),
                shareReplay(1), // Share the request among multiple subscribers
                catchError((error) => {
                    this.chatCache.delete(cacheKey); // Remove failed request from cache
                    this.ongoingRequests.delete(cacheKey);
                    throw error;
                })
            );

        this.chatCache.set(cacheKey, request);
        return request;
    }

    clearCache(contact: string): void {
        Array.from(this.chatCache.keys())
            .filter((key) => key.startsWith(contact))
            .forEach((key) => this.chatCache.delete(key));
    }


    // chatHistorynew(contact: string, currentPage: number, pageSize: number) {
    //     let headers = this.header.getJWTHeaders();
    //     const httpOptions = { headers: headers };
    //     return this.http.get(this.baseUrl + `/chatlist/history/number/${contact}`, httpOptions);
    // }


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
