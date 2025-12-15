app.component('dashboard', {
    template: `
    <!-- Summary Cards -->
    <div class="row mb-4 justify-content-center">
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-list-check"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #4f46e5;">{{$ctrl.store.allControls.length}}</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #6366f1;">Total Controls</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-users"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #059669;">{{$ctrl.store.employees.length}}</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #10b981;">Total Employees</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #2563eb; border: none; min-height: 140px;">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="padding: 1.5rem 1rem;">
                    <h2 class="mb-2" style="font-size: 2rem; opacity: 0.8;"><i class="fas fa-chart-line"></i></h2>
                    <h3 class="mb-2" style="font-size: 2.2rem; font-weight: 700; color: #2563eb;">{{$ctrl.getAverageProgress()}}%</h3>
                    <p class="mb-0" style="font-weight: 600; opacity: 0.8; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; color: #3b82f6;">Average Progress</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="row mb-4">
        <div class="col-md-6 mb-2">
            <button class="btn btn-primary w-100" ng-click="$ctrl.viewAllControls()" style="padding: 1rem; font-size: 1.1rem; font-weight: 600; border-radius: 12px;">
                <i class="fas fa-list-check me-2"></i>View All Controls
            </button>
        </div>
        <div class="col-md-6 mb-2">
            <button class="btn btn-success w-100" ng-click="$ctrl.viewProgress()" style="padding: 1rem; font-size: 1.1rem; font-weight: 600; border-radius: 12px;">
                <i class="fas fa-chart-line me-2"></i>View L3 & CR Progress
            </button>
        </div>
    </div>

    <!-- Dashboard Widgets -->
    <div class="row">
        <!-- Status Distribution -->
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm" style="min-height: 500px;">
                <div class="card-header" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; padding: 1rem 1.25rem;">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-circle me-2"></i>Status Distribution</h5>
                </div>
                <div class="card-body" style="padding: 2rem;">
                    <canvas id="statusDistributionChart" style="max-height: 400px;"></canvas>
                </div>
            </div>
        </div>

        <!-- Progress by Description -->
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm" style="min-height: 500px;">
                <div class="card-header" style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); color: #7c3aed; padding: 1rem 1.25rem;">
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
                <div class="card-header" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669; padding: 1rem 1.25rem;">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-user me-2"></i>Employees by Workload</h5>
                    <small style="opacity: 0.8; color: #10b981;">Most active team members</small>
                </div>
                <div class="card-body" style="padding: 1.5rem;">
                    <div ng-repeat="emp in $ctrl.getEmployeesByWorkload()" class="mb-3">
                        <div class="card" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #4f46e5; border: none;">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="fas fa-user me-2" style="font-size: 1.1rem; color: #6366f1;"></i>
                                        <strong style="font-size: 1rem; color: #4f46e5;">{{emp.employeeName}}</strong>
                                    </div>
                                    <div class="text-end">
                                        <div class="progress mb-2" style="height: 10px; width: 150px; background: rgba(79, 70, 229, 0.2); border-radius: 10px;">
                                            <div class="progress-bar" style="background: linear-gradient(90deg, #10b981 0%, #34d399 100%); border-radius: 10px;" ng-style="{'width': emp.avgProgress + '%'}"></div>
                                        </div>
                                        <small style="font-weight: 600; font-size: 0.85rem; color: #6366f1;">{{emp.avgProgress}}% - {{emp.controlCount}} controls</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.getEmployeesByWorkload().length === 0" class="text-center text-muted py-4">
                        <i class="fas fa-info-circle me-2"></i>No employees with controls
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
                'Analyze': '#a5b4fc',
                'Development': '#c4b5fd',
                'Dev Testing': '#93c5fd',
                'QA': '#86efac',
                'No Status': '#e5e7eb'
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
                        maintainAspectRatio: false,
                        aspectRatio: 2.5,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 15,
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                }
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
                            backgroundColor: 'rgba(196, 181, 253, 0.6)',
                            borderColor: 'rgba(167, 139, 250, 0.8)',
                            borderWidth: 1,
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        aspectRatio: 2.5,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    callback: function(value) {
                                        return value + '%';
                                    },
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    }
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)'
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 11
                                    }
                                },
                                grid: {
                                    display: false
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




