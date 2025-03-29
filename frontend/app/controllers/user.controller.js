angular.module('MerchantApp')
.controller('UserController', ['$scope', '$http', 'AuthService', '$location', function($scope, $http, AuthService, $location) {
  const API = 'http://localhost:3000/api';
  const token = AuthService.getToken();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  if (!token || !AuthService.isAdmin()) {
    $location.path('/login');
    return;
  }

  $scope.users = [];
  $scope.newUser = {};
  $scope.deleteUserId = null;
  $scope.reassignToUserId = null;
  $scope.showReassignBox = false;

  // Load users
  const loadUsers = () => {
    $http.get(`${API}/users`, config)
      .then(res => $scope.users = res.data)
      .catch(err => console.error('❌ Error loading users', err));
  };
  loadUsers();

  // Create new user
  $scope.createUser = () => {
    $http.post(`${API}/users`, $scope.newUser, config)
      .then(() => {
        $scope.newUser = {};
        loadUsers();
      })
      .catch(err => alert(err.data.message || 'Error creating user'));
  };

  // Delete user (with optional reassignment)
  $scope.deleteUser = () => {
    const payload = { reassignToUserId: $scope.reassignToUserId };
    $http.delete(`${API}/users/${$scope.deleteUserId}`, { headers: config.headers, data: payload })
      .then(() => {
        $scope.showReassignBox = false;
        $scope.reassignToUserId = null;
        $scope.deleteUserId = null;
        loadUsers();
      })
      .catch(err => alert(err.data.message || 'Error deleting user'));
  };

  // Trigger reassignment prompt
  $scope.confirmDelete = (userId) => {
    $scope.deleteUserId = userId;
    $scope.showReassignBox = true;
  };

  $scope.cancelDelete = () => {
    $scope.showReassignBox = false;
    $scope.deleteUserId = null;
    $scope.reassignToUserId = null;
  };
}]);
