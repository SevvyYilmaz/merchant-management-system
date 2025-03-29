angular.module('MerchantApp')
.service('ResidualService', ['$http', function($http) {
  const API = 'http://localhost:3000/api/residuals';

  this.getByMonth = (month) => $http.get(`${API}/month/${month}`); // 📅 Fetch residuals for month
  this.create = (residual) => $http.post(API, residual);           // ➕ Add residual entry
}]);
