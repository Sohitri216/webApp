'use strict';

module.exports = [
  '$q',
  '$http',
  'toastr',
  function($q, $http, toastr) {
    return {
      apiInterceptor: function apiInterceptor(ApiObj) {
        var deffered = $q.defer();
        $http({
            method: ApiObj.method || 'GET',
            // headers: ApiObj.headers,
            url: ApiObj.url || '',
            params: ApiObj.params || {},
            data: ApiObj.data || {}
          })
          .then(function(data) {
            // console.log('then response', data.data);
            var responseData = data.data;
            if (responseData) {
              if (!responseData.success) {
                toastr.error(responseData.message, 'Error', {
                  iconClass: 'toast-error'
                });
                deffered.reject(responseData);
              } else {
                deffered.resolve(responseData);
              }
            } else {
              deffered.reject(responseData);
            }
            // if (data.success) {
            //     deffered.resolve(data);
            // } else {
            //     deffered.reject(data);
            // }
          }, function(err) {
            console.log('Error:', err);
            // if (err.status !== 404) {
              toastr.error(err.message, 'No Internet Connection', { // jshint ignore:line
                iconClass: 'toast-error'
              });
            // }
            deffered.reject(err);
          });
        return deffered.promise;
      }
    };
  }
];
