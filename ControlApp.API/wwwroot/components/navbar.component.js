app.component('appNavbar', {
    template: `
    <nav class="navbar navbar-dark mb-4">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-network-wired"></i> Control Management System
            </span>
            <div class="d-flex align-items-center text-white" style="gap: 1.5rem;">
                <div ng-if="$ctrl.isAuthenticated && !$ctrl.isLoginPage()" class="d-flex align-items-center" style="gap: 1rem;">
                    <div class="d-flex flex-column">
                        <span class="text-white">
                            <i class="fas fa-user me-1"></i>{{$ctrl.user.username}}
                        </span>
                        <span class="badge bg-info mt-1" ng-if="$ctrl.user && $ctrl.user.role">
                            {{$ctrl.user.role}}
                        </span>
                    </div>
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.openProfile()" title="Profile Settings">
                        <i class="fas fa-cog me-1"></i>Profile
                    </button>
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.logout()">
                        <i class="fas fa-sign-out-alt me-1"></i>Logout
                </button>
                </div>
            </div>
        </div>
    </nav>
    `,
    controller: function($rootScope, AuthService, $location, $timeout) {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            ctrl.isAuthenticated = AuthService.isAuthenticated();
            ctrl.user = AuthService.getUser();
            ctrl.currentPath = $location.path();
            
            // Check if current route is login page
            ctrl.isLoginPage = function() {
                return ctrl.currentPath === '/login' || ctrl.currentPath === '/' || ctrl.currentPath === '';
            };
            
            // Update authentication status and path on route changes
            var routeListener = $rootScope.$on('$routeChangeSuccess', function() {
                ctrl.isAuthenticated = AuthService.isAuthenticated();
                ctrl.user = AuthService.getUser();
                ctrl.currentPath = $location.path();
            });
            
            // Listen for authentication events
            var authListener = $rootScope.$on('userLoggedIn', function(event, userData) {
                ctrl.isAuthenticated = true;
                ctrl.user = AuthService.getUser();
                ctrl.currentPath = $location.path();
            });
            
            var logoutListener = $rootScope.$on('userLoggedOut', function() {
                ctrl.isAuthenticated = false;
                ctrl.user = null;
                ctrl.currentPath = $location.path();
            });
            
            ctrl.$onDestroy = function() {
                routeListener();
                authListener();
                logoutListener();
            };
        };
        
        ctrl.switchView = function(view) {
            ctrl.currentView = view;
            $rootScope.currentView = view;
            $rootScope.$broadcast('viewChanged', view);
        };
        
        ctrl.openProfile = function() {
            $location.path('/profile');
        };

        ctrl.logout = function() {
            Swal.fire({
                title: 'Logout?',
                text: "Are you sure you want to log out from the system?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, Logout!',
                cancelButtonText: 'Cancel'
             }).then((result) => {
                if (result.isConfirmed) {
                    // Logout - this will broadcast 'userLoggedOut' event
                    AuthService.logout();
                    
                    // Navigate immediately to login page using routing
                    // Use $timeout to ensure digest cycle runs and navigation happens immediately
                    $timeout(function() {
                        $location.path('/login');
                    }, 0);
                }
            });
        };
    }
});