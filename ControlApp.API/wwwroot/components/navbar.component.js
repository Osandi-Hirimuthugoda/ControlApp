app.component('appNavbar', {
    template: `
    <nav class="navbar navbar-dark mb-4">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-network-wired"></i>
                <span class="d-none d-sm-inline"> Control Management System</span>
                <span class="d-inline d-sm-none"> CMS</span>
            </span>
            <div class="d-flex align-items-center text-white" style="gap: 0.75rem;">
                <div ng-if="$ctrl.isAuthenticated && !$ctrl.isLoginPage()" class="d-flex align-items-center" style="gap: 0.6rem;">

                    <!-- Desktop: username + role -->
                    <div class="d-none d-md-flex flex-column">
                        <span class="text-white" style="font-size:0.9rem;">
                            <i class="fas fa-user me-1"></i>{{$ctrl.user.username}}
                        </span>
                        <span class="badge bg-info mt-1" ng-if="$ctrl.user && $ctrl.user.role">
                            {{$ctrl.user.role}}
                        </span>
                    </div>

                    <!-- Mobile: avatar circle -->
                    <div class="d-flex d-md-none align-items-center justify-content-center rounded-circle"
                         style="width:34px;height:34px;background:rgba(255,255,255,0.2);font-weight:700;font-size:0.85rem;cursor:pointer;"
                         title="{{$ctrl.user.username}}">
                        {{$ctrl.user.username ? $ctrl.user.username.charAt(0).toUpperCase() : '?'}}
                    </div>
                    
                    <!-- Team Display/Switcher -->
                    <div class="d-flex flex-column" ng-if="$ctrl.user && ($ctrl.user.currentTeamName || $ctrl.user.teams.length > 0)">
                        <span class="text-white-50 small d-none d-md-block">Team:</span>
                        <div ng-if="$ctrl.user.teams && $ctrl.user.teams.length > 1" class="dropdown">
                            <button class="btn btn-sm btn-outline-warning dropdown-toggle" type="button" id="teamDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="font-size:0.78rem;padding:0.25rem 0.5rem;">
                                <i class="fas fa-users me-1"></i><span class="d-none d-sm-inline">{{$ctrl.user.currentTeamName || 'Teams'}}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="teamDropdown">
                                <li ng-if="!$ctrl.user.isSuperAdmin && $ctrl.user.teams && $ctrl.user.teams.length > 1">
                                    <a class="dropdown-item" href="#" ng-click="$ctrl.switchToAllTeams($event)" ng-class="{'active': !$ctrl.user.currentTeamId}">
                                        <i class="fas fa-layer-group me-2"></i>All My Teams
                                    </a>
                                </li>
                                <li ng-if="!$ctrl.user.isSuperAdmin && $ctrl.user.teams && $ctrl.user.teams.length > 1"><hr class="dropdown-divider"></li>
                                <li ng-repeat="team in $ctrl.user.teams">
                                    <a class="dropdown-item" href="#" ng-click="$ctrl.switchTeam(team, $event)" ng-class="{'active': team.teamId === $ctrl.user.currentTeamId}">
                                        <i class="fas fa-users me-2"></i>{{team.teamName}}
                                    </a>
                                </li>
                                <li ng-if="($ctrl.isSuperAdmin() || $ctrl.isAdmin()) && $ctrl.user.teams && $ctrl.user.teams.length > 0"><hr class="dropdown-divider"></li>
                                <li ng-if="$ctrl.isSuperAdmin() || $ctrl.isAdmin()">
                                    <a class="dropdown-item text-primary" href="#" ng-click="$ctrl.manageTeams($event)">
                                        <i class="fas fa-cog me-2"></i>Manage Teams
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <span ng-if="!$ctrl.user.teams || $ctrl.user.teams.length <= 1" class="badge bg-secondary" style="font-size:0.72rem;">
                            <i class="fas fa-users me-1"></i><span class="d-none d-sm-inline">{{$ctrl.user.currentTeamName || 'No Team'}}</span>
                        </span>
                    </div>
                    
                    <!-- Notification Bell -->
                    <div class="position-relative" ng-class="{'open': $ctrl.showNotifPanel}">
                        <button class="btn btn-outline-light btn-sm position-relative" type="button" ng-click="$ctrl.toggleNotifPanel($event)" title="Notifications">
                            <i class="fas fa-bell"></i>
                            <span ng-if="$ctrl.getTotalUnreadCount() > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
                                {{$ctrl.getTotalUnreadCount() > 99 ? '99+' : $ctrl.getTotalUnreadCount()}}
                            </span>
                        </button>
                        <div ng-if="$ctrl.showNotifPanel" class="shadow-lg bg-white rounded-3 border notif-panel" style="position: absolute; right: 0; top: 110%; width: 400px; max-height: 520px; z-index: 9999; overflow: hidden;" ng-click="$event.stopPropagation()">
                            <div class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <span class="fw-bold">Today's Notifications</span>
                                <button ng-if="$ctrl.notifications.length > 0" class="btn btn-sm btn-link text-decoration-none p-0" ng-click="$ctrl.clearAllNotifications()">
                                    Clear All
                                </button>
                            </div>
                            
                            <!-- Tabs -->
                            <div class="px-3 py-2 border-bottom">
                                <div class="btn-group w-100" role="group">
                                    <button type="button" class="btn btn-sm" ng-class="$ctrl.activeTab === 'notifications' ? 'btn-primary' : 'btn-outline-primary'" ng-click="$ctrl.activeTab = 'notifications'">
                                        <i class="fas fa-bell me-1"></i>Notifications
                                        <span ng-if="$ctrl.unreadCount > 0" class="badge bg-danger ms-1">{{$ctrl.unreadCount}}</span>
                                    </button>
                                    <button type="button" class="btn btn-sm" ng-class="$ctrl.activeTab === 'defects' ? 'btn-primary' : 'btn-outline-primary'" ng-click="$ctrl.switchToDefectsTab()">
                                        <i class="fas fa-bug me-1"></i>My Defects
                                        <span ng-if="$ctrl.myDefects.length > 0" class="badge bg-warning text-dark ms-1">{{$ctrl.myDefects.length}}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Notifications Tab Content -->
                            <div ng-if="$ctrl.activeTab === 'notifications'" style="max-height: 350px; overflow-y: auto;">
                                <!-- No Notifications -->
                                <div ng-if="$ctrl.notifications.length === 0" class="text-center py-4 text-muted">
                                    <i class="fas fa-bell-slash fa-2x mb-2"></i>
                                    <p class="mb-0 small">No notifications today</p>
                                </div>
                                
                                <!-- Notification Items -->
                                <div ng-repeat="notification in $ctrl.notifications | orderBy:'-timestamp' track by notification.id">
                                    <a class="dropdown-item py-3" href="#" ng-click="$ctrl.handleNotificationClick(notification, $event)" ng-class="{'bg-light': !notification.read}">
                                        <div class="d-flex align-items-start">
                                            <div class="me-2">
                                                <i class="fas" ng-class="{
                                                    'fa-bug text-danger': notification.type === 'defect',
                                                    'fa-flask text-warning': notification.type === 'testcase',
                                                    'fa-info-circle text-info': notification.type === 'info'
                                                }"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <p class="mb-1 small" ng-class="{'fw-bold': !notification.read}">{{notification.message}}</p>
                                                <small class="text-muted">{{$ctrl.getTimeAgo(notification.timestamp)}}</small>
                                            </div>
                                            <div ng-if="!notification.read" class="ms-2">
                                                <span class="badge bg-primary rounded-circle" style="width: 8px; height: 8px; padding: 0;"></span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Defects Tab Content -->
                            <div ng-if="$ctrl.activeTab === 'defects'" style="max-height: 350px; overflow-y: auto;">
                                <!-- Loading -->
                                <div ng-if="$ctrl.loadingDefects" class="text-center py-4">
                                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mb-0 small text-muted mt-2">Loading defects...</p>
                                </div>
                                
                                <!-- No Defects -->
                                <div ng-if="!$ctrl.loadingDefects && $ctrl.myDefects.length === 0" class="text-center py-4 text-muted">
                                    <i class="fas fa-check-circle fa-2x mb-2 text-success"></i>
                                    <p class="mb-0 small">No active defects assigned to you</p>
                                </div>
                                
                                <!-- Defect Items -->
                                <div ng-repeat="defect in $ctrl.myDefects | orderBy:'-reportedDate' track by defect.defectId">
                                    <a class="dropdown-item py-3" href="#" ng-click="$ctrl.viewDefect(defect, $event)">
                                        <div class="d-flex align-items-start">
                                            <div class="me-2">
                                                <i class="fas fa-bug" ng-style="{'color': $ctrl.getDefectSeverityColor(defect.severity)}"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="d-flex justify-content-between align-items-start mb-1">
                                                    <p class="mb-0 small fw-bold">{{defect.title}}</p>
                                                    <span class="badge rounded-pill ms-2" ng-class="$ctrl.getDefectStatusBadgeClass(defect.status)" style="font-size: 0.65rem;">
                                                        {{defect.status}}
                                                    </span>
                                                </div>
                                                <p class="mb-1 small text-muted" ng-if="defect.description">
                                                    {{defect.description.length > 60 ? (defect.description.substring(0, 60) + '...') : defect.description}}
                                                </p>
                                                <div class="d-flex gap-2 small text-muted">
                                                    <span class="badge" ng-style="{'background-color': $ctrl.getDefectSeverityColor(defect.severity), 'font-size': '0.65rem'}">
                                                        {{defect.severity}}
                                                    </span>
                                                    <span ng-if="defect.controlName">
                                                        <i class="fas fa-link me-1"></i>{{defect.controlName}}
                                                    </span>
                                                </div>
                                                <small class="text-muted">{{$ctrl.getTimeAgo(defect.reportedDate)}}</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.openProfile()" title="Profile Settings">
                        <i class="fas fa-cog me-1"></i><span class="d-none d-sm-inline">Profile</span>
                    </button>
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.logout()">
                        <i class="fas fa-sign-out-alt me-1"></i><span class="d-none d-sm-inline">Logout</span>
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
            
            ctrl.isAdmin = function() { return AuthService.isAdmin(); };
            ctrl.isSuperAdmin = function() { return AuthService.isSuperAdmin(); };
            
            // Initialize notifications
            ctrl.notifications = [];
            ctrl.unreadCount = 0;
            ctrl.activeTab = 'notifications';
            ctrl.myDefects = [];
            ctrl.loadingDefects = false;
            
            // Load notifications from localStorage
            ctrl.loadNotifications();
            
            // Check if current route is login page
            ctrl.isLoginPage = function() {
                return ctrl.currentPath === '/login' || ctrl.currentPath === '/' || ctrl.currentPath === '';
            };
            
            // Update authentication status and path on route changes
            var routeListener = $rootScope.$on('$routeChangeSuccess', function() {
                ctrl.isAuthenticated = AuthService.isAuthenticated();
                ctrl.user = AuthService.getUser();
                ctrl.currentPath = $location.path();
                // Reload notifications on every page change so count stays fresh
                ctrl.loadNotifications();
            });
            
            // Listen for authentication events
            var authListener = $rootScope.$on('userLoggedIn', function(event, userData) {
                ctrl.isAuthenticated = true;
                ctrl.user = AuthService.getUser();
                ctrl.currentPath = $location.path();
                // Reload notifications for this user
                ctrl.notifications = [];
                ctrl.unreadCount = 0;
                ctrl.loadNotifications();
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
            
            // Listen for SignalR notifications
            var defectListener = $rootScope.$on('defectAssigned', function(event, data) {
                ctrl.addNotification('New defect assigned: ' + data.title, 'defect', data);
                // Reload my defects list
                ctrl.loadMyDefects();
                $timeout(function() {
                    if (!$rootScope.$$phase) {
                        ctrl.$apply();
                    }
                });
            });
            
            var defectStatusListener = $rootScope.$on('defectStatusChanged', function(event, data) {
                var msg = 'Defect "' + data.title + '" status changed to: ' + data.status;
                if (data.controlId && ApiService.data && ApiService.data.allControls) {
                    var control = ApiService.data.allControls.find(function(c) {
                        return c.controlId === data.controlId || c.controlId === parseInt(data.controlId);
                    });
                    if (control) {
                        msg += ' | Developer: ' + (control.statusName || '-') + ' ' + (control.progress || 0) + '%';
                    }
                }
                ctrl.addNotification(msg, 'defect', data);
                ctrl.loadMyDefects();
                $timeout(function() {
                    if (!$rootScope.$phase) { ctrl.$apply(); }
                });
            });

            var testCaseListener = $rootScope.$on('testCaseFailed', function(event, data) {
                ctrl.addNotification('Test case failed: ' + data.title, 'testcase', data);
                $timeout(function() {
                    if (!$rootScope.$$phase) {
                        ctrl.$apply();
                    }
                });
            });
            
            
            var qaAssignedListener = $rootScope.$on('qaAssigned', function(event, data) {
                ctrl.addNotification('You have been assigned as QA Engineer for: ' + data.description, 'info', data);
                $timeout(function() {
                    if (!$rootScope.$phase) { ctrl.$apply(); }
                });
            });
            ctrl.$onDestroy = function() {
                routeListener();
                authListener();
                logoutListener();
                teamListener();
                defectListener();
                defectStatusListener();
                testCaseListener();
                qaAssignedListener();
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

        ctrl.toggleNotifPanel = function($event) {
            $event.stopPropagation();
            ctrl.showNotifPanel = !ctrl.showNotifPanel;
            if (ctrl.showNotifPanel && ctrl.activeTab === 'defects' && ctrl.myDefects.length === 0) {
                ctrl.loadMyDefects();
            }
        };

        // Close panel when clicking outside
        document.addEventListener('click', function() {
            if (ctrl.showNotifPanel) {
                ctrl.showNotifPanel = false;
                if (!$rootScope.$$phase) { $rootScope.$apply(); }
            }
        });
        
        ctrl.openProfile = function() {
            $location.path('/profile');
        };
        
        // Test notification function (for testing purposes)
        ctrl.testNotification = function() {
            ctrl.addNotification('This is a test notification', 'info', {});
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
        
        // Notification Management
        ctrl.isToday = function(timestamp) {
            if (!timestamp) return false;
            var d = new Date(timestamp);
            var now = new Date();
            return d.getFullYear() === now.getFullYear() &&
                   d.getMonth() === now.getMonth() &&
                   d.getDate() === now.getDate();
        };

        ctrl.getNotifKey = function() {
            var user = AuthService.getUser();
            return 'notifications_' + (user && user.username ? user.username : 'guest');
        };

        ctrl.loadNotifications = function() {
            var stored = localStorage.getItem(ctrl.getNotifKey());
            if (stored) {
                try {
                    var all = JSON.parse(stored);
                    // Only keep today's notifications
                    ctrl.notifications = all.filter(function(n) { return ctrl.isToday(n.timestamp); });
                    ctrl.updateUnreadCount();
                } catch (e) {
                    ctrl.notifications = [];
                    ctrl.unreadCount = 0;
                }
            }
        };
        
        ctrl.saveNotifications = function() {
            // Load existing, merge, keep last 100, save all
            var stored = localStorage.getItem('notifications');
            var all = [];
            try { all = stored ? JSON.parse(stored) : []; } catch(e) { all = []; }
            // Replace with current (already filtered to today on load, new ones added fresh)
            localStorage.setItem(ctrl.getNotifKey(), JSON.stringify(ctrl.notifications));
            ctrl.updateUnreadCount();
        };
        
        ctrl.updateUnreadCount = function() {
            ctrl.unreadCount = ctrl.notifications.filter(function(n) { return !n.read; }).length;
        };
        
        ctrl.addNotification = function(message, type, data) {
            var notification = {
                id: Date.now(),
                message: message,
                type: type,
                timestamp: new Date().toISOString(),
                read: false,
                data: data || {}
            };
            
            ctrl.notifications.unshift(notification);
            
            // Keep only last 50 notifications
            if (ctrl.notifications.length > 50) {
                ctrl.notifications = ctrl.notifications.slice(0, 50);
            }
            
            ctrl.saveNotifications();
        };
        
        ctrl.handleNotificationClick = function(notification, event) {
            event.preventDefault();
            
            // Mark as read
            notification.read = true;
            ctrl.saveNotifications();
            
            // Navigate based on notification type
            if (notification.type === 'defect' && notification.data.defectId) {
                // Store defect ID to highlight after navigation
                sessionStorage.setItem('highlightDefectId', notification.data.defectId);
                
                // If we have controlId, use it to open the specific control's defects
                if (notification.data.controlId) {
                    sessionStorage.setItem('openDefectsForControl', notification.data.controlId);
                }
                
                // Navigate to controls page (defects are shown there)
                $location.path('/controls');
                
                // Broadcast event to open defect details
                $timeout(function() {
                    $rootScope.$broadcast('openDefectFromNotification', {
                        defectId: notification.data.defectId,
                        controlId: notification.data.controlId
                    });
                }, 500);
            } else if (notification.type === 'testcase' && notification.data.testCaseId) {
                // Navigate to QA test cases page
                $location.path('/qa-test-cases');
            }
        };
        
        ctrl.clearAllNotifications = function() {
            ctrl.notifications = [];
            ctrl.unreadCount = 0;
            localStorage.removeItem(ctrl.getNotifKey());
        };
        
        ctrl.getTimeAgo = function(timestamp) {
            if (!timestamp) return '';
            
            var now = new Date();
            var time = new Date(timestamp);
            var diff = Math.floor((now - time) / 1000); // seconds
            
            if (diff < 60) return 'Just now';
            if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
            if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
            if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
            return time.toLocaleDateString();
        };
        
        // Defects Management
        ctrl.switchToDefectsTab = function() {
            ctrl.activeTab = 'defects';
            if (ctrl.myDefects.length === 0) {
                ctrl.loadMyDefects();
            }
        };
        
        ctrl.loadMyDefects = function() {
            ctrl.loadingDefects = true;
            var teamId = AuthService.getTeamId();
            var user = AuthService.getUser();
            
            if (!user || !user.employeeId) {
                ctrl.loadingDefects = false;
                return;
            }
            
            ApiService.loadDefects(teamId).then(function(defects) {
                // Filter defects assigned to current user that are not closed
                ctrl.myDefects = defects.filter(function(d) {
                    return d.assignedToEmployeeId === user.employeeId &&
                           d.status !== 'Closed' && d.status !== 'Duplicate';
                });
                ctrl.loadingDefects = false;
            }).catch(function(error) {
                console.error('Error loading defects:', error);
                ctrl.loadingDefects = false;
            });
        };
        
        ctrl.getTotalUnreadCount = function() {
            return ctrl.unreadCount + ctrl.myDefects.length;
        };
        
        ctrl.getDefectSeverityColor = function(severity) {
            switch(severity) {
                case 'Critical': return '#dc2626';
                case 'High': return '#f59e0b';
                case 'Medium': return '#3b82f6';
                case 'Low': return '#10b981';
                default: return '#6b7280';
            }
        };
        
        ctrl.getDefectStatusBadgeClass = function(status) {
            switch(status) {
                case 'Open': return 'bg-danger';
                case 'In Dev': return 'bg-warning text-dark';
                case 'Fixed': return 'bg-success';
                case 'Re-Open': return 'bg-danger';
                case 'Duplicate': return 'bg-dark text-white';
                case 'Closed': return 'bg-secondary';
                default: return 'bg-secondary';
            }
        };
        
        ctrl.viewDefect = function(defect, event) {
            event.preventDefault();
            
            // Store defect ID to highlight after navigation
            sessionStorage.setItem('highlightDefectId', defect.defectId);
            sessionStorage.setItem('openDefectsForControl', defect.controlId);
            
            // Navigate to controls page where defects can be viewed
            $location.path('/controls');
            
            // Broadcast event to open defect details
            $timeout(function() {
                $rootScope.$broadcast('openDefectFromNotification', {
                    defectId: defect.defectId,
                    controlId: defect.controlId
                });
            }, 500);
        };
    }
});


