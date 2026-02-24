app.service('AuthService', function($http, $q, $rootScope, $window, $location) {
    var self = this;
    var TOKEN_KEY = 'auth_token';
    var USER_KEY = 'user_data';

    // Get token from localStorage
    self.getToken = function() {
        return $window.localStorage.getItem(TOKEN_KEY);
    };

    // Get user data from localStorage
    self.getUser = function() {
        var userData = $window.localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    };

    // Check if user is authenticated
    self.isAuthenticated = function() {
        return !!self.getToken();
    };
    
    // Get user role (case-insensitive, trim spaces)
    self.getRole = function() {
        try {
            var user = self.getUser();
            if (!user || !user.role) return null;
            // Normalize: string, lowercase, trim to avoid trailing/leading space issues
            return String(user.role).toLowerCase().trim();
        } catch(e) {
            console.error('Error getting user role:', e);
            return null;
        }
    };
    
    // Role checking functions
    self.isAdmin = function() {
        var role = self.getRole();
        return role === 'admin';
    };

    self.isProjectManager = function() {
        var role = self.getRole();
        return role === 'project manager' || role === 'projectmanager';
    };
    
    self.isTeamLead = function() {
        var role = self.getRole();
        return role === 'team lead' || role === 'teamlead';
    };
    
    self.isSoftwareArchitecture = function() {
        var role = self.getRole();
        // Support multiple spellings/variants for this role
        return role === 'software architecture' ||
               role === 'softwarearchitect' ||
               role === 'softwarearchitecture' ||
               role === 'software architect' ||
               role === 'software architecturer';
    };
    
    self.isDeveloper = function() {
        var role = self.getRole();
        return role === 'developer' || role === 'developers' || role === 'intern developer';
    };
    
    self.isQAEngineer = function() {
        var role = self.getRole();
        return role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer';
    };
    
    self.isIntern = function() {
        var role = self.getRole();
        // Legacy plain 'Intern' role only
        return role === 'intern' || role === 'interns';
    };
    
    self.isViewOnly = function() {
        // Developers, QA Engineers and Interns have view-only access
        return self.isDeveloper() || self.isQAEngineer() || self.isIntern();
    };
    
    // Permission checking functions
    self.canAddEmployee = function() {
        // View-only roles cannot add employees
        if (self.isViewOnly()) return false;
        // Admin and Project Manager can add employees
        return self.isAdmin() || self.isProjectManager();
    };
    
    self.canAddControl = function() {
        // Developers, QA Engineers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // All other employees can add controls
        return true;
    };
    
    self.canEditEmployee = function() {
        // Developers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // Admin has full access, Team Lead and Software Architecture can edit
        // Project Manager has view-only access
        return self.isAdmin() || self.isTeamLead() || self.isSoftwareArchitecture();
    };
    
    self.canRegisterEmployee = function() {
        // View-only roles cannot register employees
        if (self.isViewOnly()) return false;
        // Admin and Project Manager can register employees
        return self.isAdmin() || self.isProjectManager();
    };
    
    self.canEditControl = function() {
        // Developers, QA Engineers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // Admin has full access, Team Lead and Software Architecture can edit
        // Project Manager has view-only access
        return self.isAdmin() || self.isTeamLead() || self.isSoftwareArchitecture();
    };
    
    self.canMarkProgress = function() {
        // Developers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // Admin has full access, Team Lead and Software Architecture can mark progress
        // Project Manager has view-only access
        return self.isAdmin() || self.isTeamLead() || self.isSoftwareArchitecture();
    };
    
    self.canDeleteControl = function() {
        // Developers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // Admin has full access, Team Lead and Software Architecture can delete
        // Project Manager cannot delete
        return self.isAdmin() || self.isTeamLead() || self.isSoftwareArchitecture();
    };
    
    self.canDeleteEmployee = function() {
        // Developers and Interns have view-only access
        if (self.isViewOnly()) return false;
        // Admin has full access, Team Lead and Software Architecture can delete
        // Project Manager cannot delete
        return self.isAdmin() || self.isTeamLead() || self.isSoftwareArchitecture();
    };
    
    // Super Admin and Team functions
    self.isSuperAdmin = function() {
        var user = self.getUser();
        return user && user.isSuperAdmin === true;
    };
    
    self.getTeamId = function() {
        var user = self.getUser();
        if (!user) return null;
        
        // IMPORTANT: Always return currentTeamId if it's set in localStorage
        // This allows team switching to work immediately without JWT token refresh
        if (user.currentTeamId !== null && user.currentTeamId !== undefined) {
            return user.currentTeamId;
        }
        
        // For Super Admin, if currentTeamId is null but user has teams, return first team's ID
        if (user.isSuperAdmin && user.teams && user.teams.length > 0) {
            return user.teams[0].teamId;
        }
        
        // For non-Super Admin users, if no currentTeamId but has teams, use first team
        // This ensures team switching works even if currentTeamId wasn't initially set
        if (user.teams && user.teams.length > 0) {
            return user.teams[0].teamId;
        }
        
        // Only return null if user has no teams at all
        return null;
    };
    
    self.getTeamName = function() {
        var user = self.getUser();
        if (!user) return null;
        
        // If currentTeamName is set, return it
        if (user.currentTeamName) {
            return user.currentTeamName;
        }
        
        // If currentTeamName is null but user has teams, return first team's name
        if (user.teams && user.teams.length > 0) {
            return user.teams[0].teamName;
        }
        
        return null;
    };
    
    self.getTeams = function() {
        var user = self.getUser();
        return user && user.teams ? user.teams : [];
    };
    
    // Set current team for Super Admin (when switching teams)
    self.setCurrentTeam = function(teamId, teamName) {
        var user = self.getUser();
        if (user) {
            console.log('Setting current team - teamId:', teamId, 'teamName:', teamName);
            
            user.currentTeamId = teamId;
            user.currentTeamName = teamName;
            $window.localStorage.setItem(USER_KEY, JSON.stringify(user));
            
            // Broadcast teamChanged immediately so UI updates right away
            // The API call will update the server-side, but we don't wait for it
            console.log('Broadcasting teamChanged event with teamId:', teamId, 'teamName:', teamName);
            $rootScope.$broadcast('teamChanged', { teamId: teamId, teamName: teamName });
            console.log('teamChanged event broadcast completed');
            
            // Call API to update server-side (async, don't block UI)
            if (teamId) {
                $http.post('/api/auth/switch-team/' + teamId).then(function(response) {
                    console.log('Team switched successfully on server:', teamId);
                    // Update user data if server returned updated info
                    if (response.data && response.data.currentTeamId !== undefined) {
                        user.currentTeamId = response.data.currentTeamId;
                        user.currentTeamName = response.data.currentTeamName;
                        $window.localStorage.setItem(USER_KEY, JSON.stringify(user));
                    }
                }).catch(function(error) {
                    console.error('Error switching team on server:', error);
                    // Don't revert the change - UI already updated
                    // User can manually refresh if needed
                });
            }
        } else {
            console.error('Cannot set team - user not found');
        }
    };

    // Login
    self.login = function(credentials) {
        return $http.post('/api/auth/login', credentials).then(function(response) {
            if (response.data && response.data.token) {
                // Store token and user data
                $window.localStorage.setItem(TOKEN_KEY, response.data.token);
                $window.localStorage.setItem(USER_KEY, JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                    currentTeamId: response.data.currentTeamId,
                    currentTeamName: response.data.currentTeamName,
                    isSuperAdmin: response.data.isSuperAdmin,
                    teams: response.data.teams || []
                }));
                
                // Broadcast login event
                $rootScope.$broadcast('userLoggedIn', response.data);
                
                return response.data;
            }
            return $q.reject('Invalid response from server');
        });
    };

    // Register
    self.register = function(userData) {
        return $http.post('/api/auth/register', userData).then(function(response) {
            if (response.data && response.data.token) {
                // Store token and user data
                $window.localStorage.setItem(TOKEN_KEY, response.data.token);
                $window.localStorage.setItem(USER_KEY, JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                    currentTeamId: response.data.currentTeamId,
                    currentTeamName: response.data.currentTeamName,
                    isSuperAdmin: response.data.isSuperAdmin,
                    teams: response.data.teams || []
                }));
                
                // Broadcast login event
                $rootScope.$broadcast('userLoggedIn', response.data);
                
                return response.data;
            }
            return $q.reject('Invalid response from server');
        });
    };

    // Logout
    self.logout = function() {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
        // Broadcast logout event - MainController will handle navigation via routing
        $rootScope.$broadcast('userLoggedOut');
    };

    // Validate token
    self.validateToken = function() {
        var token = self.getToken();
        if (!token) {
            return $q.reject('No token found');
        }

        return $http.post('/api/auth/validate', {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            return response.data;
        }).catch(function(error) {
            // Token is invalid, clear storage
            self.logout();
            return $q.reject(error);
        });
    };
});






