angular.module('MerchantApp')
.controller('MerchantProfileController', ['$scope', '$http', '$routeParams', 'AuthService', '$location',
  function($scope, $http, $routeParams, AuthService, $location) {
    const API = 'http://localhost:3000/api';
    const token = AuthService.getToken();

    if (!token) return $location.path('/login');

    $scope.isAdmin = AuthService.isAdmin();
    $scope.merchant = {};
    $scope.residuals = [];
    $scope.devices = [];

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const merchantId = $routeParams.id;

    // Fetch merchant details
    $http.get(`${API}/merchants/${merchantId}`, config)
      .then(res => {
        if (res.data.merchant) {
          $scope.merchant = res.data.merchant;
          $scope.residuals = res.data.residuals || [];
        } else {
          // Fallback if not nested
          $scope.merchant = res.data;
        }
      })
      .catch(err => {
        console.error('❌ Error loading merchant', err);
        $location.path('/dashboard');
      });

    // Fetch devices
    $http.get(`${API}/devices?merchantId=${merchantId}`, config)
      .then(res => $scope.devices = res.data)
      .catch(err => console.error('❌ Error fetching devices', err));
  }
]);
