angular.module('MerchantApp')
.controller('DeviceProfileController', ['$scope', '$routeParams', 'DeviceService', 'toastr', function($scope, $routeParams, DeviceService, toastr) {
  const deviceId = $routeParams.id;
  $scope.device = null;

  DeviceService.getById(deviceId)
    .then(res => {
      $scope.device = res.data;
    })
    .catch(() => {
      toastr.error('Failed to load device');
    });
}]);
