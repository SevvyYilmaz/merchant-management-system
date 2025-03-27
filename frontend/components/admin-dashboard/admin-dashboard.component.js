// frontend/components/admin-dashboard/admin-dashboard.component.js
angular.module('MerchantApp').component('adminDashboard', {
    templateUrl: 'components/admin-dashboard/admin-dashboard.component.html',
    controller: function($http, toastr, $timeout) {
      const vm = this;
      vm.loading = true;
      vm.totals = {
        merchants: 0,
        users: 0,
        devices: 0
      };
      vm.residuals = [];
  
      vm.$onInit = function () {
        $http.get('/api/dashboard/summary')
          .then(res => {
            vm.totals = res.data.totals;
            vm.residuals = res.data.residuals;
  
            // Wait for DOM to be ready
            $timeout(() => {
              if (vm.residuals && vm.residuals.length) {
                const ctx = document.getElementById('residualChart').getContext('2d');
                new Chart(ctx, {
                  type: 'bar',
                  data: {
                    labels: vm.residuals.map(r => r._id),
                    datasets: [{
                      label: 'Residuals ($)',
                      data: vm.residuals.map(r => r.total),
                      backgroundColor: '#4CAF50'
                    }]
                  },
                  options: {
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }
                });
              }
            }, 100); // Short delay to ensure DOM is ready
          })
          .catch(err => {
            toastr.error("Failed to load dashboard stats");
            console.error("❌ Dashboard error:", err);
          })
          .finally(() => {
            vm.loading = false;
          });
      };
    }
  });
  