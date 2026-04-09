app.component('testCasesGrid', {
    bindings: {
        control: '<',
        subDescriptionIndex: '<',
        onClose: '&'
    },
    template: `
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 9999;">
        <div class="modal-dialog" style="max-width: 98vw; width: 98vw; height: 98vh; margin: 1vh auto;">
            <div class="modal-content" style="border-radius: 12px; height: 100%; display: flex; flex-direction: column;">
                <!-- Modal Header -->
                <div class="modal-header border-0" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 1rem 1.5rem; flex-shrink: 0;">
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-table text-white fs-5"></i>
                        </div>
                        <div>
                            <h5 class="modal-title text-white fw-bold mb-0">
                                Test Cases - {{$ctrl.control.description}}
                                <span ng-if="$ctrl.getSubDescriptionName()" class="ms-2 opacity-75 fs-6 fw-normal">
                                    <i class="fas fa-chevron-right me-2 small"></i>{{$ctrl.getSubDescriptionName()}}
                                </span>
                            </h5>
                            <p class="text-white-50 mb-0 small">Excel-style editable test case management</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-light btn-sm px-3" ng-click="$ctrl.close()" title="Back to Controls">
                            <i class="fas fa-arrow-left me-1"></i>Back
                        </button>
                        <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.close()"></button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="modal-body p-0" style="background: #f8fafc; flex: 1; overflow: hidden; display: flex; flex-direction: column;">
                    <!-- Toolbar -->
                    <div class="bg-white border-bottom p-2 d-flex justify-content-between align-items-center" style="flex-shrink: 0;">
                        <div class="d-flex gap-2 align-items-center">
                            <button class="btn btn-secondary btn-sm px-3" ng-click="$ctrl.close()"><i class="fas fa-arrow-left me-1"></i>Back</button>
                            <div class="vr mx-1"></div>
                            <button class="btn btn-primary btn-sm" ng-click="$ctrl.addNewRow()" ng-if="$ctrl.isQA()">
                                <i class="fas fa-plus me-1"></i>Add Test Case
                            </button>
                            <button class="btn btn-danger btn-sm" ng-click="$ctrl.openStandaloneDefectModal()" ng-if="$ctrl.isQA()">
                                <i class="fas fa-bug me-1"></i>Add Defect
                            </button>
                            <button class="btn btn-success btn-sm" ng-click="$ctrl.saveAll()" ng-disabled="$ctrl.isSaving" ng-if="$ctrl.isQA()">
                                <i class="fas fa-save me-1"></i>{{$ctrl.isSaving ? 'Saving...' : 'Save All'}}
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" ng-click="$ctrl.loadTestCases()">
                                <i class="fas fa-sync me-1"></i>Refresh
                            </button>
                            <div class="ms-2 d-flex align-items-center" ng-if="$ctrl.getSubDescriptionName()">
                                <span class="badge border border-primary text-primary bg-primary-subtle px-3 py-2 rounded-3">
                                    <i class="fas fa-bullseye me-2"></i>Target Sub-objective: <strong>{{$ctrl.getSubDescriptionName()}}</strong>
                                </span>
                            </div>
                            <span class="badge bg-info text-dark align-self-center px-3 py-2 ms-2" ng-if="!$ctrl.isQA()">
                                <i class="fas fa-eye me-1"></i>View Only
                            </span>
                        </div>
                        <div class="badge bg-primary px-3 py-2">
                            {{$ctrl.testCases.length}} Test Cases
                        </div>
                    </div>

                    <!-- Excel-style Table -->
                    <div class="table-container" style="flex: 1; overflow-x: auto; overflow-y: auto; background: white; position: relative;">
                        <table class="table table-bordered table-hover mb-0" style="background: white; min-width: 1800px; width: max-content; table-layout: fixed;">
                            <thead style="position: sticky; top: 0; z-index: 20; background: #f8f9fa;">
                                <tr>
                                    <th style="width: 50px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa; position: sticky; left: 0; z-index: 21;">#</th>
                                    <th style="width: 70px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">ID</th>
                                    <th style="width: 220px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Test Case Title <span class="text-danger">*</span></th>
                                    <th style="width: 280px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Test Description</th>
                                    <th style="width: 200px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Expected Result</th>
                                    <th style="width: 100px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Priority</th>
                                    <th style="width: 130px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Test Type</th>
                                    <th style="width: 130px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Status</th>
                                    <th style="width: 220px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Actual Result</th>
                                    <th style="width: 120px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Tested By</th>
                                    <th style="width: 110px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa;">Tested Date</th>
                                    <th style="width: 80px; color: #1f2937; font-weight: 600; border: 1px solid #dee2e6; background: #f8f9fa; position: sticky; right: 0; z-index: 21; box-shadow: -2px 0 5px rgba(0,0,0,0.1);">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Empty State -->
                                <tr ng-if="$ctrl.testCases.length === 0">
                                    <td colspan="12" class="text-center py-5">
                                        <i class="fas fa-clipboard fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">No test cases yet. Click \"Add Test Case\" to create one.</p>
                                    </td>
                                </tr>

                                <!-- Test Case Rows -->
                                <tr ng-repeat="tc in $ctrl.testCases track by $index" 
                                    ng-class="{
                                        'table-success': tc.status === 'Pass' && !tc._isNew && !tc._isModified, 
                                        'table-danger': tc.status === 'Fail' && !tc._isNew && !tc._isModified, 
                                        'table-warning': tc._isNew, 
                                        'table-info': tc._isModified && tc.status !== 'Pass' && tc.status !== 'Fail'
                                    }"
                                    ng-style="$ctrl.getRowStyle(tc)">
                                    <td class="text-center" style="border: 1px solid #dee2e6; position: sticky; left: 0; background: inherit; z-index: 5;">{{$index + 1}}</td>
                                    <td class="text-center" style="border: 1px solid #dee2e6;">
                                        <span ng-if="tc.testCaseId">{{tc.testCaseId}}</span>
                                        <span ng-if="!tc.testCaseId" class="badge bg-warning">New</span>
                                    </td>
                                    <td style="border: 1px solid #dee2e6; position: relative;">
                                        <input type="text" 
                                               class="form-control form-control-sm" 
                                               ng-model="tc.testCaseTitle" 
                                               ng-model-options="{ debounce: 300 }"
                                               ng-change="$ctrl.autoSaveRow(tc)"
                                               ng-blur="$ctrl.saveRowNow(tc)"
                                               placeholder="Enter test case title"
                                               ng-readonly="!$ctrl.isQA()"
                                               required>
                                        <div style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 11px;">
                                            <span ng-if="tc._isSaving" class="text-primary"><i class="fas fa-spinner fa-spin"></i></span>
                                            <span ng-if="tc._savePending && !tc._isSaving" class="text-warning"><i class="fas fa-clock"></i></span>
                                            <span ng-if="tc._savedOk" class="text-success"><i class="fas fa-check-circle"></i></span>
                                            <span ng-if="tc._saveError" class="text-danger"><i class="fas fa-exclamation-circle"></i></span>
                                        </div>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <textarea class="form-control form-control-sm" 
                                                  ng-model="tc.testSteps" 
                                                  ng-model-options="{ debounce: 1000 }"
                                                  ng-change="$ctrl.autoSaveRow(tc)"
                                                  ng-blur="$ctrl.saveRowNow(tc)"
                                                  ng-keydown="$ctrl.handleTestStepsKeydown($event, tc)"
                                                  rows="3"
                                                  ng-readonly="!$ctrl.isQA()"
                                                  placeholder="Enter test description (press Enter for new numbered line)"
                                                  style="resize: vertical; min-height: 60px;"></textarea>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <textarea class="form-control form-control-sm" 
                                                  ng-model="tc.expectedResult" 
                                                  ng-model-options="{ debounce: 1000 }"
                                                  ng-change="$ctrl.autoSaveRow(tc)"
                                                  ng-blur="$ctrl.saveRowNow(tc)"
                                                  rows="2" 
                                                  ng-readonly="!$ctrl.isQA()"
                                                  placeholder="Enter expected result"></textarea>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <select class="form-select form-select-sm" 
                                                ng-model="tc.priority" 
                                                ng-change="$ctrl.autoSaveRow(tc)"
                                                ng-disabled="!$ctrl.isQA()">
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <select class="form-select form-select-sm" 
                                                ng-model="tc.testType" 
                                                ng-change="$ctrl.autoSaveRow(tc)">
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
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <select class="form-select form-select-sm" 
                                                ng-model="tc.status" 
                                                ng-change="$ctrl.autoSaveRow(tc)"
                                                ng-style="{'background-color': $ctrl.getStatusBackgroundColor(tc.status), 'color': $ctrl.getStatusTextColor(tc.status), 'font-weight': '600'}">
                                            <option value="Not Tested">Not Tested</option>
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Blocked">Blocked</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Not Included">Not Included</option>
                                            <option value="Not Applicable">Not Applicable</option>
                                        </select>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <textarea class="form-control form-control-sm mb-1" 
                                                  ng-model="tc.actualResult" 
                                                  ng-model-options="{ debounce: 1000 }"
                                                  ng-change="$ctrl.autoSaveRow(tc)"
                                                  ng-blur="$ctrl.saveRowNow(tc)"
                                                  rows="2" 
                                                  placeholder="Enter actual result"
                                                  ng-disabled="tc.status === 'Pass'"></textarea>
                                        <button class="btn btn-sm btn-danger w-100" 
                                                ng-if="tc.status === 'Fail' && tc.actualResult && tc.actualResult.trim() && !tc.defectId"
                                                ng-click="$ctrl.openDefectModal(tc)"
                                                title="Create defect from this failed test">
                                            <i class="fas fa-bug me-1"></i>Create Defect
                                        </button>
                                        <span class="badge bg-danger mt-1 d-block" 
                                              ng-if="tc.defectId"
                                              ng-click="$ctrl.viewLinkedDefect(tc.defectId)"
                                              style="cursor: pointer;"
                                              title="Click to view defect details">
                                            <i class="fas fa-link me-1"></i>Linked to Defect #{{tc.defectId}}
                                        </span>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <span class="small">{{tc.testedByName || '-'}}</span>
                                    </td>
                                    <td style="border: 1px solid #dee2e6;">
                                        <span class="small">{{tc.testedDate ? $ctrl.formatDate(tc.testedDate) : '-'}}</span>
                                    </td>
                                    <td class="text-center" style="border: 1px solid #dee2e6; position: sticky; right: 0; background: inherit; z-index: 5; box-shadow: -2px 0 5px rgba(0,0,0,0.1);">
                                        <button ng-if="$ctrl.isQA()" class="btn btn-sm btn-light text-danger border-0"
                                                ng-click="$ctrl.deleteRow(tc, $index)"
                                                title="Delete Test Case">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Status Bar -->
                    <div class="bg-white border-top p-2 d-flex justify-content-between align-items-center small" style="flex-shrink: 0;">
                        <div class="d-flex gap-3 flex-wrap">
                            <span><i class="fas fa-circle text-warning me-1"></i>New: {{$ctrl.getNewCount()}}</span>
                            <span><i class="fas fa-circle text-info me-1"></i>Modified: {{$ctrl.getModifiedCount()}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #10b981;"></i>Pass: {{$ctrl.getStatusCount('Pass')}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #ef4444;"></i>Fail: {{$ctrl.getStatusCount('Fail')}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #3b82f6;"></i>In Progress: {{$ctrl.getStatusCount('In Progress')}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #dc2626;"></i>Blocked: {{$ctrl.getStatusCount('Blocked')}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #f59e0b;"></i>On Hold: {{$ctrl.getStatusCount('On Hold')}}</span>
                            <span><i class="fas fa-circle me-1" style="color: #6b7280;"></i>Not Tested: {{$ctrl.getStatusCount('Not Tested')}}</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <span class="text-primary" ng-if="$ctrl.hasPendingSaves()">
                                <i class="fas fa-spinner fa-spin me-1"></i>Auto-saving...
                            </span>
                            <span class="text-success" ng-if="!$ctrl.hasPendingSaves() && $ctrl.getNewCount() === 0 && $ctrl.getModifiedCount() === 0">
                                <i class="fas fa-check-circle me-1"></i>All saved
                            </span>
                            <span class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>Changes save automatically
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Create Defect Modal -->
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.8); z-index: 10000;" ng-if="$ctrl.showDefectModal">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="border-radius: 12px;">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-bug me-2"></i>{{$ctrl.selectedTestCase ? 'Create Defect from Failed Test' : 'Add New Defect'}}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.closeDefectModal()"></button>
                    </div>
                    <div class="modal-body">
                        <form ng-submit="$ctrl.submitDefect()">
                            <div class="row g-3">
                                <div class="col-12" ng-if="$ctrl.selectedTestCase">
                                    <label class="form-label fw-bold">Test Case</label>
                                    <input type="text" class="form-control" ng-model="$ctrl.selectedTestCase.testCaseTitle" disabled>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold">Defect Title <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" ng-model="$ctrl.defectData.title" placeholder="Brief description of the defect" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold">Description</label>
                                    <textarea class="form-control" ng-model="$ctrl.defectData.description" rows="4" placeholder="Detailed description of the defect"></textarea>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">Severity</label>
                                    <select class="form-select" ng-model="$ctrl.defectData.severity">
                                        <option value=\"Low\">Low</option>
                                        <option value=\"Medium\">Medium</option>
                                        <option value=\"High\">High</option>
                                        <option value=\"Critical\">Critical</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">Priority</label>
                                    <select class="form-select" ng-model="$ctrl.defectData.priority">
                                        <option value=\"Low\">Low</option>
                                        <option value=\"Medium\">Medium</option>
                                        <option value=\"High\">High</option>
                                        <option value=\"Critical\">Critical</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">Assign To</label>
                                    <select class="form-select" ng-model="$ctrl.defectData.assignedToEmployeeId">
                                        <option value=\"\">Unassigned</option>
                                        <option ng-repeat=\"emp in $ctrl.getDevelopers()\" value=\"{{emp.id}}\">{{emp.employeeName}}</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold">Attachments (Max 5 Screenshots)</label>
                                    <div class="input-group">
                                        <input type="file" id="defectImageInput" class="form-control" accept="image/*" 
                                               onchange="angular.element(this).scope().$ctrl.onImageSelect(this.files[0])"
                                               ng-disabled="$ctrl.defectData.attachmentUrls.length >= 5">
                                        <label class="input-group-text bg-light text-primary" for="defectImageInput">
                                            <i class="fas fa-image"></i>
                                        </label>
                                    </div>
                                    <div class="mt-2 d-flex flex-wrap gap-2">
                                        <div ng-repeat="img in $ctrl.defectData.attachmentUrls track by $index" class="position-relative" style="width: 100px; height: 100px;">
                                            <img ng-src="{{img}}" class="img-thumbnail w-100 h-100 object-fit-cover shadow-sm" style="border-radius: 8px;">
                                            <button type="button" class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle-y translate-middle-x" 
                                                    style="width: 20px; height: 20px; padding: 0; font-size: 10px;"
                                                    ng-click="$ctrl.removeImage($index)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div ng-if="$ctrl.defectData.attachmentUrls.length === 0" class="w-100 py-3 text-center border rounded dashed" style="border: 2px dashed #e2e8f0; background: #f8fafc;">
                                            <p class="text-muted mb-0 small"><i class="fas fa-upload me-2"></i>Upload screenshots to explain the defect</p>
                                        </div>
                                    </div>
                                    <div class="mt-1 small" ng-class="$ctrl.defectData.attachmentUrls.length >= 5 ? 'text-danger fw-bold' : 'text-muted'">
                                        {{$ctrl.defectData.attachmentUrls.length}} / 5 images uploaded
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-secondary" ng-click="$ctrl.closeDefectModal()">Cancel</button>
                                <button type="submit" class="btn btn-danger" ng-disabled="$ctrl.isCreatingDefect">
                                    <i class="fas fa-save me-2"></i>{{$ctrl.isCreatingDefect ? 'Creating...' : 'Create Defect'}}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- View Defect Details Modal -->
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 10000;" ng-if="$ctrl.showViewDefectModal">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content" style="border-radius: 12px;">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-bug me-2"></i>Defect Details #{{$ctrl.viewingDefect.defectId}}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.closeViewDefectModal()"></button>
                </div>
                <div class="modal-body">
                    <div ng-if="$ctrl.loadingDefect" class="text-center py-5">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 text-muted">Loading defect details...</p>
                    </div>
                    
                    <div ng-if="!$ctrl.loadingDefect && $ctrl.viewingDefect">
                        <div class="row g-3">
                            <div class="col-12">
                                <h6 class="fw-bold text-dark mb-2">
                                    <span class="badge rounded-pill me-2" ng-style="{'background-color': $ctrl.getSeverityColor($ctrl.viewingDefect.severity)}">
                                        {{$ctrl.viewingDefect.severity}}
                                    </span>
                                    {{$ctrl.viewingDefect.title}}
                                </h6>
                            </div>
                            
                            <div class="col-12" ng-if="$ctrl.viewingDefect.description">
                                <label class="small fw-bold text-secondary">Description:</label>
                                <p class="text-muted mb-0" style="white-space: pre-line;">{{$ctrl.viewingDefect.description}}</p>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="small fw-bold text-secondary">Status:</label>
                                <div>
                                    <span class="badge rounded-pill" ng-class="$ctrl.getStatusBadgeClass($ctrl.viewingDefect.status)">
                                        {{$ctrl.viewingDefect.status}}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="small fw-bold text-secondary">Priority:</label>
                                <div class="fw-bold">{{$ctrl.viewingDefect.priority}}</div>
                            </div>
                            
                            <div class="col-md-6" ng-if="$ctrl.viewingDefect.assignedToName">
                                <label class="small fw-bold text-secondary">Assigned To:</label>
                                <div class="fw-bold">{{$ctrl.viewingDefect.assignedToName}}</div>
                            </div>
                            
                            <div class="col-md-6" ng-if="$ctrl.viewingDefect.reportedByName">
                                <label class="small fw-bold text-secondary">Reported By:</label>
                                <div class="fw-bold">{{$ctrl.viewingDefect.reportedByName}}</div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="small fw-bold text-secondary">Reported Date:</label>
                                <div>{{$ctrl.formatDate($ctrl.viewingDefect.reportedDate)}}</div>
                            </div>
                            
                            <div class="col-md-6" ng-if="$ctrl.viewingDefect.resolvedDate">
                                <label class="small fw-bold text-secondary">Resolved Date:</label>
                                <div>{{$ctrl.formatDate($ctrl.viewingDefect.resolvedDate)}}</div>
                            </div>
                            
                            <div class="col-12" ng-if="$ctrl.viewingDefect.resolutionNotes">
                                <label class="small fw-bold text-secondary">Resolution Notes:</label>
                                <p class="text-muted mb-0" style="white-space: pre-line;">{{$ctrl.viewingDefect.resolutionNotes}}</p>
                            </div>
                            
                            <div class="col-12" ng-if="$ctrl.viewingDefect.attachmentUrls && $ctrl.viewingDefect.attachmentUrls.length > 0">
                                <label class="small fw-bold text-secondary">Attachments ({{$ctrl.viewingDefect.attachmentUrls.length}}):</label>
                                <div class="mt-2 d-flex flex-wrap gap-2">
                                    <div ng-repeat="url in $ctrl.viewingDefect.attachmentUrls track by $index" class="position-relative">
                                        <img ng-src="{{url}}" 
                                             class="img-thumbnail border shadow-sm" 
                                             style="width: 140px; height: 100px; object-fit: cover; cursor: pointer; transition: transform 0.2s;" 
                                             alt="Defect Screenshot"
                                             ng-click="$ctrl.viewImage(url)"
                                             onmouseover="this.style.transform='scale(1.05)'"
                                             onmouseout="this.style.transform='scale(1)'">
                                    </div>
                                </div>
                                <div class="mt-2 small text-muted"><i class="fas fa-info-circle me-1"></i>Click on an image to open in full size</div>
                            </div>
                            <div class="col-12" ng-if="!$ctrl.viewingDefect.attachmentUrls && $ctrl.viewingDefect.attachmentUrl">
                                <label class="small fw-bold text-secondary">Attachment:</label>
                                <div class="mt-2">
                                    <img ng-src="{{$ctrl.viewingDefect.attachmentUrl}}" 
                                         class="img-fluid rounded border shadow-sm" 
                                         style="max-height: 300px; cursor: pointer;" 
                                         alt="Defect Screenshot"
                                         ng-click="$ctrl.viewImage($ctrl.viewingDefect.attachmentUrl)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" ng-click="$ctrl.closeViewDefectModal()">Close</button>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, NotificationService, AuthService, $scope, $timeout, $rootScope) {
        var ctrl = this;

        ctrl.testCases = [];
        ctrl.isSaving = false;
        ctrl.showDefectModal = false;
        ctrl.selectedTestCase = null;
        ctrl.isCreatingDefect = false;
        ctrl.employees = [];
        ctrl.defectData = {};
        ctrl.showViewDefectModal = false;
        ctrl.viewingDefect = null;
        ctrl.loadingDefect = false;
        
        ctrl.getSubDescriptionName = function () {
            if (ctrl.subDescriptionIndex === null || ctrl.subDescriptionIndex === undefined) return null;
            if (!ctrl.control || !ctrl.control.subDescriptions) return null;
            try {
                var subs = JSON.parse(ctrl.control.subDescriptions);
                if (Array.isArray(subs) && subs[ctrl.subDescriptionIndex]) {
                    return subs[ctrl.subDescriptionIndex].description;
                }
            } catch (e) {
                console.warn('Error parsing subDescriptions in test-cases-grid:', e);
                return null;
            }
            return null;
        };

        ctrl.isQA = function () {
            return AuthService.isQAEngineer() || AuthService.isAdmin() || AuthService.isSoftwareArchitecture();
        };

        ctrl.$onInit = function () {
            console.log('test-cases-grid $onInit, control:', ctrl.control);
            ctrl.loadTestCases();
            ctrl.loadEmployees();
        };

        ctrl.$onChanges = function (changes) {
            if (changes.control && changes.control.currentValue && changes.control.currentValue.controlId) {
                console.log('test-cases-grid control changed:', changes.control.currentValue.controlId);
                ctrl.loadTestCases();
            }
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

        ctrl.loadTestCases = function () {
            if (!ctrl.control || !ctrl.control.controlId) {
                console.warn('loadTestCases: no controlId, control=', ctrl.control);
                return;
            }

            console.log('Loading test cases for controlId:', ctrl.control.controlId);

            ApiService.getTestCasesByControl(ctrl.control.controlId).then(function (testCases) {
                // Filter by sub-description if opened from sub-description button
                var filtered = testCases;
                if (ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined) {
                    filtered = testCases.filter(function (tc) {
                        return tc.subDescriptionIndex === ctrl.subDescriptionIndex || tc.subDescriptionIndex === String(ctrl.subDescriptionIndex);
                    });
                } else {
                    // Show only general test cases
                    filtered = testCases.filter(function (tc) {
                        return tc.subDescriptionIndex === null || tc.subDescriptionIndex === undefined || tc.subDescriptionIndex === -1;
                    });
                }
                ctrl.testCases = filtered.map(function (tc) {
                    tc._isNew = false;
                    tc._isModified = false;
                    tc._original = angular.copy(tc);

                    if (tc.testSteps) {
                        tc._testStepsArray = tc.testSteps.split('\n').filter(function (s) { return s.trim(); });
                    } else {
                        tc._testStepsArray = [''];
                    }

                    return tc;
                });
                console.log('Test cases loaded into grid:', ctrl.testCases.length);
            }).catch(function (error) {
                console.error('Error loading test cases:', error);
                NotificationService.show('Error loading test cases', 'error');
            });
        };

        ctrl.addNewRow = function () {
            var newTestCase = {
                testCaseId: null,
                controlId: ctrl.control.controlId,
                subDescriptionIndex: (ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined) ? ctrl.subDescriptionIndex : null,
                testCaseTitle: '',
                testSteps: '',
                expectedResult: '',
                priority: 'Medium',
                testType: 'Functional',
                status: 'Not Tested',
                actualResult: '',
                _isNew: true,
                _isModified: false
            };
            ctrl.testCases.unshift(newTestCase);
        };

        ctrl.markAsModified = function (tc) {
            if (!tc._isNew) {
                tc._isModified = true;
            }
        };

        // Auto-numbering for test steps
        ctrl.handleTestStepsKeydown = function (event, tc) {
            if (event.keyCode === 13) { // Enter key
                event.preventDefault();

                var textarea = event.target;
                var cursorPos = textarea.selectionStart;
                var textBefore = tc.testSteps ? tc.testSteps.substring(0, cursorPos) : '';
                var textAfter = tc.testSteps ? tc.testSteps.substring(cursorPos) : '';

                // If field is empty or only whitespace, start with \"1. \"
                if (!tc.testSteps || tc.testSteps.trim() === '') {
                    tc.testSteps = '1. ';
                    $scope.$apply();
                    setTimeout(function () {
                        textarea.setSelectionRange(3, 3); // Position after \"1. \"
                    }, 0);
                    ctrl.markAsModified(tc);
                    return;
                }

                // Count existing lines to get next number
                var lines = textBefore.split('\n');
                var nextNumber = lines.length + 1;

                // Insert new line with number
                tc.testSteps = textBefore + '\n' + nextNumber + '. ' + textAfter;

                // Set cursor position after the number
                $scope.$apply();
                setTimeout(function () {
                    var newCursorPos = cursorPos + ('\n' + nextNumber + '. ').length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);

                ctrl.markAsModified(tc);
            }
        };

        // Auto-save with $timeout (AngularJS-native, no $scope.$apply needed)
        var autoSaveTimers = {};

        ctrl.autoSaveRow = function (tc) {
            ctrl.markAsModified(tc);
            var key = tc.testCaseId || tc.$$hashKey || 'new';

            if (autoSaveTimers[key]) {
                $timeout.cancel(autoSaveTimers[key]);
            }

            tc._savePending = true;

            autoSaveTimers[key] = $timeout(function () {
                tc._savePending = false;
                ctrl._doSave(tc);
            }, 1500);
        };

        ctrl.saveRowNow = function (tc) {
            var key = tc.testCaseId || tc.$$hashKey || 'new';
            if (autoSaveTimers[key]) {
                $timeout.cancel(autoSaveTimers[key]);
                delete autoSaveTimers[key];
            }
            if (tc._isNew && (!tc.testCaseTitle || !tc.testCaseTitle.trim())) return;
            if (!tc._isNew && !tc._isModified) return;
            tc._savePending = false;
            ctrl._doSave(tc);
        };

        ctrl._doSave = function (tc) {
            if (tc._isSaving) {
                console.warn('[AutoSave] Already saving, skip:', tc.testCaseTitle);
                return;
            }

            if (tc._isNew) {
                if (!tc.testCaseTitle || !tc.testCaseTitle.trim()) return;

                tc._isSaving = true;
                var teamId = AuthService.getTeamId();
                console.log('[AutoSave] CREATE - title:', tc.testCaseTitle, 'controlId:', ctrl.control.controlId, 'teamId:', teamId);

                var createDto = {
                    controlId: ctrl.control.controlId,
                    subDescriptionIndex: tc.subDescriptionIndex !== undefined ? tc.subDescriptionIndex : null,
                    testCaseTitle: tc.testCaseTitle,
                    testSteps: tc.testSteps,
                    expectedResult: tc.expectedResult,
                    priority: tc.priority,
                    testType: tc.testType
                };

                ApiService.addTestCase(createDto, teamId).then(function (saved) {
                    console.log('[AutoSave] CREATE success, id:', saved.testCaseId);
                    tc.testCaseId = saved.testCaseId;
                    tc._isNew = false;
                    tc._isModified = false;
                    tc._isSaving = false;
                    tc._savedOk = true;
                    tc._original = angular.copy(saved);
                    $rootScope.$broadcast('testCasesUpdated');
                    $timeout(function () { tc._savedOk = false; }, 2000);
                }).catch(function (error) {
                    console.error('[AutoSave] CREATE error:', error.status, error.data);
                    tc._isSaving = false;
                    tc._saveError = true;
                    $timeout(function () { tc._saveError = false; }, 3000);
                });

            } else if (tc.testCaseId) {
                tc._isSaving = true;
                console.log('[AutoSave] UPDATE - id:', tc.testCaseId, 'title:', tc.testCaseTitle);

                var updateDto = {
                    testCaseTitle: tc.testCaseTitle,
                    testSteps: tc.testSteps,
                    expectedResult: tc.expectedResult,
                    priority: tc.priority,
                    testType: tc.testType,
                    status: tc.status,
                    actualResult: tc.actualResult
                };

                ApiService.updateTestCase(tc.testCaseId, updateDto).then(function () {
                    console.log('[AutoSave] UPDATE success, id:', tc.testCaseId);
                    tc._isModified = false;
                    tc._isSaving = false;
                    tc._savedOk = true;
                    tc._original = angular.copy(tc);
                    $rootScope.$broadcast('testCasesUpdated');
                    $timeout(function () { tc._savedOk = false; }, 2000);
                }).catch(function (error) {
                    console.error('[AutoSave] UPDATE error:', error.status, error.data);
                    tc._isSaving = false;
                    tc._saveError = true;
                    $timeout(function () { tc._saveError = false; }, 3000);
                });
            } else {
                console.warn('[AutoSave] No testCaseId and not _isNew - nothing to save');
            }
        };

        ctrl.deleteRow = function (tc, index) {
            if (tc._isNew) {
                // Just remove from array if it's a new unsaved row
                ctrl.testCases.splice(index, 1);
                return;
            }

            if (!confirm('Are you sure you want to delete this test case?')) return;

            ApiService.deleteTestCase(tc.testCaseId).then(function () {
                NotificationService.show('Test case deleted successfully', 'success');
                ctrl.testCases.splice(index, 1);
                $rootScope.$broadcast('testCasesUpdated');
            }).catch(function (error) {
                console.error('Error deleting test case:', error);
                NotificationService.show('Error deleting test case', 'error');
            });
        };

        ctrl.saveAll = function () {
            var itemsToSave = ctrl.testCases.filter(function (tc) {
                return tc._isNew || tc._isModified;
            });

            if (itemsToSave.length === 0) {
                NotificationService.show('No changes to save', 'info');
                return;
            }

            ctrl.isSaving = true;
            var teamId = AuthService.getTeamId();
            var promises = [];

            itemsToSave.forEach(function (tc) {
                if (tc._isNew) {
                    // Create new test case
                    if (!tc.testCaseTitle || !tc.testCaseTitle.trim()) {
                        NotificationService.show('Test case title is required', 'error');
                        return;
                    }

                    var createDto = {
                        controlId: ctrl.control.controlId,
                        subDescriptionIndex: tc.subDescriptionIndex !== undefined ? tc.subDescriptionIndex : null,
                        testCaseTitle: tc.testCaseTitle,
                        testSteps: tc.testSteps,
                        expectedResult: tc.expectedResult,
                        priority: tc.priority,
                        testType: tc.testType
                    };

                    promises.push(ApiService.addTestCase(createDto, teamId));
                } else if (tc._isModified) {
                    // Update existing test case
                    var updateDto = {
                        testCaseTitle: tc.testCaseTitle,
                        testSteps: tc.testSteps,
                        expectedResult: tc.expectedResult,
                        priority: tc.priority,
                        testType: tc.testType,
                        status: tc.status,
                        actualResult: tc.actualResult
                    };

                    promises.push(ApiService.updateTestCase(tc.testCaseId, updateDto));
                }
            });

            Promise.all(promises).then(function () {
                NotificationService.show('All changes saved successfully', 'success');
                $rootScope.$broadcast('testCasesUpdated');
                ctrl.loadTestCases(); // Reload to get fresh data
            }).catch(function (error) {
                console.error('Error saving test cases:', error);
                NotificationService.show('Error saving some test cases', 'error');
            }).finally(function () {
                ctrl.isSaving = false;
                $scope.$apply();
            });
        };

        ctrl.getNewCount = function () {
            return ctrl.testCases.filter(function (tc) { return tc._isNew; }).length;
        };

        ctrl.getModifiedCount = function () {
            return ctrl.testCases.filter(function (tc) { return tc._isModified; }).length;
        };

        ctrl.getStatusCount = function (status) {
            return ctrl.testCases.filter(function (tc) { return tc.status === status; }).length;
        };

        ctrl.hasPendingSaves = function () {
            return ctrl.testCases.some(function (tc) { return tc._isSaving || tc._savePending; });
        };

        // Open the qa-defects modal for this test case's sub-description objective
        ctrl.openObjectiveDefects = function (tc) {
            // Determine the sub-description index: from the test case itself, or from the component binding
            var subIndex = (tc.subDescriptionIndex !== null && tc.subDescriptionIndex !== undefined)
                ? parseInt(tc.subDescriptionIndex)
                : (ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined
                    ? ctrl.subDescriptionIndex
                    : null);

            // Broadcast to control-board to open the defects modal for this objective
            $rootScope.$broadcast('openDefectsForObjective', {
                control: ctrl.control,
                subDescriptionIndex: subIndex
            });
        };

        $scope.$on('$destroy', function () {
            // Clear all pending timers
            Object.keys(autoSaveTimers).forEach(function (key) {
                $timeout.cancel(autoSaveTimers[key]);
            });
        });

        ctrl.formatDate = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };

        // Defect helper functions
        ctrl.getSeverityColor = function (severity) {
            switch (severity) {
                case 'Critical': return '#dc2626';
                case 'High': return '#f59e0b';
                case 'Medium': return '#3b82f6';
                case 'Low': return '#10b981';
                default: return '#6b7280';
            }
        };

        ctrl.getStatusBadgeClass = function (status) {
            switch (status) {
                case 'Open': return 'bg-danger';
                case 'In Progress': return 'bg-warning';
                case 'Resolved': return 'bg-success';
                case 'Closed': return 'bg-secondary';
                case 'Reopened': return 'bg-danger';
                default: return 'bg-secondary';
            }
        };

        // Status Color Functions
        ctrl.getStatusBackgroundColor = function (status) {
            switch (status) {
                case 'Pass': return '#10b981'; // Green
                case 'Fail': return '#ef4444'; // Red
                case 'In Progress': return '#3b82f6'; // Blue
                case 'Blocked': return '#dc2626'; // Dark Red
                case 'On Hold': return '#f59e0b'; // Orange
                case 'Not Included': return '#6b7280'; // Gray
                case 'Not Applicable': return '#9ca3af'; // Light Gray
                case 'Not Tested': return '#e5e7eb'; // Very Light Gray
                default: return '#e5e7eb';
            }
        };

        ctrl.getStatusTextColor = function (status) {
            switch (status) {
                case 'Pass': return '#ffffff';
                case 'Fail': return '#ffffff';
                case 'In Progress': return '#ffffff';
                case 'Blocked': return '#ffffff';
                case 'On Hold': return '#ffffff';
                case 'Not Included': return '#ffffff';
                case 'Not Applicable': return '#ffffff';
                case 'Not Tested': return '#1f2937';
                default: return '#1f2937';
            }
        };

        ctrl.getRowStyle = function (tc) {
            if (tc._isNew) {
                return { 'background-color': '#fef3c7' }; // Yellow for new
            }
            if (tc._isModified) {
                return { 'background-color': '#dbeafe' }; // Light blue for modified
            }

            // Status-based row colors
            switch (tc.status) {
                case 'Pass':
                    return { 'background-color': '#d1fae5' }; // Light green
                case 'Fail':
                    return { 'background-color': '#fee2e2' }; // Light red
                case 'In Progress':
                    return { 'background-color': '#dbeafe' }; // Light blue
                case 'Blocked':
                    return { 'background-color': '#fecaca' }; // Light red
                case 'On Hold':
                    return { 'background-color': '#fed7aa' }; // Light orange
                case 'Not Included':
                    return { 'background-color': '#f3f4f6' }; // Light gray
                case 'Not Applicable':
                    return { 'background-color': '#f9fafb' }; // Very light gray
                default:
                    return {};
            }
        };

        ctrl.close = function () {
            if (ctrl.getNewCount() > 0 || ctrl.getModifiedCount() > 0) {
                if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
                    return;
                }
            }

            if (ctrl.onClose) {
                ctrl.onClose();
            }
        };

        // Create Defect from Failed Test
        ctrl.openDefectModal = function (testCase) {
            ctrl.selectedTestCase = testCase;
            ctrl.showDefectModal = true;

            // Pre-fill defect data
            ctrl.defectData = {
                title: 'Test Failed: ' + testCase.testCaseTitle,
                description: 'Test Case: ' + testCase.testCaseTitle + '\n\n' +
                    'Expected Result:\n' + (testCase.expectedResult || 'N/A') + '\n\n' +
                    'Actual Result:\n' + testCase.actualResult + '\n\n' +
                    'Test Steps:\n' + (testCase.testSteps || 'N/A'),
                severity: testCase.priority === 'High' ? 'High' : testCase.priority === 'Low' ? 'Low' : 'Medium',
                priority: testCase.priority || 'Medium',
                assignedToEmployeeId: ctrl.control.employeeId ? ctrl.control.employeeId.toString() : '',
                attachmentUrl: null,
                attachmentUrls: []
            };
        };

        // Open standalone defect modal (not linked to test case)
        ctrl.openStandaloneDefectModal = function () {
            ctrl.selectedTestCase = null;
            ctrl.showDefectModal = true;

            // Empty defect data
            ctrl.defectData = {
                title: '',
                description: '',
                severity: 'Medium',
                priority: 'Medium',
                assignedToEmployeeId: ctrl.control.employeeId ? ctrl.control.employeeId.toString() : '',
                attachmentUrl: null,
                attachmentUrls: []
            };
        };

        ctrl.closeDefectModal = function () {
            ctrl.showDefectModal = false;
            ctrl.selectedTestCase = null;
            ctrl.defectData = {};
        };

        // View linked defect details
        ctrl.viewLinkedDefect = function (defectId) {
            ctrl.showViewDefectModal = true;
            ctrl.loadingDefect = true;
            ctrl.viewingDefect = null;

            ApiService.get('/api/defects/' + defectId).then(function (response) {
                ctrl.viewingDefect = response.data;
                ctrl.loadingDefect = false;
                $scope.$apply();
            }).catch(function (error) {
                console.error('Error loading defect:', error);
                NotificationService.show('Error loading defect details', 'error');
                ctrl.closeViewDefectModal();
            });
        };

        ctrl.closeViewDefectModal = function () {
            ctrl.showViewDefectModal = false;
            ctrl.viewingDefect = null;
            ctrl.loadingDefect = false;
        };

        ctrl.viewImage = function (imageUrl) {
            if (imageUrl) {
                window.open(imageUrl, '_blank');
            }
        };

        ctrl.onImageSelect = function (file) {
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                NotificationService.show('Image size should be less than 5MB', 'error');
                return;
            }

            if (!file.type.startsWith('image/')) {
                NotificationService.show('Please select an image file', 'error');
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    if (ctrl.defectData.attachmentUrls.length < 5) {
                        ctrl.defectData.attachmentUrls.push(e.target.result);
                        // Also set backward compatibility single URL for older components if needed
                        ctrl.defectData.attachmentUrl = ctrl.defectData.attachmentUrls[0];
                    }
                    
                    // Clear the file input so same file can be selected again if needed
                    var input = document.getElementById('defectImageInput');
                    if (input) input.value = '';
                });
            };
            reader.readAsDataURL(file);
        };

        ctrl.removeImage = function (index) {
            if (index !== undefined) {
                ctrl.defectData.attachmentUrls.splice(index, 1);
            } else {
                ctrl.defectData.attachmentUrls = [];
            }
            ctrl.defectData.attachmentUrl = ctrl.defectData.attachmentUrls.length > 0 ? ctrl.defectData.attachmentUrls[0] : null;
        };

        ctrl.submitDefect = function () {
            if (!ctrl.defectData.title || !ctrl.defectData.title.trim()) {
                NotificationService.show('Please enter defect title', 'error');
                return;
            }

            ctrl.isCreatingDefect = true;
            var testCase = ctrl.selectedTestCase;

            // If linked to test case, save test case first
            var savePromise;
            if (testCase && (testCase._isNew || testCase._isModified)) {
                var teamId = AuthService.getTeamId();

                if (testCase._isNew) {
                    var createDto = {
                        controlId: ctrl.control.controlId,
                        subDescriptionIndex: testCase.subDescriptionIndex !== undefined ? testCase.subDescriptionIndex : null,
                        testCaseTitle: testCase.testCaseTitle,
                        testSteps: testCase.testSteps,
                        expectedResult: testCase.expectedResult,
                        priority: testCase.priority,
                        testType: testCase.testType
                    };
                    savePromise = ApiService.addTestCase(createDto, teamId);
                } else {
                    var updateDto = {
                        testCaseTitle: testCase.testCaseTitle,
                        testSteps: testCase.testSteps,
                        expectedResult: testCase.expectedResult,
                        priority: testCase.priority,
                        testType: testCase.testType,
                        status: testCase.status,
                        actualResult: testCase.actualResult
                    };
                    savePromise = ApiService.updateTestCase(testCase.testCaseId, updateDto);
                }
            } else {
                savePromise = Promise.resolve(testCase);
            }

            savePromise.then(function (savedTestCase) {
                if (testCase && testCase._isNew && savedTestCase && savedTestCase.testCaseId) {
                    testCase.testCaseId = savedTestCase.testCaseId;
                    testCase._isNew = false;
                    testCase._isModified = false;
                }

                // Create defect
                var defectPayload = {
                    controlId: ctrl.control.controlId,
                    subDescriptionIndex: (testCase && testCase.subDescriptionIndex !== undefined) ? testCase.subDescriptionIndex : ((ctrl.subDescriptionIndex !== null && ctrl.subDescriptionIndex !== undefined) ? ctrl.subDescriptionIndex : null),
                    title: ctrl.defectData.title,
                    description: ctrl.defectData.description,
                    severity: ctrl.defectData.severity,
                    priority: ctrl.defectData.priority,
                    assignedToEmployeeId: ctrl.defectData.assignedToEmployeeId ? parseInt(ctrl.defectData.assignedToEmployeeId) : null,
                    attachmentUrls: ctrl.defectData.attachmentUrls || [],
                    attachmentUrl: ctrl.defectData.attachmentUrls.length > 0 ? ctrl.defectData.attachmentUrls[0] : null
                };

                var teamId = AuthService.getTeamId();
                return ApiService.addDefect(defectPayload, teamId).then(function (defect) {
                    // Link defect to test case if applicable
                    if (testCase && testCase.testCaseId) {
                        var linkDto = {
                            defectId: defect.defectId
                        };
                        return ApiService.updateTestCase(testCase.testCaseId, linkDto).then(function () {
                            testCase.defectId = defect.defectId;
                            var devName = defect.assignedToName || (ctrl.control.employeeName || 'assigned developer');
                            Swal.fire({ icon: 'success', title: 'Defect Added', text: 'Defect successfully added to ' + devName, timer: 2500, showConfirmButton: false });
                            $rootScope.$broadcast('testCasesUpdated');
                            ctrl.closeDefectModal();
                        });
                    } else {
                        var devName = defect.assignedToName || (ctrl.control.employeeName || 'assigned developer');
                        Swal.fire({ icon: 'success', title: 'Defect Added', text: 'Defect successfully added to ' + devName, timer: 2500, showConfirmButton: false });
                        ctrl.closeDefectModal();
                    }
                });
            }).catch(function (error) {
                console.error('Error creating defect:', error);
                NotificationService.show('Error creating defect: ' + (error.data?.message || 'Unknown error'), 'error');
            }).finally(function () {
                ctrl.isCreatingDefect = false;
                $scope.$apply();
            });
        };

    }
});
