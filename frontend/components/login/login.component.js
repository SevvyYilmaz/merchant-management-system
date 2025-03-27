angular.module('MerchantApp').component('login', {
    templateUrl: 'components/login/login.component.html',
    controller: function($http, $location, toastr) {
      const vm = this;
  
      vm.form = {
        email: '',
        password: ''
      };
  
      vm.login = function(form) {
        if (form.$invalid) {
          toastr.error('Please enter valid credentials.');
          return;
        }
  
        $http.post('/api/auth/login', vm.form)
          .then(res => {
            toastr.success('Login successful!');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
  
            const role = res.data.user.role;
            $location.path(role === 'admin' ? '/admin' : '/');
          })
          .catch(err => {
            toastr.error(err.data.message || 'Login failed.');
          });
      };
    }
  });
  