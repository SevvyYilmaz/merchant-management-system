angular.module('MerchantApp')
.controller('LoginController', ['$scope', '$http', '$location', 'AuthService', 'toastr',
  function($scope, $http, $location, AuthService, toastr) {
    
    $scope.credentials = {};

    $scope.login = function() {
      // 🛑 Validate input first
      if (!$scope.credentials.email || !$scope.credentials.password) {
        toastr.error('Please enter both email and password.');
        return;
      }

      // 🚀 Attempt login
      $http.post('http://localhost:3000/api/auth/login', $scope.credentials)
        .then(res => {
          const token = res.data.token;
          const user = res.data.user;

          if (token) {
            AuthService.setToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            toastr.success(`Welcome back, ${user.username}`);
            $location.path('/dashboard');
          } else {
            toastr.error('Login failed: token not received.');
          }
        })
        .catch(err => {
          console.error('❌ Login error:', err);
          const errorMsg = (err.data && err.data.message) || 'Invalid email or password.';
          toastr.error(errorMsg);
        });
    };
}]);
