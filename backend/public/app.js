// This is the main entry point for the AngularJS application.
// It sets up the AngularJS module, configures routing, and includes necessary dependencies.
// It also includes the AuthInterceptor for handling authentication tokens in HTTP requests.

var app = angular.module('MerchantApp', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $httpProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .otherwise({ redirectTo: '/login' });

    $httpProvider.interceptors.push('AuthInterceptor');
});