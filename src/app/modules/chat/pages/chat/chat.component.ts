import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, delay, distinctUntilChanged, take } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { CustomersService } from 'src/app/_api/masters/customers.service';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { WhatsAppService } from 'src/app/_api/whats-app.service';
import { UserMaster } from 'src/app/_models';
import { MessageData } from 'src/app/_models/meesage';
import { ConfirmationDialogModalComponent } from 'src/app/modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { environment } from 'src/environments/environment';
import { DatePipe, Location } from '@angular/common';
import * as $ from 'jquery';
import * as jQuery from 'jquery';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { Title } from '@angular/platform-browser';
import { labelMasterModel } from 'src/app/_models/labels';
import { ImageUplodComponent } from '../../components/image-uplod/image-uplod.component';
import { AudioComponent } from '../../components/audio/audio.component';
import { DocumentComponent } from '../../components/document/document.component';
import { VideoComponent } from '../../components/video/video.component';
import { LocationDetailsComponent } from '../../components/location-details/location-details.component';
import { QuickReplyComponent } from '../../components/quick-reply/quick-reply.component';
import { TempletsComponent } from '../../components/templets/templets.component';
import { CheckInComponent } from '../../components/check-in/check-in.component';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CatalogComponent } from '../../components/catalog/catalog.component';



interface MessageGroup {
    date: string;
    messages: MessageData[];
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent
    implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    show: boolean = false;
    hideReplyAndNotes: boolean = false;
    data: any = [];
    bgclass: any;
    lastMessageTime?: any; // Timestamp of the last message
    timeRemaining?: number;
    targetFormat?: string = 'yyyy-MM-ddTHH:mm:ss';
    messageCount: number = 0;
    lastItem?: any;
    chatVisible: boolean = true;
    isProceess: boolean = true;
    firstname: any;
    phone: any;
    ticketflag?: any;
    lastname: any;
    userData: any;
    totalQuantity?: number = 0;
    userMessage = [];
    chatname: any;
    ischeckout: boolean = false;
    ischeckin: boolean = true;
    label: any;
    latitude?: number;
    longitude?: number;
    Userinfo?: any;
    quickReplydata: any = [];
    closedCount?: any;
    messageList: string[] = [];
    private socket$!: WebSocketSubject<any>;
    public receivedData: MessageData[] = [];
    groupedMessages: MessageGroup[] = []; // Declare groupedMessages property

    item: any = [];
    checkinstatus: any;
    open: any = [];
    contact: any;
    logInUserName: any;
    closed: any = [];
    missed: any = [];
    aciveUser: UserMaster[] = [];
    dataLabel: labelMasterModel[] = [];
    term: any;
    contactId?: any;
    contactinfo?: any;
    messagestates?: any = '';
    masterName?: any;
    nrSelect?: any;
    subscription?: Subscription;
    showHead: boolean = false;
    private socket?: WebSocket;
    contactList: any[] = [];
    meesagestatus?: any = [];
    isempty: boolean = true;
    reloadFlag = true;
    isstatus?: any = 'open';
    openCount: any;
    missedCount: number = 0;
    checkoutdata: any;
    tqty?: any;
    checkindata: any;
    DefoluteSelect: any;
    // @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
    // Emoji Code Start
    message = '';
    showEmojiPicker = false;
    showupload = false;
    showupload1 = false;
    unreadmessage?: any = [];
    slecteduser: any = {};
    private notificationSound?: HTMLAudioElement;

    today!: string;




    // @ViewChild('chatContainer') chatContainer!: ElementRef;

    private currentPage: number = 1;
    private pageSize: number = 30;


    toggleEmojiPicker() {
        this.showupload = false;
        this.showupload1 = false;
        this.showEmojiPicker = !this.showEmojiPicker;
    }
    addEmoji(event: any) {
        const { message } = this;
        const text = `${message}${event.emoji.native}`;
        this.message = text;
        // this.showEmojiPicker = false;
        this.showEmojiPicker = false;
    }

    onOutsideClick(): void {
        this.showEmojiPicker = false;
    }

    onFocus() {
        this.showEmojiPicker = false;
    }
    replaceAndBoldPlaceholder(data?: any): string {
        // Validate input data
        if (!data || !data.templatePreview || !data.templateBodyAttributes) {
            return 'Invalid input: templatePreview or templateBodyAttributes are missing.';
        }

        const { templatePreview, templateBodyAttributes } = data;


        // Replace placeholders dynamically
        let updatedString = templatePreview;

        templateBodyAttributes.forEach((value: string, index: number) => {
            const placeholder = `{{${index + 1}}}`;
            const regex = new RegExp(`\\{\\{\\s*${index + 1}\\s*\\}\\}`, 'g');
            updatedString = updatedString.replace(regex, `${value}`);
        });


        return updatedString;
    }





    replaceAndBoldPlaceholder50(data?: any) {

        try {

            const name = data.templateBodyAttributes[0];
            const pwd = data.templateBodyAttributes[1];

            const originalString = data.templatePreview;
            const replacedString = originalString.replace('{{1}}', name).replace('{{2}}', pwd);
            return replacedString;
        } catch (error) {

            return 'Error: Unable to replace placeholders';
        }
    }

