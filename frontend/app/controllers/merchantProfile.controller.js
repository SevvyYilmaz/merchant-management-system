angular.module('MerchantApp')
.controller('MerchantProfileController', [
  '$scope', '$http', '$routeParams', 'AuthService', '$location', 'toastr',
  function($scope, $http, $routeParams, AuthService, $location, toastr) {

    // 🛡 Auth check
    const token = AuthService.getToken();
    if (!token) return $location.path('/login');

    // 🧠 Scope setup
    $scope.isAdmin = AuthService.isAdmin();
    $scope.editMode = false;
    $scope.merchant = { address: {} };
    $scope.residuals = [];
    $scope.devices = [];
    $scope.users = [];

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const merchantId = $routeParams.id;

    // 🔄 Load merchant + details
    if (merchantId && merchantId !== 'new') {
      loadMerchant(merchantId);
      loadDevices(merchantId);
      if ($scope.isAdmin) loadUsers();
    }

    // 📦 Load merchant by ID
    function loadMerchant(id) {
      $http.get(`/api/merchants/${id}`, config)
        .then(res => {
          const data = res.data.merchant || res.data;
          $scope.merchant = {
            ...data,
            address: data.address || {}
          };
          $scope.residuals = res.data.residuals || [];
        })
        .catch(err => {
          console.error('❌ Error loading merchant', err);
          toastr.error('Could not load merchant.');
          $location.path('/dashboard');
        });
    }

    // 💳 Load devices for merchant
    function loadDevices(id) {
      $http.get(`/api/devices?merchantId=${id}`, config)
        .then(res => $scope.devices = res.data)
        .catch(err => {
          console.error('❌ Error fetching devices', err);
          toastr.error('Could not load devices.');
        });
    }

    // 👥 Load users (admin only)
    function loadUsers() {
      $http.get('/api/users', config)
        .then(res => $scope.users = res.data)
        .catch(err => {
          console.error('❌ Error loading users', err);
          toastr.error('Could not load users.');
        });
    }

    // ✏️ Toggle Edit Mode
    $scope.toggleEdit = () => {
      $scope.editMode = !$scope.editMode;
    };

    // 💾 Update Merchant
    $scope.updateMerchant = () => {
      const payload = {
        merchantName: $scope.merchant.merchantName,
        address: {
          city: $scope.merchant.address.city,
          state: $scope.merchant.address.state,
          zip: $scope.merchant.address.zip,
          phone: $scope.merchant.address.phone
        },
        assignedUser: $scope.merchant.assignedUser?._id || $scope.merchant.assignedUser,
        status: $scope.merchant.status
      };

      $http.put(`/api/merchants/${merchantId}`, payload, config)
        .then(res => {
          $scope.merchant = res.data;
          toastr.success('✅ Merchant updated successfully!');
          $scope.editMode = false;
        })
        .catch(err => {
          console.error('❌ Failed to update merchant', err);
          toastr.error('Update failed. Please check required fields.');
        });
    };
  }
]);
