var app = angular.module('controlApp', []);

// HTTP Interceptor to add JWT token to all requests and handle 401 errors
app.factory('AuthInterceptor', function($window, $q, $rootScope) {
    return {
        request: function(config) {
            var token = $window.localStorage.getItem('auth_token');
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                // Token expired or invalid, logout user
                $window.localStorage.removeItem('auth_token');
                $window.localStorage.removeItem('user_data');
                $rootScope.$broadcast('userLoggedOut');
            }
            return $q.reject(rejection);
        }
    };
});

// Configure HTTP provider to use the interceptor
app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.controller('MainController', function($rootScope, AuthService) {
    var vm = this;
    
    // Always start with login page when URL is first loaded
    vm.currentView = 'login';
    
    // Listen for view changes with authentication check
    var listener = $rootScope.$on('viewChanged', function(event, view) {
        // Protect routes - redirect to login if not authenticated
        if (view !== 'login' && !AuthService.isAuthenticated()) {
            vm.currentView = 'login';
            return;
        }
        vm.currentView = view;
    });
    
    // Listen for authentication events
    var authListener = $rootScope.$on('userLoggedIn', function() {
        if (vm.currentView === 'login') {
            vm.currentView = 'controls';
        }
    });
    
    var logoutListener = $rootScope.$on('userLoggedOut', function() {
        vm.currentView = 'login';
    });
    
    // Cleanup on scope destroy
    $rootScope.$on('$destroy', function() {
        listener();
        authListener();
        logoutListener();
    });
});

// Controls View Controller for Section Switching
app.controller('ControlsViewController', function($rootScope) {
    var vm = this;
    vm.currentSection = 'controls';
    
    var listener = $rootScope.$on('controlsSectionChanged', function(event, section) {
        vm.currentSection = section;
    });
    
    $rootScope.$on('$destroy', function() {
        listener();
    });
});

// Controller for Toast Notifications
app.controller('ToastController', function(NotificationService) {
    var vm = this;
    vm.message = '';
    vm.type = '';

    NotificationService.subscribe(function(msg, type) {
        vm.message = msg;
        vm.type = type;
    });

    vm.clear = function() {
        vm.message = '';
    };
});