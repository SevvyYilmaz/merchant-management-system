angular.module('MerchantApp')
  .component('merchantList', {
    templateUrl: 'components/merchant-list/merchant-list.component.html',
    controller: function ($http) {
      const vm = this;
      vm.merchants = [];
      vm.currentPage = 1;
      vm.itemsPerPage = 5;
      vm.totalMerchants = 0;
      vm.totalPages = 0;

      vm.$onInit = function () {
        vm.fetchMerchants();
      };

      // ✅ Fetch paginated merchants from backend
      vm.fetchMerchants = function () {
        $http.get(`/api/merchants?page=${vm.currentPage}&limit=${vm.itemsPerPage}`)
          .then(res => {
            vm.merchants = res.data.merchants;
            vm.totalMerchants = res.data.totalCount;
            vm.totalPages = Math.ceil(vm.totalMerchants / vm.itemsPerPage);
          })
          .catch(err => {
            console.error('❌ Error fetching merchants:', err);
          });
      };

      // ✅ Go to next page
      vm.nextPage = function () {
        if (vm.currentPage < vm.totalPages) {
          vm.currentPage++;
          vm.fetchMerchants();
        }
      };

      // ✅ Go to previous page
      vm.prevPage = function () {
        if (vm.currentPage > 1) {
          vm.currentPage--;
          vm.fetchMerchants();
        }
      };

      // ✅ Delete a merchant and refresh
      vm.deleteMerchant = function (id) {
        if (confirm('Are you sure you want to delete this merchant?')) {
          $http.delete(`/api/merchants/${id}`).then(() => {
            vm.fetchMerchants(); // refresh after deletion
          });
        }
      };
    }
  });
