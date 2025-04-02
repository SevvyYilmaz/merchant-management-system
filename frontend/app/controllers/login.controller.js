angular.module('MerchantApp')
.controller('LoginController', [
  '$scope', '$http', '$location', 'AuthService', 'toastr', '$localStorage',
  function($scope, $http, $location, AuthService, toastr, $localStorage) {
    
    $scope.form = {
      email: '',
      password: ''
    };

    $scope.login = function(loginForm) {
      if (loginForm.$invalid) {
        toastr.error('Please enter valid credentials.');
        return;
      }

      const payload = {
        email: $scope.form.email.trim().toLowerCase(),
        password: $scope.form.password
      };

      $http.post('/api/auth/login', payload)
        .then(res => {
          const { token, user } = res.data;

          if (!token || !user) {
            console.warn('⚠️ Missing login response fields:', res.data);
            toastr.error('Login failed: Missing token or user info.');
            return;
          }

          AuthService.setToken(token);
          AuthService.setUser(user);

          toastr.success(`Welcome, ${user.username}`);
          $location.path(user.role === 'admin' ? '/admin' : '/dashboard');
        })
        .catch(err => {
          console.error('❌ Login request failed:', err);
          const msg = err?.data?.message || 'Invalid email or password.';
          toastr.error(msg);
        });
    };
  }
]);
