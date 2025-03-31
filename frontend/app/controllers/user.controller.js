angular.module('MerchantApp')
.controller('UserController', ['$scope', '$http', 'AuthService', '$location', 'toastr', function($scope, $http, AuthService, $location, toastr) {
  const API = 'http://localhost:3005/api';
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
  $scope.editUser = null;
  $scope.roleFilter = '';

  // Load users
  const loadUsers = () => {
    $http.get(`${API}/users`, config)
      .then(res => $scope.users = res.data)
      .catch(err => {
        console.error('❌ Error loading users', err);
        toastr.error('Failed to load users.');
      });
  };
  loadUsers();

  // Create new user
  $scope.createUser = () => {
    $http.post(`${API}/users`, $scope.newUser, config)
      .then(() => {
        toastr.success('User created.');
        $scope.newUser = {};
        loadUsers();
      })
      .catch(err => {
        const msg = err.data?.message || 'Error creating user';
        toastr.error(msg);
      });
  };

  // Start editing
  $scope.startEdit = (user) => {
    $scope.editUser = angular.copy(user);
  };

  // Cancel editing
  $scope.cancelEdit = () => {
    $scope.editUser = null;
  };

  // Update user
  $scope.updateUser = () => {
    $http.put(`${API}/users/${$scope.editUser._id}`, $scope.editUser, config)
      .then(() => {
        toastr.success('User updated.');
        $scope.editUser = null;
        loadUsers();
      })
      .catch(err => {
        const msg = err.data?.message || 'Error updating user';
        toastr.error(msg);
      });
  };

  // Delete user (with optional reassignment)
  $scope.deleteUser = () => {
    const payload = { reassignToUserId: $scope.reassignToUserId };
    $http.delete(`${API}/users/${$scope.deleteUserId}`, {
      headers: config.headers,
      data: payload
    })
      .then(() => {
        toastr.success('User deleted.');
        $scope.showReassignBox = false;
        $scope.reassignToUserId = null;
        $scope.deleteUserId = null;
        loadUsers();
      })
      .catch(err => {
        const msg = err.data?.message || 'Error deleting user';
        toastr.error(msg);
      });
  };

  // Trigger reassignment prompt
  $scope.confirmDelete = (userId) => {
    $scope.deleteUserId = userId;
    $scope.showReassignBox = true;
  };

  // Cancel reassignment
  $scope.cancelDelete = () => {
    $scope.showReassignBox = false;
    $scope.deleteUserId = null;
    $scope.reassignToUserId = null;
  };
}]);
