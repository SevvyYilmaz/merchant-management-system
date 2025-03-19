// This file is part of the backend public services for an AngularJS application.
// It defines an AuthInterceptor service that intercepts HTTP requests and responses to handle authentication tokens.
// It uses the $q service for promise handling and the $cookies service to manage cookies.


app.factory('AuthInterceptor', function($q, $cookies) {
    return {
        request: function(config) {
            var token = $cookies.get('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        responseError: function(response) {
            if (response.status === 401) {
                window.location = '#/login';
            }
            return $q.reject(response);
        }
    };
});