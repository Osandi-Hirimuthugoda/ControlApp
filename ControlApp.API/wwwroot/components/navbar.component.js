app.component('appNavbar', {
    template: `
    <nav class="navbar navbar-dark mb-4">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-network-wired"></i> Control Management System
            </span>
            <div class="d-flex align-items-center text-white" style="gap: 1.5rem;">
                <div ng-if="$ctrl.isAuthenticated && $ctrl.currentView !== 'login'" class="d-flex align-items-center" style="gap: 1rem;">
                    <span class="text-white">
                        <i class="fas fa-user me-1"></i>{{$ctrl.user.username}}
                    </span>
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.logout()">
                        <i class="fas fa-sign-out-alt me-1"></i>Logout
                </button>
                </div>
            </div>
        </div>
    </nav>
    `,
    controller: function($rootScope, AuthService) {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            ctrl.currentView = $rootScope.currentView || 'login';
            ctrl.isAuthenticated = AuthService.isAuthenticated();
            ctrl.user = AuthService.getUser();
            
            // Listen for view changes
            var listener = $rootScope.$on('viewChanged', function(event, view) {
                ctrl.currentView = view;
            });
            
            // Listen for authentication events
            var authListener = $rootScope.$on('userLoggedIn', function(event, userData) {
                ctrl.isAuthenticated = true;
                ctrl.user = AuthService.getUser();
            });
            
            var logoutListener = $rootScope.$on('userLoggedOut', function() {
                ctrl.isAuthenticated = false;
                ctrl.user = null;
                ctrl.currentView = 'login';
                $rootScope.$broadcast('viewChanged', 'login');
            });
            
            ctrl.$onDestroy = function() {
                listener();
                authListener();
                logoutListener();
            };
        };
        
        ctrl.switchView = function(view) {
            ctrl.currentView = view;
            $rootScope.currentView = view;
            $rootScope.$broadcast('viewChanged', view);
        };
        
        ctrl.logout = function() {
            AuthService.logout();
        };
    }
});