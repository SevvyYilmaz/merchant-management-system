angular.module('MerchantApp', ['ngRoute', 'ngAnimate', 'toastr', 'ngStorage'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/dashboard.html',
      controller: 'DashboardController',
      access: { requiresLogin: true }
    })
    .when('/create', {
      templateUrl: 'app/views/merchant-form.html',
      controller: 'MerchantController',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/merchants', {
      templateUrl: 'app/views/merchants.html',
      controller: 'MerchantController',
      access: { requiresLogin: true }
    })
    .when('/merchants/:id', {
      templateUrl: 'app/views/merchant-profile.html',
      controller: 'MerchantProfileController',
      access: { requiresLogin: true }
    })
    .when('/users', {
      templateUrl: 'app/views/users.html',
      controller: 'UserController',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/devices', {
      templateUrl: 'app/views/devices.html',
      controller: 'DeviceController',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/residuals', {
      templateUrl: 'app/views/residuals.html',
      controller: 'ResidualController',
      access: { requiresLogin: true }
    })
    .when('/register', {
      templateUrl: 'app/views/register.html',
      controller: 'RegisterController'
    })
    .when('/login', {
      templateUrl: 'app/views/login.html',
      controller: 'LoginController'
    })
    .otherwise({ redirectTo: '/login' });
})

// ✅ Route Guard using $localStorage
.run(function($rootScope, $location, $localStorage) {
  $rootScope.$on('$routeChangeStart', function(event, next) {
    const token = $localStorage.token;
    const user = $localStorage.user || {};

    if (next.access && next.access.requiresLogin && !token) {
      event.preventDefault();
      $location.path('/login');
      return;
    }

    if (next.access && next.access.role && user.role !== next.access.role) {
      event.preventDefault();
      alert('Unauthorized access');
      $location.path('/');
    }
  });
})

// ✅ Inject Bearer Token Globally using $localStorage
.run(['$http', '$localStorage', function($http, $localStorage) {
  const token = $localStorage.token;
  if (token) {
    $http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}]);
