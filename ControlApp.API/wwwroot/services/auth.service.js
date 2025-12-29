app.service('AuthService', function($http, $q, $rootScope, $window) {
    var self = this;
    var TOKEN_KEY = 'auth_token';
    var USER_KEY = 'user_data';

    // Get token from localStorage
    self.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY);
    };

    // Get user data from localStorage
    self.getUser = function() {
        var userData = $window.localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    };

    // Check if user is authenticated
    self.isAdmin = function() {
        try {
            var user = self.getUser();
            if (!user) return false;
            // Case-insensitive check
            return user.role && user.role.toLowerCase() === 'admin';
        } catch(e) {
            console.error('Error checking admin status:', e);
            return false;
        }
    };
    
    self.isAuthenticated = function() {
        return !!self.getToken();
    };

    // Login
    self.login = function(credentials) {
        return $http.post('/api/auth/login', credentials).then(function(response) {
            if (response.data && response.data.token) {
                // Store token and user data
                $window.localStorage.setItem(TOKEN_KEY, response.data.token);
                $window.localStorage.setItem(USER_KEY, JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role
                }));
                
                // Broadcast login event
                $rootScope.$broadcast('userLoggedIn', response.data);
                
                return response.data;
            }
            return $q.reject('Invalid response from server');
        });
    };

    // Register
    self.register = function(userData) {
        return $http.post('/api/auth/register', userData).then(function(response) {
            if (response.data && response.data.token) {
                // Store token and user data
                $window.localStorage.setItem(TOKEN_KEY, response.data.token);
                $window.localStorage.setItem(USER_KEY, JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role
                }));
                
                // Broadcast login event
                $rootScope.$broadcast('userLoggedIn', response.data);
                
                return response.data;
            }
            return $q.reject('Invalid response from server');
        });
    };

    // Logout
    self.logout = function() {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
        $rootScope.$broadcast('userLoggedOut');
    };

    // Validate token
    self.validateToken = function() {
        var token = self.getToken();
        if (!token) {
            return $q.reject('No token found');
        }

        return $http.post('/api/auth/validate', {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.data;
        }).catch(function(error) {
            // Token is invalid, clear storage
            self.logout();
            return $q.reject(error);
        });
    };
});






