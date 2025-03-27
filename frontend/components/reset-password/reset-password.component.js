angular.module('MerchantApp').component('resetPassword', {
    templateUrl: 'components/reset-password/reset-password.component.html',
    controller: function($http, toastr) {
      const vm = this;
      vm.email = '';
  
      vm.resetPassword = function(form) {
        if (form.$invalid) {
          toastr.error('Please enter a valid email.');
          return;
        }
  
        $http.post('/api/auth/forgot-password', { email: vm.email })
          .then(() => {
            toastr.success('Reset link sent! Please check your inbox.');
          })
          .catch(err => {
            toastr.error('Failed to send reset link.');
            console.error('Reset error:', err);
          });
      };
    }
  });
  