app.component('dashboard', {
    template: `
    <!-- Summary Cards -->
    <div class="row mb-4">
        <div class="col-md-3 mb-3">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <h2 class="text-primary mb-2"><i class="fas fa-list-check"></i></h2>
                    <h3 class="mb-0">{{$ctrl.store.allControls.length}}</h3>
                    <p class="text-muted mb-0">TOTAL CONTROLS</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <h2 class="text-success mb-2"><i class="fas fa-users"></i></h2>
                    <h3 class="mb-0">{{$ctrl.store.employees.length}}</h3>
                    <p class="text-muted mb-0">TOTAL EMPLOYEES</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <h2 class="text-info mb-2"><i class="fas fa-chart-line"></i></h2>
                    <h3 class="mb-0">{{$ctrl.getAverageProgress()}}%</h3>
                    <p class="text-muted mb-0">AVERAGE PROGRESS</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <h2 class="text-warning mb-2"><i class="fas fa-check-circle"></i></h2>
                    <h3 class="mb-0">{{$ctrl.getCompletedCount()}} <span class="badge bg-success" style="font-size: 0.6em;">COMPLETE</span></h3>
                    <p class="text-muted mb-0">COMPLETED</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mb-4">
        <div class="col-md-6 mb-2">
            <button class="btn btn-primary w-100" ng-click="$ctrl.viewAllControls()">
                <i class="fas fa-list-check me-2"></i>View All Controls
            </button>
        </div>
        <div class="col-md-6 mb-2">
            <button class="btn btn-success w-100" ng-click="$ctrl.viewProgress()">
                <i class="fas fa-chart-line me-2"></i>View L3 & CR Progress
            </button>
        </div>
    </div>

    <!-- Dashboard Widgets -->
    <div class="row">
        <!-- Status Distribution -->
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0"><i class="fas fa-circle text-primary me-2" style="font-size: 0.5em;"></i>Status Distribution</h5>
                </div>
                <div class="card-body">
                    <canvas id="statusDistributionChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Progress by Description -->
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0"><i class="fas fa-chart-bar text-primary me-2" style="font-size: 0.5em;"></i>Progress by Description</h5>
                </div>
                <div class="card-body">
                    <canvas id="progressByDescriptionChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Employees by Workload -->
    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="mb-0"><i class="fas fa-user text-success me-2" style="font-size: 0.5em;"></i>Employees by Workload</h5>
                    <small class="text-muted">Most active team members</small>
                </div>
                <div class="card-body">
                    <div ng-repeat="emp in $ctrl.getEmployeesByWorkload()" class="mb-2">
                        <div class="card bg-primary text-white">
                            <div class="card-body p-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="fas fa-user me-2"></i>
                                        <strong>{{emp.employeeName}}</strong>
                                    </div>
                                    <div class="text-end">
                                        <div class="progress mb-1" style="height: 8px; width: 100px;">
                                            <div class="progress-bar bg-success" ng-style="{'width': emp.avgProgress + '%'}"></div>
                                        </div>
                                        <small>{{emp.avgProgress}}% - {{emp.controlCount}} controls</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.getEmployeesByWorkload().length === 0" class="text-center text-muted">
                        No employees with controls
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, $timeout, $rootScope) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        
        // Initialize data
        ApiService.init();
        
        ctrl.getAverageProgress = function() {
            if(!ctrl.store.allControls || ctrl.store.allControls.length === 0) return 0;
            var total = 0;
            ctrl.store.allControls.forEach(function(c) {
                total += c.progress || 0;
            });
            return Math.round(total / ctrl.store.allControls.length);
        };
        
        ctrl.getCompletedCount = function() {
            if(!ctrl.store.allControls) return 0;
            return ctrl.store.allControls.filter(function(c) {
                return c.progress === 100;
            }).length;
        };
        
        ctrl.getEmployeesByWorkload = function() {
            if(!ctrl.store.allControls || !ctrl.store.employees) return [];
            
            var empWorkload = {};
            
            // Calculate workload for each employee
            ctrl.store.allControls.forEach(function(control) {
                var empId = control.employeeId;
                if(!empWorkload[empId]) {
                    empWorkload[empId] = {
                        employeeId: empId,
                        controlCount: 0,
                        totalProgress: 0
                    };
                }
                empWorkload[empId].controlCount++;
                empWorkload[empId].totalProgress += control.progress || 0;
            });
            
            // Convert to array and calculate averages
            var result = [];
            for(var empId in empWorkload) {
                var workload = empWorkload[empId];
                var emp = ctrl.store.employees.find(e => e.id == parseInt(empId));
                if(emp) {
                    result.push({
                        employeeId: parseInt(empId),
                        employeeName: emp.employeeName,
                        controlCount: workload.controlCount,
                        avgProgress: Math.round(workload.totalProgress / workload.controlCount)
                    });
                }
            }
            
            // Sort by control count descending
            result.sort(function(a, b) {
                return b.controlCount - a.controlCount;
            });
            
            return result;
        };
        
        ctrl.viewAllControls = function() {
            $rootScope.currentView = 'controls';
            $rootScope.$broadcast('viewChanged', 'controls');
        };
        
        ctrl.viewProgress = function() {
            $rootScope.currentView = 'controls';
            $rootScope.$broadcast('viewChanged', 'controls');
        };
        
        // Initialize charts after data is loaded
        ctrl.$onInit = function() {
            $timeout(function() {
                ctrl.initCharts();
            }, 500);
        };
        
        ctrl.initCharts = function() {
            // Status Distribution Chart (Donut)
            var statusData = {};
            if(ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                ctrl.store.allControls.forEach(function(control) {
                    var statusName = control.statusName || 'No Status';
                    statusData[statusName] = (statusData[statusName] || 0) + 1;
                });
            }
            
            var statusLabels = Object.keys(statusData);
            var statusValues = Object.values(statusData);
            var statusColors = {
                'Analyze': '#87CEEB',
                'Development': '#9370DB',
                'Dev Testing': '#4169E1',
                'QA': '#32CD32',
                'No Status': '#CCCCCC'
            };
            
            var statusColorsArray = statusLabels.map(function(label) {
                return statusColors[label] || '#CCCCCC';
            });
            
            var statusCtx = document.getElementById('statusDistributionChart');
            if(statusCtx) {
                // Destroy existing chart if it exists
                if(ctrl.statusChart) {
                    ctrl.statusChart.destroy();
                }
                ctrl.statusChart = new Chart(statusCtx, {
                    type: 'doughnut',
                    data: {
                        labels: statusLabels,
                        datasets: [{
                            data: statusValues,
                            backgroundColor: statusColorsArray
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
            
            // Progress by Description Chart (Bar)
            var progressData = {};
            if(ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                ctrl.store.allControls.forEach(function(control) {
                    var desc = control.description || 'No Description';
                    var shortDesc = desc.length > 20 ? desc.substring(0, 20) + '...' : desc;
                    var label = shortDesc + ' (' + (control.typeName || 'N/A') + ') - ' + 
                                (progressData[desc] ? (progressData[desc].count + 1) : 1) + ' control(s)';
                    
                    if(!progressData[desc]) {
                        progressData[desc] = {
                            label: shortDesc + ' (' + (control.typeName || 'N/A') + ')',
                            progress: 0,
                            count: 0
                        };
                    }
                    progressData[desc].progress += control.progress || 0;
                    progressData[desc].count++;
                });
            }
            
            var progressLabels = [];
            var progressValues = [];
            for(var desc in progressData) {
                var data = progressData[desc];
                progressLabels.push(data.label + ' - ' + data.count + ' control(s)');
                progressValues.push(Math.round(data.progress / data.count));
            }
            
            var progressCtx = document.getElementById('progressByDescriptionChart');
            if(progressCtx) {
                // Destroy existing chart if it exists
                if(ctrl.progressChart) {
                    ctrl.progressChart.destroy();
                }
                ctrl.progressChart = new Chart(progressCtx, {
                    type: 'bar',
                    data: {
                        labels: progressLabels,
                        datasets: [{
                            label: 'Progress %',
                            data: progressValues,
                            backgroundColor: '#9370DB'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    callback: function(value) {
                                        return value + '%';
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        };
    }
});




