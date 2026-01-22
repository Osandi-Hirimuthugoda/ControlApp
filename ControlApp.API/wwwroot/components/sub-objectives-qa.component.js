app.component('subObjectivesQa', {
    bindings: {
        control: '<',
        onClose: '&'
    },
    template: `
    <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.55);">
        <div class="modal-dialog modal-xl modal-dialog-scrollable" style="max-width:96vw;">
            <div class="modal-content" style="border-radius:16px;border:none;box-shadow:0 10px 40px rgba(0,0,0,0.25);">

                <!-- Header -->
                <div class="modal-header border-0" style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);border-radius:16px 16px 0 0;padding:1.5rem 2rem;">
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                            <i class="fas fa-layer-group text-white fs-4"></i>
                        </div>
                        <div>
                            <h5 class="modal-title text-white fw-bold mb-0">Sub-Objectives QA View</h5>
                            <p class="text-white-50 mb-0 small">{{$ctrl.control.description}}</p>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.onClose()"></button>
                </div>

                <!-- Body -->
                <div class="modal-body p-0" style="background:#f8fafc;">

                    <!-- Empty state -->
                    <div ng-if="!$ctrl.subDescs || $ctrl.subDescs.length === 0" class="text-center py-5">
                        <i class="fas fa-layer-group fa-3x text-muted mb-3"></i>
                        <h5 class="text-secondary">No Sub-Objectives</h5>
                        <p class="text-muted small">This control has no sub-objectives defined.</p>
                    </div>

                    <!-- Sub-objectives list -->
                    <div ng-repeat="sub in $ctrl.subDescs track by $index" class="border-bottom">

                        <!-- Sub-objective header row -->
                        <div class="d-flex align-items-center justify-content-between px-4 py-3"
                             style="background:#fff;cursor:pointer;"
                             ng-click="$ctrl.toggleSub($index)">
                            <div class="d-flex align-items-center gap-3">
                                <span class="badge rounded-circle fw-bold" style="background:#6366f1;color:#fff;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;">
                                    {{$index + 1}}
                                </span>
                                <div>
                                    <div class="fw-bold text-dark">{{sub.description}}</div>
                                    <div class="d-flex gap-2 mt-1 flex-wrap">
                                        <span class="badge rounded-pill" style="font-size:0.7rem;background:rgba(99,102,241,0.1);color:#4f46e5;">
                                            <i class="fas fa-user me-1"></i>{{$ctrl.getEmployeeName(sub.employeeId) || 'Unassigned'}}
                                        </span>
                                        <span ng-if="sub.statusName" class="badge rounded-pill" style="font-size:0.7rem;background:rgba(16,185,129,0.1);color:#059669;">
                                            <i class="fas fa-circle me-1" style="font-size:0.5rem;"></i>{{sub.statusName}}
                                        </span>
                                        <span class="badge rounded-pill" style="font-size:0.7rem;background:rgba(245,158,11,0.1);color:#d97706;">
                                            <i class="fas fa-chart-bar me-1"></i>{{sub.progress || 0}}%
                                        </span>
                                        <span class="badge rounded-pill ms-1" style="font-size:0.7rem;background:#fee2e2;color:#dc2626;" ng-if="$ctrl.getDefectCount($index) > 0">
                                            <i class="fas fa-bug me-1"></i>{{$ctrl.getDefectCount($index)}} defect{{$ctrl.getDefectCount($index) > 1 ? 's' : ''}}
                                        </span>
                                        <span class="badge rounded-pill ms-1" style="font-size:0.7rem;background:#dbeafe;color:#2563eb;" ng-if="$ctrl.getTestCaseCount($index) > 0">
                                            <i class="fas fa-clipboard-check me-1"></i>{{$ctrl.getTestCaseCount($index)}} TC
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <div class="progress rounded-pill" style="width:80px;height:6px;background:#e2e8f0;">
                                    <div class="progress-bar rounded-pill" ng-style="{'width':(sub.progress||0)+'%','background':'#6366f1'}"></div>
                                </div>
                                <i class="fas text-muted" ng-class="$ctrl.expanded[$index] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                            </div>
                        </div>

                        <!-- Expanded: tabs for Test Cases and Defects -->
                        <div ng-if="$ctrl.expanded[$index]" style="background:#f8fafc;">
                            <div class="px-4 pt-3 pb-1">
                                <ul class="nav nav-tabs" style="border-bottom:2px solid #e5e7eb;">
                                    <li class="nav-item">
                                        <a class="nav-link" style="cursor:pointer;"
                                           ng-class="{'active': $ctrl.activeTab[$index] === 'testcases'}"
                                           ng-click="$ctrl.activeTab[$index] = 'testcases'; $ctrl.loadTestCases($index)">
                                            <i class="fas fa-clipboard-check me-2"></i>Test Cases
                                            <span class="badge bg-primary ms-1">{{$ctrl.getTestCaseCount($index)}}</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" style="cursor:pointer;"
                                           ng-class="{'active': $ctrl.activeTab[$index] === 'defects'}"
                                           ng-click="$ctrl.activeTab[$index] = 'defects'; $ctrl.loadDefects($index)">
                                            <i class="fas fa-bug me-2"></i>Defects
                                            <span class="badge bg-danger ms-1">{{$ctrl.getDefectCount($index)}}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <!-- Test Cases Tab -->
                            <div ng-if="$ctrl.activeTab[$index] === 'testcases'" class="px-4 pb-4 pt-2">
                                <div class="mb-3">
                                    <button ng-if="$ctrl.isQA()" class="btn btn-primary btn-sm px-3 rounded-3"
                                            ng-click="$ctrl.showAddTC[$index] = !$ctrl.showAddTC[$index]">
                                        <i class="fas" ng-class="$ctrl.showAddTC[$index] ? 'fa-times' : 'fa-plus-circle'"></i>
                                        <span class="ms-1">{{$ctrl.showAddTC[$index] ? 'Cancel' : 'Add Test Case'}}</span>
                                    </button>
                                </div>

                                <!-- Quick add form -->
                                <div ng-if="$ctrl.showAddTC[$index]" class="card border-0 shadow-sm mb-3" style="border-radius:10px;">
                                    <div class="card-body p-3">
                                        <div class="row g-2">
                                            <div class="col-md-6">
                                                <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newTC[$index].title" placeholder="Test case title *">
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newTC[$index].steps" placeholder="Steps (optional)">
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newTC[$index].expected" placeholder="Expected (optional)">
                                            </div>
                                            <div class="col-12">
                                                <button class="btn btn-sm btn-primary px-3" ng-click="$ctrl.addTestCase($index)"
                                                        ng-disabled="!$ctrl.newTC[$index].title || $ctrl.savingTC[$index]">
                                                    <i class="fas fa-save me-1"></i>{{$ctrl.savingTC[$index] ? 'Saving...' : 'Save'}}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Test cases list -->
                                <div ng-if="$ctrl.loadingTC[$index]" class="text-center py-3">
                                    <div class="spinner-border spinner-border-sm text-primary"></div>
                                </div>
                                <div ng-if="!$ctrl.loadingTC[$index] && (!$ctrl.testCases[$index] || $ctrl.testCases[$index].length === 0)" class="text-center py-3 text-muted small">
                                    <i class="fas fa-clipboard fa-2x mb-2 opacity-25"></i><br>No test cases yet
                                </div>
                                <div ng-if="!$ctrl.loadingTC[$index] && $ctrl.testCases[$index] && $ctrl.testCases[$index].length > 0">
                                    <div ng-repeat="tc in $ctrl.testCases[$index] track by tc.testCaseId" class="card border-0 shadow-sm mb-2" style="border-radius:8px;border-left:4px solid {{$ctrl.getTCColor(tc.status)}} !important;">
                                        <div class="card-body p-3">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <span class="badge rounded-pill me-2" ng-style="{'background':$ctrl.getTCColor(tc.status)}">{{tc.status}}</span>
                                                    <span class="fw-bold small">{{tc.testCaseTitle}}</span>
                                                </div>
                                                <button ng-if="$ctrl.isQA()" class="btn btn-sm btn-outline-danger border-0" ng-click="$ctrl.deleteTestCase(tc, $index)">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                            <div ng-if="tc.testSteps" class="small text-muted mt-1"><strong>Steps:</strong> {{tc.testSteps}}</div>
                                            <div ng-if="tc.expectedResult" class="small text-muted"><strong>Expected:</strong> {{tc.expectedResult}}</div>
                                            <div class="d-flex gap-2 mt-2">
                                                <button class="btn btn-sm btn-success" ng-click="$ctrl.markTC(tc, 'Pass', $index)" ng-disabled="tc.status==='Pass'"><i class="fas fa-check me-1"></i>Pass</button>
                                                <button class="btn btn-sm btn-danger" ng-click="$ctrl.markTC(tc, 'Fail', $index)" ng-disabled="tc.status==='Fail'"><i class="fas fa-times me-1"></i>Fail</button>
                                                <button class="btn btn-sm btn-secondary" ng-click="$ctrl.markTC(tc, 'Not Tested', $index)" ng-disabled="tc.status==='Not Tested'"><i class="fas fa-redo me-1"></i>Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Defects Tab -->
                            <div ng-if="$ctrl.activeTab[$index] === 'defects'" class="px-4 pb-4 pt-2">
                                <div class="mb-3">
                                    <button ng-if="$ctrl.isQA()" class="btn btn-danger btn-sm px-3 rounded-3"
                                            ng-click="$ctrl.showAddDefect[$index] = !$ctrl.showAddDefect[$index]">
                                        <i class="fas" ng-class="$ctrl.showAddDefect[$index] ? 'fa-times' : 'fa-plus-circle'"></i>
                                        <span class="ms-1">{{$ctrl.showAddDefect[$index] ? 'Cancel' : 'Report Defect'}}</span>
                                    </button>
                                </div>

                                <!-- Quick add defect form -->
                                <div ng-if="$ctrl.showAddDefect[$index]" class="card border-0 shadow-sm mb-3" style="border-radius:10px;">
                                    <div class="card-body p-3">
                                        <div class="row g-2">
                                            <div class="col-md-6">
                                                <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newDefect[$index].title" placeholder="Defect title *">
                                            </div>
                                            <div class="col-md-3">
                                                <select class="form-select form-select-sm" ng-model="$ctrl.newDefect[$index].severity">
                                                    <option value="Low">Low</option>
                                                    <option value="Medium" selected>Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Critical">Critical</option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <select class="form-select form-select-sm" ng-model="$ctrl.newDefect[$index].assignedToEmployeeId">
                                                    <option value="">Unassigned</option>
                                                    <option ng-repeat="emp in $ctrl.developers" value="{{emp.id}}">{{emp.employeeName}}</option>
                                                </select>
                                            </div>
                                            <div class="col-12">
                                                <textarea class="form-control form-control-sm" ng-model="$ctrl.newDefect[$index].description" rows="2" placeholder="Description (optional)"></textarea>
                                            </div>
                                            <div class="col-12">
                                                <button class="btn btn-sm btn-danger px-3" ng-click="$ctrl.addDefect($index)"
                                                        ng-disabled="!$ctrl.newDefect[$index].title || $ctrl.savingDefect[$index]">
                                                    <i class="fas fa-save me-1"></i>{{$ctrl.savingDefect[$index] ? 'Saving...' : 'Report'}}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Defects list -->
                                <div ng-if="$ctrl.loadingDefect[$index]" class="text-center py-3">
                                    <div class="spinner-border spinner-border-sm text-danger"></div>
                                </div>
                                <div ng-if="!$ctrl.loadingDefect[$index] && (!$ctrl.defects[$index] || $ctrl.defects[$index].length === 0)" class="text-center py-3 text-muted small">
                                    <i class="fas fa-check-circle fa-2x mb-2 opacity-25 text-success"></i><br>No defects
                                </div>
                                <div ng-if="!$ctrl.loadingDefect[$index] && $ctrl.defects[$index] && $ctrl.defects[$index].length > 0">
                                    <div ng-repeat="d in $ctrl.defects[$index] track by d.defectId" class="card border-0 shadow-sm mb-2" style="border-radius:8px;border-left:4px solid {{$ctrl.getSeverityColor(d.severity)}} !important;">
                                        <div class="card-body p-3">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <span class="badge rounded-pill me-2" ng-style="{'background':$ctrl.getSeverityColor(d.severity)}">{{d.severity}}</span>
                                                    <span class="badge me-2" ng-class="$ctrl.getStatusBadge(d.status)">{{d.status}}</span>
                                                    <span class="fw-bold small">{{d.title}}</span>
                                                </div>
                                            </div>
                                            <div ng-if="d.description" class="small text-muted mt-1">{{d.description}}</div>
                                            <div class="small text-muted mt-1">
                                                <span ng-if="d.assignedToName"><i class="fas fa-user me-1"></i>{{d.assignedToName}}</span>
                                                <span ng-if="d.reportedByName" class="ms-2"><i class="fas fa-flag me-1"></i>{{d.reportedByName}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 bg-light" style="border-radius:0 0 16px 16px;">
                    <button class="btn btn-secondary" ng-click="$ctrl.onClose()">Close</button>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, AuthService, NotificationService, $q) {
        var ctrl = this;

        ctrl.subDescs = [];
        ctrl.expanded = {};
        ctrl.activeTab = {};
        ctrl.testCases = {};   // keyed by subDescIndex
        ctrl.defects = {};
        ctrl.loadingTC = {};
        ctrl.loadingDefect = {};
        ctrl.showAddTC = {};
        ctrl.showAddDefect = {};
        ctrl.newTC = {};
        ctrl.newDefect = {};
        ctrl.savingTC = {};
        ctrl.savingDefect = {};
        ctrl.tcCounts = {};
        ctrl.defectCounts = {};
        ctrl.developers = [];

        ctrl.$onInit = function () {
            if (!ctrl.control) return;

            // Parse sub-descriptions
            if (ctrl.control.subDescriptions) {
                try {
                    var parsed = JSON.parse(ctrl.control.subDescriptions);
                    ctrl.subDescs = Array.isArray(parsed) ? parsed.filter(function (s) { return s.description && s.description.trim(); }) : [];
                } catch (e) { ctrl.subDescs = []; }
            }

            // Init per-sub state
            ctrl.subDescs.forEach(function (_, i) {
                ctrl.activeTab[i] = 'testcases';
                ctrl.newTC[i] = { title: '', steps: '', expected: '' };
                ctrl.newDefect[i] = { title: '', description: '', severity: 'Medium', assignedToEmployeeId: '' };
                ctrl.tcCounts[i] = 0;
                ctrl.defectCounts[i] = 0;
            });

            // Load all test cases and defects for this control to get counts
            ctrl.loadAllCounts();

            // Load developers for assign dropdown
            var teamId = AuthService.getTeamId();
            ApiService.loadEmployees(teamId).then(function (emps) {
                var devRoles = ['developer', 'intern developer', 'intern dev'];
                ctrl.developers = (emps || []).filter(function (e) {
                    return e.role && devRoles.indexOf(e.role.toLowerCase().trim()) !== -1;
                });
            });
        };

        ctrl.loadAllCounts = function () {
            ApiService.getTestCasesByControl(ctrl.control.controlId).then(function (tcs) {
                ctrl.subDescs.forEach(function (_, i) {
                    ctrl.testCases[i] = tcs.filter(function (tc) {
                        return tc.subDescriptionIndex === i || tc.subDescriptionIndex === String(i);
                    });
                    ctrl.tcCounts[i] = ctrl.testCases[i].length;
                });
            });
            ApiService.getDefectsByControl(ctrl.control.controlId).then(function (defs) {
                ctrl.subDescs.forEach(function (_, i) {
                    ctrl.defects[i] = defs.filter(function (d) {
                        return d.subDescriptionIndex === i || d.subDescriptionIndex === String(i);
                    });
                    ctrl.defectCounts[i] = ctrl.defects[i].length;
                });
            });
        };

        ctrl.toggleSub = function (i) {
            ctrl.expanded[i] = !ctrl.expanded[i];
            if (ctrl.expanded[i]) {
                ctrl.loadTestCases(i);
                ctrl.loadDefects(i);
            }
        };

        ctrl.loadTestCases = function (i) {
            ctrl.loadingTC[i] = true;
            ApiService.getTestCasesByControl(ctrl.control.controlId).then(function (tcs) {
                ctrl.testCases[i] = tcs.filter(function (tc) {
                    return tc.subDescriptionIndex === i || tc.subDescriptionIndex === String(i);
                });
                ctrl.tcCounts[i] = ctrl.testCases[i].length;
            }).finally(function () { ctrl.loadingTC[i] = false; });
        };

        ctrl.loadDefects = function (i) {
            ctrl.loadingDefect[i] = true;
            ApiService.getDefectsByControl(ctrl.control.controlId).then(function (defs) {
                ctrl.defects[i] = defs.filter(function (d) {
                    return d.subDescriptionIndex === i || d.subDescriptionIndex === String(i);
                });
                ctrl.defectCounts[i] = ctrl.defects[i].length;
            }).finally(function () { ctrl.loadingDefect[i] = false; });
        };

        ctrl.addTestCase = function (i) {
            if (!ctrl.newTC[i].title || !ctrl.newTC[i].title.trim()) return;
            ctrl.savingTC[i] = true;
            var teamId = AuthService.getTeamId();
            ApiService.addTestCase({
                controlId: ctrl.control.controlId,
                subDescriptionIndex: i,
                testCaseTitle: ctrl.newTC[i].title,
                testSteps: ctrl.newTC[i].steps,
                expectedResult: ctrl.newTC[i].expected,
                priority: 'Medium',
                testType: 'Functional'
            }, teamId).then(function () {
                ctrl.newTC[i] = { title: '', steps: '', expected: '' };
                ctrl.showAddTC[i] = false;
                ctrl.loadTestCases(i);
                NotificationService.show('Test case added', 'success');
            }).catch(function () {
                NotificationService.show('Error adding test case', 'error');
            }).finally(function () { ctrl.savingTC[i] = false; });
        };

        ctrl.addDefect = function (i) {
            if (!ctrl.newDefect[i].title || !ctrl.newDefect[i].title.trim()) return;
            ctrl.savingDefect[i] = true;
            var teamId = AuthService.getTeamId();
            ApiService.addDefect({
                controlId: ctrl.control.controlId,
                subDescriptionIndex: i,
                title: ctrl.newDefect[i].title,
                description: ctrl.newDefect[i].description,
                severity: ctrl.newDefect[i].severity || 'Medium',
                priority: 'Medium',
                assignedToEmployeeId: ctrl.newDefect[i].assignedToEmployeeId ? parseInt(ctrl.newDefect[i].assignedToEmployeeId) : null
            }, teamId).then(function () {
                ctrl.newDefect[i] = { title: '', description: '', severity: 'Medium', assignedToEmployeeId: '' };
                ctrl.showAddDefect[i] = false;
                ctrl.loadDefects(i);
                NotificationService.show('Defect reported', 'success');
            }).catch(function () {
                NotificationService.show('Error reporting defect', 'error');
            }).finally(function () { ctrl.savingDefect[i] = false; });
        };

        ctrl.markTC = function (tc, status, i) {
            ApiService.updateTestCase(tc.testCaseId, { status: status }).then(function () {
                ctrl.loadTestCases(i);
            });
        };

        ctrl.deleteTestCase = function (tc, i) {
            if (!confirm('Delete this test case?')) return;
            ApiService.deleteTestCase(tc.testCaseId).then(function () {
                ctrl.loadTestCases(i);
                NotificationService.show('Deleted', 'success');
            });
        };

        ctrl.getTestCaseCount = function (i) { return ctrl.tcCounts[i] || 0; };
        ctrl.getDefectCount = function (i) { return ctrl.defectCounts[i] || 0; };

        ctrl.isQA = function () {
            return AuthService.isQAEngineer() || AuthService.isAdmin() || AuthService.isSoftwareArchitecture();
        };

        ctrl.getEmployeeName = function (empId) {
            if (!empId || !ApiService.data.employees) return null;
            var e = ApiService.data.employees.find(function (x) { return x.id == empId; });
            return e ? e.employeeName : null;
        };

        ctrl.getTCColor = function (status) {
            return status === 'Pass' ? '#10b981' : status === 'Fail' ? '#dc2626' : '#6b7280';
        };

        ctrl.getSeverityColor = function (s) {
            return s === 'Critical' ? '#dc2626' : s === 'High' ? '#ea580c' : s === 'Medium' ? '#f59e0b' : '#10b981';
        };

        ctrl.getStatusBadge = function (s) {
            return s === 'Open' ? 'bg-danger text-white' : s === 'Fixed' ? 'bg-success text-white' : s === 'Closed' ? 'bg-secondary text-white' : 'bg-warning text-dark';
        };
    }
});
