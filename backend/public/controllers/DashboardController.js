// This file is part of the Merchant Dashboard project.
// It defines the AngularJS controller for the dashboard, which fetches and displays merchants from the server.
// It uses the $http service to make API calls and the $cookies service to manage authentication tokens.


app.controller('DashboardController', function($scope, $http, $cookies) {
    var token = $cookies.get('token');
    $http.get('/api/merchants', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(function(response) {
            $scope.merchants = response.data;
        }, function(error) {
            console.log('Error fetching merchants');
        });
});
