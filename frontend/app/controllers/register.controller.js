angular.module('MerchantApp')
.controller('RegisterController', ['$scope', '$http', '$location', 'toastr', 'AuthService',
  function($scope, $http, $location, toastr, AuthService) {

    $scope.newUser = {
      role: 'user'
    };

    $scope.isAdmin = AuthService.isAdmin; // ✅ Use function reference
    $scope.errors = {};
    $scope.loading = false;
    $scope.showPassword = false;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    $scope.togglePasswordVisibility = function() {
      $scope.showPassword = !$scope.showPassword;
    };

    $scope.getPasswordStrength = function(pw) {
      if (!pw) return '';
      if (pw.length < 8) return 'Weak';
      if (passwordRegex.test(pw)) return 'Strong';
      return 'Medium';
    };

    $scope.register = function() {
      $scope.errors = {};
      $scope.loading = true;

      const u = $scope.newUser;
      u.username = u.username?.trim();
      u.email = u.email?.toLowerCase().trim();

      if (!u.username) $scope.errors.username = 'Username is required.';
      if (!u.email) $scope.errors.email = 'Email is required.';
      if (!u.password) $scope.errors.password = 'Password is required.';
      if (!u.confirmPassword) $scope.errors.confirmPassword = 'Please confirm password.';
      if ($scope.isAdmin() && !u.role) $scope.errors.role = 'Role is required.';

      if (u.password && !passwordRegex.test(u.password)) {
        $scope.errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 number, 1 special char.';
      }

      if (u.password !== u.confirmPassword) {
        $scope.errors.confirmPassword = 'Passwords do not match.';
      }

      // ✅ Role fallback for non-admins
      if (!$scope.isAdmin() && !u.role) {
        u.role = 'user';
      }

      if (Object.keys($scope.errors).length > 0) {
        toastr.error('Please fix the errors above.');
        $scope.loading = false;
        return;
      }

      $http.post('http://localhost:3005/api/auth/register', u)
        .then(() => {
          toastr.success('Registration successful! Logging in...');
          return $http.post('http://localhost:3005/api/auth/login', {
            email: u.email,
            password: u.password
          });
        })
        .then(res => {
          const token = res.data.token;
          const user = res.data.user;
          if (token) {
            AuthService.setToken(token);
            AuthService.setUser(user);
            toastr.success(`Welcome, ${user.username}`);
            $location.path('/dashboard');
          }
        })
        .catch(err => {
          console.error('❌ Registration/Login error:', err);
          const msg = err?.data?.message || 'Could not register or login user.';
          toastr.error(msg);
        })
        .finally(() => $scope.loading = false);
    };
  }
]);
