console.log('📦 ResidualController loaded');

angular.module('MerchantApp')
.controller('ResidualController', ['$scope', 'ResidualService', 'toastr', function($scope, ResidualService, toastr) {
  $scope.month = new Date().toISOString().slice(0, 7); // YYYY-MM
  $scope.residuals = [];

  $scope.loadResiduals = function() {
    ResidualService.getByMonth($scope.month)
      .then(res => {
        $scope.residuals = res.data || [];
        console.log('✅ Residuals loaded:', $scope.residuals);
      })
      .catch(err => {
        console.error('❌ Error loading residuals:', err);
        toastr.error('Could not load residuals.');
      });
  };

  $scope.loadResiduals();
}]);
