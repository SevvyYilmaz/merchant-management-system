angular.module('MerchantApp')
.controller('DashboardController', ['$scope', '$http', 'AuthService', '$location', function($scope, $http, AuthService, $location) {
  const API = 'http://localhost:3000/api';
  const token = AuthService.getToken();

  if (!token) return $location.path('/login');

  $scope.isAdmin = AuthService.isAdmin();
  $scope.merchants = [];
  $scope.users = [];
  $scope.residuals = [];

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // ✅ Fetch all merchants
  $http.get(`${API}/merchants`, config)
    .then(res => $scope.merchants = res.data.merchants || res.data)
    .catch(err => console.error('❌ Error fetching merchants', err));

  // ✅ Fetch all users (admin only)
  if ($scope.isAdmin) {
    $http.get(`${API}/users`, config)
      .then(res => $scope.users = res.data)
      .catch(err => console.error('❌ Error fetching users', err));
  }

  // ✅ Fetch residuals (latest month example)
  const currentMonth = new Date().toISOString().slice(0, 7);
  $http.get(`${API}/residuals/month/${currentMonth}`, config)
    .then(res => $scope.residuals = res.data)
    .catch(err => console.error('❌ Error fetching residuals', err));

  $scope.logout = () => {
    AuthService.logout();
    $location.path('/login');
  };
}]);
