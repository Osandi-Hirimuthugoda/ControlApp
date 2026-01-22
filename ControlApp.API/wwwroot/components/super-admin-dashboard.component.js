app.component('superAdminDashboard', {
    template: `
    <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-1"><i class="fas fa-crown me-2 text-warning"></i>Company Overview</h2>
                <p class="text-muted mb-0">All teams · All members · Real-time company-wide metrics</p>
            </div>
            <button class="btn btn-outline-primary rounded-pill px-4" ng-click="$ctrl.loadData()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
            </button>
        </div>

        <!-- Company-wide Stats -->
        <div class="row g-3 mb-4">
            <div class="col-xl col-md-4 col-sm-6">
                <div class="rounded-4 shadow-sm p-4 text-white" style="background:linear-gradient(135deg,#6366f1,#4f46e5);position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="fw-bold" style="font-size:2rem;">{{$ctrl.stats.totalTeams}}</div>
                    <div class="opacity-75 small fw-bold text-uppercase" style="letter-spacing:0.05em;">Teams</div>
                    <div class="opacity-60 x-small mt-1">{{$ctrl.stats.activeTeams}} active</div>
                </div>
            </div>
            <div class="col-xl col-md-4 col-sm-6">
                <div class="rounded-4 shadow-sm p-4 text-white" style="background:linear-gradient(135deg,#10b981,#059669);position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="fw-bold" style="font-size:2rem;">{{$ctrl.companyStats.totalUniqueEmployees}}</div>
                    <div class="opacity-75 small fw-bold text-uppercase" style="letter-spacing:0.05em;">Employees</div>
                    <div class="opacity-60 x-small mt-1">across all teams</div>
                </div>
            </div>
            <div class="col-xl col-md-4 col-sm-6">
                <div class="rounded-4 shadow-sm p-4 text-white" style="background:linear-gradient(135deg,#3b82f6,#2563eb);position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="fw-bold" style="font-size:2rem;">{{$ctrl.stats.totalControls}}</div>
                    <div class="opacity-75 small fw-bold text-uppercase" style="letter-spacing:0.05em;">Controls</div>
                    <div class="opacity-60 x-small mt-1">{{$ctrl.companyStats.completedControls}} completed</div>
                </div>
            </div>
            <div class="col-xl col-md-4 col-sm-6">
                <div class="rounded-4 shadow-sm p-4 text-white" style="background:linear-gradient(135deg,#f59e0b,#d97706);position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="fw-bold" style="font-size:2rem;">{{$ctrl.companyStats.avgProgress}}<span style="font-size:1rem;">%</span></div>
                    <div class="opacity-75 small fw-bold text-uppercase" style="letter-spacing:0.05em;">Avg Progress</div>
                    <div class="opacity-60 x-small mt-1">company-wide</div>
                </div>
            </div>
            <div class="col-xl col-md-4 col-sm-6">
                <div class="rounded-4 shadow-sm p-4 text-white" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="fw-bold" style="font-size:2rem;">{{$ctrl.stats.totalControlTypes}}</div>
                    <div class="opacity-75 small fw-bold text-uppercase" style="letter-spacing:0.05em;">Control Types</div>
                    <div class="opacity-60 x-small mt-1">active categories</div>
                </div>
            </div>
        </div>

        <!-- Per-team breakdown -->
        <div class="row g-3 mb-4">
            <div ng-repeat="team in $ctrl.teams track by team.teamId" class="col-xl-4 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-header border-0 py-3 px-4 d-flex justify-content-between align-items-center rounded-top-4"
                         ng-style="{'background': $ctrl.teamColors[$index % $ctrl.teamColors.length]}">
                        <div>
                            <h6 class="fw-bold text-white mb-0"><i class="fas fa-users me-2"></i>{{team.teamName}}</h6>
                            <small class="text-white opacity-75">{{team.teamCode}}</small>
                        </div>
                        <span class="badge rounded-pill" style="background:rgba(255,255,255,0.2);color:white;font-size:0.7rem;">
                            {{team.isActive ? 'Active' : 'Inactive'}}
                        </span>
                    </div>
                    <div class="card-body p-3">
                        <div class="row g-2 text-center mb-3">
                            <div class="col-4">
                                <div class="fw-bold text-dark" style="font-size:1.4rem;">{{$ctrl.getTeamEmployeeCount(team.teamId)}}</div>
                                <div class="text-muted" style="font-size:0.7rem;">Members</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-dark" style="font-size:1.4rem;">{{$ctrl.getTeamControlCount(team.teamId)}}</div>
                                <div class="text-muted" style="font-size:0.7rem;">Controls</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-dark" style="font-size:1.4rem;">{{$ctrl.getTeamAvgProgress(team.teamId)}}<span style="font-size:0.8rem;">%</span></div>
                                <div class="text-muted" style="font-size:0.7rem;">Avg Progress</div>
                            </div>
                        </div>
                        <!-- Progress bar -->
                        <div class="progress rounded-pill mb-2" style="height:6px;background:#e2e8f0;">
                            <div class="progress-bar rounded-pill" ng-style="{'width': $ctrl.getTeamAvgProgress(team.teamId) + '%', 'background': $ctrl.teamColors[$index % $ctrl.teamColors.length]}"></div>
                        </div>
                        <!-- Role breakdown -->
                        <div class="d-flex flex-wrap gap-1 mt-2">
                            <span ng-repeat="rb in $ctrl.getTeamRoleBreakdown(team.teamId) track by $index"
                                  class="badge rounded-pill" style="font-size:0.62rem;background:#eef2ff;color:#4f46e5;">
                                {{rb.role}}: {{rb.count}}
                            </span>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-sm btn-outline-primary flex-grow-1 rounded-pill" ng-click="$ctrl.viewTeamControls(team)">
                                <i class="fas fa-tasks me-1"></i>Controls
                            </button>
                            <button class="btn btn-sm btn-outline-success flex-grow-1 rounded-pill" ng-click="$ctrl.manageTeamMembers(team)">
                                <i class="fas fa-users-cog me-1"></i>Members
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body py-3 px-4 d-flex gap-3 flex-wrap">
                        <button class="btn btn-primary rounded-pill px-4" ng-click="$ctrl.createTeam()">
                            <i class="fas fa-plus me-2"></i>Create New Team
                        </button>
                        <button class="btn btn-success rounded-pill px-4" ng-click="$ctrl.goToTeamManagement()">
                            <i class="fas fa-users-cog me-2"></i>Manage Teams
                        </button>
                        <button class="btn btn-info rounded-pill px-4" ng-click="$ctrl.assignEmployees()">
                            <i class="fas fa-user-plus me-2"></i>Assign Employees
                        </button>
                    </div>
                </div>
            </div>
        </div>
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

        <!-- All Members by Team -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-header border-0 py-3 px-4 d-flex justify-content-between align-items-center"
                         style="background:linear-gradient(135deg,#7c3aed,#6d28d9);border-radius:16px 16px 0 0;">
                        <div>
                            <h5 class="fw-bold text-white mb-0"><i class="fas fa-shield-alt me-2"></i>Role Permissions</h5>
                            <small class="text-white opacity-75">Configure which roles can access which features</small>
                        </div>
                        <button class="btn btn-sm rounded-pill fw-bold" style="background:rgba(255,255,255,0.2);color:white;" ng-click="$ctrl.savePermissions()">
                            <i class="fas fa-save me-1"></i>Save Changes
                        </button>
                        <button class="btn btn-sm rounded-pill" style="background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.3);" ng-click="$ctrl.resetPermissions()" title="Reset to defaults">
                            <i class="fas fa-undo me-1"></i>Reset
                        </button>
                    </div>
                    <div class="card-body p-4" style="background:#f8fafc;">
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm mb-0" style="font-size:0.82rem;">
                                <thead style="background:#f1f5f9;">
                                    <tr>
                                        <th class="fw-bold py-2 px-3" style="min-width:180px;">Permission</th>
                                        <th ng-repeat="role in $ctrl.permissionRoles" class="fw-bold text-center py-2 px-2" style="min-width:100px;">
                                            <span class="badge rounded-pill" ng-style="{'background': $ctrl.getRoleColor(role)}">{{role}}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="perm in $ctrl.permissionDefs track by perm.key">
                                        <td class="py-2 px-3 fw-semibold">
                                            <i class="{{perm.icon}} me-2 text-muted"></i>{{perm.label}}
                                        </td>
                                        <td ng-repeat="role in $ctrl.permissionRoles" class="text-center py-2">
                                            <div class="form-check d-flex justify-content-center mb-0">
                                                <input class="form-check-input" type="checkbox"
                                                       ng-model="$ctrl.permissions[perm.key][role]"
                                                       ng-disabled="role === 'Admin'">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-2 text-muted" style="font-size:0.72rem;"><i class="fas fa-info-circle me-1"></i>Admin always has full access. Changes take effect on next login.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Permission Overrides -->
        <div class="row mt-0 mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-header border-0 py-3 px-4 d-flex justify-content-between align-items-center"
                         style="background:linear-gradient(135deg,#0891b2,#0e7490);border-radius:16px 16px 0 0;">
                        <div>
                            <h5 class="fw-bold text-white mb-0"><i class="fas fa-user-shield me-2"></i>User Permission Overrides</h5>
                            <small class="text-white opacity-75">Grant or restrict specific permissions per employee, per team</small>
                        </div>
                        <div class="d-flex gap-2">
                            <select class="form-select form-select-sm border-0 rounded-pill" style="width:160px;" ng-model="$ctrl.overrideTeamFilter">
                                <option value="">All Teams</option>
                                <option ng-repeat="t in $ctrl.teams" value="{{t.teamId}}">{{t.teamName}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body p-3" style="background:#f8fafc;">
                        <div class="row g-2">
                            <div ng-repeat="emp in $ctrl.getFilteredEmployeesForOverride() track by emp.id" class="col-xl-3 col-md-4 col-sm-6">
                                <div class="card border-0 shadow-sm rounded-3 p-3" style="background:white;">
                                    <div class="d-flex align-items-center gap-2 mb-2">
                                        <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                             style="width:36px;height:36px;font-size:0.82rem;"
                                             ng-style="{'background': $ctrl.getRoleColor(emp.role)}">
                                            {{emp.employeeName.charAt(0).toUpperCase()}}
                                        </div>
                                        <div class="flex-grow-1 overflow-hidden">
                                            <div class="fw-semibold text-dark" style="font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{emp.employeeName}}</div>
                                            <div style="font-size:0.68rem;" class="d-flex align-items-center gap-1 flex-wrap">
                                                <span class="badge rounded-pill" ng-style="{'background': $ctrl.getRoleColor(emp.role)}" style="font-size:0.6rem;">{{emp.role}}</span>
                                                <span class="badge rounded-pill" style="background:#1e3a5f;color:white;font-size:0.6rem;">
                                                    <i class="fas fa-home me-1" style="font-size:0.55rem;"></i>{{$ctrl.getTeamName(emp.teamId)}}
                                                </span>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm rounded-circle flex-shrink-0"
                                                style="width:28px;height:28px;background:#eef2ff;color:#4f46e5;padding:0;"
                                                ng-click="$ctrl.openUserOverride(emp)"
                                                title="Configure permissions for primary team">
                                            <i class="fas fa-cog" style="font-size:0.7rem;"></i>
                                        </button>
                                        <button class="btn btn-sm rounded-circle flex-shrink-0"
                                                style="width:28px;height:28px;background:#f0fdf4;color:#059669;padding:0;"
                                                ng-click="$ctrl.openTeamAccess(emp)"
                                                title="Add to other teams">
                                            <i class="fas fa-user-plus" style="font-size:0.7rem;"></i>
                                        </button>
                                    </div>
                                    <!-- Show active overrides -->
                                    <div ng-if="$ctrl.hasOverrides(emp.id)" class="d-flex flex-wrap gap-1">
                                        <span ng-repeat="perm in $ctrl.getUserOverrideLabels(emp.id) track by $index"
                                              class="badge rounded-pill" style="font-size:0.6rem;background:#dcfce7;color:#166534;">
                                            <i class="fas fa-check me-1"></i>{{perm}}
                                        </span>
                                    </div>
                                    <div ng-if="!$ctrl.hasOverrides(emp.id)" class="text-muted" style="font-size:0.68rem;">No overrides — using role defaults</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Override Modal -->
        <div ng-if="$ctrl.overrideModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;" ng-click="$ctrl.overrideModal=null">
            <div class="card border-0 shadow-lg rounded-4" style="width:480px;max-width:96vw;" ng-click="$event.stopPropagation()">
                <div class="card-header border-0 rounded-top-4 py-3 px-4 d-flex justify-content-between align-items-center" style="background:linear-gradient(135deg,#0891b2,#0e7490);">
                    <div>
                        <h6 class="fw-bold text-white mb-0"><i class="fas fa-user-shield me-2"></i>{{$ctrl.overrideModal.emp.employeeName}}</h6>
                        <small class="text-white opacity-75">{{$ctrl.overrideModal.emp.role}} · {{$ctrl.getTeamName($ctrl.overrideModal.emp.teamId)}}</small>
                    </div>
                    <button class="btn btn-sm rounded-circle" style="background:rgba(255,255,255,0.2);color:white;width:30px;height:30px;" ng-click="$ctrl.overrideModal=null">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <p class="text-muted small mb-3">Toggle permissions for this employee. These override the role-based defaults.</p>
                    <div ng-repeat="perm in $ctrl.permissionDefs track by perm.key" class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <span class="small fw-semibold"><i class="{{perm.icon}} me-2 text-muted"></i>{{perm.label}}</span>
                        <div class="d-flex align-items-center gap-2">
                            <small class="text-muted" style="font-size:0.68rem;">Role default: {{$ctrl.getRoleDefault(perm.key, $ctrl.overrideModal.emp.role) ? '✓' : '✗'}}</small>
                            <div class="form-check form-switch mb-0">
                                <input class="form-check-input" type="checkbox" ng-model="$ctrl.overrideModal.overrides[perm.key]">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button class="btn btn-primary flex-grow-1 rounded-pill fw-bold" ng-click="$ctrl.saveUserOverride()">
                            <i class="fas fa-save me-2"></i>Save Overrides
                        </button>
                        <button class="btn btn-outline-danger rounded-pill" ng-click="$ctrl.clearUserOverride($ctrl.overrideModal.emp.id)" title="Reset to role defaults">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Access Modal -->
        <div ng-if="$ctrl.teamAccessModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;" ng-click="$ctrl.teamAccessModal=null">
            <div class="card border-0 shadow-lg rounded-4" style="width:440px;max-width:96vw;" ng-click="$event.stopPropagation()">
                <div class="card-header border-0 rounded-top-4 py-3 px-4 d-flex justify-content-between align-items-center" style="background:linear-gradient(135deg,#059669,#047857);">
                    <div>
                        <h6 class="fw-bold text-white mb-0"><i class="fas fa-users me-2"></i>{{$ctrl.teamAccessModal.emp.employeeName}}</h6>
                        <small class="text-white opacity-75">Manage team access</small>
                    </div>
                    <button class="btn btn-sm rounded-circle" style="background:rgba(255,255,255,0.2);color:white;width:30px;height:30px;" ng-click="$ctrl.teamAccessModal=null">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <p class="text-muted small mb-3">
                        <i class="fas fa-home me-1 text-primary"></i>
                        Primary team: <strong>{{$ctrl.getTeamName($ctrl.teamAccessModal.emp.teamId)}}</strong>
                        <br>Toggle additional teams this employee can access.
                    </p>
                    <div ng-repeat="team in $ctrl.teams track by team.teamId" class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div class="d-flex align-items-center gap-2">
                            <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                 style="width:30px;height:30px;background:linear-gradient(135deg,#6366f1,#4f46e5);font-size:0.72rem;">
                                {{team.teamName.charAt(0)}}
                            </div>
                            <span class="fw-semibold small">{{team.teamName}}</span>
                            <span class="badge rounded-pill" style="background:#1e3a5f;color:white;font-size:0.62rem;" ng-if="team.teamId === $ctrl.teamAccessModal.emp.teamId">
                                <i class="fas fa-home me-1"></i>Primary
                            </span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span ng-if="team.teamId === $ctrl.teamAccessModal.emp.teamId" class="text-muted" style="font-size:0.7rem;">Cannot remove primary</span>
                            <div class="form-check form-switch mb-0" ng-if="team.teamId !== $ctrl.teamAccessModal.emp.teamId">
                                <input class="form-check-input" type="checkbox"
                                       ng-model="$ctrl.teamAccessModal.teamAccess[team.teamId]"
                                       ng-change="$ctrl.toggleTeamAccess($ctrl.teamAccessModal.emp, team)">
                            </div>
                            <input class="form-check-input" type="checkbox" ng-if="team.teamId === $ctrl.teamAccessModal.emp.teamId" checked disabled>
                        </div>
                    </div>
                    <div class="mt-3 text-muted" style="font-size:0.72rem;"><i class="fas fa-info-circle me-1"></i>Employee needs to re-login to see new teams in the team switcher.</div>
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

                // Build userTeamMap in background — non-blocking
                ctrl.userTeamMap = {};
                ctrl.teams.forEach(function(t) {
                    ApiService.get('/api/teams/' + t.teamId + '/members').then(function(r) {
                        (r.data || []).forEach(function(m) {
                            if (!ctrl.userTeamMap[m.userId]) ctrl.userTeamMap[m.userId] = [];
                            if (ctrl.userTeamMap[m.userId].indexOf(t.teamId) === -1) {
                                ctrl.userTeamMap[m.userId].push(t.teamId);
                            }
                        });
                    }).catch(function() {
                        // Endpoint not available yet (needs backend restart) — silently ignore
                    });
                });
                
                ctrl.stats.totalControlTypes = ctrl.controlTypes.length;
                ctrl._roleBreakdownCache = {};
                ctrl._computeCompanyStats();
                ctrl.loading = false;
                if (!$rootScope.$$phase) { $rootScope.$apply(); }
            }).catch(function(error) {
                console.error('Error loading data:', error);
                ctrl.loading = false;
                if (!$rootScope.$$phase) { $rootScope.$apply(); }
            });
        };
        
        ctrl.teamColors = [
            'linear-gradient(135deg,#6366f1,#4f46e5)',
            'linear-gradient(135deg,#10b981,#059669)',
            'linear-gradient(135deg,#f59e0b,#d97706)',
            'linear-gradient(135deg,#3b82f6,#2563eb)',
            'linear-gradient(135deg,#8b5cf6,#7c3aed)',
            'linear-gradient(135deg,#ef4444,#dc2626)'
        ];

        ctrl.companyStats = { totalUniqueEmployees: 0, completedControls: 0, avgProgress: 0 };

        ctrl._computeCompanyStats = function() {
            // Unique employees (by id, not counting duplicates across teams)
            var uniqueEmpIds = {};
            (ctrl.employees || []).forEach(function(e) { uniqueEmpIds[e.id] = true; });
            ctrl.companyStats.totalUniqueEmployees = Object.keys(uniqueEmpIds).length;

            var controls = ctrl.controls || [];
            ctrl.companyStats.completedControls = controls.filter(function(c) {
                return (c.statusName || '').toLowerCase() === 'completed';
            }).length;
            ctrl.companyStats.avgProgress = controls.length > 0
                ? Math.round(controls.reduce(function(s, c) { return s + (c.progress || 0); }, 0) / controls.length)
                : 0;
        };

        ctrl.getTeamEmployeeCount = function(teamId) {
            return ctrl.employees.filter(function(e) { return e.teamId === teamId; }).length;
        };

        ctrl.getTeamAvgProgress = function(teamId) {
            var tc = ctrl.controls.filter(function(c) { return c.teamId === teamId; });
            if (!tc.length) return 0;
            return Math.round(tc.reduce(function(s, c) { return s + (c.progress || 0); }, 0) / tc.length);
        };

        // Cache role breakdowns to avoid infinite digest
        ctrl._roleBreakdownCache = {};
        ctrl.getTeamRoleBreakdown = function(teamId) {
            if (ctrl._roleBreakdownCache[teamId]) return ctrl._roleBreakdownCache[teamId];
            var emps = ctrl.employees.filter(function(e) { return e.teamId === teamId; });
            var roleMap = {};
            emps.forEach(function(e) {
                var r = e.role || 'Unknown';
                roleMap[r] = (roleMap[r] || 0) + 1;
            });
            ctrl._roleBreakdownCache[teamId] = Object.keys(roleMap)
                .map(function(r) { return { role: r, count: roleMap[r] }; })
                .sort(function(a, b) { return b.count - a.count; })
                .slice(0, 4);
            return ctrl._roleBreakdownCache[teamId];
        };
        
        ctrl.getTeamControlCount = function(teamId) {
            return ctrl.controls.filter(function(c) { return c.teamId === teamId; }).length;
        };
        
        ctrl.getTeamControlTypeCount = function(teamId) {
            return ctrl.controlTypes.filter(function(ct) { return ct.teamId === teamId; }).length;
        };

        // Members list helpers
        ctrl.memberSearch = '';

        ctrl.getTeamEmployees = function(teamId, search) {
            return ctrl.employees.filter(function(e) {
                if (e.teamId !== teamId) return false;
                if (!search) return true;
                var s = search.toLowerCase();
                return (e.employeeName || '').toLowerCase().includes(s) ||
                       (e.role || '').toLowerCase().includes(s) ||
                       (e.email || '').toLowerCase().includes(s);
            });
        };

        ctrl.getUnassignedEmployees = function(search) {
            return ctrl.employees.filter(function(e) {
                if (e.teamId) return false;
                if (!search) return true;
                var s = search.toLowerCase();
                return (e.employeeName || '').toLowerCase().includes(s) ||
                       (e.role || '').toLowerCase().includes(s);
            });
        };

        ctrl.getRoleColor = function(role) {
            if (!role) return '#94a3b8';
            var r = role.toLowerCase();
            if (r.includes('admin')) return '#dc2626';
            if (r.includes('architect') || r.includes('software')) return '#7c3aed';
            if (r.includes('team lead') || r.includes('lead')) return '#2563eb';
            if (r.includes('project manager') || r.includes('manager')) return '#d97706';
            if (r.includes('qa')) return '#059669';
            if (r.includes('developer')) return '#0891b2';
            return '#6366f1';
        };

        // --- Role Permissions ---
        ctrl.permissionRoles = ['Admin', 'Software Architecturer', 'Team Lead', 'Project Manager', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'];

        ctrl.permissionDefs = [
            { key: 'canAddControl',       label: 'Add Controls',         icon: 'fas fa-plus-circle' },
            { key: 'canEditControl',      label: 'Edit Controls',        icon: 'fas fa-edit' },
            { key: 'canDeleteControl',    label: 'Delete Controls',      icon: 'fas fa-trash' },
            { key: 'canAddEmployee',      label: 'Add Employees',        icon: 'fas fa-user-plus' },
            { key: 'canEditEmployee',     label: 'Edit Employees',       icon: 'fas fa-user-edit' },
            { key: 'canDeleteEmployee',   label: 'Delete Employees',     icon: 'fas fa-user-minus' },
            { key: 'canMarkProgress',     label: 'Mark Progress',        icon: 'fas fa-chart-line' },
            { key: 'canAddComment',       label: 'Add Comments',         icon: 'fas fa-comment-dots' },
            { key: 'canEditSubDescription', label: 'Edit Sub-Objectives', icon: 'fas fa-tasks' }
        ];

        var PERM_KEY = 'rolePermissions';

        var defaultPermissions = {
            canAddControl:        { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': true,  'QA Engineer': true,  'Intern Developer': true,  'Intern QA Engineer': true  },
            canEditControl:       { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canDeleteControl:     { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canAddEmployee:       { 'Admin': true, 'Software Architecturer': false, 'Team Lead': false, 'Project Manager': true, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canEditEmployee:      { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canDeleteEmployee:    { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canMarkProgress:      { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': true,  'QA Engineer': false, 'Intern Developer': true,  'Intern QA Engineer': false },
            canAddComment:        { 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': false, 'QA Engineer': false, 'Intern Developer': false, 'Intern QA Engineer': false },
            canEditSubDescription:{ 'Admin': true, 'Software Architecturer': true, 'Team Lead': true, 'Project Manager': false, 'Developer': true,  'QA Engineer': true,  'Intern Developer': true,  'Intern QA Engineer': true  }
        };

        ctrl._loadPermissions = function() {
            try {
                var stored = localStorage.getItem(PERM_KEY);
                ctrl.permissions = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultPermissions));
            } catch(e) {
                ctrl.permissions = JSON.parse(JSON.stringify(defaultPermissions));
            }
            // Always ensure Admin = true for all
            ctrl.permissionDefs.forEach(function(p) {
                if (!ctrl.permissions[p.key]) ctrl.permissions[p.key] = JSON.parse(JSON.stringify(defaultPermissions[p.key]));
                ctrl.permissions[p.key]['Admin'] = true;
            });
        };

        ctrl.savePermissions = function() {
            ctrl.permissionDefs.forEach(function(p) { ctrl.permissions[p.key]['Admin'] = true; });
            localStorage.setItem(PERM_KEY, JSON.stringify(ctrl.permissions));
            Swal.fire({ icon: 'success', title: 'Saved', text: 'Permissions updated. Members need to re-login for changes to take effect.', timer: 2500, showConfirmButton: false });
        };

        ctrl.resetPermissions = function() {
            ctrl.permissions = JSON.parse(JSON.stringify(defaultPermissions));
            localStorage.setItem(PERM_KEY, JSON.stringify(ctrl.permissions));
            Swal.fire({ icon: 'info', title: 'Reset', text: 'Permissions reset to defaults.', timer: 1800, showConfirmButton: false });
        };

        ctrl._loadPermissions();

        // --- User Permission Overrides ---
        var USER_PERM_KEY = 'userPermissionOverrides';

        ctrl.overrideModal = null;
        ctrl.overrideTeamFilter = '';
        ctrl.userTeamMap = {};

        ctrl._loadUserOverrides = function() {
            try {
                var stored = localStorage.getItem(USER_PERM_KEY);
                ctrl.userOverrides = stored ? JSON.parse(stored) : {};
            } catch(e) { ctrl.userOverrides = {}; }
        };
        ctrl._loadUserOverrides();

        ctrl.getFilteredEmployeesForOverride = function() {
            if (!ctrl.employees) return [];
            return ctrl.employees.filter(function(e) {
                if (!ctrl.overrideTeamFilter) return true;
                var tid = parseInt(ctrl.overrideTeamFilter);
                // Check primary team
                if (e.teamId === tid) return true;
                // Check additional teams via userTeamMap
                if (e.userId && ctrl.userTeamMap && ctrl.userTeamMap[e.userId]) {
                    return ctrl.userTeamMap[e.userId].indexOf(tid) !== -1;
                }
                return false;
            });
        };

        ctrl.getTeamName = function(teamId) {
            if (!teamId || !ctrl.teams) return 'No Team';
            var t = ctrl.teams.find(function(t) { return t.teamId === teamId; });
            return t ? t.teamName : 'Unknown';
        };

        ctrl.hasOverrides = function(empId) {
            var o = ctrl.userOverrides[String(empId)];
            return o && Object.keys(o).length > 0;
        };

        ctrl.getUserOverrideLabels = function(empId) {
            var o = ctrl.userOverrides[String(empId)];
            if (!o) return [];
            return Object.keys(o).filter(function(k) { return o[k]; }).map(function(k) {
                var def = ctrl.permissionDefs.find(function(p) { return p.key === k; });
                return def ? def.label : k;
            });
        };

        ctrl.getRoleDefault = function(permKey, role) {
            if (!ctrl.permissions || !ctrl.permissions[permKey]) return false;
            return ctrl.permissions[permKey][role] === true;
        };

        ctrl.openUserOverride = function(emp) {
            var key = String(emp.id) + '_' + String(emp.teamId || '0');
            var existing = ctrl.userOverrides[key] || {};
            var overrides = {};
            ctrl.permissionDefs.forEach(function(p) {
                overrides[p.key] = existing.hasOwnProperty(p.key)
                    ? existing[p.key]
                    : ctrl.getRoleDefault(p.key, emp.role);
            });
            ctrl.overrideModal = { emp: emp, key: key, overrides: overrides };
        };

        ctrl.saveUserOverride = function() {
            if (!ctrl.overrideModal) return;
            ctrl.userOverrides[ctrl.overrideModal.key] = angular.copy(ctrl.overrideModal.overrides);
            localStorage.setItem(USER_PERM_KEY, JSON.stringify(ctrl.userOverrides));
            ctrl.overrideModal = null;
            Swal.fire({ icon: 'success', title: 'Saved', text: 'User permissions updated for this team.', timer: 1800, showConfirmButton: false });
        };

        ctrl.clearUserOverride = function(empId) {
            var emp = ctrl.overrideModal ? ctrl.overrideModal.emp : null;
            var key = emp ? String(emp.id) + '_' + String(emp.teamId || '0') : String(empId);
            delete ctrl.userOverrides[key];
            localStorage.setItem(USER_PERM_KEY, JSON.stringify(ctrl.userOverrides));
            ctrl.overrideModal = null;
            Swal.fire({ icon: 'info', title: 'Reset', text: 'User permissions reset to role defaults for this team.', timer: 1800, showConfirmButton: false });
        };

        // --- Team Access Management ---
        ctrl.teamAccessModal = null;

        ctrl.openTeamAccess = function(emp) {
            // Build current team access map from UserTeams (use employees data as proxy)
            // We need the user's userId — find it via the employee's userId field
            var teamAccess = {};
            ctrl.teams.forEach(function(t) {
                // Check if this employee appears in any team's employee list
                // We use the employees array which has teamId per employee record
                // But an employee can only be in one team in the employees table
                // The real source is UserTeams — we'll check via the API
                teamAccess[t.teamId] = false;
            });
            // Mark current team as true
            if (emp.teamId) teamAccess[emp.teamId] = true;

            // Load actual UserTeams from API
            ApiService.get('/api/teams/' + (emp.teamId || 0) + '/members').then(function() {
                // For now use what we know from the employees list
            }).catch(function() {});

            // Check all teams for this employee's userId
            if (emp.userId) {
                ctrl.teams.forEach(function(t) {
                    ApiService.get('/api/teams/' + t.teamId + '/members').then(function(r) {
                        var members = r.data || [];
                        if (members.some(function(m) { return m.userId === emp.userId; })) {
                            teamAccess[t.teamId] = true;
                        }
                    }).catch(function() {});
                });
            }

            ctrl.teamAccessModal = { emp: emp, teamAccess: teamAccess };
        };

        ctrl.toggleTeamAccess = function(emp, team) {
            if (!emp.userId) {
                Swal.fire({ icon: 'warning', title: 'No User Account', text: 'This employee has no linked user account.', timer: 2000, showConfirmButton: false });
                ctrl.teamAccessModal.teamAccess[team.teamId] = !ctrl.teamAccessModal.teamAccess[team.teamId];
                return;
            }
            var adding = ctrl.teamAccessModal.teamAccess[team.teamId];
            var url = '/api/teams/' + team.teamId + '/members/' + emp.userId;
            var req = adding ? ApiService.post(url, {}) : ApiService.delete(url);
            req.then(function() {
                var msg = adding ? (emp.employeeName + ' added to ' + team.teamName) : (emp.employeeName + ' removed from ' + team.teamName);
                Swal.fire({ icon: 'success', title: 'Done', text: msg, timer: 1800, showConfirmButton: false });
            }).catch(function(err) {
                // Revert toggle on error
                ctrl.teamAccessModal.teamAccess[team.teamId] = !ctrl.teamAccessModal.teamAccess[team.teamId];
                var msg = err && err.status === 405 ? 'Backend restart required for this feature.' : 'Failed to update team access.';
                Swal.fire({ icon: 'error', title: 'Error', text: msg, timer: 2500, showConfirmButton: false });
            });
        };

        ctrl.hasOverrides = function(empId) {
            // Check if any team-scoped override exists for this employee
            return Object.keys(ctrl.userOverrides).some(function(k) {
                return k.startsWith(String(empId) + '_');
            });
        };

        ctrl.getUserOverrideLabels = function(empId) {
            var emp = (ctrl.employees || []).find(function(e) { return e.id === empId; });
            var key = emp ? String(emp.id) + '_' + String(emp.teamId || '0') : String(empId) + '_0';
            var o = ctrl.userOverrides[key];
            if (!o) return [];
            return Object.keys(o).filter(function(k) { return o[k]; }).map(function(k) {
                var def = ctrl.permissionDefs.find(function(p) { return p.key === k; });
                return def ? def.label : k;
            });
        };
        
        ctrl.createTeam = function() {
            $location.path('/teams').search({ action: 'create' });
        };
        
        ctrl.goToTeamManagement = function() {
            $location.path('/teams');
        };
        
        ctrl.assignEmployees = function() {
            $location.path('/teams').search({ action: 'assign' });
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
