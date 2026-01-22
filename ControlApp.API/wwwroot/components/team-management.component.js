app.component('teamManagement', {
    template: `
    <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1"><i class="fas fa-users-cog me-2 text-primary"></i>Team Management</h4>
                <p class="text-muted mb-0">Create, edit and manage teams · Assign employees</p>
            </div>
            <button class="btn btn-outline-secondary rounded-pill px-3" ng-click="$ctrl.goBack()">
                <i class="fas fa-arrow-left me-2"></i>Back to Overview
            </button>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <a class="nav-link fw-bold" ng-class="{'active': $ctrl.activeTab === 'teams'}" ng-click="$ctrl.activeTab = 'teams'; $ctrl.cancelForm()" style="cursor:pointer;">
                    <i class="fas fa-users me-2"></i>Teams
                    <span class="badge bg-primary ms-1">{{$ctrl.teams.length}}</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold" ng-class="{'active': $ctrl.activeTab === 'create'}" ng-click="$ctrl.activeTab = 'create'; $ctrl.editingTeam = null; $ctrl.teamForm = {teamName:'',teamCode:'',description:''}" style="cursor:pointer;">
                    <i class="fas fa-plus me-2"></i>{{$ctrl.editingTeam ? 'Edit Team' : 'Create New Team'}}
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-bold" ng-class="{'active': $ctrl.activeTab === 'assign'}" ng-click="$ctrl.activeTab = 'assign'" style="cursor:pointer;">
                    <i class="fas fa-user-plus me-2"></i>Assign Employees
                    <span class="badge bg-secondary ms-1">{{$ctrl.employees.length}}</span>
                </a>
            </li>
        </ul>

        <div ng-if="$ctrl.loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <!-- TEAMS TAB -->
        <div ng-if="!$ctrl.loading && $ctrl.activeTab === 'teams'">
            <div class="row g-3">
                <div ng-repeat="team in $ctrl.teams track by team.teamId" class="col-md-6 col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header border-0 py-3 px-4 rounded-top-4 d-flex justify-content-between align-items-center"
                             ng-style="{'background': $ctrl.teamColors[$index % $ctrl.teamColors.length]}">
                            <div>
                                <h6 class="fw-bold text-white mb-0">{{team.teamName}}</h6>
                                <small class="text-white opacity-75">{{team.teamCode}}</small>
                            </div>
                            <span class="badge rounded-pill" style="background:rgba(255,255,255,0.2);color:white;font-size:0.7rem;">
                                {{team.isActive ? 'Active' : 'Inactive'}}
                            </span>
                        </div>
                        <div class="card-body p-3">
                            <p class="text-muted small mb-3">{{team.description || 'No description'}}</p>
                            <div class="row g-2 text-center mb-3">
                                <div class="col-4">
                                    <div class="fw-bold" style="font-size:1.2rem;">{{$ctrl.getTeamEmployeeCount(team.teamId)}}</div>
                                    <div class="text-muted" style="font-size:0.7rem;">Members</div>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold" style="font-size:1.2rem;">{{$ctrl.getTeamControlCount(team.teamId)}}</div>
                                    <div class="text-muted" style="font-size:0.7rem;">Controls</div>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold" style="font-size:1.2rem;">{{$ctrl.getTeamAvgProgress(team.teamId)}}<span style="font-size:0.75rem;">%</span></div>
                                    <div class="text-muted" style="font-size:0.7rem;">Progress</div>
                                </div>
                            </div>
                            <!-- Members list -->
                            <div class="mb-3" style="max-height:120px;overflow-y:auto;">
                                <div ng-repeat="emp in $ctrl.getTeamEmployees(team.teamId) track by emp.id"
                                     class="d-flex align-items-center gap-2 py-1 border-bottom" style="border-color:#f1f5f9 !important;font-size:0.78rem;">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                                         style="width:24px;height:24px;font-size:0.65rem;background:#6366f1;">
                                        {{emp.employeeName.charAt(0)}}
                                    </div>
                                    <span class="text-dark flex-grow-1">{{emp.employeeName}}</span>
                                    <span class="badge rounded-pill" style="font-size:0.6rem;background:#eef2ff;color:#4f46e5;">{{emp.role}}</span>
                                </div>
                                <div ng-if="$ctrl.getTeamEmployees(team.teamId).length === 0" class="text-muted small py-1">No members assigned</div>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary flex-grow-1 rounded-pill" ng-click="$ctrl.viewControls(team)">
                                    <i class="fas fa-tasks me-1"></i>Controls
                                </button>
                                <button class="btn btn-sm btn-outline-warning rounded-pill px-2" ng-click="$ctrl.editTeam(team)" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger rounded-pill px-2" ng-click="$ctrl.deleteTeam(team)" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div ng-if="$ctrl.teams.length === 0" class="col-12 text-center py-5 text-muted">
                    <i class="fas fa-users fa-3x opacity-25 mb-3"></i>
                    <p>No teams yet. <a ng-click="$ctrl.activeTab='create'" style="cursor:pointer;" class="text-primary">Create your first team.</a></p>
                </div>
            </div>
        </div>

        <!-- CREATE / EDIT TEAM TAB -->
        <div ng-if="!$ctrl.loading && $ctrl.activeTab === 'create'">
            <div class="card border-0 shadow-sm rounded-4" style="max-width:600px;">
                <div class="card-header border-0 py-3 px-4 rounded-top-4" style="background:linear-gradient(135deg,#6366f1,#4f46e5);">
                    <h6 class="fw-bold text-white mb-0">
                        <i class="fas fa-{{$ctrl.editingTeam ? 'edit' : 'plus'}} me-2"></i>
                        {{$ctrl.editingTeam ? 'Edit ' + $ctrl.editingTeam.teamName : 'Create New Team'}}
                    </h6>
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Team Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" ng-model="$ctrl.teamForm.teamName" placeholder="e.g. Team Alpha">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Team Code <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" ng-model="$ctrl.teamForm.teamCode" placeholder="e.g. ALPHA" style="text-transform:uppercase;">
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-bold small">Description</label>
                        <textarea class="form-control" ng-model="$ctrl.teamForm.description" rows="2" placeholder="What does this team work on?"></textarea>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary rounded-pill px-4 fw-bold" ng-click="$ctrl.saveTeam()" ng-disabled="$ctrl.saving">
                            <i class="fas fa-save me-2"></i>{{$ctrl.saving ? 'Saving...' : (ctrl.editingTeam ? 'Update Team' : 'Create Team')}}
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill px-4" ng-click="$ctrl.cancelForm()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ASSIGN EMPLOYEES TAB -->
        <div ng-if="!$ctrl.loading && $ctrl.activeTab === 'assign'">
            <div class="row g-3">
                <!-- Unassigned employees -->
                <div class="col-md-5">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header border-0 py-3 px-4 rounded-top-4" style="background:linear-gradient(135deg,#94a3b8,#64748b);">
                            <h6 class="fw-bold text-white mb-0"><i class="fas fa-user-slash me-2"></i>Unassigned
                                <span class="badge ms-2" style="background:rgba(255,255,255,0.2);">{{$ctrl.getUnassigned().length}}</span>
                            </h6>
                        </div>
                        <div class="card-body p-3" style="max-height:400px;overflow-y:auto;">
                            <div ng-if="$ctrl.getUnassigned().length === 0" class="text-center py-4 text-muted small">All employees assigned</div>
                            <div ng-repeat="emp in $ctrl.getUnassigned() track by emp.id"
                                 class="d-flex align-items-center gap-2 p-2 mb-1 rounded-3 border"
                                 style="background:#f8fafc;">
                                <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                     style="width:32px;height:32px;font-size:0.75rem;background:#94a3b8;">
                                    {{emp.employeeName.charAt(0)}}
                                </div>
                                <div class="flex-grow-1">
                                    <div class="fw-semibold small">{{emp.employeeName}}</div>
                                    <div class="text-muted" style="font-size:0.68rem;">{{emp.role}}</div>
                                </div>
                                <select class="form-select form-select-sm" style="width:120px;" ng-model="$ctrl.assignTarget[emp.id]">
                                    <option value="">Team...</option>
                                    <option ng-repeat="t in $ctrl.teams" value="{{t.teamId}}">{{t.teamName}}</option>
                                </select>
                                <button class="btn btn-sm btn-success rounded-pill px-2" ng-click="$ctrl.assignEmployee(emp)" ng-disabled="!$ctrl.assignTarget[emp.id]">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Assigned employees by team -->
                <div class="col-md-7">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header border-0 py-3 px-4 rounded-top-4" style="background:linear-gradient(135deg,#10b981,#059669);">
                            <h6 class="fw-bold text-white mb-0"><i class="fas fa-users me-2"></i>Assigned by Team</h6>
                        </div>
                        <div class="card-body p-3" style="max-height:400px;overflow-y:auto;">
                            <div ng-repeat="team in $ctrl.teams track by team.teamId" class="mb-3">
                                <div class="fw-bold small text-dark mb-1">
                                    <i class="fas fa-users me-1 text-primary"></i>{{team.teamName}}
                                    <span class="badge bg-light text-dark ms-1">{{$ctrl.getTeamEmployees(team.teamId).length}}</span>
                                </div>
                                <div ng-if="$ctrl.getTeamEmployees(team.teamId).length === 0" class="text-muted small ps-3">No members</div>
                                <div ng-repeat="emp in $ctrl.getTeamEmployees(team.teamId) track by emp.id"
                                     class="d-flex align-items-center gap-2 p-2 mb-1 rounded-3 border"
                                     style="background:#f8fafc;">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                         style="width:28px;height:28px;font-size:0.7rem;background:#10b981;">
                                        {{emp.employeeName.charAt(0)}}
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="fw-semibold small">{{emp.employeeName}}</div>
                                        <div class="text-muted" style="font-size:0.65rem;">{{emp.role}}</div>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger rounded-pill px-2" ng-click="$ctrl.unassignEmployee(emp)" title="Remove from team">
                                        <i class="fas fa-times" style="font-size:0.65rem;"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, AuthService, $location, $routeParams, NotificationService) {
        var ctrl = this;

        ctrl.teams = [];
        ctrl.employees = [];
        ctrl.controls = [];
        ctrl.loading = true;
        ctrl.saving = false;
        ctrl.activeTab = 'teams';
        ctrl.editingTeam = null;
        ctrl.teamForm = { teamName: '', teamCode: '', description: '' };
        ctrl.assignTarget = {};
        ctrl.teamColors = [
            'linear-gradient(135deg,#6366f1,#4f46e5)',
            'linear-gradient(135deg,#10b981,#059669)',
            'linear-gradient(135deg,#f59e0b,#d97706)',
            'linear-gradient(135deg,#3b82f6,#2563eb)',
            'linear-gradient(135deg,#8b5cf6,#7c3aed)',
            'linear-gradient(135deg,#ef4444,#dc2626)'
        ];

        ctrl.$onInit = function() {
            var action = $location.search().action;
            if (action === 'create') ctrl.activeTab = 'create';
            else if (action === 'assign') ctrl.activeTab = 'assign';
            ctrl.loadData();
        };

        ctrl.loadData = function() {
            ctrl.loading = true;
            // Load teams first (fast), then employees and controls in parallel
            ApiService.getTeams().then(function(r) {
                ctrl.teams = r.data || [];
                return ApiService.loadEmployees();
            }).then(function() {
                ctrl.employees = ApiService.data.employees || [];
                ctrl.loading = false;
                // Load controls in background (non-blocking)
                ApiService.loadAllControls().then(function() {
                    ctrl.controls = ApiService.data.allControls || [];
                }).catch(function() {});
            }).catch(function(err) {
                console.error('Error loading team management data:', err);
                ctrl.loading = false;
            });
        };

        ctrl.getTeamEmployees = function(teamId) {
            return ctrl.employees.filter(function(e) { return e.teamId === teamId; });
        };
        ctrl.getUnassigned = function() {
            return ctrl.employees.filter(function(e) { return !e.teamId; });
        };
        ctrl.getTeamEmployeeCount = function(teamId) { return ctrl.getTeamEmployees(teamId).length; };
        ctrl.getTeamControlCount = function(teamId) {
            return ctrl.controls.filter(function(c) { return c.teamId === teamId; }).length;
        };
        ctrl.getTeamAvgProgress = function(teamId) {
            var tc = ctrl.controls.filter(function(c) { return c.teamId === teamId; });
            if (!tc.length) return 0;
            return Math.round(tc.reduce(function(s, c) { return s + (c.progress || 0); }, 0) / tc.length);
        };

        ctrl.saveTeam = function() {
            if (!ctrl.teamForm.teamName || !ctrl.teamForm.teamCode) {
                NotificationService.show('Team Name and Code are required', 'error');
                return;
            }
            ctrl.saving = true;
            var req = ctrl.editingTeam
                ? ApiService.updateTeam(ctrl.editingTeam.teamId, ctrl.teamForm)
                : ApiService.createTeam(ctrl.teamForm);
            req.then(function() {
                NotificationService.show(ctrl.editingTeam ? 'Team updated' : 'Team created', 'success');
                ctrl.cancelForm();
                ctrl.activeTab = 'teams';
                ctrl.loadData();
            }).catch(function() {
                NotificationService.show('Error saving team', 'error');
            }).finally(function() { ctrl.saving = false; });
        };

        ctrl.editTeam = function(team) {
            ctrl.editingTeam = team;
            ctrl.teamForm = { teamName: team.teamName, teamCode: team.teamCode, description: team.description || '' };
            ctrl.activeTab = 'create';
        };

        ctrl.cancelForm = function() {
            ctrl.editingTeam = null;
            ctrl.teamForm = { teamName: '', teamCode: '', description: '' };
        };

        ctrl.deleteTeam = function(team) {
            Swal.fire({
                title: 'Delete ' + team.teamName + '?',
                text: 'This cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'Delete'
            }).then(function(r) {
                if (r.isConfirmed) {
                    ApiService.deleteTeam(team.teamId).then(function() {
                        NotificationService.show('Team deleted', 'success');
                        ctrl.loadData();
                    }).catch(function() {
                        NotificationService.show('Error deleting team', 'error');
                    });
                }
            });
        };

        ctrl.assignEmployee = function(emp) {
            var teamId = parseInt(ctrl.assignTarget[emp.id]);
            if (!teamId) return;
            ApiService.updateEmployee(emp.id, {
                employeeName: emp.employeeName,
                typeId: emp.typeId,
                description: emp.description,
                teamId: teamId
            }).then(function() {
                NotificationService.show(emp.employeeName + ' assigned', 'success');
                ctrl.assignTarget[emp.id] = '';
                ctrl.loadData();
            }).catch(function() {
                NotificationService.show('Error assigning employee', 'error');
            });
        };

        ctrl.unassignEmployee = function(emp) {
            ApiService.updateEmployee(emp.id, {
                employeeName: emp.employeeName,
                typeId: emp.typeId,
                description: emp.description,
                teamId: null
            }).then(function() {
                NotificationService.show(emp.employeeName + ' unassigned', 'success');
                ctrl.loadData();
            }).catch(function() {
                NotificationService.show('Error unassigning employee', 'error');
            });
        };

        ctrl.viewControls = function(team) {
            AuthService.setCurrentTeam(team.teamId, team.teamName);
            $location.path('/controls');
        };

        ctrl.goBack = function() {
            $location.path('/super-admin');
        };
    }
});
