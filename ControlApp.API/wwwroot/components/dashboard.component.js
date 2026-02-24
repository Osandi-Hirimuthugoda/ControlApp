app.component('dashboard', {
    template: `
    <div class="dashboard-premium-container" style="padding: 2rem; background: #f8fafc; min-height: 100vh; animation: fadeIn 0.6s ease-out;">
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
                <button class="btn btn-indigo rounded-pill px-4 fw-bold shadow-sm" ng-click="$ctrl.backToControls()">
                    <i class="fas fa-arrow-left me-2"></i>Back to Ops Room
                </button>
            </div>
        </div>

        <!-- Quick Insights Row -->
        <div class="row g-4 mb-5">
            <div class="col-md-3">
                <div class="insight-card p-4 rounded-4 shadow-sm border-0 bg-white d-flex align-items-center">
                    <div class="insight-icon bg-indigo-subtle text-indigo rounded-4 me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; font-size: 1.5rem;">
                        <i class="fas fa-list-check"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold text-dark mb-0">{{$ctrl.store.allControls.length || 0}}</h3>
                        <p class="text-muted small mb-0 text-uppercase fw-bold ls-1">Total Initiatives</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="insight-card p-4 rounded-4 shadow-sm border-0 bg-white d-flex align-items-center">
                    <div class="insight-icon bg-success-subtle text-success rounded-4 me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; font-size: 1.5rem;">
                        <i class="fas fa-gauge-high"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold text-dark mb-0">{{$ctrl.averageProgress}}%</h3>
                        <p class="text-muted small mb-0 text-uppercase fw-bold ls-1">System Velocity</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="insight-card p-4 rounded-4 shadow-sm border-0 bg-white d-flex align-items-center">
                    <div class="insight-icon bg-orange-subtle text-orange rounded-4 me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; font-size: 1.5rem;">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold text-dark mb-0">{{$ctrl.store.upcomingReleases.length || 0}}</h3>
                        <p class="text-muted small mb-0 text-uppercase fw-bold ls-1">Target Releases</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="insight-card p-4 rounded-4 shadow-sm border-0 bg-indigo text-white d-flex align-items-center">
                    <div class="insight-icon bg-white bg-opacity-20 text-white rounded-4 me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; font-size: 1.5rem;">
                        <i class="fas fa-users"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-0">{{$ctrl.store.employees.length || 0}}</h3>
                        <p class="text-white text-opacity-75 small mb-0 text-uppercase fw-bold ls-1">Active Squads</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Analytics Section -->
        <div class="row g-4 mb-5">
            <div class="col-md-7">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-signal me-2 text-indigo"></i>Operational Landscape</h5>
                        <div class="badge bg-light text-indigo px-3 py-2 rounded-pill fw-bold border">Distribution Tracking</div>
                    </div>
                    <div class="card-body p-4">
                        <div style="height: 350px;">
                            <canvas id="statusDistributionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-history me-2 text-purple"></i>Release Roadmap</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush">
                            <div ng-repeat="rel in $ctrl.store.upcomingReleases | limitTo:5" class="list-group-item border-0 border-bottom p-4 d-flex align-items-center hover-bg-light transition-all">
                                <div class="date-badge bg-light rounded-4 text-center me-4 shadow-sm" style="width: 60px; padding: 10px;">
                                    <div class="small fw-bold text-indigo text-uppercase">{{$ctrl.formatMonth(rel.releaseDate)}}</div>
                                    <div class="fs-4 fw-bold text-dark">{{$ctrl.formatDay(rel.releaseDate)}}</div>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="fw-bold text-dark mb-1">{{rel.releaseName}}</h6>
                                    <p class="text-muted small mb-0"><i class="fas fa-circle-check text-success me-2"></i>Infrastructure Ready</p>
                                </div>
                                <i class="fas fa-chevron-right text-muted opacity-50"></i>
                            </div>
                        </div>
                        <div ng-if="!$ctrl.store.upcomingReleases.length" class="text-center py-5">
                            <i class="fas fa-calendar-xmark text-light fs-huge d-block mb-3"></i>
                            <p class="text-muted">No scheduled maneuvers found</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Load & Progress Analytics -->
        <div class="row g-4">
            <div class="col-md-6">
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
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold text-dark mb-0"><i class="fas fa-user-gear me-2 text-success"></i>Team Force Distribution</h5>
                        <span class="x-small text-muted fw-bold text-uppercase ls-1">Workload Index</span>
                    </div>
                    <div class="card-body p-4">
                        <div ng-repeat="emp in $ctrl.employeesWorkload | limitTo:6 track by emp.employeeId" class="mb-4 d-flex align-items-center">
                            <div class="avatar-glass me-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white fw-bold" 
                                 style="width: 45px; height: 45px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
                                {{emp.employeeName.charAt(0)}}
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="fw-bold text-dark small">{{emp.employeeName}}</span>
                                    <span class="badge bg-indigo-subtle text-indigo rounded-pill px-2 py-1 x-small fw-bold">{{emp.controlCount}} Units</span>
                                </div>
                                <div class="progress rounded-pill shadow-inner" style="height: 8px; background: #eef2ff;">
                                    <div class="progress-bar rounded-pill" ng-style="{'width': emp.avgProgress + '%'}" 
                                         style="background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%); box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);"></div>
                                </div>
                            </div>
                            <div class="ms-3 text-end" style="min-width: 45px;">
                                <div class="fw-bold text-indigo small">{{emp.avgProgress}}%</div>
                            </div>
                        </div>
                        <div ng-if="!$ctrl.employeesWorkload.length" class="text-center py-5">
                            <p class="text-muted italic">Personnel mobilization pending...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, $timeout, $rootScope, $scope, AuthService) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Final values for display
        ctrl.averageProgress = 0;
        ctrl.employeesWorkload = [];

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

            // 2. Calculate Employee Workload
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

            // 3. Re-render Charts
            $timeout(function () {
                ctrl.initCharts();
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

        ctrl.$onInit = function () {
            ctrl.loadDashboardData();
        };
        
        // Load dashboard data for current team
        ctrl.loadDashboardData = function() {
            var teamId = AuthService.getTeamId();
            ctrl.currentTeamName = AuthService.getTeamName();
            
            // Load data for current team
            ApiService.loadEmployees(teamId).then(function() {
                return ApiService.loadControlTypes(teamId);
            }).then(function() {
                return ApiService.loadAllControls(teamId);
            }).then(function() {
                ctrl.refreshDashboard();
            });
        };
        
        // Listen for team changes
        var teamListener = $rootScope.$on('teamChanged', function() {
            ctrl.loadDashboardData();
        });
        
        // Cleanup
        ctrl.$onDestroy = function() {
            if (teamListener) teamListener();
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
        };
    }
});