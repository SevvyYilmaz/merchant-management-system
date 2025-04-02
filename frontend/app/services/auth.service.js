angular.module('MerchantApp')
.factory('AuthService', ['$http', '$localStorage', '$location', 'toastr', function($http, $localStorage, $location, toastr) {

  function getToken() {
    return $localStorage.token || null;
  }

  function setToken(token) {
    $localStorage.token = token;
  }

  function getUser() {
    return $localStorage.user || {};
  }

  function setUser(user) {
    const userCopy = angular.copy(user);
    $localStorage.user = userCopy;

    // ✅ Fallback: ensure syncing in all browsers
    setTimeout(() => {
      console.log('✅ User saved to $localStorage:', $localStorage.user);
      localStorage.setItem('ngStorage-user', JSON.stringify(userCopy));
    }, 0);
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

  function logout() {
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
  }

  return {
    setToken,
    getToken,
    setUser,
    getUser,
    logout,

    isAdmin: function() {
      const token = getToken();
      const decoded = decodeToken(token);
      return decoded && decoded.role === 'admin';
    },

    isTokenValid: function() {
      const token = getToken();
      if (!token) return false;
      return !isTokenExpired(token);
    }
  };
}]);
