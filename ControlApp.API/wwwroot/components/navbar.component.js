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
                    
                    <!-- Team Display/Switcher -->
                    <div class="d-flex flex-column" ng-if="$ctrl.user && ($ctrl.user.currentTeamName || $ctrl.user.teams.length > 0)">
                        <span class="text-white-50 small">Team:</span>
                        <!-- Multiple Teams: Team Switcher Dropdown -->
                        <div ng-if="$ctrl.user.teams && $ctrl.user.teams.length > 1" class="dropdown">
                            <button class="btn btn-sm btn-outline-warning dropdown-toggle" type="button" id="teamDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-users me-1"></i>{{$ctrl.user.currentTeamName || ($ctrl.user.teams.length > 1 ? 'All My Teams' : 'Select Team')}}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="teamDropdown">
                                <!-- "All My Teams" option for users with multiple teams -->
                                <li ng-if="!$ctrl.user.isSuperAdmin && $ctrl.user.teams && $ctrl.user.teams.length > 1">
                                    <a class="dropdown-item" 
                                       href="#" 
                                       ng-click="$ctrl.switchToAllTeams($event)"
                                       ng-class="{'active': !$ctrl.user.currentTeamId}">
                                        <i class="fas fa-layer-group me-2"></i>All My Teams
                                    </a>
                                </li>
                                <li ng-if="!$ctrl.user.isSuperAdmin && $ctrl.user.teams && $ctrl.user.teams.length > 1"><hr class="dropdown-divider"></li>
                                <!-- Show only assigned teams for Super Admin (no "All Teams" option) -->
                                <li ng-repeat="team in $ctrl.user.teams">
                                    <a class="dropdown-item" 
                                       href="#" 
                                       ng-click="$ctrl.switchTeam(team, $event)"
                                       ng-class="{'active': team.teamId === $ctrl.user.currentTeamId}">
                                        <i class="fas fa-users me-2"></i>{{team.teamName}}
                                    </a>
                                </li>
                                <li ng-if="$ctrl.user.isSuperAdmin && $ctrl.user.teams && $ctrl.user.teams.length > 0"><hr class="dropdown-divider"></li>
                                <li ng-if="$ctrl.user.isSuperAdmin">
                                    <a class="dropdown-item text-primary" href="#" ng-click="$ctrl.manageTeams($event)">
                                        <i class="fas fa-cog me-2"></i>Manage Teams
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!-- Single Team: Read-only Display -->
                        <span ng-if="!$ctrl.user.teams || $ctrl.user.teams.length <= 1" class="badge bg-secondary">
                            <i class="fas fa-users me-1"></i>{{$ctrl.user.currentTeamName || 'No Team'}}
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
    controller: function($rootScope, AuthService, $location, $timeout, ApiService, NotificationService) {
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
            
            // Listen for team changes
            var teamListener = $rootScope.$on('teamChanged', function(event, data) {
                ctrl.user = AuthService.getUser();
                // Reload current page data
                $rootScope.$broadcast('reloadData');
            });
            
            ctrl.$onDestroy = function() {
                routeListener();
                authListener();
                logoutListener();
                teamListener();
            };
        };
        
        ctrl.switchTeam = function(team, event) {
            event.preventDefault();
            console.log('Switching to team:', team.teamId, team.teamName);
            
            // Update user object immediately for UI feedback
            ctrl.user = AuthService.getUser();
            if (ctrl.user) {
                ctrl.user.currentTeamId = team.teamId;
                ctrl.user.currentTeamName = team.teamName;
            }
            
            // Set team in AuthService (this will broadcast teamChanged event)
            AuthService.setCurrentTeam(team.teamId, team.teamName);
            NotificationService.show('Switched to team: ' + team.teamName, 'success');
        };
        
        ctrl.switchToAllTeams = function(event) {
            event.preventDefault();
            console.log('Switching to All Teams view');
            
            // Update user object immediately for UI feedback
            ctrl.user = AuthService.getUser();
            if (ctrl.user) {
                ctrl.user.currentTeamId = null;
                ctrl.user.currentTeamName = 'All My Teams';
            }
            
            // Set team to null in AuthService (this will broadcast teamChanged event)
            AuthService.setCurrentTeam(null, 'All My Teams');
            NotificationService.show('Viewing all your teams', 'success');
        };
        
        ctrl.manageTeams = function(event) {
            event.preventDefault();
            $location.path('/teams');
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