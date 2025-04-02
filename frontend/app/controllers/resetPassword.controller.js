angular.module('MerchantApp')
.controller('ResetPasswordController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
  $scope.email = '';

  $scope.requestReset = function() {
    if (!$scope.email) return toastr.error('Please enter your email.');

    $http.post('/api/auth/forgot-password', { email: $scope.email })
      .then(() => toastr.success('Reset link sent if the email exists.'))
      .catch(err => toastr.error(err?.data?.message || 'Failed to send reset link'));
  };
}]);