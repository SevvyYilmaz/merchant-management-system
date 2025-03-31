angular.module('MerchantApp')
.service('DeviceService', ['$http', function($http) {
  const API = 'http://localhost:3005/api/devices';

  this.getAll = () => $http.get(API); // 🔄 Get all devices
  this.getById = id => $http.get(`${API}/${id}`); // 🔍 Get device by ID
  this.create = device => $http.post(API, device); // ➕ Create new device
  this.update = (id, device) => $http.put(`${API}/${id}`, device); // ✏️ Update device
  this.delete = id => $http.delete(`${API}/${id}`); // ❌ Delete device
}]);
