console.log('📦 ResidualController loaded');

angular.module('MerchantApp')
.controller('ResidualController', ['$scope', 'ResidualService', 'toastr', function($scope, ResidualService, toastr) {
  
  // Model: user-selected month (bound to input)
  $scope.month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  $scope.residuals = [];

  $scope.loadResiduals = function() {
    const formattedMonth = $scope.month;

    ResidualService.getByMonth(formattedMonth)
      .then(res => {
        $scope.residuals = (res.data || []);
        console.log('✅ Residuals loaded:', $scope.residuals);
      })
      .catch(err => {
        console.error('❌ Error loading residuals:', err);
        toastr.error('Could not load residuals.');
      });
  };

  // Call once on load
  $scope.loadResiduals();

  // Total
  $scope.getTotalResiduals = () =>
    $scope.residuals.reduce((sum, r) => sum + Number(r.residualAmount || 0), 0);
}]);
