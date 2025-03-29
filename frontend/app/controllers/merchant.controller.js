console.log('📦 MerchantController loaded');

angular.module('MerchantApp')
.controller('MerchantController', [
  '$scope', 'MerchantService', 'UserService', 'toastr',
  function($scope, MerchantService, UserService, toastr) {

    $scope.merchants = [];
    $scope.users = [];
    $scope.selectedUser = {};
    $scope.page = 1;

    // ✅ Load merchants from backend
    function loadMerchants() {
      console.log('📡 Loading merchants (Page:', $scope.page, ')');
      MerchantService.getAll($scope.page)
        .then(res => {
          $scope.merchants = res.data.merchants || [];
          console.log('✅ Merchants loaded:', $scope.merchants);
        })
        .catch(err => {
          console.error('❌ Error loading merchants:', err);
          toastr.error('Failed to fetch merchants');
        });
    }

    // ✅ Load all users (admin only)
    function loadUsers() {
      console.log('📡 Loading users...');
      UserService.getAll()
        .then(res => {
          $scope.users = res.data;
          console.log('✅ Users loaded:', $scope.users);
        })
        .catch(err => {
          console.error('❌ Error loading users:', err);
          toastr.error('Failed to fetch users');
        });
    }

    // ✅ Assign or reassign merchant to user
    $scope.assignUserToMerchant = function(merchantId, userId) {
      if (!userId) return toastr.warning('Please select a user');

      console.log(`🔁 Assigning user ${userId} to merchant ${merchantId}`);
      MerchantService.assignToUser(merchantId, userId)
        .then(() => {
          toastr.success('Merchant successfully assigned!');
          loadMerchants();
        })
        .catch(err => {
          console.error('❌ Assignment failed:', err);
          toastr.error('Assignment failed');
        });
    };

    // ✅ Initial fetch
    console.log('🚀 Init: Fetching merchants + users...');
    loadMerchants();
    loadUsers();
  }
]);
