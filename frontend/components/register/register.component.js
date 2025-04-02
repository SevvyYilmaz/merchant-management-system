angular.module('MerchantApp').component('register', {
  templateUrl: 'components/register/register.component.html',
  controller: function($http, $location, toastr, $timeout) {
    const vm = this;

    vm.form = {
      username: '',
      email: '',
      password: '',
      role: 'user'
    };

    vm.confirmPassword = '';
    vm.showPassword = false;
    vm.isAdmin = false;
    vm.usernameAvailable = true;
    vm.emailAvailable = true;
    vm.checkingUsername = false;
    vm.checkingEmail = false;

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser?.role === 'admin') {
      vm.isAdmin = true;
    }

    // 🔐 Check password strength
    vm.getPasswordStrength = function(password) {
      if (!password) return '';
      if (password.length < 8) return 'Weak';
      const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password);
      return strong ? 'Strong' : 'Medium';
    };

    // 🔎 Check username availability
    vm.checkUsername = function() {
      if (!vm.form.username) return;
      vm.checkingUsername = true;
      $http.get(`/api/users/check-username?username=${encodeURIComponent(vm.form.username)}`)
        .then(res => vm.usernameAvailable = res.data.available)
        .catch(() => vm.usernameAvailable = true)
        .finally(() => vm.checkingUsername = false);
    };

    // 🔎 Check email availability
    vm.checkEmail = function() {
      if (!vm.form.email) return;
      vm.checkingEmail = true;
      $http.get(`/api/users/check-email?email=${encodeURIComponent(vm.form.email)}`)
        .then(res => vm.emailAvailable = res.data.available)
        .catch(() => vm.emailAvailable = true)
        .finally(() => vm.checkingEmail = false);
    };

    // ✅ Register + Auto-login
    vm.register = function(form) {
      if (form.$invalid || vm.form.password !== vm.confirmPassword ||
          !vm.usernameAvailable || !vm.emailAvailable) {
        toastr.error('Please fix the errors and try again.');
        return;
      }

      if (!vm.isAdmin) {
        vm.form.role = 'user';
      }

      $http.post('/api/auth/register', vm.form)
        .then(() => {
          toastr.success('Registration successful! Logging you in...');
          return $http.post('/api/auth/login', {
            email: vm.form.email,
            password: vm.form.password
          });
        })
        .then(res => {
          const { token, user } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          toastr.success(`Welcome, ${user.username}`);
          $location.path(user.role === 'admin' ? '/admin' : '/');
        })
        .catch(err => {
          toastr.error(err?.data?.message || 'Registration failed.');
          console.error('Register/Login error:', err);
        });
    };
  }
});
