angular.module('MerchantApp')
.controller('MerchantController', ['$scope', '$http', '$routeParams', '$location', 'AuthService',
  function($scope, $http, $routeParams, $location, AuthService) {

  const token = AuthService.getToken();
  if (!token) return $location.path('/login');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  $scope.isEdit = !!$routeParams.id;
  $scope.merchant = {
    merchantName: '',
    merchantAccount: '',
    status: 'active',
    address: {
      city: '',
      state: '',
      zip: '',
      phoneNumber: ''
    },
    assignedUser: null
  };
  $scope.users = [];

  // Load users (for assignment)
  $http.get('/api/users', config).then(res => {
    $scope.users = res.data;
  });

  // If edit mode, load merchant
  if ($scope.isEdit) {
    $http.get(`/api/merchants/${$routeParams.id}`, config)
      .then(res => {
        $scope.merchant = res.data.merchant || res.data;
      })
      .catch(err => console.error('❌ Error loading merchant', err));
  }

  // Submit form (create or update)
  $scope.submitMerchant = function() {
    const payload = {
      ...$scope.merchant,
      assignedUserId: $scope.merchant.assignedUser || null
    };

    if ($scope.isEdit) {
      $http.put(`/api/merchants/${$routeParams.id}`, payload, config)
        .then(() => $location.path('/merchants'))
        .catch(err => console.error('❌ Update error', err));
    } else {
      $http.post('/api/merchants', payload, config)
        .then(() => $location.path('/merchants'))
        .catch(err => console.error('❌ Create error', err));
    }
  };
}]);
