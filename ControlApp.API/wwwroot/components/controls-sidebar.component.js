app.component('controlsSidebar', {
    template: `
    <div class="controls-sidebar">
        <div class="sidebar-buttons">
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'controls'}" 
                    ng-click="$ctrl.switchSection('controls')">
                <i class="fas fa-list-check me-2"></i>Controls
            </button>
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'addControlType'}" 
                    ng-click="$ctrl.switchSection('addControlType')">
                <i class="fas fa-plus-circle me-2"></i>Add Control Type
            </button>
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'controlTypes'}" 
                    ng-click="$ctrl.switchSection('controlTypes')">
                <i class="fas fa-tags me-2"></i>Control Types
            </button>
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'newEmployee'}" 
                    ng-click="$ctrl.switchSection('newEmployee')">
                <i class="fas fa-user-plus me-2"></i>New Employee
            </button>
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'employees'}" 
                    ng-click="$ctrl.switchSection('employees')">
                <i class="fas fa-users me-2"></i>Employees
            </button>
        </div>
    </div>
    `,
    controller: function($rootScope) {
        var ctrl = this;
        ctrl.currentSection = 'controls';
        
        ctrl.$onInit = function() {
            // Listen for section changes
            var listener = $rootScope.$on('controlsSectionChanged', function(event, section) {
                ctrl.currentSection = section;
            });
            
            ctrl.$onDestroy = function() {
                listener();
            };
        };
        
        ctrl.switchSection = function(section) {
            ctrl.currentSection = section;
            $rootScope.$broadcast('controlsSectionChanged', section);
        };
    }
});





