import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-send-messages-dialog',
    templateUrl: './send-messages-dialog.component.html',
    styleUrls: ['./send-messages-dialog.component.css']
})
export class SendMessagesDialogComponent implements OnInit {
    heading: string = '';
    message: string = '';
    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit(): void {

    }

    onCancel() {
        this.activeModal.close(false);
    }

    onConfirm() {
        this.activeModal.close(true);
    }
}
