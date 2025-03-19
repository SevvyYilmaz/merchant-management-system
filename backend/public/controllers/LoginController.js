// This is a simple AngularJS controller for handling user login.


app.controller('LoginController', function($scope, $http, $location, $cookies) {
    $scope.login = function() {
        $http.post('/api/auth/login', $scope.user)
            .then(function(response) {
                $cookies.put('token', response.data.token);
                $location.path('/dashboard');
            }, function(error) {
                $scope.errorMessage = 'Invalid Credentials';
            });
    };
});