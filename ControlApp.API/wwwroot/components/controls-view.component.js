app.component('controlsView', {
    template: `
    <div class="row" style="align-items: flex-start; margin: 0;">
        <!-- Left Side: Sidebar with Buttons -->
        <div class="sidebar-container" ng-class="{'collapsed': $ctrl.sidebarCollapsed, 'expanded': !$ctrl.sidebarCollapsed, 'minimized': $ctrl.sidebarMinimized}">
            <!-- Anchor Bar with Icons -->
            <div class="sidebar-anchor-bar">
                <button class="anchor-btn" ng-click="$ctrl.toggleSidebar()" title="Toggle Sidebar">
                    <i class="fas" ng-class="$ctrl.sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.toggleFullscreen()" title="Toggle Fullscreen">
                    <i class="fas" ng-class="$ctrl.isFullscreen ? 'fa-compress' : 'fa-expand'"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.resetLayout()" title="Reset Layout">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.minimizeSidebar()" title="Minimize Sidebar">
                    <i class="fas fa-window-minimize"></i>
                </button>
            </div>
            <!-- Sidebar Content -->
            <div class="sidebar-content" ng-if="!$ctrl.sidebarMinimized">
                <controls-sidebar></controls-sidebar>
            </div>
        </div>

        <!--Right Side: Content Area -->
        <div class="content-area" ng-class="{'full-width': $ctrl.sidebarCollapsed || $ctrl.sidebarMinimized, 'normal-width': !$ctrl.sidebarCollapsed && !$ctrl.sidebarMinimized}">
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
            
            <!-- Control Types Management -->
            <div ng-if="$ctrl.currentSection === 'controlTypesManagement'">
                <control-types-management></control-types-management>
            </div>
            
            <!-- Sub Objectives List -->
            <!-- <div ng-if="$ctrl.currentSection === 'subObjectives'">
                <sub-objectives-view></sub-objectives-view>
            </div> -->
            
            <!-- Daily Progress Tracking -->
            <div ng-if="$ctrl.currentSection === 'dailyProgress'">
                <daily-progress></daily-progress>
            </div>
            
            <!-- Latest Insights -->
            <div ng-if="$ctrl.currentSection === 'latestInsights'">
                <latest-insights></latest-insights>
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
    controller: function ($rootScope, $location, $routeParams, AuthService) {
        var ctrl = this;

        // Store AuthService reference
        ctrl.authService = AuthService;

        // Sidebar state management
        ctrl.sidebarCollapsed = false;
        ctrl.sidebarMinimized = false;
        ctrl.isFullscreen = false;

        // Toggle sidebar collapse/expand
        ctrl.toggleSidebar = function () {
            ctrl.sidebarCollapsed = !ctrl.sidebarCollapsed;
            if (ctrl.sidebarCollapsed) {
                ctrl.sidebarMinimized = false; // Reset minimize when collapsing
            }
        };

        // Minimize sidebar (show only anchor bar)
        ctrl.minimizeSidebar = function () {
            ctrl.sidebarMinimized = !ctrl.sidebarMinimized;
            if (ctrl.sidebarMinimized) {
                ctrl.sidebarCollapsed = false; // Reset collapse when minimizing
            }
        };

        // Toggle fullscreen mode
        ctrl.toggleFullscreen = function () {
            ctrl.isFullscreen = !ctrl.isFullscreen;
            if (ctrl.isFullscreen) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(function (err) {
                        console.log('Error attempting to enable fullscreen:', err);
                    });
                }
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        };

        // Reset layout to default
        ctrl.resetLayout = function () {
            ctrl.sidebarCollapsed = false;
            ctrl.sidebarMinimized = false;
            ctrl.isFullscreen = false;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };

        // Initialize section from route params
        ctrl.initSection = function () {
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
                    return AuthService.canAddEmployee();
                case 'employees':
                    return true; // Everyone can view employees
                default:
                    return true;
            }
        };

        // Initialize on controller creation
        ctrl.initSection();

        var listener = $rootScope.$on('controlsSectionChanged', function (event, section) {
            ctrl.currentSection = section;
            // Update URL when section changes
            if (section && section !== 'controls') {
                $location.path('/controls/' + section);
            } else {
                $location.path('/controls');
            }
        });

        // Listen for route changes to update section
        $rootScope.$on('$routeUpdate', function () {
            ctrl.initSection();
        });

        // Also listen for route change success
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
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
        ctrl.showAccessWarning = function (section) {
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
                // Daily Progress (everyone can view)
                'dailyProgress': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'],
                // Latest Insights (everyone can view and add)
                'latestInsights': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'],
                // Add Employee (Admin only)
                'newEmployee': ['Admin'],
                // Employees List (everyone can view)
                'employees': ['Admin', 'Software Architecture', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer']
            };

            return roleMap[section] || ['Admin'];
        };

        ctrl.$onDestroy = function () {
            listener();
        };
    }
});

