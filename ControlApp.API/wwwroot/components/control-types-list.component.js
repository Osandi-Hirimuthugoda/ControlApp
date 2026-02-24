app.component('controlTypesList', {
    template: `
    <div class="row g-4" style="animation: fadeIn 0.5s ease-out;">
        <!-- All Controls Overview Card -->
        <div class="col-12">
            <div class="card shadow-lg border-0 mb-5" style="border-radius: 24px; overflow: hidden; background: rgba(255, 255, 255, 0.9);">
                <div class="card-header border-0 d-flex justify-content-between align-items-center" 
                     style="background: #0b85e9ff; color: #1f2937; padding: 1.25rem 2rem;">
                    <div>
                        <h5 class="mb-0 fw-bold" style="color: #1f2937;"><i class="fas fa-database me-3"></i>System Controls List</h5>
                        <p class="mb-0 small mt-1" style="color: #4b5563;">Complete overview of all controls in the system</p>
                    </div>
                    <div class="d-flex gap-2">
                        <span class="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm">{{$ctrl.store.allControls.length}} Total Controls</span>
                    </div>
                </div>
                
                <div class="card-body p-4">
                    <!-- Search and Filter Bar -->
                    <div class="row mb-4 align-items-center">
                        <div class="col-md-6">
                            <div class="input-group shadow-sm" style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.2);">
                                <span class="input-group-text bg-white border-0 text-primary">
                                    <i class="fas fa-search"></i>
                                </span>
                                <input type="text" class="form-control border-0 ps-0" ng-model="$ctrl.searchControl" 
                                       placeholder="Search controls by description, employee, or type..." 
                                       style="height: 48px; box-shadow: none;">
                            </div>
                        </div>
                        <div class="col-md-6 text-end" ng-if="$ctrl.canAddControl()">
                            <button class="btn btn-primary shadow-sm" ng-click="$ctrl.showAddForm = !$ctrl.showAddForm">
                                <i class="fas fa-plus me-2"></i>Add New Control
                            </button>
                        </div>
                    </div>

                    <!-- Add New Control Form -->
                    <div ng-if="$ctrl.showAddForm && $ctrl.canAddControl()" class="card border-primary mb-4" style="border-radius: 16px;">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0"><i class="fas fa-plus me-2"></i>Add New Control</h6>
                        </div>
                        <div class="card-body">
                            <form ng-submit="$ctrl.addNewControl()">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Control Type *</label>
                                        <select class="form-select" ng-model="$ctrl.newControl.typeId" required>
                                            <option value="">Select Control Type</option>
                                            <option ng-repeat="type in $ctrl.store.controlTypes" value="{{type.controlTypeId}}">{{type.typeName}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Assign Employee</label>
                                        <select class="form-select" ng-model="$ctrl.newControl.employeeId">
                                            <option value="">Select Employee (Optional)</option>
                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">{{emp.employeeName}}</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label fw-bold">Description *</label>
                                        <textarea class="form-control" ng-model="$ctrl.newControl.description" 
                                                  placeholder="Enter control description" rows="3" required></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Status</label>
                                        <select class="form-select" ng-model="$ctrl.newControl.statusId">
                                            <option value="">Select Status (Optional)</option>
                                            <option ng-repeat="status in $ctrl.store.statuses" value="{{status.id}}">{{status.statusName}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">Initial Progress (%)</label>
                                        <input type="number" class="form-control" ng-model="$ctrl.newControl.progress" 
                                               min="0" max="100" value="0">
                                    </div>
                                    <div class="col-12">
                                        <div class="d-flex gap-2">
                                            <button type="submit" class="btn btn-success" ng-disabled="$ctrl.isAdding">
                                                <span ng-if="!$ctrl.isAdding"><i class="fas fa-save me-2"></i>Add Control</span>
                                                <span ng-if="$ctrl.isAdding"><i class="fas fa-spinner fa-spin me-2"></i>Adding...</span>
                                            </button>
                                            <button type="button" class="btn btn-secondary" ng-click="$ctrl.cancelAddControl()">
                                                <i class="fas fa-times me-2"></i>Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="table-responsive rounded-4 shadow-sm" style="border: 1px solid rgba(0,0,0,0.05);">
                        <table class="table table-hover align-middle mb-0">
                            <thead style="background: #f8fafc;">
                                <tr>
                                    <th class="py-3 px-4 text-secondary small fw-bold text-uppercase text-center" style="width: 10%">Type</th>
                                    <th class="py-3 px-4 text-secondary small fw-bold text-uppercase text-center" style="width: 10%">Sub Objectives</th>
                                    <th class="py-3 px-4 text-secondary small fw-bold text-uppercase">Description / Name</th>
                                    <th class="py-3 px-4 text-secondary small fw-bold text-uppercase" style="width: 25%">Add Sub Objectives</th>
                                    <th class="py-3 px-4 text-secondary small fw-bold text-uppercase text-end" style="width: 15%" 
                                        ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="c in $ctrl.store.allControls | filter:$ctrl.searchControl | orderBy:'-controlId'" class="border-bottom">
                                    <td class="py-3 px-4 text-center">
                                        <div ng-if="!c.editing">
                                            <span class="badge rounded-pill fw-bold" style="background: rgba(99, 102, 241, 0.15); color: #4f46e5; border: 1px solid rgba(99, 102, 241, 0.3);">
                                                {{$ctrl.getTypeName(c.typeId)}}
                                            </span>
                                        </div>
                                        <select ng-if="c.editing" class="form-select form-select-sm border-primary" 
                                                ng-model="c.editTypeId" 
                                                ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes">
                                        </select>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <div class="d-flex flex-column align-items-center justify-content-center">
                                            <div class="position-relative cursor-pointer" 
                                                 style="width: 50px; height: 50px;" 
                                                 ng-click="$ctrl.viewSubObjectives(c)"
                                                 title="Click to view sub-objectives">
                                                <svg width="50" height="50" style="transform: rotate(-90deg);">
                                                    <circle cx="25" cy="25" r="20" fill="none" stroke="#e9ecef" stroke-width="4"></circle>
                                                    <circle cx="25" cy="25" r="20" fill="none" 
                                                            ng-attr-stroke="{{$ctrl.getSubObjectivesCount(c) > 0 ? '#10b981' : '#e9ecef'}}" 
                                                            stroke-width="4" 
                                                            stroke-dasharray="{{125.6}}" 
                                                            ng-attr-stroke-dashoffset="{{125.6 - (125.6 * ($ctrl.getSubObjectivesCompletionRate(c) / 100))}}"
                                                            style="transition: stroke-dashoffset 0.3s ease;"></circle>
                                                </svg>
                                                <div class="position-absolute top-50 start-50 translate-middle">
                                                    <span class="fw-bold" ng-class="{'text-success': $ctrl.getSubObjectivesCount(c) > 0, 'text-muted': $ctrl.getSubObjectivesCount(c) === 0}" 
                                                          style="font-size: 0.9rem;">
                                                        {{$ctrl.getSubObjectivesCount(c)}}
                                                    </span>
                                                </div>
                                            </div>
                                            <small class="text-muted mt-1" style="font-size: 0.7rem;">
                                                {{$ctrl.getSubObjectivesCompletionRate(c)}}% Done
                                            </small>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div ng-if="!c.editing" class="fw-medium text-dark">{{c.description}}</div>
                                        <div ng-if="c.editing" class="p-2">
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold text-success border-bottom pb-1 mb-2 d-block">Modify Main Objective</label>
                                                <textarea class="form-control border-success shadow-none fs-6 fw-bold" ng-model="c.editDescription" rows="2"></textarea>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold text-primary border-bottom pb-1 mb-2 d-block">Overall Progress (%) <span class="badge bg-light text-primary ms-1 border">(Currently: {{c.progress}}%)</span></label>
                                                <input type="number" class="form-control border-primary shadow-none fw-bold" ng-model="c.editProgress" min="0" max="100">
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="d-flex justify-content-center">
                                            <button class="btn btn-sm btn-success shadow-sm" 
                                                    ng-click="$ctrl.openAddSubObjectiveModal(c)" 
                                                    title="Add Sub Objective">
                                                <i class="fas fa-plus me-1"></i>Add Sub Objective
                                            </button>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-end" ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                        <div ng-if="!c.editing" class="btn-group">
                                            <button class="btn btn-sm btn-link text-warning p-1 me-2" ng-click="$ctrl.startEditControl(c)" title="Edit">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button class="btn btn-sm btn-link text-danger p-1" ng-click="$ctrl.deleteControl(c)" ng-disabled="c.deleting" title="Delete">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                        <div ng-if="c.editing" class="btn-group shadow-sm rounded-3 overflow-hidden">
                                            <button class="btn btn-sm btn-success px-2 border-0" ng-click="$ctrl.saveControl(c)" ng-disabled="c.saving">
                                                <i class="fas fa-save"></i>
                                            </button>
                                            <button class="btn btn-sm btn-secondary px-2 border-0" ng-click="$ctrl.cancelEditControl(c)" ng-disabled="c.saving">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr ng-if="!$ctrl.store.allControls || $ctrl.store.allControls.length === 0">
                                    <td colspan="4" class="text-center py-4 text-muted small">
                                        <i class="fas fa-inbox fa-2x mb-2 d-block"></i> No controls found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Sub Objective Modal -->
    <div class="modal fade" id="addSubObjectiveModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                <div class="modal-header border-0 bg-success text-white" style="border-radius: 20px 20px 0 0;">
                    <h5 class="modal-title fw-bold">
                        <i class="fas fa-plus-circle me-2"></i>New Sub Objective
                    </h5>
                    <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.closeAddSubObjectiveModal()"></button>
                </div>
                <div class="modal-body p-4">
                    <div ng-if="$ctrl.selectedControl">
                        <div class="alert alert-info border-0 mb-3" style="background: rgba(59, 130, 246, 0.1);">
                            <strong><i class="fas fa-info-circle me-2"></i>Parent Control:</strong> {{$ctrl.selectedControl.typeName}} - {{$ctrl.selectedControl.description}}
                        </div>
                        
                        <form ng-submit="$ctrl.saveNewSubObjective()">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Objective Description <span class="text-danger">*</span></label>
                                <textarea class="form-control border-success" 
                                          ng-model="$ctrl.newSubObjective.description" 
                                          rows="3" 
                                          placeholder="Enter sub-objective description..."
                                          required></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Assigned To</label>
                                <select class="form-select border-success" ng-model="$ctrl.newSubObjective.employeeId">
                                    <option value="">- Unassigned -</option>
                                    <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">{{emp.employeeName}}</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Status</label>
                                <select class="form-select border-success" ng-model="$ctrl.newSubObjective.statusId">
                                    <option value="">- Select Status -</option>
                                    <option ng-repeat="status in $ctrl.store.statuses" value="{{status.id}}">{{status.statusName}}</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold">Progress (%)</label>
                                <input type="number" 
                                       class="form-control border-success" 
                                       ng-model="$ctrl.newSubObjective.progress" 
                                       min="0" 
                                       max="100" 
                                       placeholder="0">
                            </div>
                            
                            <div class="d-flex gap-2 justify-content-end mt-4">
                                <button type="button" class="btn btn-secondary" ng-click="$ctrl.closeAddSubObjectiveModal()">
                                    <i class="fas fa-times me-2"></i>Cancel
                                </button>
                                <button type="submit" class="btn btn-success" ng-disabled="$ctrl.isSavingSubObjective || !$ctrl.newSubObjective.description">
                                    <span ng-if="!$ctrl.isSavingSubObjective"><i class="fas fa-save me-2"></i>Save Sub Objective</span>
                                    <span ng-if="$ctrl.isSavingSubObjective"><i class="fas fa-spinner fa-spin me-2"></i>Saving...</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- View Sub Objectives Modal -->
    <div class="modal fade" id="viewSubObjectivesModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                <div class="modal-header border-0 bg-primary text-white" style="border-radius: 20px 20px 0 0;">
                    <h5 class="modal-title fw-bold">
                        <i class="fas fa-tasks me-2"></i>Sub Objectives
                    </h5>
                    <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.closeViewSubObjectivesModal()"></button>
                </div>
                <div class="modal-body p-4">
                    <div ng-if="$ctrl.viewingControl">
                        <div class="alert alert-info border-0 mb-4" style="background: rgba(59, 130, 246, 0.1);">
                            <strong><i class="fas fa-info-circle me-2"></i>Parent Control:</strong> {{$ctrl.viewingControl.typeName}} - {{$ctrl.viewingControl.description}}
                        </div>
                        
                        <div ng-if="!$ctrl.viewingControl._subDescriptionsArray || $ctrl.viewingControl._subDescriptionsArray.length === 0" class="text-center py-5">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No sub-objectives found for this control.</p>
                        </div>
                        
                        <div ng-if="$ctrl.viewingControl._subDescriptionsArray && $ctrl.viewingControl._subDescriptionsArray.length > 0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 5%">#</th>
                                            <th style="width: 35%">Description</th>
                                            <th style="width: 20%">Assigned To</th>
                                            <th style="width: 15%">Status</th>
                                            <th style="width: 15%">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="subObj in $ctrl.viewingControl._subDescriptionsArray track by $index">
                                            <td class="text-center">{{$index + 1}}</td>
                                            <td>
                                                <div class="fw-medium text-dark">{{subObj.description}}</div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-sm me-2 rounded-circle bg-light d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;">
                                                        <i class="fas fa-user text-secondary" style="font-size: 0.7rem;"></i>
                                                    </div>
                                                    <span ng-class="{'text-danger': !subObj.employeeId}" class="small">
                                                        {{subObj.employeeId ? $ctrl.getEmployeeName(subObj.employeeId) : 'Unassigned'}}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span ng-if="subObj.statusId" class="badge bg-light text-dark border small">
                                                    {{$ctrl.getStatusName(subObj.statusId)}}
                                                </span>
                                                <span ng-if="!subObj.statusId" class="text-muted small">-</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="progress flex-grow-1" style="height: 8px;">
                                                        <div class="progress-bar bg-success" 
                                                             role="progressbar" 
                                                             ng-style="{'width': (subObj.progress || 0) + '%'}"
                                                             aria-valuenow="{{subObj.progress || 0}}" 
                                                             aria-valuemin="0" 
                                                             aria-valuemax="100">
                                                        </div>
                                                    </div>
                                                    <span class="small fw-bold text-muted" style="min-width: 40px;">{{subObj.progress || 0}}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" ng-click="$ctrl.closeViewSubObjectivesModal()">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
            </div>
        </div>
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .table tbody tr:hover {
            background-color: rgba(99, 102, 241, 0.02) !important;
            transform: scale(1.002);
            transition: all 0.2s ease;
        }
        .form-control:focus, .form-select:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
            border-color: #6366f1 !important;
        }
        .btn-group .btn:hover {
            transform: none !important;
            background-color: rgba(0,0,0,0.05) !important;
        }
        .avatar-sm {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border: 1px solid rgba(0,0,0,0.05);
        }
        .cursor-pointer {
            cursor: pointer;
        }
        .hover-underline:hover {
            text-decoration: underline;
        }
    </style>
    `,
    controller: function (ApiService, NotificationService, $rootScope, $timeout, AuthService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchControl = '';

        // Check if user can edit controls
        ctrl.canEditControl = function () {
            return AuthService.canEditControl();
        };

        // Check if user can delete controls
        ctrl.canDeleteControl = function () {
            return AuthService.canDeleteControl();
        };

        // Check if user can add controls
        ctrl.canAddControl = function () {
            return AuthService.canAddControl();
        };

        // Add new control form
        ctrl.showAddForm = false;
        ctrl.isAdding = false;
        ctrl.newControl = {
            typeId: null,
            description: '',
            employeeId: null,
            statusId: null,
            progress: 0
        };

        ctrl.cancelAddControl = function () {
            ctrl.showAddForm = false;
            ctrl.newControl = {
                typeId: null,
                description: '',
                employeeId: null,
                statusId: null,
                progress: 0
            };
        };

        ctrl.addNewControl = function () {
            if (!ctrl.newControl.typeId || !ctrl.newControl.description) {
                NotificationService.show('Type and Description are required', 'error');
                return;
            }

            ctrl.isAdding = true;

            var employeeIdValue = null;
            if (ctrl.newControl.employeeId && ctrl.newControl.employeeId !== '') {
                var parsedId = parseInt(ctrl.newControl.employeeId);
                if (!isNaN(parsedId) && parsedId > 0) {
                    employeeIdValue = parsedId;
                }
            }

            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            
            // If employee is assigned, get teamId from employee, otherwise use current team
            var teamIdToAssign = currentTeamId;
            if (employeeIdValue) {
                var selectedEmployee = ctrl.store.employees.find(function(e) { 
                    return e.id === employeeIdValue; 
                });
                if (selectedEmployee && selectedEmployee.teamId) {
                    teamIdToAssign = selectedEmployee.teamId;
                }
            }

            var payload = {
                typeId: parseInt(ctrl.newControl.typeId),
                description: ctrl.newControl.description.trim(),
                employeeId: employeeIdValue,
                statusId: ctrl.newControl.statusId ? parseInt(ctrl.newControl.statusId) : null,
                progress: parseInt(ctrl.newControl.progress) || 0,
                comments: '',
                teamId: teamIdToAssign
            };

            ApiService.addControl(payload).then(function (createdControl) {
                NotificationService.show('Control added successfully!', 'success');
                ctrl.cancelAddControl();
                // Reload controls for current team
                return ApiService.loadAllControls(currentTeamId);
            }).then(function () {
                $timeout(function () {
                    ctrl.store = ApiService.data;
                }, 100);
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error adding control:', error);
                var errorMsg = 'Error adding control';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || errorMsg);
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isAdding = false;
            });
        };

        ctrl.$onInit = function () {
            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            console.log('Loading control types list for team:', currentTeamId);
            
            // Load all necessary data for current team
            ApiService.loadControlTypes(currentTeamId).then(function () {
                return ApiService.loadStatuses();
            }).then(function () {
                return ApiService.loadEmployees(currentTeamId);
            }).then(function () {
                return ApiService.loadAllControls(currentTeamId);
            }).then(function () {
                // Initialize sub-descriptions arrays for all controls
                if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                    ctrl.store.allControls.forEach(function (control) {
                        if (control.subDescriptions && !control._subDescriptionsArray) {
                            try {
                                control._subDescriptionsArray = typeof control.subDescriptions === 'string' 
                                    ? JSON.parse(control.subDescriptions) 
                                    : control.subDescriptions;
                            } catch (e) {
                                control._subDescriptionsArray = [];
                            }
                        }
                    });
                }
                $timeout(function () {
                    ctrl.store = ApiService.data;
                }, 100);
            });

            // Listen for section changes (when navigating to this page)
            var sectionListener = $rootScope.$on('controlsSectionChanged', function(event, section) {
                if (section === 'controlTypes') {
                    var teamId = AuthService.getTeamId();
                    console.log('Navigated to control types list section, reloading for team:', teamId);
                    
                    // Reload data for current team
                    ApiService.loadControlTypes(teamId).then(function () {
                        return ApiService.loadEmployees(teamId);
                    }).then(function () {
                        return ApiService.loadAllControls(teamId);
                    }).then(function () {
                        // Initialize sub-descriptions arrays
                        if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                            ctrl.store.allControls.forEach(function (control) {
                                if (control.subDescriptions && !control._subDescriptionsArray) {
                                    try {
                                        control._subDescriptionsArray = typeof control.subDescriptions === 'string' 
                                            ? JSON.parse(control.subDescriptions) 
                                            : control.subDescriptions;
                                    } catch (e) {
                                        control._subDescriptionsArray = [];
                                    }
                                }
                            });
                        }
                        $timeout(function () {
                            ctrl.store = ApiService.data;
                        }, 100);
                    });
                }
            });
            
            // Listen for updates
            var controlsListener = $rootScope.$on('controlsUpdated', function () {
                var teamId = AuthService.getTeamId();
                ApiService.loadAllControls(teamId).then(function () {
                    // Initialize sub-descriptions arrays for all controls
                    if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                        ctrl.store.allControls.forEach(function (control) {
                            if (control.subDescriptions && !control._subDescriptionsArray) {
                                try {
                                    control._subDescriptionsArray = typeof control.subDescriptions === 'string' 
                                        ? JSON.parse(control.subDescriptions) 
                                        : control.subDescriptions;
                                } catch (e) {
                                    control._subDescriptionsArray = [];
                                }
                            }
                        });
                    }
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            // Listen for team changes
            var teamListener = $rootScope.$on('teamChanged', function(event, data) {
                console.log('Team changed in control types list, reloading for team:', data.teamId);
                ApiService.loadControlTypes(data.teamId).then(function () {
                    return ApiService.loadEmployees(data.teamId);
                }).then(function () {
                    return ApiService.loadAllControls(data.teamId);
                }).then(function () {
                    // Initialize sub-descriptions arrays
                    if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                        ctrl.store.allControls.forEach(function (control) {
                            if (control.subDescriptions && !control._subDescriptionsArray) {
                                try {
                                    control._subDescriptionsArray = typeof control.subDescriptions === 'string' 
                                        ? JSON.parse(control.subDescriptions) 
                                        : control.subDescriptions;
                                } catch (e) {
                                    control._subDescriptionsArray = [];
                                }
                            }
                        });
                    }
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            ctrl.$onDestroy = function () {
                if (sectionListener) sectionListener();
                if (controlsListener) controlsListener();
                if (teamListener) teamListener();
            };
        };

        // Helper: get type name by id
        ctrl.getTypeName = function (typeId) {
            if (!typeId || !ctrl.store.controlTypes) return '';
            var t = ctrl.store.controlTypes.find(function (tp) { return tp.controlTypeId == typeId; });
            return t ? t.typeName : '';
        };

        // Helper: get employee name by id
        ctrl.getEmployeeName = function (employeeId) {
            if (!employeeId || !ctrl.store.employees) return 'Not Assigned';
            var e = ctrl.store.employees.find(function (emp) { return emp.id == employeeId; });
            return e ? e.employeeName : 'Not Assigned';
        };

        // Get count of sub-objectives for a control
        ctrl.getSubObjectivesCount = function (control) {
            if (!control || !control._subDescriptionsArray) {
                // Try to parse from subDescriptions if _subDescriptionsArray doesn't exist
                if (control && control.subDescriptions) {
                    try {
                        var parsed = typeof control.subDescriptions === 'string' 
                            ? JSON.parse(control.subDescriptions) 
                            : control.subDescriptions;
                        return Array.isArray(parsed) ? parsed.length : 0;
                    } catch (e) {
                        return 0;
                    }
                }
                return 0;
            }
            return control._subDescriptionsArray.length;
        };

        // Get completion rate of sub-objectives for a control
        ctrl.getSubObjectivesCompletionRate = function (control) {
            if (!control) return 0;
            
            var subDescs = control._subDescriptionsArray;
            
            // Try to parse from subDescriptions if _subDescriptionsArray doesn't exist
            if (!subDescs && control.subDescriptions) {
                try {
                    subDescs = typeof control.subDescriptions === 'string' 
                        ? JSON.parse(control.subDescriptions) 
                        : control.subDescriptions;
                } catch (e) {
                    return 0;
                }
            }
            
            if (!subDescs || !Array.isArray(subDescs) || subDescs.length === 0) {
                return 0;
            }
            
            var totalProgress = 0;
            var count = subDescs.length;
            
            subDescs.forEach(function (subDesc) {
                var progress = subDesc.progress || 0;
                totalProgress += parseInt(progress);
            });
            
            var averageProgress = Math.round(totalProgress / count);
            return averageProgress;
        };

        // Control editing methods
        ctrl.startEditControl = function (control) {
            control.editing = true;
            control.editDescription = control.description || '';
            control.editStatusId = control.statusId || null;
            control.editProgress = control.progress || 0;
            control.editEmployeeId = control.employeeId || null;
            control.editTypeId = control.typeId || null;
        };

        ctrl.cancelEditControl = function (control) {
            control.editing = false;
            delete control.editDescription;
            delete control.editStatusId;
            delete control.editProgress;
            delete control.editEmployeeId;
            delete control.editTypeId;
        };

        ctrl.saveControl = function (control) {
            if (!control.controlId) {
                NotificationService.show('Cannot save: No control assigned', 'error');
                return;
            }

            var progressValue = parseInt(control.editProgress) || 0;
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            control.saving = true;

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.editEmployeeId ? parseInt(control.editEmployeeId) : null,
                typeId: parseInt(control.editTypeId),
                description: control.editDescription,
                progress: progressValue,
                statusId: control.editStatusId ? parseInt(control.editStatusId) : null,
                comments: control.comments || ''
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                control.description = updatedControl.description;
                control.progress = updatedControl.progress || 0;
                control.statusId = updatedControl.statusId;
                control.employeeId = updatedControl.employeeId;
                control.typeId = updatedControl.typeId;

                var status = ctrl.store.statuses.find(function (s) { return s.id == control.statusId; });
                control.statusName = status ? status.statusName : '';

                control.editing = false;
                control.saving = false;

                NotificationService.show('Control updated successfully!', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                control.saving = false;
                console.error('Error saving control:', error);
                NotificationService.show('Error saving control', 'error');
            });
        };

        ctrl.deleteControl = function (control) {
            if (!control.controlId) {
                NotificationService.show('Cannot delete: No control assigned', 'error');
                return;
            }

            if (!confirm('Are you sure you want to delete this control?')) {
                return;
            }

            control.deleting = true;
            ApiService.deleteControl(control.controlId).then(function () {
                var index = ctrl.store.allControls.findIndex(function (c) {
                    return c.controlId === control.controlId;
                });
                if (index > -1) {
                    ctrl.store.allControls.splice(index, 1);
                }
                NotificationService.show('Control deleted successfully', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                NotificationService.show('Error deleting control', 'error');
            });
        };

        // Quick update for Control Progress
        ctrl.updateControlProgressQuick = function (control) {
            var newProgress = parseInt(control.progress || 0);
            if (newProgress < 0) newProgress = 0;
            if (newProgress > 100) newProgress = 100;
            control.progress = newProgress;

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description,
                progress: control.progress,
                statusId: control.statusId,
                comments: control.comments || ''
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                NotificationService.show('Progress updated', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error updating progress:', error);
                NotificationService.show('Error updating progress', 'error');
            });
        };

        // Add sub-objective to a control
        ctrl.addSubObjective = function (control) {
            if (!control._newSubObjective || !control._newSubObjective.trim()) {
                NotificationService.show('Please enter a sub-objective description', 'error');
                return;
            }

            // Get existing sub-descriptions or initialize empty array
            var subDescs = [];
            if (control.subDescriptions) {
                try {
                    subDescs = typeof control.subDescriptions === 'string' 
                        ? JSON.parse(control.subDescriptions) 
                        : control.subDescriptions;
                } catch (e) {
                    subDescs = [];
                }
            }

            // Add new sub-objective
            var newSubObj = {
                description: control._newSubObjective.trim(),
                employeeId: null,
                statusId: null,
                progress: 0,
                releaseId: null,
                releaseDate: null,
                comments: []
            };

            subDescs.push(newSubObj);

            // Update control
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description,
                progress: control.progress,
                statusId: control.statusId,
                subDescriptions: JSON.stringify(subDescs),
                comments: control.comments || ''
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update local control object
                control.subDescriptions = updatedControl.subDescriptions;
                control._subDescriptionsArray = typeof updatedControl.subDescriptions === 'string' 
                    ? JSON.parse(updatedControl.subDescriptions) 
                    : updatedControl.subDescriptions;
                
                // Clear input
                control._newSubObjective = '';
                
                NotificationService.show('Sub-objective added successfully!', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error adding sub-objective:', error);
                NotificationService.show('Error adding sub-objective', 'error');
            });
        };

        // Modal for adding sub-objective
        ctrl.selectedControl = null;
        ctrl.newSubObjective = {};
        ctrl.isSavingSubObjective = false;

        // Modal for viewing sub-objectives
        ctrl.viewingControl = null;

        ctrl.viewSubObjectives = function (control) {
            ctrl.viewingControl = control;
            
            // Ensure sub-descriptions array is initialized
            if (!control._subDescriptionsArray && control.subDescriptions) {
                try {
                    control._subDescriptionsArray = typeof control.subDescriptions === 'string' 
                        ? JSON.parse(control.subDescriptions) 
                        : control.subDescriptions;
                } catch (e) {
                    control._subDescriptionsArray = [];
                }
            }
            
            // Open modal using Bootstrap 5
            var modalElement = document.getElementById('viewSubObjectivesModal');
            if (modalElement) {
                var modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        };

        ctrl.closeViewSubObjectivesModal = function () {
            var modalElement = document.getElementById('viewSubObjectivesModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            ctrl.viewingControl = null;
        };

        ctrl.getStatusName = function (statusId) {
            if (!statusId || !ctrl.store.statuses) return '';
            var status = ctrl.store.statuses.find(function (s) { return s.id == statusId; });
            return status ? status.statusName : '';
        };

        ctrl.openAddSubObjectiveModal = function (control) {
            ctrl.selectedControl = control;
            ctrl.newSubObjective = {
                description: '',
                employeeId: null,
                statusId: null,
                progress: 0
            };
            
            // Open modal using Bootstrap 5
            var modalElement = document.getElementById('addSubObjectiveModal');
            if (modalElement) {
                var modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        };

        ctrl.closeAddSubObjectiveModal = function () {
            var modalElement = document.getElementById('addSubObjectiveModal');
            if (modalElement) {
                var modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            ctrl.selectedControl = null;
            ctrl.newSubObjective = {};
        };

        ctrl.saveNewSubObjective = function () {
            if (!ctrl.newSubObjective.description || !ctrl.newSubObjective.description.trim()) {
                NotificationService.show('Please enter a sub-objective description', 'error');
                return;
            }

            if (!ctrl.selectedControl) {
                NotificationService.show('No control selected', 'error');
                return;
            }

            ctrl.isSavingSubObjective = true;

            // Get existing sub-descriptions or initialize empty array
            var subDescs = [];
            if (ctrl.selectedControl.subDescriptions) {
                try {
                    subDescs = typeof ctrl.selectedControl.subDescriptions === 'string' 
                        ? JSON.parse(ctrl.selectedControl.subDescriptions) 
                        : ctrl.selectedControl.subDescriptions;
                } catch (e) {
                    subDescs = [];
                }
            }

            // Add new sub-objective with all details
            var newSubObj = {
                description: ctrl.newSubObjective.description.trim(),
                employeeId: ctrl.newSubObjective.employeeId ? parseInt(ctrl.newSubObjective.employeeId) : null,
                statusId: ctrl.newSubObjective.statusId ? parseInt(ctrl.newSubObjective.statusId) : null,
                progress: ctrl.newSubObjective.progress ? parseInt(ctrl.newSubObjective.progress) : 0,
                releaseId: null,
                releaseDate: null,
                comments: []
            };

            subDescs.push(newSubObj);

            // Update control
            var payload = {
                controlId: parseInt(ctrl.selectedControl.controlId),
                employeeId: ctrl.selectedControl.employeeId,
                typeId: ctrl.selectedControl.typeId,
                description: ctrl.selectedControl.description,
                progress: ctrl.selectedControl.progress,
                statusId: ctrl.selectedControl.statusId,
                subDescriptions: JSON.stringify(subDescs),
                comments: ctrl.selectedControl.comments || ''
            };

            ApiService.updateControl(ctrl.selectedControl.controlId, payload).then(function (updatedControl) {
                // Update local control object
                ctrl.selectedControl.subDescriptions = updatedControl.subDescriptions;
                ctrl.selectedControl._subDescriptionsArray = typeof updatedControl.subDescriptions === 'string' 
                    ? JSON.parse(updatedControl.subDescriptions) 
                    : updatedControl.subDescriptions;
                
                NotificationService.show('Sub-objective added successfully!', 'success');
                $rootScope.$broadcast('controlsUpdated');
                
                // Close modal
                ctrl.closeAddSubObjectiveModal();
            }).catch(function (error) {
                console.error('Error adding sub-objective:', error);
                NotificationService.show('Error adding sub-objective', 'error');
            }).finally(function () {
                ctrl.isSavingSubObjective = false;
            });
        };

        ctrl.onEditStatusChange = function (control) {
            // Reset progress when status changes
            if (control.editStatusId !== control.statusId) {
                control.editProgress = 0;
            }
        };
    }
});