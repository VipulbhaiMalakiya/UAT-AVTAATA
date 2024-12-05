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

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent
    implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    show: boolean = false;
    data: any = [];
    bgclass: any;
    lastMessageTime?: number; // Timestamp of the last message
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
    contactList: any;
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


    // @ViewChild('chatContainer') chatContainer!: ElementRef;

    private currentPage: number = 1;
    private pageSize: number = 5;


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

    replaceAndBoldPlaceholder(data?: any): any {
        // Check if data is defined
        if (!data) {
            return 'Data is undefined or null.';
        }

        // Check if data has the necessary properties
        if (
            !data.templateBodyAttributes ||
            data.templateBodyAttributes.length === 0
        ) {
            return 'templateBodyAttributes is missing or empty.';
        }

        const name = data.templateBodyAttributes[0];
        // console.log(data);
        // debugger;

        // Check if the originalString exists and contains the placeholder
        if (!data.templatePreview || !data.templatePreview.includes('{{1}}')) {
            return 'originalString is missing or does not contain {{1}} placeholder.';
        }

        const originalString = data.templatePreview;
        const replacedString = originalString.replace('{{1}}', name);

        return replacedString;
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
        private http: HttpClient
    ) {
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);
        this.logInUserName = this.userData.firstName + ' ' + this.userData.lastName;
        this.nrSelect = this.userData?.userId;
        this.titleService.setTitle('CDC -Inbox');
        this.getContactList();

    }
    ngOnInit(): void {
        setTimeout(() => {
            this.connect();
            this.ActiveUser();
            this.getContactList();
            this.ActiveLabels();
            this.GetUser();

        }, 2000);



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
                        const mobileNoExists = this.open.some((item: any) =>
                            item.phoneNo === data.mobileNo || data.assignedto == this.userData.userId
                        );

                        if (this.userData.role.roleName == 'Admin') {

                            this.speakNotification(message);
                        }
                        else if (data.assignedto == this.userData.userId || mobileNoExists) {
                            this.speakNotification(message)
                        }

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

    private lastContact: string | null = null; // Store the last contact to compare


    onViewContact(e: any, c: any) {

        // Check if the contact has changed
        if (this.lastContact === e.phoneNo) {
            console.log("Duplicate contact selected, skipping API call.");
            return; // Skip if the contact is the same as the previous one
        }
        this.lastContact = e.phoneNo;

        this.pageSize = 5;
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




        // this.masterName = `/customer/seen-ByMobileNo/${this.contact}/seen/false`;
        // this.subscription = this.apiService.getAll(this.masterName).pipe(take(1)).subscribe(data => {
        //     console.log(data)
        // }, error => {
        // })

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

        // this.loadChatHistory()
        this.loadInitialData();
        this.loadUserActivity(this.contact)


    }


    loadInitialData() {
        this.loadChatHistory(true);
    }


    loadChatHistory(isInitialLoad: boolean = false) {

        this.isProceess = true;

        this.subscription = this.whatsappService
            .chatHistorynew(this.contact, this.currentPage, this.pageSize)
            .pipe(take(1), distinctUntilChanged())
            .subscribe(
                (response: any) => {
                    // this.item = response;
                    // // this.receivedData = this.item;
                    // this.item = response;
                    // this.receivedData = [...this.receivedData, ...this.item];


                    if (isInitialLoad) {
                        this.receivedData = [...response];  // For initial load, just replace data
                    } else {
                        this.receivedData = [...this.receivedData, ...response];  // Append new data
                    }


                    if (this.currentPage == 1) {
                        this.scrollToBottom();

                    }
                    else {
                        this.scrollToMiddle();
                    }
                    // this.scrollToBottom();
                    this.currentPage++;  // Increment page number for next re


                    const lstRe = this.receivedData.slice(-1)[0];
                    this.lastItem = lstRe.time;
                    this.lastMessageTime = this.lastItem;
                    if (lstRe.mobileNo === this.contact) {
                        // this.checkChatStatus();
                    }

                    this.isProceess = false;
                },
                (error) => {
                    this.isProceess = false;
                }
            );

    }


    @ViewChild('chatContainer') private chatContainer!: ElementRef;
    @ViewChild('msgHistory', { static: true }) msgHistory!: ElementRef;


    onScroll(event: Event): void {
        const target = event.target as HTMLElement;

        // Check if the user has scrolled up 50px from the top and there are no ongoing requests
        if (target.scrollTop <= 50 && !this.isProceess) {
            this.loadChatHistory(); // Load previous messages when scrolled within 50px from the top
        }
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        // this.scrollToBottom();
    }
    private scrollToBottom(): void {
        setTimeout(() => { // Use setTimeout to ensure the DOM is fully rendered
            try {
                if (this.chatContainer && this.chatContainer.nativeElement) {
                    const container = this.chatContainer.nativeElement;
                    const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight;
                    if (!atBottom) {
                        container.scrollTop = container.scrollHeight;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, 0);
    }



    scrollToMiddle() {
        setTimeout(() => { // Use setTimeout to ensure the DOM is fully rendered
            try {
                const container = this.chatContainer.nativeElement;
                const middle = container.scrollHeight / 2;
                container.scrollTo({
                    top: middle,
                    // behavior: 'smooth' // for smooth scrolling
                });
            } catch (err) {
                console.error(err);
            }
        }, 0);
    }

    loadUserActivity(phoneNo: string) {
        this.masterName = `/chat-activity/${phoneNo}`;
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1), distinctUntilChanged(),)
            .subscribe(
                (data) => {
                    this.Userinfo = data;
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

                    this.isProceess = false;
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
            a.download = e.name ?? e.filename; // Set the filename here
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
        // this.isProceess = true;

        if (this.userData?.role?.roleName === 'Admin') {
            this.subscription = this.whatsappService
                .getContactList()
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.contactList = response;
                        this.open = this.contactList[0].open;
                        this.missed = this.contactList[0].missed.filter((contact: any) => contact.missedBy === this.userData?.userId) ?? [];
                        this.missedCount = this.missed.length ?? 0;
                        this.openCount = this.contactList[0].openCount;
                        this.closedCount = this.contactList[0].closedCount;
                        this.closed = this.contactList[0].closed;
                        this.isProceess = false;
                        this.cd.detectChanges();
                    },
                    (error) => {
                        this.isProceess = false;
                    }
                );
        } else {
            this.subscription = this.whatsappService
                .getContactListForUser(this.userData?.userId)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        this.contactList = response;
                        this.open = this.contactList[0].open;
                        // this.missed = this.contactList[0].missed ?? [];

                        this.missed = this.contactList[0].missed.filter((contact: any) => contact.missedBy === this.userData?.userId) ?? [];
                        this.missedCount = this.missed.length ?? 0;
                        this.openCount = this.contactList[0].openCount;
                        this.closedCount = this.contactList[0].closedCount;
                        this.closed = this.contactList[0].closed;
                        this.label = this.isProceess = false;
                        this.cd.detectChanges();

                    },
                    (error) => {
                        this.isProceess = false;
                    }
                );
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
                                    this.subscription = this.whatsappService
                                        .chatHistory(data.mobileNo)
                                        .pipe(take(1))
                                        .subscribe(
                                            (response) => {
                                                this.item = response;
                                                this.receivedData = this.item;
                                                this.isProceess = false;
                                                this.masterName = `/outgoing-activity/${data.mobileNo}`;
                                                this.subscription = this.apiService
                                                    .getAll(this.masterName)
                                                    .pipe(take(1))
                                                    .subscribe(
                                                        (data) => {
                                                            this.Userinfo = data;
                                                            this.nrSelect = this.Userinfo.assignedto;
                                                            this.isProceess = false;
                                                            this.cd.detectChanges();
                                                        },
                                                        (error) => {
                                                            this.isProceess = false;
                                                        }
                                                    );
                                                this.getContactList();
                                            },
                                            (error) => {
                                                this.isProceess = false;
                                            }
                                        );
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
                        this.subscription = this.whatsappService
                            .chatHistory(data.mobileNo)
                            .pipe(take(1))
                            .subscribe(
                                (response) => {
                                    this.item = response;
                                    this.receivedData = this.item;
                                    this.isProceess = false;
                                    this.masterName = `/chat-activity/${data.mobileNo}`;
                                    this.subscription = this.apiService
                                        .getAll(this.masterName)
                                        .pipe(take(1))
                                        .subscribe(
                                            (data) => {
                                                this.Userinfo = data;
                                                this.nrSelect = this.Userinfo.assignedto;
                                                if (this.nrSelect === this.Userinfo?.assignedto) {
                                                    const foundItem = this.aciveUser.find(
                                                        (item) => item.userId === this.Userinfo?.assignedto
                                                    );
                                                    if (foundItem) {
                                                        this.DefoluteSelect =
                                                            foundItem.firstName + ' ' + foundItem.lastName;
                                                    } else {
                                                        this.DefoluteSelect =
                                                            this.Userinfo?.firstName +
                                                            ' ' +
                                                            this.Userinfo?.lastName;
                                                    }
                                                }
                                                this.isProceess = false;
                                                this.cd.detectChanges();
                                                this.getContactList();
                                            },
                                            (error) => {
                                                this.isProceess = false;
                                            }
                                        );
                                },
                                (error) => {
                                    this.isProceess = false;
                                }
                            );
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
        componentInstance.issuesMaster = e;

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


}
