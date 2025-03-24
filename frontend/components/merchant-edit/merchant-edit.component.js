angular.module('MerchantApp').component('merchantEdit', {
  templateUrl: 'components/merchant-edit/merchant-edit.component.html',
  controller: function($http, $routeParams, $location) {
    const vm = this;
    const id = $routeParams.id;

    console.log("🔍 Inside merchantEdit controller");
    console.log("🧪 Route param ID:", id);

    vm.form = null; // Start with null to control rendering

    // Load existing merchant data
    vm.$onInit = function() {
      console.log("🚀 $onInit triggered");

      $http.get(`/api/merchants/${id}`)
        .then(res => {
          console.log("✅ Fetched merchant:", res.data);
          vm.form = angular.copy(res.data);
        })
        .catch(err => {
          console.error('❌ Error fetching merchant:', err);
        });
    };

    // Update merchant (strip Mongo fields)
    vm.updateMerchant = function() {
      const cleanedForm = angular.copy(vm.form);
      delete cleanedForm._id;
      delete cleanedForm.__v;

      console.log("📤 Updating merchant with data:", cleanedForm);

      $http.put(`/api/merchants/${id}`, cleanedForm)
        .then(() => {
          console.log("✅ Merchant updated successfully");
          $location.path('/');
        })
        .catch(err => {
          console.error('❌ Error updating merchant:', err);
        });
    };
  }
});
// This component allows editing of a merchant's details.
// It fetches the existing data on initialization and updates it upon form submission.