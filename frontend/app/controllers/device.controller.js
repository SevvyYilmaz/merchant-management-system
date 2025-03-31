angular.module('MerchantApp')
.controller('DeviceController', ['$scope', '$http', '$routeParams', '$location', 'AuthService',
  function($scope, $http, $routeParams, $location, AuthService) {

  const token = AuthService.getToken();
  if (!token) return $location.path('/login');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  $scope.device = {};

  $scope.addDevice = function() {
    const deviceData = {
      ...$scope.device,
      merchantId: $routeParams.id,
      deviceStatus: 'active'
    };

    $http.post('/api/devices', deviceData, config)
      .then(() => $location.path(`/merchants/${$routeParams.id}`))
      .catch(err => console.error('❌ Add device failed', err));
  };
}]);
