angular.module('MerchantApp', ['ngRoute', 'ngAnimate', 'toastr'])
.config(function($routeProvider, $locationProvider, $httpProvider) {
  // 🧭 Route Setup
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
      template: '<register></register>',
      access: { requiresLogin: false }
    })
    .when('/login', {
      template: '<login></login>',
      access: { requiresLogin: false }
    })
    .when('/reset-password', {
      template: '<reset-password></reset-password>',
      access: { requiresLogin: false }
    })
    .when('/admin', {
      template: '<admin-dashboard></admin-dashboard>',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/merchants/new', {
      templateUrl: 'app/views/merchant-form.html',
      controller: 'MerchantController',
      access: { requiresLogin: true, role: 'admin' }
    })
    .when('/users', {
      templateUrl: 'app/views/users.html',
      controller: 'UserController',
      access: { requiresLogin: true, role: 'admin' }
    })
    .otherwise({ redirectTo: '/login' });

  // Optional: Enable for clean URLs later
  // $locationProvider.html5Mode(true);

  // 🛡 Add HTTP Interceptor for Token Injection & 401 Handling
  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      request: function(config) {
        const token = $localStorage.token;
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          // Token expired or invalid → log out and redirect
          delete $localStorage.token;
          delete $localStorage.user;
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  }]);
})

// 🔐 Route Guard to Enforce Login & Role-Based Access
.run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function(event, next) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

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
});
