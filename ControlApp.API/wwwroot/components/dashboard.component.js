app.component('dashboard', {
    template: `
    <style>
        .dashboard-premium-container {
            background: #f8fafc;
            min-height: 100vh;
            padding: 2.5rem;
            font-family: 'Inter', sans-serif;
        }
        .insight-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .insight-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .insight-icon {
            backdrop-filter: blur(4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .bg-gradient-indigo-soft {
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
        }
        .avatar-glass {
            backdrop-filter: blur(8px);
            border: 2px solid white;
        }
        .x-small { font-size: 0.75rem; }
        .ls-1 { letter-spacing: 0.05em; }
        .hover-shadow-lg:hover {
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15) !important;
            transform: scale(1.01);
        }
        .card { border-radius: 1.25rem !important; }
        .progress-bar { transition: width 1s ease-in-out; }
        .month-card {
            border: 1px solid rgba(0,0,0,0.03) !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: #ffffff;
        }
        .month-card:hover {
            transform: scale(1.05);
            z-index: 10;
            box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }
        .month-card.bg-indigo {
            background: #6366f1 !important;
            color: white !important;
        }
        .month-card.bg-success-subtle {
            background: #f0fdf4 !important;
            border: 1px solid #10b981 !important;
        }
    </style>
    <div class="dashboard-premium-container" style="animation: fadeIn 0.6s ease-out;">
        <!-- Dashboard Header & Top Actions -->
        <div class="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 class="fw-bold text-dark mb-1">
                    <i class="fas fa-chart-pie me-3 text-indigo"></i>Command Center
                    <span ng-if="$ctrl.currentTeamName" class="badge bg-indigo ms-3">{{$ctrl.currentTeamName}}</span>
                </h2>
                <p class="text-secondary mb-0">Real-time system health and project velocity analytics</p>
            </div>
            <div class="d-flex gap-3">
                <div class="search-box-glass shadow-sm rounded-pill p-1 bg-white border d-flex align-items-center px-3" style="width: 300px;">
                    <i class="fas fa-search text-muted me-2"></i>
                    <input type="text" class="form-control border-0 shadow-none bg-transparent" placeholder="Quick find metrics..." ng-model="$ctrl.dashboardSearch">
                </div>
                <button class="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm" ng-click="$ctrl.showRcMatrix = true">
                    <i class="fas fa-table me-2"></i>RC Matrix
                </button>
                <button class="btn btn-indigo rounded-pill px-4 fw-bold shadow-sm" ng-click="$ctrl.backToControls()">
                    <i class="fas fa-arrow-left me-2"></i>Back to Ops Room
                </button>
            </div>
        </div>

        <!-- RC Matrix Modal -->
        <rc-matrix ng-if="$ctrl.showRcMatrix"
                   all-test-cases="$ctrl.allTestCases"
                   all-controls="$ctrl.store.allControls"
                   on-close="$ctrl.showRcMatrix = false">
        </rc-matrix>

        <!-- Quick Insights Row -->
        <div class="row g-3 mb-5">
            <!-- Total Controls -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#6366f1 0%,#4f46e5 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-list-check fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Controls</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.store.allControls.length || 0}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Total Initiatives</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" style="width:100%;background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.getCompletedCount()}} completed</small>
                </div>
            </div>
            <!-- Avg Progress -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#10b981 0%,#059669 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-gauge-high fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Velocity</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.averageProgress}}<span style="font-size:1rem;">%</span></h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Avg Progress</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': $ctrl.averageProgress + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">across all controls</small>
                </div>
            </div>
            <!-- Active Defects -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#ef4444 0%,#dc2626 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-bug fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Defects</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.activeDefectsCount}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Active Defects</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': ($ctrl.allDefects.length > 0 ? ($ctrl.activeDefectsCount/$ctrl.allDefects.length*100) : 0) + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.getReOpenCount()}} re-opened</small>
                </div>
            </div>
            <!-- Test Pass Rate -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#3b82f6 0%,#2563eb 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-check-circle fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">QA</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.getPassRate()}}<span style="font-size:1rem;">%</span></h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Test Pass Rate</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': $ctrl.getPassRate() + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.allTestCases.length || 0}} total test cases</small>
                </div>
            </div>
            <!-- Team Size -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#f59e0b 0%,#d97706 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-users fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Team</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.store.employees.length || 0}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Team Members</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" style="width:100%;background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.currentTeamName || 'All Teams'}}</small>
                </div>
            </div>
        </div>

        <!-- Main Analytics & Defects List -->
        <div class="row g-4 mb-5">
            <!-- Left Column: Primary Charts -->
            <div class="col-lg-8">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold text-dark mb-0"><i class="fas fa-signal me-2 text-indigo"></i>Status Landscape</h5>
                            </div>
                            <div class="card-body p-4">
                                <div style="height: 300px;">
                                    <canvas id="statusDistributionChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div class="card-header bg-gradient-indigo-soft border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold text-dark mb-0">
                                    <i class="fas fa-bug me-2 text-danger"></i>Active Defects Pool
                                    <span class="badge bg-danger text-white ms-2">{{$ctrl.getFilteredDefects().length}}</span>
                                </h6>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-sm" ng-class="$ctrl.defectFilter === 'All' ? 'btn-danger' : 'btn-outline-danger'" ng-click="$ctrl.defectFilter = 'All'">All</button>
                                    <button class="btn btn-sm" ng-class="$ctrl.defectFilter === 'Open' ? 'btn-danger' : 'btn-outline-danger'" ng-click="$ctrl.defectFilter = 'Open'">Open</button>
                                    <button class="btn btn-sm" ng-class="$ctrl.defectFilter === 'Assigned' ? 'btn-danger' : 'btn-outline-danger'" ng-click="$ctrl.defectFilter = 'Assigned'">My Defects</button>
                                </div>
                            </div>
                            <div class="card-body p-4">
                                <div class="row g-3">
                                    <div ng-repeat="defect in $ctrl.getFilteredDefects() | orderBy:'-reportedDate' | limitTo:6 track by defect.defectId" class="col-md-6">
                                        <div class="card border-0 bg-light shadow-none border-start border-4 h-100" 
                                             style="border-radius: 12px; border-color: {{$ctrl.getDefectSeverityColor(defect.severity)}} !important;">
                                            <div class="card-body p-3">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span class="x-small fw-bold px-2 py-1 rounded" style="background: white; color: {{$ctrl.getDefectSeverityColor(defect.severity)}}">{{defect.severity}}</span>
                                                    <span class="x-small text-muted">{{$ctrl.formatDefectDate(defect.reportedDate)}}</span>
                                                </div>
                                                <h6 class="fw-bold mb-1 text-truncate">{{defect.title}}</h6>
                                                <p class="x-small text-muted mb-0">{{defect.description | limitTo:50}}...</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div ng-if="$ctrl.getFilteredDefects().length === 0" class="col-12 text-center py-4">
                                        <i class="fas fa-check-circle fa-3x text-success opacity-20 mb-2"></i>
                                        <p class="text-muted">No defects found in this category</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Secondary Analytics & Release Hub -->
            <div class="col-lg-4">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <div class="card-header bg-white border-0 py-4 px-4">
                                <h5 class="fw-bold text-dark mb-0"><i class="fas fa-biohazard me-2 text-danger"></i>Severity Delta</h5>
                            </div>
                            <div class="card-body p-4">
                                <div style="height: 250px;">
                                    <canvas id="defectSeverityChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold text-dark mb-0"><i class="fas fa-rocket me-2 text-purple"></i>Release Hub</h5>
                                <button class="btn btn-sm btn-outline-indigo rounded-circle" ng-click="$ctrl.refreshRoadmap()"><i class="fas fa-sync-alt"></i></button>
                            </div>
                            <div class="card-body p-4 pt-0">
                                <div class="d-flex justify-content-between align-items-center mb-4 bg-light rounded-pill p-2">
                                    <button class="btn btn-sm btn-link text-indigo" ng-click="$ctrl.changeYear(-1)"><i class="fas fa-chevron-left"></i></button>
                                    <span class="fw-bold text-indigo">{{$ctrl.currentYear}}</span>
                                    <button class="btn btn-sm btn-link text-indigo" ng-click="$ctrl.changeYear(1)"><i class="fas fa-chevron-right"></i></button>
                                </div>
                                
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr ng-repeat="row in [0, 1, 2]">
                                                <td ng-repeat="col in [0, 1, 2, 3]" class="p-1" style="width: 25%;">
                                                    <div class="month-card rounded-3 p-2 text-center shadow-sm border" 
                                                         ng-class="$ctrl.getMonthCardClass(row * 4 + col)"
                                                         ng-style="$ctrl.getMonthCardStyle(row * 4 + col)"
                                                         ng-click="$ctrl.showMonthReleases(row * 4 + col)"
                                                         ng-mouseenter="$ctrl.hoveredMonth = row * 4 + col"
                                                         ng-mouseleave="$ctrl.hoveredMonth = null"
                                                         style="transition: all 0.2s ease; min-height: 60px;">
                                                        <div class="fw-bold x-small text-uppercase mb-1" 
                                                             ng-class="$ctrl.getMonthTextClass(row * 4 + col)">
                                                            {{$ctrl.getMonthName(row * 4 + col)}}
                                                        </div>
                                                        <div class="release-count">
                                                            <span class="badge rounded-pill px-2 py-1 x-small"
                                                                  ng-class="$ctrl.getMonthBadgeClass(row * 4 + col)">
                                                                {{$ctrl.getMonthReleaseCount(row * 4 + col)}} 
                                                                <i class="fas fa-rocket ms-1 x-small"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <button class="btn btn-indigo w-100 rounded-pill mt-3 fw-bold shadow-sm x-small" ng-click="$ctrl.goToCurrentMonth()">
                                    Return to Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Test Cases & Defects Charts Row -->
        <div class="row g-4 mb-5">
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-clipboard-check me-2 text-primary"></i>Test Case Status</h5>
                    </div>
                    <div class="card-body p-4 d-flex align-items-center justify-content-center">
                        <div style="height: 280px; width: 100%;">
                            <canvas id="testCaseStatusChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-bug me-2 text-danger"></i>Defects by Status</h5>
                    </div>
                    <div class="card-body p-4">
                        <div style="height: 280px;">
                            <canvas id="defectStatusBarChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Load & Progress Analytics -->
        <div class="row g-4 pb-5">
            <div class="col-md-7">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-bars-progress me-2 text-blue"></i>Objective Progression</h5>
                    </div>
                    <div class="card-body p-4">
                        <div style="height: 350px;">
                            <canvas id="progressByDescriptionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-user-gear me-2 text-success"></i>Team Force</h5>
                    </div>
                    <div class="card-body p-4">
                        <div ng-repeat="emp in $ctrl.employeesWorkload | limitTo:6 track by emp.employeeId" class="mb-4 d-flex align-items-center">
                            <div class="avatar-glass me-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white fw-bold" 
                                 style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); font-size: 0.8rem;">
                                {{emp.employeeName.charAt(0)}}
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-bold text-dark x-small">{{emp.employeeName}}</span>
                                    <span class="x-small text-indigo fw-bold">{{emp.avgProgress}}%</span>
                                </div>
                                <div class="progress rounded-pill shadow-inner" style="height: 6px; background: #eef2ff;">
                                    <div class="progress-bar rounded-pill" ng-style="{'width': emp.avgProgress + '%'}" 
                                         style="background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <!-- Controls by Release Date -->
        <div class="row g-4 mb-5">
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-calendar-check me-2 text-indigo"></i>Controls by Release</h5>
                        <span class="badge rounded-pill" style="background:#eef2ff;color:#4f46e5;font-size:0.72rem;">{{$ctrl.releaseGroups.length}} releases</span>
                    </div>
                    <div class="card-body p-3">
                        <div class="row g-4">
                            <!-- Left: Release date selector + controls list -->
                            <div class="col-md-5">
                                <div class="mb-3">
                                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Filter by Release Date</label>
                                    <select class="form-select form-select-sm border-0 shadow-sm" ng-model="$ctrl.selectedReleaseGroup" ng-change="$ctrl.onReleaseGroupChange()">
                                        <option value="">-- All Releases --</option>
                                        <option ng-repeat="rg in $ctrl.releaseGroups track by rg.dateKey" value="{{rg.dateKey}}">
                                            {{rg.label}} ({{rg.controls.length}} controls)
                                        </option>
                                    </select>
                                </div>
                                <!-- Selected release stats card -->
                                <div ng-if="$ctrl.activeReleaseGroup" class="rounded-4 p-3 mb-3" ng-style="{'background': $ctrl.activeReleaseGroup.bg}">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="text-white fw-bold" style="font-size:1.4rem;">{{$ctrl.activeReleaseGroup.controls.length}}</div>
                                        <span class="badge rounded-pill text-white" style="background:rgba(255,255,255,0.2);font-size:0.72rem;">
                                            <i class="fas fa-calendar me-1"></i>{{$ctrl.activeReleaseGroup.label}}
                                        </span>
                                    </div>
                                    <div class="progress rounded-pill mb-1" style="height:5px;background:rgba(255,255,255,0.25);">
                                        <div class="progress-bar rounded-pill" ng-style="{'width': $ctrl.activeReleaseGroup.avgProgress + '%'}" style="background:rgba(255,255,255,0.8);"></div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <small class="text-white opacity-75" style="font-size:0.68rem;">Avg Progress</small>
                                        <small class="text-white fw-bold" style="font-size:0.68rem;">{{$ctrl.activeReleaseGroup.avgProgress}}%</small>
                                    </div>
                                </div>
                                <!-- Controls list -->
                                <div class="rounded-3 border" style="max-height:220px;overflow-y:auto;background:#f8fafc;">
                                    <div ng-if="$ctrl.getAllReleaseControls().length === 0" class="text-center py-4 text-muted small">
                                        <i class="fas fa-calendar-times opacity-25 mb-1"></i>
                                        <p class="mb-0">No release dates set on controls yet</p>
                                    </div>
                                    <div ng-repeat="c in ($ctrl.activeReleaseGroup ? $ctrl.activeReleaseGroup.controls : $ctrl.getAllReleaseControls()) track by c.controlId"
                                         class="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style="border-color:#f1f5f9 !important;font-size:0.78rem;">
                                        <div class="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold"
                                             style="width:28px;height:28px;font-size:0.6rem;background:linear-gradient(135deg,#6366f1,#4f46e5);">
                                            {{c.progress || 0}}%
                                        </div>
                                        <span class="text-dark flex-grow-1" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="{{c.description}}">{{c.description}}</span>
                                        <span class="badge rounded-pill flex-shrink-0" style="font-size:0.6rem;background:#eef2ff;color:#4f46e5;">{{c.statusName || 'No Status'}}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Right: Pie chart — always rendered so canvas exists -->
                            <div class="col-md-7">
                                <div class="card border-0 shadow-sm rounded-3 h-100">
                                    <div class="card-header border-0 py-2 px-3" style="background:#1e3a5f;">
                                        <span class="fw-bold text-white small">
                                            <i class="fas fa-chart-pie me-2"></i>
                                            {{$ctrl.activeReleaseGroup ? $ctrl.activeReleaseGroup.label : 'All Releases'}} — Status Distribution
                                        </span>
                                    </div>
                                    <div class="card-body p-3 d-flex align-items-center justify-content-center">
                                        <div style="height:260px;width:100%;">
                                            <canvas id="releaseStatusPieChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Controls by Status & Test Cases by Type Row -->
        <div class="row g-4 mb-5">
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-layer-group me-2 text-indigo"></i>Controls by Status</h5>
                        <span class="badge rounded-pill" style="background:#eef2ff;color:#4f46e5;font-size:0.72rem;">{{$ctrl.store.allControls.length}} total</span>
                    </div>
                    <div class="card-body p-3">
                        <div style="height: 220px;">
                            <canvas id="controlsByStatusChart"></canvas>
                        </div>

                        <!-- Developer Metrics -->
                        <div class="mt-3">
                            <div class="fw-bold text-secondary mb-2" style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;">
                                <i class="fas fa-user-gear me-1"></i>Developer Breakdown
                            </div>
                            <div ng-repeat="dev in $ctrl.developerMetrics track by $index" class="mb-2 p-2 rounded-3" style="background:#f8fafc;">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                             style="width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#4f46e5);font-size:0.72rem;">
                                            {{dev.name.charAt(0).toUpperCase()}}
                                        </div>
                                        <span class="fw-semibold text-dark" style="font-size:0.82rem;">{{dev.name}}</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-muted" style="font-size:0.72rem;">{{dev.controls}} controls</span>
                                        <span class="fw-bold" style="font-size:0.78rem;color:#6366f1;">{{dev.avgProgress}}%</span>
                                    </div>
                                </div>
                                <!-- Progress bar -->
                                <div class="progress rounded-pill mb-1" style="height:5px;background:#e2e8f0;">
                                    <div class="progress-bar rounded-pill" ng-style="{'width': dev.avgProgress + '%'}"
                                         style="background:linear-gradient(90deg,#6366f1,#10b981);"></div>
                                </div>
                                <!-- Status pills -->
                                <div class="d-flex flex-wrap gap-1">
                                    <span ng-repeat="st in dev.statuses track by $index"
                                          class="badge rounded-pill"
                                          ng-style="{'background': st.color + '22', 'color': st.color, 'border': '1px solid ' + st.color + '44'}"
                                          style="font-size:0.65rem;padding:2px 7px;">
                                        {{st.name}} ({{st.count}})
                                    </span>
                                </div>
                            </div>
                            <div ng-if="!$ctrl.developerMetrics || $ctrl.developerMetrics.length === 0" class="text-center text-muted small py-2">
                                No developer data
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-flask me-2 text-purple"></i>Test Cases by Type</h5>
                    </div>
                    <div class="card-body p-3">
                        <div style="height: 180px; width: 100%;">
                            <canvas id="testCasesByTypeChart"></canvas>
                        </div>
                        <!-- Per-type metric mini cards -->
                        <div class="row g-2 mt-2">
                            <div ng-repeat="tm in $ctrl.tcTypeMetrics" class="col-6">
                                <div class="rounded-3 p-2 d-flex align-items-center gap-2 hover-shadow-lg"
                                     style="background: {{tm.bg}}; cursor: pointer; transition: all 0.2s ease;"
                                     ng-click="$ctrl.showTcTypeBreakdown(tm.type)">
                                    <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                         style="width:36px;height:36px;background:rgba(255,255,255,0.25);">
                                        <i class="fas {{tm.icon}} text-white" style="font-size:0.9rem;"></i>
                                    </div>
                                    <div class="flex-grow-1 overflow-hidden">
                                        <div class="fw-bold text-white" style="font-size:1.1rem;line-height:1;">{{tm.count}}</div>
                                        <div class="text-white opacity-75" style="font-size:0.65rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{tm.type}}</div>
                                        <div class="progress rounded-pill mt-1" style="height:3px;background:rgba(255,255,255,0.25);">
                                            <div class="progress-bar rounded-pill" ng-style="{'width': tm.pct + '%'}" style="background:rgba(255,255,255,0.8);"></div>
                                        </div>
                                    </div>
                                    <div class="text-white fw-bold flex-shrink-0" style="font-size:0.75rem;">{{tm.pct}}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

        <!-- TC Type Breakdown Modal -->
        <div ng-if="$ctrl.selectedTcType" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;" ng-click="$ctrl.closeTcBreakdown($event)">
            <div class="card border-0 shadow-lg rounded-4" style="width:480px;max-width:95vw;" ng-click="$event.stopPropagation()">
                <div class="card-header border-0 rounded-top-4 py-3 px-4 d-flex justify-content-between align-items-center" ng-style="{'background': $ctrl.selectedTcTypeBg}">
                    <div>
                        <h5 class="fw-bold text-white mb-0"><i class="fas fa-flask me-2"></i>{{$ctrl.selectedTcType}}</h5>
                        <small class="text-white opacity-75">{{$ctrl.selectedTcTypeTotal}} test cases</small>
                    </div>
                    <button class="btn btn-sm rounded-circle" style="background:rgba(255,255,255,0.2);color:white;width:32px;height:32px;" ng-click="$ctrl.selectedTcType=null">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <div style="height:220px;">
                        <canvas id="tcBreakdownChart"></canvas>
                    </div>
                    <div class="row g-2 mt-3">
                        <div ng-repeat="item in $ctrl.selectedTcTypeBreakdown" class="col-6">
                            <div class="d-flex align-items-center gap-2 p-2 rounded-3" style="background:#f8fafc;">
                                <div class="rounded-circle flex-shrink-0" ng-style="{'background': $ctrl.getTcStatusColor(item.status)}" style="width:10px;height:10px;"></div>
                                <span class="small text-dark fw-bold flex-grow-1">{{item.status}}</span>
                                <span class="small fw-bold" ng-style="{'color': $ctrl.getTcStatusColor(item.status)}">{{item.count}} <span class="text-muted">({{item.pct}}%)</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                </div>
            </div>
        </div>

        <!-- Month Releases Modal -->
        <div class="modal fade" id="monthReleasesModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 bg-gradient-indigo text-white rounded-top-4 py-4">
                        <h5 class="modal-title fw-bold">
                            <i class="fas fa-calendar-days me-2"></i>
                            {{$ctrl.selectedMonthName}} {{$ctrl.currentYear}} Releases
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div ng-if="$ctrl.selectedMonthReleases.length > 0">
                            <div class="alert alert-info border-0 rounded-3 mb-4">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>{{$ctrl.selectedMonthReleases.length}}</strong> release(s) scheduled for {{$ctrl.selectedMonthName}}
                            </div>
                            
                            <div class="list-group list-group-flush">
                                <div ng-repeat="release in $ctrl.selectedMonthReleases" 
                                     class="list-group-item border rounded-3 mb-3 p-4 shadow-sm hover-shadow-lg"
                                     style="transition: all 0.3s ease; cursor: pointer;"
                                     ng-click="$ctrl.showReleaseDetails(release)">
                                    <div class="d-flex align-items-start">
                                        <div class="release-icon bg-indigo text-white rounded-3 p-3 me-3 shadow-sm" 
                                             style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-rocket fs-4"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <h6 class="fw-bold text-dark mb-0">
                                                    {{release.releaseName}}
                                                    <i class="fas fa-chevron-right ms-2 text-muted small"></i>
                                                </h6>
                                                <span class="badge bg-success rounded-pill px-3 py-2">
                                                    <i class="fas fa-calendar-check me-1"></i>
                                                    {{$ctrl.formatReleaseDate(release.releaseDate)}}
                                                </span>
                                            </div>
                                            <p class="text-muted mb-2" ng-if="release.description">
                                                <i class="fas fa-align-left me-2 text-indigo"></i>
                                                {{release.description || 'No description available'}}
                                            </p>
                                            <div class="d-flex gap-3 mt-3">
                                                <small class="text-muted">
                                                    <i class="fas fa-code-branch me-1 text-primary"></i>
                                                    Version: <span class="fw-bold text-dark">{{release.version || 'N/A'}}</span>
                                                </small>
                                                <small class="text-muted">
                                                    <i class="fas fa-tasks me-1 text-info"></i>
                                                    Controls: <span class="fw-bold text-dark">{{$ctrl.getReleaseControlCount(release.releaseId)}}</span>
                                                </small>
                                                <small class="text-muted">
                                                    <i class="fas fa-clock me-1 text-warning"></i>
                                                    Status: <span class="badge bg-warning-subtle text-warning">Scheduled</span>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div ng-if="$ctrl.selectedMonthReleases.length === 0" class="text-center py-5">
                            <div class="mb-4">
                                <i class="fas fa-calendar-xmark text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
                            </div>
                            <h5 class="text-muted mb-2">No Releases Scheduled</h5>
                            <p class="text-muted small">There are no releases planned for {{$ctrl.selectedMonthName}} {{$ctrl.currentYear}}</p>
                        </div>
                    </div>
                    <div class="modal-footer border-0 bg-light rounded-bottom-4">
                        <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Release Details Modal -->
        <div class="modal fade" id="releaseDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 bg-gradient-indigo text-white rounded-top-4 py-4">
                        <div>
                            <h5 class="modal-title fw-bold mb-1">
                                <i class="fas fa-rocket me-2"></i>
                                {{$ctrl.selectedRelease.releaseName}}
                            </h5>
                            <small class="text-white-50">
                                <i class="fas fa-calendar me-1"></i>
                                {{$ctrl.formatReleaseDate($ctrl.selectedRelease.releaseDate)}}
                            </small>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-4">
                            <!-- Left Side: Status Progress Bars -->
                            <div class="col-md-5">
                                <div class="card border-0 shadow-sm rounded-4 h-100">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h6 class="fw-bold text-dark mb-0">
                                            <i class="fas fa-chart-bar me-2 text-indigo"></i>
                                            Status Progress Overview
                                        </h6>
                                    </div>
                                    <div class="card-body p-4">
                                        <div ng-if="$ctrl.releaseStatusProgress.length > 0">
                                            <div ng-repeat="statusItem in $ctrl.releaseStatusProgress" class="mb-4">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <div class="d-flex align-items-center">
                                                        <div class="status-dot rounded-circle me-2" 
                                                             ng-style="{'background-color': statusItem.color}"
                                                             style="width: 12px; height: 12px;"></div>
                                                        <span class="fw-bold text-dark small">{{statusItem.statusName}}</span>
                                                    </div>
                                                    <div class="text-end">
                                                        <span class="badge rounded-pill px-2 py-1 small"
                                                              ng-style="{'background-color': statusItem.color}">
                                                            {{statusItem.count}} controls
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="progress rounded-pill shadow-sm" style="height: 12px; background: #f1f5f9;">
                                                    <div class="progress-bar rounded-pill" 
                                                         ng-style="{'width': statusItem.avgProgress + '%', 'background-color': statusItem.color}"
                                                         style="transition: width 0.6s ease;">
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-between mt-1">
                                                    <small class="text-muted">Average Progress</small>
                                                    <small class="fw-bold" ng-style="{'color': statusItem.color}">
                                                        {{statusItem.avgProgress}}%
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div ng-if="$ctrl.releaseStatusProgress.length === 0" class="text-center py-5">
                                            <i class="fas fa-chart-bar text-muted" style="font-size: 3rem; opacity: 0.3;"></i>
                                            <p class="text-muted mt-3">No status data available</p>
                                        </div>
                                        <div class="mt-4 pt-3 border-top">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-muted small">Total Controls:</span>
                                                <span class="fw-bold text-dark">{{$ctrl.releaseControls.length}}</span>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span class="text-muted small">Overall Progress:</span>
                                                <span class="fw-bold text-success">{{$ctrl.releaseAverageProgress}}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Side: Controls List -->
                            <div class="col-md-7">
                                <div class="card border-0 shadow-sm rounded-4 h-100">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h6 class="fw-bold text-dark mb-0">
                                            <i class="fas fa-list-check me-2 text-success"></i>
                                            Release Controls
                                        </h6>
                                    </div>
                                    <div class="card-body p-0" style="max-height: 400px; overflow-y: auto;">
                                        <div ng-if="$ctrl.releaseControls.length > 0">
                                            <div ng-repeat="control in $ctrl.releaseControls" 
                                                 class="border-bottom p-3 hover-bg-light"
                                                 style="transition: all 0.2s ease;">
                                                <div class="d-flex align-items-start">
                                                    <div class="me-3">
                                                        <div class="status-badge rounded-circle d-flex align-items-center justify-content-center"
                                                             ng-style="{'background-color': $ctrl.getStatusColor(control.statusName)}"
                                                             style="width: 40px; height: 40px;">
                                                            <i class="fas fa-check text-white"></i>
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h6 class="fw-bold text-dark mb-1">{{control.controlName}}</h6>
                                                        <p class="text-muted small mb-2">{{control.description}}</p>
                                                        <div class="mb-2" ng-if="control.releaseName">
                                                            <span class="badge bg-light text-dark border px-2 py-1 small">
                                                                <i class="fas fa-rocket me-1 text-indigo"></i>
                                                                {{control.releaseName}}
                                                            </span>
                                                        </div>
                                                        <div class="d-flex gap-3 align-items-center">
                                                            <span class="badge rounded-pill px-2 py-1 small"
                                                                  ng-style="{'background-color': $ctrl.getStatusColor(control.statusName)}">
                                                                {{control.statusName}}
                                                            </span>
                                                            <div class="flex-grow-1">
                                                                <div class="progress rounded-pill" style="height: 6px;">
                                                                    <div class="progress-bar bg-success" 
                                                                         ng-style="{'width': control.progress + '%'}"></div>
                                                                </div>
                                                            </div>
                                                            <span class="text-muted small fw-bold">{{control.progress}}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div ng-if="$ctrl.releaseControls.length === 0" class="text-center py-5">
                                            <i class="fas fa-inbox text-muted" style="font-size: 3rem; opacity: 0.3;"></i>
                                            <p class="text-muted mt-3">No controls assigned to this release</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 bg-light rounded-bottom-4">
                        <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, $timeout, $rootScope, $scope, AuthService, NotificationService) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Final values for display
        ctrl.averageProgress = 0;
        ctrl.employeesWorkload = [];

        // Defects
        ctrl.allDefects = [];
        ctrl.allTestCases = [];
        ctrl.loadingDefects = false;
        ctrl.defectFilter = 'All';
        ctrl.currentUser = AuthService.getUser();

        // Main Refresh Function
        ctrl.refreshDashboard = function () {
            if (!ctrl.store.allControls || ctrl.store.allControls.length === 0) {
                ctrl.averageProgress = 0;
                ctrl.employeesWorkload = [];
                return;
            }

            // 1. Calculate Average Progress
            var totalProgress = 0;
            ctrl.store.allControls.forEach(function (c) {
                totalProgress += (c.progress || 0);
            });
            ctrl.averageProgress = Math.round(totalProgress / ctrl.store.allControls.length);

            // 2. Defect Stats — use correct status names
            ctrl.activeDefectsCount = ctrl.allDefects.filter(function(d) {
                return d.status === 'Open' || d.status === 'In Dev' || d.status === 'Re-Open' || d.status === 'Fixed';
            }).length;

            // 3. Calculate Employee Workload
            if (ctrl.store.employees && ctrl.store.employees.length > 0) {
                var empMap = {};
                ctrl.store.allControls.forEach(function (control) {
                    var id = control.employeeId;
                    if (!empMap[id]) empMap[id] = { count: 0, total: 0 };
                    empMap[id].count++;
                    empMap[id].total += (control.progress || 0);
                });

                var workloadArray = [];
                ctrl.store.employees.forEach(function (emp) {
                    if (empMap[emp.id]) {
                        workloadArray.push({
                            employeeId: emp.id,
                            employeeName: emp.employeeName,
                            controlCount: empMap[emp.id].count,
                            avgProgress: Math.round(empMap[emp.id].total / empMap[emp.id].count)
                        });
                    }
                });

                // Sort and Assign
                workloadArray.sort((a, b) => b.controlCount - a.controlCount);

                // Only assign if different to prevent digest triggers
                if (JSON.stringify(ctrl.employeesWorkload) !== JSON.stringify(workloadArray)) {
                    ctrl.employeesWorkload = workloadArray;
                }
            }

            // 4. Release Groups — controls grouped by release date
            var releaseMap = {};
            var releaseBgs = [
                'linear-gradient(135deg,#6366f1,#4f46e5)',
                'linear-gradient(135deg,#10b981,#059669)',
                'linear-gradient(135deg,#f59e0b,#d97706)',
                'linear-gradient(135deg,#ef4444,#dc2626)',
                'linear-gradient(135deg,#3b82f6,#2563eb)',
                'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                'linear-gradient(135deg,#f97316,#ea580c)',
                'linear-gradient(135deg,#94a3b8,#64748b)'
            ];

            var getUTCDateKey = function(dateVal) {
                if (!dateVal) return null;
                var ds = typeof dateVal === 'string' ? dateVal : dateVal.toISOString();
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var d = new Date(ds);
                return d.getUTCFullYear() + '-' + ('0'+(d.getUTCMonth()+1)).slice(-2) + '-' + ('0'+d.getUTCDate()).slice(-2);
            };

            var formatDateKey = function(key) {
                var parts = key.split('-');
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return months[parseInt(parts[1])-1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];
            };

            ctrl.store.allControls.forEach(function(c) {
                var dateKeys = new Set();

                // Main control release date
                var mainKey = getUTCDateKey(c.releaseDate);
                if (mainKey) dateKeys.add(mainKey);

                // All sub-objective release dates
                if (c.subDescriptions) {
                    try {
                        var subs = JSON.parse(c.subDescriptions);
                        if (Array.isArray(subs)) {
                            subs.forEach(function(sub) {
                                var subKey = getUTCDateKey(sub.releaseDate);
                                if (subKey) dateKeys.add(subKey);
                            });
                        }
                    } catch(e) {}
                }

                // Add control to each date group it belongs to
                dateKeys.forEach(function(key) {
                    if (!releaseMap[key]) releaseMap[key] = [];
                    // Avoid duplicates
                    if (!releaseMap[key].find(function(x){ return x.controlId === c.controlId; })) {
                        releaseMap[key].push(c);
                    }
                });
            });

            var bgIdx = 0;
            ctrl.releaseGroups = Object.keys(releaseMap).sort().map(function(key) {
                var controls = releaseMap[key];
                var totalProg = controls.reduce(function(s,c){ return s+(c.progress||0); }, 0);
                var statusCount = {};
                controls.forEach(function(c) {
                    var s = c.statusName || 'No Status';
                    statusCount[s] = (statusCount[s]||0)+1;
                });
                var statuses = Object.keys(statusCount).map(function(s){ return {name:s, count:statusCount[s]}; }).sort(function(a,b){return b.count-a.count;}).slice(0,3);
                var bg = releaseBgs[bgIdx % releaseBgs.length]; bgIdx++;
                return {
                    dateKey: key,
                    label: formatDateKey(key),
                    controls: controls,
                    avgProgress: controls.length > 0 ? Math.round(totalProg/controls.length) : 0,
                    statuses: statuses,
                    bg: bg,
                    _open: false
                };
            });

            // 5. Re-render Charts
            $timeout(function () {
                ctrl.initCharts();
                ctrl.drawReleaseStatusPie();
            }, 100);
        };

        // Watch for data changes from API service
        $scope.$watch(function () {
            return ctrl.store.allControls ? ctrl.store.allControls.length : 0;
        }, function (newVal, oldVal) {
            if (newVal > 0) {
                ctrl.refreshDashboard();
            }
        });

        // Watch for releases data changes
        $scope.$watch(function () {
            return ctrl.store.upcomingReleases ? JSON.stringify(ctrl.store.upcomingReleases) : '';
        }, function (newVal, oldVal) {
            if (newVal !== oldVal && newVal !== '') {
                console.log('Releases data changed, refreshing roadmap');
                // Force update the roadmap display
                $timeout(function () {
                    ctrl.refreshDashboard();
                }, 100);
            }
        });

        ctrl.$onInit = function () {
            ctrl.loadDashboardData();
            ctrl.loadQAChartData();
            ctrl.currentYear = new Date().getFullYear();
            ctrl.todayYear = new Date().getFullYear(); // Initialize today's year
            ctrl.currentViewMonth = new Date().getMonth(); // Initialize current viewing month
            ctrl.hoveredMonth = null;
            ctrl.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            ctrl.monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            ctrl.selectedMonthReleases = [];
            ctrl.selectedMonthName = '';
            ctrl.selectedRelease = {};
            ctrl.releaseControls = [];
            ctrl.releaseAverageProgress = 0;
            ctrl.releaseStatusChart = null;
            ctrl.releaseStatusProgress = [];
            ctrl.roadmapCache = null;
            ctrl.defectFilter = 'All';
            ctrl.developerMetrics = [];
            ctrl.releaseGroups = [];
            ctrl.selectedReleaseGroup = '';
            ctrl.activeReleaseGroup = null;
            ctrl.releaseStatusPieChart = null;
        };

        // Load dashboard data for current team
        ctrl.loadDashboardData = function () {
            var teamId = AuthService.getTeamId();
            ctrl.currentTeamName = AuthService.getTeamName();

            console.log('Dashboard loading data for team:', teamId, ctrl.currentTeamName);

            // Load data for current team
            ApiService.loadEmployees(teamId).then(function () {
                return ApiService.loadControlTypes(teamId);
            }).then(function () {
                // Load ALL releases (no teamId filter) so Release Hub shows all scheduled releases
                return ApiService.loadReleases();
            }).then(function () {
                return ApiService.loadAllControls(teamId);
            }).then(function () {
                console.log('All data loaded, refreshing dashboard');
                ctrl.refreshDashboard();

                // Force roadmap update after a delay
                $timeout(function () {
                    console.log('Force updating roadmap after data load');
                    ctrl.forceRoadmapUpdate();
                }, 500);

                console.log('Dashboard data loaded successfully');
            }).catch(function (error) {
                console.error('Error loading dashboard data:', error);
            });
        };

        // Listen for team changes
        var teamListener = $rootScope.$on('teamChanged', function () {
            ctrl.loadDashboardData();
            ctrl.loadQAChartData();
        });

        // Cleanup
        ctrl.$onDestroy = function () {
            if (teamListener) teamListener();
        };

        ctrl.getAllReleaseControls = function() {
            // Return all controls that have any release date (deduplicated)
            var seen = {};
            var result = [];
            (ctrl.releaseGroups || []).forEach(function(rg) {
                rg.controls.forEach(function(c) {
                    if (!seen[c.controlId]) {
                        seen[c.controlId] = true;
                        result.push(c);
                    }
                });
            });
            return result;
        };

        ctrl.onReleaseGroupChange = function() {
            ctrl.activeReleaseGroup = ctrl.selectedReleaseGroup
                ? (ctrl.releaseGroups.find(function(rg) { return rg.dateKey === ctrl.selectedReleaseGroup; }) || null)
                : null;
            $timeout(function() { ctrl.drawReleaseStatusPie(); }, 200);
        };

        ctrl.drawReleaseStatusPie = function() {
            var ctx = document.getElementById('releaseStatusPieChart');
            if (!ctx) return;
            if (ctrl.releaseStatusPieChart) { ctrl.releaseStatusPieChart.destroy(); ctrl.releaseStatusPieChart = null; }

            // Use selected release group, or all release controls, or all controls as fallback
            var controls = ctrl.activeReleaseGroup
                ? ctrl.activeReleaseGroup.controls
                : (ctrl.releaseGroups && ctrl.releaseGroups.length > 0
                    ? ctrl.getAllReleaseControls()
                    : ctrl.store.allControls || []);

            var statusColors = {
                'Analyze': '#6366f1', 'HLD': '#8b5cf6', 'LLD': '#3b82f6',
                'Development': '#f59e0b', 'Dev Testing': '#f97316',
                'QA': '#10b981', 'On Hold': '#94a3b8', 'Completed': '#059669',
                'Not Started': '#d1d5db'
            };

            var statusMap = {};
            controls.forEach(function(c) {
                var s = c.statusName && c.statusName.trim() ? c.statusName.trim() : 'Not Started';
                statusMap[s] = (statusMap[s] || 0) + 1;
            });

            var labels = Object.keys(statusMap);
            var data = labels.map(function(s) { return statusMap[s]; });
            var colors = labels.map(function(s) { return statusColors[s] || '#6366f1'; });

            if (!labels.length) {
                labels = ['No Data']; data = [1]; colors = ['#e5e7eb'];
            }

            ctrl.releaseStatusPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{ data: data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 14 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { usePointStyle: true, boxWidth: 10, padding: 12, font: { size: 11, family: "'Inter', sans-serif" } }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(c) {
                                    var total = c.dataset.data.reduce(function(a,b){return a+b;},0);
                                    return ' ' + c.label + ': ' + c.parsed + ' (' + (total>0?Math.round(c.parsed/total*100):0) + '%)';
                                }
                            }
                        }
                    }
                }
            });
        };

        ctrl.backToControls = function () {
            $rootScope.currentView = 'controls';
            $rootScope.$broadcast('viewChanged', 'controls');
        };

        ctrl.formatMonth = function (date) {
            if (!date) return '???';
            var d = new Date(date);
            return d.toLocaleString('en-US', { month: 'short' });
        };

        ctrl.formatDay = function (date) {
            if (!date) return '00';
            var d = new Date(date);
            return ('0' + d.getDate()).slice(-2);
        };

        // Release Roadmap Functions
        ctrl.getMonthName = function (monthIndex) {
            return ctrl.monthNames[monthIndex];
        };

        ctrl.getMonthReleaseCount = function (monthIndex) {
            var currentTeamId = AuthService.getTeamId();
            var releasesInMonth = {};

            var matchesMonth = function(dateVal) {
                if (!dateVal) return false;
                // Append Z if no timezone info to treat as UTC
                var ds = typeof dateVal === 'string' ? dateVal : dateVal.toISOString();
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var d = new Date(ds);
                return d.getUTCFullYear() === ctrl.currentYear && d.getUTCMonth() === monthIndex;
            };

            // Source 1: releases linked to controls (team-filtered)
            if (ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function(control) {
                    if (control.releaseId && control.releaseDate &&
                        parseInt(control.teamId) === parseInt(currentTeamId) &&
                        matchesMonth(control.releaseDate)) {
                        releasesInMonth[control.releaseId] = true;
                    }
                });
            }

            // Source 2: all releases in store
            if (ctrl.store.releases) {
                ctrl.store.releases.forEach(function(r) {
                    if (r.releaseDate && matchesMonth(r.releaseDate)) {
                        releasesInMonth[r.releaseId] = true;
                    }
                });
            }

            return Object.keys(releasesInMonth).length;
        };

        // Watch for team changes and force roadmap refresh
        $scope.$watch(function () {
            return AuthService.getTeamId();
        }, function (newTeamId, oldTeamId) {
            if (newTeamId !== oldTeamId && newTeamId !== null && newTeamId !== undefined) {
                console.log('Team ID changed from', oldTeamId, 'to', newTeamId);
                // Clear roadmap cache and force refresh
                ctrl.roadmapCache = null;
                $timeout(function () {
                    ctrl.forceRoadmapUpdate();
                }, 1500);
            }
        });

        ctrl.forceRoadmapUpdate = function () {
            console.log('Force updating roadmap display');
            // Clear cache and trigger digest cycle
            ctrl.roadmapCache = null;
            if (!$scope.$$phase) { 
                $scope.$apply();
            }
        };

        ctrl.refreshRoadmap = function () {
            // Load ALL releases (no team filter) for the Release Hub
            ApiService.loadReleases().then(function () {
                ctrl.forceRoadmapUpdate();
                if (NotificationService) {
                    NotificationService.show('Roadmap refreshed', 'success');
                }
            }).catch(function (error) {
                console.error('Error refreshing roadmap:', error);
            });
        };

        // Year Navigation Functions
        ctrl.changeYear = function (direction) {
            ctrl.currentYear += direction;
            console.log('Changed year to:', ctrl.currentYear);

            // Don't reset currentViewMonth - keep the same month when changing years
            // This allows viewing the same month across different years

            // Clear roadmap cache and force refresh
            ctrl.roadmapCache = null;
            ctrl.forceRoadmapUpdate();

            // Show notification
            if (NotificationService) {
                NotificationService.show('Viewing releases for ' + ctrl.currentYear, 'info');
            }
        };

        ctrl.goToCurrentYear = function () {
            ctrl.currentYear = ctrl.todayYear;
            ctrl.currentViewMonth = new Date().getMonth(); // Reset to current month when going to current year
            console.log('Returned to current year:', ctrl.currentYear);

            // Clear roadmap cache and force refresh
            ctrl.roadmapCache = null;
            ctrl.forceRoadmapUpdate();

            // Show notification
            if (NotificationService) {
                NotificationService.show('Returned to current year ' + ctrl.currentYear, 'success');
            }
        };

        // Month Navigation Functions
        ctrl.navigateMonth = function (direction) {
            var newMonth = ctrl.currentViewMonth + direction;
            var newYear = ctrl.currentYear;

            // Handle year boundary
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }

            // Check if we can navigate to this month (past, current, or next month only)
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var targetDate = new Date(newYear, newMonth, 1);
            var nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

            // Allow viewing any month
            if (!ctrl._isMonthAccessible(monthIndex)) {
                NotificationService.show('Future months beyond next month are not accessible.', 'warning');
                return;
            }

            ctrl.currentViewMonth = newMonth;
            ctrl.currentYear = newYear;

            console.log('Navigated to:', ctrl.monthFullNames[newMonth], newYear);

            // Force refresh
            ctrl.forceRoadmapUpdate();
        };

        ctrl.canNavigateToPreviousMonth = function () {
            // Always allow navigation to previous months (past months allowed)
            return true;
        };

        ctrl.goToCurrentMonth = function () {
            var today = new Date();
            ctrl.currentViewMonth = today.getMonth();
            ctrl.currentYear = today.getFullYear();

            console.log('Returned to current month:', ctrl.monthFullNames[ctrl.currentViewMonth], ctrl.currentYear);

            // Force refresh
            ctrl.forceRoadmapUpdate();

            if (NotificationService) {
                NotificationService.show('Returned to current month', 'success');
            }
        };

        ctrl.isCurrentMonth = function () {
            var today = new Date();
            return ctrl.currentViewMonth === today.getMonth() && ctrl.currentYear === today.getFullYear();
        };

        ctrl.getCurrentMonthReleases = function () {
            var currentMonth = new Date().getMonth();
            var currentYear = new Date().getFullYear();

            // Only show current month count if viewing current year
            if (ctrl.currentYear === currentYear) {
                return ctrl.getMonthReleaseCount(currentMonth);
            }

            return 0;
        };

        // Helper: is a month accessible?
        // Rule: past years = all accessible, current year = up to next month, future = locked
        ctrl._isMonthAccessible = function(monthIndex) {
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            // Past years: always accessible
            if (ctrl.currentYear < currentYear) return true;
            // Future years beyond next month boundary: locked
            if (ctrl.currentYear > currentYear) return false;
            // Current year: accessible up to and including next month
            return monthIndex <= currentMonth + 1;
        };

        ctrl.getMonthCardClass = function (monthIndex) {
            var count = ctrl.getMonthReleaseCount(monthIndex);
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var isHovered = ctrl.hoveredMonth === monthIndex;
            var accessible = ctrl._isMonthAccessible(monthIndex);

            if (!accessible) {
                return 'bg-light text-muted border-light opacity-50';
            }
            if (isHovered) {
                return 'bg-indigo text-white';
            }
            if (monthIndex === currentMonth && ctrl.currentYear === currentYear) {
                return 'bg-success-subtle border-success';
            }
            if (count > 0) {
                return 'bg-light border-indigo';
            }
            return 'bg-white border-light';
        };

        ctrl.getMonthCardStyle = function (monthIndex) {
            var accessible = ctrl._isMonthAccessible(monthIndex);
            return { 'cursor': accessible ? 'pointer' : 'not-allowed' };
        };

        ctrl.isPastMonth = function (monthIndex) {
            var today = new Date();
            var targetDate = new Date(ctrl.currentYear, monthIndex, 1);
            var currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return targetDate < currentMonthStart;
        };

        ctrl.isRestrictedMonth = function(monthIndex) {
            return !ctrl._isMonthAccessible(monthIndex);
        };

        ctrl.getMonthTextClass = function (monthIndex) {
            var currentMonth = new Date().getMonth();
            var currentYear = new Date().getFullYear();
            var isHovered = ctrl.hoveredMonth === monthIndex;

            if (isHovered) {
                return 'text-white';
            }

            // Only highlight current month if viewing current year
            if (monthIndex === currentMonth && ctrl.currentYear === currentYear) {
                return 'text-success';
            }

            return 'text-dark';
        };

        ctrl.getMonthBadgeClass = function (monthIndex) {
            var count = ctrl.getMonthReleaseCount(monthIndex);
            var isHovered = ctrl.hoveredMonth === monthIndex;

            if (isHovered) {
                return 'bg-white text-indigo';
            }

            if (count === 0) {
                return 'bg-light text-muted';
            } else if (count <= 2) {
                return 'bg-success text-white';
            } else if (count <= 4) {
                return 'bg-warning text-dark';
            } else {
                return 'bg-danger text-white';
            }
        };

        ctrl.showMonthReleases = function (monthIndex) {
            console.log('=== showMonthReleases called ===');
            console.log('Month Index:', monthIndex);
            console.log('Month Name:', ctrl.monthFullNames[monthIndex]);
            console.log('Current Year:', ctrl.currentYear);

            // Check if user can access this month (past, current, or next month only)
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var targetDate = new Date(ctrl.currentYear, monthIndex, 1);
            var nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

            // Allow past months, current month, and next month only
            if (targetDate > nextMonthStart) {
                if (NotificationService) {
                    NotificationService.show('Access restricted. You can only view up to next month.', 'warning');
                }
                return;
            }

            ctrl.selectedMonthName = ctrl.monthFullNames[monthIndex];
            ctrl.selectedMonthReleases = [];
            var currentTeamId = AuthService.getTeamId();

            // Build releases map from both controls AND store.releases
            var releasesMap = {};

            var matchesMonthYear = function(dateVal) {
                if (!dateVal) return false;
                var ds = typeof dateVal === 'string' ? dateVal : dateVal.toISOString();
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var d = new Date(ds);
                return d.getUTCFullYear() === ctrl.currentYear && d.getUTCMonth() === monthIndex;
            };

            // Source 1: from controls (team-filtered)
            if (ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function (control) {
                    if (control.releaseId && control.releaseName && control.releaseDate &&
                        parseInt(control.teamId) === parseInt(currentTeamId) &&
                        matchesMonthYear(control.releaseDate)) {
                        if (!releasesMap[control.releaseId]) {
                            releasesMap[control.releaseId] = {
                                releaseId: control.releaseId,
                                releaseName: control.releaseName,
                                releaseDate: control.releaseDate,
                                description: null
                            };
                        }
                    }
                });
            }

            // Source 2: from store.releases directly (catches releases not yet linked to controls)
            if (ctrl.store.releases) {
                ctrl.store.releases.forEach(function (r) {
                    if (r.releaseDate && !releasesMap[r.releaseId] && matchesMonthYear(r.releaseDate)) {
                        releasesMap[r.releaseId] = {
                            releaseId: r.releaseId,
                            releaseName: r.releaseName,
                            releaseDate: r.releaseDate,
                            description: r.description || null
                        };
                    }
                });
            }

            // Convert map to array
            ctrl.selectedMonthReleases = Object.values(releasesMap);

            // Sort by date
            ctrl.selectedMonthReleases.sort(function (a, b) {
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            });

            console.log('Final selected releases:', ctrl.selectedMonthReleases.length, 'releases for', ctrl.selectedMonthName, 'team:', currentTeamId);
            console.log('Selected releases:', ctrl.selectedMonthReleases);

            // Show modal
            $timeout(function () {
                var modal = new bootstrap.Modal(document.getElementById('monthReleasesModal'));
                modal.show();
            }, 0);
        };

        ctrl.formatReleaseDate = function (date) {
            if (!date) return 'N/A';
            var d = new Date(date);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        };

        ctrl.getReleaseControlCount = function (releaseId) {
            if (!ctrl.store.allControls) return 0;
            var release = ctrl.store.releases && ctrl.store.releases.find(function(r) { return r.releaseId === releaseId; });
            if (!release || !release.releaseDate) {
                return ctrl.store.allControls.filter(function(c) { return c.releaseId === releaseId; }).length;
            }
            var ds = typeof release.releaseDate === 'string' ? release.releaseDate : release.releaseDate.toISOString();
            if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
            var rd = new Date(ds);
            var releaseDay = rd.getUTCFullYear() + '-' + rd.getUTCMonth() + '-' + rd.getUTCDate();
            return ctrl.store.allControls.filter(function(c) {
                if (c.releaseId === releaseId) return true;
                if (c.releaseDate) {
                    var cds = typeof c.releaseDate === 'string' ? c.releaseDate : c.releaseDate.toISOString();
                    if (cds.indexOf('Z') === -1 && cds.indexOf('+') === -1) cds += 'Z';
                    var cd = new Date(cds);
                    return cd.getUTCFullYear() + '-' + cd.getUTCMonth() + '-' + cd.getUTCDate() === releaseDay;
                }
                return false;
            }).length;
        };

        ctrl.showReleaseDetails = function (release) {
            ctrl.selectedRelease = release;

            // Match controls by releaseId OR by matching release date (UTC day comparison)
            // since many controls store the date but not the releaseId FK
            var releaseDay = null;
            if (release.releaseDate) {
                var ds = typeof release.releaseDate === 'string' ? release.releaseDate : release.releaseDate.toISOString();
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var rd = new Date(ds);
                releaseDay = rd.getUTCFullYear() + '-' + rd.getUTCMonth() + '-' + rd.getUTCDate();
            }

            ctrl.releaseControls = ctrl.store.allControls.filter(function (c) {
                // Match by releaseId
                if (c.releaseId && c.releaseId === release.releaseId) return true;
                // Match by release date (UTC day)
                if (releaseDay && c.releaseDate) {
                    var cds = typeof c.releaseDate === 'string' ? c.releaseDate : c.releaseDate.toISOString();
                    if (cds.indexOf('Z') === -1 && cds.indexOf('+') === -1) cds += 'Z';
                    var cd = new Date(cds);
                    var cDay = cd.getUTCFullYear() + '-' + cd.getUTCMonth() + '-' + cd.getUTCDate();
                    if (cDay === releaseDay) return true;
                }
                // Also check sub-objectives for matching release date
                if (releaseDay && c.subDescriptions) {
                    try {
                        var subs = JSON.parse(c.subDescriptions);
                        if (Array.isArray(subs)) {
                            return subs.some(function(sub) {
                                if (!sub.releaseDate) return false;
                                var sds = typeof sub.releaseDate === 'string' ? sub.releaseDate : new Date(sub.releaseDate).toISOString();
                                if (sds.indexOf('Z') === -1 && sds.indexOf('+') === -1) sds += 'Z';
                                var sd = new Date(sds);
                                var sDay = sd.getUTCFullYear() + '-' + sd.getUTCMonth() + '-' + sd.getUTCDate();
                                return sDay === releaseDay;
                            });
                        }
                    } catch(e) {}
                }
                return false;
            });

            // Calculate average progress
            ctrl.releaseAverageProgress = ctrl.releaseControls.length > 0
                ? Math.round(ctrl.releaseControls.reduce(function(s, c) { return s + (c.progress || 0); }, 0) / ctrl.releaseControls.length)
                : 0;

            ctrl.calculateStatusProgress();

            var monthModal = bootstrap.Modal.getInstance(document.getElementById('monthReleasesModal'));
            if (monthModal) monthModal.hide();

            $timeout(function () {
                var releaseModal = new bootstrap.Modal(document.getElementById('releaseDetailsModal'));
                releaseModal.show();
            }, 500);
        };

        ctrl.calculateStatusProgress = function () {
            var statusMap = {};

            // Group controls by status and calculate progress
            ctrl.releaseControls.forEach(function (control) {
                var statusName = control.statusName || 'No Status';

                if (!statusMap[statusName]) {
                    statusMap[statusName] = {
                        statusName: statusName,
                        count: 0,
                        totalProgress: 0,
                        avgProgress: 0,
                        color: ctrl.getStatusColor(statusName)
                    };
                }

                statusMap[statusName].count++;
                statusMap[statusName].totalProgress += (control.progress || 0);
            });

            // Calculate average progress for each status
            ctrl.releaseStatusProgress = [];
            Object.keys(statusMap).forEach(function (statusName) {
                var statusItem = statusMap[statusName];
                statusItem.avgProgress = Math.round(statusItem.totalProgress / statusItem.count);
                ctrl.releaseStatusProgress.push(statusItem);
            });

            // Sort by count (descending)
            ctrl.releaseStatusProgress.sort(function (a, b) {
                return b.count - a.count;
            });
        };

        ctrl.getStatusColor = function (statusName) {
            var colors = {
                'To Do': '#94a3b8',
                'In Progress': '#3b82f6',
                'In Review': '#f59e0b',
                'QA': '#8b5cf6',
                'Done': '#10b981',
                'Blocked': '#ef4444',
                'Analyze': '#06b6d4',
                'Design': '#ec4899',
                'Development': '#6366f1',
                'Testing': '#f97316'
            };
            return colors[statusName] || '#6b7280';
        };

        ctrl.initCharts = function () {
            // --- Status Chart ---
            var statusData = {};
            ctrl.store.allControls.forEach(function (c) {
                var s = c.statusName || 'No Status';
                statusData[s] = (statusData[s] || 0) + 1;
            });

            var statusCtx = document.getElementById('statusDistributionChart');
            if (statusCtx) {
                if (ctrl.statusChart) ctrl.statusChart.destroy();
                ctrl.statusChart = new Chart(statusCtx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(statusData),
                        datasets: [{
                            data: Object.values(statusData),
                            backgroundColor: [
                                '#6366f1', // Indigo
                                '#8b5cf6', // Violet
                                '#3b82f6', // Blue
                                '#10b981', // Emerald
                                '#f59e0b', // Amber
                                '#ef4444'  // Red
                            ],
                            borderWidth: 0,
                            hoverOffset: 20
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    font: { family: "'Inter', sans-serif", weight: 'bold' }
                                }
                            }
                        },
                        cutout: '70%'
                    }
                });
            }

            // --- Progress Chart ---
            var progressLabels = [];
            var progressValues = [];

            // Filter and sort for top 12
            var topControls = [...ctrl.store.allControls]
                .sort((a, b) => (b.progress || 0) - (a.progress || 0))
                .slice(0, 12);

            topControls.forEach(function (c) {
                var label = (c.description || 'N/A').substring(0, 20);
                progressLabels.push(label);
                progressValues.push(c.progress || 0);
            });

            var progCtx = document.getElementById('progressByDescriptionChart');
            if (progCtx) {
                if (ctrl.progChart) ctrl.progChart.destroy();
                ctrl.progChart = new Chart(progCtx, {
                    type: 'bar',
                    data: {
                        labels: progressLabels,
                        datasets: [{
                            label: 'Velocity %',
                            data: progressValues,
                            backgroundColor: 'rgba(99, 102, 241, 0.7)',
                            hoverBackgroundColor: '#4f46e5',
                            borderRadius: 12,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                grid: { display: false },
                                ticks: { font: { weight: 'bold' } }
                            },
                            x: {
                                grid: { display: false },
                                ticks: {
                                    font: { size: 10, weight: 'bold' },
                                    maxRotation: 45,
                                    minRotation: 45
                                }
                            }
                        }
                    }
                });
            }

            // --- Defect Severity Chart ---
            var severityData = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0 };
            ctrl.allDefects.forEach(function (d) {
                if (severityData.hasOwnProperty(d.severity)) {
                    severityData[d.severity]++;
                }
            });

            var defectCtx = document.getElementById('defectSeverityChart');
            if (defectCtx) {
                if (ctrl.defectChart) ctrl.defectChart.destroy();
                ctrl.defectChart = new Chart(defectCtx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(severityData),
                        datasets: [{
                            data: Object.values(severityData),
                            backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6', '#10b981'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { usePointStyle: true, boxWidth: 10, font: { size: 10, family: "'Inter', sans-serif" } }
                            }
                        }
                    }
                });
            }

            // --- Test Case Status Pie Chart ---
            var tcStatusData = {};
            var tcStatuses = ['Pass', 'Fail', 'Not Tested', 'In Progress', 'Blocked', 'On Hold', 'Not Applicable', 'Not Included'];
            tcStatuses.forEach(function (s) { tcStatusData[s] = 0; });
            (ctrl.allTestCases || []).forEach(function (tc) {
                var s = tc.status || 'Not Tested';
                tcStatusData[s] = (tcStatusData[s] || 0) + 1;
            });
            // Remove zero entries
            var tcLabels = [], tcValues = [], tcColors = [];
            var tcColorMap = {
                'Pass': '#10b981', 'Fail': '#ef4444', 'Not Tested': '#9ca3af',
                'In Progress': '#3b82f6', 'Blocked': '#dc2626', 'On Hold': '#f59e0b',
                'Not Applicable': '#d1d5db', 'Not Included': '#6b7280'
            };
            Object.keys(tcStatusData).forEach(function (k) {
                if (tcStatusData[k] > 0) {
                    tcLabels.push(k);
                    tcValues.push(tcStatusData[k]);
                    tcColors.push(tcColorMap[k] || '#6366f1');
                }
            });

            var tcCtx = document.getElementById('testCaseStatusChart');
            if (tcCtx) {
                if (ctrl.tcStatusChart) ctrl.tcStatusChart.destroy();
                ctrl.tcStatusChart = new Chart(tcCtx, {
                    type: 'pie',
                    data: {
                        labels: tcLabels.length ? tcLabels : ['No Data'],
                        datasets: [{
                            data: tcValues.length ? tcValues : [1],
                            backgroundColor: tcColors.length ? tcColors : ['#e5e7eb'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { usePointStyle: true, boxWidth: 10, padding: 12, font: { size: 11, family: "'Inter', sans-serif" } }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                                        var pct = total > 0 ? Math.round(ctx.parsed / total * 100) : 0;
                                        return ' ' + ctx.label + ': ' + ctx.parsed + ' (' + pct + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // --- Defect Status Bar Chart ---
            var defectStatusOrder = ['Open', 'In Dev', 'Fixed', 'Verified Fix', 'Re-Open', 'Deferred', 'Duplicate', 'Not a Defect', 'Closed'];
            var defectStatusCounts = {};
            defectStatusOrder.forEach(function (s) { defectStatusCounts[s] = 0; });
            (ctrl.allDefects || []).forEach(function (d) {
                var s = d.status || 'Open';
                defectStatusCounts[s] = (defectStatusCounts[s] || 0) + 1;
            });
            var defectBarColors = {
                'Open': '#ef4444', 'In Dev': '#f59e0b',
                'Fixed': '#10b981', 'Verified Fix': '#059669', 'Re-Open': '#dc2626', 'Deferred': '#8b5cf6', 'Duplicate': '#6b7280', 'Not a Defect': '#d1d5db', 'Closed': '#94a3b8'
            };

            var defectBarCtx = document.getElementById('defectStatusBarChart');
            if (defectBarCtx) {
                if (ctrl.defectBarChart) ctrl.defectBarChart.destroy();
                ctrl.defectBarChart = new Chart(defectBarCtx, {
                    type: 'bar',
                    data: {
                        labels: defectStatusOrder,
                        datasets: [{
                            label: 'Defects',
                            data: defectStatusOrder.map(function (s) { return defectStatusCounts[s]; }),
                            backgroundColor: defectStatusOrder.map(function (s) { return defectBarColors[s]; }),
                            borderRadius: 10,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1, font: { weight: 'bold' } },
                                grid: { color: '#f1f5f9' }
                            },
                            x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                        }
                    }
                });
            }

            // --- Controls by Status Chart ---
            var ctrlStatusData = {};
            ctrl.store.allControls.forEach(function (ctrl_item) {
                var s = ctrl_item.statusName && ctrl_item.statusName.trim() ? ctrl_item.statusName.trim() : 'Not Started';
                ctrlStatusData[s] = (ctrlStatusData[s] || 0) + 1;
            });
            var ctrlStatusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA', 'On Hold', 'Completed', 'Not Started'];
            var ctrlStatusColors = {
                'Analyze': '#6366f1', 'HLD': '#8b5cf6', 'LLD': '#3b82f6',
                'Development': '#f59e0b', 'Dev Testing': '#f97316',
                'QA': '#10b981', 'On Hold': '#94a3b8', 'Completed': '#059669',
                'Not Started': '#d1d5db'
            };
            // Include any statuses not in order
            Object.keys(ctrlStatusData).forEach(function(s) {
                if (ctrlStatusOrder.indexOf(s) === -1) ctrlStatusOrder.push(s);
            });

            // --- Developer Metrics ---
            var devMap = {};
            ctrl.store.allControls.forEach(function(c) {
                var empId = c.employeeId;
                var empName = c.employeeName || 'Unassigned';
                var key = empId ? String(empId) : 'unassigned';
                if (!devMap[key]) devMap[key] = { name: empName, controls: 0, totalProgress: 0, statuses: {} };
                devMap[key].controls++;
                devMap[key].totalProgress += (c.progress || 0);
                var st = c.statusName && c.statusName.trim() ? c.statusName.trim() : 'Not Started';
                devMap[key].statuses[st] = (devMap[key].statuses[st] || 0) + 1;
            });
            ctrl.developerMetrics = Object.values(devMap).map(function(d) {
                return {
                    name: d.name,
                    controls: d.controls,
                    avgProgress: d.controls > 0 ? Math.round(d.totalProgress / d.controls) : 0,
                    statuses: Object.keys(d.statuses).map(function(s) {
                        return { name: s, count: d.statuses[s], color: ctrlStatusColors[s] || '#6366f1' };
                    }).sort(function(a,b){ return b.count - a.count; })
                };
            }).sort(function(a,b){ return b.controls - a.controls; });
            var ctrlStatusLabels = ctrlStatusOrder.filter(function(s) { return ctrlStatusData[s] > 0; });
            var ctrlStatusValues = ctrlStatusLabels.map(function(s) { return ctrlStatusData[s]; });
            var ctrlStatusBgColors = ctrlStatusLabels.map(function(s) { return ctrlStatusColors[s] || '#6366f1'; });

            var ctrlStatusCtx = document.getElementById('controlsByStatusChart');
            if (ctrlStatusCtx) {
                if (ctrl.ctrlStatusChart) ctrl.ctrlStatusChart.destroy();
                ctrl.ctrlStatusChart = new Chart(ctrlStatusCtx, {
                    type: 'bar',
                    data: {
                        labels: ctrlStatusLabels.length ? ctrlStatusLabels : ['No Data'],
                        datasets: [{
                            label: 'Controls',
                            data: ctrlStatusValues.length ? ctrlStatusValues : [0],
                            backgroundColor: ctrlStatusBgColors,
                            borderRadius: 10,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1, font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } },
                            x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                        }
                    }
                });
            }

            // --- Test Cases by Type Chart ---
            var tcTypeData = {};
            (ctrl.allTestCases || []).forEach(function (tc) {
                var t = tc.testType || 'Functional';
                tcTypeData[t] = (tcTypeData[t] || 0) + 1;
            });
            var tcTypeColors = {
                'Functional': '#6366f1', 'Regression': '#f59e0b',
                'Bug Verification': '#ef4444', 'Validation': '#10b981',
                'Environment Issues': '#3b82f6', 'Technical Issues / Coding': '#dc2626',
                'Missing Requirements': '#f97316', 'Design Issues': '#8b5cf6',
                'Existing Issues / Not an Issue': '#94a3b8'
            };
            var tcTypeLabels = Object.keys(tcTypeData);
            var tcTypeValues = tcTypeLabels.map(function(k) { return tcTypeData[k]; });
            var tcTypeBgColors = tcTypeLabels.map(function(k) { return tcTypeColors[k] || '#6366f1'; });
            var tcTypeIcons = {
                'Functional': 'fa-cogs', 'Regression': 'fa-redo', 'Bug Verification': 'fa-bug',
                'Validation': 'fa-check-double', 'Environment Issues': 'fa-server',
                'Technical Issues / Coding': 'fa-code', 'Missing Requirements': 'fa-file-alt',
                'Design Issues': 'fa-drafting-compass', 'Existing Issues / Not an Issue': 'fa-archive'
            };
            var tcTypeGradients = {
                'Functional': 'linear-gradient(135deg,#6366f1,#4f46e5)',
                'Regression': 'linear-gradient(135deg,#f59e0b,#d97706)',
                'Bug Verification': 'linear-gradient(135deg,#ef4444,#dc2626)',
                'Validation': 'linear-gradient(135deg,#10b981,#059669)',
                'Environment Issues': 'linear-gradient(135deg,#3b82f6,#2563eb)',
                'Technical Issues / Coding': 'linear-gradient(135deg,#dc2626,#b91c1c)',
                'Missing Requirements': 'linear-gradient(135deg,#f97316,#ea580c)',
                'Design Issues': 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                'Existing Issues / Not an Issue': 'linear-gradient(135deg,#94a3b8,#64748b)'
            };
            var tcTotal = tcTypeValues.reduce(function(a, b) { return a + b; }, 0);
            ctrl.tcTypeMetrics = tcTypeLabels.map(function(k, i) {
                return {
                    type: k,
                    count: tcTypeData[k],
                    pct: tcTotal > 0 ? Math.round(tcTypeData[k] / tcTotal * 100) : 0,
                    bg: tcTypeGradients[k] || 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    icon: tcTypeIcons[k] || 'fa-flask'
                };
            });

            var tcTypeCtx = document.getElementById('testCasesByTypeChart');
            if (tcTypeCtx) {
                if (ctrl.tcTypeChart) ctrl.tcTypeChart.destroy();
                ctrl.tcTypeChart = new Chart(tcTypeCtx, {
                    type: 'doughnut',
                    data: {
                        labels: tcTypeLabels.length ? tcTypeLabels : ['No Data'],
                        datasets: [{
                            data: tcTypeValues.length ? tcTypeValues : [1],
                            backgroundColor: tcTypeBgColors.length ? tcTypeBgColors : ['#e5e7eb'],
                            borderWidth: 2,
                            borderColor: '#fff',
                            hoverOffset: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { usePointStyle: true, boxWidth: 10, padding: 12, font: { size: 11, family: "'Inter', sans-serif" } }
                            },
                            tooltip: { enabled: true }
                        },
                        onClick: function(evt, elements) {
                            if (elements && elements.length > 0) {
                                var idx = elements[0].index;
                                var type = tcTypeLabels[idx];
                                ctrl.showTcTypeBreakdown(type);
                            }
                        }
                    }
                });
            }

        };


        ctrl.showTcTypeBreakdown = function(type) {
            ctrl.selectedTcType = type;
            var tm = (ctrl.tcTypeMetrics || []).filter(function(m) { return m.type === type; })[0];
            ctrl.selectedTcTypeBg = tm ? tm.bg : 'linear-gradient(135deg,#6366f1,#4f46e5)';

            var filtered = (ctrl.allTestCases || []).filter(function(tc) {
                return (tc.testType || 'Functional') === type;
            });
            ctrl.selectedTcTypeTotal = filtered.length;
            var statusMap = {};
            filtered.forEach(function(tc) {
                var s = tc.status || 'Not Tested';
                statusMap[s] = (statusMap[s] || 0) + 1;
            });
            var breakdown = [];
            Object.keys(statusMap).forEach(function(s) {
                breakdown.push({
                    status: s,
                    count: statusMap[s],
                    pct: ctrl.selectedTcTypeTotal > 0 ? Math.round(statusMap[s] / ctrl.selectedTcTypeTotal * 100) : 0
                });
            });
            breakdown.sort(function(a, b) { return b.count - a.count; });
            ctrl.selectedTcTypeBreakdown = breakdown;

            $timeout(function() {
                var ctx = document.getElementById('tcBreakdownChart');
                if (!ctx) { console.warn('tcBreakdownChart not found'); return; }
                if (ctrl.tcBreakdownChart) ctrl.tcBreakdownChart.destroy();
                ctrl.tcBreakdownChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: breakdown.map(function(b) { return b.status; }),
                        datasets: [{
                            label: 'Test Cases',
                            data: breakdown.map(function(b) { return b.count; }),
                            backgroundColor: breakdown.map(function(b) { return ctrl.getTcStatusColor(b.status); }),
                            borderRadius: 10,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        var pct = breakdown[context.dataIndex].pct;
                                        return context.parsed.y + ' (' + pct + '%)';
                                    }
                                }
                            }
                        },
                        scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1, font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } },
                            x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 11 } } }
                        }
                    }
                });
            }, 500);
        };

        ctrl.closeTcBreakdown = function() {
            ctrl.selectedTcType = null;
            if (ctrl.tcBreakdownChart) { ctrl.tcBreakdownChart.destroy(); ctrl.tcBreakdownChart = null; }
        };

                ctrl.getTcStatusColor = function(status) {
            var map = {
                'Pass': '#10b981', 'Fail': '#ef4444', 'Not Tested': '#9ca3af',
                'In Progress': '#3b82f6', 'Blocked': '#dc2626', 'On Hold': '#f59e0b',
                'Not Applicable': '#d1d5db', 'Not Included': '#6b7280'
            };
            return map[status] || '#6366f1';
        };

        
        ctrl.getPassRate = function() {
            var tcs = ctrl.allTestCases || [];
            if (!tcs.length) return 0;
            var passed = tcs.filter(function(tc) { return tc.status === 'Pass'; }).length;
            return Math.round(passed / tcs.length * 100);
        };

        ctrl.getCompletedCount = function() {
            return (ctrl.store.allControls || []).filter(function(c) {
                return (c.statusName || '').toLowerCase() === 'completed';
            }).length;
        };

        ctrl.getReOpenCount = function() {
            return (ctrl.allDefects || []).filter(function(d) {
                return d.status === 'Re-Open';
            }).length;
        };

                // Defects Management
        ctrl.loadDefects = function () {
            ctrl.loadingDefects = true;
            var teamId = AuthService.getTeamId();

            ApiService.loadDefects(teamId).then(function (defects) {
                ctrl.allDefects = defects || [];
                ctrl.loadingDefects = false;
            }).catch(function (error) {
                console.error('Error loading defects:', error);
                ctrl.loadingDefects = false;
                ctrl.allDefects = [];
            });
        };

        ctrl.loadTestCases = function () {
            var teamId = AuthService.getTeamId();
            ApiService.loadTestCases(teamId).then(function (testCases) {
                ctrl.allTestCases = testCases || [];
            }).catch(function (error) {
                console.error('Error loading test cases:', error);
                ctrl.allTestCases = [];
            });
        };

        ctrl.loadQAChartData = function () {
            var teamId = AuthService.getTeamId();
            var p1 = ApiService.loadDefects(teamId).then(function (defects) {
                ctrl.allDefects = defects || [];
                ctrl.activeDefectsCount = ctrl.allDefects.filter(function (d) {
                    return d.status === 'Open' || d.status === 'In Dev' || d.status === 'Re-Open' || d.status === 'Fixed';
                }).length;
            }).catch(function () { ctrl.allDefects = []; });

            var p2 = ApiService.loadTestCases(teamId).then(function (testCases) {
                ctrl.allTestCases = testCases || [];
            }).catch(function () { ctrl.allTestCases = []; });

            return Promise.all([p1, p2]).then(function () {
                ctrl.refreshDashboard();
                $timeout(function () { ctrl.initCharts(); }, 100);
            });
        };

        ctrl.getDefectsByStatus = function (status) {
            return ctrl.allDefects.filter(function (d) {
                return d.status === status;
            });
        };

        ctrl.getMyDefects = function () {
            if (!ctrl.currentUser || !ctrl.currentUser.employeeId) return [];
            return ctrl.allDefects.filter(function (d) {
                return d.assignedToEmployeeId === ctrl.currentUser.employeeId;
            });
        };

        ctrl.isMyDefect = function (defect) {
            if (!ctrl.currentUser || !ctrl.currentUser.employeeId) return false;
            return defect.assignedToEmployeeId === ctrl.currentUser.employeeId;
        };

        ctrl.getFilteredDefects = function () {
            if (ctrl.defectFilter === 'All') {
                return ctrl.allDefects;
            } else if (ctrl.defectFilter === 'Assigned') {
                return ctrl.getMyDefects();
            } else {
                return ctrl.getDefectsByStatus(ctrl.defectFilter);
            }
        };

        ctrl.getDefectSeverityColor = function (severity) {
            switch (severity) {
                case 'Critical': return '#dc2626';
                case 'High': return '#f59e0b';
                case 'Medium': return '#3b82f6';
                case 'Low': return '#10b981';
                default: return '#6b7280';
            }
        };

        ctrl.getDefectStatusBadgeClass = function (status) {
            switch (status) {
                case 'Open': return 'bg-danger';
                case 'In Dev': return 'bg-warning text-dark';
                case 'Fixed': return 'bg-success';
                case 'Not a Defect': return 'bg-info';
                case 'Deferred': return 'bg-secondary';
                case 'Duplicate': return 'bg-dark';
                case 'Fixed': return 'bg-success';
                case 'Closed': return 'bg-secondary';
                case 'Re-Open': return 'bg-danger';
                default: return 'bg-secondary';
            }
        };

        ctrl.formatDefectDate = function (dateStr) {
            if (!dateStr) return 'N/A';
            var d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'N/A';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return day + '/' + month + '/' + year;
        };

        ctrl.viewDefectImage = function (imageUrl) {
            if (imageUrl) {
                window.open(imageUrl, '_blank');
            }
        };
    }
});

