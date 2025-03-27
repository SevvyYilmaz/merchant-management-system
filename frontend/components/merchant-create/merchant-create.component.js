angular.module('MerchantApp').component('merchantCreate', {
  templateUrl: 'components/merchant-create/merchant-create.component.html',
  controller: function($http, $location) {
    const vm = this;

    vm.form = {
      merchantName: '',
      merchantAccount: '',
      address: {
        city: '',
        state: '',
        zip: '',
        phone: ''
      }
    };

    vm.submitForm = function(form) {
      if (form.$invalid) {
        console.warn('🛑 Form is invalid');
        return;
      }

      $http.post('http://localhost:3000/api/merchants', vm.form)
        .then(() => $location.path('/'))
        .catch(error => console.error('Error creating merchant:', error));
    };
  }
});
