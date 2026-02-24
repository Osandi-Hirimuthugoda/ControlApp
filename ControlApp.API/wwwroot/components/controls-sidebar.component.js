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
            
            <!-- Super Admin Dashboard (Super Admin Only) -->
            <button class="sidebar-btn" 
                    ng-if="$ctrl.isSuperAdmin()"
                    ng-click="$ctrl.goToSuperAdminDashboard()">
                <i class="fas fa-crown me-2 text-warning"></i>Super Admin
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

            <!-- Control Types Management -->
            <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'controlTypesManagement'}" 
                    ng-click="$ctrl.switchSection('controlTypesManagement'); console.log('Control Types clicked, switching to controlTypesManagement')">
                <i class="fas fa-cogs me-2"></i>Control Types
                <small class="d-block text-muted" style="font-size: 0.7rem;">{{$ctrl.currentSection}}</small>
            </button>
            
            <!-- Sub Objectives Master List -->
            <!-- <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'subObjectives'}" 
                    ng-click="$ctrl.switchSection('subObjectives')">
                <i class="fas fa-tasks me-2"></i>Sub Objectives
            </button> -->

            <hr class="sidebar-divider">

            
            <!-- Daily Progress Tracking -->
            <!-- <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'dailyProgress'}" 
                    ng-click="$ctrl.switchSection('dailyProgress')">
                <i class="fas fa-calendar-check me-2"></i>Daily Progress
            </button> -->

            <!-- Latest Insights -->
            <!-- <button class="sidebar-btn" 
                    ng-class="{'active': $ctrl.currentSection === 'latestInsights'}" 
                    ng-click="$ctrl.switchSection('latestInsights')">
                <i class="fas fa-lightbulb me-2"></i>Latest Insights
            </button> -->
            
            <hr class="sidebar-divider" ng-if="$ctrl.isSuperAdmin()">
            
            <!-- Team Management (Super Admin Only) -->
            <button class="sidebar-btn" 
                    ng-if="$ctrl.isSuperAdmin()"
                    ng-click="$ctrl.goToTeamManagement()">
                <i class="fas fa-users-cog me-2"></i>Team Management
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
        
        /**
         * Checks if user is Super Admin
         */
        ctrl.isSuperAdmin = function () {
            return AuthService.isSuperAdmin();
        };
        
        /**
         * Navigate to Team Management page
         */
        ctrl.goToTeamManagement = function () {
            $location.path('/teams');
        };
        
        /**
         * Navigate to Super Admin Dashboard
         */
        ctrl.goToSuperAdminDashboard = function () {
            $location.path('/super-admin');
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
            
            // Broadcast section change first
            $rootScope.$broadcast('controlsSectionChanged', section);
            
            // Update URL without reloading - use $location.search() instead of path()
            // This prevents the component from reloading
            if (section && section !== 'controls') {
                // Use replace() to update URL without adding to history
                $location.path('/controls/' + section).replace();
            } else {
                $location.path('/controls').replace();
            }
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
                case 'controlTypesManagement':
                    return AuthService.isAdmin() || AuthService.isSoftwareArchitecture() || AuthService.isTeamLead();
                case 'subObjectives':
                    return true; // Everyone can view sub objectives
                case 'dailyProgress':
                    return true; // Everyone can view daily progress
                case 'latestInsights':
                    return true; // Everyone can view and add insights
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
                // Control Types Management (Admin, Software Architecture, Team Lead only)
                'controlTypesManagement': ['Admin', 'Software Architecture', 'Team Lead'],
                // Sub Objectives (everyone can view)
                'subObjectives': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'],
                // Add Employee (Admin & Project Manager)
                'newEmployee': ['Admin', 'Project Manager'],
                // Employees List (everyone can view)
                'employees': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer']
            };

            return roleMap[section] || ['Admin'];
        };
    }
});