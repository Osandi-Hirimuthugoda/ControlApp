app.component('appNavbar', {
    template: `
    <nav class="navbar navbar-dark mb-4">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-network-wired"></i> Control Management System
            </span>
            <div class="d-flex align-items-center text-white" style="gap: 1.5rem;">
                <button class="btn-nav" ng-class="{'active': $ctrl.currentView === 'dashboard'}" 
                        ng-click="$ctrl.switchView('dashboard')">
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </button>
                <button class="btn-nav" ng-class="{'active': $ctrl.currentView === 'controls'}" 
                        ng-click="$ctrl.switchView('controls')">
                    <i class="fas fa-list-check me-2"></i>Controls
                </button>
            </div>
        </div>
    </nav>
    `,
    controller: function($rootScope) {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            ctrl.currentView = $rootScope.currentView || 'dashboard';
            
            // Listen for view changes
            var listener = $rootScope.$on('viewChanged', function(event, view) {
                ctrl.currentView = view;
            });
            
            ctrl.$onDestroy = function() {
                listener();
            };
        };
        
        ctrl.switchView = function(view) {
            ctrl.currentView = view;
            $rootScope.currentView = view;
            $rootScope.$broadcast('viewChanged', view);
        };
    }
});