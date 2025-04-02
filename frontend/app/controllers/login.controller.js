angular.module('MerchantApp')
.controller('LoginController', [
  '$scope', '$http', '$location', 'AuthService', 'toastr', '$localStorage',
  function($scope, $http, $location, AuthService, toastr, $localStorage) {

    // 🌐 Redirect if already logged in
    if (AuthService.getToken()) {
      $location.path('/dashboard');
      return;
    }

    // 🧠 Model
    $scope.form = {
      email: '',
      password: ''
    };
    $scope.loading = false;

    // 🚪 Login Function
    $scope.login = function(loginForm) {
      if (loginForm.$invalid || !$scope.form.email || !$scope.form.password) {
        toastr.error('Please fill out both email and password.');
        return;
      }

      const payload = {
        email: $scope.form.email.trim().toLowerCase(),
        password: $scope.form.password
      };

      $scope.loading = true;

      $http.post('/api/auth/login', payload)
        .then(res => {
          const { token, user } = res.data;

          if (!token || !user) {
            console.warn('⚠️ Login response missing token/user:', res.data);
            toastr.error('Login failed: Invalid response.');
            return;
          }

          AuthService.setToken(token);
          AuthService.setUser(user);
          toastr.success(`👋 Welcome, ${user.username}`);

          // 🎯 Redirect based on role
          $location.path(user.role === 'admin' ? '/admin' : '/dashboard');
        })
        .catch(err => {
          console.error('❌ Login error:', err);
          const msg = err?.data?.message || 'Invalid email or password.';
          toastr.error(msg);
        })
        .finally(() => {
          $scope.loading = false;
        });
    };
  }
]);
