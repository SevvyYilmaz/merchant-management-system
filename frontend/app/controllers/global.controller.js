angular.module('MerchantApp')
.controller('GlobalCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
  $scope.isLoggedIn = () => !!AuthService.getToken();
  $scope.isAdmin = AuthService.isAdmin;

  $scope.logout = () => {
    AuthService.logout();
    $location.path('/login');
  };

  // Set current user from token
  const user = AuthService.getUser();
  $scope.currentUser = user && user.username ? user : { username: 'Unknown', role: 'N/A' };

  $scope.shouldHideHeader = function () {
    const path = $location.path();
    return path === '/login' || path === '/register' || path === '/reset-password';
  };
}]);
