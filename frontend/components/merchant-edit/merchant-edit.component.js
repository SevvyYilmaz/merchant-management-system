angular.module('MerchantApp').component('merchantEdit', {
  templateUrl: 'components/merchant-edit/merchant-edit.component.html',
  controller: function($http, $routeParams, $location, toastr) {
    const vm = this;
    const id = $routeParams.id;

    vm.form = null;
    vm.originalForm = null;
    vm.isLoading = false;

    console.log("✅ Merchant Edit Initialized. ID:", id);

    // Load merchant data
    vm.$onInit = function() {
      $http.get(`/api/merchants/${id}`)
        .then(res => {
          vm.originalForm = angular.copy(res.data);
          vm.form = angular.copy(res.data);
        })
        .catch(err => {
          console.error('❌ Error fetching merchant:', err);
        });

      // Warn on window close if form is dirty
      window.onbeforeunload = function() {
        if (vm.form && vm.originalForm && !angular.equals(vm.form, vm.originalForm)) {
          return "You have unsaved changes. Are you sure you want to leave?";
        }
      };
    };

    // Update merchant
    vm.updateMerchant = function(form) {
      if (form.$invalid) {
        return;
      }

      const cleanedForm = angular.copy(vm.form);
      delete cleanedForm._id;
      delete cleanedForm.__v;

      vm.isLoading = true;

      $http.put(`/api/merchants/${id}`, cleanedForm)
        .then(() => {
          toastr.success('Merchant updated successfully!');
          window.onbeforeunload = null; // Remove unload warning
          setTimeout(() => $location.path('/'), 1200);
        })
        .catch(err => {
          toastr.error('Something went wrong while updating.');
          console.error('❌ Error updating merchant:', err);
        })
        .finally(() => {
          vm.isLoading = false;
        });
    };

    // Reset form to original state
    vm.resetForm = function() {
      vm.form = angular.copy(vm.originalForm);
    };

    // Cancel with dirty check
    vm.cancelEdit = function() {
      if (!angular.equals(vm.form, vm.originalForm)) {
        if (confirm("Discard changes and exit?")) {
          window.onbeforeunload = null;
          $location.path('/');
        }
      } else {
        $location.path('/');
      }
    };
  }
});
