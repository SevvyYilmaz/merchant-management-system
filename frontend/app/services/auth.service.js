angular.module('MerchantApp')
.factory('AuthService', ['$http', '$localStorage', '$location', 'toastr', function($http, $localStorage, $location, toastr) {

  function getToken() {
    return $localStorage.token || null;
  }

  function getUser() {
    return $localStorage.user || {};
  }

  function decodeToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  function isTokenExpired(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  }

  return {
    setToken: function(token) {
      $localStorage.token = token;
    },
    getToken: getToken,

    setUser: function(user) {
      const userCopy = angular.copy(user);
      $localStorage.user = userCopy;

      // 🧠 Fallback for localStorage syncing issues
      setTimeout(() => {
        console.log('✅ User saved to $localStorage:', $localStorage.user);
        if ($localStorage.$apply) $localStorage.$apply();
        localStorage.setItem('ngStorage-user', JSON.stringify(userCopy)); // 🔒 fallback write
      }, 0);
    },

    getUser: getUser,

    logout: function() {
      const token = getToken();
      if (token) {
        $http.post('http://localhost:3005/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).finally(() => {
          delete $localStorage.token;
          delete $localStorage.user;
          toastr.success('Logged out successfully.');
          $location.path('/login');
        });
      } else {
        delete $localStorage.token;
        delete $localStorage.user;
        $location.path('/login');
      }
    },

    isAdmin: function() {
      const token = getToken();
      const decoded = decodeToken(token);
      return decoded && decoded.role === 'admin';
    },

    isTokenValid: function() {
      const token = getToken();
      if (!token) return false;
      return !isTokenExpired(token);
    },

    getUserInfo: getUser
  };
}]);
