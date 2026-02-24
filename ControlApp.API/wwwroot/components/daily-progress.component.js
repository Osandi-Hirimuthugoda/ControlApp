app.component('dailyProgress', {
    template: `
    <div class="container-fluid p-4" style="animation: fadeIn 0.5s ease-out;">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="fw-bold text-dark mb-1">
                            <i class="fas fa-calendar-check me-3 text-primary"></i>Daily Progress Tracking
                        </h2>
                        <p class="text-muted mb-0">Track and view daily progress on your objectives</p>
                    </div>
                    <div class="d-flex gap-2">
                        <input type="date" class="form-control" ng-model="$ctrl.selectedDate" ng-change="$ctrl.loadDailyProgress()">
                        <button class="btn btn-primary" ng-click="$ctrl.loadDailyProgress()">
                            <i class="fas fa-refresh me-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Daily Summary Card -->
        <div class="row mb-4" ng-if="$ctrl.dailySummary">
            <div class="col-12">
                <div class="card shadow-sm border-0" style="border-radius: 16px;">
                    <div class="card-body p-4">
                        <h5 class="card-title mb-3">
                            <i class="fas fa-chart-line me-2 text-success"></i>
                            Daily Summary - {{$ctrl.selectedDate | date:'fullDate'}}
                        </h5>
                        <div class="row text-center">
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-primary mb-1">{{$ctrl.dailySummary.totalControls}}</h3>
                                    <p class="text-muted small mb-0">Total Objectives</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-success mb-1">{{$ctrl.dailySummary.updatedControls}}</h3>
                                    <p class="text-muted small mb-0">Updated Today</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-warning mb-1">{{$ctrl.dailySummary.averageProgress | number:1}}%</h3>
                                    <p class="text-muted small mb-0">Average Progress</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-info mb-1">{{$ctrl.getCompletionRate()}}%</h3>
                                    <p class="text-muted small mb-0">Daily Update Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress Logs Table -->
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm border-0" style="border-radius: 16px;">
                    <div class="card-header bg-light border-0 d-flex justify-content-between align-items-center" style="border-radius: 16px 16px 0 0;">
                        <h5 class="mb-0">
                            <i class="fas fa-list me-2"></i>Daily Progress Logs
                        </h5>
                        <span class="badge bg-primary">{{$ctrl.progressLogs.length}} entries</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="py-3 px-4">Objective</th>
                                        <th class="py-3 px-4">Employee</th>
                                        <th class="py-3 px-4">Status</th>
                                        <th class="py-3 px-4 text-center">Progress</th>
                                        <th class="py-3 px-4">Work Description</th>
                                        <th class="py-3 px-4">Comments</th>
                                        <th class="py-3 px-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="log in $ctrl.progressLogs track by log.progressLogId" class="border-bottom">
                                        <td class="py-3 px-4">
                                            <div class="fw-bold text-dark">{{log.controlDescription || 'Control #' + log.controlId}}</div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="badge bg-light text-dark">{{log.employeeName || 'Unassigned'}}</span>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="badge" ng-class="$ctrl.getStatusBadgeClass(log.statusName)">
                                                {{log.statusName || 'No Status'}}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <div class="progress-circle-container">
                                                <div class="progress-circle" style="--progress: {{log.progress}}%">
                                                    <span class="progress-text">{{log.progress}}%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <div class="text-truncate" style="max-width: 200px;" title="{{log.workDescription}}">
                                                {{log.workDescription || 'No description'}}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <div class="text-truncate" style="max-width: 200px;" title="{{log.comments}}">
                                                {{log.comments || 'No comments'}}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <small class="text-muted">{{log.createdAt | date:'HH:mm'}}</small>
                                        </td>
                                    </tr>
                                    <tr ng-if="$ctrl.progressLogs.length === 0">
                                        <td colspan="7" class="text-center py-5">
                                            <div class="empty-state">
                                                <i class="fas fa-calendar-times fa-3x text-light mb-3"></i>
                                                <h6 class="text-secondary fw-bold">No Progress Logs Found</h6>
                                                <p class="text-muted small">No progress was logged for the selected date.</p>
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

        <!-- Weekly View Toggle -->
        <div class="row mt-4">
            <div class="col-12 text-center">
                <button class="btn btn-outline-primary" ng-click="$ctrl.toggleWeeklyView()">
                    <i class="fas fa-calendar-week me-2"></i>
                    {{$ctrl.showWeeklyView ? 'Hide' : 'Show'}} Weekly Summary
                </button>
            </div>
        </div>

        <!-- Weekly Summary -->
        <div class="row mt-4" ng-if="$ctrl.showWeeklyView">
            <div class="col-12">
                <div class="card shadow-sm border-0" style="border-radius: 16px;">
                    <div class="card-header bg-light border-0" style="border-radius: 16px 16px 0 0;">
                        <h5 class="mb-0">
                            <i class="fas fa-calendar-week me-2"></i>Weekly Progress Summary
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 col-lg-4 mb-3" ng-repeat="day in $ctrl.weeklySummary track by day.date">
                                <div class="card border h-100">
                                    <div class="card-body p-3">
                                        <h6 class="card-title">{{day.date | date:'EEE, MMM d'}}</h6>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <small class="text-muted">Updates:</small>
                                            <span class="badge bg-primary">{{day.updatedControls}}</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Avg Progress:</small>
                                            <span class="fw-bold">{{day.averageProgress | number:1}}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .stat-card {
            padding: 1rem;
            border-radius: 12px;
            background: rgba(0,0,0,0.02);
            margin-bottom: 1rem;
        }
        
        .progress-circle-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .progress-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: conic-gradient(#28a745 var(--progress), #e9ecef var(--progress));
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .progress-circle::before {
            content: '';
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: white;
            position: absolute;
        }
        
        .progress-text {
            position: relative;
            z-index: 1;
            font-size: 10px;
            font-weight: bold;
            color: #333;
        }
        
        .table tbody tr:hover {
            background-color: rgba(0,123,255,0.05) !important;
        }
    </style>
    `,
    controller: function (ApiService, NotificationService, AuthService, $http, $timeout, $rootScope, $scope) {
        var ctrl = this;
        ctrl.selectedDate = new Date().toISOString().split('T')[0]; // Today's date
        ctrl.dailySummary = null;
        ctrl.progressLogs = [];
        ctrl.showWeeklyView = false;
        ctrl.weeklySummary = [];

        ctrl.$onInit = function () {
            ctrl.loadDailyProgress();
            
            // Listen for team changes
            var teamChangedListener = $rootScope.$on('teamChanged', function() {
                console.log('Team changed - reloading daily progress');
                ctrl.loadDailyProgress();
                if (ctrl.showWeeklyView) {
                    ctrl.loadWeeklySummary();
                }
            });
            
            // Clean up listener when component is destroyed
            $scope.$on('$destroy', teamChangedListener);
        };

        ctrl.loadDailyProgress = function () {
            var dateParam = new Date(ctrl.selectedDate).toISOString();
            var teamId = AuthService.getTeamId();
            
            var url = '/api/progresslog/daily-summary?date=' + dateParam;
            if (teamId) {
                url += '&teamId=' + teamId;
            }
            
            $http.get(url)
                .then(function (response) {
                    ctrl.dailySummary = response.data;
                    ctrl.progressLogs = response.data.progressLogs || [];
                    $timeout(function () {
                        // Force digest cycle
                    }, 100);
                })
                .catch(function (error) {
                    console.error('Error loading daily progress:', error);
                    NotificationService.show('Error loading daily progress', 'error');
                });
        };

        ctrl.toggleWeeklyView = function () {
            ctrl.showWeeklyView = !ctrl.showWeeklyView;
            if (ctrl.showWeeklyView && ctrl.weeklySummary.length === 0) {
                ctrl.loadWeeklySummary();
            }
        };

        ctrl.loadWeeklySummary = function () {
            // Get start of week (Monday)
            var selectedDate = new Date(ctrl.selectedDate);
            var dayOfWeek = selectedDate.getDay();
            var startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            
            var startDateParam = startOfWeek.toISOString();
            var teamId = AuthService.getTeamId();
            
            var url = '/api/progresslog/weekly-summary?startDate=' + startDateParam;
            if (teamId) {
                url += '&teamId=' + teamId;
            }
            
            $http.get(url)
                .then(function (response) {
                    ctrl.weeklySummary = response.data;
                })
                .catch(function (error) {
                    console.error('Error loading weekly summary:', error);
                    NotificationService.show('Error loading weekly summary', 'error');
                });
        };

        ctrl.getCompletionRate = function () {
            if (!ctrl.dailySummary || ctrl.dailySummary.totalControls === 0) return 0;
            return Math.round((ctrl.dailySummary.updatedControls / ctrl.dailySummary.totalControls) * 100);
        };

        ctrl.getStatusBadgeClass = function (statusName) {
            if (!statusName) return 'bg-secondary';
            
            switch (statusName.toLowerCase()) {
                case 'analyze': return 'bg-info';
                case 'development': return 'bg-warning';
                case 'dev testing': return 'bg-primary';
                case 'qa': return 'bg-success';
                default: return 'bg-secondary';
            }
        };
    }
});