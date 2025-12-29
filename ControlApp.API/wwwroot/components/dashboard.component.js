app.component('dashboard', {
    template: `
    <!-- Back Button -->
    <div class="row mb-3">
        <div class="col-12">
            <button class="btn btn-secondary" ng-click="$ctrl.backToControls()" style="padding: 0.5rem 1rem;">
                <i class="fas fa-arrow-left me-2"></i>Back to Controls
            </button>
        </div>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4 justify-content-center">
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-list-check"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #4f46e5;">{{$ctrl.store.allControls.length || 0}}</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #6366f1;">Total Controls</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-users"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #059669;">{{$ctrl.store.employees.length || 0}}</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #10b981;">Total Employees</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #2563eb; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-chart-line"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #2563eb;">{{$ctrl.averageProgress}}%</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #3b82f6;">Average Progress</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard Widgets -->
    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm" style="min-height: 500px;">
                <div class="card-header" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5;">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-circle me-2"></i>Status Distribution</h5>
                </div>
                <div class="card-body" style="padding: 2rem;">
                    <canvas id="statusDistributionChart" style="max-height: 400px;"></canvas>
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm" style="min-height: 500px;">
                <div class="card-header" style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); color: #7c3aed;">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-chart-bar me-2"></i>Progress by Description</h5>
                </div>
                <div class="card-body" style="padding: 2rem;">
                    <canvas id="progressByDescriptionChart" style="max-height: 400px;"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Employees by Workload -->
    <div class="row">
        <div class="col-md-8 offset-md-2 mb-4">
            <div class="card shadow-sm">
                <div class="card-header" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669;">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-user me-2"></i>Employees by Workload</h5>
                </div>
                <div class="card-body" style="padding: 1.5rem;">
                    <!-- Track by employeeId is used here to prevent infinite digest loop -->
                    <div ng-repeat="emp in $ctrl.employeesWorkload track by emp.employeeId" class="mb-3">
                        <div class="card" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; border: none;">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="fas fa-user me-2" style="font-size: 1.1rem;"></i>
                                        <strong style="font-size: 1rem;">{{emp.employeeName}}</strong>
                                    </div>
                                    <div class="text-end">
                                        <div class="progress mb-2" style="height: 10px; width: 150px; background: rgba(79, 70, 229, 0.2);">
                                            <div class="progress-bar" ng-style="{'width': emp.avgProgress + '%'}" style="background: linear-gradient(90deg, #10b981 0%, #34d399 100%);"></div>
                                        </div>
                                        <small style="font-weight: 600;">{{emp.avgProgress}}% - {{emp.controlCount}} controls</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.employeesWorkload.length === 0" class="text-center text-muted py-4">
                        <i class="fas fa-info-circle me-2"></i>No employees with controls
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, $timeout, $rootScope, $scope) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        
        // Final values for display
        ctrl.averageProgress = 0;
        ctrl.employeesWorkload = [];

        // Main Refresh Function
        ctrl.refreshDashboard = function() {
            if (!ctrl.store.allControls || ctrl.store.allControls.length === 0) {
                ctrl.averageProgress = 0;
                ctrl.employeesWorkload = [];
                return;
            }

            // 1. Calculate Average Progress
            var totalProgress = 0;
            ctrl.store.allControls.forEach(function(c) {
                totalProgress += (c.progress || 0);
            });
            ctrl.averageProgress = Math.round(totalProgress / ctrl.store.allControls.length);

            // 2. Calculate Employee Workload
            if (ctrl.store.employees && ctrl.store.employees.length > 0) {
                var empMap = {};
                ctrl.store.allControls.forEach(function(control) {
                    var id = control.employeeId;
                    if (!empMap[id]) empMap[id] = { count: 0, total: 0 };
                    empMap[id].count++;
                    empMap[id].total += (control.progress || 0);
                });

                var workloadArray = [];
                ctrl.store.employees.forEach(function(emp) {
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
            $timeout(function() {
                ctrl.initCharts();
            }, 100);
        };

        // Watch for data changes from API service
        $scope.$watch(function() {
            return ctrl.store.allControls ? ctrl.store.allControls.length : 0;
        }, function(newVal, oldVal) {
            if (newVal > 0) {
                ctrl.refreshDashboard();
            }
        });

        ctrl.$onInit = function() {
            ApiService.init();
        };

        ctrl.backToControls = function() {
            $rootScope.currentView = 'controls';
            $rootScope.$broadcast('viewChanged', 'controls');
        };

        ctrl.initCharts = function() {
            // --- Status Chart ---
            var statusData = {};
            ctrl.store.allControls.forEach(function(c) {
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
                            backgroundColor: ['#a5b4fc', '#c4b5fd', '#93c5fd', '#86efac', '#e5e7eb']
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }

            // --- Progress Chart ---
            var progressLabels = [];
            var progressValues = [];
            var topControls = ctrl.store.allControls.slice(0, 10); // Show only top 10

            topControls.forEach(function(c) {
                var label = (c.description || 'N/A').substring(0, 15) + '...';
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
                            label: 'Progress %',
                            data: progressValues,
                            backgroundColor: 'rgba(196, 181, 253, 0.6)',
                            borderRadius: 8
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true, max: 100 } }
                    }
                });
            }
        };
    }
});