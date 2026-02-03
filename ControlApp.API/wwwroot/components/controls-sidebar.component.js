app.component('controlsSidebar', {
    template: `
    <div class="controls-sidebar">
        <div class="sidebar-buttons">
            <!-- Navigation to Main Dashboard -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentView === 'dashboard'}" 
                    ng-click="$ctrl.switchToDashboard()">
                <i class="fas fa-tachometer-alt me-2"></i>Dashboard
            </button>

            <hr class="sidebar-divider">

            <!-- Add Employee (everyone can see; access checked on click) -->
            <button class="sidebar-btn"
                    ng-class="{'active': $ctrl.currentSection === 'newEmployee'}" 
                    ng-click="$ctrl.switchSection('newEmployee')">
                <i class="fas fa-user-plus me-2"></i>Add Employee
            </button>

            <!-- Standard Employee Assignment List -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'employees'}" 
                    ng-click="$ctrl.switchSection('employees')">
                <i class="fas fa-users me-2"></i>Employee List
            </button>

            <hr class="sidebar-divider">

            <!-- Controls Section -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'controls'}" 
                    ng-click="$ctrl.switchSection('controls')">
                <i class="fas fa-list-check me-2"></i>Controls Board
            </button>

            <!-- Add New Control -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'addControlType'}" 
                    ng-click="$ctrl.switchSection('addControlType')">
                <i class="fas fa-plus-circle me-2"></i>Add Controls
            </button>

            <!-- List of all Controls -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'controlTypes'}" 
                    ng-click="$ctrl.switchSection('controlTypes')">
                <i class="fas fa-tags me-2"></i>Control List
            </button>
        </div>
    </div>
    `,
    controller: function ($rootScope, AuthService, $location, $routeParams) {
        var ctrl = this;

        // Default selection
        ctrl.currentSection = 'controls';
        ctrl.currentView = $rootScope.currentView || 'controls';

        /**
         * Checks if the logged-in user has admin rights
         */
        ctrl.isAdmin = function () {
            return AuthService.isAdmin();
        };

        /**
         * Checks if user can add employees
         * (Only Admin and Project Manager; Developer / QA Engineer / Intern are view-only)
         */
        ctrl.canAddEmployee = function () {
            return AuthService.canAddEmployee();
        };

        /**
         * Checks if user can add controls (Admin, Team Lead, Software Architecture)
         */
        ctrl.canAddControl = function () {
            return AuthService.canAddControl();
        };

        ctrl.$onInit = function () {
            // Initialize current section based on current route
            ctrl.updateCurrentSectionFromRoute();

            // Get current section from route params
            if ($routeParams && $routeParams.section) {
                ctrl.currentSection = $routeParams.section;
            }

            // Sync current view with global rootScope
            var viewListener = $rootScope.$on('viewChanged', function (event, view) {
                ctrl.currentView = view;
            });

            // Sync internal sections (Controls, etc.) from route
            var routeListener = $rootScope.$on('$routeChangeSuccess', function (event, current) {
                ctrl.updateCurrentSectionFromRoute();
                if (current && current.params && current.params.section) {
                    ctrl.currentSection = current.params.section;
                } else if (current && current.$$route && current.$$route.originalPath === '/controls') {
                    ctrl.currentSection = 'controls';
                }
            });

            var sectionListener = $rootScope.$on('controlsSectionChanged', function (event, section) {
                ctrl.currentSection = section;
            });

            // Cleanup listeners when component is destroyed
            ctrl.$onDestroy = function () {
                viewListener();
                routeListener();
                sectionListener();
            };
        };

        // Update current section based on current route path
        ctrl.updateCurrentSectionFromRoute = function () {
            var path = $location.path();
            if (path === '/controls' || path.startsWith('/controls/')) {
                if (path === '/controls') {
                    ctrl.currentSection = 'controls';
                } else {
                    var section = path.replace('/controls/', '');
                    ctrl.currentSection = section || 'controls';
                }
            } else if (path === '/dashboard') {
                ctrl.currentView = 'dashboard';
            }
        };

        /**
         * Switches the main app view back to the Dashboard
         */
        ctrl.switchToDashboard = function () {
            ctrl.currentSection = null;
            ctrl.currentView = 'dashboard';
            $rootScope.$broadcast('viewChanged', 'dashboard');
            $location.path('/dashboard');
        };

        /**
         * Switches sub-sections within the Controls view
         * @param {string} section - The name of the section (e.g., 'masterEmployees')
         */
        ctrl.switchSection = function (section) {
            // Check access before switching
            if (!ctrl.hasAccessToSection(section)) {
                ctrl.showAccessWarning(section);
                return;
            }

            ctrl.currentSection = section;
            // Update URL with routing
            if (section && section !== 'controls') {
                $location.path('/controls/' + section);
            } else {
                $location.path('/controls');
            }
            // Also broadcast for components that still listen to it
            $rootScope.$broadcast('controlsSectionChanged', section);
        };

        /**
         * Check if user has access to a section
         */
        ctrl.hasAccessToSection = function (section) {
            switch (section) {
                case 'addControlType':
                    return AuthService.canAddControl();
                case 'controlTypes':
                    return true; // Everyone can view control types
                case 'newEmployee':
                    return AuthService.canAddEmployee(); // Admin & Project Manager
                case 'employees':
                    return true; // Everyone can view employees
                default:
                    return true;
            }
        };

        /**
         * Show access warning message
         */
        ctrl.showAccessWarning = function (section) {
            var allowedRoles = ctrl.getAllowedRolesForSection(section);
            var roleNames = allowedRoles.join(', ');
            var user = AuthService.getUser();
            var userRole = user ? user.role : 'Unknown';

            Swal.fire({
                icon: 'warning',
                title: 'Access Denied',
                html: '<p>You do not have access to this feature.</p>' +
                    '<p><strong>Your registered role:</strong> <span class="badge bg-secondary">' + userRole + '</span></p>' +
                    '<p><strong>Access is only available for:</strong></p>' +
                    '<div class="mt-2">' +
                    allowedRoles.map(function (role) {
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
        ctrl.getAllowedRolesForSection = function (section) {
            var roleMap = {
                // Add Controls & Assign Owner
                'addControlType': ['Admin', 'Team Lead', 'Software Architecture'],
                // Control List (everyone can view)
                'controlTypes': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'],
                // Add Employee (Admin & Project Manager)
                'newEmployee': ['Admin', 'Project Manager'],
                // Employees List (everyone can view)
                'employees': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer']
            };

            return roleMap[section] || ['Admin'];
        };
    }
});