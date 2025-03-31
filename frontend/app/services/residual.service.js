angular.module('MerchantApp')
.service('ResidualService', ['$http', 'AuthService', function($http, AuthService) {
  const API = 'http://localhost:3005/api/residuals';

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${AuthService.getToken()}` }
  });

  this.getByMonth = (month) => $http.get(`${API}/month/${month}`, authHeader());
  this.create = (residual) => $http.post(API, residual, authHeader());
}]);
