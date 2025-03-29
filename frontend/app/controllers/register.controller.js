angular.module('MerchantApp')
.controller('RegisterController', ['$scope', '$http', '$location', 'toastr', function($scope, $http, $location, toastr) {
    const API = 'http://localhost:3000/api';

  $scope.newUser = {};

  $scope.register = function() {
    if (!$scope.newUser || !$scope.newUser.email || !$scope.newUser.password) {
      toastr.error('Please fill all required fields.');
      return;
    }

    $http.post(`${API}/auth/register`, $scope.newUser)
      .then(res => {
        toastr.success('User registered successfully!');
        $location.path('/login');
      })
      .catch(err => {
        toastr.error((err.data && err.data.message) || 'Error creating user.');
    });
  };
}]);

