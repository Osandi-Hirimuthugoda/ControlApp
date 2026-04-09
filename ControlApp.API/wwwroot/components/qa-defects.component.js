app.component('qaDefects', {
    bindings: {
        control: '<',
        subDescriptionIndex: '<',
        onClose: '&'
    },
    template: `
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content" style="border-radius: 16px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <!-- Modal Header -->
                <div class="modal-header border-0" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 16px 16px 0 0; padding: 1.5rem 2rem;">
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-clipboard-check text-white fs-4"></i>
                        </div>
                        <div>
                            <h5 class="modal-title text-white fw-bold mb-0">QA Testing & Defects</h5>
                            <p class="text-white-50 mb-0 small">{{$ctrl.control.description}}</p>
                            <p ng-if="$ctrl.subDescriptionIndex !== null && $ctrl.subDescriptionIndex !== undefined" class="mb-0 mt-1" style="font-size:0.75rem;background:rgba(255,255,255,0.15);border-radius:6px;padding:2px 8px;display:inline-block;">
                                <i class="fas fa-code-branch me-1"></i>Sub-Objective {{$ctrl.subDescriptionIndex + 1}}
                            </p>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.close()"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body p-4" style="background: #f8fafc;">
                    <!-- Tabs -->
                    <ul class="nav nav-tabs mb-4" style="border-bottom: 2px solid #e5e7eb;">
                        <li class="nav-item">
                            <a class="nav-link" ng-class="{'active': $ctrl.activeTab === 'testcases'}" ng-click="$ctrl.activeTab = 'testcases'" style="cursor: pointer;">
                                <i class="fas fa-clipboard-list me-2"></i>Test Cases
                                <span class="badge bg-primary ms-2">{{$ctrl.testCases.length}}</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" ng-class="{'active': $ctrl.activeTab === 'defects'}" ng-click="$ctrl.activeTab = 'defects'" style="cursor: pointer;">
                                <i class="fas fa-bug me-2"></i>Defects
                                <span class="badge bg-danger ms-2">{{$ctrl.defects.length}}</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" ng-class="{'active': $ctrl.activeTab === 'activity'}" ng-click="$ctrl.activeTab = 'activity'; $ctrl.loadActivityLogs()" style="cursor: pointer;">
                                <i class="fas fa-history me-2"></i>Activity Log
                                <span class="badge bg-secondary ms-2">{{$ctrl.activityLogs.length}}</span>
                            </a>
                        </li>
                    </ul>

                    <!-- Test Cases Tab -->
                    <div ng-if="$ctrl.activeTab === 'testcases'">
                        <!-- Add Test Case Button -->
                        <div class="mb-4">
                            <button class="btn btn-primary btn-sm px-4 py-2 rounded-3 shadow-sm" ng-click="$ctrl.tryAddTestCase()">
                                <i class="fas" ng-class="$ctrl.showAddTestCaseForm ? 'fa-times' : 'fa-plus-circle'"></i>
                                <span class="ms-2">{{$ctrl.showAddTestCaseForm ? 'Cancel' : 'Add Test Case'}}</span>
                            </button>
                        </div>

                        <!-- Add Test Case Form -->
                        <div ng-if="$ctrl.showAddTestCaseForm" class="card border-0 shadow-sm mb-4" style="border-radius: 12px;">
                            <div class="card-body p-4">
                                <h6 class="fw-bold text-primary mb-3"><i class="fas fa-clipboard-list me-2"></i>New Test Case</h6>
                                <form ng-submit="$ctrl.addTestCase()">
                                    <div class="row g-3">
                                        <div class="col-md-12">
                                            <label class="form-label small fw-bold text-secondary">Test Case Title <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" ng-model="$ctrl.newTestCase.testCaseTitle" placeholder="e.g., Verify login functionality" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label class="form-label small fw-bold text-secondary">Test Steps</label>
                                            <textarea class="form-control" ng-model="$ctrl.newTestCase.testSteps" rows="3" placeholder="1. Navigate to login page&#10;2. Enter credentials&#10;3. Click login button"></textarea>
                                        </div>
                                        <div class="col-md-12">
                                            <label class="form-label small fw-bold text-secondary">Expected Result</label>
                                            <textarea class="form-control" ng-model="$ctrl.newTestCase.expectedResult" rows="2" placeholder="User should be logged in successfully"></textarea>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-secondary">Priority</label>
                                            <select class="form-select" ng-model="$ctrl.newTestCase.priority">
                                                <option value="Low">Low</option>
                                                <option value="Medium" selected>Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-secondary">Test Type</label>
                                            <select class="form-select" ng-model="$ctrl.newTestCase.testType">
                                                <option value="Functional" selected>Functional</option>
                                                <option value="Regression">Regression</option>
                                                <option value="Defect Verification">Defect Verification</option>
                                                <option value="Validation">Validation</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <button type="submit" class="btn btn-primary px-4" ng-disabled="$ctrl.isSubmitting" ng-click="$ctrl.addTestCase()">
                                                <i class="fas fa-save me-2"></i>{{$ctrl.isSubmitting ? 'Saving...' : 'Add Test Case'}}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Test Cases List -->
                        <div ng-if="$ctrl.testCases.length === 0 && !$ctrl.showAddTestCaseForm" class="text-center py-5">
                            <i class="fas fa-clipboard fa-4x text-muted mb-3"></i>
                            <h5 class="text-secondary">No Test Cases</h5>
                            <p class="text-muted">Add test cases to start testing this control.</p>
                        </div>

                        <div ng-if="$ctrl.testCases.length > 0">
                            <div class="row g-3">
                                <!-- Inline Quick Add Test Case (QA Only) -->
                                <div ng-if="$ctrl.isQA()" class="col-12 mb-2">
                                    <div class="card border-0 shadow-sm bg-white" style="border-radius: 12px; border-left: 4px solid #3b82f6 !important; border-bottom: 1px solid #e5e7eb;">
                                        <div class="card-body p-3">
                                            <div class="row g-2 align-items-center">
                                                <div class="col-md-5">
                                                    <div class="input-group input-group-sm">
                                                        <span class="input-group-text bg-transparent border-0"><i class="fas fa-plus-circle text-primary"></i></span>
                                                        <input type="text" class="form-control border-0 bg-transparent fw-bold" ng-model="$ctrl.newTestCase.testCaseTitle" ng-model-options="{ debounce: 1000 }" ng-change="$ctrl.autoSaveNewTestCase()" placeholder="Quick Add Test Case Title..." ng-keyup="$event.keyCode === 13 && $ctrl.quickAddTestCase()">
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="text" class="form-control form-control-sm border-0 bg-light" ng-model="$ctrl.newTestCase.testSteps" ng-model-options="{ debounce: 1000 }" ng-change="$ctrl.autoSaveNewTestCase()" placeholder="Steps (optional)" ng-keyup="$event.keyCode === 13 && $ctrl.quickAddTestCase()">
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="text" class="form-control form-control-sm border-0 bg-light" ng-model="$ctrl.newTestCase.expectedResult" ng-model-options="{ debounce: 1000 }" ng-change="$ctrl.autoSaveNewTestCase()" placeholder="Expected (optional)" ng-keyup="$event.keyCode === 13 && $ctrl.quickAddTestCase()">
                                                </div>
                                                <div class="col-md-1 text-end">
                                                    <button class="btn btn-sm btn-primary px-3 rounded-pill" ng-click="$ctrl.quickAddTestCase()" ng-disabled="!$ctrl.newTestCase.testCaseTitle || $ctrl.isSubmitting">
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="small text-muted mt-2 px-1 d-flex justify-content-between" ng-if="$ctrl.newTestCase.testCaseTitle">
                                                <span><i class="fas fa-info-circle me-1"></i>Saving automatically as you type...</span>
                                                <span class="text-primary" ng-if="$ctrl.isSubmitting"><i class="fas fa-spinner fa-spin me-1"></i>Saving...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div ng-repeat="tc in $ctrl.testCases track by tc.testCaseId" class="col-12">
                                    <div class="card border-0 shadow-sm" style="border-radius: 12px; border-left: 4px solid {{$ctrl.getTestStatusColor(tc.status)}} !important;">
                                        <div class="card-body p-3">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h6 class="fw-bold mb-1">
                                                        <span class="badge rounded-pill me-2" ng-style="{'background-color': $ctrl.getTestStatusColor(tc.status)}">
                                                            {{tc.status}}
                                                        </span>
                                                        {{tc.testCaseTitle}}
                                                    </h6>
                                                    <div ng-if="tc.testSteps" class="small text-muted mb-2" style="white-space: pre-line;">
                                                        <strong>Steps:</strong> {{tc.testSteps}}
                                                    </div>
                                                    <div ng-if="tc.expectedResult" class="small text-muted mb-2">
                                                        <strong>Expected:</strong> {{tc.expectedResult}}
                                                    </div>
                                                    <div ng-if="tc.actualResult" class="small text-danger mb-2">
                                                        <strong>Actual:</strong> {{tc.actualResult}}
                                                    </div>
                                                </div>
                                                <div class="d-flex gap-2">
                                                    <button class="btn btn-sm btn-outline-danger" ng-click="$ctrl.deleteTestCase(tc.testCaseId)" ng-if="$ctrl.canDeleteTestCase()">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Test Actions -->
                                            <div class="d-flex gap-2 mt-3">
                                                <button class="btn btn-sm btn-success" ng-click="$ctrl.markTestAs(tc, 'Pass')" ng-disabled="tc.status === 'Pass'">
                                                    <i class="fas fa-check me-1"></i>Pass
                                                </button>
                                                <button class="btn btn-sm btn-danger" ng-click="$ctrl.markTestAs(tc, 'Fail')" ng-disabled="tc.status === 'Fail'">
                                                    <i class="fas fa-times me-1"></i>Fail
                                                </button>
                                                <button class="btn btn-sm btn-secondary" ng-click="$ctrl.markTestAs(tc, 'Not Tested')" ng-disabled="tc.status === 'Not Tested'">
                                                    <i class="fas fa-redo me-1"></i>Reset
                                                </button>
                                            </div>

                                            <!-- Actual Result Input (shown when marking as Fail) -->
                                            <div ng-if="tc._showActualResult" class="mt-3">
                                                <label class="form-label small fw-bold">Actual Result:</label>
                                                <textarea class="form-control form-control-sm" ng-model="tc._actualResultInput" rows="2" placeholder="Describe what actually happened"></textarea>
                                                <div class="mt-2">
                                                    <button class="btn btn-sm btn-danger me-2" ng-click="$ctrl.createDefectFromTest(tc)">
                                                        <i class="fas fa-bug me-1"></i>Create Defect & Assign
                                                    </button>
                                                    <button class="btn btn-sm btn-secondary" ng-click="tc._showActualResult = false">Cancel</button>
                                                </div>
                                            </div>

                                            <!-- Linked Defect -->
                                            <div ng-if="tc.defectId" class="mt-2 p-2 rounded-3 bg-danger-subtle">
                                                <small class="text-danger fw-bold">
                                                    <i class="fas fa-link me-1"></i>Linked to Defect #{{tc.defectId}}
                                                </small>
                                            </div>

                                            <div class="mt-2 small text-muted">
                                                <span ng-if="tc.testedByName">Tested by: {{tc.testedByName}}</span>
                                                <span ng-if="tc.testedDate"> on {{$ctrl.formatDate(tc.testedDate)}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Defects Tab -->
                    <div ng-if="$ctrl.activeTab === 'defects'">
                        <div class="mb-4">
                            <button class="btn btn-danger btn-sm px-4 py-2 rounded-3 shadow-sm" ng-click="$ctrl.tryReportDefect()">
                                <i class="fas" ng-class="$ctrl.showAddDefectForm ? 'fa-times' : 'fa-plus-circle'"></i>
                                <span class="ms-2">{{$ctrl.showAddDefectForm ? 'Cancel' : 'Report New Defect'}}</span>
                            </button>
                        </div>

                    <!-- Add Defect Form -->
                    <div ng-if="$ctrl.showAddDefectForm" class="card border-0 shadow-sm mb-4" style="border-radius: 12px;">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-danger mb-3"><i class="fas fa-bug me-2"></i>Report New Defect</h6>
                            <form ng-submit="$ctrl.addDefect()">
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label class="form-label small fw-bold text-secondary">Title <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" ng-model="$ctrl.newDefect.title" placeholder="Brief description of the defect" required>
                                    </div>
                                    <div class="col-md-12">
                                        <label class="form-label small fw-bold text-secondary">Description</label>
                                        <textarea class="form-control" ng-model="$ctrl.newDefect.description" rows="3" placeholder="Detailed description of the defect"></textarea>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-secondary">Severity</label>
                                        <select class="form-select" ng-model="$ctrl.newDefect.severity">
                                            <option value="Low">Low</option>
                                            <option value="Medium" selected>Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-secondary">Category</label>
                                        <select class="form-select" ng-model="$ctrl.newDefect.category">
                                            <option value="">Select Category</option>
                                            <option value="Functional">Functional</option>
                                            <option value="Regression">Regression</option>
                                            <option value="Bug Verification">Bug Verification</option>
                                            <option value="Validation">Validation</option>
                                            <option value="Environment Issues">Environment Issues</option>
                                            <option value="Technical Issues / Coding">Technical Issues / Coding</option>
                                            <option value="Missing Requirements">Missing Requirements</option>
                                            <option value="Design Issues">Design Issues</option>
                                            <option value="Existing Issues / Not an Issue">Existing Issues / Not an Issue</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-secondary">Priority</label>
                                        <select class="form-select" ng-model="$ctrl.newDefect.priority">
                                            <option value="Low">Low</option>
                                            <option value="Medium" selected>Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-secondary">Assign To</label>
                                        <select class="form-select" ng-model="$ctrl.newDefect.assignedToEmployeeId">
                                            <option value="">Unassigned</option>
                                            <option ng-repeat="emp in $ctrl.getDevelopers()" value="{{emp.id}}">{{emp.employeeName}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-12">
                                        <label class="form-label small fw-bold text-secondary">Attachments (Max 5 Screenshots)</label>
                                        <div class="input-group input-group-sm">
                                            <input type="file" id="qaDefectImageInput" class="form-control" accept="image/*" 
                                                   onchange="angular.element(this).scope().$ctrl.onImageSelect(this.files[0])"
                                                   ng-disabled="$ctrl.newDefect.attachments.length >= 5">
                                            <label class="input-group-text bg-light text-primary" for="qaDefectImageInput">
                                                <i class="fas fa-image"></i>
                                            </label>
                                        </div>
                                        <div class="mt-2 d-flex flex-wrap gap-2">
                                            <div ng-repeat="img in $ctrl.newDefect.attachments track by $index" class="position-relative" style="width: 100px; height: 100px;">
                                                <img ng-src="{{img}}" class="img-thumbnail w-100 h-100 object-fit-cover shadow-sm" style="border-radius: 8px;">
                                                <button type="button" class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle-y translate-middle-x" 
                                                        style="width: 20px; height: 20px; padding: 0; font-size: 10px;"
                                                        ng-click="$ctrl.removeImage($index)">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                            <div ng-if="$ctrl.newDefect.attachments.length === 0" class="w-100 py-3 text-center border rounded dashed" style="border: 2px dashed #e2e8f0; background: #f8fafc;">
                                                <p class="text-muted mb-0 small"><i class="fas fa-upload me-2"></i>Upload screenshots to explain the defect</p>
                                            </div>
                                        </div>
                                        <div class="mt-1 small" ng-class="$ctrl.newDefect.attachments.length >= 5 ? 'text-danger fw-bold' : 'text-muted'" style="font-size: 0.75rem;">
                                            {{$ctrl.newDefect.attachments.length}} / 5 images uploaded
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <button type="submit" class="btn btn-danger px-4" ng-disabled="$ctrl.isSubmitting">
                                            <i class="fas fa-save me-2"></i>{{$ctrl.isSubmitting ? 'Saving...' : 'Report Defect'}}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Defects List -->
                    <div ng-if="$ctrl.defects.length === 0 && !$ctrl.showAddDefectForm" class="text-center py-5">
                        <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                        <h5 class="text-secondary">No Defects Found</h5>
                        <p class="text-muted">This control has no reported defects.</p>
                    </div>

                    <div ng-if="$ctrl.defects.length > 0">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold text-secondary mb-0">
                                <i class="fas fa-list me-2"></i>Defects ({{$ctrl.getFilteredDefects().length}} / {{$ctrl.defects.length}})
                            </h6>
                            <div class="d-flex gap-2 align-items-center">
                                <label class="small text-secondary mb-0 me-2">Filter by Status:</label>
                                <select class="form-select form-select-sm" ng-model="$ctrl.statusFilter" style="width: auto; min-width: 150px;">
                                    <option value="">All Statuses</option>
                                    <option value="Open">Open</option>
                                    <option value="In Dev">In Dev</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Re-Open">Re-Open</option>
                                    <option value="Duplicate">Duplicate</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div ng-repeat="defect in $ctrl.getFilteredDefects() track by defect.defectId" class="col-12">
                                <div id="defect-{{defect.defectId}}" class="card border-0 shadow-sm defect-card" 
                                     ng-class="{'defect-mine': $ctrl.isAssignedToMe(defect)}"
                                     style="border-radius: 12px; border-left: 4px solid {{$ctrl.getSeverityColor(defect.severity)}} !important; transition: all 0.3s ease;"
                                     ng-style="$ctrl.isAssignedToMe(defect) ? {'background': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 'box-shadow': '0 0 0 2px #f59e0b, 0 4px 12px rgba(245,158,11,0.2)'} : {}">
                                    <div class="card-body p-3">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <div class="flex-grow-1">
                                                <h6 class="fw-bold mb-1">
                                                    <span class="badge rounded-pill me-2" ng-style="{'background-color': $ctrl.getSeverityColor(defect.severity)}">
                                                        {{defect.severity}}
                                                    </span>
                                                    <span class="badge bg-info text-white me-2" ng-if="defect.category">{{defect.category}}</span>
                                                    <span class="badge bg-warning text-dark me-2" ng-if="$ctrl.isAssignedToMe(defect)"><i class="fas fa-user-check me-1"></i>Assigned to Me</span>
                                                    {{defect.title}}
                                                </h6>
                                                <p class="text-muted small mb-2" ng-if="defect.description">{{defect.description}}</p>
                                            </div>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-sm btn-primary rounded-pill px-3" ng-click="$ctrl.startEdit(defect)" ng-if="$ctrl.canEditThisDefect(defect)">
                                                    <i class="fas" ng-class="defect._editing ? 'fa-times' : 'fa-pen'"></i>
                                                    <span class="ms-1">{{defect._editing ? 'Cancel' : 'Edit'}}</span>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" ng-click="$ctrl.deleteDefect(defect.defectId)" ng-if="$ctrl.canDeleteDefect()">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Edit Form -->
                                        <div ng-if="defect._editing" class="border-top pt-3 mt-2">
                                            <form ng-submit="$ctrl.updateDefect(defect)">
                                                <div class="row g-2">
                                                    <div class="col-md-12">
                                                        <label class="form-label small mb-1" ng-if="$ctrl.isDeveloper()">Title</label>
                                                        <input type="text" class="form-control form-control-sm" ng-model="defect.title" placeholder="Title" ng-if="!$ctrl.isDeveloper()">
                                                        <div class="form-control form-control-sm bg-light" ng-if="$ctrl.isDeveloper()">{{defect.title}}</div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label class="form-label small mb-1" ng-if="$ctrl.isDeveloper()">Description</label>
                                                        <textarea class="form-control form-control-sm" ng-model="defect.description" rows="2" placeholder="Description" ng-if="!$ctrl.isDeveloper()"></textarea>
                                                        <div class="form-control form-control-sm bg-light" ng-if="$ctrl.isDeveloper()" style="min-height: 60px;">{{defect.description || 'No description provided.'}}</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small mb-1">Severity</label>
                                                        <select class="form-select form-select-sm" ng-model="defect.severity" ng-if="!$ctrl.isDeveloper()">
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                            <option value="Critical">Critical</option>
                                                        </select>
                                                        <div class="form-control form-control-sm bg-light" ng-if="$ctrl.isDeveloper()">{{defect.severity}}</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small mb-1">Priority</label>
                                                        <select class="form-select form-select-sm" ng-model="defect.priority" ng-if="!$ctrl.isDeveloper()">
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                            <option value="Critical">Critical</option>
                                                        </select>
                                                        <div class="form-control form-control-sm bg-light" ng-if="$ctrl.isDeveloper()">{{defect.priority}}</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small mb-1">Category</label>
                                                        <select class="form-select form-select-sm" ng-model="defect.category" ng-if="!$ctrl.isDeveloper()">
                                                            <option value="">None</option>
                                                            <option value="Functional">Functional</option>
                                                            <option value="Regression">Regression</option>
                                                            <option value="Defect Verification">Defect Verification</option>
                                                            <option value="Validation">Validation</option>
                                                            <option value="Environment Issues">Environment Issues</option>
                                                            <option value="Technical Issues / Coding">Technical Issues / Coding</option>
                                                            <option value="Missing Requirements">Missing Requirements</option>
                                                            <option value="Design Issues">Design Issues</option>
                                                            <option value="Existing Issues / Not an Issue">Existing Issues / Not an Issue</option>
                                                        </select>
                                                        <div class="form-control form-control-sm bg-light" ng-if="$ctrl.isDeveloper()">{{defect.category || 'None'}}</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small mb-1">Status</label>
                                                        <!-- QA: dynamic options based on developer's original status -->
                                                        <select class="form-select form-select-sm" ng-model="defect.status" ng-if="$ctrl.isQA() && !$ctrl.isDeveloper()">
                                                            <option ng-repeat="opt in $ctrl.getQAStatusOptions(defect)" value="{{opt}}">{{opt}}</option>
                                                        </select>
                                                        <!-- Developer: only allowed statuses -->
                                                        <select class="form-select form-select-sm fw-bold" ng-model="defect.status" ng-if="$ctrl.isDeveloper()"
                                                                ng-style="{'border-color': '#2563eb', 'background': '#eff6ff'}">
                                                            <option value="In Dev">In Dev</option>
                                                            <option value="Fixed">Fixed</option>
                                                            <option value="Deferred">Deferred</option>
                                                            <option value="Duplicate">Duplicate</option>
                                                            <option value="Not a Defect">Not a Defect</option>
                                                            <option value="Closed">Closed</option>
                                                        </select>
                                                        <small ng-if="$ctrl.isDeveloper()" class="text-muted" style="font-size:0.7rem;">
                                                            <i class="fas fa-bell me-1"></i>QA will be notified on change
                                                        </small>
                                                    </div>
                                                    <div class="col-md-4" ng-show="!$ctrl.isDeveloper()">
                                                        <label class="form-label small mb-1">Assigned To</label>
                                                        <select class="form-select form-select-sm" ng-model="defect.assignedToEmployeeId">
                                                            <option value="">Unassigned</option>
                                                            <option ng-repeat="emp in $ctrl.getDevelopers()" value="{{emp.id}}">{{emp.employeeName}}</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4" ng-show="$ctrl.isDeveloper()">
                                                        <label class="form-label small mb-1">Reported By</label>
                                                        <div class="form-control form-control-sm bg-light fw-bold text-danger">
                                                            <i class="fas fa-user me-1"></i>{{defect.reportedByName || 'QA Engineer'}}
                                                        </div>
                                                    </div>
                                                     <div class="col-12">
                                                         <label class="form-label small mb-1">Comment / Resolution Notes <span class="text-muted">(optional)</span></label>
                                                         <textarea class="form-control form-control-sm" ng-model="defect.resolutionNotes" rows="3" placeholder="Add your comments or resolution notes here..."></textarea>
                                                     </div>
                                                     <!-- Edit Attachments -->
                                                     <div class="col-12 mt-2" ng-if="!$ctrl.isDeveloper()">
                                                         <label class="form-label small mb-1 fw-bold">Attachments (Max 5)</label>
                                                         <div class="d-flex flex-wrap gap-2">
                                                             <div ng-repeat="slot in [1,2,3,4,5]" class="position-relative" style="width: 50px; height: 50px;">
                                                                 <div ng-if="!$ctrl.getDefectImages(defect)[slot-1]" 
                                                                      class="border rounded d-flex align-items-center justify-content-center bg-light cursor-pointer h-100 w-100"
                                                                      onclick="this.nextElementSibling.click()"
                                                                      title="Upload Screenshot {{slot}}">
                                                                     <i class="fas fa-camera text-muted small"></i>
                                                                 </div>
                                                                 <input type="file" class="d-none" onchange="angular.element(this).scope().$ctrl.onEditImageSelect(this.files[0], angular.element(this).scope().defect, slot-1)" accept="image/*">
                                                                 
                                                                 <div ng-if="$ctrl.getDefectImages(defect)[slot-1]" class="position-relative h-100 w-100">
                                                                     <img ng-src="{{$ctrl.getDefectImages(defect)[slot-1]}}" class="rounded w-100 h-100" style="object-fit: cover; border: 1px solid #dee2e6;">
                                                                     <button type="button" class="btn btn-danger btn-xs rounded-circle position-absolute top-0 end-0 translate-middle p-0" 
                                                                             style="width:14px; height:14px; font-size:8px; line-height:1;"
                                                                             ng-click="$ctrl.removeEditImage(defect, slot-1)">
                                                                         <i class="fas fa-times"></i>
                                                                     </button>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                    <div class="col-12">
                                                        <button type="submit" class="btn btn-sm btn-primary">
                                                            <i class="fas fa-save me-1"></i>Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <!-- Defect Details -->
                                        <div ng-if="!defect._editing" class="d-flex flex-wrap gap-3 small">
                                            <div>
                                                <span class="text-secondary">Status:</span>
                                                <span class="badge rounded-pill ms-1" ng-class="$ctrl.getStatusBadgeClass(defect.status)">{{defect.status}}</span>
                                            </div>
                                            <div>
                                                <span class="text-secondary">Priority:</span>
                                                <span class="fw-bold ms-1">{{defect.priority}}</span>
                                            </div>
                                            <div ng-if="defect.assignedToName">
                                                <span class="text-secondary">Assigned:</span>
                                                <span class="fw-bold ms-1">{{defect.assignedToName}}</span>
                                            </div>
                                            <!-- Developer current status & progress on the control -->
                                            <div ng-if="defect.assignedToName && $ctrl.control" class="w-100 mt-1 p-2 rounded-3" style="background:#f0f9ff; border:1px solid #bae6fd;">
                                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                                    <span class="text-secondary small"><i class="fas fa-code me-1 text-blue"></i>Developer on Control:</span>
                                                    <span class="badge rounded-pill fw-bold" style="background:#dbeafe; color:#1d4ed8; font-size:0.72rem;">
                                                        <i class="fas fa-signal me-1"></i>{{$ctrl.control.statusName || 'No Status'}}
                                                    </span>
                                                    <div class="d-flex align-items-center gap-2 flex-grow-1" style="min-width:140px;">
                                                        <div class="progress flex-grow-1 rounded-pill" style="height:6px; background:#e0f2fe;">
                                                            <div class="progress-bar rounded-pill" style="background:linear-gradient(90deg,#3b82f6,#6366f1);"
                                                                 ng-style="{'width': ($ctrl.control.progress || 0) + '%'}"></div>
                                                        </div>
                                                        <span class="fw-bold text-primary" style="font-size:0.75rem; white-space:nowrap;">{{$ctrl.control.progress || 0}}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ng-if="defect.reportedByName">
                                                <span class="text-secondary">Reported by:</span>
                                                <span class="fw-bold ms-1">{{defect.reportedByName}}</span>
                                            </div>
                                            <div>
                                                <span class="text-secondary">Reported:</span>
                                                <span class="fw-bold ms-1">{{$ctrl.formatDate(defect.reportedDate)}}</span>
                                                <span class="badge bg-light text-secondary border ms-1" style="font-size:0.7rem;">
                                                    <i class="fas fa-clock me-1"></i>{{$ctrl.timeAgo(defect.reportedDate)}}
                                                </span>
                                            </div>
                                            <div ng-if="defect.resolvedDate">
                                                <span class="text-secondary">Resolved:</span>
                                                <span class="fw-bold ms-1">{{$ctrl.formatDate(defect.resolvedDate)}}</span>
                                            </div>
                                            <div ng-if="$ctrl.getTimeToResolve(defect)">
                                                <span class="text-secondary">Time to resolve:</span>
                                                <span class="badge ms-1 fw-bold" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0;">
                                                    <i class="fas fa-stopwatch me-1"></i>{{$ctrl.getTimeToResolve(defect)}}
                                                </span>
                                            </div>
                                            <div ng-if="$ctrl.getInDevToFixedDuration(defect)">
                                                <span class="text-secondary">In Dev → Fixed:</span>
                                                <span class="badge ms-1 fw-bold" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe;">
                                                    <i class="fas fa-code me-1"></i>{{$ctrl.getInDevToFixedDuration(defect)}}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Status Timeline with durations -->
                                        <div ng-if="!defect._editing" class="mt-3">
                                            <div class="d-flex align-items-center gap-1 flex-wrap">
                                                <span ng-repeat="step in $ctrl.getStatusTimeline(defect)" class="d-flex align-items-center">
                                                    <span class="badge px-2 py-1 rounded-pill fw-bold"
                                                          ng-style="step.active ? {'background': '#2563eb', 'color': '#fff'} : {'background': '#e2e8f0', 'color': '#374151', 'border': '1px solid #cbd5e1'}"
                                                          style="font-size: 0.72rem;">
                                                        <i class="fas fa-circle me-1" ng-if="step.active"></i>
                                                        <i class="fas fa-check-circle me-1" ng-if="step.done && !step.active"></i>
                                                        {{step.label}}
                                                    </span>
                                                    <i class="fas fa-chevron-right mx-1" style="font-size: 0.6rem; color: #94a3b8;" ng-if="!$last"></i>
                                                </span>
                                            </div>
                                            <!-- Per-transition durations -->
                                            <div ng-if="$ctrl.getStatusTransitions(defect).length > 0" class="mt-2 d-flex flex-wrap gap-2">
                                                <span ng-repeat="t in $ctrl.getStatusTransitions(defect) track by $index"
                                                      class="badge fw-normal d-inline-flex align-items-center gap-1"
                                                      style="background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-size:0.7rem;">
                                                    <i class="fas fa-clock text-muted"></i>
                                                    <span ng-bind="t.from"></span>
                                                    <i class="fas fa-arrow-right" style="font-size:0.55rem;"></i>
                                                    <span ng-bind="t.to"></span>:
                                                    <span class="fw-bold text-dark" ng-bind="t.duration"></span>
                                                </span>
                                                <!-- Total time if Closed -->
                                                <span ng-if="defect.status === 'Closed' && $ctrl.getTotalLifetime(defect)"
                                                      class="badge fw-bold d-inline-flex align-items-center gap-1"
                                                      style="background:#1e293b; color:#f8fafc; font-size:0.7rem;">
                                                    <i class="fas fa-flag-checkered"></i>
                                                    <span>Total:</span>
                                                    <span ng-bind="$ctrl.getTotalLifetime(defect)"></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div ng-if="!defect._editing && defect.resolutionNotes" class="mt-2 p-2 rounded-3" style="background: #f0fdf4;">
                                            <small class="text-secondary fw-bold">Resolution:</small>
                                            <p class="small mb-0 mt-1">{{defect.resolutionNotes}}</p>
                                        </div>
                                        <div ng-if="!defect._editing && $ctrl.getDefectImages(defect).length > 0" class="mt-3 p-3 rounded-3" style="background:#f8fafc; border:1px solid #e2e8f0;">
                                            <small class="text-secondary fw-bold d-block mb-2">
                                                <i class="fas fa-paperclip me-1"></i>Attachments ({{$ctrl.getDefectImages(defect).length}}):
                                            </small>
                                            <div class="d-flex flex-wrap gap-2">
                                                <div ng-repeat="img in $ctrl.getDefectImages(defect) track by $index" 
                                                     class="rounded shadow-sm overflow-hidden" 
                                                     style="height:80px; width:120px; cursor:zoom-in; border:1px solid #cbd5e1; background:#fff;"
                                                     ng-click="$ctrl.viewImage(img)">
                                                    <img ng-src="{{img}}" class="w-100 h-100 object-fit-cover" alt="Defect Screenshot {{$index+1}}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- Activity Log Tab -->
                    <div ng-if="$ctrl.activeTab === 'activity'">
                        <div ng-if="$ctrl.loadingLogs" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted small">Loading activity...</p>
                        </div>
                        <div ng-if="!$ctrl.loadingLogs && $ctrl.activityLogs.length === 0" class="text-center py-5">
                            <i class="fas fa-history fa-4x text-muted mb-3"></i>
                            <h5 class="text-secondary">No Activity Yet</h5>
                            <p class="text-muted small">Actions on defects and test cases will appear here.</p>
                        </div>
                        <div ng-if="!$ctrl.loadingLogs && $ctrl.activityLogs.length > 0">
                            <div class="timeline ps-2">
                                <div ng-repeat="log in $ctrl.activityLogs track by log.activityLogId" class="d-flex gap-3 mb-3">
                                    <!-- Icon -->
                                    <div class="flex-shrink-0 d-flex flex-column align-items-center">
                                        <div class="rounded-circle d-flex align-items-center justify-content-center"
                                             ng-style="{'background': $ctrl.getActivityColor(log), 'width': '36px', 'height': '36px'}">
                                            <i class="fas text-white" style="font-size:0.8rem;"
                                               ng-class="$ctrl.getActivityIcon(log)"></i>
                                        </div>
                                        <div class="flex-grow-1 border-start border-2 border-light" style="width:1px; min-height:20px;" ng-if="!$last"></div>
                                    </div>
                                    <!-- Content -->
                                    <div class="card border-0 shadow-sm flex-grow-1 mb-1" style="border-radius:10px;">
                                        <div class="card-body p-3">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <span class="badge rounded-pill me-2"
                                                          ng-style="{'background': $ctrl.getActivityColor(log), 'color': '#fff', 'font-size':'0.7rem'}">
                                                        {{log.entityType}}
                                                    </span>
                                                    <span class="fw-bold small">{{log.description}}</span>
                                                </div>
                                                <span class="text-muted" style="font-size:0.72rem; white-space:nowrap;">{{$ctrl.formatDateTime(log.timestamp)}}</span>
                                            </div>
                                            <div class="mt-1 small text-muted" ng-if="log.oldValue || log.newValue">
                                                <span ng-if="log.oldValue" class="badge bg-light text-secondary border me-1">{{log.oldValue}}</span>
                                                <i class="fas fa-arrow-right text-muted mx-1" style="font-size:0.65rem;" ng-if="log.oldValue && log.newValue"></i>
                                                <span ng-if="log.newValue" class="badge bg-primary text-white ms-1">{{log.newValue}}</span>
                                            </div>
                                            <div class="mt-1 small text-secondary" ng-if="log.performedByName">
                                                <i class="fas fa-user me-1"></i>{{log.performedByName}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <!-- Modal Footer -->
                <div class="modal-footer border-0 bg-light" style="border-radius: 0 0 16px 16px;">
                    <button type="button" class="btn btn-secondary" ng-click="$ctrl.close()">Close</button>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, NotificationService, AuthService, $scope, $rootScope) {
        var ctrl = this;

        ctrl.defects = [];
        ctrl.testCases = [];
        ctrl.employees = [];
        ctrl.showAddDefectForm = false;
        ctrl.showAddTestCaseForm = false;
        ctrl.isSubmitting = false;
        ctrl.statusFilter = ''; // Empty string for "All Statuses"
        ctrl.activeTab = 'testcases'; // Default to test cases tab

        ctrl.newDefect = {
            title: '',
            description: '',
            severity: 'Medium',
            priority: 'Medium',
            category: '',
            assignedToEmployeeId: null,
            attachments: []
        };

        ctrl.newTestCase = {
            testCaseTitle: '',
            testSteps: '',
            expectedResult: '',
            priority: 'Medium',
            testType: 'Functional'
        };

        ctrl.activityLogs = [];
        ctrl.loadingLogs = false;

        ctrl.$onInit = function () {
            if (!ctrl.activeTab) ctrl.activeTab = 'defects';
            ctrl.loadDefects();
            ctrl.loadTestCases();
            ctrl.loadEmployees();
            if (ctrl.activeTab === 'activity') {
                ctrl.loadActivityLogs();
            }
        };

        ctrl.$onChanges = function (changes) {
            if ((changes.control && !changes.control.isFirstChange()) || 
                (changes.subDescriptionIndex && !changes.subDescriptionIndex.isFirstChange())) {
                ctrl.loadDefects();
                ctrl.loadTestCases();
                if (ctrl.activeTab === 'activity') {
                    ctrl.loadActivityLogs();
                }
            }
        };

        ctrl.isDeveloper = function () {
            return AuthService.isDeveloper() || AuthService.isTeamLead();
        };

        ctrl.isQA = function () {
            return AuthService.isQAEngineer() || AuthService.isAdmin() || AuthService.isSoftwareArchitecture();
        };

        ctrl.tryAddTestCase = function () {
            if (!ctrl.isQA()) {
                Swal.fire({
                    icon: 'info',
                    title: 'View Only',
                    text: 'Only the assigned QA Engineer can add test cases. You can view them.',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'OK'
                });
                return;
            }
            ctrl.showAddTestCaseForm = !ctrl.showAddTestCaseForm;
        };

        ctrl.tryReportDefect = function () {
            if (!ctrl.isQA()) {
                Swal.fire({
                    icon: 'info',
                    title: 'View Only',
                    text: 'Only the assigned QA Engineer can report defects. You can view them.',
                    confirmButtonColor: '#dc2626',
                    confirmButtonText: 'OK'
                });
                return;
            }
            ctrl.showAddDefectForm = !ctrl.showAddDefectForm;
        };

        ctrl.isAssignedToMe = function (defect) {
            var user = AuthService.getUser();
            return user && user.employeeId && defect.assignedToEmployeeId === user.employeeId;
        };

        ctrl.loadTestCases = function () {
            if (!ctrl.control || !ctrl.control.controlId) return;
            ApiService.getTestCasesByControl(ctrl.control.controlId).then(function (testCases) {
                // Filter by sub-description index if specified
                if (ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined) {
                    ctrl.testCases = testCases.filter(function (tc) {
                        return tc.subDescriptionIndex === ctrl.subDescriptionIndex || tc.subDescriptionIndex === String(ctrl.subDescriptionIndex);
                    });
                } else {
                    // Show only general test cases (those without a sub-description index)
                    ctrl.testCases = testCases.filter(function (tc) {
                        return tc.subDescriptionIndex === null || tc.subDescriptionIndex === undefined || tc.subDescriptionIndex === -1;
                    });
                }
                console.log('Loaded test cases for control:', ctrl.control.controlId, ctrl.testCases.length);
            }).catch(function (error) {
                console.error('Error loading test cases:', error);
                NotificationService.show('Error loading test cases', 'error');
            });
        };

        ctrl.loadDefects = function () {
            if (!ctrl.control || !ctrl.control.controlId) return;

            ApiService.getDefectsByControl(ctrl.control.controlId).then(function (defects) {
                // Filter by sub-description if opened from sub-description button
                if (ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined) {
                    ctrl.defects = defects.filter(function (d) {
                        return d.subDescriptionIndex === ctrl.subDescriptionIndex || d.subDescriptionIndex === String(ctrl.subDescriptionIndex);
                    });
                } else {
                    // Show only general defects
                    ctrl.defects = defects.filter(function (d) {
                        return d.subDescriptionIndex === null || d.subDescriptionIndex === undefined || d.subDescriptionIndex === -1;
                    });
                }
                ctrl.loadActivityLogs();
            }).catch(function (error) {
                console.error('Error loading defects:', error);
                NotificationService.show('Error loading defects', 'error');
            });
        };

        ctrl.loadEmployees = function () {
            var teamId = AuthService.getTeamId();
            ApiService.loadEmployees(teamId).then(function (employees) {
                ctrl.employees = employees;
            });
        };

        ctrl.getDevelopers = function () {
            var devRoles = ['developer', 'intern developer', 'intern dev', 'team lead', 'software architecture', 'software architect'];
            return (ctrl.employees || []).filter(function (emp) {
                return emp.role && devRoles.indexOf(emp.role.toLowerCase().trim()) !== -1;
            });
        };

        ctrl.addDefect = function () {
            if (!ctrl.newDefect.title || !ctrl.newDefect.title.trim()) {
                NotificationService.show('Please enter a defect title', 'error');
                return;
            }

            ctrl.isSubmitting = true;

            var finalAttachmentUrl = null;
            if (ctrl.newDefect.attachments && ctrl.newDefect.attachments.length > 0) {
                finalAttachmentUrl = JSON.stringify(ctrl.newDefect.attachments);
            }

            var defectData = {
                controlId: ctrl.control.controlId,
                subDescriptionIndex: ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined ? ctrl.subDescriptionIndex : null,
                title: ctrl.newDefect.title,
                description: ctrl.newDefect.description,
                severity: ctrl.newDefect.severity,
                priority: ctrl.newDefect.priority,
                category: ctrl.newDefect.category,
                assignedToEmployeeId: ctrl.newDefect.assignedToEmployeeId ? parseInt(ctrl.newDefect.assignedToEmployeeId) : null,
                attachmentUrls: ctrl.newDefect.attachments || [],
                attachmentUrl: ctrl.newDefect.attachments.length > 0 ? ctrl.newDefect.attachments[0] : null
            };

            var teamId = AuthService.getTeamId();

            ApiService.addDefect(defectData, teamId).then(function (defect) {
                var devName = defect.assignedToName || 'assigned developer';
                Swal.fire({ icon: 'success', title: 'Defect Added', text: 'Defect successfully added to ' + devName, timer: 2500, showConfirmButton: false });
                ctrl.defects.push(defect);
                ctrl.showAddDefectForm = false;
                ctrl.newDefect = {
                    title: '',
                    description: '',
                    severity: 'Medium',
                    priority: 'Medium',
                    category: '',
                    assignedToEmployeeId: null,
                    attachments: []
                };
                ctrl.loadDefects(); // Reload to get updated data
                // Broadcast event to notify other components (e.g. Developer Progress, Control Board)
                $rootScope.$broadcast('defectsUpdated');
            }).catch(function (error) {
                console.error('Error adding defect:', error);
                NotificationService.show('Error reporting defect: ' + (error.data?.message || 'Unknown error'), 'error');
            }).finally(function () {
                ctrl.isSubmitting = false;
            });
        };

        ctrl.updateDefect = function (defect) {
            var updateData = {
                title: defect.title,
                description: defect.description,
                severity: defect.severity,
                status: defect.status,
                priority: defect.priority,
                category: defect.category,
                assignedToEmployeeId: defect.assignedToEmployeeId ? parseInt(defect.assignedToEmployeeId) : null,
                resolutionNotes: defect.resolutionNotes,
                subDescriptionIndex: defect.subDescriptionIndex,
                attachmentUrls: $ctrl.getDefectImages(defect)
            };

            ApiService.updateDefect(defect.defectId, updateData).then(function (updated) {
                NotificationService.show('Defect updated successfully', 'success');
                defect._editing = false;
                ctrl.loadDefects(); // Reload to get updated data
                // Broadcast event to notify other components
                $rootScope.$broadcast('defectsUpdated');
            }).catch(function (error) {
                console.error('Error updating defect:', error);
                NotificationService.show('Error updating defect: ' + (error.data?.message || 'Unknown error'), 'error');
            });
        };

        ctrl.deleteDefect = function (defectId) {
            if (!confirm('Are you sure you want to delete this defect?')) return;

            ApiService.deleteDefect(defectId).then(function () {
                NotificationService.show('Defect deleted successfully', 'success');
                ctrl.defects = ctrl.defects.filter(function (d) { return d.defectId !== defectId; });
                // Broadcast event to notify other components
                $rootScope.$broadcast('defectsUpdated');
            }).catch(function (error) {
                console.error('Error deleting defect:', error);
                NotificationService.show('Error deleting defect: ' + (error.data?.message || 'Unknown error'), 'error');
            });
        };

        ctrl.getFilteredDefects = function () {
            if (!ctrl.statusFilter || ctrl.statusFilter === '') {
                return ctrl.defects;
            }
            return ctrl.defects.filter(function (d) { return d.status === ctrl.statusFilter; });
        };

        ctrl.getSeverityColor = function (severity) {
            switch (severity) {
                case 'Critical': return '#dc2626';
                case 'High': return '#ea580c';
                case 'Medium': return '#f59e0b';
                case 'Low': return '#10b981';
                default: return '#6b7280';
            }
        };

        ctrl.getStatusBadgeClass = function (status) {
            switch (status) {
                case 'Open':         return 'bg-danger text-white';
                case 'In Dev':       return 'bg-warning text-dark';
                case 'Fixed':        return 'bg-success text-white';
                case 'Verified Fix': return 'bg-success text-white';
                case 'Re-Open':      return 'bg-danger text-white';
                case 'Deferred':     return 'bg-secondary text-white';
                case 'Duplicate':    return 'bg-dark text-white';
                case 'Not a Defect': return 'bg-info text-white';
                case 'Closed':       return 'bg-secondary text-white';
                default:             return 'bg-secondary text-white';
            }
        };

        // Returns QA-allowed status options based on what developer set
        ctrl.getQAStatusOptions = function (defect) {
            var status = defect._originalStatus || defect.status;
            switch (status) {
                case 'Fixed':     return ['Re-Open', 'Closed'];
                case 'Duplicate': return ['Re-Open', 'Closed'];
                case 'Re-Open':   return ['Re-Open', 'In Dev', 'Open'];
                case 'Closed':    return ['Closed', 'Re-Open'];
                default:          return ['Open', 'In Dev', 'Closed'];
            }
        };

        // Returns status timeline steps for a defect
        ctrl.getStatusTimeline = function (defect) {
            var status = defect.status;
            var flows = {
                'Open':      ['Open', 'In Dev', 'Fixed', 'Closed'],
                'In Dev':    ['Open', 'In Dev', 'Fixed', 'Closed'],
                'Fixed':     ['Open', 'In Dev', 'Fixed', 'Closed'],
                'Closed':    ['Open', 'In Dev', 'Fixed', 'Closed'],
                'Re-Open':   ['Open', 'Re-Open', 'In Dev', 'Fixed', 'Closed'],
                'Duplicate': ['Open', 'Duplicate', 'Closed']
            };
            var steps = flows[status] || ['Open', status, 'Closed'];
            var activeIdx = steps.indexOf(status);
            return steps.map(function (label, idx) {
                return { label: label, active: label === status, done: idx < activeIdx };
            });
        };

        ctrl.toUTC = function (date) {
            if (!date) return null;
            var s = String(date);
            // If no timezone info, treat as UTC
            if (s.indexOf('Z') === -1 && s.indexOf('+') === -1 && !/\d{2}-\d{2}:\d{2}$/.test(s)) {
                s = s + 'Z';
            }
            var d = new Date(s);
            return isNaN(d) ? null : d;
        };

        ctrl.formatDate = function (date) {
            var d = ctrl.toUTC(date);
            if (!d) return '';
            return d.toLocaleString('en-GB', {
                timeZone: 'Asia/Colombo',
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
        };

        ctrl.timeAgo = function (date) {
            var d = ctrl.toUTC(date);
            if (!d) return '';
            var now = new Date();
            var diffMs = now - d;
            if (diffMs < 0) diffMs = 0;
            var mins  = Math.floor(diffMs / 60000);
            var hours = Math.floor(diffMs / 3600000);
            var days  = Math.floor(diffMs / 86400000);
            if (mins < 1)   return 'just now';
            if (mins < 60)  return mins + 'm ago';
            if (hours < 24) return hours + 'h ' + (mins % 60) + 'm ago';
            if (days < 30)  return days + 'd ago';
            var months = Math.floor(days / 30);
            return months + ' month' + (months > 1 ? 's' : '') + ' ago';
        };

        ctrl.startEdit = function (defect) {
            if (defect._editing) {
                defect._editing = false;
            } else {
                defect._originalStatus = defect.status;
                defect._editing = true;
                // Initialize attachmentUrls if not already an array for easier editing
                if (!defect.attachmentUrls) {
                    defect.attachmentUrls = ctrl.getDefectImages(defect);
                }
            }
        };

        ctrl.onEditImageSelect = function (file, defect, slotIndex) {
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                NotificationService.show('Image size should be less than 5MB', 'warning');
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    if (!defect.attachmentUrls) defect.attachmentUrls = ctrl.getDefectImages(defect);
                    // Ensure the list is long enough
                    while (defect.attachmentUrls.length <= slotIndex) {
                        defect.attachmentUrls.push(null);
                    }
                    defect.attachmentUrls[slotIndex] = e.target.result;
                    // Map back to properties for getDefectImages to reflect change immediately if needed, 
                    // though getDefectImages checks attachmentUrls first now.
                    var propSuffix = slotIndex === 0 ? '' : (slotIndex + 1);
                    defect['attachmentUrl' + propSuffix] = e.target.result;
                });
            };
            reader.readAsDataURL(file);
        };

        ctrl.removeEditImage = function (defect, slotIndex) {
            if (!defect.attachmentUrls) defect.attachmentUrls = ctrl.getDefectImages(defect);
            defect.attachmentUrls[slotIndex] = null;
            var propSuffix = slotIndex === 0 ? '' : (slotIndex + 1);
            defect['attachmentUrl' + propSuffix] = null;
        };

        ctrl.canAddDefect = function () {
            // Anyone who can mark progress can add defects (Admins, Team Leads, Software Architecture, QA Engineers)
            // Or use the simpler check from AuthService
            return AuthService.canMarkProgress() || AuthService.isAdmin();
        };

        ctrl.canEditDefect = function () {
            if (AuthService.isAdmin() || AuthService.canMarkProgress()) return true;
            var user = AuthService.getUser();
            if (user && user.employeeId && AuthService.isDeveloper()) return true;
            return false;
        };

        ctrl.canEditThisDefect = function (defect) {
            if (AuthService.isAdmin() || AuthService.isTeamLead() || AuthService.isSoftwareArchitecture()) return true;
            // All QA Engineers can edit defects
            if (AuthService.isQAEngineer()) return true;
            // Developer can edit only defects assigned to them
            var user = AuthService.getUser();
            if (user && user.employeeId && AuthService.isDeveloper()) {
                return defect.assignedToEmployeeId == user.employeeId;
            }
            return false;
        };

        ctrl.canDeleteDefect = function () {
            // Only admins can delete
            return AuthService.isAdmin();
        };

        // Test Case Functions
        ctrl.canAddTestCase = function () {
            // QA Engineers can add test cases to controls assigned to them
            // Admins and Team Leads can add to any control
            if (AuthService.isAdmin() || AuthService.canMarkProgress()) {
                return true;
            }

            // Check if this control is assigned to current QA user
            var user = AuthService.getUser();
            if (!user || !user.employeeId) return false;

            // Check if control's QA employee matches current user
            if (ctrl.control && ctrl.control.qaEmployeeId && ctrl.control.qaEmployeeId === user.employeeId) {
                return true;
            }

            // Check if control is assigned to current user (for QA status)
            if (ctrl.control && ctrl.control.employeeId && ctrl.control.employeeId === user.employeeId) {
                var role = AuthService.getRole();
                if (role) {
                    var roleStr = role.toLowerCase().trim();
                    if (roleStr === 'qa engineer' || roleStr === 'qa' || roleStr === 'intern qa engineer') {
                        return true;
                    }
                }
            }

            return false;
        };

        ctrl.canExecuteTest = function () {
            // Same logic as canAddTestCase - only assigned QA can execute tests
            if (AuthService.isAdmin() || AuthService.canMarkProgress()) {
                return true;
            }

            var user = AuthService.getUser();
            if (!user || !user.employeeId) return false;

            // Check if control's QA employee matches current user
            if (ctrl.control && ctrl.control.qaEmployeeId && ctrl.control.qaEmployeeId === user.employeeId) {
                return true;
            }

            // Check if control is assigned to current user (for QA status)
            if (ctrl.control && ctrl.control.employeeId && ctrl.control.employeeId === user.employeeId) {
                var role = AuthService.getRole();
                if (role) {
                    var roleStr = role.toLowerCase().trim();
                    if (roleStr === 'qa engineer' || roleStr === 'qa' || roleStr === 'intern qa engineer') {
                        return true;
                    }
                }
            }

            return false;
        };

        ctrl.canDeleteTestCase = function () {
            return AuthService.isAdmin();
        };

        ctrl.autoSaveNewTestCase = function () {
            if (ctrl.newTestCase.testCaseTitle && ctrl.newTestCase.testCaseTitle.trim().length > 3 && !ctrl.isSubmitting) {
                ctrl.addTestCase();
            }
        };

        ctrl.quickAddTestCase = function () {
            if (!ctrl.newTestCase.testCaseTitle || !ctrl.newTestCase.testCaseTitle.trim()) return;
            ctrl.addTestCase();
        };
        ctrl.addTestCase = function () {
            console.log('=== ADD TEST CASE FUNCTION CALLED ===');
            console.log('addTestCase called');
            console.log('newTestCase:', ctrl.newTestCase);
            console.log('showAddTestCaseForm:', ctrl.showAddTestCaseForm);
            console.log('control:', ctrl.control);

            if (!ctrl.newTestCase.testCaseTitle || !ctrl.newTestCase.testCaseTitle.trim()) {
                console.log('Validation failed: Title is empty');
                NotificationService.show('Please enter a test case title', 'error');
                return;
            }

            console.log('Validation passed, submitting...');
            ctrl.isSubmitting = true;

            var testCaseData = {
                controlId: ctrl.control.controlId,
                subDescriptionIndex: ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined ? ctrl.subDescriptionIndex : null,
                testCaseTitle: ctrl.newTestCase.testCaseTitle,
                testSteps: ctrl.newTestCase.testSteps,
                expectedResult: ctrl.newTestCase.expectedResult,
                priority: ctrl.newTestCase.priority,
                testType: ctrl.newTestCase.testType
            };

            console.log('Test case data to submit:', testCaseData);

            var teamId = AuthService.getTeamId();
            console.log('Team ID:', teamId);

            ApiService.addTestCase(testCaseData, teamId).then(function (testCase) {
                console.log('Test case added successfully:', testCase);
                NotificationService.show('Test case added successfully', 'success');
                ctrl.testCases.push(testCase);
                ctrl.showAddTestCaseForm = false;
                ctrl.newTestCase = {
                    testCaseTitle: '',
                    testSteps: '',
                    expectedResult: '',
                    priority: 'Medium',
                    testType: 'Functional'
                };
                ctrl.loadTestCases();

                // Broadcast event to notify other components
                $rootScope.$broadcast('testCasesUpdated');

                // Trigger storage event for cross-tab communication
                localStorage.setItem('testCasesUpdated', Date.now().toString());
            }).catch(function (error) {
                console.error('Error adding test case:', error);
                NotificationService.show('Error adding test case: ' + (error.data?.message || 'Unknown error'), 'error');
            }).finally(function () {
                ctrl.isSubmitting = false;
            });
        };

        ctrl.markTestAs = function (testCase, status) {
            if (status === 'Fail') {
                // Show actual result input
                testCase._showActualResult = true;
                testCase._actualResultInput = testCase.actualResult || '';
                return;
            }

            var updateData = {
                status: status,
                actualResult: status === 'Pass' ? 'Test passed as expected' : null
            };

            ApiService.updateTestCase(testCase.testCaseId, updateData).then(function (updated) {
                NotificationService.show('Test case updated', 'success');
                ctrl.loadTestCases();
                $rootScope.$broadcast('testCasesUpdated');
                localStorage.setItem('testCasesUpdated', Date.now().toString());
            }).catch(function (error) {
                console.error('Error updating test case:', error);
                NotificationService.show('Error updating test case', 'error');
            });
        };

        ctrl.createDefectFromTest = function (testCase) {
            if (!testCase._actualResultInput || !testCase._actualResultInput.trim()) {
                NotificationService.show('Please describe what actually happened', 'error');
                return;
            }

            // First update the test case with actual result and status
            var updateData = {
                status: 'Fail',
                actualResult: testCase._actualResultInput
            };

            ApiService.updateTestCase(testCase.testCaseId, updateData).then(function () {
                // Then create a defect
                var defectData = {
                    controlId: ctrl.control.controlId,
                    subDescriptionIndex: testCase.subDescriptionIndex !== undefined ? testCase.subDescriptionIndex : null,
                    title: 'Test Failed: ' + testCase.testCaseTitle,
                    description: 'Expected: ' + (testCase.expectedResult || 'N/A') + '\n\nActual: ' + testCase._actualResultInput,
                    severity: 'High',
                    priority: 'High',
                    assignedToEmployeeId: ctrl.control.employeeId ? parseInt(ctrl.control.employeeId) : null
                };

                var teamId = AuthService.getTeamId();

                return ApiService.addDefect(defectData, teamId);
            }).then(function (defect) {
                // Link the defect to the test case
                return ApiService.updateTestCase(testCase.testCaseId, {
                    defectId: defect.defectId
                });
            }).then(function () {
                NotificationService.show('Successfully added defect to ' + (ctrl.control.employeeName || 'assigned developer'), 'success');
                testCase._showActualResult = false;
                ctrl.loadTestCases();
                ctrl.loadDefects();
                ctrl.activeTab = 'defects'; // Switch to defects tab
                $rootScope.$broadcast('testCasesUpdated');
                localStorage.setItem('testCasesUpdated', Date.now().toString());
            }).catch(function (error) {
                console.error('Error creating defect from test:', error);
                NotificationService.show('Error creating defect: ' + (error.data?.message || 'Unknown error'), 'error');
            });
        };

        ctrl.deleteTestCase = function (testCaseId) {
            if (!confirm('Are you sure you want to delete this test case?')) return;

            ApiService.deleteTestCase(testCaseId).then(function () {
                NotificationService.show('Test case deleted successfully', 'success');
                ctrl.testCases = ctrl.testCases.filter(function (tc) { return tc.testCaseId !== testCaseId; });
                $rootScope.$broadcast('testCasesUpdated');
                localStorage.setItem('testCasesUpdated', Date.now().toString());
            }).catch(function (error) {
                console.error('Error deleting test case:', error);
                NotificationService.show('Error deleting test case', 'error');
            });
        };

        ctrl.getTestStatusColor = function (status) {
            switch (status) {
                case 'Pass': return '#10b981';
                case 'Fail': return '#dc2626';
                case 'Not Tested': return '#6b7280';
                default: return '#6b7280';
            }
        };

        // Image handling functions
        ctrl.onImageSelect = function (file) {
            if (!file) return;

            if (!ctrl.newDefect.attachments) {
                ctrl.newDefect.attachments = [];
            }

            if (ctrl.newDefect.attachments.length >= 5) {
                NotificationService.show('You can only upload up to 5 images per defect.', 'error');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                NotificationService.show('Image size should be less than 5MB', 'error');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                NotificationService.show('Please select an image file', 'error');
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    ctrl.newDefect.attachments.push(e.target.result);
                });
            };
            reader.readAsDataURL(file);
        };

        ctrl.removeImage = function (index) {
            if (ctrl.newDefect.attachments) {
                ctrl.newDefect.attachments.splice(index, 1);
            }
        };

        ctrl.viewImage = function (imageUrl) {
            // Open image in new window/tab
            var win = window.open();
            win.document.write('<img src="' + imageUrl + '" style="max-width:100%; height:auto;">');
        };

        ctrl.getDefectImages = function (defect) {
            if (!defect) return [];
            
            var images = [];
            if (defect.attachmentUrl) images.push(defect.attachmentUrl);
            if (defect.attachmentUrl2) images.push(defect.attachmentUrl2);
            if (defect.attachmentUrl3) images.push(defect.attachmentUrl3);
            if (defect.attachmentUrl4) images.push(defect.attachmentUrl4);
            if (defect.attachmentUrl5) images.push(defect.attachmentUrl5);
            
            if (images.length > 0) return images;

            // Fallback for array-based attachmentUrls if it exists
            if (defect.attachmentUrls && Array.isArray(defect.attachmentUrls) && defect.attachmentUrls.length > 0) {
                return defect.attachmentUrls;
            }

            return [];
        };

        ctrl.loadActivityLogs = function () {
            if (!ctrl.control || !ctrl.control.controlId) return;
            ctrl.loadingLogs = true;
            ApiService.getActivityLogs(ctrl.control.controlId).then(function (logs) {
                ctrl.activityLogs = logs;
            }).finally(function () {
                ctrl.loadingLogs = false;
            });
        };

        ctrl.formatDuration = function (ms) {
            if (!ms || ms < 0) return null;
            var mins  = Math.floor(ms / 60000);
            var hours = Math.floor(ms / 3600000);
            var days  = Math.floor(ms / 86400000);
            if (mins < 1)   return 'less than a minute';
            if (mins < 60)  return mins + ' min' + (mins > 1 ? 's' : '');
            if (hours < 24) return hours + 'h ' + (mins % 60) + 'm';
            return days + 'd ' + (hours % 24) + 'h';
        };

        // Returns duration between two status entries in the activity log for a specific defect
        ctrl.getStatusChangeDuration = function (defect, fromStatus, toStatus) {
            if (!ctrl.activityLogs || !ctrl.activityLogs.length) return null;
            var logs = ctrl.activityLogs
                .filter(function (l) { return l.entityType === 'Defect' && l.entityId === defect.defectId && l.action === 'StatusChanged'; })
                .sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });

            var fromEntry = null;
            for (var i = 0; i < logs.length; i++) {
                if (!fromStatus || logs[i].oldValue === fromStatus) {
                    fromEntry = logs[i];
                }
                if (fromEntry && logs[i].newValue === toStatus) {
                    var start = ctrl.toUTC(fromEntry.timestamp);
                    var end   = ctrl.toUTC(logs[i].timestamp);
                    if (start && end) return ctrl.formatDuration(end - start);
                }
            }
            return null;
        };

        // Returns time from creation to first resolution (Fixed/Closed/Duplicate)
        ctrl.getTimeToResolve = function (defect) {
            if (!ctrl.activityLogs || !ctrl.activityLogs.length) return null;
            var resolved = ['Fixed', 'Closed', 'Duplicate'];
            var logs = ctrl.activityLogs
                .filter(function (l) {
                    return l.entityType === 'Defect' && l.entityId === defect.defectId &&
                           l.action === 'StatusChanged' && resolved.indexOf(l.newValue) !== -1;
                })
                .sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });

            if (!logs.length) return null;
            var start = ctrl.toUTC(defect.reportedDate);
            var end   = ctrl.toUTC(logs[0].timestamp);
            if (!start || !end) return null;
            return ctrl.formatDuration(end - start);
        };

        // Returns time spent in "In Dev" before reaching "Fixed"
        ctrl.getInDevToFixedDuration = function (defect) {
            if (!ctrl.activityLogs || !ctrl.activityLogs.length) return null;
            var logs = ctrl.activityLogs
                .filter(function (l) {
                    return l.entityType === 'Defect' && l.entityId === defect.defectId && l.action === 'StatusChanged';
                })
                .sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });

            // Find when it entered "In Dev"
            var inDevEntry = null;
            for (var i = 0; i < logs.length; i++) {
                if (logs[i].newValue === 'In Dev') {
                    inDevEntry = logs[i];
                }
                // Find the Fixed entry that comes after the last In Dev entry
                if (inDevEntry && logs[i].newValue === 'Fixed') {
                    var start = ctrl.toUTC(inDevEntry.timestamp);
                    var end   = ctrl.toUTC(logs[i].timestamp);
                    if (start && end) return ctrl.formatDuration(end - start);
                }
            }
            return null;
        };

        ctrl.formatDateTime = function (date) {
            var d = ctrl.toUTC(date);
            if (!d) return '';
            return d.toLocaleString('en-GB', {
                timeZone: 'Asia/Colombo',
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
        };

        // Returns all status transitions with durations for a defect
        ctrl.getStatusTransitions = function (defect) {
            if (!ctrl.activityLogs || !ctrl.activityLogs.length) return [];
            var logs = ctrl.activityLogs
                .filter(function (l) {
                    return l.entityType === 'Defect' && l.entityId === defect.defectId && l.action === 'StatusChanged';
                })
                .sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });

            var transitions = [];
            // First transition: from reportedDate to first status change
            if (logs.length > 0) {
                var start = ctrl.toUTC(defect.reportedDate);
                var firstLog = ctrl.toUTC(logs[0].timestamp);
                if (start && firstLog) {
                    var dur = ctrl.formatDuration(firstLog - start);
                    if (dur) {
                        transitions.push({ from: 'Open', to: logs[0].newValue, duration: dur });
                    }
                }
            }
            // Subsequent transitions
            for (var i = 0; i < logs.length - 1; i++) {
                var s = ctrl.toUTC(logs[i].timestamp);
                var e = ctrl.toUTC(logs[i + 1].timestamp);
                if (s && e) {
                    var d = ctrl.formatDuration(e - s);
                    if (d) {
                        transitions.push({ from: logs[i].newValue, to: logs[i + 1].newValue, duration: d });
                    }
                }
            }
            return transitions;
        };

        // Returns total lifetime from reported to Closed
        ctrl.getTotalLifetime = function (defect) {
            if (!ctrl.activityLogs || !ctrl.activityLogs.length) return null;
            var closedLogs = ctrl.activityLogs
                .filter(function (l) {
                    return l.entityType === 'Defect' && l.entityId === defect.defectId &&
                           l.action === 'StatusChanged' && l.newValue === 'Closed';
                })
                .sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });

            if (!closedLogs.length) return null;
            var start = ctrl.toUTC(defect.reportedDate);
            var end   = ctrl.toUTC(closedLogs[closedLogs.length - 1].timestamp);
            if (!start || !end) return null;
            return ctrl.formatDuration(end - start);
        };

        ctrl.getActivityColor = function (log) {
            if (log.entityType === 'SubDescription') {
                return '#0891b2'; // cyan for sub-description status changes
            }
            if (log.entityType === 'Defect') {
                if (log.action === 'Created') return '#dc2626';
                if (log.action === 'StatusChanged') return '#2563eb';
                return '#6b7280';
            }
            if (log.entityType === 'TestCase') {
                if (log.action === 'Created') return '#059669';
                if (log.action === 'StatusChanged') return '#7c3aed';
                return '#6b7280';
            }
            return '#6b7280';
        };

        ctrl.getActivityIcon = function (log) {
            if (log.entityType === 'SubDescription') return 'fa-code-branch';
            if (log.action === 'Created') return 'fa-plus';
            if (log.action === 'StatusChanged') return 'fa-exchange-alt';
            if (log.action === 'Updated') return 'fa-pen';
            if (log.action === 'Deleted') return 'fa-trash';
            return 'fa-circle';
        };

        ctrl.close = function () {
            if (ctrl.onClose) {
                ctrl.onClose();
            }
        };

        // Listen for highlight defect event
        var highlightListener = $rootScope.$on('highlightDefect', function (event, defectId) {
            console.log('Highlighting defect:', defectId);

            // Switch to defects tab
            ctrl.activeTab = 'defects';

            var attempts = 0;
            var maxAttempts = 10; // Try for up to 5 seconds (10 * 500ms)

            function tryHighlight() {
                // Clear previous highlights
                ctrl.defects.forEach(function (d) {
                    d._highlighted = false;
                });

                // Find and highlight the defect
                var defect = ctrl.defects.find(function (d) {
                    return d.defectId === defectId;
                });

                if (defect) {
                    // Add highlight class
                    defect._highlighted = true;

                    // Scroll to defect (if needed)
                    setTimeout(function () {
                        var element = document.getElementById('defect-' + defectId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 300);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(tryHighlight, 500);
                }
            }

            tryHighlight();
        });

        // Cleanup
        $scope.$on('$destroy', function () {
            highlightListener();
        });
    }
});
