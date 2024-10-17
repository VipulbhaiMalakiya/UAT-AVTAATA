export const environment = {
    production: false,

    //   apiUrl: 'customerdigitalconnect.com', //Uat
    //   SOCKET_ENDPOINT: 'wss://customerdigitalconnect.com/v2.0/chat',

    EncryptKey: '1203199320052021',
    appUrl: 'tcplconnecto.com/#/login',
    _APImainDomain: 'tcplconnecto.com/v2.0',
    subDomain: localStorage.getItem('loginUrl') || '',
    apiUrl: '',

    // apiUrl: 'https://tcplconnecto.com/v2.0',
    //apiUrl: 'https://customerdigitalconnect.com',

    SOCKET_ENDPOINT: 'wss://tcplconnecto.com/v2.0/chat',
    googleMapsApiKey: 'YOUR_API_KEY',

    _subdomain: 'prime',
    _subdomain1: 'cdc',
    _subdomain2: '',
    _subdomain3: '',
    _subdomain4: '',
    _subdomain5: '',
    _subdomain6: '',
    _subdomain7: '',
    _subdomain8: '',
    _subdomain9: '',

};

const loginUrl = localStorage.getItem('loginUrl');

if (loginUrl) {
    switch (loginUrl) {
        case environment.subDomain:
            environment.apiUrl = `https://${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain1:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain2:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain3:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain4:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain5:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain6:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain7:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain8:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        case environment._subdomain9:
            environment.apiUrl = `https:${environment.subDomain}.${environment._APImainDomain}`;
            break;
        default:
            environment.apiUrl = `https://${environment._APImainDomain}`;
            break;
    }
}


// if (localStorage.getItem('loginUrl')) environment.apiUrl = `https://${environment.subDomain}.${environment._APImainDomain}`;

