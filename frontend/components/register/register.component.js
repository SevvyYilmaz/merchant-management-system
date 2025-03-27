angular.module('MerchantApp').component('register', {
    templateUrl: 'components/register/register.component.html',
    controller: function($http, $location, toastr) {
      const vm = this;
  
      vm.form = {
        username: '',
        email: '',
        password: '',
        role: 'user'
      };
  
      vm.confirmPassword = '';
  
      vm.register = function(form) {
        if (form.$invalid || vm.form.password !== vm.confirmPassword) {
          toastr.error('Please fix the form errors.');
          return;
        }
  
        $http.post('/api/auth/register', vm.form)
          .then(() => {
            toastr.success('Registration successful!');
            $location.path('/login');
          })
          .catch(err => {
            toastr.error(err.data.message || 'Registration failed.');
            console.error('Register error:', err);
          });
      };
    }
  });
  