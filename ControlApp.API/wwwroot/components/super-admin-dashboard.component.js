app.component('superAdminDashboard', {
    template: `
    <div class="container-fluid mt-4">
        <div class="row mb-4">
            <div class="col-12">
                <h2><i class="fas fa-crown me-2 text-warning"></i>Super Admin Dashboard</h2>
                <p class="text-muted">Manage teams, assign members, and oversee all operations</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-users me-2"></i>Total Teams</h5>
                        <h2>{{$ctrl.stats.totalTeams}}</h2>
                        <small>{{$ctrl.stats.activeTeams}} Active</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-user-friends me-2"></i>Total Employees</h5>
                        <h2>{{$ctrl.stats.totalEmployees}}</h2>
                        <small>Across all teams</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-tasks me-2"></i>Total Controls</h5>
                        <h2>{{$ctrl.stats.totalControls}}</h2>
                        <small>All teams combined</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-list me-2"></i>Control Types</h5>
                        <h2>{{$ctrl.stats.totalControlTypes}}</h2>
                        <small>Active types</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-bolt me-2"></i>Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-primary me-2" ng-click="$ctrl.createTeam()">
                            <i class="fas fa-plus me-1"></i>Create New Team
                        </button>
                        <button class="btn btn-success me-2" ng-click="$ctrl.goToTeamManagement()">
                            <i class="fas fa-users-cog me-1"></i>Manage Teams
                        </button>
                        <button class="btn btn-info me-2" ng-click="$ctrl.assignEmployees()">
                            <i class="fas fa-user-plus me-1"></i>Assign Employees to Teams
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teams Overview -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0"><i class="fas fa-users me-2"></i>Teams Overview</h5>
                        <button class="btn btn-sm btn-outline-primary" ng-click="$ctrl.loadData()">
                            <i class="fas fa-sync-alt me-1"></i>Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div ng-if="$ctrl.loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div ng-if="!$ctrl.loading" class="row">
                            <div class="col-md-4 mb-3" ng-repeat="team in $ctrl.teams">
                                <div class="card h-100 team-card" 
                                     ng-class="team.isActive ? 'border-success' : 'border-secondary'"
                                     style="cursor: pointer; transition: all 0.3s;"
                                     ng-mouseenter="$event.currentTarget.style.transform='translateY(-5px)'; $event.currentTarget.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
                                     ng-mouseleave="$event.currentTarget.style.transform='translateY(0)'; $event.currentTarget.style.boxShadow=''"
                                     ng-click="$ctrl.viewTeamControls(team)">
                                    <div class="card-header" ng-class="team.isActive ? 'bg-success text-white' : 'bg-secondary text-white'">
                                        <h6 class="mb-0">
                                            <i class="fas fa-users me-2"></i>{{team.teamName}}
                                            <span class="badge bg-light text-dark float-end">{{team.teamCode}}</span>
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted small">{{team.description || 'No description'}}</p>
                                        <hr>
                                        
                                        <!-- Team Leadership -->
                                        <div class="mb-3">
                                            <h6 class="text-primary mb-2"><i class="fas fa-user-tie me-1"></i>Leadership</h6>
                                            <div class="small mb-1">
                                                <strong>Architect:</strong> 
                                                <span ng-if="team.architectName" class="badge bg-info">{{team.architectName}}</span>
                                                <span ng-if="!team.architectName" class="text-muted">Not Assigned</span>
                                            </div>
                                            <div class="small mb-1">
                                                <strong>Project Manager:</strong> 
                                                <span ng-if="team.projectManagerName" class="badge bg-warning text-dark">{{team.projectManagerName}}</span>
                                                <span ng-if="!team.projectManagerName" class="text-muted">Not Assigned</span>
                                            </div>
                                            <div class="small">
                                                <strong>Team Lead:</strong> 
                                                <span ng-if="team.teamLeadName" class="badge bg-primary">{{team.teamLeadName}}</span>
                                                <span ng-if="!team.teamLeadName" class="text-muted">Not Assigned</span>
                                            </div>
                                        </div>
                                        
                                        <hr>
                                        
                                        <!-- Team Stats -->
                                        <div class="d-flex justify-content-between mb-2">
                                            <span><i class="fas fa-user-friends me-1"></i>Employees:</span>
                                            <strong>{{$ctrl.getTeamEmployeeCount(team.teamId)}}</strong>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span><i class="fas fa-tasks me-1"></i>Controls:</span>
                                            <strong>{{$ctrl.getTeamControlCount(team.teamId)}}</strong>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span><i class="fas fa-list me-1"></i>Control Types:</span>
                                            <strong>{{$ctrl.getTeamControlTypeCount(team.teamId)}}</strong>
                                        </div>
                                    </div>
                                    <div class="card-footer" ng-click="$event.stopPropagation()">
                                        <button class="btn btn-sm btn-primary me-1" ng-click="$ctrl.viewTeamControls(team)">
                                            <i class="fas fa-tasks me-1"></i>View Controls
                                        </button>
                                        <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.manageTeamMembers(team)">
                                            <i class="fas fa-users-cog me-1"></i>Manage Members
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary" ng-click="$ctrl.editTeam(team)">
                                            <i class="fas fa-edit me-1"></i>Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, AuthService, $location, $rootScope) {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            // Check if user is Super Admin
            if (!AuthService.isSuperAdmin()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'Super Admin only'
                });
                $location.path('/dashboard');
                return;
            }
            
            ctrl.teams = [];
            ctrl.employees = [];
            ctrl.controls = [];
            ctrl.controlTypes = [];
            ctrl.loading = true;
            ctrl.stats = {
                totalTeams: 0,
                activeTeams: 0,
                totalEmployees: 0,
                totalControls: 0,
                totalControlTypes: 0
            };
            
            ctrl.loadData();
        };
        
        ctrl.loadData = function() {
            ctrl.loading = true;
            
            // Load dashboard stats
            ApiService.get('/api/teams/dashboard-stats').then(function(response) {
                var dashboardStats = response.data;
                
                // Update stats
                ctrl.stats.totalTeams = dashboardStats.totalTeams;
                ctrl.stats.activeTeams = dashboardStats.totalTeams; // Assuming all are active
                ctrl.stats.totalEmployees = dashboardStats.totalEmployees;
                ctrl.stats.totalControls = dashboardStats.totalControls;
                ctrl.stats.totalControlTypes = 0; // Will be calculated from teams
                
                // Store team stats for detailed view
                ctrl.teamStats = dashboardStats.teamStats;
                
                // Load all data for detailed views
                return Promise.all([
                    ApiService.getTeams(),
                    ApiService.loadEmployees(),
                    ApiService.loadAllControls(),
                    ApiService.loadControlTypes()
                ]);
            }).then(function(results) {
                ctrl.teams = results[0].data;
                ctrl.employees = ApiService.data.employees;
                ctrl.controls = ApiService.data.allControls;
                ctrl.controlTypes = ApiService.data.controlTypes;
                
                ctrl.stats.totalControlTypes = ctrl.controlTypes.length;
                
                ctrl.loading = false;
                $rootScope.$apply();
            }).catch(function(error) {
                console.error('Error loading data:', error);
                ctrl.loading = false;
                $rootScope.$apply();
            });
        };
        
        ctrl.getTeamEmployeeCount = function(teamId) {
            return ctrl.employees.filter(function(e) { return e.teamId === teamId; }).length;
        };
        
        ctrl.getTeamControlCount = function(teamId) {
            return ctrl.controls.filter(function(c) { return c.teamId === teamId; }).length;
        };
        
        ctrl.getTeamControlTypeCount = function(teamId) {
            return ctrl.controlTypes.filter(function(ct) { return ct.teamId === teamId; }).length;
        };
        
        ctrl.createTeam = function() {
            $location.path('/teams');
        };
        
        ctrl.goToTeamManagement = function() {
            $location.path('/teams');
        };
        
        ctrl.assignEmployees = function() {
            $location.path('/controls/employees');
        };
        
        ctrl.viewTeamControls = function(team) {
            // Set the team as current team
            AuthService.setCurrentTeam(team.teamId, team.teamName);
            // Navigate to controls page
            $location.path('/controls');
        };
        
        ctrl.manageTeamMembers = function(team) {
            // Get team employees
            var teamEmployees = ctrl.employees.filter(function(e) { return e.teamId === team.teamId; });
            var unassignedEmployees = ctrl.employees.filter(function(e) { return !e.teamId; });
            
            // Build current members list
            var membersHtml = '';
            if (teamEmployees.length > 0) {
                membersHtml = '<div class="list-group mb-3">';
                teamEmployees.forEach(function(emp) {
                    membersHtml += '<div class="list-group-item d-flex justify-content-between align-items-center">';
                    membersHtml += '<div>';
                    membersHtml += '<strong>' + emp.employeeName + '</strong><br>';
                    membersHtml += '<small class="text-muted">' + emp.role + '</small>';
                    membersHtml += '</div>';
                    membersHtml += '<button class="btn btn-sm btn-outline-danger" onclick="removeFromTeam(' + emp.id + ')">';
                    membersHtml += '<i class="fas fa-times"></i> Remove';
                    membersHtml += '</button>';
                    membersHtml += '</div>';
                });
                membersHtml += '</div>';
            } else {
                membersHtml = '<p class="text-muted">No members assigned yet.</p>';
            }
            
            // Build unassigned employees dropdown
            var unassignedOptions = '';
            if (unassignedEmployees.length > 0) {
                unassignedEmployees.forEach(function(emp) {
                    unassignedOptions += '<option value="' + emp.id + '">' + emp.employeeName + ' (' + emp.role + ')</option>';
                });
            }
            
            Swal.fire({
                title: '<i class="fas fa-users-cog text-primary"></i> Manage Team Members',
                html: `
                    <div class="text-start">
                        <h6 class="text-primary mb-3">Team: ${team.teamName}</h6>
                        
                        <div class="mb-4">
                            <h6 class="text-secondary mb-2">Current Members (${teamEmployees.length})</h6>
                            ${membersHtml}
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="text-secondary mb-2">Add New Member</h6>
                            ${unassignedEmployees.length > 0 ? `
                                <div class="input-group">
                                    <select id="newMemberId" class="form-select">
                                        <option value="">-- Select Employee --</option>
                                        ${unassignedOptions}
                                    </select>
                                    <button class="btn btn-primary" onclick="addToTeam(${team.teamId})">
                                        <i class="fas fa-plus me-1"></i>Add
                                    </button>
                                </div>
                            ` : '<p class="text-muted">All employees are already assigned to teams.</p>'}
                        </div>
                        
                        <div class="alert alert-info small mt-3">
                            <i class="fas fa-info-circle me-1"></i>
                            You can also assign employees from the Employee List page by editing each employee.
                        </div>
                    </div>
                `,
                width: '700px',
                showCancelButton: true,
                confirmButtonText: 'Done',
                cancelButtonText: 'Go to Employee List',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                didOpen: function() {
                    // Add event handlers
                    window.addToTeam = function(teamId) {
                        var employeeId = document.getElementById('newMemberId').value;
                        if (!employeeId) {
                            Swal.showValidationMessage('Please select an employee');
                            return;
                        }
                        
                        // Update employee with team
                        var employee = ctrl.employees.find(function(e) { return e.id == employeeId; });
                        if (employee) {
                            ApiService.updateEmployee(employeeId, {
                                employeeName: employee.employeeName,
                                typeId: employee.typeId,
                                description: employee.description,
                                teamId: teamId
                            }).then(function() {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Employee added to team',
                                    timer: 1500
                                }).then(function() {
                                    ctrl.loadData();
                                    ctrl.manageTeamMembers(team);
                                });
                            }).catch(function(error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Failed to add employee to team'
                                });
                            });
                        }
                    };
                    
                    window.removeFromTeam = function(employeeId) {
                        Swal.fire({
                            title: 'Remove from team?',
                            text: 'This employee will be unassigned from the team.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Yes, Remove',
                            cancelButtonText: 'Cancel'
                        }).then(function(result) {
                            if (result.isConfirmed) {
                                var employee = ctrl.employees.find(function(e) { return e.id == employeeId; });
                                if (employee) {
                                    ApiService.updateEmployee(employeeId, {
                                        employeeName: employee.employeeName,
                                        typeId: employee.typeId,
                                        description: employee.description,
                                        teamId: null
                                    }).then(function() {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Success',
                                            text: 'Employee removed from team',
                                            timer: 1500
                                        }).then(function() {
                                            ctrl.loadData();
                                            ctrl.manageTeamMembers(team);
                                        });
                                    }).catch(function(error) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Failed to remove employee from team'
                                        });
                                    });
                                }
                            }
                        });
                    };
                }
            }).then(function(result) {
                if (!result.isConfirmed) {
                    // User clicked "Go to Employee List"
                    AuthService.setCurrentTeam(team.teamId, team.teamName);
                    $location.path('/controls/employees');
                }
            });
        };
        
        ctrl.viewTeamDetails = function(team) {
            // Get team employees
            var teamEmployees = ctrl.employees.filter(function(e) { return e.teamId === team.teamId; });
            var teamControls = ctrl.controls.filter(function(c) { return c.teamId === team.teamId; });
            var teamControlTypes = ctrl.controlTypes.filter(function(ct) { return ct.teamId === team.teamId; });
            
            // Group employees by role
            var employeesByRole = {};
            teamEmployees.forEach(function(emp) {
                var role = emp.role || 'Unassigned';
                if (!employeesByRole[role]) {
                    employeesByRole[role] = [];
                }
                employeesByRole[role].push(emp.employeeName);
            });
            
            // Build employee list HTML
            var employeeListHtml = '';
            Object.keys(employeesByRole).forEach(function(role) {
                employeeListHtml += '<div class="mb-2">';
                employeeListHtml += '<strong class="text-primary">' + role + ':</strong><br>';
                employeeListHtml += '<ul class="mb-0">';
                employeesByRole[role].forEach(function(name) {
                    employeeListHtml += '<li>' + name + '</li>';
                });
                employeeListHtml += '</ul></div>';
            });
            
            if (teamEmployees.length === 0) {
                employeeListHtml = '<p class="text-muted">No employees assigned to this team yet.</p>';
            }
            
            // Build controls list HTML
            var controlsListHtml = '';
            if (teamControls.length > 0) {
                controlsListHtml = '<ul class="mb-0">';
                teamControls.slice(0, 10).forEach(function(control) {
                    controlsListHtml += '<li>' + (control.description || 'Untitled Control') + 
                        ' <span class="badge bg-secondary">' + (control.statusName || 'No Status') + '</span></li>';
                });
                controlsListHtml += '</ul>';
                if (teamControls.length > 10) {
                    controlsListHtml += '<p class="text-muted small mt-2">... and ' + (teamControls.length - 10) + ' more</p>';
                }
            } else {
                controlsListHtml = '<p class="text-muted">No controls assigned to this team yet.</p>';
            }
            
            Swal.fire({
                title: '<i class="fas fa-users text-primary"></i> ' + team.teamName,
                html: `
                    <div class="text-start">
                        <div class="mb-3">
                            <span class="badge bg-secondary">${team.teamCode}</span>
                            <span class="badge ${team.isActive ? 'bg-success' : 'bg-danger'} ms-2">
                                ${team.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        <div class="mb-3">
                            <h6 class="text-primary"><i class="fas fa-info-circle me-1"></i>Description</h6>
                            <p class="text-muted">${team.description || 'No description provided'}</p>
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="text-primary"><i class="fas fa-user-tie me-1"></i>Leadership</h6>
                            <div class="row">
                                <div class="col-md-4 mb-2">
                                    <small class="text-muted">Architect:</small><br>
                                    <strong>${team.architectName || '<span class="text-muted">Not Assigned</span>'}</strong>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <small class="text-muted">Project Manager:</small><br>
                                    <strong>${team.projectManagerName || '<span class="text-muted">Not Assigned</span>'}</strong>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <small class="text-muted">Team Lead:</small><br>
                                    <strong>${team.teamLeadName || '<span class="text-muted">Not Assigned</span>'}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="text-primary"><i class="fas fa-chart-bar me-1"></i>Statistics</h6>
                            <div class="row text-center">
                                <div class="col-4">
                                    <div class="card bg-light">
                                        <div class="card-body py-2">
                                            <h4 class="mb-0">${teamEmployees.length}</h4>
                                            <small class="text-muted">Employees</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="card bg-light">
                                        <div class="card-body py-2">
                                            <h4 class="mb-0">${teamControls.length}</h4>
                                            <small class="text-muted">Controls</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="card bg-light">
                                        <div class="card-body py-2">
                                            <h4 class="mb-0">${teamControlTypes.length}</h4>
                                            <small class="text-muted">Control Types</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="text-primary"><i class="fas fa-users me-1"></i>Team Members (${teamEmployees.length})</h6>
                            ${employeeListHtml}
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="text-primary"><i class="fas fa-tasks me-1"></i>Recent Controls (${teamControls.length})</h6>
                            ${controlsListHtml}
                        </div>
                    </div>
                `,
                width: '800px',
                showCancelButton: true,
                confirmButtonText: '<i class="fas fa-users-cog me-1"></i>Manage Members',
                cancelButtonText: 'Close',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d'
            }).then(function(result) {
                if (result.isConfirmed) {
                    ctrl.manageTeamMembers(team);
                }
            });
        };
        
        ctrl.editTeam = function(team) {
            $location.path('/teams');
        };
    }
});
