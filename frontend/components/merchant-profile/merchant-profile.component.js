angular.module('MerchantApp')
.component('merchantProfile', {
  templateUrl: 'components/merchant-profile/merchant-profile.component.html',
  controller: function($http, $routeParams) {
    const vm = this;
    vm.merchant = {};
    vm.residuals = [];
    vm.loading = true;
    vm.showResidualForm = false;
    vm.newResidual = {
      month: '',
      amount: ''
    };

    vm.$onInit = function() {
      const id = $routeParams.id;
      $http.get(`/api/merchants/${id}`).then(res => {
        vm.merchant = res.data;
        vm.loading = false;
      });

      // Fetch residuals
      $http.get(`/api/residuals?merchantId=${id}`).then(res => {
        vm.residuals = res.data;
      });
    };

    vm.addResidual = function() {
      const payload = {
        merchant: vm.merchant._id,
        residualMonth: vm.newResidual.month,
        residualAmount: parseFloat(vm.newResidual.amount)
      };

      $http.post('/api/residuals', payload).then(res => {
        vm.residuals.push(res.data);
        vm.newResidual = { month: '', amount: '' };
        vm.showResidualForm = false;
      }).catch(err => {
        console.error('❌ Error saving residual', err);
      });
    };
  }
});
