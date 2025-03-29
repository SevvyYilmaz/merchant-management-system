angular.module('MerchantApp')
.factory('AuthService', ['$localStorage', function($localStorage) {
  return {
    setToken: function(token) {
      $localStorage.token = token;
    },
    getToken: function() {
      return $localStorage.token;
    },
    logout: function() {
      delete $localStorage.token;
    },
    isAdmin: function() {
      try {
        const payload = JSON.parse(atob($localStorage.token.split('.')[1]));
        return payload.role === 'admin';
      } catch (e) {
        return false;
      }
    }
  };
}]);
