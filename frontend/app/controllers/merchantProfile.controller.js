angular.module('MerchantApp')
.controller('MerchantProfileController', [
  '$scope', '$http', '$routeParams', 'AuthService', '$location', 'toastr',
  function($scope, $http, $routeParams, AuthService, $location, toastr) {
    const token = AuthService.getToken();
    if (!token) return $location.path('/login');

    $scope.isAdmin = AuthService.isAdmin();
    $scope.editMode = false;
    $scope.merchant = { address: {} }; // 🧠 initialize address to avoid undefined errors
    $scope.residuals = [];
    $scope.devices = [];
    $scope.users = [];

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const merchantId = $routeParams.id;

    if (merchantId && merchantId !== 'new') {
      // ✅ Load merchant
      $http.get(`/api/merchants/${merchantId}`, config)
        .then(res => {
          const data = res.data.merchant || res.data;
          $scope.merchant = {
            ...data,
            address: data.address || {} // 🛡 ensure address is defined
          };
          $scope.residuals = res.data.residuals || [];
        })
        .catch(err => {
          console.error('❌ Error loading merchant', err);
          toastr.error('Could not load merchant.');
          $location.path('/dashboard');
        });

      // ✅ Load devices
      $http.get(`/api/devices?merchantId=${merchantId}`, config)
        .then(res => $scope.devices = res.data)
        .catch(err => console.error('❌ Error fetching devices', err));
      
      // ✅ Load users (admin only)
      if ($scope.isAdmin) {
        $http.get('/api/users', config)
          .then(res => $scope.users = res.data)
          .catch(err => console.error('❌ Error loading users', err));
      }
    }

    // ✨ Enable editing
    $scope.toggleEdit = () => {
      $scope.editMode = !$scope.editMode;
    };

    // ✅ Update merchant
    $scope.updateMerchant = () => {
      // Format payload for backend
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
          toastr.success('Merchant updated!');
          $scope.editMode = false;
        })
        .catch(err => {
          console.error('❌ Failed to update merchant', err);
          toastr.error('Update failed. Please check required fields.');
        });
    };
  }
]);
