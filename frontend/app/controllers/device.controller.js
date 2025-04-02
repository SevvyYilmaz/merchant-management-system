angular.module('MerchantApp')
.controller('DeviceController', [
  '$scope', '$http', '$routeParams', '$location', 'AuthService', 'toastr',
  function($scope, $http, $routeParams, $location, AuthService, toastr) {

  const token = AuthService.getToken();
  if (!token) return $location.path('/login');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  $scope.device = {
    deviceMake: '',
    deviceModel: '',
    deviceSerialNumber: '',
    deviceStatus: 'active'
  };

  $scope.addDevice = function() {
    const deviceData = {
      ...$scope.device,
      merchantId: $routeParams.id,
      deviceStatus: $scope.device.deviceStatus || 'active'
    };

    $http.post('/api/devices', deviceData, config)
      .then(() => {
        toastr.success('Device added!');
        $location.path(`/profile/${$routeParams.id}`);
      })
      .catch(err => {
        console.error('❌ Add device failed', err);
        toastr.error(err.data?.error || 'Device creation failed');
      });
  };
}]);
