angular.module('MerchantApp')
.controller('DeviceController', ['$scope', '$http', 'AuthService', '$location', function($scope, $http, AuthService, $location) {
  const API = 'http://localhost:3000/api';
  const token = AuthService.getToken();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  if (!token || !AuthService.isAdmin()) {
    $location.path('/login');
    return;
  }

  $scope.devices = [];
  $scope.newDevice = {};
  $scope.makes = ['Pax', 'Deja Vu', 'Valor'];
  $scope.filter = {};

  const loadDevices = () => {
    let query = '';
    if ($scope.filter.make) query += `?make=${$scope.filter.make}`;
    $http.get(`${API}/devices${query}`, config)
      .then(res => $scope.devices = res.data)
      .catch(err => console.error('❌ Error fetching devices', err));
  };

  loadDevices();

  $scope.createDevice = () => {
    $http.post(`${API}/devices`, $scope.newDevice, config)
      .then(() => {
        $scope.newDevice = {};
        loadDevices();
      })
      .catch(err => alert(err.data.message || 'Error creating device'));
  };

  $scope.deleteDevice = (id) => {
    if (!confirm('Are you sure?')) return;
    $http.delete(`${API}/devices/${id}`, config)
      .then(loadDevices)
      .catch(err => alert('Error deleting device'));
  };
}]);
