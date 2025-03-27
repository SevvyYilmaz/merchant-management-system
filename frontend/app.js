angular.module('MerchantApp', ['ngRoute', 'ngAnimate', 'toastr'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      template: '<merchant-list></merchant-list>',
      access: { requiresLogin: true }
    })
    .when('/create', {
      template: '<merchant-create></merchant-create>',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/merchants/edit/:id', {
      template: '<merchant-edit></merchant-edit>',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/profile/:id', {
      template: '<merchant-profile></merchant-profile>',
      access: { requiresLogin: true }
    })
    .when('/register', {
      template: '<register></register>'
    })
    .when('/login', {
      template: '<login></login>'
    })
    .when('/reset-password', {
      template: '<reset-password></reset-password>'
    })
    .when('/admin', {
      template: '<admin-dashboard></admin-dashboard>'
    })
    .otherwise({ redirectTo: '/login' });
})

// ✅ Route Guard
.run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function(event, next) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check login requirement
    if (next.access && next.access.requiresLogin && !token) {
      event.preventDefault();
      $location.path('/login');
      return;
    }

    // Check role access
    if (next.access && next.access.role && user.role !== next.access.role) {
      event.preventDefault();
      alert('Unauthorized access');
      $location.path('/');
    }
  });
});
