app.component('controlsView', {
    template: `
    <div class="row" style="align-items: flex-start; margin: 0;">
        <!-- Left Side: Sidebar with Buttons -->
        <div class="col-md-3" style="padding-left: 0; padding-right: 10px;">
            <controls-sidebar></controls-sidebar>
        </div>

        <!--Right Side: Content Area -->
        <div class="col-md-9" style="display: flex; flex-direction: column; padding-right: 0; padding-left: 10px;">
            <!-- Controls Table -->
            <div ng-if="$ctrl.currentSection === 'controls'">
                <control-board></control-board>
            </div>
            
            <!-- Add Control Type -->
            <div ng-if="$ctrl.currentSection === 'addControlType'">
                <add-control-type></add-control-type>
            </div>
            
            <!-- Control Types List -->
            <div ng-if="$ctrl.currentSection === 'controlTypes'">
                <control-types-list></control-types-list>
            </div>
            
            <!-- New Employee -->
            <div ng-if="$ctrl.currentSection === 'newEmployee'">
                <new-employee></new-employee>
            </div>
            
            <!-- Employees List -->
            <div ng-if="$ctrl.currentSection === 'employees'">
                <employees-list></employees-list>
            </div>
        </div>
    </div>
    `,
    controller: function($rootScope, $location, $routeParams, AuthService) {
        var ctrl = this;
        
        // Store AuthService reference
        ctrl.authService = AuthService;
        
        // Initialize section from route params
        ctrl.initSection = function() {
            if ($routeParams && $routeParams.section) {
                var section = $routeParams.section;
                // Check access before setting section
                if (!ctrl.hasAccessToSection(section)) {
                    // Show warning and redirect to controls
                    ctrl.showAccessWarning(section);
                    $location.path('/controls');
                    return;
                }
                ctrl.currentSection = section;
            } else {
                ctrl.currentSection = 'controls';
            }
        };
        
        // Check if user has access to a section
        ctrl.hasAccessToSection = function(section) {
            switch(section) {
                case 'addControlType':
                    return AuthService.canAddControl();
                case 'controlTypes':
                    return true; // Everyone can view control types
                case 'newEmployee':
                    return AuthService.canAddEmployee();
                case 'employees':
                    return true; // Everyone can view employees
                default:
                    return true;
            }
        };
        
        // Initialize on controller creation
        ctrl.initSection();
        
        var listener = $rootScope.$on('controlsSectionChanged', function(event, section) {
            ctrl.currentSection = section;
            // Update URL when section changes
            if (section && section !== 'controls') {
                $location.path('/controls/' + section);
            } else {
                $location.path('/controls');
            }
        });
        
        // Listen for route changes to update section
        $rootScope.$on('$routeUpdate', function() {
            ctrl.initSection();
        });
        
        // Also listen for route change success
        $rootScope.$on('$routeChangeSuccess', function(event, current) {
            if (current && current.params && current.params.section) {
                var section = current.params.section;
                // Check access before setting section
                if (!ctrl.hasAccessToSection(section)) {
                    // Show warning and redirect to controls
                    ctrl.showAccessWarning(section);
                    $location.path('/controls');
                    return;
                }
                ctrl.currentSection = section;
            } else if (current && current.$$route && current.$$route.originalPath === '/controls') {
                ctrl.currentSection = 'controls';
            } else {
                ctrl.initSection();
            }
        });
        
        /**
         * Show access warning message
         */
        ctrl.showAccessWarning = function(section) {
            var allowedRoles = ctrl.getAllowedRolesForSection(section);
            var user = AuthService.getUser();
            var userRole = user ? user.role : 'Unknown';
            
            Swal.fire({
                icon: 'warning',
                title: 'Access Denied',
                html: '<p>You do not have access to this feature.</p>' +
                      '<p><strong>Your registered role:</strong> <span class="badge bg-secondary">' + userRole + '</span></p>' +
                      '<p><strong>Access is only available for:</strong></p>' +
                      '<div class="mt-2">' + 
                      allowedRoles.map(function(role) {
                          return '<span class="badge bg-primary me-1 mb-1">' + role + '</span>';
                      }).join('') +
                      '</div>',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
        };
        
        /**
         * Get allowed roles for a section
         */
        ctrl.getAllowedRolesForSection = function(section) {
            var roleMap = {
                // Add Controls & Assign Owner
                'addControlType': ['Admin', 'Team Lead', 'Software Architecture'],
                // Control List (everyone can view)
                'controlTypes': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern'],
                // Add Employee (Admin only)
                'newEmployee': ['Admin'],
                // Employees List (everyone can view)
                'employees': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern']
            };
            
            return roleMap[section] || ['Admin'];
        };
        
        ctrl.$onDestroy = function() {
            listener();
        };
    }
});

