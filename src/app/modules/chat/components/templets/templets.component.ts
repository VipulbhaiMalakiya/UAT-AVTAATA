import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';

@Component({
    selector: 'app-templets',
    templateUrl: './templets.component.html',
    styleUrls: ['./templets.component.css'],
})
export class TempletsComponent implements OnInit {
    isProceess: boolean = true;
    masterName?: any;
    templetsdata: any = [];
    templet: any = {};
    dataArray: any[] = [];
    term: any;
    imageURL: any = '../../../../../assets/images/ceo-template.jpeg';
    previewUrl: any;
    uploadFile?: any;
    username: any;
    password: any;

    variable1: any;
    variable2: any;
    variable3: any;
    url: any

    set issuesMaster(value: any) {
        this.username = value.eventData;
        this.url = value.apiData;
    }
    constructor(
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {




        this.fatchData();
    }
    fatchData() {
        if (this.url == 'marketing') {
            this.masterName = '/meta-templates/marketing';
        }
        else {
            this.masterName = '/meta-templates';
        }
        this.apiService
            .getAll(this.masterName)
            .pipe(take(1))
            .subscribe(
                (data) => {
                    if (data) {
                        this.templetsdata = data.data;
                        this.templet = this.templetsdata[0];

                        this.isProceess = false;
                        this.cd.detectChanges();
                    }
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    attributeLength: any;
    onView(i: any) {
        this.templet = i;

        // Check if attributeLength is defined
        if (this.templet?.body?.bodyattribute?.length !== undefined) {

            this.attributeLength = this.templet?.body?.bodyattribute?.length;
        } else {
        }

    }

    getVariableValues(template: string) {
        const variable1 = this.templet?.body?.bodyattribute?.[0] !== 'Name'
            ? this.variable1 || '{{1}}'
            : this.username || '{{1}}';

        const variable2 = this.variable2 !== null && this.variable2 !== undefined
            ? this.variable2
            : '{{2}}'; // Default to empty if null or undefined

        const variable3 = this.variable3 !== null && this.variable3 !== undefined
            ? this.variable3
            : '{{3}}'; // Default to empty if null or undefined




        return template
            .replace('{{1}}', variable1)
            .replace('{{2}}', variable2)
            .replace('{{3}}', variable3);
    }




    onFileChange(event: any) {
        const file = event.target.files[0];
        // this.customersMasterForm.get('image').setValue(file);
        // Image preview
        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);

        let data;
        if (event.target.files && event.target.files[0])
            data = event.target.files[0];
        if (event.target.files[0].name && event.target.files.length > 0) {
            data = event.target.files[0];
        } else {
            data = 'null';
        }
        this.uploadFile = data;
    }

    onCancel() {
        this.activeModal.dismiss();
    }



    onSubmit(f: NgForm) {
        if (f.invalid) {
            return;
        }
        {
            let name = f.value.input1;
            let email = f.value.input2;
            let password = f.value.input3;

            if (name && email && password) {
                const newData = [name, email, password];
                this.dataArray.push(newData);
            } else if (name && email) {
                const newData = [name, email];
                this.dataArray.push(newData);
            } else if (name) {
                const newData = [name];
                this.dataArray.push(newData);
            }
            this.dataArray = [].concat(...this.dataArray);
            let data: any = {
                templateName: this.templet.templateName,
                templateBody: {
                    body: this.templet?.body?.body,
                    bodyattribute: this.dataArray,
                },
                templateHeader: {
                    header: this.templet?.header?.header,
                    headerFileType: this?.templet?.header?.headerFileType,
                    link: this.templet?.header?.file,
                },
            };
            this.activeModal.close(data);
        }
    }

    formatTemplateName(templateName: string): string {
        // Replace underscores with spaces
        let formattedName = templateName.replace(/_/g, ' ');

        // Convert to title case
        formattedName = formattedName.replace(/\b\w/g, (char) => char.toUpperCase());

        // Limit to 400 characters
        if (formattedName.length > 400) {
            formattedName = formattedName.substring(0, 400);
        }

        return formattedName;
    }


    loading = true;

    onImageLoad(): void {
        this.loading = false;
    }



    onImageError(event: Event): void {
        this.loading = false;
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'assets/images/ceo-template.jpeg'; // Fallback image
    }
}
