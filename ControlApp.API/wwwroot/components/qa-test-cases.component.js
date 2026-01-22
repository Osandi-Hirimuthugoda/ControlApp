app.component('qaTestCases', {
    template: `
    <div class="container-fluid py-4">
        <div class="card shadow-lg border-0" style="border-radius: 24px; overflow: hidden;">
            <!-- Header -->
            <div class="card-header border-0" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 1.5rem 2rem;">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-clipboard-check text-white fs-4"></i>
                        </div>
                        <div>
                            <h4 class="mb-0 fw-bold text-white">My Test Cases</h4>
                            <p class="text-white-50 mb-0 small mt-1">View and manage all your test cases</p>
                        </div>
                    </div>
                    <div class="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm fw-bold">
                        {{$ctrl.testCases.length}} Test Cases
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="card-body bg-light border-bottom">
                <div class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" ng-model="$ctrl.searchText" placeholder="Search test cases...">
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" ng-model="$ctrl.filterStatus">
                            <option value="">All Status</option>
                            <option value="Not Tested">Not Tested</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" ng-model="$ctrl.filterControl">
                            <option value="">All Controls</option>
                            <option ng-repeat="control in $ctrl.uniqueControls" value="{{control.controlId}}">{{control.controlName}}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-primary w-100" ng-click="$ctrl.loadTestCases()">
                            <i class="fas fa-sync me-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Test Cases Grid -->
            <div class="card-body p-4">
                <!-- Empty State -->
                <div ng-if="$ctrl.getFilteredTestCases().length === 0" class="text-center py-5">
                    <i class="fas fa-clipboard fa-4x text-muted mb-3"></i>
                    <h5 class="text-secondary">No Test Cases Found</h5>
                    <p class="text-muted">Go to Controls Board and add test cases to controls.</p>
                </div>

                <!-- Test Cases Table -->
                <div ng-if="$ctrl.getFilteredTestCases().length > 0" class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 5%;">#</th>
                                <th style="width: 25%;">Test Case</th>
                                <th style="width: 20%;">Control</th>
                                <th style="width: 15%;">Status</th>
                                <th style="width: 15%;">Tested By</th>
                                <th style="width: 10%;">Tested Date</th>
                                <th style="width: 10%;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="tc in $ctrl.getFilteredTestCases() track by tc.testCaseId" 
                                ng-class="{'table-success': tc.status === 'Pass', 'table-danger': tc.status === 'Fail', 'table-secondary': tc.status === 'Not Tested'}">
                                <td>{{$index + 1}}</td>
                                <td>
                                    <div class="fw-bold">{{tc.testCaseTitle}}</div>
                                    <div class="small text-muted" ng-if="tc.testSteps" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        {{tc.testSteps}}
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-primary">{{tc.controlName || 'N/A'}}</span>
                                </td>
                                <td>
                                    <span class="badge rounded-pill" ng-style="{'background-color': $ctrl.getTestStatusColor(tc.status)}">
                                        <i class="fas" ng-class="{'fa-check': tc.status === 'Pass', 'fa-times': tc.status === 'Fail', 'fa-clock': tc.status === 'Not Tested'}"></i>
                                        {{tc.status}}
                                    </span>
                                </td>
                                <td>{{tc.testedByName || 'Not tested'}}</td>
                                <td>{{tc.testedDate ? $ctrl.formatDate(tc.testedDate) : '-'}}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" ng-click="$ctrl.viewDetails(tc)" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Statistics -->
                <div class="row mt-4" ng-if="$ctrl.testCases.length > 0">
                    <div class="col-md-3">
                        <div class="card border-0 bg-light">
                            <div class="card-body text-center">
                                <h3 class="mb-0 text-secondary" ng-bind="$ctrl.testCases.length"></h3>
                                <small class="text-muted">Total Tests</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-0 bg-success-subtle">
                            <div class="card-body text-center">
                                <h3 class="mb-0 text-success" ng-bind="$ctrl.passedCount"></h3>
                                <small class="text-success">Passed</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-0 bg-danger-subtle">
                            <div class="card-body text-center">
                                <h3 class="mb-0 text-danger" ng-bind="$ctrl.failedCount"></h3>
                                <small class="text-danger">Failed</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-0 bg-secondary-subtle">
                            <div class="card-body text-center">
                                <h3 class="mb-0 text-secondary" ng-bind="$ctrl.notTestedCount"></h3>
                                <small class="text-secondary">Not Tested</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Details Modal -->
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);" ng-if="$ctrl.selectedTestCase">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="border-radius: 16px;">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-clipboard-check me-2"></i>Test Case Details
                        </h5>
                        <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.closeDetails()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="fw-bold text-secondary small">Test Case Title</label>
                                <p class="mb-0">{{$ctrl.selectedTestCase.testCaseTitle}}</p>
                            </div>
                            <div class="col-12">
                                <label class="fw-bold text-secondary small">Control</label>
                                <p class="mb-0">{{$ctrl.selectedTestCase.controlName}}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="fw-bold text-secondary small">Status</label>
                                <p class="mb-0"> 
                                    <span class="badge rounded-pill" ng-style="{'background-color': $ctrl.getTestStatusColor($ctrl.selectedTestCase.status)}">
                                        {{$ctrl.selectedTestCase.status}}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <label class="fw-bold text-secondary small">Tested By</label>
                                <p class="mb-0">{{$ctrl.selectedTestCase.testedByName || 'Not tested'}}</p>
                            </div>
                            <div class="col-12" ng-if="$ctrl.selectedTestCase.testSteps">
                                <label class="fw-bold text-secondary small">Test Steps</label>
                                <pre class="bg-light p-3 rounded" style="white-space: pre-line;">{{$ctrl.selectedTestCase.testSteps}}</pre>
                            </div>
                            <div class="col-12" ng-if="$ctrl.selectedTestCase.expectedResult">
                                <label class="fw-bold text-secondary small">Expected Result</label>
                                <p class="mb-0 bg-light p-3 rounded">{{$ctrl.selectedTestCase.expectedResult}}</p>
                            </div>
                            <div class="col-12" ng-if="$ctrl.selectedTestCase.actualResult">
                                <label class="fw-bold text-danger small">Actual Result</label>
                                <p class="mb-0 bg-danger-subtle p-3 rounded">{{$ctrl.selectedTestCase.actualResult}}</p>
                            </div>
                            <div class="col-12" ng-if="$ctrl.selectedTestCase.defectId">
                                <div class="alert alert-danger">
                                    <i class="fas fa-bug me-2"></i>
                                    <strong>Linked to Defect #{{$ctrl.selectedTestCase.defectId}}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" ng-click="$ctrl.closeDetails()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, AuthService, NotificationService, $scope, $rootScope) {
        var ctrl = this;
        
        ctrl.testCases = [];
        ctrl.uniqueControls = [];
        ctrl.searchText = '';
        ctrl.filterStatus = '';
        ctrl.filterControl = '';
        ctrl.selectedTestCase = null;
        ctrl.passedCount = 0;
        ctrl.failedCount = 0;
        ctrl.notTestedCount = 0;
        
        ctrl.goBack = function() {
            $rootScope.currentView = 'controls';
            $rootScope.$broadcast('viewChanged', 'controls');
        };

        ctrl.$onInit = function() {
            ctrl.loadTestCases();
            
            // Listen for test case updates (same page)
            var testCasesUpdateListener = $rootScope.$on('testCasesUpdated', function() {
                console.log('Test cases updated event received - reloading...');
                ctrl.loadTestCases();
            });
            
            // Listen for storage events (cross-tab communication)
            var storageListener = function(event) {
                if (event.key === 'testCasesUpdated') {
                    console.log('Test cases updated in another tab - reloading...');
                    $scope.$apply(function() {
                        ctrl.loadTestCases();
                    });
                }
            };
            window.addEventListener('storage', storageListener);
            
            // Cleanup listeners on destroy
            $scope.$on('$destroy', function() {
                testCasesUpdateListener();
                window.removeEventListener('storage', storageListener);
            });
        };
        
        ctrl.loadTestCases = function() {
            var teamId = AuthService.getTeamId();
            
            console.log('Loading test cases for team:', teamId);
            
            ApiService.loadTestCases(teamId).then(function(testCases) {
                console.log('Test cases received from API:', testCases.length);
                
                // For now, show all test cases (we'll add filtering later if needed)
                ctrl.testCases = testCases;
                ctrl.extractUniqueControls();
                ctrl.updateCounts();
                
                console.log('Test cases loaded successfully:', ctrl.testCases.length);
            }).catch(function(error) {
                console.error('Error loading test cases:', error);
                NotificationService.show('Error loading test cases', 'error');
            });
        };
        
        ctrl.updateCounts = function() {
            ctrl.passedCount = ctrl.getCountByStatus('Pass');
            ctrl.failedCount = ctrl.getCountByStatus('Fail');
            ctrl.notTestedCount = ctrl.getCountByStatus('Not Tested');
        };
        
        ctrl.extractUniqueControls = function() {
            // Extract unique controls
            var controlsMap = {};
            ctrl.testCases.forEach(function(tc) {
                if (tc.controlId && tc.controlName) {
                    controlsMap[tc.controlId] = {
                        controlId: tc.controlId,
                        controlName: tc.controlName
                    };
                }
            });
            ctrl.uniqueControls = Object.values(controlsMap);
        };
        
        ctrl.getFilteredTestCases = function() {
            var filtered = ctrl.testCases;
            
            // Filter by search text
            if (ctrl.searchText) {
                var searchLower = ctrl.searchText.toLowerCase();
                filtered = filtered.filter(function(tc) {
                    return (tc.testCaseTitle && tc.testCaseTitle.toLowerCase().includes(searchLower)) ||
                           (tc.controlName && tc.controlName.toLowerCase().includes(searchLower)) ||
                           (tc.testSteps && tc.testSteps.toLowerCase().includes(searchLower));
                });
            }
            
            // Filter by status
            if (ctrl.filterStatus) {
                filtered = filtered.filter(function(tc) {
                    return tc.status === ctrl.filterStatus;
                });
            }
            
            // Filter by control
            if (ctrl.filterControl) {
                filtered = filtered.filter(function(tc) {
                    return tc.controlId == ctrl.filterControl;
                });
            }
            
            return filtered;
        };
        
        ctrl.getCountByStatus = function(status) {
            return ctrl.testCases.filter(function(tc) {
                return tc.status === status;
            }).length;
        };
        
        ctrl.getTestStatusColor = function(status) {
            switch(status) {
                case 'Pass': return '#10b981';
                case 'Fail': return '#dc2626';
                case 'Not Tested': return '#6b7280';
                default: return '#6b7280';
            }
        };
        
        ctrl.formatDate = function(date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };
        
        ctrl.viewDetails = function(testCase) {
            ctrl.selectedTestCase = testCase;
        };
        
        ctrl.closeDetails = function() {
            ctrl.selectedTestCase = null;
        };
    }
});
