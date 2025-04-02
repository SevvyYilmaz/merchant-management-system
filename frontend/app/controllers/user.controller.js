angular.module('MerchantApp')
.controller('UserController', [
  '$scope', '$http', '$location', 'AuthService', 'toastr',
  function($scope, $http, $location, AuthService, toastr) {
    const API = 'http://localhost:3005/api';
    const token = AuthService.getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (!token || !AuthService.isAdmin()) {
      $location.path('/login');
      return;
    }

    $scope.users = [];
    $scope.newUser = { role: 'user' };
    $scope.editUser = null;
    $scope.roleFilter = '';

    $scope.deleteUserId = null;
    $scope.reassignToUserId = null;
    $scope.showReassignBox = false;
    $scope.merchantCount = 0;

    // Load users
    const loadUsers = () => {
      $http.get(`${API}/users`, config)
        .then(res => {
          $scope.users = res.data;
        })
        .catch(err => {
          console.error('❌ Error loading users', err);
          toastr.error('Failed to load users.');
        });
    };
    loadUsers();

    // Create user
    $scope.createUser = () => {
      $http.post(`${API}/users`, $scope.newUser, config)
        .then(() => {
          toastr.success('User created');
          $scope.newUser = { role: 'user' };
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

    $scope.cancelEdit = () => {
      $scope.editUser = null;
    };

    $scope.updateUser = () => {
      $http.put(`${API}/users/${$scope.editUser._id}`, $scope.editUser, config)
        .then(() => {
          toastr.success('User updated');
          $scope.editUser = null;
          loadUsers();
        })
        .catch(err => {
          const msg = err.data?.message || 'Error updating user';
          toastr.error(msg);
        });
    };

    // Confirm delete → show reassignment box
    $scope.confirmDelete = (user) => {
      $scope.deleteUserId = user._id;
      $scope.merchantCount = user.assignedMerchants?.length || 0;
      $scope.showReassignBox = true;
      $scope.reassignToUserId = null;
    };

    $scope.cancelDelete = () => {
      $scope.showReassignBox = false;
      $scope.deleteUserId = null;
      $scope.reassignToUserId = null;
    };

    // Delete user with optional reassignment
    $scope.deleteUser = () => {
      const payload = $scope.merchantCount > 0
        ? { reassignToUserId: $scope.reassignToUserId }
        : {};

      if ($scope.merchantCount > 0 && !payload.reassignToUserId) {
        toastr.error('Please select a replacement user for merchant reassignment.');
        return;
      }

      $http.delete(`${API}/users/${$scope.deleteUserId}`, {
        headers: config.headers,
        data: payload
      })
      .then(() => {
        toastr.success('User deleted');
        $scope.cancelDelete();
        loadUsers();
      })
      .catch(err => {
        const msg = err.data?.message || 'Error deleting user';
        toastr.error(msg);
      });
    };
  }
]);
