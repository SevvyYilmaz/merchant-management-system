angular.module('MerchantApp')
.service('UserService', ['$http', function($http) {
  const API = 'http://localhost:3005/api/users';

  this.getAll = () => $http.get(API);              // ✅ Get all users
  this.getById = id => $http.get(`${API}/${id}`);  // 🔍 Get user by ID
  this.create = user => $http.post(API, user);     // ➕ Create user (admin only)
  this.update = (id, user) => $http.put(`${API}/${id}`, user); // ✏️ Update user
  this.delete = id => $http.delete(`${API}/${id}`); // ❌ Delete user
}]);
