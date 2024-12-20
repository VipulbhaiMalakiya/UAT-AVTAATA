import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-location-details',
    templateUrl: './location-details.component.html',
    styleUrls: ['./location-details.component.css'],
})
export class LocationDetailsComponent implements OnInit {
    latitude?: number;
    longitude?: number;
    zoom: number = 14;
    address: any;
    locationName: any;
    center: any
    isProceess: boolean = true;
    customersMasterForm: any;
    uploadFile: any = '';
    check: any;
    imageLoaded = false;
    imageURL: any = '../../../../../assets/images/default-nopic.jpg';
    previewUrl: any;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
    ) {
        this.isProceess = false;

        this.customersMasterForm = this.formBuilder.group({
            latitude: [''],
            longitude: [''],
            address: [''],
            locationName: [''],
        });
        // Initialize center with a default value
        this.center = {
            lat: 0, // Initial latitude
            lng: 0, // Initial longitude
        };
    }

    ngOnInit() {
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;

                    // this.latitude = 15.5930928;
                    // this.longitude = 73.7471647;
                    this.center = {
                        lat: this.latitude,
                        lng: this.longitude,
                    };
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            this.handlePermissionDenied();
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.log("The request to get user location timed out.");
                            break;

                    }
                }
            );
        } else {
            //   this.toastr.warning('Geolocation is not supported by this browser.');
        }
    }

    handlePermissionDenied() {
        // Inform the user that the permission is denied
        this.toastr.error('Geolocation access has been denied. Please enable location access in your browser settings.');

        // Optionally, you can provide a detailed guide based on the browser
        const userAgent = navigator.userAgent;
        let instructions = '';

        if (userAgent.includes('Chrome')) {
            instructions = 'To unblock location access in Chrome, go to Settings > Privacy and security > Site settings > Location. Find your site and set the location access to "Allow".';
        } else if (userAgent.includes('Firefox')) {
            instructions = 'To unblock location access in Firefox, go to Settings > Privacy & Security > Permissions > Location Settings. Find your site and set the location access to "Allow".';
        } else if (userAgent.includes('Safari')) {
            instructions = 'To unblock location access in Safari, go to Preferences > Privacy > Website Tracking. Ensure "Prevent cross-site tracking" is unchecked, then go to Websites > Location and set the access for your site to "Allow".';
        } else if (userAgent.includes('Edge')) {
            instructions = 'To unblock location access in Edge, go to Settings > Cookies and site permissions > Location. Find your site and set the location access to "Allow".';
        } else {
            instructions = 'Please refer to your browser\'s help documentation to unblock location access.';
        }

        this.toastr.info(instructions);
    }

    display: any; // Property to store latitude and longitude data from the map


    move(event: google.maps.MapMouseEvent) {
        // Method to handle map click event and update the display property
        if (event.latLng != null) {
            this.display = event.latLng.toJSON();
        }
    }

    onCancel() {
        this.activeModal.dismiss();
    }

    // getAddressFromCoordinates(latitude?: any, longitude?: any) {
    //   const geocoder = new google.maps.Geocoder();
    //   const latlng = { lat: latitude, lng: longitude };
    //   geocoder.geocode({ location: latlng }, (results, status) => {
    //     if (status === 'OK' && results[0]) {
    //       this.address = results[0].formatted_address;
    //       this.locationName = this.getLocationNameFromGeocodeResult(results[0]);
    //     } else {
    //       console.log('Geocoder failed due to: ' + status);
    //     }
    //   });
    // }

    // getLocationNameFromGeocodeResult(result: google.maps.GeocoderResult): string {
    //   const locationNameComponent = result.address_components.find(
    //     (component) =>
    //       component.types.includes('point_of_interest') ||
    //       component.types.includes('establishment') ||
    //       component.types.includes('natural_feature') ||
    //       component.types.includes('park') ||
    //       component.types.includes('locality')
    //   );

    //   return locationNameComponent ? locationNameComponent.long_name : '';
    // }

    onSubmit() {
        if (this.customersMasterForm.valid) {
            let data = {
                latitude: this.latitude,
                longitude: this.longitude,
                address: this.address,
                locationName: this.locationName,
            };
            this.activeModal.close(data);
        } else {
        }
    }
}
