angular.module('MerchantApp')
.controller('GlobalCtrl', [
  '$scope', '$rootScope', '$location', 'AuthService', '$localStorage',
  function($scope, $rootScope, $location, AuthService, $localStorage) {

    // 🔐 Access Control Methods
    $scope.isLoggedIn = () => !!AuthService.getToken();
    $scope.isAdmin = AuthService.isAdmin;

    // 👤 Current User Info
    $scope.currentUser = AuthService.getUser() || { username: 'Unknown', role: 'N/A' };

    // 🚪 Logout
    $scope.logout = () => {
      AuthService.logout();
      $location.path('/login');
    };

    // 🚫 Hide nav/header for auth pages
    $scope.shouldHideHeader = function () {
      const path = $location.path();
      return ['/login', '/register', '/reset-password'].some(p => path.includes(p));
    };

    // 🌐 Global Loader Management
    $rootScope.isLoading = false;

    // 🔄 Refresh current user on route changes
    $rootScope.$on('$routeChangeStart', () => {
      $rootScope.isLoading = true;
    });

    $rootScope.$on('$routeChangeSuccess', () => {
      $scope.currentUser = AuthService.getUser() || { username: 'Unknown', role: 'N/A' };
      $scope.isAdmin = AuthService.isAdmin();
      $rootScope.isLoading = false;
    });

    $rootScope.$on('$routeChangeError', () => {
      $rootScope.isLoading = false;
    });
  }
]);
