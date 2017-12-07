'use strict';

function PublicService($window, HttpService, API) {

    function getBasicServiceConfig() {
        var apiObject = {
            method: 'POST',
            url: API.basicServiceConfig
        };

        return HttpService
            .apiInterceptor(apiObject);
    }

    function getAdditionalServices() {
        var apiObject = {
            method: 'POST',
            url: API.additionalServiceList
        };

        return HttpService
            .apiInterceptor(apiObject);
    }

    function getOfferPrice() {
        var apiObject = {
            method: 'POST',
            url: API.offerPrice
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function getFreeSlot(obj) {
        var apiObject = {
            method: 'POST',
            url: API.getFreeSlot,
            data: obj
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function fetchLocation() {
        var apiObject = {
            method: 'POST',
            url: API.userLocation
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function fetchAdditional() {
        var apiObject = {
            method: 'POST',
            url: API.getAdditionalService
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function checkLocation(addr) {
        var apiObject = {
            method: 'POST',
            url: API.locationCheck,
            data: { 'address': addr }
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function getTaxConfig() {
        var apiObject = {
            method: 'POST',
            url: API.getTaxConfig
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function registerUser(obj) {
        var apiObject = {
            method: 'POST',
            url: API.userRegistration,
            data: obj
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function bookService(obj) {
        var apiObject = {
            method: 'POST',
            url: API.userBooking,
            data: obj
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function userPayment(obj) {
        var apiObject = {
            method: 'POST',
            url: API.userPayment,
            data: obj
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    function checkSlot(obj) {
        console.log('in service:', obj);
        var apiObject = {
            method: 'POST',
            url: API.checkSlot,
            data: obj
        };
        return HttpService
            .apiInterceptor(apiObject);
    }

    return {
        getBasicServiceConfig: getBasicServiceConfig,
        getAdditionalServices: getAdditionalServices,
        getOfferPrice: getOfferPrice,
        getFreeSlot: getFreeSlot,
        fetchLocation: fetchLocation,
        fetchAdditional: fetchAdditional,
        checkLocation: checkLocation,
        getTaxConfig: getTaxConfig,
        registerUser: registerUser,
        bookService: bookService,
        userPayment: userPayment,
        checkSlot: checkSlot
    };


}
PublicService.$inject = ['$window', 'HttpService', 'API'];
module.exports = PublicService;