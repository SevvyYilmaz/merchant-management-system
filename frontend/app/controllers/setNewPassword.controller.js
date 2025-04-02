angular.module('MerchantApp')
.controller('SetNewPasswordController', ['$scope', '$http', '$location', '$routeParams', 'toastr', function($scope, $http, $location, $routeParams, toastr) {
  $scope.password = '';
  $scope.confirmPassword = '';

  $scope.resetPassword = function() {
    if (!$scope.password || !$scope.confirmPassword)
      return toastr.error('All fields are required.');

    if ($scope.password !== $scope.confirmPassword)
      return toastr.error('Passwords do not match.');

    const token = $routeParams.token;
    $http.post(`/api/auth/reset-password/${token}`, {
      password: $scope.password
    })
    .then(() => {
      toastr.success('Password updated! You can now log in.');
      $location.path('/login');
    })
    .catch(err => toastr.error(err?.data?.message || 'Reset failed'));
  };
}]);