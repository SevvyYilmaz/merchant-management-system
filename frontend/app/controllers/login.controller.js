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
            toastr.error('Login failed: Missing token or user info.');
            return;
          }

          AuthService.setToken(token);
          AuthService.setUser(user);

          // ✅ Force-sync to ensure it's saved
          setTimeout(() => {
            console.log('📦 Stored user (from login.controller):', $localStorage.user);
            if ($localStorage.$apply) $localStorage.$apply();
            localStorage.setItem('ngStorage-user', JSON.stringify(user)); // fallback
          }, 0);

          toastr.success(`Welcome, ${user.username}`);
          $location.path(user.role === 'admin' ? '/admin' : '/dashboard');
        })
        .catch(err => {
          const msg = err?.data?.message || 'Invalid email or password.';
          toastr.error(msg);
        });
    };
  }
]);
