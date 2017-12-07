'use strict';

// var baseUrl = 'http://192.168.0.61/tidi_phase2/backend';
var baseUrl = 'http://demo.innofied.in/tidi_phase2/backend';
// var baseUrl = location.origin + '/tidi_phase2/backend';

module.exports = {
    basicServiceConfig: baseUrl + '/users/getbasicservices',
    additionalServiceList: baseUrl + '/users/getotherservices',
    offerPrice: baseUrl + '/users/getofferprice',
    getFreeSlot: baseUrl + '/users/getservices',
    getAdditionalService: baseUrl + '/users/getotherservices',
    userLocation: baseUrl + '/users/locationlist',
    locationCheck: baseUrl + 'users/locationcheck',
    userRegistration: baseUrl + '/common/user-registration',
    userBooking: baseUrl + '/users/getbooking',
    getTaxConfig: baseUrl + '/users/gettax',
    userPayment: baseUrl + '/users/payment',
    checkSlot: baseUrl + '/users/slot-check',
    getPrice: baseUrl + '/users/get-price-bed-bath-count',
    getSettings: baseUrl + '/users/settings-list',
    getDiscount: baseUrl + '/users/checkcoupon'
};