    replaceAndBoldPlaceholder550(data?: any) {
        try {

            const name = data.templateBodyAttributes[0];
            const originalString = data.templatePreview;
            const replacedString = originalString.replace('{{1}}', name);
            return replacedString;
        } catch (error) {
            return 'Error: Unable to replace placeholders';
        }
    }
    replaceAndBoldPlaceholder1(data?: any): any {


        try {
            if (
                !data ||
                !data.templateBodyAttributes ||
                data.templateBodyAttributes.length < 3 ||
                !data.templatePreview
            ) {
                // Handle the case where data is missing or incomplete
                throw new Error('Invalid data or missing attributes');
            }

            const name = data.templateBodyAttributes[0];
            const un = data.templateBodyAttributes[1];
            const pwd = data.templateBodyAttributes[2];
            const originalString = data.templatePreview;

            // Use regular expressions to replace all occurrences of {{1}}, {{2}}, and {{3}}
            const replacedString = originalString
                .replace(/{{1}}/g, name)
                .replace(/{{2}}/g, un)
                .replace(/{{3}}/g, pwd);

            return replacedString;
        } catch (error) {
            // Handle the error here, e.g., log it or return a default value
            // console.error('Error in replaceAndBoldPlaceholder1:', error);
            return 'Error: Unable to replace placeholders';
        }
    }


