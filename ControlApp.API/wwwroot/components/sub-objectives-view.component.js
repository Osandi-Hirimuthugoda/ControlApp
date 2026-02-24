app.component('subObjectivesView', {
    template: `
    <div class="row g-4" style="animation: fadeIn 0.5s ease-out;">
        <!-- Sub-Objectives Management Card -->
        <div class="col-12">
            <div class="card shadow-lg border-0" style="border-radius: 24px; overflow: hidden; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
                <div class="card-header border-0 d-flex justify-content-between align-items-center" 
                     style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 1.5rem 2rem;">
                    <div>
                        <h4 class="mb-0 fw-bold text-white"><i class="fas fa-layer-group me-3"></i>Sub-Objectives by Control</h4>
                        <p class="text-white-50 mb-0 small mt-1">Manage sub-objectives grouped by their parent control</p>
                    </div>
                    <div>
                         <div class="input-group shadow-sm" style="border-radius: 20px; overflow: hidden; border: none; width: 300px;">
                                <span class="input-group-text bg-white border-0 text-success ps-3">
                                    <i class="fas fa-search"></i>
                                </span>
                                <input type="text" class="form-control border-0 ps-2" ng-model="$ctrl.searchText" 
                                       placeholder="Search controls or objectives..." 
                                       style="height: 45px; box-shadow: none;">
                        </div>
                    </div>
                </div>
                
                <div class="card-body p-4 bg-light">
                    <!-- Loading State -->
                    <div ng-if="$ctrl.isLoading" class="text-center py-5">
                        <div class="spinner-border text-success" role="status"></div>
                        <p class="mt-2 text-muted">Loading objectives...</p>
                    </div>

                    <!-- Groups List -->
                    <div ng-if="!$ctrl.isLoading" class="accordion" id="accordionControls" style="max-height: 75vh; overflow-y: auto; padding-right: 5px;">
                        <div class="card border-0 shadow-sm mb-3 rounded-4 overflow-hidden" 
                             ng-repeat="group in $ctrl.groupedObjectives | filter:$ctrl.groupFilter"
                             style="transition: all 0.2s;">
                            
                            <!-- Control Header -->
                            <div class="card-header p-3 border-0 d-flex align-items-center justify-content-between" 
                                 style="cursor: pointer; background: #5ab2f9ff !important; color: #1f2937 !important;" 
                                 ng-click="group.expanded = !group.expanded">
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div class="me-3 text-center">
                                        <div class="avatar-md bg-white rounded-circle d-flex align-items-center justify-content-center text-success fw-bold" 
                                             style="width: 45px; height: 45px; font-size: 1.2rem;">
                                            {{group.typeName.charAt(0)}}
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">{{group.description}}</h6>
                                        <div class="small text-muted mt-1">
                                            <span class="badge bg-white text-secondary border me-2">{{group.typeName}}</span>
                                            <span class="text-secondary"><i class="fas fa-user-circle me-1"></i>{{group.ownerName || 'Unassigned'}}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex align-items-center">
                                    <div class="me-4 text-end">
                                        <span class="d-block h5 mb-0 fw-bold" ng-class="{'text-success': group.subs.length > 0, 'text-muted': group.subs.length === 0}">
                                            {{group.subs.length}}
                                        </span>
                                        <small class="text-secondary" style="font-size: 0.7rem;">OBJECTIVES</small>
                                    </div>
                                    
                                    <button class="btn btn-sm btn-outline-primary rounded-pill me-3 px-3 shadow-sm bg-white" 
                                            ng-click="$event.stopPropagation(); $ctrl.openAddModal(group.controlId)">
                                        <i class="fas fa-plus me-1"></i> Add
                                    </button>

                                    <i class="fas fa-chevron-down text-secondary transition-icon" 
                                       ng-style="{'transform': group.expanded ? 'rotate(180deg)' : 'rotate(0deg)'}"></i>
                                </div>
                            </div>

                            <!-- Sub-Objectives Body -->
                            <div class="collapse" ng-class="{'show': group.expanded}">
                                <div class="card-body bg-light border-top p-0">
                                    <div ng-if="group.subs.length === 0" class="text-center py-4 text-muted small">
                                        <i class="fas fa-clipboard-list mb-2 d-block fa-2x opacity-25"></i>
                                        No sub-objectives added yet. Click "Add" to create one.
                                    </div>

                                    <table ng-if="group.subs.length > 0" class="table table-hover align-middle mb-0">
                                        <thead class="bg-white">
                                            <tr>
                                                <th class="ps-5 py-2 text-secondary small text-uppercase fw-bold" style="font-size: 0.7rem;">Description</th>
                                                <th class="py-2 text-secondary small text-uppercase fw-bold" style="font-size: 0.7rem;">Owner</th>
                                                <th class="py-2 text-secondary small text-uppercase fw-bold" style="font-size: 0.7rem;">Status</th>
                                                <th class="py-2 text-secondary small text-uppercase fw-bold" style="font-size: 0.7rem; width: 20%;">Progress</th>
                                                <th class="pe-4 py-2 text-end text-secondary small text-uppercase fw-bold" style="font-size: 0.7rem;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="sub in group.subs" class="bg-white">
                                                <td class="ps-5 py-3 border-bottom-0">
                                                    <span class="fw-medium text-dark">{{sub.description}}</span>
                                                </td>
                                                <td class="py-3 border-bottom-0">
                                                    <span class="small text-secondary">{{sub.employeeName || 'Unassigned'}}</span>
                                                </td>
                                                <td class="py-3 border-bottom-0">
                                                    <span class="badge rounded-pill" 
                                                          ng-class="{'bg-success-subtle text-success': sub.statusName === 'Completed' || sub.statusName === 'Live', 
                                                                     'bg-warning-subtle text-warning': sub.statusName === 'In Progress',
                                                                     'bg-secondary-subtle text-secondary': !sub.statusName || sub.statusName === 'Pending'}">
                                                        {{sub.statusName || 'Pending'}}
                                                    </span>
                                                </td>
                                                <td class="py-3 border-bottom-0">
                                                    <div class="d-flex align-items-center">
                                                        <div class="progress flex-grow-1 me-2" style="height: 5px; background-color: #e9ecef;">
                                                            <div class="progress-bar rounded-pill" 
                                                                 ng-style="{width: (sub.progress || 0) + '%'}"
                                                                 ng-class="{'bg-success': sub.progress >= 100, 'bg-primary': sub.progress < 100}"></div>
                                                        </div>
                                                        <span class="small text-muted">{{sub.progress || 0}}%</span>
                                                    </div>
                                                </td>
                                                <td class="pe-4 py-3 border-bottom-0 text-end">
                                                    <button class="btn btn-sm btn-light text-primary rounded-circle shadow-sm me-1" 
                                                            style="width: 32px; height: 32px;"
                                                            ng-click="$ctrl.openEditModal(sub, group)" title="Edit">
                                                        <i class="fas fa-pencil-alt small"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-light text-danger rounded-circle shadow-sm" 
                                                            style="width: 32px; height: 32px;"
                                                            ng-click="$ctrl.deleteSubObjective(sub, group)" title="Delete">
                                                        <i class="fas fa-trash-alt small"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Empty State -->
                        <div ng-if="($ctrl.groupedObjectives | filter:$ctrl.groupFilter).length === 0" class="text-center py-5">
                            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486777.png" alt="No Data" style="width: 100px; opacity: 0.5;">
                            <h5 class="text-secondary mt-3">No Controls Found</h5>
                            <p class="text-muted small">Try a different search term.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Add/Edit Sub-Objective -->
    <div class="modal fade" id="subObjectiveModal" tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header bg-light border-0 px-4 py-3">
                    <h5 class="modal-title fw-bold text-dark">
                        {{$ctrl.isEditing ? 'Edit Objective' : 'New Objective'}}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <form name="subForm">
                        <div class="d-flex align-items-center mb-4 p-3 rounded-3 bg-primary-subtle text-primary">
                            <i class="fas fa-cube fs-4 me-3"></i>
                            <div>
                                <small class="text-uppercase fw-bold opacity-75" style="font-size: 0.7rem;">Parent Control</small>
                                <div class="fw-bold">{{ $ctrl.modalData.parentControlName }}</div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-secondary text-uppercase">Objective Description</label>
                            <textarea class="form-control bg-light border-0" ng-model="$ctrl.modalData.description" 
                                      rows="3" placeholder="What needs to be achieved?" required></textarea>
                        </div>

                        <div class="row">
                            <!-- Owner -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold text-secondary text-uppercase">Assigned To</label>
                                <select class="form-select border-0 bg-light" ng-model="$ctrl.modalData.employeeId" 
                                        ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                                    <option value="">- Unassigned -</option>
                                </select>
                            </div>
                            <!-- Status -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold text-secondary text-uppercase">Status</label>
                                <select class="form-select border-0 bg-light" ng-model="$ctrl.modalData.statusId" 
                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                </select>
                            </div>
                        </div>

                        <!-- Progress -->
                        <div class="mb-2">
                            <div class="d-flex justify-content-between mb-1">
                                <label class="form-label small fw-bold text-secondary text-uppercase mb-0">Progress</label>
                                <span class="badge bg-primary rounded-pill">{{$ctrl.modalData.progress}}%</span>
                            </div>
                            <input type="range" class="form-range" ng-model="$ctrl.modalData.progress" min="0" max="100">
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-0 pt-0 pb-4 px-4">
                    <button type="button" class="btn btn-light rounded-pill px-4 fw-bold text-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-dark rounded-pill px-4 fw-bold" 
                            ng-click="$ctrl.saveModal()" ng-disabled="subForm.$invalid || $ctrl.isSaving">
                        <span ng-if="$ctrl.isSaving" class="spinner-border spinner-border-sm me-2"></span>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, NotificationService, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.groupedObjectives = []; // Array of Controls with a 'subs' property
        ctrl.isLoading = false;

        // Modal State
        ctrl.modalData = {};
        ctrl.isEditing = false;
        ctrl.isSaving = false;
        var modalInstance = null;

        // Search
        ctrl.searchText = '';

        ctrl.refreshData = function () {
            ctrl.isLoading = true;

            ApiService.loadStatuses().then(function () {
                return Promise.all([ApiService.loadEmployees(), ApiService.loadAllControls()]);
            }).then(function () {
                ctrl.processData();
                $timeout(function () {
                    ctrl.isLoading = false;
                    $scope.$apply();
                });
            }).catch(function (err) {
                console.error("Error refreshing data:", err);
                ctrl.isLoading = false;
            });
        };

        ctrl.processData = function () {
            var groups = [];

            if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                ctrl.store.allControls.forEach(function (control) {
                    // Create Group Object
                    var group = {
                        controlId: control.controlId,
                        description: control.description,
                        typeId: control.typeId,
                        typeName: control.typeName,
                        ownerId: control.employeeId,
                        ownerName: control.EmployeeName || (control.employeeId && ctrl.store.employees.find(e => e.id == control.employeeId) ? ctrl.store.employees.find(e => e.id == control.employeeId).employeeName : 'Unassigned'),
                        subs: [],
                        expanded: false // Initial state
                    };

                    // Process Subs
                    if (control.subDescriptions) {
                        try {
                            var rawSubs = [];
                            if (typeof control.subDescriptions === 'string') {
                                if (control.subDescriptions.startsWith('[')) {
                                    rawSubs = JSON.parse(control.subDescriptions);
                                } else {
                                    rawSubs = [{ description: control.subDescriptions }];
                                }
                            } else if (Array.isArray(control.subDescriptions)) {
                                rawSubs = control.subDescriptions;
                            }

                            if (Array.isArray(rawSubs)) {
                                rawSubs.forEach(function (sub, index) {
                                    var ownerName = 'Unassigned';
                                    if (sub.employeeId) {
                                        var emp = ctrl.store.employees.find(e => e.id == sub.employeeId);
                                        if (emp) ownerName = emp.employeeName;
                                    }
                                    var statName = 'Pending';
                                    if (sub.statusId) {
                                        var stat = ctrl.store.statuses.find(s => s.id == sub.statusId);
                                        if (stat) statName = stat.statusName;
                                    }

                                    group.subs.push({
                                        originalIndex: index,
                                        description: sub.description,
                                        employeeId: sub.employeeId,
                                        employeeName: ownerName,
                                        statusId: sub.statusId,
                                        statusName: statName,
                                        progress: sub.progress || 0,
                                        comments: sub.comments || []
                                    });
                                });
                            }
                        } catch (e) { console.error("Parse error", e); }
                    }

                    groups.push(group);
                });
            }
            // Sort by description or type
            ctrl.groupedObjectives = groups;
        };

        ctrl.groupFilter = function (group) {
            if (!ctrl.searchText) return true;
            var search = ctrl.searchText.toLowerCase();

            // Check Control Details
            if (group.description && group.description.toLowerCase().includes(search)) return true;
            if (group.typeName && group.typeName.toLowerCase().includes(search)) return true;

            // Check Sub-Objectives (If a sub matches, show the group)
            var subMatch = group.subs.some(s =>
                (s.description && s.description.toLowerCase().includes(search)) ||
                (s.employeeName && s.employeeName.toLowerCase().includes(search))
            );

            if (subMatch) {
                group.expanded = true; // Auto-expand if searching finds a sub
                return true;
            }

            return false;
        };

        // Modal Logic
        ctrl.openAddModal = function (controlId) {
            var group = ctrl.groupedObjectives.find(g => g.controlId == controlId);
            if (!group) return;

            ctrl.isEditing = false;
            ctrl.modalData = {
                parentControlId: group.controlId,
                parentControlName: group.typeName + ' - ' + group.description,
                description: '',
                employeeId: null,
                statusId: ctrl.store.statuses.length > 0 ? ctrl.store.statuses[0].id : 1,
                progress: 0
            };

            // Use $timeout to ensure DOM is ready before showing modal
            $timeout(function() {
                var modalElement = document.getElementById('subObjectiveModal');
                if (modalElement) {
                    // Dispose of any existing modal instance first
                    if (modalInstance) {
                        try {
                            modalInstance.dispose();
                        } catch (e) {
                            // Ignore disposal errors
                        }
                    }
                    modalInstance = new bootstrap.Modal(modalElement, {
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.show();
                }
            }, 50);
        };

        ctrl.openEditModal = function (sub, group) {
            ctrl.isEditing = true;
            ctrl.modalData = {
                parentControlId: group.controlId,
                parentControlName: group.typeName + ' - ' + group.description,
                originalIndex: sub.originalIndex,
                description: sub.description,
                employeeId: sub.employeeId,
                statusId: sub.statusId,
                progress: sub.progress,
                comments: sub.comments
            };

            // Use $timeout to ensure DOM is ready before showing modal
            $timeout(function() {
                var modalElement = document.getElementById('subObjectiveModal');
                if (modalElement) {
                    // Dispose of any existing modal instance first
                    if (modalInstance) {
                        try {
                            modalInstance.dispose();
                        } catch (e) {
                            // Ignore disposal errors
                        }
                    }
                    modalInstance = new bootstrap.Modal(modalElement, {
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.show();
                }
            }, 50);
        };

        ctrl.saveModal = function () {
            ctrl.isSaving = true;

            // Find valid parent control from STORE (source of truth)
            var parentControl = ctrl.store.allControls.find(c => c.controlId == ctrl.modalData.parentControlId);
            if (!parentControl) {
                NotificationService.error("Parent Control not found.");
                ctrl.isSaving = false;
                return;
            }

            // Get existing subs
            var subs = [];
            if (parentControl.subDescriptions) {
                try {
                    if (typeof parentControl.subDescriptions === 'string') {
                        if (parentControl.subDescriptions.startsWith('[')) {
                            subs = JSON.parse(parentControl.subDescriptions);
                        } else {
                            subs = [{ description: parentControl.subDescriptions }];
                        }
                    } else if (Array.isArray(parentControl.subDescriptions)) {
                        subs = parentControl.subDescriptions;
                    }
                } catch (e) { subs = []; }
            }

            // Create Sub Object
            var subObj = {
                description: ctrl.modalData.description,
                employeeId: ctrl.modalData.employeeId,
                statusId: ctrl.modalData.statusId,
                progress: ctrl.modalData.progress,
                comments: ctrl.modalData.comments || []
            };

            if (ctrl.isEditing) {
                if (subs[ctrl.modalData.originalIndex]) {
                    subs[ctrl.modalData.originalIndex] = subObj;
                }
            } else {
                subs.push(subObj);
            }

            // Prepare Payload
            var newSubDescriptionsJson = JSON.stringify(subs);

            var updatePayload = {
                controlId: parentControl.controlId,
                employeeId: parentControl.employeeId,
                qaEmployeeId: parentControl.qaEmployeeId,
                typeId: parentControl.typeId,
                description: parentControl.description,
                subDescriptions: newSubDescriptionsJson,
                comments: parentControl.comments,
                progress: parentControl.progress,
                statusId: parentControl.statusId,
                releaseId: parentControl.releaseId,
                releaseDate: parentControl.releaseDate
            };

            ApiService.updateControl(parentControl.controlId, updatePayload)
                .then(function (updatedControl) {
                    NotificationService.success(ctrl.isEditing ? "Objective Updated" : "Objective Created");
                    
                    // Close modal first
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    
                    // Store the control ID to expand after refresh
                    var controlIdToExpand = parentControl.controlId;
                    
                    // Force refresh the data and UI
                    return ApiService.loadAllControls().then(function() {
                        return controlIdToExpand;
                    });
                })
                .then(function (controlIdToExpand) {
                    // Process the data after loading
                    ctrl.processData();
                    
                    // Auto-expand the group that was just updated
                    var updatedGroup = ctrl.groupedObjectives.find(g => g.controlId == controlIdToExpand);
                    if (updatedGroup) {
                        updatedGroup.expanded = true;
                    }
                    
                    // Force Angular to update the view
                    $timeout(function () {
                        $scope.$apply();
                    }, 100);
                })
                .catch(function (err) {
                    NotificationService.error("Failed to save: " + (err.data ? err.data.message : "Unknown error"));
                })
                .finally(function () {
                    ctrl.isSaving = false;
                });
        };

        ctrl.deleteSubObjective = function (sub, group) {
            Swal.fire({
                title: 'Delete Objective?',
                text: "This cannot be undone.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Delete'
            }).then((result) => {
                if (result.isConfirmed) {
                    var parentControl = ctrl.store.allControls.find(c => c.controlId == group.controlId);
                    if (!parentControl) return;

                    var subs = [];
                    if (parentControl.subDescriptions) {
                        try {
                            if (typeof parentControl.subDescriptions === 'string') {
                                if (parentControl.subDescriptions.startsWith('[')) {
                                    subs = JSON.parse(parentControl.subDescriptions);
                                }
                            } else if (Array.isArray(parentControl.subDescriptions)) {
                                subs = parentControl.subDescriptions;
                            }
                        } catch (e) { }
                    }

                    if (subs.length > sub.originalIndex) {
                        subs.splice(sub.originalIndex, 1);

                        var updatePayload = {
                            controlId: parentControl.controlId,
                            employeeId: parentControl.employeeId,
                            qaEmployeeId: parentControl.qaEmployeeId,
                            typeId: parentControl.typeId,
                            description: parentControl.description,
                            subDescriptions: JSON.stringify(subs),
                            comments: parentControl.comments,
                            progress: parentControl.progress,
                            statusId: parentControl.statusId,
                            releaseId: parentControl.releaseId,
                            releaseDate: parentControl.releaseDate
                        };

                        ApiService.updateControl(parentControl.controlId, updatePayload)
                            .then(function () {
                                NotificationService.success("Deleted successfully.");
                                ctrl.refreshData();
                            });
                    }
                }
            });
        };

        ctrl.$onInit = function () {
            ctrl.refreshData();
        };
    }
});
