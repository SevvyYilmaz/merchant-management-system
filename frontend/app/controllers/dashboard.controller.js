angular.module('MerchantApp')
.controller('DashboardController', ['$scope', '$http', 'AuthService', '$location', 'toastr', function($scope, $http, AuthService, $location, toastr) {
  const token = AuthService.getToken();
  if (!token) return $location.path('/login');

  $scope.isAdmin = AuthService.isAdmin;
  $scope.merchants = [];
  $scope.users = [];
  $scope.residuals = [];
  $scope.selectedMonth = new Date(); // ✅ Fix: use native Date object

  setTimeout(() => {
    $scope.currentUser = AuthService.getUserInfo();
    console.log('👤 Current User:', $scope.currentUser);
    if (!$scope.$$phase) $scope.$apply(); // ensure digest cycle
  }, 0);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Load Merchants
  $http.get('http://localhost:3005/api/merchants', config)
    .then(res => $scope.merchants = res.data)
    .catch(err => console.error('❌ Error fetching merchants', err));

  // Load Users (Admin Only)
  if ($scope.isAdmin()) {
    $http.get('http://localhost:3005/api/users', config)
      .then(res => $scope.users = res.data)
      .catch(err => console.error('❌ Error fetching users', err));
  }

  // Load Residuals by month
  $scope.loadResiduals = () => {
    const selectedMonthString = $scope.selectedMonth.toISOString().slice(0, 7); // ✅ Fix
    $http.get(`http://localhost:3005/api/residuals/month/${selectedMonthString}`, config)
      .then(res => {
        $scope.residuals = res.data;
        console.log('📦 Residuals:', $scope.residuals);
        drawResidualChart($scope.residuals);
      })
      .catch(err => console.error('❌ Error fetching residuals', err));
  };

  // Export to CSV
  $scope.exportToCSV = () => {
    if (!$scope.residuals.length) return toastr.warning('No data to export.');

    const header = ['Merchant', 'Amount', 'Month'];
    const rows = $scope.residuals.map(r => [
      r.merchantId?.merchantName || 'Unknown',
      r.amount,
      r.month
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

  // Handle Month Change
  $scope.onMonthChange = () => {
    $scope.loadResiduals();
  };

  // Draw Merchant Residuals Bar Chart
  function drawResidualChart(residuals) {
    const ctx = document.getElementById('residualChart')?.getContext('2d');
    if (!ctx) return;

    const labels = residuals.map(r => r.merchantId?.merchantName || '[Unknown]');
    const values = residuals.map(r => r.amount || 0);

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

  // Total Residual Calculator
  $scope.getTotalResiduals = () => {
    return $scope.residuals.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  };

  // Draw Residual Trend Chart (Last 6 Months)
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
        res.data.reduce((sum, r) => sum + Number(r.amount || 0), 0)
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

  // Logout
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
