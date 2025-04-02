console.log('📦 ResidualController loaded');

angular.module('MerchantApp')
.controller('ResidualController', ['$scope', 'ResidualService', 'toastr', function($scope, ResidualService, toastr) {

  // Utility: format Date to "YYYY-MM"
  function formatMonth(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  // Model: actual Date object for compatibility with <input type="month">
  $scope.selectedMonth = new Date(); // default to current month
  $scope.residuals = [];

  // Load residuals for selected month
  $scope.loadResiduals = function() {
    const monthString = formatMonth($scope.selectedMonth);

    ResidualService.getByMonth(monthString)
      .then(res => {
        $scope.residuals = Array.isArray(res.data) ? res.data : [];
        console.log('✅ Residuals loaded:', $scope.residuals);
      })
      .catch(err => {
        console.error('❌ Error loading residuals:', err);
        toastr.error('Could not load residuals.');
      });
  };

  // Watch for changes in month selector
  $scope.$watch('selectedMonth', function(newVal, oldVal) {
    if (newVal && newVal !== oldVal) {
      $scope.loadResiduals();
    }
  });

  // Total residuals
  $scope.getTotalResiduals = function() {
    return $scope.residuals.reduce((sum, r) => sum + Number(r.residualAmount || 0), 0).toFixed(2);
  };

  // Initial load
  $scope.loadResiduals();
}]);
