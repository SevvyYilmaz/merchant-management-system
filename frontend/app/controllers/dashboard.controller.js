angular.module('MerchantApp')
.controller('DashboardController', ['$scope', '$http', 'AuthService', '$location', 'toastr', function($scope, $http, AuthService, $location, toastr) {
  const token = AuthService.getToken();
  if (!token) return $location.path('/login');

  $scope.isAdmin = AuthService.isAdmin;
  $scope.merchants = [];
  $scope.users = [];
  $scope.residuals = [];
  $scope.selectedMonth = new Date(); 

  setTimeout(() => {
    $scope.currentUser = AuthService.getUser();
    console.log('👤 Current User:', $scope.currentUser);
    if (!$scope.$$phase) $scope.$apply();
    loadMerchants();
  }, 0);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  function loadMerchants() {
    const user = AuthService.getUser();
    const isAdmin = user?.role === 'admin';
    const url = isAdmin
      ? 'http://localhost:3005/api/merchants?all=true'
      : 'http://localhost:3005/api/merchants';

    $http.get(url, config)
      .then(res => {
        $scope.merchants = res.data;
        console.log('📦 Merchants loaded:', $scope.merchants);
      })
      .catch(err => console.error('❌ Error fetching merchants', err));
  }

  if ($scope.isAdmin()) {
    $http.get('http://localhost:3005/api/users', config)
      .then(res => $scope.users = res.data)
      .catch(err => console.error('❌ Error fetching users', err));
  }

  $scope.loadResiduals = () => {
    const selectedMonthString = $scope.selectedMonth.toISOString().slice(0, 7);
    $http.get(`http://localhost:3005/api/residuals/month/${selectedMonthString}`, config)
      .then(res => {
        $scope.residuals = res.data;
        console.log('📦 Residuals:', $scope.residuals);
        drawResidualChart($scope.residuals);
      })
      .catch(err => console.error('❌ Error fetching residuals', err));
  };

  $scope.exportToCSV = () => {
    if (!$scope.residuals.length) return toastr.warning('No data to export.');

    const header = ['Merchant', 'Amount', 'Month'];
    const rows = $scope.residuals.map(r => [
      r.merchantId?.merchantName || 'Unknown',
      r.residualAmount,
      r.month || r.residualMonth
    ]);

    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `residuals_${$scope.selectedMonth.toISOString().slice(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  $scope.onMonthChange = () => {
    $scope.loadResiduals();
  };

  function drawResidualChart(residuals) {
    const ctx = document.getElementById('residualChart')?.getContext('2d');
    if (!ctx) return;

    const labels = residuals.map(r => r.merchantId?.merchantName || '[Unknown]');
    const values = residuals.map(r => Number(r.residualAmount || 0));

    if (window.residualChartInstance) window.residualChartInstance.destroy();

    window.residualChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Residual Amount ($)',
          data: values,
          backgroundColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  $scope.getTotalResiduals = () => {
    return $scope.residuals.reduce((sum, r) => sum + Number(r.residualAmount || 0), 0);
  };

  function loadResidualTrendChart() {
    const now = new Date();
    const labels = [];
    const requests = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().slice(0, 7);
      labels.push(monthStr);
      requests.push($http.get(`http://localhost:3005/api/residuals/month/${monthStr}`, config));
    }

    Promise.all(requests).then(responses => {
      const totals = responses.map(res =>
        res.data.reduce((sum, r) => sum + Number(r.residualAmount || 0), 0)
      );

      const ctx = document.getElementById('residualTrendChart')?.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Total Residuals',
            data: totals,
            borderColor: '#2196F3',
            fill: false,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }

  $scope.logout = () => {
    AuthService.logout();
    $location.path('/login');
  };

  $scope.goToAddMerchant = () => {
    $location.path('/merchants/new');
  };

  // Initial load
  $scope.loadResiduals();
  loadResidualTrendChart();
}]);
