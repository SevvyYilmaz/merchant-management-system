angular.module('MerchantApp')
.service('MerchantService', ['$http', function($http) {
  const API = 'http://localhost:3000/api/merchants';

  this.getAll = (page = 1) => $http.get(`${API}?page=${page}`);
  this.getById = id => $http.get(`${API}/${id}`);
  this.create = data => $http.post(API, data);
  this.update = (id, data) => $http.put(`${API}/${id}`, data);
  this.remove = id => $http.delete(`${API}/${id}`);
  this.assignToUser = (merchantId, userId) =>
    $http.put(`${API}/assign`, { merchantId, userId });
}]);
