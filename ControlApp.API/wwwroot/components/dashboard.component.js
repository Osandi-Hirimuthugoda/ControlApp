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
            <!-- Total Sub-Objectives -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#6366f1 0%,#4f46e5 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-layer-group fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Objectives</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.subObjectiveStats.total}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Total Sub-Objectives</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" style="width:100%;background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.subObjectiveStats.completed}} verified ready</small>
                </div>
            </div>
            <!-- Project Readiness -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#10b981 0%,#059669 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-flag-checkered fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Readiness</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.projectReadiness}}<span style="font-size:1rem;">%</span></h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Project Readiness</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': $ctrl.projectReadiness + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">Overall objective completion</small>
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
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Blockers & Issues</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': ($ctrl.allDefects.length > 0 ? ($ctrl.activeDefectsCount/$ctrl.allDefects.length*100) : 0) + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">Fixing in progress</small>
                </div>
            </div>
            <!-- Verification Pipeline (NEW for QA focus) -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-flask fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Verification</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.subObjectiveStats.readyQA}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Ready for QA</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" ng-style="{'width': ($ctrl.subObjectiveStats.total > 0 ? ($ctrl.subObjectiveStats.readyQA/$ctrl.subObjectiveStats.total*100) : 0) + '%'}" style="background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">Pending verification</small>
                </div>
            </div>
            <!-- Workload Insight -->
            <div class="col-xl col-md-4 col-sm-6">
                <div class="metric-card rounded-4 shadow-sm p-4 h-100" style="background: linear-gradient(135deg,#f59e0b 0%,#d97706 100%); color:white; position:relative; overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:44px;height:44px;background:rgba(255,255,255,0.2);">
                            <i class="fas fa-bolt fs-5"></i>
                        </div>
                        <span class="badge rounded-pill px-2 py-1" style="background:rgba(255,255,255,0.2);font-size:0.7rem;">Team Heat</span>
                    </div>
                    <h2 class="fw-bold mb-0" style="font-size:2rem;">{{$ctrl.store.allControls.length}}</h2>
                    <p class="mb-2 small fw-bold text-uppercase text-white" style="letter-spacing:0.05em;">Active Initiatives</p>
                    <div class="progress rounded-pill" style="height:4px;background:rgba(255,255,255,0.2);">
                        <div class="progress-bar rounded-pill" style="width:100%;background:rgba(255,255,255,0.7);"></div>
                    </div>
                    <small class="opacity-60 mt-1 d-block">{{$ctrl.currentTeamName || 'All Ops'}}</small>
                </div>
            </div>
        </div>

        <!-- Main Dashboard Content -->
        <div class="row g-4 mb-5">
            <!-- Left Column: Role-Adaptive Hero Card -->
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm objective-card h-100 overflow-hidden">
                    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle me-3 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:#eef2ff;color:#6366f1;">
                                <i class="fas fa-id-card-clip fs-5"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-dark mb-0">Personalized Command View</h5>
                                <span class="role-badge" ng-class="{'bg-indigo text-white': $ctrl.isPM(), 'bg-purple text-white': $ctrl.isQA(), 'bg-success text-white': $ctrl.isDev()}">
                                    {{$ctrl.currentUser.role || 'Contributor'}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <!-- PROJECT MANAGER VIEW: Executive Overview -->
                        <div ng-if="$ctrl.isPM()">
                            <p class="text-secondary small mb-3">Enterprise-grade project overview and team velocity insights.</p>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <div class="p-3 rounded-4 border bg-indigo-soft d-flex align-items-center justify-content-between h-100 shadow-sm border-indigo-subtle">
                                        <div class="d-flex align-items-center">
                                            <div class="rounded-circle bg-indigo text-white d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 42px; height: 42px;">
                                                <i class="fas fa-bullseye fs-5"></i>
                                            </div>
                                            <div>
                                                <div class="small fw-bold text-dark">Overall Progress</div>
                                                <div class="x-small text-muted">Across {{$ctrl.store.allControls.length}} Initiatives</div>
                                            </div>
                                        </div>
                                        <div class="text-end">
                                            <h3 class="fw-bold mb-0 text-indigo">{{$ctrl.averageProgress}}%</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="p-3 rounded-4 border bg-success-subtle d-flex align-items-center justify-content-between h-100 shadow-sm">
                                        <div class="d-flex align-items-center">
                                            <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 42px; height: 42px;">
                                                <i class="fas fa-users-gear fs-5"></i>
                                            </div>
                                            <div>
                                                <div class="small fw-bold text-dark">Active Resources</div>
                                                <div class="x-small text-muted">Allocated to Controls</div>
                                            </div>
                                        </div>
                                        <div class="text-end">
                                            <h3 class="fw-bold mb-0 text-success">{{$ctrl.employeesWorkload.length}}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-4">
                                <!-- Global Status Compact -->
                                <div class="col-md-7">
                                    <h6 class="fw-bold text-muted extra-small text-uppercase mb-2"><i class="fas fa-chart-pie me-1"></i>Distribution Flow</h6>
                                    <div class="d-flex flex-wrap gap-2">
                                        <div class="flex-grow-1 p-2 rounded-3 border bg-light text-center shadow-sm" ng-repeat="(status, count) in {Analyze: $ctrl.subObjectiveStats.analyze, Development: $ctrl.subObjectiveStats.dev, QA: $ctrl.subObjectiveStats.qa, 'Ready for QA': $ctrl.subObjectiveStats.readyQA, Completed: $ctrl.subObjectiveStats.completed}">
                                            <div class="h5 fw-bold text-dark mb-0">{{count}}</div>
                                            <div class="extra-small text-muted flex-nowrap"><span class="status-dot" style="width:6px;height:6px;" ng-class="status.toLowerCase().replace(' ', '-')"></span>{{status}}</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Top Resources -->
                                <div class="col-md-5">
                                    <div ng-if="$ctrl.employeesWorkload.length > 0">
                                        <h6 class="fw-bold text-muted extra-small text-uppercase mb-2"><i class="fas fa-fire me-1 text-warning"></i>Top Workloads</h6>
                                        <div class="d-flex flex-column gap-2">
                                            <div ng-repeat="emp in $ctrl.employeesWorkload | limitTo:3" class="d-flex align-items-center bg-light p-2 rounded-3 border shadow-sm">
                                                <div class="rounded-circle text-white d-flex align-items-center justify-content-center me-2 x-small fw-bold shadow-sm"
                                                    style="width:28px; height:28px; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                                                    {{emp.employeeName.substring(0,2).toUpperCase()}}
                                                </div>
                                                <div class="flex-grow-1">
                                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                                        <span class="x-small fw-bold text-dark text-truncate" style="max-width: 120px;">{{emp.employeeName}}</span>
                                                        <span class="badge" ng-class="emp.avgProgress > 80 ? 'bg-success' : 'bg-secondary'" style="font-size:0.55rem;">{{emp.avgProgress}}%</span>
                                                    </div>
                                                    <div class="progress rounded-pill bg-white" style="height:4px;">
                                                        <div class="progress-bar" style="background: linear-gradient(90deg, #6366f1, #10b981);" ng-style="{'width': emp.avgProgress + '%'}"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div ng-if="$ctrl.employeesWorkload.length === 0" class="text-center p-3">
                                        <span class="text-muted x-small">No active resources</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- LEAD VIEW: Global Status -->
                        <div ng-if="$ctrl.isLead() && !$ctrl.isPM()">
                            <p class="text-secondary small mb-4">Overall distribution of sub-objectives across the current team scope.</p>
                            <div class="row g-3">
                                <div class="col-md-4" ng-repeat="(status, count) in {Analyze: $ctrl.subObjectiveStats.analyze, Development: $ctrl.subObjectiveStats.dev, QA: $ctrl.subObjectiveStats.qa, 'Ready for QA': $ctrl.subObjectiveStats.readyQA, Completed: $ctrl.subObjectiveStats.completed}">
                                    <div class="p-3 rounded-4 border bg-light d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <span class="status-dot me-2" ng-class="status.toLowerCase().replace(' ', '-')"></span>
                                            <span class="small fw-bold text-muted">{{status}}</span>
                                        </div>
                                        <span class="fw-bold h5 mb-0">{{count}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- DEVELOPER VIEW: My Tasks -->
                        <div ng-if="$ctrl.isDev()">
                            <p class="text-secondary small mb-3">Your assigned sub-objectives that require attention.</p>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <tbody style="font-size: 0.85rem;">
                                        <tr ng-repeat="sub in $ctrl.mySubObjectives | limitTo:5">
                                            <td style="width: 40px;"><span class="status-dot" ng-class="sub.status.toLowerCase().replace(' ', '-')"></span></td>
                                            <td class="fw-bold">{{sub.text}}</td>
                                            <td class="text-muted small">{{sub.controlName}}</td>
                                            <td class="text-end"><span class="badge bg-light text-dark border">{{sub.status}}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- QA VIEW: Verification Pipeline -->
                        <div ng-if="$ctrl.isQA()">
                            <p class="text-secondary small mb-3">Sub-objectives ready for your verification.</p>
                            <div class="row g-2">
                                <div class="col-md-6" ng-repeat="sub in $ctrl.readyForQASubObjectives | limitTo:6">
                                    <div class="p-3 rounded-3 border-start border-4 bg-light" style="border-start-color: #f59e0b !important;">
                                        <div class="fw-bold small mb-1">{{sub.text}}</div>
                                        <div class="text-muted extra-small"><i class="fas fa-layer-group me-1"></i>{{sub.controlName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Brief Release Hub (Maintained & Optimized) -->
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-rocket me-2 text-purple"></i>Release Hub</h5>
                        <div class="d-flex gap-1">
                            <button class="btn btn-xs btn-outline-indigo px-1 py-0" ng-click="$ctrl.changeYear(-1)"><i class="fas fa-chevron-left x-small"></i></button>
                            <span class="fw-bold x-small">{{$ctrl.currentYear}}</span>
                            <button class="btn btn-xs btn-outline-indigo px-1 py-0" ng-click="$ctrl.changeYear(1)"><i class="fas fa-chevron-right x-small"></i></button>
                        </div>
                    </div>
                    <div class="card-body p-3 pt-0">
                        <div class="table-responsive">
                            <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr ng-repeat="row in [0, 1, 2]">
                                        <td ng-repeat="col in [0, 1, 2, 3]" class="p-1">
                                            <div class="month-card rounded-3 p-1 text-center border" 
                                                 ng-class="$ctrl.getMonthCardClass(row * 4 + col)"
                                                 ng-click="$ctrl.showMonthReleases(row * 4 + col)"
                                                 style="cursor: pointer; min-height: 45px;">
                                                <div class="extra-small text-uppercase mb-0 fw-bold" style="font-size: 0.6rem;">{{$ctrl.getMonthName(row * 4 + col).substring(0,3)}}</div>
                                                <div class="fw-bold small">{{$ctrl.getMonthReleaseCount(row * 4 + col)}}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- THE OBJECTIVE HUB: Overall Idea -->
        <div class="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h5 class="fw-bold text-dark mb-1"><i class="fas fa-map-location-dot me-2 text-success"></i>Operational Objective Hub</h5>
                        <p class="text-muted extra-small mb-0">Full project status breakdown across every control and sub-objective</p>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <!-- Search Filter for Objective Hub -->
                        <div class="search-box-glass shadow-sm rounded-pill p-1 bg-light border d-flex align-items-center px-3" style="width: 250px;">
                            <i class="fas fa-search text-muted me-2 small"></i>
                            <input type="text" class="form-control border-0 shadow-none bg-transparent extra-small" placeholder="Filter controls..." ng-model="$ctrl.hubSearch">
                        </div>
                        <div class="d-flex align-items-center gap-3 ms-2">
                            <span class="status-dot analyze"></span><span class="extra-small text-muted">Analyze</span>
                            <span class="status-dot development"></span><span class="extra-small text-muted">Dev</span>
                            <span class="status-dot qa"></span><span class="extra-small text-muted">QA</span>
                            <span class="status-dot ready-qa"></span><span class="extra-small text-muted">Ready QA</span>
                            <span class="status-dot completed"></span><span class="extra-small text-muted">Done</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-4 pt-0">
                <div class="row g-3">
                    <div class="col-xl-3 col-lg-4 col-md-6" ng-repeat="control in $ctrl.store.allControls | filter:$ctrl.hubSearch | limitTo:48">
                        <div class="p-3 rounded-4 border h-100 d-flex flex-column hover-shadow-lg" 
                             style="background: #ffffff; cursor: pointer; transition: all 0.2s ease;"
                             ng-click="$ctrl.goToControl(control.controlId)">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="fw-bold text-dark mb-0 text-truncate" style="font-size:0.85rem;" title="{{control.description}}">{{control.description}}</h6>
                            </div>
                            <div class="text-muted extra-small mb-3"><i class="fas fa-id-badge me-1"></i>Owner: {{$ctrl.getEmployeeName(control.employeeId)}}</div>
                            <div class="mt-auto">
                                <div class="d-flex flex-wrap gap-1 mb-2">
                                    <!-- Parsing subDescriptions in template - showing pellets for each sub-objective -->
                                    <span ng-repeat="sub in $ctrl.parseSub(control.subDescriptions) track by $index" 
                                          class="status-dot" 
                                          ng-class="sub.status.toLowerCase().replace(' ', '-')"
                                          title="{{sub.description}} - {{sub.status}}"></span>
                                    <span ng-if="!control.subDescriptions || control.subDescriptions === '[]'" class="extra-small text-muted italic">No objectives</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="progress rounded-pill flex-grow-1 me-2" style="height:4px; background:#eee;">
                                        <div class="progress-bar bg-success" ng-style="{'width': control.progress + '%'}"></div>
                                    </div>
                                    <span class="extra-small fw-bold">{{control.progress}}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-sm btn-light border rounded-pill px-4" ng-click="$ctrl.backToControls()">
                        View All Controls in Ops Room <i class="fas fa-chevron-right ms-2"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Active Defects Pool (Role-Based) -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 class="fw-bold text-dark mb-0">
                    <i class="fas fa-bug me-2 text-danger"></i>
                    <span ng-if="$ctrl.defectFilter === 'Assigned'">Your Assigned Tasks</span>
                    <span ng-if="$ctrl.defectFilter === 'QA'">Pending QA Verification</span>
                    <span ng-if="$ctrl.defectFilter !== 'Assigned' && $ctrl.defectFilter !== 'QA'">Incident Pool</span>
                </h5>
                <div class="btn-group btn-group-sm bg-light rounded-pill p-1">
                    <button class="btn btn-sm px-3 rounded-pill border-0" ng-class="$ctrl.defectFilter === 'All' ? 'btn-danger text-white' : 'btn-light'" ng-click="$ctrl.defectFilter = 'All'">All</button>
                    <button class="btn btn-sm px-3 rounded-pill border-0" ng-class="$ctrl.defectFilter === 'Assigned' ? 'btn-danger text-white' : 'btn-light'" ng-click="$ctrl.defectFilter = 'Assigned'">My Work</button>
                    <button class="btn btn-sm px-3 rounded-pill border-0" ng-if="$ctrl.isQA()" ng-class="$ctrl.defectFilter === 'QA' ? 'btn-danger text-white' : 'btn-light'" ng-click="$ctrl.defectFilter = 'QA'">QA Verification</button>
                </div>
            </div>
            <div class="card-body p-4">
                <div class="row g-3">
                    <div ng-repeat="defect in $ctrl.getFilteredDefects() | limitTo:6" class="col-md-4">
                        <div class="card border-0 bg-white shadow-sm h-100 p-3 objective-card hover-shadow-lg" 
                             style="cursor: pointer; transition: all 0.3s ease; border-left: 4px solid {{$ctrl.getDefectSeverityColor(defect.severity)}} !important;"
                             ng-click="$ctrl.goToControl(defect.controlId)">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="badge rounded-pill extra-small fw-bold" style="background: {{$ctrl.getDefectSeverityColor(defect.severity)}}15; color: {{$ctrl.getDefectSeverityColor(defect.severity)}}">
                                    <i class="fas fa-triangle-exclamation me-1"></i>{{defect.severity}}
                                </span>
                                <span class="badge rounded-pill bg-light text-dark extra-small">{{defect.status}}</span>
                            </div>
                            <h6 class="fw-bold mb-1 text-dark" style="font-size:0.95rem;">{{defect.title}}</h6>
                            <p class="text-muted extra-small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">{{defect.description}}</p>
                            <div class="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" style="width:24px;height:24px;">
                                        <i class="fas fa-layer-group text-indigo" style="font-size:0.7rem;"></i>
                                    </div>
                                    <span class="extra-small text-muted fw-bold">{{defect.controlName}}</span>
                                </div>
                                <span class="text-indigo extra-small fw-bold"><i class="fas fa-chevron-right"></i></span>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.getFilteredDefects().length === 0" class="col-12 text-center py-5">
                        <div class="p-4 rounded-4 d-inline-block">
                            <i class="fas fa-check-circle fa-2x text-success opacity-50 mb-3"></i>
                            <p class="text-muted mb-0 small">Great work! You have no pending items here.</p>
                        </div>
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
                                     ng-click="$ctrl.toggleReleaseExpansion(release)">
                                    <div class="d-flex align-items-start">
                                        <div class="release-icon bg-indigo text-white rounded-3 p-3 me-3 shadow-sm" 
                                             style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-rocket fs-4"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <h6 class="fw-bold text-dark mb-0">
                                                    {{release.releaseName}}
                                                    <i class="fas ms-2 text-muted small" ng-class="release._expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
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
                                                    <i class="fas fa-tasks me-1 text-info"></i>
                                                    Controls: <span class="fw-bold text-dark">{{release._count}}</span>
                                                </small>
                                                <small class="text-muted">
                                                    <i class="fas fa-clock me-1 text-warning"></i>
                                                    Status: <span class="badge rounded-pill shadow-sm" 
                                                                  ng-class="$ctrl.getReleaseStatusInfo(release).class" 
                                                                  ng-style="$ctrl.getReleaseStatusInfo(release).style"
                                                                  style="padding: 5px 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.65rem;">
                                                                {{$ctrl.getReleaseStatusInfo(release).text}}
                                                            </span>
                                                </small>
                                            </div>

                                            <!-- Inline Expansion: Controls list -->
                                            <div ng-if="release._expanded" class="mt-4 pt-4 border-top" style="cursor: default;" ng-click="$event.stopPropagation()">
                                                <div class="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 class="fw-bold text-muted small text-uppercase mb-0">Associated Controls</h6>
                                                    <span class="badge bg-indigo-subtle text-indigo rounded-pill px-3">{{release._controls.length}} items</span>
                                                </div>

                                                <div class="list-group list-group-flush border rounded-3 overflow-hidden shadow-sm bg-white" style="max-height: 300px; overflow-y: auto;">
                                                    <div ng-repeat="control in release._controls" class="list-group-item p-0">
                                                        <div class="px-3 py-3 d-flex align-items-center hover-bg-light" 
                                                             style="cursor: pointer; font-size: 0.85rem;" 
                                                             ng-click="control._expanded = !control._expanded">
                                                            <div class="rounded-circle me-2 flex-shrink-0" style="width: 8px; height: 8px;"
                                                                 ng-style="{'background-color': $ctrl.getStatusColor(control.statusName)}"></div>
                                                            <span class="fw-bold text-dark text-truncate" style="max-width: 60%;">{{control.controlName || control.description}}</span>
                                                            <span class="badge ms-2 rounded-pill x-small" 
                                                                  ng-style="{'background-color': $ctrl.getStatusColor(control.statusName) + '18', 'color': $ctrl.getStatusColor(control.statusName)}">
                                                                {{control.statusName}}
                                                            </span>
                                                            <i class="fas ms-auto text-muted x-small" ng-class="control._expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                                        </div>
                                                        
                                                        <div ng-if="control._expanded" class="px-3 pb-3 bg-light-subtle">
                                                            <div class="mt-2 text-muted extra-small text-uppercase fw-bold mb-2">Objectives</div>
                                                            <div ng-repeat="sub in control._subDescriptionsArray" class="mb-2 ps-2 border-start border-2 border-indigo">
                                                                <div class="d-flex justify-content-between align-items-center mb-1 x-small">
                                                                    <span class="text-dark fw-bold text-truncate" style="max-width: 70%;">{{sub.title || sub.description}}</span>
                                                                    <div class="d-flex align-items-center gap-2">
                                                                        <span class="text-muted extra-small">{{$ctrl.getEmployeeName(sub.employeeId)}}</span>
                                                                        <span class="fw-bold text-indigo">{{sub.progress || 0}}%</span>
                                                                    </div>
                                                                </div>
                                                                <div class="progress rounded-pill" style="height: 3px; background: #e2e8f0;">
                                                                    <div class="progress-bar rounded-pill bg-indigo" ng-style="{'width': (sub.progress || 0) + '%'}"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div ng-if="release._controls.length === 0" class="p-4 text-center text-muted small">
                                                        No associated controls found.
                                                    </div>
                                                </div>

                                                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                                    <div class="flex-grow-1 me-4">
                                                        <div class="d-flex justify-content-between mb-1">
                                                            <span class="text-muted extra-small fw-bold text-uppercase">Overall Progress</span>
                                                            <span class="text-indigo fw-bold extra-small">{{release._averageProgress}}%</span>
                                                        </div>
                                                        <div class="progress rounded-pill shadow-sm" style="height: 8px; background: #e2e8f0;">
                                                            <div class="progress-bar rounded-pill bg-indigo" 
                                                                 style="transition: width 0.8s ease;"
                                                                 ng-style="{'width': release._averageProgress + '%'}"></div>
                                                        </div>
                                                    </div>
                                                    <button class="btn btn-indigo btn-sm rounded-3 px-4 fw-bold shadow-sm"
                                                            ng-click="$ctrl.showReleaseDetails(release)">
                                                        <i class="fas fa-external-link-alt me-2"></i>Full Dashboard
                                                    </button>
                                                </div>
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
        <div class="modal fade" id="releaseDetailsModal" tabindex="-1" aria-hidden="true" style="z-index: 1055;">
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
                    <div class="modal-body p-4" style="background: #f8fafc;">
                        <div class="row g-4 align-items-stretch">

                            <!-- LEFT: Status Progress Overview -->
                            <div class="col-md-5 d-flex flex-column">
                                <div class="card border-0 shadow-sm rounded-4 flex-grow-1" style="min-height: 0;">
                                    <div class="card-header border-0 py-3 px-4" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 1rem 1rem 0 0;">
                                        <h6 class="fw-bold text-white mb-0">
                                            <i class="fas fa-stream me-2 opacity-75"></i>
                                            Lifecycle Progress
                                        </h6>
                                    </div>
                                    <div class="card-body p-0 d-flex flex-column" style="background: #fff; border-radius: 0 0 1rem 1rem;">
                                        <!-- Objectives List -->
                                        <div class="flex-grow-1 overflow-auto p-4" style="max-height: 380px;">
                                            <div ng-if="$ctrl.releaseStatusProgress.length > 0">
                                                <div ng-repeat="item in $ctrl.releaseStatusProgress"
                                                     class="mb-4 pb-4"
                                                     ng-class="!$last ? 'border-bottom' : ''"
                                                     style="border-color: #f1f5f9 !important; transition: all 0.3s ease;">

                                                    <!-- Header Row -->
                                                    <div class="d-flex justify-content-between align-items-start mb-2" 
                                                         style="cursor: pointer;" 
                                                         ng-click="item._expanded = !item._expanded">
                                                        <div style="max-width: 72%;">
                                                            <div class="fw-bold text-dark lh-sm" style="font-size: 0.82rem;">{{item.title}}</div>
                                                            <div class="text-muted d-flex align-items-center mt-1" style="font-size: 0.7rem;">
                                                                <i class="fas fa-layer-group me-1" style="color: #6366f1;"></i>
                                                                <span class="text-truncate">{{item.controlName}}</span>
                                                            </div>
                                                            <div class="text-muted d-flex align-items-center mt-1" style="font-size: 0.7rem;">
                                                                <i class="fas fa-code me-1 text-success"></i>
                                                                <span>DEV: {{item.assigneeName}}</span>
                                                            </div>
                                                            <div class="text-muted d-flex align-items-center mt-1" style="font-size: 0.7rem;">
                                                                <i class="fas fa-vial me-1 text-purple"></i>
                                                                <span>QA: {{item.qaAssigneeName || 'Unassigned'}}</span>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span class="badge rounded-pill px-2 py-1"
                                                                  style="font-size: 0.65rem; white-space: nowrap;"
                                                                  ng-style="{'background-color': item.color, 'color': 'white'}">
                                                                {{item.currentStatus}}
                                                            </span>
                                                            <i class="fas" style="font-size: 0.75rem; color: #6366f1;"
                                                               ng-class="item._expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                                        </div>
                                                    </div>

                                                    <!-- Lifecycle Pipeline -->
                                                    <div class="position-relative d-flex align-items-center mt-3 mb-1" style="height: 36px; padding: 0 8px;">
                                                        <div class="position-absolute" style="height: 2px; background: #e2e8f0; top: 9px; left: 8px; right: 8px; z-index: 0;"></div>
                                                        <div ng-repeat="stage in item.stages" class="flex-grow-1 text-center position-relative" style="z-index: 1;">
                                                            <div class="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                                                 style="width: 20px; height: 20px; transition: all 0.3s ease;"
                                                                 ng-style="{'background-color': (stage.progress > 0 ? stage.color : '#e2e8f0'), 'transform': (stage.isActive ? 'scale(1.35)' : 'scale(1)'), 'box-shadow': (stage.isActive ? '0 0 0 3px ' + stage.color + '33' : 'none')}">
                                                                <i class="fas fa-check" ng-if="stage.progress === 100" style="font-size: 0.45rem; color: white;"></i>
                                                                <div ng-if="stage.isActive && stage.progress < 100" style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
                                                            </div>
                                                            <div class="mt-2 text-center fw-bold" style="font-size: 0.52rem; letter-spacing: 0.04em;"
                                                                 ng-style="{'color': (stage.progress > 0 ? '#475569' : '#cbd5e1')}">
                                                                {{stage.name === 'Analyze' ? 'ANL' : (stage.name === 'Development' ? 'DEV' : (stage.name === 'Dev Testing' ? 'TST' : stage.name))}}
                                                            </div>
                                                            <div class="mt-1 text-center text-truncate px-1" style="font-size: 0.42rem; font-weight: 500; color: #64748b;" ng-if="stage.isActive">
                                                                <i class="fas fa-user-circle me-1 opacity-50"></i>{{stage.assignee}}
                                                            </div>
                                                            <div class="text-center fw-bold" style="font-size: 0.45rem;"
                                                                 ng-style="{'color': (stage.progress > 0 ? '#64748b' : '#cbd5e1')}">
                                                                {{stage.progress}}%
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Overall -->
                                                    <div class="d-flex justify-content-between align-items-center mt-2">
                                                        <span class="text-muted" style="font-size: 0.7rem;">Overall Intensity</span>
                                                        <span class="fw-bold" style="font-size: 0.72rem;" ng-style="{'color': item.color}">{{item.totalProgress}}% Completed</span>
                                                    </div>

                                                    <!-- Inline Expansion: Sub-Objectives / WBS Breakdown -->
                                                    <div ng-if="item._expanded" class="mt-3 p-3 rounded-3" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                                                        <div class="fw-bold text-muted mb-2" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em;">
                                                            <i class="fas fa-sitemap me-1"></i>Detailed Breakdown
                                                        </div>
                                                        <div ng-if="item._subDescriptionsArray.length > 0">
                                                            <div ng-repeat="sub in item._subDescriptionsArray" class="mb-2 pb-2 border-bottom" ng-class="{'border-0': $last}" style="border-color: #f1f5f9 !important;">
                                                                <div class="d-flex justify-content-between align-items-center mb-1">
                                                                    <span class="text-dark fw-bold text-truncate" style="font-size: 0.75rem; max-width: 60%;">{{sub.title || sub.description}}</span>
                                                                    <span class="fw-bold" style="font-size: 0.7rem;" ng-style="{'color': $ctrl.getStatusColor(sub.status)}">{{sub.progress || 0}}%</span>
                                                                </div>
                                                                <div class="progress rounded-pill" style="height: 3px; background: #e2e8f0;">
                                                                    <div class="progress-bar rounded-pill" ng-style="{'width': (sub.progress || 0) + '%', 'background-color': $ctrl.getStatusColor(sub.status)}"></div>
                                                                </div>
                                                                <div class="d-flex justify-content-between mt-1" style="font-size: 0.6rem;">
                                                                    <span class="text-muted"><i class="fas fa-user me-1"></i>{{$ctrl.getEmployeeName(sub.employeeId)}}</span>
                                                                    <span class="badge rounded-pill" style="font-size: 0.55rem;" ng-style="{'background-color': $ctrl.getStatusColor(sub.status) + '15', 'color': $ctrl.getStatusColor(sub.status)}">{{sub.status}}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div ng-if="!item._subDescriptionsArray || item._subDescriptionsArray.length === 0" class="text-center py-2">
                                                            <span class="text-muted x-small">No additional sub-objective data available.</span>
                                                        </div>
                                                        <div class="mt-2 pt-2 border-top text-center">
                                                            <button class="btn btn-link btn-sm p-0 text-indigo fw-bold" 
                                                                    style="font-size: 0.65rem; text-decoration: none;"
                                                                    ng-click="$ctrl.goToControl(item.controlId)">
                                                                <i class="fas fa-external-link-alt me-1"></i>View in Control Board
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ng-if="$ctrl.releaseStatusProgress.length === 0" class="text-center py-5">
                                                <i class="fas fa-chart-line text-muted" style="font-size: 2.5rem; opacity: 0.2;"></i>
                                                <p class="text-muted mt-3 small">No lifecycle data available</p>
                                            </div>
                                        </div>

                                        <!-- Stats Footer -->
                                        <div class="border-top p-3" style="background: #f8fafc; border-radius: 0 0 1rem 1rem;">
                                            <div class="row g-2 mb-2">
                                                <div class="col-4">
                                                    <div class="text-center p-2 bg-white border rounded-3 shadow-sm">
                                                        <div class="fw-bold text-dark" style="font-size: 1.1rem;">{{$ctrl.releaseControls.length}}</div>
                                                        <div class="text-muted" style="font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.05em;">Controls</div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="text-center p-2 bg-white border rounded-3 shadow-sm">
                                                        <div class="fw-bold text-indigo" style="font-size: 1.1rem;">{{$ctrl.releaseStatusProgress.length}}</div>
                                                        <div class="text-muted" style="font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.05em;">Objectives</div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="text-center p-2 bg-white border rounded-3 shadow-sm">
                                                        <div class="fw-bold text-success" style="font-size: 1.1rem;">{{$ctrl.releaseAverageProgress}}%</div>
                                                        <div class="text-muted" style="font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.05em;">Flow</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="progress rounded-pill" style="height: 6px;">
                                                <div class="progress-bar" style="background: linear-gradient(90deg, #6366f1, #10b981);"
                                                     ng-style="{'width': $ctrl.releaseAverageProgress + '%'}"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- RIGHT: Analytics + Controls -->
                            <div class="col-md-7 d-flex flex-column gap-3">

                                <!-- Pie Chart + KPI -->
                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                            <div class="card-body p-3">
                                                <div class="fw-bold text-muted mb-2" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em;">
                                                    <i class="fas fa-chart-pie me-1" style="color: #6366f1;"></i> Individual Progress
                                                </div>
                                                <div class="overflow-auto pe-1" style="height: 160px; overflow-x: hidden;">
                                                    <div class="row g-2">
                                                        <div class="col-6 col-lg-4" ng-repeat="item in $ctrl.releaseStatusProgress">
                                                            <div class="p-2 border rounded-3 text-center d-flex flex-column align-items-center h-100 hover-shadow-lg" 
                                                                 style="background: #f8fafc; transition: all 0.2s; cursor: pointer;"
                                                                 ng-click="item._expanded = !item._expanded"
                                                                 ng-style="{'border-color': item._expanded ? '#6366f1' : '#dee2e6', 'background-color': item._expanded ? '#ffffff' : '#f8fafc', 'box-shadow': item._expanded ? '0 4px 12px rgba(99,102,241,0.15)' : 'none'}">
                                                                <div class="position-relative d-flex align-items-center justify-content-center mt-1" 
                                                                     style="width: 54px; height: 54px; border-radius: 50%;" ng-style="{'background': item.conicGradient}">
                                                                    <div class="position-absolute" style="width: 42px; height: 42px; background: #f8fafc; border-radius: 50%;"></div>
                                                                    <span class="position-relative fw-bold" style="font-size: 0.65rem; color: #475569;">{{item.totalProgress}}%</span>
                                                                </div>
                                                                <div class="mt-2 text-dark text-truncate w-100 fw-bold" style="font-size: 0.62rem;" title="{{item.title}}">
                                                                    {{item.title}}
                                                                </div>
                                                                <span class="badge rounded-pill mt-auto w-100 text-truncate" style="font-size: 0.5rem; background-color: {{item.color}}15; color: {{item.color}}; border: 1px solid {{item.color}}33;">
                                                                    {{item.currentStatus}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div ng-if="$ctrl.releaseStatusProgress.length === 0" class="col-12 text-center text-muted py-5 small">
                                                            No objectives found.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card border-0 shadow-sm rounded-4 h-100 text-white"
                                             style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                                            <div class="card-body d-flex flex-column justify-content-center align-items-center text-center p-3">
                                                <div style="font-size: 2.5rem; font-weight: 800; line-height: 1;">{{$ctrl.releaseStatusProgress.length}}</div>
                                                <div style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.8;">Work Units</div>
                                                <div class="mt-2 pt-2 w-100 text-center" style="border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.65rem; opacity: 0.7;">
                                                    Across {{$ctrl.releaseControls.length}} Controls
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Controls List -->
                                <div class="card border-0 shadow-sm rounded-4 flex-grow-1 bg-white overflow-hidden">
                                    <div class="card-header border-0 py-2 px-4 d-flex justify-content-between align-items-center" style="background: #f8fafc;">
                                        <span class="fw-bold text-dark" style="font-size: 0.8rem;">
                                            <i class="fas fa-list-check me-2 text-success"></i>Release Controls
                                        </span>
                                        <span class="badge rounded-pill" style="background: #6366f115; color: #6366f1; font-size: 0.7rem;">{{$ctrl.releaseControls.length}} items</span>
                                    </div>
                                    <div class="overflow-auto" style="max-height: 265px;">
                                        <div ng-if="$ctrl.releaseControls.length > 0">
                                            <div ng-repeat="control in $ctrl.releaseControls"
                                                 class="border-bottom"
                                                 style="transition: background 0.15s;">
                                                <!-- Control header row — click to expand -->
                                                <div class="px-4 py-3 d-flex align-items-center hover-bg-light"
                                                     style="cursor: pointer;"
                                                     ng-click="control._expanded = !control._expanded">
                                                    <div class="rounded-circle me-2 flex-shrink-0" style="width: 8px; height: 8px;"
                                                         ng-style="{'background-color': $ctrl.getStatusColor(control.statusName)}"></div>
                                                    <span class="fw-bold text-dark text-truncate" style="font-size: 0.82rem; max-width: 48%;">{{control.controlName || control.description}}</span>
                                                    <span class="badge ms-2 rounded-pill" style="font-size: 0.6rem;"
                                                          ng-style="{'background-color': $ctrl.getStatusColor(control.statusName) + '18', 'color': $ctrl.getStatusColor(control.statusName)}">
                                                        {{control.statusName}}
                                                    </span>
                                                    <span class="ms-auto text-muted" style="font-size: 0.7rem;">
                                                        <i class="fas fa-user me-1"></i>{{$ctrl.getEmployeeName(control.employeeId)}}
                                                    </span>
                                                    <i class="fas ms-3" style="font-size:0.75rem; color:#6366f1;"
                                                       ng-class="control._expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                                </div>
                                                <!-- Inline expanded details -->
                                                <div ng-if="control._expanded" class="px-4 pb-3" style="background:#f8fafc; border-top: 1px solid #f1f5f9;">
                                                    <!-- Sub-objectives -->
                                                    <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0" class="pt-3">
                                                        <div class="text-muted fw-bold mb-2" style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.05em;">
                                                            <i class="fas fa-layer-group me-1"></i>Sub-Objectives
                                                        </div>
                                                        <div ng-repeat="sub in control._subDescriptionsArray track by $index" class="mb-2 ps-2 border-start border-2" style="border-color:#6366f1 !important;">
                                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                                <span class="text-dark text-truncate fw-bold" style="font-size:0.75rem; max-width:55%;">{{sub.title || sub.description || 'Sub-Objective'}}</span>
                                                                <div class="d-flex align-items-center gap-2">
                                                                    <span class="text-muted" style="font-size:0.67rem;">{{$ctrl.getEmployeeName(sub.employeeId)}}</span>
                                                                    <span class="fw-bold" style="font-size:0.72rem;" ng-style="{'color': $ctrl.getStatusColor(sub.status)}">{{sub.progress || 0}}%</span>
                                                                </div>
                                                            </div>
                                                            <div class="progress rounded-pill" style="height:3px; background:#e2e8f0;">
                                                                <div class="progress-bar rounded-pill"
                                                                     ng-style="{'width': (sub.progress || 0) + '%', 'background-color': $ctrl.getStatusColor(sub.status)}"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- Overall progress -->
                                                    <div class="d-flex align-items-center gap-3 mt-3 pt-2" style="border-top:1px solid #e2e8f0;">
                                                        <div class="flex-grow-1">
                                                            <div class="d-flex justify-content-between mb-1">
                                                                <span class="text-muted" style="font-size:0.68rem;">Overall Progress</span>
                                                                <span class="fw-bold text-indigo" style="font-size:0.72rem;">{{control.progress || 0}}%</span>
                                                            </div>
                                                            <div class="progress rounded-pill" style="height:5px; background:#e2e8f0;">
                                                                <div class="progress-bar rounded-pill" style="background:linear-gradient(90deg,#6366f1,#10b981);"
                                                                     ng-style="{'width': (control.progress || 0) + '%'}"></div>
                                                            </div>
                                                        </div>
                                                        <span class="badge rounded-pill px-3 py-1" style="font-size:0.65rem; background:#6366f115; color:#6366f1;">
                                                            {{control.releaseName || 'No Release'}}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div ng-if="$ctrl.releaseControls.length === 0" class="text-center py-5">
                                            <i class="fas fa-inbox text-muted" style="font-size: 2rem; opacity: 0.2;"></i>
                                            <p class="text-muted mt-2 small">No controls in this release</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer border-0 py-3 px-4" style="background: #f8fafc; border-radius: 0 0 1rem 1rem;">
                        <button type="button" class="btn btn-outline-secondary rounded-pill px-4 btn-sm" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Control Details Modal -->
        <div class="modal fade" id="controlDetailsModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 bg-light rounded-top-4 py-3">
                        <div>
                            <h5 class="modal-title fw-bold text-dark mb-0">
                                <i class="fas fa-file-alt text-primary me-2"></i>Control Details
                            </h5>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4" ng-if="$ctrl.selectedControlDetails">
                        <div class="row g-4">
                            <!-- Left: Core Information Grid -->
                            <div class="col-md-5">
                                <div class="bg-light rounded-4 p-4 h-100 border border-light-subtle">
                                    <div class="mb-5">
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="fas fa-signal text-primary me-2 x-small"></i>
                                            <label class="text-muted extra-small fw-bold text-uppercase ls-1">Current Status</label>
                                        </div>
                                        <h5 class="fw-bold text-dark mb-0 d-flex align-items-center">
                                            {{$ctrl.selectedControlDetails.statusName || 'Analyze'}}
                                            <span class="ms-2 badge rounded-pill px-2 py-1 x-small"
                                                  ng-style="{'background-color': $ctrl.getStatusColor($ctrl.selectedControlDetails.statusName), 'color': 'white'}">
                                                Active
                                            </span>
                                        </h5>
                                    </div>

                                    <div class="mb-4">
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="fas fa-align-left text-primary me-2 x-small"></i>
                                            <label class="text-muted extra-small fw-bold text-uppercase ls-1">Control Description</label>
                                        </div>
                                        <div class="p-3 bg-white rounded-3 border">
                                            <h6 class="fw-bold text-dark mb-1">{{$ctrl.selectedControlDetails.controlName}}</h6>
                                            <p class="text-muted small mb-0 lh-base">{{$ctrl.selectedControlDetails.description || 'No extended description available'}}</p>
                                        </div>
                                    </div>

                                    <div class="row g-3 mb-4">
                                        <div class="col-6">
                                            <div class="d-flex align-items-center mb-1">
                                                <i class="fas fa-rocket text-indigo me-2 x-small"></i>
                                                <label class="text-muted extra-small fw-bold text-uppercase ls-1">Release Cycle</label>
                                            </div>
                                            <p class="fw-bold text-dark mb-0 small">
                                                {{$ctrl.selectedControlDetails.releaseName || 'Not specified'}}
                                            </p>
                                        </div>
                                        <div class="col-6">
                                            <div class="d-flex align-items-center mb-1">
                                                <i class="fas fa-user-tie text-success me-2 x-small"></i>
                                                <label class="text-muted extra-small fw-bold text-uppercase ls-1">Project Lead</label>
                                            </div>
                                            <p class="fw-bold text-dark mb-0 small">{{$ctrl.getEmployeeName($ctrl.selectedControlDetails.employeeId)}}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="p-3 bg-indigo-subtle rounded-4 border border-indigo-subtle mt-auto">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-indigo fw-bold extra-small text-uppercase">Overall Control Health</span>
                                            <span class="text-indigo fw-bold">{{$ctrl.selectedControlDetails.progress}}%</span>
                                        </div>
                                        <div class="progress rounded-pill" style="height: 10px; background: rgba(255,255,255,0.5);">
                                            <div class="progress-bar bg-indigo" ng-style="{'width': $ctrl.selectedControlDetails.progress + '%'}"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Work Breakdown Structure -->
                            <div class="col-md-7">
                                <div class="card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
                                    <div class="card-header bg-light border-0 py-3 d-flex justify-content-between align-items-center">
                                        <h6 class="fw-bold text-dark mb-0 small">
                                            <i class="fas fa-sitemap me-2 text-primary"></i>
                                            Work Breakdown Structure (WBS)
                                        </h6>
                                        <span class="badge bg-white text-dark border rounded-pill small">{{$ctrl.selectedControlDetails.parsedSubDesc.length}} Objectives</span>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="table-responsive" style="max-height: 450px;">
                                            <table class="table table-hover align-middle mb-0" style="font-size: 0.85rem;">
                                                <thead class="bg-light-subtle text-muted extra-small fw-bold">
                                                    <tr>
                                                        <th class="ps-4 border-0 py-3">OBJECTIVE / ASSIGNEE</th>
                                                        <th class="border-0 py-3">LIFECYCLE</th>
                                                        <th class="text-end pe-4 border-0 py-3">PROG.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr ng-repeat="sub in $ctrl.selectedControlDetails.parsedSubDesc">
                                                        <td class="ps-4 py-3" style="width: 30%;">
                                                            <div class="fw-bold text-dark mb-1">{{sub.displayTitle}}</div>
                                                            <div class="text-muted d-flex flex-column gap-1 mt-2" style="font-size: 0.65rem;">
                                                                <span class="d-flex align-items-center"><i class="fas fa-code me-2 text-primary"></i>DEV: {{sub.assigneeName}}</span>
                                                                <span class="d-flex align-items-center"><i class="fas fa-vial me-2 text-success"></i>QA: {{sub.qaAssigneeName}}</span>
                                                            </div>
                                                        </td>
                                                        <td class="py-3 px-3" style="min-width: 350px;">
                                                            <div class="d-flex justify-content-between align-items-center mb-1">
                                                                <span class="x-small fw-bold text-muted text-uppercase" style="font-size: 0.6rem;">Status Progress Breakdown</span>
                                                                <span class="badge rounded-pill" ng-style="{'background-color': $ctrl.getStatusColor(sub.status) + '22', 'color': $ctrl.getStatusColor(sub.status), 'font-size': '0.55rem'}">{{sub.status || 'Analyze'}}</span>
                                                            </div>
                                                            <div class="d-flex justify-content-between text-center mt-2">
                                                                <div ng-repeat="stage in sub.stages" class="position-relative flex-grow-1 mx-1">
                                                                    <div class="w-100 rounded-pill overflow-hidden bg-light" style="height: 6px;">
                                                                        <div class="h-100" style="transition: width 0.3s ease;" ng-style="{'width': stage.progress + '%', 'background-color': stage.color}"></div>
                                                                    </div>
                                                                    <div class="mt-1 d-flex flex-column">
                                                                        <span class="fw-bold text-truncate" style="font-size: 0.52rem; color: #475569;">{{stage.name === 'Development' ? 'DEV' : (stage.name === 'Dev Testing' ? 'TST' : stage.name)}}</span>
                                                                        <span class="fw-bold" style="font-size: 0.55rem;" ng-style="{'color': (stage.progress > 0 ? stage.color : '#94a3b8')}">{{stage.progress}}%</span>
                                                                        <div class="text-truncate px-1 opacity-75" style="font-size: 0.42rem; font-weight: 600; color: #64748b; margin-top: 2px;" ng-if="stage.isActive">
                                                                            {{stage.assignee}}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end pe-4 py-3 align-middle" style="width: 15%;">
                                                            <div class="d-flex flex-column align-items-end">
                                                                <span class="text-muted" style="font-size: 0.55rem; text-transform: uppercase;">Total Prog.</span>
                                                                <span class="fw-bold fs-6" ng-style="{'color': $ctrl.getStatusColor(sub.status)}">{{sub.progress || 0}}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr ng-if="!$ctrl.selectedControlDetails.parsedSubDesc.length">
                                                        <td colspan="3" class="text-center py-5">
                                                            <div class="text-muted px-4">
                                                                <i class="fas fa-tasks mb-3" style="font-size: 2rem; opacity: 0.2;"></i>
                                                                <p class="small mb-0">No detailed objectives breakdown for this control.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="card-footer bg-light border-0 py-3 text-center">
                                        <button class="btn btn-outline-indigo btn-sm rounded-pill px-4 fw-bold" 
                                                ng-click="$ctrl.goToControlFromModal($ctrl.selectedControlDetails)">
                                            <i class="fas fa-external-link-alt me-2"></i>Go to Control Board
                                        </button>
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
    controller: function (ApiService, $timeout, $rootScope, $scope, AuthService, NotificationService, $filter, $location) {
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
        ctrl.hubSearch = '';


        ctrl.goToControl = function (id) {
            if (!id) return;
            // Set URL search parameter
            $location.search('controlId', id);
            // Switch to controls view
            $rootScope.currentView = 'controls';
            $rootScope.$emit('viewChanged', 'controls');
            
            // Notification if needed, though checkAndFocusControl handles the highlight
            console.log('Navigating to Control ID:', id);
        };

        ctrl.currentUser = AuthService.getUser();
        
        // Role Helpers
        ctrl.isPM = function() { return AuthService.isProjectManager() || AuthService.isAdmin(); };
        ctrl.isLead = function() { return AuthService.isTeamLead() || AuthService.isSoftwareArchitecture(); };
        ctrl.isDev = function() { return AuthService.isDeveloper(); };
        ctrl.isQA = function() { return AuthService.isQAEngineer(); };
        ctrl.isManagement = function() { return ctrl.isPM() || ctrl.isLead(); };

        // Sub-Objective Stats
        ctrl.subObjectiveStats = { total: 0, analyze: 0, dev: 0, qa: 0, readyQA: 0, completed: 0, onHold: 0 };
        ctrl.mySubObjectives = [];
        ctrl.readyForQASubObjectives = [];
        ctrl.projectReadiness = 0;

        ctrl.processAllSubDescriptions = function () {
            if (!ctrl.store.allControls) return;

            var stats = { total: 0, analyze: 0, dev: 0, qa: 0, readyQA: 0, completed: 0, onHold: 0 };
            var mySub = [];
            var qaSub = [];
            
            var userId = ctrl.currentUser ? parseInt(ctrl.currentUser.employeeId) : null;

            ctrl.store.allControls.forEach(function (control) {
                if (!control.subDescriptions) return;
                
                try {
                    var subs = JSON.parse(control.subDescriptions);
                    if (!Array.isArray(subs)) return;

                    subs.forEach(function (sub, index) {
                        stats.total++;
                        
                        var status = (sub.status || '').toLowerCase().trim();
                        if (status === 'analyze') stats.analyze++;
                        else if (status === 'development') stats.dev++;
                        else if (status === 'qa') stats.qa++;
                        else if (status === 'ready for qa') stats.readyQA++;
                        else if (status === 'completed' || status === 'done' || status === 'pass') stats.completed++;
                        else if (status === 'on hold') stats.onHold++;

                        var subObj = {
                            controlId: control.controlId,
                            controlName: control.description,
                            text: sub.description || 'Untitled Sub-Objective',
                            ownerId: sub.employeeId,
                            ownerName: sub.employeeName,
                            status: sub.status,
                            releaseDate: sub.releaseDate,
                            index: index
                        };

                        if (userId && parseInt(sub.employeeId) === userId) {
                            mySub.push(subObj);
                        }
                        if (status === 'ready for qa') {
                            qaSub.push(subObj);
                        }
                    });
                } catch (e) {
                    console.error("Error parsing sub-descriptions", e);
                }
            });

            ctrl.subObjectiveStats = stats;
            ctrl.mySubObjectives = mySub;
            ctrl.readyForQASubObjectives = qaSub;
            ctrl.projectReadiness = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        };

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
                ctrl.employeesWorkload = workloadArray;
            }

            // 4. Process Sub-Descriptions
            ctrl.processAllSubDescriptions();


        };

        ctrl.parseSub = function (json) {
            if (!json) return [];
            try {
                return JSON.parse(json);
            } catch (e) {
                return [];
            }
        };

        ctrl.getDefectSeverityColor = function (severity) {
            var s = (severity || '').toLowerCase();
            if (s === 'critical') return '#ef4444';
            if (s === 'high') return '#f97316';
            if (s === 'medium') return '#f59e0b';
            return '#3b82f6';
        };

        ctrl.getSubStatusColor = function (status) {
            var s = (status || '').toLowerCase();
            if (s === 'pass' || s === 'completed' || s === 'done') return '#10b981';
            if (s === 'fail') return '#ef4444';
            if (s === 'block') return '#f59e0b';
            return '#6c757d';
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
            ctrl.defectFilter = 'Assigned';
            ctrl.selectedControlFilter = '';
            ctrl.developerMetrics = [];
            ctrl.releaseGroups = [];
            ctrl.selectedReleaseGroup = '';
            ctrl.activeReleaseGroup = null;
            ctrl.releaseStatusPieChart = null;

            // Updated date resolver (searches control + related release + sub-objectives)
            ctrl.getControlDates = function (control) {
                var dates = [];
                // 1. Direct release date
                if (control.releaseDate) dates.push(control.releaseDate);
                // 2. Date from linked release
                if (control.releaseId && ctrl.store.releases) {
                    var r = ctrl.store.releases.find(function(x) { return x.releaseId === control.releaseId; });
                    if (r && r.releaseDate) dates.push(r.releaseDate);
                }
                // 3. Dates from test cases / sub-objectives
                if (control.subDescriptions) {
                    try {
                        var subs = typeof control.subDescriptions === 'string' ? JSON.parse(control.subDescriptions) : control.subDescriptions;
                        if (Array.isArray(subs)) {
                            subs.forEach(function(sub) {
                                if (sub.releaseDate) dates.push(sub.releaseDate);
                            });
                        }
                    } catch(e) {}
                }
                return dates;
            };
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

        // Listen for real-time control updates
        var controlsListener = $rootScope.$on('controlsUpdated', function () {
            console.log('Dashboard received controlsUpdated event, refreshing data');
            ctrl.refreshDashboard();
            ctrl.forceRoadmapUpdate();
        });

        var dashboardUpdatedListener = $rootScope.$on('dashboardUpdated', function () {
            console.log('Dashboard received dashboardUpdated event');
            ctrl.refreshDashboard();
            ctrl.forceRoadmapUpdate();
        });

        // Cleanup
        ctrl.$onDestroy = function () {
            if (teamListener) teamListener();
            if (controlsListener) controlsListener();
            if (dashboardUpdatedListener) dashboardUpdatedListener();
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
                'QA': '#10b981', 'Ready for QA': '#14b8a6', 'On Hold': '#94a3b8', 'Completed': '#059669',
                'Not Started': '#d1d5db'
            };

            var statusMap = {};
            controls.forEach(function(c) {
                var subs = ctrl.parseSub(c.subDescriptions);
                if (subs && subs.length > 0) {
                    subs.forEach(function(s) {
                        var st = s.status && s.status.trim() ? s.status.trim() : 'Not Started';
                        var prog = parseFloat(s.progress || 0);
                        if (prog > 0) {
                            statusMap[st] = (statusMap[st] || 0) + prog;
                        }
                    });
                } else {
                    // Fall back to control's own status and progress if no sub-objectives exist
                    var defaultSt = c.statusName && c.statusName.trim() ? c.statusName.trim() : 'Not Started';
                    var ctrlProg = parseFloat(c.progress || 0);
                    if (ctrlProg > 0) {
                        statusMap[defaultSt] = (statusMap[defaultSt] || 0) + ctrlProg;
                    }
                }
            });

            // If everything is 0%, just show a 100% "Not Started" placeholder
            if (Object.keys(statusMap).length === 0) {
                statusMap['Not Started'] = 100;
            }

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
            var count = 0;

            var matchesMonth = function(dateVal) {
                if (!dateVal) return false;
                // Append Z if no timezone info to treat as UTC
                var ds = typeof dateVal === 'string' ? dateVal : dateVal.toISOString();
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var d = new Date(ds);
                return d.getUTCFullYear() === ctrl.currentYear && d.getUTCMonth() === monthIndex;
            };

            // Determine if user has "All Teams" selected or no team context
            var isAllTeams = !currentTeamId || String(currentTeamId) === '0' || String(currentTeamId) === '-1' || String(currentTeamId) === 'null';

            // Items set to track unique "Release Hub" entries (Formal Release IDs or Ad-Hoc Control IDs)
            var uniqueItems = new Set();

            if (ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function(control) {
                    if (isAllTeams || parseInt(control.teamId) === parseInt(currentTeamId)) {
                        var allDates = ctrl.getControlDates(control);
                        var matches = allDates.some(function(d) { return matchesMonth(d); });
                        
                        if (matches) {
                            // If it belongs to a formal release, track the release ID
                            // Otherwise, track the control ID as a standalone entry
                            var itemId = control.releaseId ? ('rel_' + control.releaseId) : ('ctrl_' + control.controlId);
                            uniqueItems.add(itemId);
                        }
                    }
                });
            }

            return uniqueItems.size;
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
            
            // Allow all past years
            if (ctrl.currentYear < currentYear) {
                return true;
            }
            
            // For current year, allow past months, current month, and next month
            if (ctrl.currentYear === currentYear) {
                return monthIndex <= currentMonth + 1;
            }
            
            // For next year, if current month is December, only allow January
            if (ctrl.currentYear === currentYear + 1 && currentMonth === 11) {
                return monthIndex === 0;
            }
            
            return false;
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

            // Allow past months, current month, and next month only
            if (!ctrl._isMonthAccessible(monthIndex)) {
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

            // Source 1: from controls (team-filtered) (now considering test case dates too)
            var isAllTeams = !currentTeamId || String(currentTeamId) === '0' || String(currentTeamId) === '-1' || String(currentTeamId) === 'null';

            if (ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function (control) {
                    if (isAllTeams || parseInt(control.teamId) === parseInt(currentTeamId)) {
                        var allDates = ctrl.getControlDates(control);
                        var firstMatchInMonth = allDates.find(function(d) { return matchesMonthYear(d); });
                        
                        if (firstMatchInMonth) {
                            var rId = control.releaseId;
                            var mapKey = rId ? rId : ('adhoc_ctrl_' + control.controlId);

                            if (!releasesMap[mapKey]) {
                                // If it's a formal release, we might already have it from store.releases (handled below)
                                // or we create a placeholder if it's not in store.releases but exists on controls
                                var releaseName = control.releaseName;
                                if (!releaseName) {
                                    releaseName = rId ? ('Release ' + rId) : (control.description || 'Ad-Hoc Release');
                                }

                                releasesMap[mapKey] = {
                                    releaseId: rId,
                                    isCustom: !rId,
                                    controlId: !rId ? control.controlId : null,
                                    releaseName: releaseName,
                                    releaseDate: firstMatchInMonth, 
                                    description: !rId ? 'Scheduled Control: ' + control.description : null
                                };
                            }
                        }
                    }
                });
            }

            // Sync with formal releases from store to get proper names/dates if available
            if (ctrl.store.releases) {
                ctrl.store.releases.forEach(function (r) {
                    if (releasesMap[r.releaseId]) {
                        releasesMap[r.releaseId].releaseName = r.releaseName || releasesMap[r.releaseId].releaseName;
                        releasesMap[r.releaseId].releaseDate = r.releaseDate || releasesMap[r.releaseId].releaseDate;
                        releasesMap[r.releaseId].description = r.description || releasesMap[r.releaseId].description;
                    }
                });
            }

            // Convert map to array and enrich with stats
            ctrl.selectedMonthReleases = Object.values(releasesMap).map(function(r) {
                var stats = ctrl.getReleaseStats(r);
                r._count = stats.count;
                r._progress = stats.progress;
                return r;
            });

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

        ctrl._calculateControlProgress = function (control) {
            // Priority 1: Use explicitly set progress if it exists and is non-zero
            if (control.progress && control.progress > 0) return control.progress;
            
            // Priority 2: Calculate from sub-descriptions (WBS)
            var subs = [];
            if (control.subDescriptions && typeof control.subDescriptions === 'string') {
                try { subs = JSON.parse(control.subDescriptions); } catch (e) {}
            } else if (Array.isArray(control.subDescriptions)) {
                subs = control.subDescriptions;
            }
            
            if (subs && subs.length > 0) {
                var total = subs.reduce(function(s, sub) {
                    return s + (sub.progress || 0);
                }, 0);
                return Math.round(total / subs.length);
            }
            
            return control.progress || 0;
        };

        ctrl.getReleaseStats = function (release) {
            if (!ctrl.store.allControls) return { count: 0, progress: 0 };
            
            var releaseDay = null;
            if (release.releaseDate) {
                var ds = typeof release.releaseDate === 'string' ? release.releaseDate : (release.releaseDate instanceof Date ? release.releaseDate.toISOString() : String(release.releaseDate));
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var rd = new Date(ds);
                releaseDay = rd.getUTCFullYear() + '-' + rd.getUTCMonth() + '-' + rd.getUTCDate();
            }

            var matchingControls = ctrl.store.allControls.filter(function (c) {
                if (c.releaseId && c.releaseId === release.releaseId) return true;
                var allDates = ctrl.getControlDates ? ctrl.getControlDates(c) : (c.releaseDate ? [c.releaseDate] : []);
                if (releaseDay && allDates.length > 0) {
                    return allDates.some(function(effDate) {
                        var cds = typeof effDate === 'string' ? effDate : (effDate instanceof Date ? effDate.toISOString() : String(effDate));
                        if (cds.indexOf('Z') === -1 && cds.indexOf('+') === -1) cds += 'Z';
                        var cd = new Date(cds);
                        var cDay = cd.getUTCFullYear() + '-' + cd.getUTCMonth() + '-' + cd.getUTCDate();
                        return cDay === releaseDay;
                    });
                }
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

            var avgProgress = matchingControls.length > 0
                ? Math.round(matchingControls.reduce(function(s, c) { return s + ctrl._calculateControlProgress(c); }, 0) / matchingControls.length)
                : 0;

            return {
                count: matchingControls.length,
                progress: avgProgress
            };
        };

        ctrl.getReleaseStatusInfo = function (release) {
            var progress = release._progress !== undefined ? release._progress : 0;
            var count = release._count !== undefined ? release._count : 0;
            
            if (count === 0) return { text: 'No Controls', style: { 'background-color': '#64748b', 'color': 'white' } };
            
            // Using explicit style objects for ng-style compatibility and maximum visibility
            if (progress === 0) return { text: 'Scheduled', style: { 'background-color': '#f59e0b', 'color': 'white' } };
            if (progress === 100) return { text: 'Completed', style: { 'background-color': '#10b981', 'color': 'white' } };
            return { text: 'In Progress (' + progress + '%)', style: { 'background-color': '#6366f1', 'color': 'white' } };
        };

        ctrl.getReleaseControlCount = function (release) {
            if (!release || !ctrl.store.allControls) return 0;
            
            // If it's a standalone ad-hoc control, the count is always 1
            if (release.isCustom && release.controlId) return 1;

            var releaseId = release.releaseId;
            var count = 0;
            ctrl.store.allControls.forEach(function (c) {
                if (c.releaseId && c.releaseId === releaseId) {
                    count++;
                }
            });
            return count;
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
            ctrl.selectedReleaseDay = releaseDay;

            ctrl.releaseControls = ctrl.store.allControls.filter(function (c) {
                // Match by releaseId
                if (c.releaseId && c.releaseId === release.releaseId) return true;
                
                var allDates = ctrl.getControlDates ? ctrl.getControlDates(c) : (c.releaseDate ? [c.releaseDate] : []);
                
                // Match by release date (UTC day) — check if ANY of the control's dates match the release date
                if (releaseDay && allDates.length > 0) {
                    return allDates.some(function(effDate) {
                        var cds = typeof effDate === 'string' ? effDate : (effDate instanceof Date ? effDate.toISOString() : String(effDate));
                        if (cds.indexOf('Z') === -1 && cds.indexOf('+') === -1) cds += 'Z';
                        var cd = new Date(cds);
                        var cDay = cd.getUTCFullYear() + '-' + cd.getUTCMonth() + '-' + cd.getUTCDate();
                        return cDay === releaseDay;
                    });
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
            
            // Process sub-descriptions for each control
            ctrl.releaseControls.forEach(function (c) {
                if (c.subDescriptions && typeof c.subDescriptions === 'string') {
                    try {
                        c._subDescriptionsArray = JSON.parse(c.subDescriptions);
                    } catch (e) {
                        c._subDescriptionsArray = [];
                    }
                } else if (Array.isArray(c.subDescriptions)) {
                    c._subDescriptionsArray = c.subDescriptions;
                } else {
                    c._subDescriptionsArray = [];
                }
                
                // Ensure each sub-description has a title and progress
                if (c._subDescriptionsArray) {
                    c._subDescriptionsArray.forEach(function(sub) {
                       sub.title = sub.title || sub.description || 'Sub-Objective';
                       sub.progress = (sub.progress !== undefined && sub.progress !== null) ? sub.progress : 0;
                    });
                }
            });

            // Calculate average progress
            ctrl.releaseAverageProgress = ctrl.releaseControls.length > 0
                ? Math.round(ctrl.releaseControls.reduce(function(s, c) { return s + (c.progress || 0); }, 0) / ctrl.releaseControls.length)
                : 0;

            ctrl.calculateStatusProgress();

            // Open release details modal without hiding the month releases modal
            // This allows stacking and keeps the previous context accessible when closing this modal
            $timeout(function () {
                var releaseModal = new bootstrap.Modal(document.getElementById('releaseDetailsModal'));
                releaseModal.show();
            }, 0);
        };

        ctrl.toggleReleaseExpansion = function(release) {
            release._expanded = !release._expanded;
            if (release._expanded && !release._detailsLoaded) {
                // Populate data for this specific release
                
                var releaseDay = null;
                if (release.releaseDate) {
                    var ds = typeof release.releaseDate === 'string' ? release.releaseDate : release.releaseDate.toISOString();
                    if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                    var rd = new Date(ds);
                    releaseDay = rd.getUTCFullYear() + '-' + rd.getUTCMonth() + '-' + rd.getUTCDate();
                }

                release._controls = ctrl.store.allControls.filter(function (c) {
                    if (c.releaseId && c.releaseId === release.releaseId) return true;
                    var allDates = ctrl.getControlDates ? ctrl.getControlDates(c) : (c.releaseDate ? [c.releaseDate] : []);
                    if (releaseDay && allDates.length > 0) {
                        return allDates.some(function(effDate) {
                            var cds = typeof effDate === 'string' ? effDate : (effDate instanceof Date ? effDate.toISOString() : String(effDate));
                            if (cds.indexOf('Z') === -1 && cds.indexOf('+') === -1) cds += 'Z';
                            var cd = new Date(cds);
                            var cDay = cd.getUTCFullYear() + '-' + cd.getUTCMonth() + '-' + cd.getUTCDate();
                            return cDay === releaseDay;
                        });
                    }
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

                release._controls.forEach(function (c) {
                    if (c.subDescriptions && typeof c.subDescriptions === 'string') {
                        try { c._subDescriptionsArray = JSON.parse(c.subDescriptions); } catch (e) { c._subDescriptionsArray = []; }
                    } else if (Array.isArray(c.subDescriptions)) {
                        c._subDescriptionsArray = c.subDescriptions;
                    } else {
                        c._subDescriptionsArray = [];
                    }
                    if (c._subDescriptionsArray) {
                        c._subDescriptionsArray.forEach(function(sub) {
                           sub.title = sub.title || sub.description || 'Sub-Objective';
                           sub.progress = (sub.progress !== undefined && sub.progress !== null) ? sub.progress : 0;
                        });
                    }
                    
                    // Dynamic calculation for real-time accuracy in expansion
                    c.calculatedProgress = ctrl._calculateControlProgress(c);
                });

                release._averageProgress = release._controls.length > 0
                    ? Math.round(release._controls.reduce(function(s, c) { return s + (c.calculatedProgress || 0); }, 0) / release._controls.length)
                    : 0;

                release._detailsLoaded = true;
            }
        };

        ctrl.openControlDetails = function(control) {
            ctrl.selectedControlDetails = Object.assign({}, control);
            
            // Stages for breakdown
            var lifecycleStages = [
                { name: 'Analyze',     id: 1, color: '#6366f1' },
                { name: 'HLD',         id: 2, color: '#f59e0b' },
                { name: 'LLD',         id: 3, color: '#ec4899' },
                { name: 'Development', id: 4, color: '#3b82f6' },
                { name: 'Dev Testing', id: 5, color: '#8b5cf6' },
                { name: 'QA',          id: 6, color: '#10b981' }
            ];

            // Mapping for dynamic lookup
            if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                lifecycleStages.forEach(function(s) {
                    var found = ctrl.store.statuses.find(function(dbS) {
                        return dbS.statusName && dbS.statusName.toLowerCase().indexOf(s.name.toLowerCase()) !== -1;
                    });
                    if (found) s.id = found.id;
                });
            }

            // Parse sub-descriptions if they exist
            var subDesc = [];
            if (typeof ctrl.selectedControlDetails.subDescriptions === 'string' && ctrl.selectedControlDetails.subDescriptions.trim().startsWith('[')) {
                try {
                    subDesc = JSON.parse(ctrl.selectedControlDetails.subDescriptions);
                } catch (e) {
                    subDesc = [];
                }
            } else if (Array.isArray(ctrl.selectedControlDetails.subDescriptions)) {
                subDesc = ctrl.selectedControlDetails.subDescriptions;
            }
            
            // Map details for each sub-objective
            if (Array.isArray(subDesc)) {
                subDesc.forEach(function(sub) {
                    sub.displayTitle = sub.title || sub.description || 'Sub-Objective';
                    sub.assigneeName = sub.employeeId ? ctrl.getEmployeeName(sub.employeeId) : 'Unassigned';
                    var qaId = sub.qaEmployeeId || control.qaEmployeeId;
                    sub.qaAssigneeName = qaId ? ctrl.getEmployeeName(qaId) : 'Unassigned';
                    
                    var statusId = sub.statusId ? parseInt(sub.statusId) : 1;
                    var subStatusProgress = sub.statusProgress || {};
                    
                    // Build stage progress for WBS table
                    sub.stages = lifecycleStages.map(function(s) {
                        var progressValue = 0;
                        if (subStatusProgress[s.id] !== undefined) {
                            progressValue = parseInt(subStatusProgress[s.id]);
                        } else if (statusId > s.id) {
                            progressValue = 100;
                        } else if (statusId === s.id) {
                            progressValue = parseInt(sub.progress || 0);
                        }
                        return { name: s.name, progress: progressValue, color: s.color, isActive: statusId === s.id };
                    });
                });
            }
            
            ctrl.selectedControlDetails.parsedSubDesc = subDesc;

            $timeout(function() {
                var modal = new bootstrap.Modal(document.getElementById('controlDetailsModal'));
                modal.show();
            }, 0);
        };

        ctrl.getEmployeeName = function(empId) {
            if (!empId || !ctrl.store.employees) return 'Unassigned';
            var emp = ctrl.store.employees.find(function(e) { return e.id === empId; });
            return emp ? emp.employeeName : 'Unknown';
        };

        ctrl.goToControlFromModal = function(control) {
            // Close all open modals gracefully
            var m1 = document.getElementById('controlDetailsModal');
            if (m1) {
                var inst1 = bootstrap.Modal.getInstance(m1);
                if (inst1) inst1.hide();
            }
            var m2 = document.getElementById('releaseDetailsModal');
            if (m2) {
                var inst2 = bootstrap.Modal.getInstance(m2);
                if (inst2) inst2.hide();
            }
            var m3 = document.getElementById('monthReleasesModal');
            if (m3) {
                var inst3 = bootstrap.Modal.getInstance(m3);
                if (inst3) inst3.hide();
            }

            // Wait for modals to hide before navigating to avoid backdrop issues
            $timeout(function() {
                // Set to controls view
                ctrl.backToControls();
            }, 400);
        };

        ctrl.calculateStatusProgress = function () {
            // Transform the overview into a Multi-Stage Lifecycle Breakdown per objective
            // Stages: Analyze, HLD, LLD, Development, Dev Testing, QA
            var lifecycleStages = [
                { name: 'Analyze',     id: 1, color: '#6366f1' },
                { name: 'HLD',         id: 2, color: '#f59e0b' },
                { name: 'LLD',         id: 3, color: '#ec4899' },
                { name: 'Development', id: 4, color: '#3b82f6' },
                { name: 'Dev Testing', id: 5, color: '#8b5cf6' },
                { name: 'QA',          id: 6, color: '#10b981' }
            ];

            // Mapping for dynamic lookup if IDs differ from defaults
            if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                lifecycleStages.forEach(function(s) {
                    var found = ctrl.store.statuses.find(function(dbS) {
                        return dbS.statusName && dbS.statusName.toLowerCase().indexOf(s.name.toLowerCase()) !== -1;
                    });
                    if (found) s.id = found.id;
                });
            }

            ctrl.releaseStatusProgress = [];
            var statusCounts = {}; // For Pie Chart
            
            // Map each objective into the breakdown list
            ctrl.releaseControls.forEach(function (control) {
                var subs = control._subDescriptionsArray || [];
                
                if (subs.length > 0) {
                    subs.forEach(function(sub) {
                        var matchesDate = true;
                        if (ctrl.selectedReleaseDay && sub.releaseDate && !control.releaseId) {
                            var sds = typeof sub.releaseDate === 'string' ? sub.releaseDate : new Date(sub.releaseDate).toISOString();
                            if (sds.indexOf('Z') === -1 && sds.indexOf('+') === -1) sds += 'Z';
                            var sd = new Date(sds);
                            var sDay = sd.getUTCFullYear() + '-' + sd.getUTCMonth() + '-' + sd.getUTCDate();
                            matchesDate = (sDay === ctrl.selectedReleaseDay);
                        }

                        if (matchesDate) {
                            var statusId = sub.statusId ? parseInt(sub.statusId) : 1;
                            var subStatusProgress = sub.statusProgress || {};
                            var currentStatusName = sub.status || 'Analyze';
                            
                            // Tally status counts for pie chart
                            statusCounts[currentStatusName] = (statusCounts[currentStatusName] || 0) + 1;

                            var assigneeName = sub.employeeId ? ctrl.getEmployeeName(sub.employeeId) : 'Unassigned';
                            // Priority 1: sub.qaEmployeeId, Priority 2: control.qaEmployeeId
                            // Priority 3: Fallback to sub.employeeId IF the current status is actually 'QA'
                            var rawQaId = sub.qaEmployeeId || control.qaEmployeeId;
                            var qaAssigneeName = 'Unassigned';
                            
                            if (rawQaId) {
                                qaAssigneeName = ctrl.getEmployeeName(rawQaId);
                            } else if (currentStatusName.toLowerCase() === 'qa' && sub.employeeId) {
                                qaAssigneeName = ctrl.getEmployeeName(sub.employeeId);
                            }

                            // Build stages for this objective
                            var stagesList = lifecycleStages.map(function(s) {
                                var progressValue = 0;
                                if (subStatusProgress[s.id] !== undefined) {
                                    progressValue = parseInt(subStatusProgress[s.id]);
                                } else if (statusId > s.id) {
                                    progressValue = 100;
                                } else if (statusId === s.id) {
                                    progressValue = parseInt(sub.progress || 0);
                                }
                                
                                // For QA stage, use the detected QA assignee
                                // For other stages, use the sub-objective owner, or fallback to parent owner if sub is currently assigned to QA
                                var stageAssignee = assigneeName;
                                if (s.name === 'QA') {
                                    stageAssignee = qaAssigneeName;
                                } else if (currentStatusName.toLowerCase() === 'qa') {
                                    // If sub is in QA, the sub.employeeId might be the QA person. 
                                    // So for Dev stages, use the parent control owner as the default developer.
                                    stageAssignee = control.employeeId ? ctrl.getEmployeeName(control.employeeId) : assigneeName;
                                }

                                return { 
                                    name: s.name, 
                                    id: s.id, 
                                    progress: progressValue, 
                                    color: s.color, 
                                    isActive: statusId === s.id,
                                    assignee: stageAssignee
                                };
                            });

                            var gradientParts = [];
                            var currentAngle = 0;
                            var sliceSize = 100 / stagesList.length;
                            stagesList.forEach(function(stage) {
                                var filledSize = sliceSize * (stage.progress / 100);
                                var emptySize = sliceSize - filledSize;
                                if (filledSize > 0) {
                                    gradientParts.push(stage.color + ' ' + currentAngle + '% ' + (currentAngle + filledSize) + '%');
                                }
                                currentAngle += filledSize;
                                if (emptySize > 0) {
                                    gradientParts.push('#e2e8f0 ' + currentAngle + '% ' + (currentAngle + emptySize) + '%');
                                    currentAngle += emptySize;
                                }
                            });
                            var gradientStr = 'conic-gradient(' + gradientParts.join(', ') + ')';

                            ctrl.releaseStatusProgress.push({
                                title: sub.title || 'Untitled Objective',
                                currentStatus: currentStatusName,
                                stages: stagesList,
                                controlName: control.controlName,
                                controlId: control.controlId,
                                totalProgress: sub.progress || 0,
                                assigneeName: (currentStatusName.toLowerCase() === 'qa' && control.employeeId) ? ctrl.getEmployeeName(control.employeeId) : assigneeName,
                                qaAssigneeName: qaAssigneeName,
                                color: ctrl.getStatusColor(currentStatusName),
                                conicGradient: gradientStr,
                                _expanded: false,
                                _subDescriptionsArray: subs
                            });
                        }
                    });
                } else {
                    // Fallback for parent control
                    var statusId = control.statusId ? parseInt(control.statusId) : 1;
                    var currentStatusName = control.statusName || 'Analyze';
                    
                    statusCounts[currentStatusName] = (statusCounts[currentStatusName] || 0) + 1;

                    var assigneeName = control.employeeId ? ctrl.getEmployeeName(control.employeeId) : 'Unassigned';
                    var qaAssigneeName = control.qaEmployeeId ? ctrl.getEmployeeName(control.qaEmployeeId) : 'Unassigned';

                    var stagesList = lifecycleStages.map(function(s) {
                        var stageAssignee = (s.name === 'QA') ? qaAssigneeName : assigneeName;
                        return { 
                            name: s.name, 
                            progress: (statusId > s.id ? 100 : (statusId === s.id ? (control.progress || 0) : 0)),
                            color: s.color,
                            isActive: statusId === s.id,
                            assignee: stageAssignee
                        };
                    });

                    var gradientParts = [];
                    var currentAngle = 0;
                    var sliceSize = 100 / stagesList.length;
                    stagesList.forEach(function(stage) {
                        var filledSize = sliceSize * (stage.progress / 100);
                        var emptySize = sliceSize - filledSize;
                        if (filledSize > 0) {
                            gradientParts.push(stage.color + ' ' + currentAngle + '% ' + (currentAngle + filledSize) + '%');
                        }
                        currentAngle += filledSize;
                        if (emptySize > 0) {
                            gradientParts.push('#e2e8f0 ' + currentAngle + '% ' + (currentAngle + emptySize) + '%');
                            currentAngle += emptySize;
                        }
                    });
                    var gradientStr = 'conic-gradient(' + gradientParts.join(', ') + ')';

                    ctrl.releaseStatusProgress.push({
                        title: control.controlName || 'Untitled Control',
                        currentStatus: currentStatusName,
                        stages: stagesList,
                        controlName: control.controlName,
                        totalProgress: control.progress || 0,
                        assigneeName: control.employeeId ? ctrl.getEmployeeName(control.employeeId) : 'Unassigned',
                        color: ctrl.getStatusColor(currentStatusName),
                        conicGradient: gradientStr,
                        _expanded: false,
                        _subDescriptionsArray: []
                    });
                }
            });

            // Prepare chart data
            ctrl.releaseStatusChartData = {
                labels: Object.keys(statusCounts),
                data: Object.values(statusCounts),
                colors: Object.keys(statusCounts).map(function(s) { return ctrl.getStatusColor(s); })
            };

            // Redraw pie chart
            $timeout(function() { ctrl.drawReleaseObjectivesPieChart(); }, 300);
        };

        ctrl.drawReleaseObjectivesPieChart = function() {
            var ctx = document.getElementById('releaseObjectivesStatusChart');
            if (!ctx) return;
            if (ctrl.releaseObjectivesPieChart) {
                ctrl.releaseObjectivesPieChart.destroy();
            }

            if (!ctrl.releaseStatusChartData || !ctrl.releaseStatusChartData.labels.length) {
                return;
            }

            ctrl.releaseObjectivesPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ctrl.releaseStatusChartData.labels,
                    datasets: [{
                        data: ctrl.releaseStatusChartData.data,
                        backgroundColor: ctrl.releaseStatusChartData.colors,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                font: { size: 10, family: "'Inter', sans-serif" },
                                padding: 10
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: 10,
                            titleFont: { family: "'Inter', sans-serif", weight: 'bold' }
                        }
                    }
                }
            });
        };

        ctrl.getStatusColor = function (statusName) {
            var s = (statusName || '').toLowerCase().trim();
            var colors = {
                'to do': '#94a3b8',
                'in progress': '#3b82f6',
                'in review': '#f59e0b',
                'qa': '#8b5cf6',
                'ready for qa': '#f97316',
                'done': '#10b981',
                'completed': '#10b981',
                'pass': '#10b981',
                'blocked': '#ef4444',
                'fail': '#ef4444',
                'analyze': '#6366f1',
                'hld': '#f59e0b',
                'lld': '#ec4899',
                'development': '#3b82f6',
                'dev testing': '#8b5cf6',
                'on hold': '#6c757d',
                'not started': '#94a3b8',
                'pending': '#94a3b8'
            };
            return colors[s] || '#94a3b8';
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
                'Defect Verification': '#ef4444', 'Validation': '#10b981',
                'Environment Issues': '#3b82f6', 'Technical Issues / Coding': '#dc2626',
                'Missing Requirements': '#f97316', 'Design Issues': '#8b5cf6',
                'Existing Issues / Not an Issue': '#94a3b8'
            };
            var tcTypeLabels = Object.keys(tcTypeData);
            var tcTypeValues = tcTypeLabels.map(function(k) { return tcTypeData[k]; });
            var tcTypeBgColors = tcTypeLabels.map(function(k) { return tcTypeColors[k] || '#6366f1'; });
            var tcTypeIcons = {
                'Functional': 'fa-cogs', 'Regression': 'fa-redo', 'Defect Verification': 'fa-bug',
                'Validation': 'fa-check-double', 'Environment Issues': 'fa-server',
                'Technical Issues / Coding': 'fa-code', 'Missing Requirements': 'fa-file-alt',
                'Design Issues': 'fa-drafting-compass', 'Existing Issues / Not an Issue': 'fa-archive'
            };
            var tcTypeGradients = {
                'Functional': 'linear-gradient(135deg,#6366f1,#4f46e5)',
                'Regression': 'linear-gradient(135deg,#f59e0b,#d97706)',
                'Defect Verification': 'linear-gradient(135deg,#ef4444,#dc2626)',
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

        ctrl.isQA = function() {
            return AuthService.isQAEngineer();
        };

        ctrl.getUniqueDefectControls = function() {
            var controls = new Set();
            (ctrl.allDefects || []).forEach(function(d) {
                if (d.controlName) controls.add(d.controlName);
            });
            return Array.from(controls).sort();
        };

        ctrl.getMyDefects = function () {
            if (!ctrl.allDefects || !ctrl.currentUser || !ctrl.currentUser.employeeId) return [];
            return ctrl.allDefects.filter(function (d) {
                return parseInt(d.assignedToEmployeeId) === parseInt(ctrl.currentUser.employeeId);
            });
        };

        ctrl.getFilteredDefects = function () {
            var defects = [];
            if (ctrl.defectFilter === 'All') {
                defects = ctrl.allDefects || [];
            } else if (ctrl.defectFilter === 'Assigned') {
                defects = ctrl.getMyDefects();
            } else if (ctrl.defectFilter === 'QA') {
                defects = (ctrl.allDefects || []).filter(function(d) {
                    return d.status === 'Fixed' || d.status === 'Resolved' || d.status === 'Ready for QA';
                });
            } else {
                defects = ctrl.getDefectsByStatus(ctrl.defectFilter);
            }

            // Apply Control Name secondary filter
            if (ctrl.selectedControlFilter) {
                defects = defects.filter(function(d) {
                    return d.controlName === ctrl.selectedControlFilter;
                });
            }
            return defects;
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

        ctrl.viewDefect = function (defect) {
            if (!defect || !defect.controlId) return;
            
            // Navigate to controls layout and pass controlId and subIndex as query params
            $location.path('/controls').search({ 
                controlId: defect.controlId, 
                subIndex: defect.subDescriptionIndex !== null ? defect.subDescriptionIndex : undefined
            });
        };

        ctrl.viewDefectImage = function (imageUrl) {
            if (imageUrl) {
                window.open(imageUrl, '_blank');
            }
        };

        // Handle Real-time Notifications for Auto-loading
        var defectAssignedListener = $rootScope.$on('defectAssigned', function() {
            console.log('Real-time: Defect assigned. Auto-refreshing dashboard...');
            ctrl.loadDashboardData();
        });

        var defectStatusListener = $rootScope.$on('defectStatusChanged', function() {
            console.log('Real-time: Defect status changed. Auto-refreshing dashboard...');
            ctrl.loadDashboardData();
        });

        // Clean up listeners when component is destroyed
        this.$onDestroy = function() {
            if (defectAssignedListener) defectAssignedListener();
            if (defectStatusListener) defectStatusListener();
        };
    }
});
