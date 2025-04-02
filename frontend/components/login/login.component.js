angular.module('MerchantApp').component('login', {
  templateUrl: 'components/login/login.component.html',
  controller: function($http, $location, toastr, $timeout) {
    const vm = this;

    // Form model
    vm.form = {
      email: '',
      password: ''
    };

    // UI state
    vm.loading = false;
    vm.showPassword = false;
    vm.rememberMe = false;

    // Toggle password visibility
    vm.togglePassword = function() {
      vm.showPassword = !vm.showPassword;
    };

    // Login logic
    vm.login = function(form) {
      if (form.$invalid) {
        toastr.error('Please enter valid credentials.');
        return;
      }

      vm.loading = true;

      $http.post('/api/auth/login', vm.form)
        .then(res => {
          const user = res.data.user;
          const role = user.role;

          toastr.success(`Welcome, ${user.username}!`);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(user));

          // Optionally remember user email (if enabled)
          if (vm.rememberMe) {
            localStorage.setItem('rememberEmail', vm.form.email);
          } else {
            localStorage.removeItem('rememberEmail');
          }

          console.log('✅ User saved to localStorage:', user);
          console.log('🔀 Redirecting to:', role === 'admin' ? '/admin' : '/');

          $timeout(() => {
            vm.loading = false;
            $location.path(role === 'admin' ? '/admin' : '/');
          }, 500);
        })
        .catch(err => {
          vm.loading = false;
          toastr.error(err.data.message || 'Login failed.');
          console.error('❌ Login error:', err);
        });
    };

    // Auto-fill email if remembered
    vm.$onInit = function() {
      const savedEmail = localStorage.getItem('rememberEmail');
      if (savedEmail) {
        vm.form.email = savedEmail;
        vm.rememberMe = true;
      }
    };
  }
});
