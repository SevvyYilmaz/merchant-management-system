// This is the main entry point for the AngularJS application.
// It sets up the AngularJS module, configures routing, and initializes the application.

angular.module('MerchantApp', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      template: '<merchant-list></merchant-list>'
    })
    .when('/create', {
      template: '<merchant-create></merchant-create>'
    })
    .when('/merchants/edit/:id', {
      template: '<merchant-edit></merchant-edit>'
    })
    .when('/profile/:id', {
      template: '<merchant-profile></merchant-profile>'
    })
    .otherwise({ redirectTo: '/' });
});
