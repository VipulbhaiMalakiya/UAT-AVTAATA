export const environment = {
    production: false,
    ReqUrl: 'http://',
    EncryptKey: '1203199320052021',
    appUrl: 'localhost:4200/#/login',
    _APImainDomain: 'tcplconnecto.com/v2.0',
    subDomain: localStorage.getItem('loginUrl') || '',
    apiUrl: '',
    SOCKET_ENDPOINT: 'wss://tcplconnecto.com/v2.0/chat',
    googleMapsApiKey: 'YOUR_API_KEY',

    // Subdomains
    _subdomain: 'prime',
    _subdomain1: 'cdc',
    _subdomain2: 'TCPL',
    _subdomain3: 'TDE',
    _subdomain4: 'Application',
    _subdomain5: 'Administration',
    _subdomain6: 'Marketing',
    _subdomain7: 'Production',
    _subdomain8: 'Accounting',
    _subdomain9: 'Design',
};

// Retrieve loginUrl from localStorage and normalize it to lowercase for comparison
const loginUrl = (localStorage.getItem('loginUrl') || '').toLowerCase();

if (loginUrl) {
    // Switch based on lowercase comparison
    switch (loginUrl) {
        case environment._subdomain1.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain1}.${environment._APImainDomain}`;
            break;
        case environment._subdomain2.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain2}.${environment._APImainDomain}`;
            break;
        case environment._subdomain3.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain3}.${environment._APImainDomain}`;
            break;
        case environment._subdomain4.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain4}.${environment._APImainDomain}`;
            break;
        case environment._subdomain5.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain5}.${environment._APImainDomain}`;
            break;
        case environment._subdomain6.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain6}.${environment._APImainDomain}`;
            break;
        case environment._subdomain7.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain7}.${environment._APImainDomain}`;
            break;
        case environment._subdomain8.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain8}.${environment._APImainDomain}`;
            break;
        case environment._subdomain9.toLowerCase():
            environment.apiUrl = `https://${environment._subdomain9}.${environment._APImainDomain}`;
            break;
        default:
            console.warn("Login URL did not match any case, falling back to default.");
            environment.apiUrl = `https://${environment._APImainDomain}`;
            break;
    }
} else {
    // Handle missing loginUrl case
    console.error("Login URL not found in localStorage, redirecting to default URL.");
    environment.apiUrl = `https://${environment._APImainDomain}`;
}
