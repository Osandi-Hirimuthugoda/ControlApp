app.component('controlBoard', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.25rem 1.5rem;">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold"><i class="fas fa-list-check me-2"></i>Controls</h6>
                <div class="d-flex align-items-center gap-2">
                    <!-- Add New Control Button -->
                    <button class="btn btn-outline-light btn-sm" ng-if="$ctrl.canEditControl()" ng-click="$ctrl.showAddControlModal = true" title="Add New Control">
                        <i class="fas fa-plus me-1"></i>Add Control
                    </button>
                    <!-- Search -->
                    <div class="input-group input-group-sm" style="width: 250px;">
                        <input type="text" class="form-control" ng-model="$ctrl.searchText" placeholder="Search name/desc...">
                        <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.searchText=''" ng-if="$ctrl.searchText"><i class="fas fa-times"></i></button>
                    </div>
                    <!-- Filter by Type -->
                    <select class="form-select form-select-sm w-auto" ng-model="$ctrl.selectedTypeFilter" 
                            ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes">
                        <option value="">All Types</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Add Control Modal -->
        <div class="modal fade" ng-class="{'show': $ctrl.showAddControlModal}" ng-style="$ctrl.showAddControlModal ? {'display': 'block', 'background': 'rgba(0,0,0,0.5)'} : {}" 
             ng-if="$ctrl.showAddControlModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">
                        <h5 class="modal-title"><i class="fas fa-plus-circle me-2"></i>Add New Control</h5>
                        <button type="button" class="btn-close btn-close-white" ng-click="$ctrl.showAddControlModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Control Type <span class="text-danger">*</span>:</label>
                                <select class="form-select" ng-model="$ctrl.newControl.typeId" required>
                                    <option value="">-- Select Type --</option>
                                    <option ng-repeat="type in $ctrl.store.controlTypes" value="{{type.controlTypeId}}">
                                        {{type.typeName}}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Main Description <span class="text-danger">*</span>:</label>
                                <input type="text" class="form-control" ng-model="$ctrl.newControl.description" placeholder="Enter main description" required>
                                <small class="text-muted">You can assign an employee and add sub descriptions later</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Assign to Employee (Optional):</label>
                                <select class="form-select" ng-model="$ctrl.newControl.employeeId">
                                    <option value="">-- Leave Unassigned --</option>
                                    <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                        {{emp.employeeName}}
                                    </option>
                                </select>
                                <small class="text-muted">You can assign an employee later from the controls board</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" ng-click="$ctrl.showAddControlModal = false">Cancel</button>
                        <button type="button" class="btn btn-success" ng-click="$ctrl.createNewControl()" ng-disabled="$ctrl.isCreatingControl">
                            <span ng-if="!$ctrl.isCreatingControl"><i class="fas fa-check me-1"></i>Create</span>
                            <span ng-if="$ctrl.isCreatingControl"><i class="fas fa-spinner fa-spin me-1"></i>Creating...</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="table-responsive" style="flex: 1; overflow-y: auto;">
                <table class="table table-bordered table-sm mb-0 align-middle">
                    <thead class="sticky-top" style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white;">
                        <tr class="text-center">
                            <th style="width:5%">Type</th>
                            <th style="width:15%">Description</th>
                            <th style="width:10%">Employee</th>
                            <th style="width:25%">Comments</th>
                            <th style="width:8%">Prog %</th> 
                            <th style="width:10%">Status</th>
                            <th style="width:15%">Release</th> 
                            <th style="width:10%" ng-if="$ctrl.showActionColumn()">Action</th>
                        </tr>
                    </thead>
                    <!-- When All Types is selected, show all controls in one flat list -->
                    <tbody ng-if="!$ctrl.selectedTypeFilter">
                        <tr ng-if="$ctrl.getAllControls().length === 0">
                            <td colspan="8" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-2x mb-2"></i><br>
                                No controls found. <span ng-if="$ctrl.canEditControl()">Click "Add Control" to create a new control.</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getAllControls() | orderBy:'-controlId' track by (control.controlId || control.employeeId)">
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            <td>
                                <div ng-if="!control.editing">
                                    <div class="fw-bold mb-1">{{control.description}}</div>
                                    <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0" class="text-muted small" style="font-size: 0.85em; padding-left: 1em;">
                                        <div ng-repeat="subDesc in control._subDescriptionsArray track by $index" class="mb-2 p-2 border rounded" style="background: #f8f9fa;">
                                            <div class="d-flex justify-content-between align-items-start mb-1">
                                                <div class="flex-grow-1">
                                                    <i class="fas fa-minus text-muted me-1"></i>
                                                    <strong>{{subDesc.description}}</strong>
                                                </div>
                                                <div class="text-end ms-2" style="min-width: 80px;">
                                                    <span class="badge bg-primary" ng-if="subDesc.progress !== undefined && subDesc.progress !== null && subDesc.progress >= 0">
                                                        {{subDesc.progress}}%
                                                    </span>
                                                    <span class="badge bg-secondary" ng-if="subDesc.progress === undefined || subDesc.progress === null">
                                                        No Progress
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mt-1" ng-if="subDesc.employeeId">
                                                <small class="text-muted">
                                                    <i class="fas fa-user me-1"></i>{{$ctrl.getEmployeeName(subDesc.employeeId)}}
                                                </small>
                                            </div>
                                            <div class="mt-1" ng-if="!subDesc.employeeId">
                                                <small class="text-danger">
                                                    <i class="fas fa-user-slash me-1"></i>Unassigned
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div ng-if="control.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="control.editDescription" placeholder="Main description">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions:</label>
                                        <div ng-if="control.editSubDescriptionsArray && control.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" class="mb-2 p-2 border rounded">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="Sub description text" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-6">
                                                        <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                                {{emp.employeeName}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <input type="number" min="0" max="100" 
                                                               class="form-control form-control-sm text-center no-spinners" 
                                                               ng-model="subDesc.progress" 
                                                               placeholder="0-100" 
                                                               ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                               onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-2">
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)" title="Remove">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-outline-primary w-100" ng-click="$ctrl.addSubDescriptionToArray(control)" type="button">
                                            <i class="fas fa-plus me-1"></i>Add Sub Description
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td class="text-start">
                                <div ng-if="!control.editing">
                                    <div ng-if="!control.employeeId && $ctrl.canEditControl()" class="mb-2">
                                        <select class="form-select form-select-sm" ng-model="control.assignEmployeeId" ng-change="$ctrl.assignEmployee(control)">
                                            <option value="">-- Assign Employee --</option>
                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                {{emp.employeeName}}
                                            </option>
                                        </select>
                                    </div>
                                    <span ng-init="empName = $ctrl.getEmployeeName(control.employeeId)"
                                          ng-class="{'fw-bold text-danger': empName === 'Unassigned'}">
                                        {{empName || 'Unassigned'}}
                                    </span>
                                </div>
                                <div ng-if="control.editing">
                                    <select class="form-select form-select-sm" ng-model="control.editEmployeeId">
                                        <option value="">-- Unassigned --</option>
                                        <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                            {{emp.employeeName}}
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td ng-if="!control.editing">
                                <div class="mb-1 bg-white border p-1 rounded" style="max-height:80px; overflow-y:auto; font-size:0.8em; white-space:pre-line;">
                                    {{control.comments}}
                                </div>
                                <div class="input-group input-group-sm" ng-if="$ctrl.canAddComment()">
                                    <input type="text" class="form-control" ng-model="control.newProgressComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addComment(control)">
                                    <button class="btn btn-outline-secondary" ng-click="$ctrl.addComment(control)">+</button>
                                </div>
                            </td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editComments" rows="4"></textarea></td>
                            <td class="text-center" ng-if="!control.editing">
                                <div class="progress" style="height: 20px;"><div class="progress-bar" ng-style="{'width': control.progress + '%'}">{{control.progress}}%</div></div>
                            </td>
                            <td ng-if="control.editing">
                                <input type="number" min="0" max="100" 
                                       class="form-control form-control-sm text-center no-spinners" 
                                       ng-model="control.editProgress" 
                                       placeholder="0-100" 
                                       onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                            </td>
                            <td class="text-center" ng-if="!control.editing"><span class="badge bg-info">{{control.statusName}}</span></td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" 
                                        ng-model="control.editStatusId" 
                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                        ng-change="$ctrl.onStatusChange(control)"
                                        ng-init="$ctrl.ensureStatusesLoaded()">
                                    <option value="">- Status -</option>
                                    <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                </select>
                            </td>
                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-items-center gap-1">
                                        <i class="fas fa-calendar-alt text-muted"></i>
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput"
                                               ng-change="$ctrl.onDateInputChange(control, $event)"
                                               placeholder="Select date">
                                    </div>
                                    <div class="fw-bold" ng-if="control.releaseDate" style="font-size: 0.9em;">
                                        <i class="fas fa-calendar-check me-1"></i>{{$ctrl.formatDateWithYear(control.releaseDate)}}
                                    </div>
                                    <div ng-if="!control.releaseDate" class="text-muted small">
                                        <i class="fas fa-calendar-times me-1"></i>No date set
                                    </div>
                                </div>
                            </td>
                            <td class="text-center" ng-if="$ctrl.showActionColumn()">
                                <div ng-if="!control.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-warning me-1" 
                                            ng-click="$ctrl.startEdit(control)" 
                                            title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-danger" 
                                            ng-click="$ctrl.deleteControl(control)" 
                                            ng-disabled="control.deleting" 
                                            title="Delete">
                                        <span ng-if="!control.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="control.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <span ng-if="control.isPlaceholder || (!$ctrl.canEditControl() && !$ctrl.canDeleteControl())" class="text-muted small">
                                        <span ng-if="control.isPlaceholder">-</span>
                                        <span ng-if="!control.isPlaceholder && !$ctrl.canEditControl() && !$ctrl.canDeleteControl()">-</span>
                                    </span>
                                </div>
                                <div ng-if="control.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControl(control)" ng-disabled="control.saving" title="Save">
                                        <span ng-if="!control.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" ng-click="control.editing = false" ng-disabled="control.saving" title="Cancel">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    
                    <!-- When a specific type is selected, show grouped by type with header -->
                    <tbody ng-repeat="type in $ctrl.getFilteredTypes() track by type.controlTypeId" 
                           ng-if="$ctrl.selectedTypeFilter && $ctrl.getControlsByType(type.controlTypeId).length > 0" 
                           style="border-top: 3px solid #6c757d;">
                        <tr style="background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); color: white;">
                            <td colspan="8" class="fw-bold text-center py-2" style="font-size: 1.1em;">
                                <i class="fas fa-tag me-2"></i>{{type.typeName}} Controls
                                <span class="badge" style="background: rgba(255,255,255,0.3); color: white; ms-2;">{{$ctrl.getControlsByType(type.controlTypeId).length}}</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getControlsByType(type.controlTypeId) | orderBy:'-controlId' track by (control.controlId || control.employeeId)">
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            <td>
                                <div ng-if="!control.editing">
                                    <div class="fw-bold mb-1">{{control.description}}</div>
                                    <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0" class="text-muted small" style="font-size: 0.85em; padding-left: 1em;">
                                        <div ng-repeat="subDesc in control._subDescriptionsArray track by $index" class="mb-2 p-2 border rounded" style="background: #f8f9fa;">
                                            <div class="d-flex justify-content-between align-items-start mb-1">
                                                <div class="flex-grow-1">
                                                    <i class="fas fa-minus text-muted me-1"></i>
                                                    <strong>{{subDesc.description}}</strong>
                                                </div>
                                                <div class="text-end ms-2" style="min-width: 80px;">
                                                    <span class="badge bg-primary" ng-if="subDesc.progress !== undefined && subDesc.progress !== null && subDesc.progress >= 0">
                                                        {{subDesc.progress}}%
                                                    </span>
                                                    <span class="badge bg-secondary" ng-if="subDesc.progress === undefined || subDesc.progress === null">
                                                        No Progress
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mt-1" ng-if="subDesc.employeeId">
                                                <small class="text-muted">
                                                    <i class="fas fa-user me-1"></i>{{$ctrl.getEmployeeName(subDesc.employeeId)}}
                                                </small>
                                            </div>
                                            <div class="mt-1" ng-if="!subDesc.employeeId">
                                                <small class="text-danger">
                                                    <i class="fas fa-user-slash me-1"></i>Unassigned
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div ng-if="control.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="control.editDescription" placeholder="Main description">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions:</label>
                                        <div ng-if="control.editSubDescriptionsArray && control.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" class="mb-2 p-2 border rounded">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="Sub description text" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-6">
                                                        <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                                {{emp.employeeName}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <input type="number" min="0" max="100" 
                                                               class="form-control form-control-sm text-center no-spinners" 
                                                               ng-model="subDesc.progress" 
                                                               placeholder="0-100" 
                                                               ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                               onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-2">
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)" title="Remove">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-outline-primary w-100" ng-click="$ctrl.addSubDescriptionToArray(control)" type="button">
                                            <i class="fas fa-plus me-1"></i>Add Sub Description
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td class="text-start">
                                <div ng-if="!control.editing">
                                    <div ng-if="!control.employeeId && $ctrl.canEditControl()" class="mb-2">
                                        <select class="form-select form-select-sm" ng-model="control.assignEmployeeId" ng-change="$ctrl.assignEmployee(control)">
                                            <option value="">-- Assign Employee --</option>
                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                {{emp.employeeName}}
                                            </option>
                                        </select>
                                    </div>
                                    <span ng-init="empName = $ctrl.getEmployeeName(control.employeeId)"
                                          ng-class="{'fw-bold text-danger': empName === 'Unassigned'}">
                                        {{empName || 'Unassigned'}}
                                    </span>
                                </div>
                                <div ng-if="control.editing">
                                    <select class="form-select form-select-sm" ng-model="control.editEmployeeId">
                                        <option value="">-- Unassigned --</option>
                                        <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                            {{emp.employeeName}}
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td ng-if="!control.editing">
                                <div class="mb-1 bg-white border p-1 rounded" style="max-height:80px; overflow-y:auto; font-size:0.8em; white-space:pre-line;">
                                    {{control.comments}}
                                </div>
                                <div class="input-group input-group-sm" ng-if="$ctrl.canAddComment()">
                                    <input type="text" class="form-control" ng-model="control.newProgressComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addComment(control)">
                                    <button class="btn btn-outline-secondary" ng-click="$ctrl.addComment(control)">+</button>
                                </div>
                            </td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editComments" rows="4"></textarea></td>
                            <td class="text-center" ng-if="!control.editing">
                                <div class="progress" style="height: 20px;"><div class="progress-bar" ng-style="{'width': control.progress + '%'}">{{control.progress}}%</div></div>
                            </td>
                            <td ng-if="control.editing">
                                <input type="number" min="0" max="100" 
                                       class="form-control form-control-sm text-center no-spinners" 
                                       ng-model="control.editProgress" 
                                       placeholder="0-100" 
                                       onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                            </td>
                            <td class="text-center" ng-if="!control.editing"><span class="badge bg-info">{{control.statusName}}</span></td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" 
                                        ng-model="control.editStatusId" 
                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                        ng-change="$ctrl.onStatusChange(control)"
                                        ng-init="$ctrl.ensureStatusesLoaded()">
                                    <option value="">- Status -</option>
                                    <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                </select>
                            </td>
                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-items-center gap-1">
                                        <i class="fas fa-calendar-alt text-muted"></i>
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput"
                                               ng-change="$ctrl.onDateInputChange(control, $event)"
                                               placeholder="Select date">
                                    </div>
                                    <div class="fw-bold" ng-if="control.releaseDate" style="font-size: 0.9em;">
                                        <i class="fas fa-calendar-check me-1"></i>{{$ctrl.formatDateWithYear(control.releaseDate)}}
                                    </div>
                                    <div ng-if="!control.releaseDate" class="text-muted small">
                                        <i class="fas fa-calendar-times me-1"></i>No date set
                                    </div>
                                </div>
                            </td>
                            <td class="text-center" ng-if="$ctrl.showActionColumn()">
                                <div ng-if="!control.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-warning me-1" 
                                            ng-click="$ctrl.startEdit(control)" 
                                            title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-danger" 
                                            ng-click="$ctrl.deleteControl(control)" 
                                            ng-disabled="control.deleting" 
                                            title="Delete">
                                        <span ng-if="!control.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="control.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <span ng-if="control.isPlaceholder || (!$ctrl.canEditControl() && !$ctrl.canDeleteControl())" class="text-muted small">
                                        <span ng-if="control.isPlaceholder">-</span>
                                        <span ng-if="!control.isPlaceholder && !$ctrl.canEditControl() && !$ctrl.canDeleteControl()">-</span>
                                    </span>
                                </div>
                                <div ng-if="control.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControl(control)" ng-disabled="control.saving" title="Save">
                                        <span ng-if="!control.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" ng-click="control.editing = false" ng-disabled="control.saving" title="Cancel">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, AuthService, $rootScope, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.selectedTypeFilter = null;
        ctrl.showAddControlModal = false;
        ctrl.newControl = {
            typeId: null,
            description: '',
            employeeId: null
        };
        ctrl.isCreatingControl = false;
        
        ctrl.isAdmin = function() {
            try {
                var isAdmin = AuthService.isAdmin();
                return isAdmin === true;
            } catch(e) {
                console.error('Error checking admin status:', e);
                return false;
            }
        };
        
        ctrl.canEditControl = function() {
            return AuthService.canEditControl();
        };
        
        ctrl.canDeleteControl = function() {
            return AuthService.canDeleteControl();
        };

        // Only Admin, Team Lead, Software Architecture can add progress comments
        ctrl.canAddComment = function() {
            return AuthService.canMarkProgress();
        };

        // Show/hide Action column (hide for view-only roles like Developers / QA Engineers / Interns)
        ctrl.showActionColumn = function() {
            try {
                // View-only roles should not see the Action column
                return !AuthService.isViewOnly();
            } catch (e) {
                console.error('Error determining if Action column should be shown:', e);
                return true;
            }
        };
        
        // Store admin status for better performance
        ctrl._isAdmin = null;

        // Initialize Data
        ApiService.init().then(function() {
            // Ensure employees are loaded first
            return ApiService.loadEmployees();
        }).then(function() {
            // Then load controls
            return ApiService.loadAllControls();
        }).then(function() {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            // Ensure models are Date objects initially
            ctrl.ensureDateObjects();
            
            console.log('Controls board initialized. Total controls:', ctrl.store.allControls ? ctrl.store.allControls.length : 0);
            
            // Force view update (only if not already in digest cycle)
            if (!$scope.$$phase && !$rootScope.$$phase) {
                $scope.$apply();
            }
        }).catch(function(error) {
            console.error('Error initializing controls board:', error);
            NotificationService.show('Error loading controls data', 'error');
        });
        
        // Listen for control types updates to refresh controls
        var controlTypesUpdateListener = $rootScope.$on('controlTypesUpdated', function() {
            // Reload controls when control types are updated
            ApiService.loadAllControls().then(function() {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });
        
        // Listen for controls updates to refresh controls board
        var controlsUpdateListener = $rootScope.$on('controlsUpdated', function() {
            // Reload controls when controls are updated from other components
            ApiService.loadAllControls().then(function() {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });
        
        // Listen for employees updates to refresh controls
        var employeesUpdateListener = $rootScope.$on('employeesUpdated', function() {
            // Reload employees first, then controls, so new employees appear in controls board
            ApiService.loadEmployees().then(function() {
                return ApiService.loadAllControls();
            }).then(function() {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });
        
        // Store listeners for cleanup
        ctrl.controlTypesUpdateListener = controlTypesUpdateListener;
        ctrl.controlsUpdateListener = controlsUpdateListener;
        ctrl.employeesUpdateListener = employeesUpdateListener;
        
        // Cleanup listeners on destroy
        ctrl.$onDestroy = function() {
            if(ctrl.controlTypesUpdateListener) {
                ctrl.controlTypesUpdateListener();
            }
            if(ctrl.controlsUpdateListener) {
                ctrl.controlsUpdateListener();
            }
            if(ctrl.employeesUpdateListener) {
                ctrl.employeesUpdateListener();
            }
        };

        // Ensure all input models are properly formatted for date inputs
        ctrl.ensureDateObjects = function() {
            if(!ctrl.store || !ctrl.store.allControls) {
                console.warn('Store or allControls not initialized in ensureDateObjects');
                return;
            }
            ctrl.store.allControls.forEach(function(c) {
                    // Ensure progress is always a number, not a string
                    if (c.progress !== undefined && c.progress !== null) {
                        var progressNum = parseInt(c.progress);
                        if (!isNaN(progressNum)) {
                            c.progress = progressNum;
                        } else {
                            c.progress = 0;
                        }
                    } else {
                        c.progress = 0;
                    }
                    
                    // Cache sub descriptions array to avoid infinite digest loops
                    if (c.subDescriptions) {
                        c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
                    } else {
                        c._subDescriptionsArray = [];
                    }
                    
                    // Check multiple sources for release date
                    var releaseDateSource = null;
                    
                    if(c.releaseDate) {
                        releaseDateSource = c.releaseDate;
                    } else if(c.release && c.release.releaseDate) {
                        releaseDateSource = c.release.releaseDate;
                    } else if(c.releaseId && ctrl.store.releases && ctrl.store.releases.length > 0) {
                        // Try to find release by ID and use its date
                        var release = ctrl.store.releases.find(function(r) {
                            return r.releaseId === c.releaseId;
                        });
                        if(release && release.releaseDate) {
                            releaseDateSource = release.releaseDate;
                        }
                    }
                    
                    if(releaseDateSource) {
                        // Always convert to Date object using new Date()
                        c.releaseDate = new Date(releaseDateSource);
                        // Ensure releaseDateInput is a Date object
                        c.releaseDateInput = new Date(c.releaseDate);
                        // Set formatted string for ng-model binding (YYYY-MM-DD format)
                        c.releaseDateInputFormatted = ctrl.formatDateForInput(c.releaseDate);
                    } else {
                        c.releaseDate = null;
                        c.releaseDateInput = null;
                        c.releaseDateInputFormatted = '';
                    }
                });
        };

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            return day + '.' + month;
        };
        
        // Format date with year and month for display (DD.MM.YYYY)
        ctrl.formatDateWithYear = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return day + '.' + month + '.' + year;
        };
        
        // Format date for HTML date input (YYYY-MM-DD)
        ctrl.formatDateForInput = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + d.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        };
        
        // Handle date input change event
        ctrl.onDateInputChange = function(control, event) {
            // The ng-model binding already updated control.releaseDateInput (Date object)
            // Update the formatted string and trigger the update
            if (control.releaseDateInput) {
                control.releaseDateInputFormatted = ctrl.formatDateForInput(control.releaseDateInput);
            } else {
                control.releaseDateInputFormatted = '';
            }
            ctrl.updateReleaseDate(control);
        };
        
        // Parse date from HTML date input string
        ctrl.parseDateFromInput = function(dateString) {
            if(!dateString) return null;
            return new Date(dateString);
        };

        // REMOVED: getDateInputValue function (It was causing the String vs Date error)

        ctrl.updateReleaseDate = function(control) {
            if (!control.releaseDateInput) {
                control.releaseDate = null;
                control.releaseDateInput = null;
                control.releaseDateInputFormatted = '';
                ctrl.saveReleaseDateOnly(control, null);
                return;
            }

            // releaseDateInput is already a Date object from ng-model
            var selectedDate = new Date(control.releaseDateInput);
            
            // Validate date
            if (isNaN(selectedDate.getTime())) {
                NotificationService.show('Invalid date selected', 'error');
                // Revert to previous date
                if (control.releaseDate) {
                    control.releaseDateInput = new Date(control.releaseDate);
                    control.releaseDateInputFormatted = ctrl.formatDateForInput(control.releaseDate);
                } else {
                    control.releaseDateInput = null;
                    control.releaseDateInputFormatted = '';
                }
                return;
            }
            
            selectedDate.setHours(0, 0, 0, 0);
            
            // Update the control object immediately for display in release column
            control.releaseDate = new Date(selectedDate);
            control.releaseDateInput = new Date(selectedDate);
            control.releaseDateInputFormatted = ctrl.formatDateForInput(selectedDate);

            var releaseDateISO = selectedDate.toISOString();
            ctrl.saveReleaseDateOnly(control, releaseDateISO);
        };

        ctrl.saveReleaseDateOnly = function(control, releaseDate) {
            var releaseId = null;
            var needsReleaseCreation = false;
            var releaseDataToCreate = null;

            if (releaseDate) {
                var selectedDate = new Date(releaseDate);
                selectedDate.setHours(0, 0, 0, 0);

                var matchingRelease = ctrl.store.releases.find(function(r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });

                if (matchingRelease) {
                    releaseId = matchingRelease.releaseId;
                } else {
                    var matchingUpcomingRelease = ctrl.store.upcomingReleases.find(function(r) {
                        var rDate = new Date(r.releaseDate);
                        rDate.setHours(0, 0, 0, 0);
                        return rDate.getTime() === selectedDate.getTime();
                    });

                    if (matchingUpcomingRelease) {
                        var isDefaultRelease = matchingUpcomingRelease.releaseId >= 999900;
                        if (isDefaultRelease) {
                            var day = ('0' + selectedDate.getDate()).slice(-2);
                            var month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
                            var releaseName = 'Release ' + day + '.' + month;

                            releaseDataToCreate = {
                                releaseName: releaseName,
                                releaseDate: releaseDate,
                                description: null
                            };
                            needsReleaseCreation = true;
                        }
                    }
                }
            }

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description || null,
                subDescriptions: control.subDescriptions || null,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: control.statusId || null,
                releaseId: releaseId,
                releaseDate: releaseDate
            };

            var saveControlWithPayload = function(finalReleaseId, finalReleaseDate) {
                payload.releaseId = finalReleaseId;
                payload.releaseDate = finalReleaseDate;

                // FIX: Service now returns formatted object directly. No need for .data
                return ApiService.updateControl(control.controlId, payload).then(function(updatedControl) {
                    
                    // Update the control object immediately with the returned data
                    // Always convert to Date object using new Date()
                    if (updatedControl.releaseDate) {
                        control.releaseDate = new Date(updatedControl.releaseDate);
                        control.releaseDateInput = new Date(control.releaseDate);
                        control.releaseDateInputFormatted = ctrl.formatDateForInput(control.releaseDate);
                    } else {
                        control.releaseDate = null;
                        control.releaseDateInput = null;
                        control.releaseDateInputFormatted = '';
                    }

                    // Reload releases first to get latest release data
                    return ApiService.loadReleases().then(function() {
                        // Then reload controls
                        return ApiService.loadAllControls().then(function() {
                            // After reload, find this specific control and ensure date is properly set
                            var reloadedControl = ctrl.store.allControls.find(function(c) {
                                return c.controlId === control.controlId;
                            });
                            if (reloadedControl) {
                                if (updatedControl && updatedControl.releaseDate) {
                                    var reloadedDate = new Date(updatedControl.releaseDate);
                                    reloadedDate.setHours(0, 0, 0, 0);
                                    reloadedControl.releaseDate = new Date(reloadedDate);
                                    reloadedControl.releaseDateInput = new Date(reloadedDate);
                                    reloadedControl.releaseDateInputFormatted = ctrl.formatDateForInput(reloadedDate);
                                    // Also update the original control object for immediate display
                                    control.releaseDate = new Date(reloadedDate);
                                    control.releaseDateInput = new Date(reloadedDate);
                                    control.releaseDateInputFormatted = ctrl.formatDateForInput(reloadedDate);
                                } else {
                                    reloadedControl.releaseDate = null;
                                    reloadedControl.releaseDateInput = null;
                                    reloadedControl.releaseDateInputFormatted = '';
                                    control.releaseDate = null;
                                    control.releaseDateInput = null;
                                    control.releaseDateInputFormatted = '';
                                }
                            }
                            
                            // Ensure all date objects are properly set
                            ctrl.ensureDateObjects();
                            
                            // Force Angular to update the view
                            if (!$scope.$$phase && !$rootScope.$$phase) {
                                $scope.$apply();
                            }
                            
                            // Broadcast update events to sync all components
                            $rootScope.$broadcast('controlsUpdated');
                            $rootScope.$broadcast('controlTypesUpdated'); // Also update control types list
                            
                            NotificationService.show('Release date updated successfully', 'success');
                        });
                    });
                }).catch(function(error) {
                    console.error('Error updating release date:', error);
                    var errorMsg = 'Error updating release date';
                    if(error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                    }
                    NotificationService.show(errorMsg, 'error');
                    // Revert on error
                    if (control.releaseDate) {
                        control.releaseDateInput = new Date(control.releaseDate);
                        control.releaseDateInputFormatted = ctrl.formatDateForInput(control.releaseDate);
                    } else {
                        control.releaseDateInput = null;
                        control.releaseDateInputFormatted = '';
                    }
                });
            };

            if(needsReleaseCreation && releaseDataToCreate) {
                ApiService.addRelease(releaseDataToCreate).then(function(createdRelease) {
                    saveControlWithPayload(createdRelease.releaseId, releaseDate);
                }).catch(function(error) {
                    console.error('Error creating release:', error);
                    saveControlWithPayload(null, releaseDate);
                });
            } else {
                saveControlWithPayload(releaseId, releaseDate);
            }
        };

        ctrl.getAllControls = function() {
            if(!ctrl.store) {
                console.warn('Store not initialized');
                return [];
            }
            if(!ctrl.store.allControls) {
                console.warn('allControls not initialized');
                ctrl.store.allControls = [];
            }
            if(!ctrl.store.employees) {
                ctrl.store.employees = [];
            }
            
            // For \"All Types\" view we want, for each employee, one row per TYPE,
            // but not multiple rows for the same (employee, type) pair.
            // Also avoid true duplicates by controlId.
            var controlIdSet = new Set();        // dedupe by controlId
            var employeeTypeMap = new Map();     // key: employeeId|typeId -> control
            
            ctrl.store.allControls.forEach(function(c) {
                // Skip controls without a valid controlId (not assigned)
                // But allow controls without employeeId to show (they can be assigned later)
                if(!c.controlId) return;
                
                // Deduplicate by controlId first (safety)
                var controlIdKey = String(c.controlId);
                if(controlIdSet.has(controlIdKey)) return;
                controlIdSet.add(controlIdKey);
                
                // Safeguard: If input model is string (from older cache/state), convert to Date
                if(c.releaseDate && typeof c.releaseDateInput === 'string') {
                    c.releaseDateInput = new Date(c.releaseDate);
                }
                // Ensure formatted date is set for ng-model binding
                if(c.releaseDate && !c.releaseDateInputFormatted) {
                    c.releaseDateInputFormatted = ctrl.formatDateForInput(c.releaseDate);
                } else if(!c.releaseDate) {
                    c.releaseDateInputFormatted = '';
                }
                
                // Apply search filter if provided
                if(ctrl.searchText) {
                    var term = ctrl.searchText.toLowerCase();
                    var descMatch = c.description && c.description.toLowerCase().includes(term);
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    var empMatch = emp && emp.employeeName && emp.employeeName.toLowerCase().includes(term);
                    if(!(descMatch || empMatch)) {
                        return;
                    }
                }
                
                // Key per (employee, type) so the same type for same employee appears only once
                // Use 'null' for employeeId if it doesn't exist
                var empId = c.employeeId || 'null';
                var empTypeKey = String(empId) + '|' + String(c.typeId);
                if(!employeeTypeMap.has(empTypeKey)) {
                    employeeTypeMap.set(empTypeKey, c);
                } else {
                    // If we already have a control for this (employee, type),
                    // keep the one with higher controlId (more recent)
                    var existing = employeeTypeMap.get(empTypeKey);
                    if(c.controlId != null && existing.controlId != null && c.controlId > existing.controlId) {
                        employeeTypeMap.set(empTypeKey, c);
                    }
                }
            });
            
            // Return one control per (employee, type) pair
            return Array.from(employeeTypeMap.values());
        };

        ctrl.getFilteredTypes = function() {
            if(!ctrl.store) return [];
            if(!ctrl.store.controlTypes || !ctrl.store.allControls) return [];
            
            if(ctrl.selectedTypeFilter) {
                return ctrl.store.controlTypes.filter(function(t) {
                    return t.controlTypeId == ctrl.selectedTypeFilter;
                });
            }
            
            var seenTypeIds = {};
            var typeIdsWithControls = [];
            
            ctrl.store.allControls.forEach(function(control) {
                if(control.typeId && !seenTypeIds[control.typeId]) {
                    var type = ctrl.store.controlTypes.find(t => t.controlTypeId == control.typeId);
                    if(type) {
                        seenTypeIds[control.typeId] = true;
                        typeIdsWithControls.push(control.typeId);
                    }
                }
            });
            
            var typesWithControls = [];
            typeIdsWithControls.forEach(function(typeId) {
                var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
                if(type) typesWithControls.push(type);
            });
            
            typesWithControls.sort(function(a, b) {
                return (a.typeName || '').localeCompare(b.typeName || '');
            });
            
            return typesWithControls;
        };

        ctrl.getControlsByType = function(typeId) {
            if(!ctrl.store) {
                console.warn('Store not initialized in getControlsByType');
                return [];
            }
            if(!ctrl.store.allControls) {
                console.warn('allControls not initialized in getControlsByType');
                ctrl.store.allControls = [];
            }
            if(!ctrl.store.employees) {
                ctrl.store.employees = [];
            }
            
            // We want to show ALL controls for this type (not just one per employee)
            // but still avoid true duplicates by controlId.
            var controlIdSet = new Set(); // Track unique controlIds to prevent duplicates
            var result = [];
            
            ctrl.store.allControls.forEach(function(c) {
                // Skip controls without a valid controlId (not assigned)
                // But allow controls without employeeId to show
                if(!c.controlId) return;
                
                // Filter by typeId - must match the type we're looking for
                if(c.typeId != typeId) return;
                
                // Deduplicate by controlId only (no grouping by employee)
                var controlIdKey = String(c.controlId);
                if(controlIdSet.has(controlIdKey)) return;
                controlIdSet.add(controlIdKey);
                
                // Ensure formatted date is set for ng-model binding
                if(c.releaseDate && !c.releaseDateInputFormatted) {
                    c.releaseDateInputFormatted = ctrl.formatDateForInput(c.releaseDate);
                } else if(!c.releaseDate) {
                    c.releaseDateInputFormatted = '';
                }
                
                // Apply search filter if search text is provided
                if(ctrl.searchText) {
                    var term = ctrl.searchText.toLowerCase();
                    var descMatch = c.description && c.description.toLowerCase().includes(term);
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    var empMatch = emp && emp.employeeName && emp.employeeName.toLowerCase().includes(term);
                    if(!(descMatch || empMatch)) {
                        return;
                    }
                }
                
                result.push(c);
            });
            
            return result;
        };

        ctrl.getEmployeeName = function(employeeId) {
            var emp = ctrl.store.employees.find(e => e.id == employeeId);
            return emp ? emp.employeeName : '';
        };

        // Get registered employees (those with User accounts)
        ctrl.getRegisteredEmployees = function() {
            if (!ctrl.store.employees) return [];
            return ctrl.store.employees.filter(function(emp) {
                return emp.userId !== null && emp.userId !== undefined;
            });
        };

        // Format employee option for dropdown display
        ctrl.formatEmployeeOption = function(employee) {
            if (!employee) return '';
            var role = '';
            if (employee.user && employee.user.role) {
                role = ' (' + employee.user.role + ')';
            }
            return employee.employeeName + role;
        };

        ctrl.ensureStatusesLoaded = function() {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
        };

        ctrl.startEdit = function(c) {
            // Don't allow editing placeholder controls (employees without controls)
            if(c.isPlaceholder || !c.controlId) {
                NotificationService.show('Cannot edit: No control assigned to this employee yet', 'error');
                return;
            }
            
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            
            c.editing = true;
            // Allow editing description and sub descriptions from controls board
            c.editDescription = c.description || '';
            // Initialize editSubDescriptionsArray as array of objects
            if (c.subDescriptions) {
                c.editSubDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
            } else {
                c.editSubDescriptionsArray = [];
            }
            // Keep editSubDescriptions as string for compatibility
            c.editSubDescriptions = JSON.stringify(c.editSubDescriptionsArray);
            c.editComments = c.comments;
            c.editStatusId = c.statusId;
            c.editProgress = c.progress || 0;
            c.editEmployeeId = c.employeeId || null;
            
            // Fix: Initialize models as Date Objects
            c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
            c.releaseDateInputFormatted = c.releaseDate ? ctrl.formatDateForInput(c.releaseDate) : '';
            c.editReleaseDate = c.releaseDate ? new Date(c.releaseDate) : null;
        };

        // Create new control with main description
        ctrl.createNewControl = function() {
            if (!ctrl.newControl.typeId || !ctrl.newControl.description) {
                NotificationService.show('Type and Main Description are required', 'error');
                return;
            }

            ctrl.isCreatingControl = true;
            
            var payload = {
                typeId: parseInt(ctrl.newControl.typeId),
                description: ctrl.newControl.description.trim(),
                employeeId: ctrl.newControl.employeeId ? parseInt(ctrl.newControl.employeeId) : null,
                progress: 0,
                comments: ''
            };

            ApiService.addControl(payload).then(function(createdControl) {
                NotificationService.show('Control created successfully', 'success');
                ctrl.showAddControlModal = false;
                ctrl.newControl = {
                    typeId: null,
                    description: '',
                    employeeId: null
                };
                // Reload controls to show the new one
                return ApiService.loadAllControls();
            }).then(function() {
                $rootScope.$broadcast('controlsUpdated');
                // Force view update
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            }).catch(function(error) {
                console.error('Error creating control:', error);
                var errorMsg = 'Error creating control';
                if(error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() {
                ctrl.isCreatingControl = false;
            });
        };

        // Assign employee to an unassigned control
        ctrl.assignEmployee = function(control) {
            if (!control.assignEmployeeId) {
                return;
            }

            var employeeId = parseInt(control.assignEmployeeId);
            if (isNaN(employeeId) || employeeId <= 0) {
                NotificationService.show('Invalid employee selection', 'error');
                return;
            }

            // Update the control with the new employee assignment
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: employeeId,
                typeId: control.typeId,
                description: control.description || null,
                subDescriptions: control.subDescriptions || null,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: control.statusId || null,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function(updatedControl) {
                control.employeeId = updatedControl.employeeId;
                control.assignEmployeeId = null;
                NotificationService.show('Employee assigned successfully', 'success');
                // Reload controls to refresh the view
                return ApiService.loadAllControls();
            }).then(function() {
                $rootScope.$broadcast('controlsUpdated');
                // Force view update
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            }).catch(function(error) {
                console.error('Error assigning employee:', error);
                control.assignEmployeeId = null;
                var errorMsg = 'Error assigning employee';
                if(error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            });
        };

        // Parse sub descriptions - supports both JSON format (with employee/progress) and plain text format
        ctrl.getSubDescriptionsWithDetails = function(subDescriptionsStr) {
            if (!subDescriptionsStr) return [];
            
            try {
                // Try to parse as JSON array
                var parsed = JSON.parse(subDescriptionsStr);
                if (Array.isArray(parsed)) {
                    // Validate and ensure all fields exist
                    return parsed.map(function(item) {
                        if (typeof item === 'string') {
                            // Legacy format: plain string
                            return {
                                description: item,
                                employeeId: null,
                                progress: null
                            };
                        }
                        return {
                            description: item.description || '',
                            employeeId: item.employeeId || null,
                            progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null
                        };
                    }).filter(function(item) { return item.description && item.description.trim().length > 0; });
                }
            } catch (e) {
                // Not JSON, treat as plain text (backward compatibility)
                var lines = subDescriptionsStr.split(/\r?\n|,/).map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                return lines.map(function(desc) {
                    return {
                        description: desc,
                        employeeId: null,
                        progress: null
                    };
                });
            }
            return [];
        };

        // Update editSubDescriptions string from array
        ctrl.updateEditSubDescriptions = function(control) {
            if (control.editSubDescriptionsArray) {
                // Filter out empty descriptions
                var validSubDescs = control.editSubDescriptionsArray.filter(function(item) {
                    return item && item.description && item.description.trim().length > 0;
                });
                control.editSubDescriptions = JSON.stringify(validSubDescs);
            }
        };

        // Add a new sub description to array
        ctrl.addSubDescriptionToArray = function(control) {
            if (!control.editSubDescriptionsArray) {
                control.editSubDescriptionsArray = [];
            }
            control.editSubDescriptionsArray.push({
                description: '',
                employeeId: null,
                progress: null
            });
            ctrl.updateEditSubDescriptions(control);
        };

        // Remove a sub description from array by index
        ctrl.removeSubDescriptionFromArray = function(control, index) {
            if (control.editSubDescriptionsArray && index >= 0 && index < control.editSubDescriptionsArray.length) {
                control.editSubDescriptionsArray.splice(index, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };

        // Format sub descriptions from string to edit format (backward compatibility)
        ctrl.formatSubDescriptionsForEdit = function(subDescriptionsStr) {
            if (!subDescriptionsStr) return '[]';
            var subDescs = ctrl.getSubDescriptionsWithDetails(subDescriptionsStr);
            return JSON.stringify(subDescs);
        };

        ctrl.onStatusChange = function(control) {
            if (!control.editStatusId) return;
            var selectedStatus = ctrl.store.statuses.find(function(s) {
                return s.id == control.editStatusId;
            });
            if (selectedStatus) {
                var progressMap = { 'Analyze': 25, 'Development': 50, 'Dev Testing': 75, 'QA': 100 };
                var newProgress = progressMap[selectedStatus.statusName];
                if (newProgress !== undefined) {
                    control.editProgress = newProgress;
                }
            }
        };

        ctrl.saveControl = function(c) {
            var progressValue = parseInt(c.editProgress);
            if (isNaN(progressValue)) {
                NotificationService.show('Invalid progress value.', 'error');
                return;
            }
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;
            
            var statusId = c.editStatusId ? parseInt(c.editStatusId) : null;
            var releaseId = null;
            var releaseDateISO = null;
            var needsReleaseCreation = false;
            var releaseDataToCreate = null;
            
            
            var dateToUse = c.editReleaseDate || c.releaseDateInput;
            
            
            if (dateToUse && typeof dateToUse === 'string') {
                dateToUse = new Date(dateToUse);
            }

            if (dateToUse) {
                var selectedDate = new Date(dateToUse);
                selectedDate.setHours(0, 0, 0, 0);
                releaseDateISO = selectedDate.toISOString();
                
                var matchingRelease = ctrl.store.releases.find(function(r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });
                
                if (matchingRelease) {
                    releaseId = matchingRelease.releaseId;
                } else {
                    var matchingUpcomingRelease = ctrl.store.upcomingReleases.find(function(r) {
                        var rDate = new Date(r.releaseDate);
                        rDate.setHours(0, 0, 0, 0);
                        return rDate.getTime() === selectedDate.getTime();
                    });
                    
                    if (matchingUpcomingRelease) {
                        var isDefaultRelease = matchingUpcomingRelease.releaseId >= 999900;
                        if (isDefaultRelease) {
                            var day = ('0' + selectedDate.getDate()).slice(-2);
                            var month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
                            var releaseName = 'Release ' + day + '.' + month;
                            
                            releaseDataToCreate = {
                                releaseName: releaseName,
                                releaseDate: releaseDateISO,
                                description: null
                            };
                            needsReleaseCreation = true;
                        }
                    }
                }
            }
            
            var typeId = c.typeId ? parseInt(c.typeId) : null;
            // Allow assigning/changing employee from controls board
            var employeeId = c.editEmployeeId ? parseInt(c.editEmployeeId) : (c.employeeId ? parseInt(c.employeeId) : null);
            if(!typeId) {
                NotificationService.show('Type ID is required', 'error');
                return;
            }

            c.saving = true;

            var saveControlWithPayload = function(finalReleaseId, finalReleaseDate) {
                // Process sub descriptions - serialize array to JSON
                var subDescriptionsValue = null;
                if (c.editSubDescriptionsArray && c.editSubDescriptionsArray.length > 0) {
                    // Filter out empty descriptions and ensure proper format
                    var validSubDescs = c.editSubDescriptionsArray.filter(function(item) {
                        return item && item.description && item.description.trim().length > 0;
                    }).map(function(item) {
                        return {
                            description: item.description.trim(),
                            employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                            progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null
                        };
                    });
                    if (validSubDescs.length > 0) {
                        subDescriptionsValue = JSON.stringify(validSubDescs);
                    }
                } else if (c.editSubDescriptions) {
                    // Fallback to string format if array not available
                    try {
                        var parsed = JSON.parse(c.editSubDescriptions);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            subDescriptionsValue = c.editSubDescriptions;
                        }
                    } catch (e) {
                        // Not JSON, skip
                    }
                }
                
                var payload = {
                    controlId: parseInt(c.controlId),
                    employeeId: employeeId,
                    typeId: typeId,
                    description: c.editDescription || null,
                    subDescriptions: subDescriptionsValue,
                    comments: c.editComments || null,
                    progress: progressValue,
                    statusId: statusId,
                    releaseId: finalReleaseId,
                    releaseDate: finalReleaseDate 
                };
                
                return ApiService.updateControl(c.controlId, payload).then(function(updatedControl) {
                    // Update cached sub descriptions array
                    if (updatedControl.subDescriptions) {
                        c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        c.subDescriptions = updatedControl.subDescriptions;
                    } else {
                        c._subDescriptionsArray = [];
                        c.subDescriptions = null;
                    }
                    
                    var oldStatusId = c.statusId;
                    var oldStatusName = c.statusName;
                    var controlIdToUpdate = parseInt(c.controlId);
                    
                    // Get status name from response (most reliable)
                    var newStatusName = updatedControl.statusName || '';
                    
                    // If status name not in response, find it from store
                    if (!newStatusName) {
                        // Ensure statuses are loaded
                        if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                            ApiService.loadStatuses().then(function() {
                                var s = ctrl.store.statuses.find(x => x.id == updatedControl.statusId);
                                if (s) newStatusName = s.statusName;
                                updateControlInStore();
                            });
                        } else {
                            var s = ctrl.store.statuses.find(x => x.id == updatedControl.statusId);
                            newStatusName = s ? s.statusName : '';
                            updateControlInStore();
                        }
                    } else {
                        updateControlInStore();
                    }
                    
                    function updateControlInStore() {
                        // Ensure progress is a number, not a string
                        var progressNum = parseInt(updatedControl.progress) || 0;
                        if (isNaN(progressNum)) progressNum = 0;
                        if (progressNum < 0) progressNum = 0;
                        if (progressNum > 100) progressNum = 100;
                        
                        console.log('Updating control:', controlIdToUpdate, 'New status:', newStatusName, 'New progress:', progressNum);
                        
                        // Update ALL references to this control - both the passed object and store
                        // Update the control object passed to this function
                        c.description = updatedControl.description;
                        c.subDescriptions = updatedControl.subDescriptions;
                        // Update cached sub descriptions array
                        if (updatedControl.subDescriptions) {
                            c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        } else {
                            c._subDescriptionsArray = [];
                        }
                        c.comments = updatedControl.comments;
                        c.progress = progressNum; // Ensure it's a number
                        c.statusId = updatedControl.statusId;
                        c.statusName = newStatusName;
                        c.employeeId = updatedControl.employeeId;
                        c.editEmployeeId = null; // Clear the edit employee ID
                        c.releaseDate = updatedControl.releaseDate ? new Date(updatedControl.releaseDate) : null;
                        c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
                        c.releaseDateInputFormatted = c.releaseDate ? ctrl.formatDateForInput(c.releaseDate) : '';
                        c.editing = false;
                        c.saving = false;
                        // Force change detection
                        c._updated = new Date().getTime();
                        
                        // CRITICAL: Update ALL controls in store with matching controlId
                        // This ensures getAllControls() will return the updated control
                        var updatedCount = 0;
                        if (ctrl.store.allControls) {
                            ctrl.store.allControls.forEach(function(storeControl) {
                                // Compare both as numbers and strings to handle type mismatches
                                var storeControlId = parseInt(storeControl.controlId);
                                if (storeControlId === controlIdToUpdate || storeControl.controlId === controlIdToUpdate) {
                                    console.log('Found matching control in store, updating:', storeControl.controlId, 'Progress:', progressNum);
                                    storeControl.statusId = updatedControl.statusId;
                                    storeControl.statusName = newStatusName;
                                    storeControl.progress = progressNum; // Ensure it's a number
                                    storeControl.description = updatedControl.description;
                                    storeControl.subDescriptions = updatedControl.subDescriptions;
                                    // Update cached sub descriptions array
                                    if (updatedControl.subDescriptions) {
                                        storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                                    } else {
                                        storeControl._subDescriptionsArray = [];
                                    }
                                    storeControl.comments = updatedControl.comments;
                                    storeControl.employeeId = updatedControl.employeeId;
                                    if (updatedControl.releaseDate) {
                                        storeControl.releaseDate = new Date(updatedControl.releaseDate);
                                    }
                                    // Force property change detection
                                    storeControl._updated = new Date().getTime();
                                    updatedCount++;
                                }
                            });
                        }
                        console.log('Updated', updatedCount, 'control(s) in store');
                        
                        // Check if status was auto-advanced
                        var statusChanged = oldStatusId !== updatedControl.statusId;
                        var wasAutoAdvanced = progressValue >= 100 && statusChanged && (!statusId || statusId === oldStatusId);
                        
                        // Build notification message
                        var notificationMsg = 'Saved successfully! Progress: ' + updatedControl.progress + '%';
                        if (wasAutoAdvanced && newStatusName) {
                            notificationMsg += ' - Status auto-advanced to: ' + newStatusName;
                        }
                        
                        // Show notification immediately
                        NotificationService.show(notificationMsg, 'success');
                        
                        // Force Angular digest cycle to update the view IMMEDIATELY
                        // Use $timeout to ensure it runs in the next digest cycle
                        $timeout(function() {
                            // Broadcast event to notify other components
                            $rootScope.$broadcast('controlsUpdated');
                            
                            // Force apply if not already in digest
                            if (!$scope.$$phase && !$rootScope.$$phase) {
                                $scope.$apply();
                            }
                            
                            // Also try to trigger a digest on rootScope
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        }, 10);
                        
                        // Reload data in background to ensure sync
                        ApiService.loadReleases().then(function() {
                            return ApiService.loadAllControls();
                        }).then(function() {
                            // After reload, ensure status is still correct
                            var progressNum = parseInt(updatedControl.progress) || 0;
                            if (isNaN(progressNum)) progressNum = 0;
                            if (progressNum < 0) progressNum = 0;
                            if (progressNum > 100) progressNum = 100;
                            
                            if (ctrl.store.allControls) {
                                ctrl.store.allControls.forEach(function(storeControl) {
                                    if (storeControl.controlId === controlIdToUpdate) {
                                        storeControl.statusId = updatedControl.statusId;
                                        storeControl.statusName = newStatusName;
                                        storeControl.progress = progressNum; // Ensure it's a number
                                        storeControl.description = updatedControl.description;
                                        storeControl.subDescriptions = updatedControl.subDescriptions;
                                        // Update cached sub descriptions array
                                        if (updatedControl.subDescriptions) {
                                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                                        } else {
                                            storeControl._subDescriptionsArray = [];
                                        }
                                        // Force change detection
                                        storeControl._updated = new Date().getTime();
                                    }
                                });
                            }
                            
                            // Update the control object reference
                            c.statusId = updatedControl.statusId;
                            c.statusName = newStatusName;
                            c.progress = progressNum; // Ensure it's a number
                            c.description = updatedControl.description;
                            c.subDescriptions = updatedControl.subDescriptions;
                            // Update cached sub descriptions array
                            if (updatedControl.subDescriptions) {
                                c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                            } else {
                                c._subDescriptionsArray = [];
                            }
                            // Force change detection
                            c._updated = new Date().getTime();
                            
                            // Force view update after reload
                            $timeout(function() {
                                // Broadcast event to notify other components
                                $rootScope.$broadcast('controlsUpdated');
                                if (!$scope.$$phase && !$rootScope.$$phase) {
                                    $scope.$apply();
                                }
                            }, 0);
                        }).catch(function(error) {
                            console.error('Error reloading controls:', error);
                        });
                    }
                }).catch(function(error) {
                    c.saving = false;
                    console.error('Error saving control:', error);
                    var errorMsg = 'Error saving';
                    if(error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                    }
                    NotificationService.show(errorMsg, 'error');
                });
            };

            if(needsReleaseCreation && releaseDataToCreate) {
                ApiService.addRelease(releaseDataToCreate).then(function(createdRelease) {
                    saveControlWithPayload(createdRelease.releaseId, releaseDateISO);
                }).catch(function(error) {
                    console.error('Error creating release:', error);
                    saveControlWithPayload(null, releaseDateISO);
                });
            } else {
                saveControlWithPayload(releaseId, releaseDateISO);
            }
        };

        ctrl.addComment = function(c) {
            if(!c.newProgressComment) return;
            var d = new Date();
            var txt = (d.getMonth()+1)+'/'+d.getDate() + ': ' + c.newProgressComment;
            var newComm = (c.comments ? c.comments + '\n' : '') + txt;
            
            var payload = angular.copy(c);
            payload.comments = newComm;
            delete payload.editing; delete payload.statusName; delete payload.typeName; delete payload.releaseDateInput;

            ApiService.updateControl(c.controlId, payload).then(function(updatedControl) {
                c.comments = updatedControl.comments;
                c.newProgressComment = '';
                NotificationService.show('Comment added', 'success');
            }).catch(function(error) {
                console.error('Error adding comment:', error);
                NotificationService.show('Error adding comment', 'error');
            });
        };

        ctrl.deleteControl = function(control) {
            // Don't allow deleting placeholder controls (employees without controls)
            if(control.isPlaceholder || !control.controlId) {
                NotificationService.show('Cannot delete: No control assigned to this employee', 'error');
                return;
            }
            
            if(!confirm('Are you sure you want to delete this control?')) {
                return;
            }
            
            control.deleting = true;
            ApiService.deleteControl(control.controlId).then(function() {
                var index = ctrl.store.allControls.findIndex(c => c.controlId === control.controlId);
                if(index > -1) {
                    ctrl.store.allControls.splice(index, 1);
                }
                NotificationService.show('Control deleted successfully', 'success');
                // Reload controls to refresh the view
                ApiService.loadAllControls().then(function() {
                    $rootScope.$broadcast('controlsUpdated');
                });
            }).catch(function(error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                NotificationService.show('Error deleting control', 'error');
            });
        };
    }
});