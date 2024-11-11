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


};

environment.apiUrl = `https://${environment._APImainDomain}`;
// const loginUrl = (localStorage.getItem('loginUrl') || '').toLowerCase();
// if (loginUrl) {
//     environment.apiUrl = `https://${loginUrl}.${environment._APImainDomain}`;
// }

