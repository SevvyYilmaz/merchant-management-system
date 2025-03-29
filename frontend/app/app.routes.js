angular.module('MerchantApp')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/login', {
      templateUrl: 'app/views/login.html',
      controller: 'LoginController'
    })
    .when('/dashboard', {
      templateUrl: 'app/views/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/merchants', {
      templateUrl: 'app/views/merchants.html',
      controller: 'MerchantController'
    })
    .when('/merchants/:id', {
      templateUrl: 'app/views/merchant-profile.html',
      controller: 'MerchantProfileController'
    })
    .when('/users', {
      templateUrl: 'app/views/users.html',
      controller: 'UserController'
    })
    .when('/residuals', {
      templateUrl: 'app/views/residuals.html',
      controller: 'ResidualController'
    })
    .when('/devices', {
      templateUrl: 'app/views/devices.html',
      controller: 'DeviceController'
    })
    .when('/register', {
        templateUrl: 'app/views/register.html',
        controller: 'RegisterController'
      })
      .when('/devices/:id', {
        templateUrl: 'app/views/device-profile.html',
        controller: 'DeviceProfileController'
      })
      
    .otherwise({ redirectTo: '/login' });

  // Optional clean URL support
  // $locationProvider.html5Mode(true);
}]);
