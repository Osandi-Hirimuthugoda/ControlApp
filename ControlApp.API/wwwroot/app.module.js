var app = angular.module('controlApp', ['ngRoute']);

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

// Configure Routing
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            template: '<login-component></login-component>'
        })
        .when('/dashboard', {
            template: '<dashboard></dashboard>',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }  
        })
        .when('/profile', {
            template: '<profile-component></profile-component>',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/controls', {
            template: '<controls-view></controls-view>',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/controls/:section', {
            template: '<controls-view></controls-view>',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/access-denied/:section?', {
            template: '<access-denied></access-denied>',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .otherwise({
            redirectTo: '/login'
        });
    
    // Enable HTML5 mode (no hash in URLs)
    $locationProvider.html5Mode(true);
});

app.controller('MainController', function($rootScope, AuthService, $location, $routeParams, $route) {
    var vm = this;
    
    // Check authentication on route change
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // Allow login page without authentication
        if (next && next.$$route && next.$$route.originalPath === '/login') {
            return;
        }
        
        // Redirect to login if not authenticated
        if (!AuthService.isAuthenticated()) {
            event.preventDefault();
            $location.path('/login');
        }
    });
    
    // Listen for view changes with routing
    var listener = $rootScope.$on('viewChanged', function(event, view) {
        // Protect routes - redirect to login if not authenticated
        if (view !== 'login' && !AuthService.isAuthenticated()) {
            $location.path('/login');
            return;
        }
        
        // Map view names to routes
        var routeMap = {
            'login': '/login',
            'dashboard': '/dashboard',
            'profile': '/profile',
            'controls': '/controls'
        };
        
        if (routeMap[view]) {
            $location.path(routeMap[view]);
        }
    });
    
    // Listen for authentication events
    var authListener = $rootScope.$on('userLoggedIn', function() {
        var currentPath = $location.path();
        if (currentPath === '/login' || currentPath === '/' || currentPath === '') {
            $location.path('/controls');
        }
    });
    
    var logoutListener = $rootScope.$on('userLoggedOut', function() {
        $location.path('/login');
    });
    
    // Handle route changes for controls section on initial load
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        if (current && current.params && current.params.section) {
            $rootScope.$broadcast('controlsSectionChanged', current.params.section);
        }
    });
    
    // Cleanup on scope destroy
    $rootScope.$on('$destroy', function() {
        listener();
        authListener();
        logoutListener();
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