    //Emoji Code End
    constructor(
        private _route: ActivatedRoute,
        public CSAPI: CustomersService,
        private formBuilder: FormBuilder,
        public whatsappService: WhatsAppService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private apiService: ApiService,
        private router: Router,
        private location: Location,
        private titleService: Title,
        private cd: ChangeDetectorRef,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
    ) {
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
        this.logInUserName = this.userData.firstName + ' ' + this.userData.lastName;
        this.nrSelect = this.userData?.userId;
        this.titleService.setTitle('CDC -Inbox');
        this.getContactList();
        this.ActiveUser();



    }
    ngOnInit(): void {
        setTimeout(() => {
            this.connect();
            this.getContactList();
            this.ActiveUser();
            this.ActiveLabels();
            this.GetUser();

        }, 2000);

        // this.handleMessageStatus(sessionStorage.getItem('currentContact') ?? '', false);

        this.today = new Date().toDateString();



        this.route.params.subscribe(params => {

            if ('status' in params) {
                this.isstatus = params['status'];
            } else {
                this.isstatus = 'open';
            }
        });




        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.data.latitude = position.coords.latitude.toString();
                this.data.longitude = position.coords.longitude.toString();
            });
        }

        $('.select-dropdown__button').on('click', function () {
            $('.select-dropdown__list').toggleClass('active');
        });

        $('.select-dropdown__list-item').on('click', function () {
            const itemValue = $(this).data('value') as string;
            $('.select-dropdown__button span')
                .text($(this).text())
                .parent()
                .attr('data-value', itemValue);
            $('.select-dropdown__list').toggleClass('active');
        });
        $('.topchat-filter-icon').on('click', (event: Event) => {
            event.stopPropagation();
            $('.filters-popup').toggle();
        });

        $('.filters-popup').on('click', (event: Event) => {
            event.stopPropagation();
        });

        $(document).on('click', () => {
            $('.filters-popup').hide();
        });
    }
    display: any;
    zoom = 4; // Initial zoom level for the map
    move(event: google.maps.MapMouseEvent) {
        // Method to handle map click event and update the display property
        if (event.latLng != null) {
            this.display = event.latLng.toJSON();
        }


    }

    public connect(): void {
        if (!this.socket$ || this.socket$.closed) {
            this.establishConnection();
        }
    }
    private establishConnection(): void {
        this.socket$ = webSocket(environment.SOCKET_ENDPOINT);
        this.socket$.subscribe(
            (data: any) => {
                if (data.mobileNo === this.contact || data.mobileNumber === this.contact) {
                    // Check if the message already exists based on the messageId
                    const existingMessageIndex = this.receivedData.findIndex(msg => msg.messageId === data.messageId);

                    if (existingMessageIndex !== -1) {
                        // If the message already exists, update the status
                        this.receivedData[existingMessageIndex].messageStatus = data.messageStatus;
                    } else {
                        // If it's a new message, push it to the receivedData array
                        this.receivedData.push(data);
                    }


                    // Call the function to update the contact list and scroll to the bottom
                    this.getContactList();
                    this.isstatus = 'open';
                    this.scrollToBottom();  // Ensure scrolling after data update
                }
                else if (data.mobileNo !== this.contact) {
                    this.getContactList();
                }
                if (
                    this.messagestates == 'sent' ||
                    this.messagestates == 'delivered' ||
                    this.messagestates == 'read' ||
                    this.messagestates == ' '
                ) {
                } else {
                    const currentUrl = this.location.path();
                    // if (currentUrl === '/admin/inbox' || currentUrl === '/admin/inbox/id' || currentUrl === '/admin/inbox/status' || currentUrl === '/inbox' || currentUrl.startsWith('/admin/inbox/')) {

                    //     if (data.type === 'Receiver') {
                    //         const message: string = `You got a message from ${this.getOnlyName(
                    //             data.name
                    //         )}`;
                    //         const mobileNoExists = this.open.some((item: any) =>
                    //             item.phoneNo === data.mobileNo || data.assignedto == this.userData.userId
                    //         );

                    //         if (this.userData.role.roleName == 'Admin') {

                    //             this.speakNotification(message);
                    //         }
                    //         else if (data.assignedto == this.userData.userId || mobileNoExists) {
                    //             this.speakNotification(message)
                    //         }

                    //     } else {
                    //         const audio = new Audio();
                    //         // '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                    //         audio.play();
                    //     }
                    // }



                    if (data.type === 'Receiver') {
                        const message: string = `You got a message from ${this.getOnlyName(
                            data.name
                        )}`;
                        // const mobileNoExists = this.open.some((item: any) =>
                        //     item.phoneNo === data.mobileNo || data.assignedto == this.userData.userId
                        // );


                        this.speakNotification(message);
                        // if (this.userData.role.roleName == 'Admin') {

                        //     this.speakNotification(message);
                        // }
                        // else if (data.assignedto == this.userData.userId || mobileNoExists) {
                        //     this.speakNotification(message)
                        // }

                    } else {
                        const audio = new Audio();
                        // '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                        audio.play();
                    }

                }
            },
            (error: any) => {
                // Handle socket errors
                console.error('Socket error:', error);
                // If the socket has closed unexpectedly, attempt to reconnect
                if (error.code === 1006) {
                    console.log('Socket closed unexpectedly. Attempting to reconnect...');
                    this.reconnect();
                }
            },
            () => {
                // Handle socket close event (optional)
                console.log('Socket connection closed.');
            }
        );
    }
    private reconnect(): void {
        // Close existing socket connection if it exists
        if (this.socket$) {
            this.socket$.unsubscribe();
        }
        // Re-establish connection
        this.establishConnection();
    }
    onViewContact(e: any, c: any) {

        // // Retrieve the last stored phone number from sessionStorage
        const lastContact = sessionStorage.getItem('currentContact');

        // Check if the session is active for the same contact
        if (lastContact === e.phoneNo) {
            console.log('Session is active for this contact. Marking as seen.');
            this.handleMessageStatus(e.phoneNo, true); // Mark as seen
        } else {
            console.log('Closing previous session and starting a new session.');

            // Close session for the previous contact (if any)
            if (lastContact) {
                this.handleMessageStatus(lastContact, false); // Mark as unseen
            }

            // Start a new session for the selected contact
            sessionStorage.setItem('currentContact', e.phoneNo);
            this.handleMessageStatus(e.phoneNo, true); // Mark as seen
        }

        // this.checkTimeDifference(e.time);

        this.pageSize = 30;
        this.currentPage = 1;
        this.receivedData = [];
        this.isProceess = true;
        this.contactinfo = e;
        this.bgclass = c;
        this.contactId = e.id;
        this.showEmojiPicker = false;
        this.showupload = false;
        this.showupload1 = false;
        this.contact = e.phoneNo;
        this.slecteduser = e;
        this.show = true;
        this.checkstatus();
        if (e.fullName) {
            this.chatname = e.fullName;

            //Ticket flag check in sidebar click event
            this.ticketflag = e.ticketflag;
        } else {
            this.chatname = e.phoneNo;
        }
        this.label = e.customerLabel;
        this.isProceess = true;
        this.loadUserActivity(this.contact)
        this.loadInitialData();



    }

    handleMessageStatus(contact: string, isSeen: boolean): void {

        this.whatsappService.updateSeenByMobileNo(contact, isSeen).subscribe({
            next: response => {
                // console.log('Update successful:', response);
                // alert('Status updated successfully!');
                this.getContactList();
            },
            error: error => {
                // console.error('Error updating status:', error);
                // alert('Failed to update status. Please try again.');
            }
        });


    }


    loadInitialData() {
        this.loadChatHistory(true);
    }

    onScroll(event: Event): void {
        const target = event.target as HTMLElement;

        // Trigger only if scrolled close to the top and not already processing
        if (target.scrollTop <= 50 && !this.isInitialLoading && !this.isPaginationLoading) {
            // this.isProceess = true; // Block further calls until current process completes
            this.loadChatHistory();
        }
    }

    isInitialLoading: boolean = false; // Loader for the initial load
    isPaginationLoading: boolean = false; // Loader for pagination


    loadChatHistory(isInitialLoad: boolean = false): void {
        if (isInitialLoad) {
            this.isInitialLoading = true; // Set the loader for initial load
            this.isProceess = false;
        } else {
            this.isProceess = false;
            this.isPaginationLoading = true; // Set the loader for pagination
        }

        this.whatsappService.chatHistorynew(this.contact, this.currentPage, this.pageSize)
            .pipe(take(1), distinctUntilChanged())
            .subscribe({
                next: (response: any) => {
                    if (response.length > 0) {
                        if (isInitialLoad) {
                            // Handle initial load
                            this.receivedData = response; // Replace data on initial load
                            // this.handleImageScrolling(); // Handle image scrolling
                        } else {
                            // Handle pagination
                            this.receivedData = [...response, ...this.receivedData]; // Prepend new data

                            const lastNewMessageId = response[response.length - 1]?.messageId;

                            if (lastNewMessageId) {
                                this.scrollToMiddle(lastNewMessageId); // Scroll to the specific message
                            } else {
                                console.log('No messageId found in the new messages');
                            }
                        }

                        // Update the last item received for time comparison
                        const lastReceived = this.receivedData
                            .slice()
                            .reverse()
                            .find(record => record.type === 'Receiver');

                        this.checkTimeDifference(lastReceived?.time);
                        this.currentPage++; // Increment the page
                    } else {
                        console.log('No data received.');
                    }
                },
                error: (error) => {
                    this.handleErrors(error); // Handle the error
                },
                complete: () => {
                    console.log('Chat history loaded successfully');
                }
            })
            .add(() => {
                // Reset loaders after response
                if (isInitialLoad) {
                    this.scrollToBottom(); // Scroll to the bottom


                } else {
                    this.isPaginationLoading = false;
                }
            });
    }


    private scrollToBottom(): void {
        setTimeout(() => { // Use setTimeout to ensure the DOM is fully rendered
            try {
                if (this.chatContainer && this.chatContainer.nativeElement) {
                    const container = this.chatContainer.nativeElement;
                    // console.log(container);
                    const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight;
                    if (!atBottom) {
                        container.scrollTop = container.scrollHeight;
                        this.isInitialLoading = false;

                    }
                    // container.scroll({ top: container.scrollHeight });
                }
            } catch (err) {
                console.error(err);
            }
        }, 500);
    }


    scrollToMiddle(messageId: string): void {
        if (!messageId) return;

        // Sanitize the ID to make it a valid CSS selector
        const sanitizedId = this.sanitizeSelector(messageId);
        setTimeout(() => {
            const container = this.chatContainer.nativeElement;
            const targetElement = container.querySelector(`#message-${sanitizedId}`);
            if (targetElement) {
                targetElement.scrollIntoView({
                    // behavior: 'smooth',
                    // block: 'center'
                });
            } else {
                console.warn(`Message with ID ${messageId} not found.`);
            }
        });
    }




    private handleErrors(error: any) {
        // Handling HTTP status codes for server errors
        if (error.status === 500) {
            if (error.error?.message?.includes('SerializationException')) {
                this.toastr.error('A server issue occurred while processing chat data. Please contact support.', 'Deserialization Error');
            } else {
                this.toastr.error('A server error occurred. Please try again later.', 'Server Error');
            }
        } else if (error.status === 0) {
            // Handling case when no server response (Network error)
            this.toastr.error('No connection to the server. Please check your internet connection and try again.', 'Network Error');
        } else if (error.status === 404) {
            // Server not found
            this.toastr.error('The requested resource was not found. Please check the URL or contact support.', 'Resource Not Found');
        } else if (error.status === 403) {
            // Forbidden access
            this.toastr.error('You do not have permission to access this data. Please contact support.', 'Access Denied');
        } else if (error.status === 408) {
            // Handling Timeout error (Request Timeout)
            this.toastr.error('The server took too long to respond. Please try again later.', 'Request Timeout');
        } else if (error.status === 400) {
            // Bad Request error
            this.toastr.error('The request was invalid. Please check your input and try again.', 'Bad Request');
        } else if (error.status === 401) {
            // Unauthorized access
            this.toastr.error('You are not authorized to access this data. Please log in and try again.', 'Unauthorized');
        } else if (error.status === 429) {
            // Too Many Requests (rate limiting)
            this.toastr.error('You are making too many requests. Please try again later.', 'Rate Limit Exceeded');
        } else if (error.status === 502) {
            // Bad Gateway
            this.toastr.error('There is an issue with the server. Please try again later.', 'Bad Gateway');
        } else if (error.status === 503) {
            // Service Unavailable
            this.toastr.error('The service is temporarily unavailable. Please try again later.', 'Service Unavailable');
        } else if (error.status === 504) {
            // Gateway Timeout
            this.toastr.error('The server took too long to respond. Please try again later.', 'Gateway Timeout');
        } else {
            // General handling for unknown HTTP status errors
            this.toastr.error('Failed to load chat history. Please try again later.', 'Unknown Error');
        }

        // Handling client-side errors or network-related issues
        if (error.name === 'TimeoutError') {
            this.toastr.error('The request timed out. Please try again later.', 'Request Timeout');
        } else if (error.name === 'AbortError') {
            this.toastr.error('The request was aborted. Please try again later.', 'Request Aborted');
        } else if (error.message && error.message.includes('timeout')) {
            this.toastr.error('The request took too long to process. Please try again later.', 'Timeout Error');
        } else if (error.message && error.message.includes('NetworkError')) {
            // Handling network error
            this.toastr.error('A network error occurred. Please check your internet connection and try again.', 'Network Error');
        } else if (error instanceof TypeError) {
            // Handling JavaScript type errors (e.g., undefined or null references)
            this.toastr.error('An unexpected error occurred. Please try again later.', 'Type Error');
        } else if (error instanceof SyntaxError) {
            // Handling syntax errors in the request
            this.toastr.error('There was an issue with the request format. Please try again later.', 'Syntax Error');
        } else if (error instanceof Error) {
            // General handling for generic JavaScript errors
            this.toastr.error(`An unexpected error occurred: ${error.message}. Please try again later.`, 'General Error');
        } else {
            // Catch-all for any other error types
            this.toastr.error('An unknown error occurred. Please try again later.', 'Unknown Error');
        }
    }




    checkTimeDifference(lastMessageTime: any) {


        const currentTime = new Date();
        const lastTime = new Date(lastMessageTime);
        // Ensure that both the currentTime and lastTime are valid Date objects
        if (isNaN(lastTime.getTime())) {
            console.error('Invalid last message time');
            return; // Return early if the date is invalid
        }

        // Calculate the difference in milliseconds
        const timeDifferenceInMs = currentTime.getTime() - lastTime.getTime();
        const timeDifferenceInHours = timeDifferenceInMs / (1000 * 3600);

        // if (this.isOpen) {

        // }
        if (timeDifferenceInHours >= 24) {
            this.hideReplyAndNotes = true;
            this.cd.detectChanges();
        } else {
            this.hideReplyAndNotes = false;
            this.cd.detectChanges();

        }

    }



    onClose(contactinfo: any) {
        this.isProceess = true;
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, {
            size: 'sm',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance =
            modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = 'Are you sure you want to close this chat?';

        modalRef.result
            .then((canDelete: boolean) => {
                if (canDelete) {
                    let data: any = {
                        mobileNo: contactinfo.phoneNo,
                        messagetype: 'closed',
                        fromId: this.userData.userId,
                        logInUserName: this.logInUserName,
                    };
                    this.masterName = `/chat-activity/closed`;
                    let addData: any = {
                        url: this.masterName,
                        model: data,
                    };
                    this.isProceess = true;
                    this.subscription = this.apiService
                        .add(addData)
                        .pipe(take(1))
                        .subscribe(
                            (res) => {
                                if (res.status == 'Success') {
                                    this.toastr.success(res.message);
                                    this.isProceess = false;
                                    this.whatsappService
                                    const foundContact = this.findByPhoneNumber(data.mobileNo);
                                    if (foundContact) {
                                        this.onViewContact(foundContact, 1);
                                    } else {
                                        console.log("Contact not found");
                                    }

                                }
                                if (res.status == 'failed') {
                                    this.toastr.error(res.message);
                                    this.isProceess = false;
                                }
                            },
                            (error) => {
                                this.isProceess = false;
                                this.toastr.error(error.error.message);
                            }
                        );
                }
            })
            .catch(() => { });
    }

    @ViewChild('chatContainer') private chatContainer!: ElementRef;
    @ViewChild('msgHistory', { static: true }) msgHistory!: ElementRef;






    ngAfterViewChecked() {
        // this.scrollToBottom();
        // this.handleImageScrolling();

    }
    ngAfterViewInit() {
        this.scrollToBottom();
        this.handleImageScrolling();
        // this.handleImageScrolling();

    }

    private handleImageScrolling(): void {
        const lastMessage = this.receivedData[this.receivedData.length - 1];



        if (lastMessage?.messagetype === 'image' || lastMessage?.messagetype === 'document') {
            // Wait for the image to load before scrolling
            const imgElement = document.querySelector(`img[data-id="${lastMessage.messageId}"]`) as HTMLImageElement;

            if (imgElement) {
                imgElement.onload = () => {
                    this.scrollToBottom();
                };
            }
            else {
                console.warn('Image element not found for messageId:', lastMessage.messageId);
                this.scrollToBottom(); // Fallback
            }
        } else {
            this.scrollToBottom();
        }
    }




    // Sanitize the messageId to escape invalid characters for a CSS selector
    sanitizeSelector(messageId: string): string {
        return messageId.replace(/([^\w-])/g, '\\$1');
    }


    isOpen: boolean = false;
    loadUserActivity(phoneNo: string) {
        this.masterName = `/chat-activity/${phoneNo}`;
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1), distinctUntilChanged(),)
            .subscribe(
                (data) => {
                    this.Userinfo = data;
                    // this.isOpen = this.Userinfo.isopen;

                    this.nrSelect = this.Userinfo?.assignedto;
                    if (this.nrSelect === this.Userinfo?.assignedto) {
                        const foundItem = this.aciveUser.find(
                            (item) => item.userId === this.Userinfo?.assignedto
                        );
                        if (foundItem) {
                            this.DefoluteSelect =
                                foundItem.firstName + ' ' + foundItem.lastName;
                        } else {
                            this.DefoluteSelect =
                                this.Userinfo?.firstName + ' ' + this.Userinfo?.lastName;
                        }
                    }

                    // this.isProceess = false;
                    this.cd.detectChanges();
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }



    getOnlyName(name: any) {
        // Remove emojis and emoji picker emoji
        const emojiRegex =
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FAFF}\u{2000}-\u{2BFF}\u{2600}-\u{26FF}\u{2300}-\u{23FF}\u{2700}-\u{27BF}\u{2B05}\u{2194}-\u{21AA}\u{2B05}\u{2B06}\u{2934}\u{25AA}\u{25FE}\u{25FD}\u{2B1B}\u{2B1C}\u{25B6}\u{25AA}\u{25FE}\u{25FD}\u{2B1B}\u{2B1C}\u{25B6}]+/gu;
        const nameWithoutEmojis = name.replace(emojiRegex, '');

        // Remove numbers
        const nameWithoutNumbers = nameWithoutEmojis.replace(/\d/g, '');

        // Trim any leading or trailing spaces
        const trimmedName = nameWithoutNumbers.trim();

        return trimmedName;
    }

    private speakNotification(message: string) {
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'hi-IN';
        speechSynthesis.speak(utterance);
    }

    toggleupload() {
        this.showEmojiPicker = false;
        this.showupload1 = false;
        this.showupload = !this.showupload;
    }

    togglecart() {
        this.showEmojiPicker = false;
        this.showupload = false;
        this.showupload1 = !this.showupload1;
    }
    // Download code start

    downloadFile(e: any) {
        // window.open(e.fileUrl, '_blank');
        this.http.get(e.fileUrl, { responseType: 'blob' }).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const modifiedFilename = e.filename.slice(24); // Slice the first 24 characters

            a.download = modifiedFilename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    }

    downloadFile1(e: any) {
        const link = document.createElement('a');
        link.setAttribute('href', e.templateHeaderfileLink);
        link.setAttribute('download', e.templateName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    ActiveLabels() {
        this.isProceess = true;
        this.masterName = '/label/active';
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.dataLabel = data.data;
                    this.isProceess = false;
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    onCheckIn() {
        this.isProceess = true;
        const modalRef = this.modalService.open(CheckInComponent, { size: "sm" });

        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as CheckInComponent;
        componentInstance.customersMaster = this.slecteduser;

        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }
        modalRef.result.then((data: any) => {
            if (data) {
                var model: any = {
                    guestName: data.guestName.trim(),
                    roomNumber: data.roomNumber,
                    numberoGuiest: data.numberoGuiest,
                    //guestStatus: "CheckIn",

                    customerMobile: this.contact
                }
                this.masterName = `/customer/checkin`;
                let addData: any = {
                    url: this.masterName,
                    model: model
                }
                this.isProceess = true;
                this.subscription = this.apiService.add(addData).pipe(take(1), distinctUntilChanged()).subscribe(res => {
                    this.isProceess = false;
                    this.toastr.success(res.message);
                    this.checkstatus();
                }, error => {
                    this.isProceess = false;
                    this.toastr.error(error.messages);
                });
            }
        }).catch(() => { });
    }


    onCheckOut() {
        this.isProceess = true;
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        if (modalRef) {
            this.isProceess = false;
        }
        else {
            this.isProceess = false;
        }

        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Are you sure you want to check out this?";


        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.isProceess = true;

                this.masterName = `/customer/checkout?id=${this.checkindata.guestId}`;
                console.log(this.masterName);
                let updateData: any = {
                    url: this.masterName,
                    model: this.checkindata.guestId
                }

                this.subscription = this.apiService.update(updateData).pipe(take(1)).subscribe(data => {
                    this.isProceess = false;
                    this.toastr.success(data.message);
                    this.checkstatus();

                }, error => {
                    this.isProceess = false;
                    this.toastr.error(error.error.message);
                });
            }
        }).catch(() => { });
    }

    isOverflowing(el: any) {
        return el.offsetWidth < el.scrollWidth;
    }

    getColorClass(index: number): string {
        const colors = [
            'color1',
            'color2',
            'color3',
            'color4',
            'color5',
            'color6',
            'color7',
        ]; // Define the colors in a repeated pattern
        const colorIndex = index % colors.length; // Get the color index based on the remainder
        return colors[colorIndex];
    }

    ActiveUser() {
        this.isProceess = true;
        this.masterName = '/users/active';
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.aciveUser = data;
                    console.log();

                    this.isProceess = false;
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    getShortName(fullName?: any) {
        return fullName.charAt(0);
        // return fullName?.split(' ').map((n: any[]) => n[0]).join('');
    }



    // ngAfterViewInit() { }




    //!getContactList
    getContactList() {


        // Subscribe to contact list updates from the shared service
        this.subscription = this.whatsappService.contactList$.subscribe(response => {
            this.contactList = response;
            // Ensure 'this.contactList[0]?.open' is defined or fallback to empty array
            this.open = this.contactList[0]?.open ?? [];

            // Ensure 'this.contactList[0]?.missed' is defined or fallback to empty array
            if (this.userData?.role?.roleName == 'Admin') {
                // If the user is admin, display all missed contacts
                this.missed = Array.isArray(this.contactList[0]?.missed)
                    ? this.contactList[0].missed.sort((a: any, b: any) =>
                        a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' }))
                    : [];
            } else {
                // If not admin, filter missed contacts based on user ID
                this.missed = Array.isArray(this.contactList[0]?.missed)
                    ? this.contactList[0].missed.filter((contact: any) =>
                        contact.missedBy === this.userData?.userId)
                    : [];
            }


            this.missedCount = this.missed.length ?? 0;

            // Ensure other properties are handled safely (fallback to zero if undefined)
            this.openCount = this.contactList[0]?.openCount ?? 0;
            this.closedCount = this.contactList[0]?.closedCount ?? 0;
            this.closed = this.contactList[0]?.closed ?? [];

            this.isProceess = false;
        });


        // Fetch the contact list
        if (this.userData?.role?.roleName === 'Admin') {
            this.whatsappService.getContactList().subscribe();
        } else {
            this.whatsappService.getContactListForUser(this.userData?.userId).subscribe();
        }

    }


    GetUser() {
        if (this._route.snapshot.paramMap.get('status') != null) {
            this.show = true;
            this.isProceess = true;

            if (this.isstatus == 'close') {
                this.isstatus = 'close';
            }
            else if (this.isstatus == 'close') {
                this.isstatus = 'open';
            }
            else {
                this.isstatus = 'open';
            }



            this.subscription = this.CSAPI.customerDetailByID(
                this._route.snapshot.paramMap.get('status')
            )
                .pipe(take(1))
                .subscribe({
                    next: (data: any) => {
                        if (data) {
                            this.data = data;
                            this.contact = this.data.contact;
                            if (this.contact) {
                                const foundContact = this.findByPhoneNumber(this.contact);
                                if (foundContact) {
                                    this.onViewContact(foundContact, 1);
                                } else {
                                    console.log("Contact not found");
                                }
                            }
                        }
                    },
                    error: (e) => console.error(e),
                });
        } else {
            this.isProceess = false;

        }
        this.isProceess = false;
    }


    findByPhoneNumber = (phoneNumber: string) => {
        const contactList = this.contactList?.length > 0 ? this.contactList[0] : null;

        if (!contactList) {
            console.error("Contact list is empty or undefined");
            return null; // Return null if contactList is empty or undefined
        }

        const result = contactList.open.find((chat: any) => chat.phoneNo === phoneNumber) ||
            contactList.closed.find((chat: any) => chat.phoneNo === phoneNumber) ||
            contactList.missed.find((chat: any) => chat.phoneNo === phoneNumber);

        return result ? result : null;
    };

    handleClick(status: any) {
        this.isstatus = status;
    }

    checkstatus() {
        this.masterName = `/customer/checkin-status/${this.contact}`;
        // this.isProceess = true;
        this.subscription = this.apiService.getAll(this.masterName).pipe(take(1)).subscribe(data => {
            if (data) {
                this.checkindata = data.data;

                // this.isProceess = false;
                this.cd.detectChanges();

            }

        }, error => {
            console.log(error.error.status);

            // this.isProceess = false;
        })

    }


    onlabel(e: any) {
        this.masterName = `/customer/label-update/${this.contact}/${e.id}`;
        let updateData: any = {
            url: this.masterName,
        };
        this.isProceess = true;
        this.subscription = this.apiService
            .update(updateData)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    // this.toastr.success(res.message);
                    this.isProceess = false;
                    this.getContactList();
                    this.label = e.name;
                },
                (error) => {
                    this.toastr.error(error.message);
                    this.isProceess = false;
                }
            );
    }

    onlabelRemove(e: any) {
        this.isProceess = true;
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, {
            size: 'sm',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance =
            modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = 'Are you sure you want to remove this ?';
        modalRef.result
            .then((canDelete: boolean) => {
                if (canDelete) {
                    this.masterName = `/customer/label-remove/${this.contact}`;
                    this.subscription = this.apiService
                        .deleteID(this.masterName)
                        .pipe(take(1))
                        .subscribe(
                            (res) => {
                                this.label = '';
                                this.isProceess = false;
                                // this.toastr.success(res.message);
                                this.getContactList();
                            },
                            (error) => {
                                this.isProceess = false;
                                this.toastr.error(error.message);
                            }
                        );
                }
            })
            .catch(() => { });
    }

    submitNoteForm(form: any) {
        if (form.valid) {
            let phone;
            if (this.contact === undefined) {
                phone = this.data.contact;
            } else {
                phone = this.contact;
            }
            var request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                type: 'notes',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                names: this.contactinfo?.fullName || null,
                text: {
                    preview_url: false,
                    body: form.value.note,
                },
            };
            let formData = new FormData();
            formData.append('messageEntry', JSON.stringify(request));
            this.isProceess = true;
            this.subscription = this.whatsappService
                .sendWhatsAppMessage(formData)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        let data: any = response;
                        // this.toastr.success(data.message);
                        this.isProceess = false;
                        this.showEmojiPicker = false;
                        form.reset();
                        this.scrollToBottom();

                        const audio = new Audio(
                            '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                        );
                        audio.play();
                    },
                    (error) => {
                        this.toastr.error(error.error.message);
                        this.isProceess = false;
                        form.reset();
                    }
                );
        }
    }

    quickReply() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        this.showEmojiPicker = false;
        const modalRef = this.modalService.open(QuickReplyComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                this.message = data;
            })
            .catch(() => { });
    }

    submitForm(form: any) {
        if (form.valid) {
            var request = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                type: 'text',
                fromId: this.userData?.userId,
                logInUserName: this.logInUserName,
                assignedto: this.userData?.userId,
                names: this.contactinfo?.fullName || null,
                text: {
                    preview_url: false,
                    body: form.value.chat,
                },
            };
            let formData = new FormData();
            formData.append('messageEntry', JSON.stringify(request));
            this.isProceess = true;
            this.subscription = this.whatsappService
                .sendWhatsAppMessage(formData)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        let data: any = response;
                        // this.toastr.success(data.message);
                        this.isProceess = false;
                        this.showEmojiPicker = false;
                        form.reset();
                        this.scrollToBottom();

                        const audio = new Audio(
                            '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                        );
                        audio.play();
                    },
                    (error) => {
                        this.toastr.error(error.error.message);
                        this.isProceess = false;
                        form.reset();
                    }
                );
        }
    }

    sendingCatalog(e: any) {
        var request = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
            type: 'interactive',
            fromId: this.userData?.userId,
            logInUserName: this.logInUserName,
            assignedto: this.userData?.userId,
            fullname: this.contactinfo?.fullName || null,
            interactiveName: e,
        };
        let formData = new FormData();
        this.showupload1 = false;
        formData.append('messageEntry', JSON.stringify(request));
        this.isProceess = true;
        this.subscription = this.whatsappService
            .sendWhatsAppMessage(formData)
            .pipe(take(1))
            .subscribe(
                (response) => {
                    let data: any = response;
                    // this.toastr.success(data.message);
                    this.isProceess = false;
                    this.showEmojiPicker = false;
                    this.scrollToBottom();

                    const audio = new Audio(
                        '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                    );
                    audio.play();
                },
                (error) => {
                    this.toastr.error(error.error.message);
                    this.isProceess = false;
                }
            );
    }

    onError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = '../assets/images/default-nopic.jpg';
    }

    ngOnDestroy() {
        // this.socket$.complete();
        this.subscription?.unsubscribe();
    }


    selectDepartment(e: any) {
        let phone;
        if (this.contact == undefined) {
            phone = this.data.contact;
        } else {
            phone = this.contact;
        }
        let data = {
            mobileNo: phone,
            messagetype: 'assigned',
            assignedto: e,
            fromId: this.userData.userId,
            logInUserName: this.logInUserName,
        };
        this.masterName = `/chat-activity/assigned`;
        let addData: any = {
            url: this.masterName,
            model: data,
        };
        this.isProceess = true;
        this.subscription = this.apiService
            .add(addData)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    if (res.status == 'Success') {
                        this.toastr.success(res.message);
                        this.isProceess = false;
                        this.loadUserActivity(data.mobileNo)

                    }
                    if (res.status == 'failed') {
                        this.toastr.error(res.message);
                        this.isProceess = false;
                    }
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    onimageAdd() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        const modalRef = this.modalService.open(ImageUplodComponent, {
            size: 'lg',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }

        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'image',
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        names: this.contactinfo?.fullName || null,
                        logInUserName: this.logInUserName,
                    };
                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    formData.append('file', data.file);
                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    onaudioAdd() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        const modalRef = this.modalService.open(AudioComponent, {
            size: 'md',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'audio',
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        names: this.contactinfo?.fullName || null,
                        logInUserName: this.logInUserName,
                    };
                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    formData.append('file', data.file);
                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    ondocumentAdd() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        const modalRef = this.modalService.open(DocumentComponent, {
            size: 'md',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'document',
                        caption: data.caption,
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        names: this.contactinfo?.fullName || null,
                        logInUserName: this.logInUserName,
                    };
                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    formData.append('file', data.file);
                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    onvideoAdd() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        const modalRef = this.modalService.open(VideoComponent, {
            size: 'md',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'video',
                        caption: data.caption,
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        names: this.contactinfo?.fullName || null,
                        logInUserName: this.logInUserName,
                    };
                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    formData.append('file', data.file);
                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    onLocationAdd() {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        const modalRef = this.modalService.open(LocationDetailsComponent, {
            size: 'md',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }

        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'location',
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        names: this.contactinfo?.fullName || null,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        locationAddress: data.address,
                        locationName: data.locationName,
                        logInUserName: this.logInUserName,
                    };
                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    getTemplates(e: any) {
        this.isProceess = true;
        this.showupload = false;
        this.showupload1 = false;
        this.showEmojiPicker = false;
        const modalRef = this.modalService.open(TempletsComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }
        var componentInstance = modalRef.componentInstance as TempletsComponent;
        const apiData: any = 'all'
        componentInstance.issuesMaster = { eventData: e, apiData };
        modalRef.result
            .then((data: any) => {
                if (data) {
                    var request = {
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: this.contactinfo?.phoneNo ?? this.contactinfo?.mobileNo,
                        type: 'template',
                        fromId: this.userData?.userId,
                        assignedto: this.userData?.userId,
                        fullname: this.contactinfo?.fullName || null,
                        templateName: data.templateName,
                        templateBody: data.templateBody,
                        templateHeader: data.templateHeader,
                        logInUserName: this.logInUserName,
                    };

                    let formData = new FormData();
                    formData.append('messageEntry', JSON.stringify(request));
                    formData.append('file', data.file);

                    this.isProceess = true;
                    this.subscription = this.whatsappService
                        .sendWhatsAppMessage(formData)
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                let data: any = response;
                                // this.toastr.success(data.message);
                                this.isProceess = false;
                                this.showEmojiPicker = false;
                                this.scrollToBottom();

                                const audio = new Audio(
                                    '../../../../../assets/sound/Whatsapp Message - Sent - Sound.mp3'
                                );
                                audio.play();
                            },
                            (error) => {
                                this.toastr.error(error.error.message);
                                this.isProceess = false;
                            }
                        );
                }
            })
            .catch(() => { });
    }

    sanitizeUrl(url: string): SafeResourceUrl {
        // console.log(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        return url;
        // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    // In your component class
    handleError() {
        // console.error("Error loading PDF file.");
        // You can also update a variable to show/hide a specific error message
    }



    oncatalog(e: any) {
        this.isProceess = true;
        const modalRef = this.modalService.open(CatalogComponent, { size: "md" });

        if (modalRef) {
            this.isProceess = false;
        } else {
            this.isProceess = false;
        }

        var componentInstance = modalRef.componentInstance as CatalogComponent;
        componentInstance.catalog = e;
    }


    getFormattedText(text: string): string {
        const formattedText = text.replace(/ \/n/g, '<br>');
        return formattedText;
    }


    closeEmojiPickerTray() {
        this.showEmojiPicker = false;
        // this.isCartPopupOpen = false;
    }

    closeAttachTray() {
        this.showupload = false;
    }

    closeCartTray() {
        this.showupload1 = false;
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const attachTray = document.getElementById('chat-emoji-ico');
        if (attachTray && !attachTray.contains(event.target as Node)) {
            this.closeEmojiPickerTray();
        }

        const attachTray1 = document.getElementById('chat-attach-ico');
        if (attachTray1 && !attachTray1.contains(event.target as Node)) {
            this.closeAttachTray();
        }

        const attachTray2 = document.getElementById('chat-cart-ico');
        if (attachTray2 && !attachTray2.contains(event.target as Node)) {
            this.closeCartTray();
        }


    }

}
