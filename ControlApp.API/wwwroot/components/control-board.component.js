app.component('controlBoard', {
    template: `
    <div class="card shadow-sm control-board-card" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header controls-card-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 0.75rem 1.5rem;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 class="mb-0 fw-bold"><i class="fas fa-list-check me-2"></i>Controls</h6>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <!-- Add New Control Button -->
                    <button class="btn btn-outline-light btn-sm" ng-if="$ctrl.canEditControl()" ng-click="$ctrl.showAddControlModal = true" title="Add New Control">
                        <i class="fas fa-plus me-1"></i>Add Control
                    </button>
                    <!-- Filters Toggle: collapse filters to get more table space, scroll through 10k+ rows -->
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.toggleFilters()" title="{{$ctrl.filtersCollapsed ? 'Show search & filters' : 'Hide filters – more space for table, scroll to view all rows'}}">
                        <i class="fas" ng-class="$ctrl.filtersCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
                        <span class="ms-1">{{$ctrl.filtersCollapsed ? 'Show Filters' : 'Hide Filters'}}</span>
                    </button>
                </div>
            </div>
            <div class="controls-filters-row" ng-show="!$ctrl.filtersCollapsed">
                <div class="d-flex align-items-center gap-2 flex-wrap mt-2 pt-2" style="border-top: 1px solid rgba(255,255,255,0.3);">
                    <!-- Search -->
                    <div class="input-group input-group-sm" style="width: 280px;">
                        <span class="input-group-text bg-white"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" ng-model="$ctrl.searchText" placeholder="Search descriptions...">
                        <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.searchText=''" ng-if="$ctrl.searchText" title="Clear search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <!-- Filter by Type -->
                    <select class="form-select form-select-sm" style="width: 150px;" ng-model="$ctrl.selectedTypeFilter" 
                            ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes"
                            ng-change="$ctrl.selectedEmployeeFilter = null; $ctrl.selectedDescriptionFilter = null;">
                        <option value="">All Types</option>
                    </select>
                    <!-- Filter by Employee -->
                    <select class="form-select form-select-sm" style="width: 180px;" ng-model="$ctrl.selectedEmployeeFilter" 
                            ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                        <option value="">All Employees</option>
                    </select>
                    <!-- Filter by Description -->
                    <select class="form-select form-select-sm description-filter-select" 
                            style="width: 200px;" 
                            ng-model="$ctrl.selectedDescriptionFilter"
                            ng-focus="$ctrl.onDescriptionDropdownFocus()"
                            ng-blur="$ctrl.onDescriptionDropdownBlur()">
                        <option value="">All Descriptions</option>
                        <option ng-repeat="desc in $ctrl.getUniqueDescriptions() track by desc" value="{{desc}}">
                            {{desc.length > 30 ? (desc.substring(0, 30) + '...') : desc}}
                        </option>
                    </select>

                    <!-- Filter by Release Date -->
                    <div class="input-group input-group-sm" style="width: 210px;">
                        <span class="input-group-text bg-white">
                            <i class="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date"
                               class="form-control"
                               ng-model="$ctrl.selectedReleaseDateFilter"
                               placeholder="Filter by release date">
                        <button class="btn btn-outline-light btn-sm"
                                ng-click="$ctrl.clearReleaseDateFilter()"
                                ng-if="$ctrl.selectedReleaseDateFilter"
                                title="Clear release date filter">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
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
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Release Date (Optional):</label>
                                <input type="date" class="form-control" ng-model="$ctrl.newControl.releaseDate">
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
                            <th style="width:70%"></th>
                            <th style="width:5%" ng-if="$ctrl.showActionColumn()">Action</th>
                        </tr>
                    </thead>
                    <!-- When All Types is selected, show all controls in one flat list -->
                    <tbody ng-if="!$ctrl.selectedTypeFilter">
                        <tr ng-if="$ctrl.getAllControls().length === 0">
                            <td colspan="3" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-2x mb-2"></i><br>
                                No controls found. <span ng-if="$ctrl.canEditControl()">Click "Add Control" to create a new control.</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getAllControls() | orderBy:'-controlId' track by (control.controlId || control.employeeId)"
                            class=""
                            style="transition: background-color 0.2s ease;">
                            <td class="text-center"><span class="badge control-type-badge">{{control.typeName}}</span></td>
                            <td>
                                <div ng-if="!control.editing">
                                    <div class="fw-bold mb-1 control-main-description">{{control.description}}</div>
                                    <div class="d-flex gap-3 mb-2">
                                        <div class="text-success fw-bold small" style="font-size: 0.75rem;" ng-if="control.releaseDate">
                                            <i class="fas fa-calendar-check me-1"></i>Release Date: {{$ctrl.formatDate(control.releaseDate)}}
                                        </div>
                                        <div class="text-muted small" style="font-size: 0.7rem;" ng-if="control.updatedAt">
                                            <i class="fas fa-history me-1"></i>Last Updated: {{$ctrl.formatDate(control.updatedAt)}}
                                        </div>
                                    </div>
                                    <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0" style="margin-top: 0.75rem;">
                                        <table class="subdesc-table" 
                                               style="cursor: auto; transition: all 0.2s ease; width: 100%; border-collapse: separate; border-spacing: 0 4px;" ng-click="$event.stopPropagation()"">
                                            <thead>
                                                <tr>
                                                    <th style="width: 20%;">Description</th>
                                                    <th style="width: 15%;">Employee</th>
                                                    <th style="width: 12%;">Status</th>
                                                    <th style="width: 10%;">Progress</th>
                                                    <th style="width: 10%;">Release Date</th>
                                                    <th style="width: 23%; min-width: 200px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; font-weight: 700; padding: 0.75rem;">
                                                        <i class="fas fa-comments me-1"></i>Comments
                                                    </th>
                                                    <th style="width: 110px; min-width: 110px; text-align: center;">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="subDesc in (control._viewSubDescs || control._subDescriptionsArray) track by $index" ng-style="$index % 2 === 0 ? {'background': '#fff7ed', 'border-left': '4px solid #f97316'} : {'background': '#eff6ff', 'border-left': '4px solid #3b82f6'}" style="box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); transition: background-color 0.2s;">
                                                    <td>
                                                        <strong ng-if="!subDesc.editing" style="font-size: 0.95rem;">{{subDesc.description}}</strong>
                                                        <input ng-if="subDesc.editing" type="text" class="form-control form-control-sm" ng-model="subDesc.editModel.description" placeholder="Description">
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <span ng-if="subDesc.employeeId" class="text-primary" style="font-size: 0.9rem;">
                                                                <i class="fas fa-user"></i> {{$ctrl.getEmployeeName(subDesc.employeeId)}}
                                                            </span>  
                                                            <span ng-if="!subDesc.employeeId" class="text-danger" style="font-size: 0.9rem;">
                                                                <i class="fas fa-user-slash"></i> Unassigned
                                                            </span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                             <select class="form-select form-select-sm" 
                                                                    ng-model="subDesc.editModel.employeeId" 
                                                                    ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                                                                <option value="">-- Unassigned --</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <span ng-if="subDesc.statusId" class="badge" 
                                                                  ng-class="{
                                                                      'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                      'bg-primary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'development',
                                                                      'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                      'bg-warning': subDesc.statusName && subDesc.statusName.toLowerCase() === 'qa',
                                                                      'bg-danger': subDesc.statusName && subDesc.statusName.toLowerCase() === 'hld',
                                                                      'bg-orange': subDesc.statusName && subDesc.statusName.toLowerCase() === 'lld'
                                                                  }"
                                                                  style="font-size: 0.85rem; padding: 0.3rem 0.6rem;">
                                                                {{subDesc.statusName || 'N/A'}}
                                                            </span>
                                                            <span ng-if="!subDesc.statusId" class="text-muted" style="font-size: 0.9rem;">-</span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <select class="form-select form-select-sm" 
                                                                    ng-model="subDesc.editModel.statusId">
                                                                <option value="">-- Status --</option>
                                                                <option ng-repeat="s in $ctrl.store.statuses" ng-value="s.id" ng-style="s.statusName.toLowerCase() === 'hld' ? {'background-color': '#dc3545', 'color': 'white'} : (s.statusName.toLowerCase() === 'lld' ? {'background-color': '#fd7e14', 'color': 'white'} : {})">{{s.statusName}}</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <div class="progress" ng-if="subDesc.progress !== undefined && subDesc.progress !== null && subDesc.progress >= 0" style="height: 22px;">
                                                                <div class="progress-bar" role="progressbar" 
                                                                     ng-class="{
                                                                         'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                         'bg-primary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'development',
                                                                         'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                         'bg-warning': subDesc.statusName && subDesc.statusName.toLowerCase() === 'qa',
                                                                         'bg-danger': subDesc.statusName && subDesc.statusName.toLowerCase() === 'hld',
                                                                         'bg-orange': subDesc.statusName && subDesc.statusName.toLowerCase() === 'lld'
                                                                     }"
                                                                     style="width: {{subDesc.progress}}%; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center;"
                                                                     aria-valuenow="{{subDesc.progress}}" 
                                                                     aria-valuemin="0" 
                                                                     aria-valuemax="100">
                                                                    {{subDesc.progress}}%
                                                                </div>
                                                            </div>
                                                            <span ng-if="subDesc.progress === undefined || subDesc.progress === null" class="text-muted" style="font-size: 0.9rem;">-</span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <input type="number" class="form-control form-control-sm" ng-model="subDesc.editModel.progress" min="0" max="100" ng-change="$ctrl.onSubDescInlineProgressChange(subDesc)">
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing" class="d-flex align-items-center">
                                                            <div ng-if="!subDesc._showDatePicker" ng-click="subDesc._showDatePicker = true; $event.stopPropagation()" style="cursor: pointer; color: #059669;" class="fw-bold">
                                                                <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatDate(subDesc.releaseDate) || 'Set Date'}}
                                                            </div>
                                                            <input ng-if="subDesc._showDatePicker" type="date" class="form-control form-control-sm"
                                                                   ng-model="subDesc.releaseDateInputFormatted"
                                                                   ng-change="$ctrl.updateSubDescriptionReleaseQuick(control, subDesc, $index); subDesc._showDatePicker = false;"
                                                                   ng-blur="subDesc._showDatePicker = false"
                                                                   style="width: 140px; font-size: 0.85rem;"
                                                                   ng-click="$event.stopPropagation();">
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <input type="date" class="form-control form-control-sm" 
                                                                   ng-model="subDesc.editModel.releaseDateInputFormatted">
                                                        </div>
                                                    </td>
                                                    <td style="min-width: 350px; max-width: none;">
                                                        <div ng-if="!subDesc.editing">
                                                            <div ng-if="subDesc.comments && subDesc.comments.length > 0" 
                                                                 class="subdesc-comments-list mb-2" 
                                                                 style="max-height: 100px; overflow-y: auto; padding: 0.25rem; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                                                                <div ng-repeat="comment in subDesc.comments track by $index" 
                                                                     class="subdesc-comment-item mb-1" 
                                                                     style="font-size: 0.8rem;">
                                                                    <div class="text-muted" style="font-size: 0.7rem;">
                                                                        <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatCommentDate(comment.date)}}
                                                                    </div>
                                                                    <div class="fw-bold">{{comment.text}}</div>
                                                                </div>
                                                            </div>
                                                            <span ng-if="!subDesc.comments || subDesc.comments.length === 0" 
                                                                  class="text-muted small d-block mb-2">
                                                                <i class="fas fa-comment-slash me-1"></i>No comments
                                                            </span>
                                                            <div class="input-group input-group-sm">
                                                                <input type="text" class="form-control" 
                                                                       ng-model="subDesc.newComment" 
                                                                       placeholder="Add comment..." 
                                                                       ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescriptionQuick(control, $index)">
                                                                <button class="btn btn-primary" 
                                                                        ng-click="$ctrl.addCommentToSubDescriptionQuick(control, $index)"
                                                                        ng-disabled="!subDesc.newComment || subDesc.addingComment">
                                                                    <i class="fas fa-plus" ng-if="!subDesc.addingComment"></i>
                                                                    <i class="fas fa-spinner fa-spin" ng-if="subDesc.addingComment"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <div ng-if="subDesc.editModel.comments && subDesc.editModel.comments.length > 0" class="subdesc-comments-list mb-2" style="max-height: 150px; overflow-y: auto;">
                                                                <div ng-repeat="comment in subDesc.editModel.comments track by $index" class="subdesc-comment-item">
                                                                    <div class="d-flex justify-content-between align-items-start p-1 mb-1 border-bottom">
                                                                        <div class="flex-grow-1">
                                                                            <div class="subdesc-comment-date small">{{$ctrl.formatCommentDate(comment.date)}}</div>
                                                                            <div class="subdesc-comment-text small">{{comment.text}}</div>
                                                                        </div>
                                                                        <button class="btn btn-sm btn-link text-danger p-0" ng-click="subDesc.editModel.comments.splice($index, 1)" title="Remove comment">
                                                                            <i class="fas fa-times"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="input-group input-group-sm">
                                                                <input type="text" class="form-control" ng-model="subDesc.editModel.newCommentText" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescriptionEdit(subDesc)">
                                                                <button class="btn btn-primary" ng-click="$ctrl.addCommentToSubDescriptionEdit(subDesc)">
                                                                    <i class="fas fa-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing && $ctrl.canEditControl() && !control.isPlaceholder" class="d-flex gap-1 flex-nowrap">
                                                            <button class="btn btn-sm btn-outline-primary" 
                                                                    ng-click="$ctrl.startEditSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Edit sub-description">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            <button class="btn btn-sm btn-outline-danger" 
                                                                    ng-click="$ctrl.removeSubDescriptionAt(control, $index); $event.stopPropagation();" 
                                                                    title="Remove sub-description">
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                        <div ng-if="subDesc.editing" class="d-flex gap-1 flex-nowrap justify-content-center">
                                                            <button class="btn btn-sm btn-success" 
                                                                    ng-click="$ctrl.saveSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Save">
                                                                <i class="fas fa-check"></i>
                                                            </button>
                                                            <button class="btn btn-sm btn-secondary" 
                                                                    ng-click="$ctrl.cancelEditSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Cancel">
                                                                <i class="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <span ng-if="!$ctrl.canEditControl() || control.isPlaceholder" class="text-muted">-</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div ng-if="control.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="control.editDescription" placeholder="Main description" ng-click="$event.stopPropagation();">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions:</label>
                                        <div ng-if="control.editSubDescriptionsArray && control.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" 
                                                 class="mb-2 p-2 border rounded"
                                                 ng-style="subDesc.isNew && {'background':'#d1fae5','border-left':'4px solid #059669','border-radius':'8px'}">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="Sub description text" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-6">
                                                        <label class="form-label small fw-bold">Status:</label>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.statusId" 
                                                                ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                                                ng-change="$ctrl.onSubDescStatusChange(control, $index)"
                                                                ng-init="$ctrl.ensureStatusesLoaded()"
                                                                ng-click="$event.stopPropagation();">
                                                            <option value="">-- Select Status --</option>
                                                            <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-6">
                                                        <label class="form-label small fw-bold">Employee:</label>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.employeeId" 
                                                                ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                                ng-click="$event.stopPropagation();"
                                                                ng-if="subDesc.statusId && $ctrl.isSubDescQAStatus(subDesc.statusId)">
                                                            <option value="">-- Select QA Engineer --</option>
                                                            <option ng-repeat="qa in $ctrl.getQAEngineers()" value="{{qa.id}}">
                                                                {{qa.employeeName}}
                                                            </option>
                                                        </select>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.employeeId" 
                                                                ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                                ng-click="$event.stopPropagation();"
                                                                ng-if="!subDesc.statusId || !$ctrl.isSubDescQAStatus(subDesc.statusId)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                                {{emp.employeeName}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <label class="form-label small fw-bold">Progress:</label>
                                                        <input type="number" min="0" max="100" 
                                                               class="form-control form-control-sm text-center no-spinners" 
                                                               ng-model="subDesc.progress" 
                                                               placeholder="0-100" 
                                                               ng-change="$ctrl.onSubDescProgressChange(control, $index)"
                                                               onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-6 mt-2">
                                                        <label class="form-label small fw-bold">Release Date:</label>
                                                        <input type="date" class="form-control form-control-sm" 
                                                               ng-model="subDesc.releaseDateInputFormatted" 
                                                               ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-2 mt-2">
                                                        <label class="form-label small fw-bold">&nbsp;</label>
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)" title="Remove">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="row g-2 mt-2">
                                                    <div class="col-12">
                                                        <label class="form-label small fw-bold">Comments:</label>
                                                        <div ng-if="subDesc.comments && subDesc.comments.length > 0" class="subdesc-comments-list mb-2" style="max-height: 150px; overflow-y: auto;">
                                                            <div ng-repeat="comment in subDesc.comments track by $index" class="subdesc-comment-item">
                                                                <div class="d-flex justify-content-between align-items-start">
                                                                    <div class="flex-grow-1">
                                                                        <div class="subdesc-comment-date">
                                                                            <i class="fas fa-calendar-alt"></i> {{$ctrl.formatCommentDate(comment.date)}}
                                                                        </div>
                                                                        <div class="subdesc-comment-text">{{comment.text}}</div>
                                                                    </div>
                                                                    <button class="btn btn-sm btn-link text-danger subdesc-comment-remove" ng-click="$ctrl.removeCommentFromSubDescription(control, $parent.$index, $index)" title="Remove comment">
                                                                        <i class="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="subdesc-comment-input">
                                                            <input type="text" class="form-control form-control-sm" 
                                                                   ng-model="subDesc.newComment" 
                                                                   placeholder="Add a comment..." 
                                                                   ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescription(control, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" ng-click="$ctrl.addCommentToSubDescription(control, $index)" title="Add comment">
                                                                <i class="fas fa-plus"></i>
                                                            </button>
                                                        </div>
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
                            <td class="text-center" ng-if="$ctrl.showActionColumn()">
                                <div ng-if="!control.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-warning me-1" 
                                            ng-click="$ctrl.startEdit(control); $event.stopPropagation();" 
                                            title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-danger" 
                                            ng-click="$ctrl.deleteControl(control); $event.stopPropagation();" 
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
                                    <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControl(control); $event.stopPropagation();" ng-disabled="control.saving" title="Save">
                                        <span ng-if="!control.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" ng-click="control.editing = false; $event.stopPropagation();" ng-disabled="control.saving" title="Cancel">
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
                            <td colspan="3" class="fw-bold text-center py-2" style="font-size: 1.1em;">
                                <i class="fas fa-tag me-2"></i>{{type.typeName}} Controls
                                <span class="badge" style="background: rgba(255,255,255,0.3); color: white; ms-2;">{{$ctrl.getControlsByType(type.controlTypeId).length}}</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getControlsByType(type.controlTypeId) | orderBy:'-controlId' track by (control.controlId || control.employeeId)"
                            class=""
                            style="transition: background-color 0.2s ease;">
                            <td class="text-center"><span class="badge control-type-badge">{{control.typeName}}</span></td>
                            <td>
                                <div ng-if="!control.editing">
                                    <div class="fw-bold mb-1 control-main-description">{{control.description}}</div>
                                    <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0" style="margin-top: 0.75rem;">
                                        <table class="subdesc-table" 
                                               style="cursor: auto; transition: all 0.2s ease; width: 100%; border-collapse: separate; border-spacing: 0 4px;" ng-click="$event.stopPropagation()"">
                                            <thead>
                                                <tr>
                                                    <th style="width: 20%;">Description</th>
                                                    <th style="width: 15%;">Employee</th>
                                                    <th style="width: 12%;">Status</th>
                                                    <th style="width: 10%;">Progress</th>
                                                    <th style="width: 10%;">Release Date</th>
                                                    <th style="width: 23%; min-width: 200px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; font-weight: 700; padding: 0.75rem;">
                                                        <i class="fas fa-comments me-1"></i>Comments
                                                    </th>
                                                    <th style="width: 110px; min-width: 110px; text-align: center;">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="subDesc in (control._viewSubDescs || control._subDescriptionsArray) track by $index" ng-style="$index % 2 === 0 ? {'background': '#fff7ed', 'border-left': '4px solid #f97316'} : {'background': '#eff6ff', 'border-left': '4px solid #3b82f6'}" style="box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); transition: background-color 0.2s;">
                                                    <td>
                                                        <strong ng-if="!subDesc.editing" style="font-size: 0.95rem;">{{subDesc.description}}</strong>
                                                        <input ng-if="subDesc.editing" type="text" class="form-control form-control-sm" ng-model="subDesc.editModel.description" placeholder="Description">
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <span ng-if="subDesc.employeeId" class="text-primary" style="font-size: 0.9rem;">
                                                                <i class="fas fa-user"></i> {{$ctrl.getEmployeeName(subDesc.employeeId)}}
                                                            </span>
                                                            <span ng-if="!subDesc.employeeId" class="text-danger" style="font-size: 0.9rem;">
                                                                <i class="fas fa-user-slash"></i> Unassigned
                                                            </span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                             <select class="form-select form-select-sm" 
                                                                    ng-model="subDesc.editModel.employeeId" 
                                                                    ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                                                                <option value="">-- Unassigned --</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <span ng-if="subDesc.statusId" class="badge" 
                                                                  ng-class="{
                                                                      'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                      'bg-primary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'development',
                                                                      'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                      'bg-warning': subDesc.statusName && subDesc.statusName.toLowerCase() === 'qa'
                                                                  }"
                                                                  style="font-size: 0.85rem; padding: 0.3rem 0.6rem;">
                                                                {{subDesc.statusName || 'N/A'}}
                                                            </span>
                                                            <span ng-if="!subDesc.statusId" class="text-muted" style="font-size: 0.9rem;">-</span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <select class="form-select form-select-sm" 
                                                                    ng-model="subDesc.editModel.statusId">
                                                                <option value="">-- Status --</option>
                                                                <option ng-repeat="s in $ctrl.store.statuses" ng-value="s.id" ng-style="s.statusName.toLowerCase() === 'hld' ? {'background-color': '#dc3545', 'color': 'white'} : (s.statusName.toLowerCase() === 'lld' ? {'background-color': '#fd7e14', 'color': 'white'} : {})">{{s.statusName}}</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing">
                                                            <div class="progress" ng-if="subDesc.progress !== undefined && subDesc.progress !== null && subDesc.progress >= 0" style="height: 22px;">
                                                                <div class="progress-bar" role="progressbar" 
                                                                     ng-class="{
                                                                         'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                         'bg-primary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'development',
                                                                         'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                         'bg-warning': subDesc.statusName && subDesc.statusName.toLowerCase() === 'qa'
                                                                     }"
                                                                     style="width: {{subDesc.progress}}%; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center;"
                                                                     aria-valuenow="{{subDesc.progress}}" 
                                                                     aria-valuemin="0" 
                                                                     aria-valuemax="100">
                                                                    {{subDesc.progress}}%
                                                                </div>
                                                            </div>
                                                            <span ng-if="subDesc.progress === undefined || subDesc.progress === null" class="text-muted" style="font-size: 0.9rem;">-</span>
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <input type="number" class="form-control form-control-sm" ng-model="subDesc.editModel.progress" min="0" max="100">
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing" class="d-flex align-items-center">
                                                            <div ng-if="!subDesc._showDatePicker" ng-click="subDesc._showDatePicker = true; $event.stopPropagation()" style="cursor: pointer; color: #059669;" class="fw-bold">
                                                                <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatDate(subDesc.releaseDate) || 'Set Date'}}
                                                            </div>
                                                            <input ng-if="subDesc._showDatePicker" type="date" class="form-control form-control-sm"
                                                                   ng-model="subDesc.releaseDateInputFormatted"
                                                                   ng-change="$ctrl.updateSubDescriptionReleaseQuick(control, subDesc, $index); subDesc._showDatePicker = false;"
                                                                   ng-blur="subDesc._showDatePicker = false"
                                                                   style="width: 140px; font-size: 0.85rem;"
                                                                   ng-click="$event.stopPropagation();">
                                                        </div>
                                                        <div ng-if="subDesc.editing">
                                                            <input type="date" class="form-control form-control-sm" 
                                                                   ng-model="subDesc.editModel.releaseDateInputFormatted">
                                                        </div>
                                                    </td>
                                                    <td style="min-width: 350px; max-width: none;">
                                                        <div ng-if="subDesc.comments && subDesc.comments.length > 0" 
                                                             class="subdesc-comments-list" 
                                                             style="max-height: 200px; overflow-y: auto; padding: 0.25rem; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border-radius: 6px; border: 2px solid #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                                                            <div ng-repeat="comment in subDesc.comments track by $index" 
                                                                 class="subdesc-comment-item" 
                                                                 style="padding: 0.3rem 0.5rem; margin-bottom: 0.25rem; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.06);"
                                                                 ng-class="{'qa-comment': comment.text && (comment.text.indexOf('[QA]:') !== -1 || comment.text.indexOf('[QA]') !== -1 || comment.text.toLowerCase().indexOf('[qa]:') !== -1 || comment.text.toLowerCase().indexOf('[qa]') !== -1), 'dev-comment': comment.text && comment.text.indexOf('[QA]:') === -1 && comment.text.indexOf('[QA]') === -1 && comment.text.toLowerCase().indexOf('[qa]:') === -1 && comment.text.toLowerCase().indexOf('[qa]') === -1}"
                                                                 ng-style="comment.text && (comment.text.indexOf('[QA]:') !== -1 || comment.text.indexOf('[QA]') !== -1 || comment.text.toLowerCase().indexOf('[qa]:') !== -1 || comment.text.toLowerCase().indexOf('[qa]') !== -1) ? {
                                                                     'background': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                                     'border-left': '3px solid #f59e0b'
                                                                 } : {
                                                                     'background': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                                                     'border-left': '3px solid #3b82f6'
                                                                 }">
                                                                <div class="subdesc-comment-date" 
                                                                     style="font-size: 0.65rem; font-weight: 600; margin-bottom: 0.05rem; line-height: 1.2;"
                                                                     ng-style="comment.text && (comment.text.indexOf('[QA]:') !== -1 || comment.text.indexOf('[QA]') !== -1 || comment.text.toLowerCase().indexOf('[qa]:') !== -1 || comment.text.toLowerCase().indexOf('[qa]') !== -1) ? {
                                                                         'color': '#92400e',
                                                                         'font-weight': '700'
                                                                     } : {
                                                                         'color': '#1e40af',
                                                                         'font-weight': '700'
                                                                     }">
                                                                    <i class="fas fa-calendar-alt me-1" 
                                                                       ng-style="comment.text && (comment.text.indexOf('[QA]:') !== -1 || comment.text.indexOf('[QA]') !== -1 || comment.text.toLowerCase().indexOf('[qa]:') !== -1 || comment.text.toLowerCase().indexOf('[qa]') !== -1) ? {'color': '#f59e0b'} : {'color': '#3b82f6'}"></i>{{$ctrl.formatCommentDate(comment.date)}}
                                                                </div>
                                                                <div class="subdesc-comment-text" 
                                                                     style="font-size: 0.9rem; line-height: 1.3; word-wrap: break-word; white-space: pre-wrap;"
                                                                     ng-style="comment.text && (comment.text.indexOf('[QA]:') !== -1 || comment.text.indexOf('[QA]') !== -1 || comment.text.toLowerCase().indexOf('[qa]:') !== -1 || comment.text.toLowerCase().indexOf('[qa]') !== -1) ? {
                                                                         'color': '#92400e',
                                                                         'font-weight': '600',
                                                                         'font-size': '0.95rem'
                                                                     } : {
                                                                         'color': '#1e3a8a',
                                                                         'font-weight': '600',
                                                                         'font-size': '0.95rem'
                                                                     }">
                                                                    {{comment.text}}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span ng-if="!subDesc.comments || subDesc.comments.length === 0" 
                                                              class="text-muted small d-block text-center py-3" 
                                                              style="font-size: 0.85rem; padding: 0.75rem; background: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db;">
                                                            <i class="fas fa-comment-slash me-1"></i>No comments
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div ng-if="!subDesc.editing && $ctrl.canEditControl() && !control.isPlaceholder" class="d-flex gap-1 flex-nowrap">
                                                            <button class="btn btn-sm btn-outline-primary" 
                                                                    ng-click="$ctrl.startEditSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Edit sub-description">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            <button class="btn btn-sm btn-outline-danger" 
                                                                    ng-click="$ctrl.removeSubDescriptionAt(control, $index); $event.stopPropagation();" 
                                                                    title="Remove sub-description">
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                        <div ng-if="subDesc.editing" class="d-flex gap-1 flex-nowrap justify-content-center">
                                                            <button class="btn btn-sm btn-success" 
                                                                    ng-click="$ctrl.saveSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Save">
                                                                <i class="fas fa-check"></i>
                                                            </button>
                                                            <button class="btn btn-sm btn-secondary" 
                                                                    ng-click="$ctrl.cancelEditSubDescription(control, $index); $event.stopPropagation();" 
                                                                    title="Cancel">
                                                                <i class="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <span ng-if="!$ctrl.canEditControl() || control.isPlaceholder" class="text-muted">-</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div ng-if="control.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="control.editDescription" placeholder="Main description" ng-click="$event.stopPropagation();">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions:</label>
                                        <div ng-if="control.editSubDescriptionsArray && control.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" 
                                                 class="mb-2 p-2 border rounded"
                                                 ng-style="subDesc.isNew && {'background':'#d1fae5','border-left':'4px solid #059669','border-radius':'8px'}">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="Sub description text" ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-6">
                                                        <label class="form-label small fw-bold">Status:</label>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.statusId" 
                                                                ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                                                ng-change="$ctrl.onSubDescStatusChange(control, $index)"
                                                                ng-init="$ctrl.ensureStatusesLoaded()"
                                                                ng-click="$event.stopPropagation();">
                                                            <option value="">-- Select Status --</option>
                                                            <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-6">
                                                        <label class="form-label small fw-bold">Employee:</label>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.employeeId" 
                                                                ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                                ng-click="$event.stopPropagation();"
                                                                ng-if="subDesc.statusId && $ctrl.isSubDescQAStatus(subDesc.statusId)">
                                                            <option value="">-- Select QA Engineer --</option>
                                                            <option ng-repeat="qa in $ctrl.getQAEngineers()" value="{{qa.id}}">
                                                                {{qa.employeeName}}
                                                            </option>
                                                        </select>
                                                        <select class="form-select form-select-sm" 
                                                                ng-model="subDesc.employeeId" 
                                                                ng-change="$ctrl.updateEditSubDescriptions(control)"
                                                                ng-click="$event.stopPropagation();"
                                                                ng-if="!subDesc.statusId || !$ctrl.isSubDescQAStatus(subDesc.statusId)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">
                                                                {{emp.employeeName}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <label class="form-label small fw-bold">Progress:</label>
                                                        <input type="number" min="0" max="100" 
                                                               class="form-control form-control-sm text-center no-spinners" 
                                                               ng-model="subDesc.progress" 
                                                               placeholder="0-100" 
                                                               ng-change="$ctrl.onSubDescProgressChange(control, $index)"
                                                               onkeydown="if(event.key==='e' || event.key==='E' || event.key==='+' || event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-6 mt-2">
                                                        <label class="form-label small fw-bold">Release Date:</label>
                                                        <input type="date" class="form-control form-control-sm" 
                                                               ng-model="subDesc.releaseDateInputFormatted" 
                                                               ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                    </div>
                                                    <div class="col-2 mt-2">
                                                        <label class="form-label small fw-bold">&nbsp;</label>
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)" title="Remove">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="row g-2 mt-2">
                                                    <div class="col-12">
                                                        <label class="form-label small fw-bold">Comments:</label>
                                                        <div ng-if="subDesc.comments && subDesc.comments.length > 0" class="subdesc-comments-list mb-2" style="max-height: 150px; overflow-y: auto;">
                                                            <div ng-repeat="comment in subDesc.comments track by $index" class="subdesc-comment-item">
                                                                <div class="d-flex justify-content-between align-items-start">
                                                                    <div class="flex-grow-1">
                                                                        <div class="subdesc-comment-date">
                                                                            <i class="fas fa-calendar-alt"></i> {{$ctrl.formatCommentDate(comment.date)}}
                                                                        </div>
                                                                        <div class="subdesc-comment-text">{{comment.text}}</div>
                                                                    </div>
                                                                    <button class="btn btn-sm btn-link text-danger subdesc-comment-remove" ng-click="$ctrl.removeCommentFromSubDescription(control, $parent.$index, $index)" title="Remove comment">
                                                                        <i class="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="subdesc-comment-input">
                                                            <input type="text" class="form-control form-control-sm" 
                                                                   ng-model="subDesc.newComment" 
                                                                   placeholder="Add a comment..." 
                                                                   ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescription(control, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" ng-click="$ctrl.addCommentToSubDescription(control, $index)" title="Add comment">
                                                                <i class="fas fa-plus"></i>
                                                            </button>
                                                        </div>
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
                            <td class="text-center" ng-if="$ctrl.showActionColumn()">
                                <div ng-if="!control.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-warning me-1" 
                                            ng-click="$ctrl.startEdit(control); $event.stopPropagation();" 
                                            title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !control.isPlaceholder" 
                                            class="btn btn-sm btn-danger" 
                                            ng-click="$ctrl.deleteControl(control); $event.stopPropagation();" 
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
                                    <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControl(control); $event.stopPropagation();" ng-disabled="control.saving" title="Save">
                                        <span ng-if="!control.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" ng-click="control.editing = false; $event.stopPropagation();" ng-disabled="control.saving" title="Cancel">
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
    controller: function (ApiService, NotificationService, AuthService, $rootScope, $scope, $timeout, $location) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.selectedTypeFilter = null;
        ctrl.selectedEmployeeFilter = null;
        ctrl.selectedDescriptionFilter = null;
        ctrl.showAddControlModal = false;
        ctrl.filtersCollapsed = false;
        ctrl.isLocalSave = false;

        ctrl.toggleFilters = function () {
            ctrl.filtersCollapsed = !ctrl.filtersCollapsed;
        };
        ctrl.newControl = {
            typeId: null,
            description: '',
            employeeId: null
        };
        ctrl.isCreatingControl = false;

        // Use shared QA Employee Map from ApiService (shared across components)
        // Initialize if not exists
        if (!ctrl.store.qaEmployeeMap) {
            ctrl.store.qaEmployeeMap = {};
        }
        ctrl.qaEmployeeMap = ctrl.store.qaEmployeeMap; // Reference to shared map

        ctrl.isAdmin = function () {
            try {
                var isAdmin = AuthService.isAdmin();
                return isAdmin === true;
            } catch (e) {
                console.error('Error checking admin status:', e);
                return false;
            }
        };

        ctrl.canEditControl = function () {
            return AuthService.canEditControl();
        };

        ctrl.canDeleteControl = function () {
            return AuthService.canDeleteControl();
        };

        // Only Admin, Team Lead, Software Architecture can add progress comments
        ctrl.canAddComment = function () {
            return AuthService.canMarkProgress();
        };

        // Show/hide Action column (hide for view-only roles like Developers / QA Engineers / Interns)
        ctrl.showActionColumn = function () {
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
        ApiService.init().then(function () {
            // Ensure employees are loaded first
            return ApiService.loadEmployees();
        }).then(function () {
            // Then load controls
            return ApiService.loadAllControls();
        }).then(function () {
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
        }).catch(function (error) {
            console.error('Error initializing controls board:', error);
            NotificationService.show('Error loading controls data', 'error');
        });

        // Listen for control types updates to refresh controls
        var controlTypesUpdateListener = $rootScope.$on('controlTypesUpdated', function () {
            // Reload controls when control types are updated
            ApiService.loadAllControls().then(function () {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });

        // Listen for controls updates to refresh controls board
        var controlsUpdateListener = $rootScope.$on('controlsUpdated', function () {
            // Block global refresh if we are currently saving locally to prevent UI flicker
            // BUT we still need to initialize the data for the new objects in the store!
            if (ctrl.isLocalSave) {
                ctrl.ensureDateObjects();
                return;
            }
            // Reload controls when controls are updated from other components
            ApiService.loadAllControls().then(function () {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });

        // Listen for employees updates to refresh controls
        var employeesUpdateListener = $rootScope.$on('employeesUpdated', function () {
            // Reload employees first, then controls, so new employees appear in controls board
            ApiService.loadEmployees().then(function () {
                return ApiService.loadAllControls();
            }).then(function () {
                ctrl.ensureDateObjects();
                // Force view update (only if not already in digest cycle)
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            });
        });

        // Listen for route changes to refresh data when navigating back to controls page
        var routeChangeListener = $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current && current.$$route && (current.$$route.originalPath === '/controls' || current.$$route.originalPath === '/controls/:section')) {
                // Reload controls when navigating back to controls page to ensure fresh data
                ApiService.loadAllControls().then(function () {
                    ctrl.ensureDateObjects();
                    // Force view update
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        });

        // Store listeners for cleanup
        ctrl.controlTypesUpdateListener = controlTypesUpdateListener;
        ctrl.controlsUpdateListener = controlsUpdateListener;
        ctrl.employeesUpdateListener = employeesUpdateListener;
        ctrl.routeChangeListener = routeChangeListener;

        // Cleanup listeners on destroy
        ctrl.$onDestroy = function () {
            if (ctrl.controlTypesUpdateListener) {
                ctrl.controlTypesUpdateListener();
            }
            if (ctrl.controlsUpdateListener) {
                ctrl.controlsUpdateListener();
            }
            if (ctrl.employeesUpdateListener) {
                ctrl.employeesUpdateListener();
            }
            if (ctrl.routeChangeListener) {
                ctrl.routeChangeListener();
            }
        };

        // Ensure all input models are properly formatted for date inputs
        ctrl.ensureDateObjects = function () {
            if (!ctrl.store || !ctrl.store.allControls) {
                console.warn('Store or allControls not initialized in ensureDateObjects');
                return;
            }
            ctrl.store.allControls.forEach(function (c) {
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

                // Cache main comments array to avoid infinite digest loops
                if (c.comments) {
                    c._mainCommentsArray = ctrl.getMainCommentsWithDetails(c.comments);
                    // Debug: Log if comments were parsed
                    if (c._mainCommentsArray && c._mainCommentsArray.length > 0) {
                        console.log('Control', c.controlId, 'has', c._mainCommentsArray.length, 'main comments');
                    }
                } else {
                    c._mainCommentsArray = [];
                }

                // Restore QA Employee ID from database (now persisted) or map (backward compatibility)
                if (c.qaEmployeeId) {
                    // Update map with database value for consistency
                    ctrl.qaEmployeeMap[c.controlId] = c.qaEmployeeId;
                } else if (c.statusName && c.statusName.toLowerCase() === 'qa' && ctrl.qaEmployeeMap[c.controlId]) {
                    // Fallback to map if database doesn't have it yet (backward compatibility)
                    c.qaEmployeeId = ctrl.qaEmployeeMap[c.controlId];
                }

                // If status is QA and employee is a QA Engineer, ensure qaEmployeeId is set
                if (c.statusName && c.statusName.toLowerCase() === 'qa' && c.employeeId && !c.qaEmployeeId && ctrl.store.employees && ctrl.store.employees.length > 0) {
                    var emp = ctrl.store.employees.find(function (e) { return e.id === c.employeeId; });
                    if (emp && emp.role) {
                        var role = (emp.role || '').toLowerCase().trim();
                        if (role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer') {
                            c.qaEmployeeId = c.employeeId;
                            // Update map for consistency
                            ctrl.qaEmployeeMap[c.controlId] = c.employeeId;
                        }
                    }
                }

                // Check multiple sources for release date
                var releaseDateSource = null;

                if (c.releaseDate) {
                    releaseDateSource = c.releaseDate;
                } else if (c.release && c.release.releaseDate) {
                    releaseDateSource = c.release.releaseDate;
                } else if (c.releaseId && ctrl.store.releases && ctrl.store.releases.length > 0) {
                    // Try to find release by ID and use its date
                    var release = ctrl.store.releases.find(function (r) {
                        return r.releaseId === c.releaseId;
                    });
                    if (release && release.releaseDate) {
                        releaseDateSource = release.releaseDate;
                    }
                }

                if (releaseDateSource) {
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

        // Clear release date filter helper
        ctrl.clearReleaseDateFilter = function () {
            ctrl.selectedReleaseDateFilter = null;
        };

        ctrl.formatDate = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };

        // Format date with year and month for display (DD.MM.YYYY)
        ctrl.formatDateWithYear = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };

        // Format date for HTML date input (YYYY-MM-DD)
        ctrl.formatDateForInput = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + d.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        };

        // Handle date input change event
        ctrl.onDateInputChange = function (control, event) {
            // Prevent event propagation to avoid conflicts
            if (event) {
                event.stopPropagation();
            }

            var value = control.releaseDateInputFormatted;

            // Normalize different possible types (string or Date) into Date/null
            if (value instanceof Date) {
                // Already a Date object
                control.releaseDateInput = value;
            } else if (typeof value === 'string') {
                var trimmed = value.trim();
                if (trimmed !== '') {
                    control.releaseDateInput = new Date(trimmed);
                } else {
                    control.releaseDateInput = null;
                    control.releaseDateInputFormatted = '';
                }
            } else {
                // Any other type -> treat as empty
                control.releaseDateInput = null;
                control.releaseDateInputFormatted = '';
            }

            ctrl.updateReleaseDate(control);
        };

        // Handle date input blur event (when user finishes selecting date)
        ctrl.onDateInputBlur = function (control, event) {
            // Prevent event propagation
            if (event) {
                event.stopPropagation();
            }

            var value = control.releaseDateInputFormatted;

            // Ensure the date is properly formatted and saved
            if (value instanceof Date) {
                var d = value;
                if (!isNaN(d.getTime())) {
                    control.releaseDateInput = d;
                    control.releaseDateInputFormatted = ctrl.formatDateForInput(d);
                    ctrl.updateReleaseDate(control);
                }
            } else if (typeof value === 'string') {
                var trimmed = value.trim();
                if (trimmed !== '') {
                    var dateObj = new Date(trimmed);
                    if (!isNaN(dateObj.getTime())) {
                        control.releaseDateInput = dateObj;
                        control.releaseDateInputFormatted = ctrl.formatDateForInput(dateObj);
                        ctrl.updateReleaseDate(control);
                    }
                } else {
                    // If empty, ensure it's cleared
                    control.releaseDateInput = null;
                    control.releaseDateInputFormatted = '';
                    ctrl.updateReleaseDate(control);
                }
            } else {
                // Any other type -> treat as empty
                control.releaseDateInput = null;
                control.releaseDateInputFormatted = '';
                ctrl.updateReleaseDate(control);
            }
        };

        // Parse date from HTML date input string
        ctrl.parseDateFromInput = function (dateString) {
            if (!dateString) return null;
            return new Date(dateString);
        };

        // REMOVED: getDateInputValue function (It was causing the String vs Date error)

        ctrl.updateReleaseDate = function (control) {
            var value = control.releaseDateInputFormatted;

            // Handle empty or null date (delete case) - check formatted value first
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                control.releaseDate = null;
                control.releaseDateInput = null;
                control.releaseDateInputFormatted = '';
                ctrl.saveReleaseDateOnly(control, null);
                return;
            }

            // Convert to Date object from either string or Date
            var selectedDate = value instanceof Date ? new Date(value) : new Date(value);

            // Validate date
            if (isNaN(selectedDate.getTime())) {
                NotificationService.show('Invalid date selected', 'error');
                // Revert to previous date
                if (control.releaseDate) {
                    var prevDate = new Date(control.releaseDate);
                    control.releaseDateInput = prevDate;
                    control.releaseDateInputFormatted = ctrl.formatDateForInput(prevDate);
                } else {
                    control.releaseDateInput = null;
                    control.releaseDateInputFormatted = '';
                }
                return;
            }

            // Set time to noon to avoid timezone shifting the calendar date
            // (prevents off-by-one-day issues when converting to ISO/UTC)
            selectedDate.setHours(12, 0, 0, 0);

            // Update the control object immediately for display in release column
            control.releaseDate = new Date(selectedDate);
            control.releaseDateInput = new Date(selectedDate);
            // Ensure formatted string is correct (normalize it)
            control.releaseDateInputFormatted = ctrl.formatDateForInput(selectedDate);

            var releaseDateISO = selectedDate.toISOString();
            ctrl.saveReleaseDateOnly(control, releaseDateISO);
        };

        ctrl.saveReleaseDateOnly = function (control, releaseDate) {
            var releaseId = null;
            var needsReleaseCreation = false;
            var releaseDataToCreate = null;

            if (releaseDate) {
                var selectedDate = new Date(releaseDate);
                selectedDate.setHours(0, 0, 0, 0);

                var matchingRelease = ctrl.store.releases.find(function (r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });

                if (matchingRelease) {
                    releaseId = matchingRelease.releaseId;
                } else {
                    var matchingUpcomingRelease = ctrl.store.upcomingReleases.find(function (r) {
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

            var saveControlWithPayload = function (finalReleaseId, finalReleaseDate) {
                payload.releaseId = finalReleaseId;
                payload.releaseDate = finalReleaseDate;

                // FIX: Service now returns formatted object directly. No need for .data
                return ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {

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
                    return ApiService.loadReleases().then(function () {
                        // Then reload controls
                        return ApiService.loadAllControls().then(function () {
                            // After reload, find this specific control and ensure date is properly set
                            var reloadedControl = ctrl.store.allControls.find(function (c) {
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
                }).catch(function (error) {
                    console.error('Error updating release date:', error);
                    var errorMsg = 'Error updating release date';
                    if (error && error.data) {
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

            if (needsReleaseCreation && releaseDataToCreate) {
                ApiService.addRelease(releaseDataToCreate).then(function (createdRelease) {
                    saveControlWithPayload(createdRelease.releaseId, releaseDate);
                }).catch(function (error) {
                    console.error('Error creating release:', error);
                    saveControlWithPayload(null, releaseDate);
                });
            } else {
                saveControlWithPayload(releaseId, releaseDate);
            }
        };

        ctrl.getAllControls = function () {
            if (!ctrl.store) {
                console.warn('Store not initialized');
                return [];
            }
            if (!ctrl.store.allControls) {
                console.warn('allControls not initialized');
                ctrl.store.allControls = [];
            }
            if (!ctrl.store.employees) {
                ctrl.store.employees = [];
            }

            // For \"All Types\" view we want, for each employee, one row per TYPE,
            // but not multiple rows for the same (employee, type) pair.
            // Also avoid true duplicates by controlId.
            var controlIdSet = new Set();        // dedupe by controlId
            var employeeTypeMap = new Map();     // key: employeeId|typeId -> control

            ctrl.store.allControls.forEach(function (c) {
                // Skip controls without a valid controlId (not assigned)
                // But allow controls without employeeId to show (they can be assigned later)
                if (!c.controlId) return;

                // Deduplicate by controlId first (safety)
                var controlIdKey = String(c.controlId);
                if (controlIdSet.has(controlIdKey)) return;
                controlIdSet.add(controlIdKey);

                // Safeguard: If input model is string (from older cache/state), convert to Date
                if (c.releaseDate && typeof c.releaseDateInput === 'string') {
                    c.releaseDateInput = new Date(c.releaseDate);
                }
                // Ensure formatted date is set for ng-model binding
                if (c.releaseDate && !c.releaseDateInputFormatted) {
                    c.releaseDateInputFormatted = ctrl.formatDateForInput(c.releaseDate);
                } else if (!c.releaseDate) {
                    c.releaseDateInputFormatted = '';
                }

                // Apply search filter if provided (includes sub-descriptions)
                if (ctrl.searchText && !ctrl.matchesSearch(c, ctrl.searchText)) {
                    return;
                }

                // Apply employee filter if provided (show all if "All Employees" is selected)
                if (ctrl.selectedEmployeeFilter !== null && ctrl.selectedEmployeeFilter !== undefined && ctrl.selectedEmployeeFilter !== '') {
                    var filterEmpId = parseInt(ctrl.selectedEmployeeFilter);
                    var controlEmpId = c.employeeId ? parseInt(c.employeeId) : null;
                    if (controlEmpId !== filterEmpId) {
                        return;
                    }
                }

                // Apply description filter if provided (show all if "All Descriptions" is selected)
                if (ctrl.selectedDescriptionFilter !== null && ctrl.selectedDescriptionFilter !== undefined && ctrl.selectedDescriptionFilter !== '') {
                    var controlDesc = c.description ? c.description.trim() : '';
                    if (controlDesc !== ctrl.selectedDescriptionFilter) {
                        return;
                    }
                }

                // Apply release date filter if provided (exact calendar day match)
                if (ctrl.selectedReleaseDateFilter) {
                    // Normalize both dates to YYYY-MM-DD string for comparison
                    var controlDateStr = c.releaseDate ? ctrl.formatDateForInput(c.releaseDate) : '';
                    var filterDateStr = '';
                    if (ctrl.selectedReleaseDateFilter instanceof Date) {
                        filterDateStr = ctrl.formatDateForInput(ctrl.selectedReleaseDateFilter);
                    } else if (typeof ctrl.selectedReleaseDateFilter === 'string') {
                        // Expecting HTML date input format (YYYY-MM-DD)
                        filterDateStr = ctrl.selectedReleaseDateFilter.trim();
                    }

                    if (filterDateStr) {
                        var subDescMatch = false;
                        var matchingSubDescs = [];

                        if (c._subDescriptionsArray && c._subDescriptionsArray.length > 0) {
                            matchingSubDescs = c._subDescriptionsArray.filter(function (sub) {
                                if (!sub.releaseDate) return false;
                                var subDateStr = ctrl.formatDateForInput(new Date(sub.releaseDate));
                                return subDateStr === filterDateStr;
                            });
                            if (matchingSubDescs.length > 0) {
                                subDescMatch = true;
                            }
                        }

                        if (!subDescMatch && controlDateStr !== filterDateStr) {
                            return;
                        }

                        // If we are filtering by date, attach the filtered sub-descriptions to the control object for view
                        // This property `_viewSubDescs` will be used in the view if it exists
                        c._viewSubDescs = subDescMatch ? matchingSubDescs : (controlDateStr === filterDateStr ? c._subDescriptionsArray : []);
                    }
                } else {
                    // Reset view property if no filter
                    c._viewSubDescs = null;
                }

                // Key per (employee, type) so the same type for same employee appears only once
                // Use 'null' for employeeId if it doesn't exist
                var empId = c.employeeId || 'null';
                var empTypeKey = String(empId) + '|' + String(c.typeId);
                if (!employeeTypeMap.has(empTypeKey)) {
                    employeeTypeMap.set(empTypeKey, c);
                } else {
                    // If we already have a control for this (employee, type),
                    // keep the one with higher controlId (more recent)
                    var existing = employeeTypeMap.get(empTypeKey);
                    if (c.controlId != null && existing.controlId != null && c.controlId > existing.controlId) {
                        employeeTypeMap.set(empTypeKey, c);
                    }
                }
            });

            // Return one control per (employee, type) pair
            return Array.from(employeeTypeMap.values());
        };

        ctrl.getFilteredTypes = function () {
            if (!ctrl.store) return [];
            if (!ctrl.store.controlTypes || !ctrl.store.allControls) return [];

            if (ctrl.selectedTypeFilter) {
                return ctrl.store.controlTypes.filter(function (t) {
                    return t.controlTypeId == ctrl.selectedTypeFilter;
                });
            }

            var seenTypeIds = {};
            var typeIdsWithControls = [];

            ctrl.store.allControls.forEach(function (control) {
                if (control.typeId && !seenTypeIds[control.typeId]) {
                    var type = ctrl.store.controlTypes.find(t => t.controlTypeId == control.typeId);
                    if (type) {
                        seenTypeIds[control.typeId] = true;
                        typeIdsWithControls.push(control.typeId);
                    }
                }
            });

            var typesWithControls = [];
            typeIdsWithControls.forEach(function (typeId) {
                var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
                if (type) typesWithControls.push(type);
            });

            typesWithControls.sort(function (a, b) {
                return (a.typeName || '').localeCompare(b.typeName || '');
            });

            return typesWithControls;
        };

        ctrl.getControlsByType = function (typeId) {
            if (!ctrl.store) {
                console.warn('Store not initialized in getControlsByType');
                return [];
            }
            if (!ctrl.store.allControls) {
                console.warn('allControls not initialized in getControlsByType');
                ctrl.store.allControls = [];
            }
            if (!ctrl.store.employees) {
                ctrl.store.employees = [];
            }

            // We want to show ALL controls for this type (not just one per employee)
            // but still avoid true duplicates by controlId.
            var controlIdSet = new Set(); // Track unique controlIds to prevent duplicates
            var result = [];

            ctrl.store.allControls.forEach(function (c) {
                // Skip controls without a valid controlId (not assigned)
                // But allow controls without employeeId to show
                if (!c.controlId) return;

                // Filter by typeId - must match the type we're looking for
                if (c.typeId != typeId) return;

                // Deduplicate by controlId only (no grouping by employee)
                var controlIdKey = String(c.controlId);
                if (controlIdSet.has(controlIdKey)) return;
                controlIdSet.add(controlIdKey);

                // Ensure formatted date is set for ng-model binding
                if (c.releaseDate && !c.releaseDateInputFormatted) {
                    c.releaseDateInputFormatted = ctrl.formatDateForInput(c.releaseDate);
                } else if (!c.releaseDate) {
                    c.releaseDateInputFormatted = '';
                }

                // Apply search filter if search text is provided (includes sub-descriptions)
                if (ctrl.searchText && !ctrl.matchesSearch(c, ctrl.searchText)) {
                    return;
                }

                // Apply employee filter if provided (show all if "All Employees" is selected)
                if (ctrl.selectedEmployeeFilter !== null && ctrl.selectedEmployeeFilter !== undefined && ctrl.selectedEmployeeFilter !== '') {
                    var filterEmpId = parseInt(ctrl.selectedEmployeeFilter);
                    var controlEmpId = c.employeeId ? parseInt(c.employeeId) : null;
                    if (controlEmpId !== filterEmpId) {
                        return;
                    }
                }

                // Apply description filter if provided (show all if "All Descriptions" is selected)
                if (ctrl.selectedDescriptionFilter !== null && ctrl.selectedDescriptionFilter !== undefined && ctrl.selectedDescriptionFilter !== '') {
                    var controlDesc = c.description ? c.description.trim() : '';
                    if (controlDesc !== ctrl.selectedDescriptionFilter) {
                        return;
                    }
                }

                result.push(c);
            });

            return result;
        };

        ctrl.getEmployeeName = function (employeeId) {
            var emp = ctrl.store.employees.find(e => e.id == employeeId);
            return emp ? emp.employeeName : '';
        };

        // Get QA comments from comments string (lines containing [QA])
        ctrl.getQAComments = function (comments) {
            if (!comments) return [];
            var lines = comments.split('\n');
            return lines.filter(function (line) {
                return line.trim().length > 0 && line.indexOf('[QA]') !== -1;
            });
        };

        // Get non-QA comments from comments string (lines not containing [QA])
        ctrl.getNonQAComments = function (comments) {
            if (!comments) return [];
            var lines = comments.split('\n');
            return lines.filter(function (line) {
                return line.trim().length > 0 && line.indexOf('[QA]') === -1;
            });
        };

        // Navigate to QA Progress page when QA comment is clicked
        ctrl.navigateToQAProgress = function (control) {
            // Navigate to QA Progress page with controlId to scroll to the specific control
            $location.path('/qa-progress').search('controlId', control.controlId);
            // Show notification
            NotificationService.show('Navigating to QA Engineers Progress page...', 'info');
        };

        // Check if control is assigned to a developer
        ctrl.isDeveloperControl = function (control) {
            if (!control || !control.employeeId) {
                if (control && control.description && control.description.indexOf('AAA L3') !== -1) {
                    console.log('AAA L3 - No employeeId:', control);
                }
                return false;
            }
            if (!ctrl.store || !ctrl.store.employees) {
                if (control.description && control.description.indexOf('AAA L3') !== -1) {
                    console.log('AAA L3 - Store or employees not available');
                }
                return false;
            }

            var employee = ctrl.store.employees.find(function (emp) {
                return emp.id === control.employeeId;
            });

            if (!employee) {
                if (control.description && control.description.indexOf('AAA L3') !== -1) {
                    console.log('AAA L3 - Employee not found for employeeId:', control.employeeId, 'Available employees:', ctrl.store.employees.map(function (e) { return { id: e.id, name: e.employeeName }; }));
                }
                return false;
            }

            var role = '';
            if (employee.user && employee.user.role) {
                role = (employee.user.role || '').toLowerCase().trim();
            } else if (employee.role) {
                role = (employee.role || '').toLowerCase().trim();
            }

            var isDeveloper = role === 'developer' || role === 'developers' || role === 'intern developer';

            // Debug logging for AAA L3 control
            if (control.description && control.description.indexOf('AAA L3') !== -1) {
                console.log('AAA L3 Control Check:', {
                    controlId: control.controlId,
                    description: control.description,
                    employeeId: control.employeeId,
                    employeeName: employee.employeeName,
                    employee: employee,
                    userRole: employee.user ? employee.user.role : 'N/A',
                    employeeRole: employee.role || 'N/A',
                    role: role,
                    isDeveloper: isDeveloper,
                    'role === "developer"': role === 'developer',
                    'role === "developers"': role === 'developers'
                });
                console.log('AAA L3 - isDeveloper result:', isDeveloper, '| role:', role, '| Will table render?', isDeveloper);
            }

            return isDeveloper;
        };

        // Navigate to Developer Progress page when row is clicked - DISABLED
        ctrl.navigateToDeveloperProgress = function (control, $event) {
            // Developer Progress page has been removed
            // This function is kept for backward compatibility but does nothing
            return;
        };

        // Get QA Engineers from employees list
        ctrl.getQAEngineers = function () {
            if (!ctrl.store || !ctrl.store.employees) {
                return [];
            }

            var qaEngineers = ctrl.store.employees.filter(function (emp) {
                if (!emp || !emp.employeeName) return false;

                // Check if employee has user with role
                if (emp.user && emp.user.role) {
                    var role = (emp.user.role || '').toLowerCase().trim();
                    return role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer';
                }

                // Also check if role is directly on employee object (fallback)
                if (emp.role) {
                    var role = (emp.role || '').toLowerCase().trim();
                    return role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer';
                }

                return false;
            });

            // Sort by employee name
            qaEngineers.sort(function (a, b) {
                var nameA = (a.employeeName || '').toLowerCase();
                var nameB = (b.employeeName || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });

            return qaEngineers;
        };

        // Get non-QA employees
        ctrl.getNonQAEmployees = function () {
            if (!ctrl.store || !ctrl.store.employees) {
                return [];
            }
            return ctrl.store.employees.filter(function (emp) {
                if (emp.user && emp.user.role) {
                    var role = emp.user.role.toLowerCase();
                    return role !== 'qa engineer' && role !== 'qa';
                }
                return true; // Include employees without role info
            });
        };

        // Get unique descriptions from all controls (filtered by selected type if any)
        ctrl.getUniqueDescriptions = function () {
            if (!ctrl.store || !ctrl.store.allControls) {
                return [];
            }
            var descriptions = new Set();
            var selectedTypeId = ctrl.selectedTypeFilter ? parseInt(ctrl.selectedTypeFilter) : null;

            ctrl.store.allControls.forEach(function (control) {
                // Filter by selected type if a type is selected
                if (selectedTypeId !== null) {
                    var controlTypeId = control.typeId ? parseInt(control.typeId) : null;
                    if (controlTypeId !== selectedTypeId) {
                        return; // Skip controls that don't match the selected type
                    }
                }

                if (control.description && control.description.trim()) {
                    descriptions.add(control.description.trim());
                }
            });
            return Array.from(descriptions).sort();
        };

        // Handle description dropdown focus - make it scrollable if more than 10 items
        ctrl.onDescriptionDropdownFocus = function () {
            var descriptions = ctrl.getUniqueDescriptions();
            if (descriptions.length > 10) {
                setTimeout(function () {
                    var selectElement = document.querySelector('.description-filter-select');
                    if (selectElement) {
                        selectElement.setAttribute('size', '10');
                    }
                }, 10);
            }
        };

        // Handle description dropdown blur - restore to normal dropdown
        ctrl.onDescriptionDropdownBlur = function () {
            setTimeout(function () {
                var selectElement = document.querySelector('.description-filter-select');
                if (selectElement && document.activeElement !== selectElement) {
                    selectElement.removeAttribute('size');
                }
            }, 200);
        };

        // Check if control is assigned to QA Engineer
        ctrl.isQAControl = function (control) {
            if (!control) return false;
            // Check if qaEmployeeId is set
            if (control.qaEmployeeId) return true;
            // Check if status is QA and employee is a QA Engineer
            var isQAStatus = control.statusName && control.statusName.toLowerCase() === 'qa';
            if (!isQAStatus || !control.employeeId || !ctrl.store || !ctrl.store.employees) return false;
            var emp = ctrl.store.employees.find(function (e) { return e.id === control.employeeId; });
            if (!emp) return false;
            var role = '';
            if (emp.user && emp.user.role) {
                role = (emp.user.role || '').toLowerCase().trim();
            } else if (emp.role) {
                role = (emp.role || '').toLowerCase().trim();
            }
            return role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer';
        };

        // Get controls assigned to QA Engineers (status = "QA" AND has QA Employee assigned)
        ctrl.getQAControls = function () {
            if (!ctrl.store || !ctrl.store.allControls || !ctrl.store.employees) {
                return [];
            }

            var qaControls = [];
            ctrl.store.allControls.forEach(function (control) {
                // Check if control has status "QA" (required)
                var isQAStatus = control.statusName && control.statusName.toLowerCase() === 'qa';

                // Check if control has QA Employee assigned (from map or control object) (required)
                var hasQAEmployee = control.qaEmployeeId || (control.controlId && ctrl.qaEmployeeMap[control.controlId]);

                // Include control ONLY if BOTH conditions are met:
                // 1. Status is "QA" AND
                // 2. QA Employee is assigned
                if (isQAStatus && hasQAEmployee) {
                    // Restore qaEmployeeId from map if not in control object
                    if (!control.qaEmployeeId && control.controlId && ctrl.qaEmployeeMap[control.controlId]) {
                        control.qaEmployeeId = ctrl.qaEmployeeMap[control.controlId];
                    }

                    qaControls.push(control);
                }
            });

            return qaControls;
        };

        // Helper function to check if search term matches control (including sub-descriptions)
        ctrl.matchesSearch = function (control, searchTerm) {
            if (!searchTerm || !searchTerm.trim()) return true;
            var term = searchTerm.toLowerCase().trim();

            // Check main description
            var descMatch = control.description && control.description.toLowerCase().includes(term);

            // Check employee name
            var emp = ctrl.store.employees.find(e => e.id == control.employeeId);
            var empMatch = emp && emp.employeeName && emp.employeeName.toLowerCase().includes(term);

            // Check sub-descriptions
            var subDescMatch = false;
            // Ensure sub-descriptions array is populated
            if (!control._subDescriptionsArray && control.subDescriptions) {
                control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(control.subDescriptions);
            }
            if (control._subDescriptionsArray && control._subDescriptionsArray.length > 0) {
                subDescMatch = control._subDescriptionsArray.some(function (subDesc) {
                    if (subDesc.description && subDesc.description.toLowerCase().includes(term)) {
                        return true;
                    }
                    // Also check comments in sub-descriptions
                    if (subDesc.comments && Array.isArray(subDesc.comments)) {
                        return subDesc.comments.some(function (comment) {
                            return comment.text && comment.text.toLowerCase().includes(term);
                        });
                    }
                    return false;
                });
            }

            // Also check main comments
            var commentMatch = control.comments && control.comments.toLowerCase().includes(term);

            return descMatch || empMatch || subDescMatch || commentMatch;
        };

        // Get registered employees (those with User accounts)
        ctrl.getRegisteredEmployees = function () {
            if (!ctrl.store.employees) return [];
            return ctrl.store.employees.filter(function (emp) {
                return emp.userId !== null && emp.userId !== undefined;
            });
        };

        // Format employee option for dropdown display
        ctrl.formatEmployeeOption = function (employee) {
            if (!employee) return '';
            var role = '';
            if (employee.user && employee.user.role) {
                role = ' (' + employee.user.role + ')';
            }
            return employee.employeeName + role;
        };

        ctrl.ensureStatusesLoaded = function () {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
        };

        ctrl.startEdit = function (c) {
            // Don't allow editing placeholder controls (employees without controls)
            if (c.isPlaceholder || !c.controlId) {
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

            // Fix: Initialize models as Date Objects or null
            c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
            c.releaseDateInputFormatted = c.releaseDate ? new Date(c.releaseDate) : null;
            c.editReleaseDate = c.releaseDate ? new Date(c.releaseDate) : null;
        };

        // Enter edit mode for sub-description row
        ctrl.startEditSubDescription = function (control, index, event) {
            if (event) event.stopPropagation();
            console.log('startEditSubDescription called', { controlId: control.controlId, index: index });
            if (!control._subDescriptionsArray || !control._subDescriptionsArray[index]) {
                console.warn('Sub-description not found at index:', index);
                return;
            }

            // Mark the specific row as editing
            var subDesc = control._subDescriptionsArray[index];
            subDesc.editing = true;

            // Initialize edit model with a copy of current data
            subDesc.editModel = {
                description: subDesc.description || '',
                employeeId: subDesc.employeeId || null,
                statusId: subDesc.statusId || null,
                progress: subDesc.progress || 0,
                releaseId: subDesc.releaseId || null,
                releaseDateInputFormatted: subDesc.releaseDateInputFormatted ? new Date(subDesc.releaseDateInputFormatted) : null,
                comments: subDesc.comments ? angular.copy(subDesc.comments) : []
            };
        };

        // Cancel editing sub-description row
        ctrl.cancelEditSubDescription = function (control, index, event) {
            if (event) event.stopPropagation();
            console.log('cancelEditSubDescription called', index);
            if (!control._subDescriptionsArray || !control._subDescriptionsArray[index]) return;
            control._subDescriptionsArray[index].editing = false;
        };

        // Save inline sub-description edit
        ctrl.saveSubDescription = function (control, subDescIndex, event) {
            if (event) event.stopPropagation();
            console.log('saveSubDescription called', { controlId: control.controlId, index: subDescIndex });
            ctrl.isLocalSave = true; // Set flag to prevent listener refresh

            if (!control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;

            var subDesc = control._subDescriptionsArray[subDescIndex];
            var model = subDesc.editModel;

            if (!model.description || !model.description.trim()) {
                NotificationService.show('Description is required', 'error');
                ctrl.isLocalSave = false;
                return;
            }

            // 1. Update the local sub-description object with data from the edit model
            var statusId = model.statusId ? parseInt(model.statusId) : null;
            var progress = model.progress !== undefined && model.progress !== null ? parseInt(model.progress) : null;

            // Find or create release if date was changed from calendar
            ApiService.findOrCreateReleaseByDate(model.releaseDateInputFormatted).then(function (newReleaseId) {
                if (model.releaseDateInputFormatted) {
                    model.releaseId = newReleaseId;
                }

                // Auto-advance status if progress is 100%
                if (statusId && progress === 100 && ctrl.store.statuses) {
                    var currentStatus = ctrl.store.statuses.find(function (s) {
                        return s.id === statusId;
                    });
                    if (currentStatus && currentStatus.statusName) {
                        var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                        if (nextStatus) {
                            statusId = nextStatus.id;
                            // Reset progress to 0% for next status
                            progress = 0;
                            NotificationService.show('Sub-task ' + currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                        }
                    }
                }

                subDesc.description = model.description.trim();
                subDesc.employeeId = model.employeeId ? parseInt(model.employeeId) : null;
                subDesc.statusId = statusId;
                subDesc.progress = progress;
                subDesc.releaseId = model.releaseId ? parseInt(model.releaseId) : null;
                subDesc.comments = model.comments || [];
                subDesc.editing = false; // Exit edit mode

                // 2. Generate the clean array for JSON serialization
                var updatedSubDescs = control._subDescriptionsArray.map(function (item) {
                    return {
                        description: item.description || '',
                        employeeId: item.employeeId || null,
                        statusId: item.statusId || null,
                        progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                        releaseId: item.releaseId || null,
                        releaseDate: item.releaseDate || null,
                        comments: item.comments || []
                    };
                });

                var payload = {
                    controlId: parseInt(control.controlId),
                    employeeId: control.employeeId,
                    typeId: control.typeId,
                    description: control.description,
                    statusId: control.statusId,
                    releaseId: control.releaseId,
                    subDescriptions: JSON.stringify(updatedSubDescs)
                };

                return ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                    // Update local control object with data from server
                    if (updatedControl.subDescriptions) {
                        control.subDescriptions = updatedControl.subDescriptions;
                        control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                    } else {
                        control.subDescriptions = null;
                        control._subDescriptionsArray = [];
                    }
                    return updatedControl;
                });
            }).then(function (updatedControl) {
                NotificationService.show('Sub-description updated', 'success');
                // Reload releases to ensure we have the newly created release if any
                return ApiService.loadReleases().then(function () {
                    $rootScope.$broadcast('controlsUpdated');
                    $timeout(function () {
                        ctrl.isLocalSave = false;
                    }, 500);
                });
            }).catch(function (error) {
                console.error('Error saving sub-description:', error);
                NotificationService.show('Error saving sub-description', 'error');
                ctrl.isLocalSave = false;
            });
        };

        // Quick update for sub-description release date
        ctrl.updateSubDescriptionReleaseQuick = function (control, subDesc, subDescIndex) {
            ctrl.isLocalSave = true; // Set flag to prevent listener refresh

            var newDateString = subDesc.releaseDateInputFormatted;

            ApiService.findOrCreateReleaseByDate(newDateString).then(function (newReleaseId) {
                // Update the local sub-description object
                subDesc.releaseId = newReleaseId;
                subDesc.releaseDate = newDateString ? new Date(newDateString) : null;

                // Generate the clean array for JSON serialization
                var updatedSubDescs = control._subDescriptionsArray.map(function (item) {
                    return {
                        description: (item.description || '').trim(),
                        employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                        statusId: item.statusId ? parseInt(item.statusId) : null,
                        progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                        releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                        releaseDate: item.releaseDate || null,
                        comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                    };
                });

                var jsonStr = JSON.stringify(updatedSubDescs);

                // Update LOCAL state immediately to ensure UI reflects changes
                control.subDescriptions = jsonStr;
                control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(jsonStr);

                // CRITICAL: Update the STORE object as well to ensure persistence across filter/sort re-runs
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.subDescriptions = jsonStr;
                        storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(jsonStr);
                    }
                }

                // Send to API
                var payload = {
                    controlId: parseInt(control.controlId),
                    employeeId: control.employeeId,
                    typeId: control.typeId,
                    description: control.description,
                    subDescriptions: jsonStr,
                    comments: control.comments,
                    progress: control.progress,
                    statusId: control.statusId,
                    releaseId: control.releaseId,
                    releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
                };

                return ApiService.updateControl(control.controlId, payload);
            }).then(function (updatedControl) {
                NotificationService.show('Sub-description release date updated', 'success');

                // Reload releases to ensure we have the newly created release if any
                return ApiService.loadReleases().then(function () {
                    // Update local control object with data from server immediately
                    if (updatedControl) {
                        if (updatedControl.subDescriptions) {
                            control.subDescriptions = updatedControl.subDescriptions;
                            control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        }
                        // Note: If updatedControl.subDescriptions is null, we keep our optimistic update

                        // Update other fields that might have changed
                        control.releaseId = updatedControl.releaseId;
                        if (updatedControl.releaseDate) {
                            control.releaseDate = new Date(updatedControl.releaseDate);
                            control.releaseDateInputFormatted = ctrl.formatDateForInput(control.releaseDate);
                        } else {
                            control.releaseDate = null;
                            control.releaseDateInputFormatted = '';
                        }
                    }

                    // CRITICAL: Re-populate _subDescriptionsArray on the fresh array from server
                    ctrl.ensureDateObjects();
                });
            }).catch(function (error) {
                console.error('Error updating sub-description release date:', error);
                NotificationService.show('Error saving release date', 'error');
            }).finally(function () {
                // Reset flag after a short delay to allow any lingering broadcasts to pass
                $timeout(function () {
                    ctrl.isLocalSave = false;
                }, 1000);
            });
        };

        // Quick add comment to sub-description
        ctrl.addCommentToSubDescriptionQuick = function (control, subDescIndex) {
            if (!control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;
            var subDesc = control._subDescriptionsArray[subDescIndex];
            if (!subDesc.newComment || !subDesc.newComment.trim()) return;

            subDesc.addingComment = true;
            ctrl.isLocalSave = true;

            // Initialize comments array if needed
            if (!subDesc.comments || !Array.isArray(subDesc.comments)) {
                subDesc.comments = [];
            }

            // Add comment with date
            var newComment = {
                text: subDesc.newComment.trim(),
                date: new Date().toISOString()
            };
            subDesc.comments.push(newComment);

            // Update the sub-descriptions in the control
            var subDescriptionsArray = control._subDescriptionsArray.map(function (sd) {
                return {
                    description: sd.description || '',
                    employeeId: sd.employeeId || null,
                    statusId: sd.statusId || null,
                    progress: sd.progress !== undefined && sd.progress !== null ? parseInt(sd.progress) : null,
                    releaseId: sd.releaseId || null,
                    comments: sd.comments && Array.isArray(sd.comments) ? sd.comments : []
                };
            });

            var subDescriptionsValue = JSON.stringify(subDescriptionsArray);
            subDesc.newComment = ''; // Clear input

            // Update control via API
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId || null,
                typeId: control.typeId || null,
                description: control.description || null,
                subDescriptions: subDescriptionsValue,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: control.statusId || null,
                releaseId: control.releaseId || null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                NotificationService.show('Comment added', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error adding quick comment:', error);
                if (subDesc.comments && subDesc.comments.length > 0) subDesc.comments.pop();
                NotificationService.show('Error adding comment', 'error');
            }).finally(function () {
                subDesc.addingComment = false;
                $timeout(function () {
                    ctrl.isLocalSave = false;
                }, 1000);
            });
        };

        // Add comment while in edit mode (local only until Save is clicked)
        ctrl.addCommentToSubDescriptionEdit = function (subDesc) {
            if (!subDesc || !subDesc.editModel || !subDesc.editModel.newCommentText) return;

            if (!subDesc.editModel.comments) subDesc.editModel.comments = [];

            subDesc.editModel.comments.push({
                text: subDesc.editModel.newCommentText.trim(),
                date: new Date().toISOString()
            });

            subDesc.editModel.newCommentText = ''; // Clear input
        };

        // Remove sub-description and save immediately
        ctrl.removeSubDescriptionAt = function (control, index, event) {
            if (event) event.stopPropagation();
            if (!control || !control._subDescriptionsArray || index === undefined || index === null) return;

            if (!confirm('Are you sure you want to remove this sub-description?')) {
                return;
            }

            ctrl.isLocalSave = true; // Set flag to prevent listener refresh

            // 1. Remove from local array
            control._subDescriptionsArray.splice(index, 1);

            // 2. Serialize for update
            var updatedSubDescs = control._subDescriptionsArray.map(function (item) {
                return {
                    description: (item.description || '').trim(),
                    employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                    statusId: item.statusId ? parseInt(item.statusId) : null,
                    progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                    comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                };
            });

            var jsonStr = JSON.stringify(updatedSubDescs);

            // 3. Update LOCAL state
            control.subDescriptions = jsonStr;
            control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(jsonStr);

            // 4. Update STORE
            if (ctrl.store && ctrl.store.allControls) {
                var storeControl = ctrl.store.allControls.find(function (c) {
                    return c.controlId === control.controlId;
                });
                if (storeControl) {
                    storeControl.subDescriptions = jsonStr;
                    storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(jsonStr);
                }
            }

            // 5. Save change to API
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description,
                subDescriptions: jsonStr,
                comments: control.comments,
                progress: control.progress,
                statusId: control.statusId,
                releaseId: control.releaseId,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function () {
                NotificationService.show('Sub-description removed', 'success');
                // CRITICAL: Re-populate _subDescriptionsArray on the fresh array from server
                ctrl.ensureDateObjects();
            }).catch(function (error) {
                console.error('Error removing sub desc:', error);
                NotificationService.show('Error removing sub-description', 'error');
            }).finally(function () {
                $timeout(function () {
                    ctrl.isLocalSave = false;
                }, 1000);
            });
        };

        // Create new control with main description
        ctrl.createNewControl = function () {
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

            ApiService.addControl(payload).then(function (createdControl) {
                NotificationService.show('Control created successfully', 'success');
                ctrl.showAddControlModal = false;
                ctrl.newControl = {
                    typeId: null,
                    description: '',
                    employeeId: null
                };
                // Reload controls to show the new one
                return ApiService.loadAllControls();
            }).then(function () {
                $rootScope.$broadcast('controlsUpdated');
                // Force view update
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            }).catch(function (error) {
                console.error('Error creating control:', error);
                var errorMsg = 'Error creating control';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isCreatingControl = false;
            });
        };

        // Assign employee to an unassigned control
        ctrl.assignEmployee = function (control) {
            if (!control.assignEmployeeId) {
                return;
            }

            var employeeId = parseInt(control.assignEmployeeId);
            if (isNaN(employeeId) || employeeId <= 0) {
                NotificationService.show('Invalid employee selection', 'error');
                return;
            }

            // Find the employee to check if they are a QA Engineer
            var assignedEmployee = ctrl.store.employees.find(function (emp) {
                return emp.id === employeeId;
            });

            // Determine statusId - if assigning to QA Engineer, set status to "QA"
            var statusId = control.statusId || null;
            if (assignedEmployee && assignedEmployee.user && assignedEmployee.user.role) {
                var employeeRole = assignedEmployee.user.role.toLowerCase();
                if (employeeRole === 'qa engineer' || employeeRole === 'qa' || employeeRole === 'intern qa engineer') {
                    // Find QA status from statuses list
                    ctrl.ensureStatusesLoaded();
                    if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                        var qaStatus = ctrl.store.statuses.find(function (s) {
                            return s.statusName && s.statusName.toLowerCase() === 'qa';
                        });
                        if (qaStatus) {
                            statusId = qaStatus.id;
                        }
                    }
                }
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
                statusId: statusId,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                control.employeeId = updatedControl.employeeId;
                control.assignEmployeeId = null;
                NotificationService.show('Employee assigned successfully', 'success');
                // Reload controls to refresh the view
                return ApiService.loadAllControls();
            }).then(function () {
                $rootScope.$broadcast('controlsUpdated');
                // Force view update
                if (!$scope.$$phase && !$rootScope.$$phase) {
                    $scope.$apply();
                }
            }).catch(function (error) {
                console.error('Error assigning employee:', error);
                control.assignEmployeeId = null;
                var errorMsg = 'Error assigning employee';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            });
        };

        // Assign QA Employee to control (automatically sets status to "QA" if not already)
        ctrl.assignQAEmployee = function (control) {
            if (!control.assignQAEmployeeId) {
                return;
            }

            var qaEmployeeId = parseInt(control.assignQAEmployeeId);
            if (isNaN(qaEmployeeId) || qaEmployeeId <= 0) {
                NotificationService.show('Invalid QA Engineer selection', 'error');
                return;
            }

            // Find QA status - automatically set status to "QA" when assigning QA Engineer
            ctrl.ensureStatusesLoaded();
            var qaStatus = null;
            var statusIdToUse = control.statusId || null;

            // If statuses not loaded, try to load them first
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses().then(function () {
                    qaStatus = ctrl.store.statuses.find(function (s) {
                        return s.statusName && s.statusName.toLowerCase() === 'qa';
                    });
                    if (qaStatus) {
                        statusIdToUse = qaStatus.id;
                    } else {
                        console.warn('QA status not found in statuses list. Proceeding with existing status.');
                    }
                    proceedWithAssignment();
                }).catch(function (error) {
                    console.error('Error loading statuses:', error);
                    NotificationService.show('Error loading statuses. Please try again.', 'error');
                    control.assignQAEmployeeId = null;
                });
                return; // Wait for statuses to load
            } else {
                qaStatus = ctrl.store.statuses.find(function (s) {
                    return s.statusName && s.statusName.toLowerCase() === 'qa';
                });
                // If status is not already "QA", automatically set it to "QA"
                var isQAStatus = control.statusName && control.statusName.toLowerCase() === 'qa';
                if (!isQAStatus && qaStatus) {
                    statusIdToUse = qaStatus.id;
                } else if (!isQAStatus && !qaStatus) {
                    console.warn('QA status not found in statuses list. Proceeding with existing status.');
                }
            }

            proceedWithAssignment();

            function proceedWithAssignment() {
                // Store original employeeId before assigning QA (to preserve developer assignment)
                var originalEmployeeId = control.employeeId;

                // Update the control with QA Employee assignment:
                // - Keep original EmployeeId (developer) to maintain visibility in main table
                // - Store QA Employee ID in database (QAEmployeeId field) for persistence
                // - Automatically set status to "QA" if not already
                var payload = {
                    controlId: parseInt(control.controlId),
                    employeeId: originalEmployeeId, // Keep original employee (developer) to maintain main table visibility
                    qaEmployeeId: qaEmployeeId, // Save QA Employee ID to database
                    typeId: control.typeId,
                    description: control.description || null,
                    subDescriptions: control.subDescriptions || null,
                    comments: control.comments || null,
                    progress: control.progress || 0,
                    statusId: statusIdToUse, // Automatically set to QA status
                    releaseId: control.releaseId || null,
                    releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
                };

                // Store QA Employee ID in map for QA table tracking
                // This allows the control to appear in both main table (with original employee) and QA table (with QA employee)

                ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                    // Store QA Employee ID in map for backward compatibility
                    ctrl.qaEmployeeMap[control.controlId] = qaEmployeeId;

                    // Keep original employeeId for main table display
                    // Set qaEmployeeId from database response (now persisted in DB)
                    control.qaEmployeeId = updatedControl.qaEmployeeId || qaEmployeeId;
                    control.assignQAEmployeeId = null;

                    // Keep status as "QA" (should already be set)
                    if (updatedControl.statusId) {
                        control.statusId = updatedControl.statusId;
                    }

                    if (updatedControl.statusName) {
                        control.statusName = updatedControl.statusName;
                    } else {
                        // Ensure status remains "QA"
                        control.statusName = 'QA';
                    }

                    // Also update in store for immediate visibility
                    if (ctrl.store.allControls) {
                        var storeControl = ctrl.store.allControls.find(function (c) {
                            return c.controlId === control.controlId;
                        });
                        if (storeControl) {
                            // Keep original employeeId, only set qaEmployeeId
                            storeControl.qaEmployeeId = qaEmployeeId;
                            if (updatedControl.statusId) {
                                storeControl.statusId = updatedControl.statusId;
                            }
                            if (updatedControl.statusName) {
                                storeControl.statusName = updatedControl.statusName;
                            } else {
                                // Ensure status remains "QA"
                                storeControl.statusName = 'QA';
                            }
                        }
                    }

                    // Force immediate view update
                    $timeout(function () {
                        $rootScope.$broadcast('controlsUpdated');
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$apply();
                        }
                    }, 0);

                    var statusMsg = '';
                    if (!control.statusName || control.statusName.toLowerCase() !== 'qa') {
                        statusMsg = ' Status automatically set to "QA".';
                    }
                    NotificationService.show('QA Engineer assigned successfully.' + statusMsg + ' Control remains in main table with original employee.', 'success');

                    // Reload controls in background to sync with server
                    ApiService.loadAllControls().then(function () {
                        // After reload, restore qaEmployeeId from database and ensure status is QA
                        if (ctrl.store.allControls) {
                            ctrl.store.allControls.forEach(function (c) {
                                // Use qaEmployeeId from database (now persisted) or fallback to map
                                if (c.qaEmployeeId) {
                                    // Update map with database value for consistency
                                    ctrl.qaEmployeeMap[c.controlId] = c.qaEmployeeId;
                                } else if (ctrl.qaEmployeeMap[c.controlId]) {
                                    // Fallback to map if database doesn't have it yet (backward compatibility)
                                    c.qaEmployeeId = ctrl.qaEmployeeMap[c.controlId];
                                }

                                // Ensure status is QA if QA Employee is assigned
                                if (c.qaEmployeeId && (!c.statusName || c.statusName.toLowerCase() !== 'qa')) {
                                    // Find QA status
                                    var qaStatusReload = null;
                                    if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                                        qaStatusReload = ctrl.store.statuses.find(function (s) {
                                            return s.statusName && s.statusName.toLowerCase() === 'qa';
                                        });
                                    }
                                    if (qaStatusReload) {
                                        c.statusId = qaStatusReload.id;
                                        c.statusName = qaStatusReload.statusName;
                                    } else {
                                        c.statusName = 'QA';
                                    }
                                }
                            });
                        }

                        // Also update the control object in the view
                        if (control.controlId) {
                            // Use database value if available, otherwise use map
                            var reloadedControl = ctrl.store.allControls.find(function (c) {
                                return c.controlId === control.controlId;
                            });
                            if (reloadedControl && reloadedControl.qaEmployeeId) {
                                control.qaEmployeeId = reloadedControl.qaEmployeeId;
                            } else if (ctrl.qaEmployeeMap[control.controlId]) {
                                control.qaEmployeeId = ctrl.qaEmployeeMap[control.controlId];
                            }

                            // Ensure status is QA
                            if (control.qaEmployeeId && (!control.statusName || control.statusName.toLowerCase() !== 'qa')) {
                                var qaStatusReload = null;
                                if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                                    qaStatusReload = ctrl.store.statuses.find(function (s) {
                                        return s.statusName && s.statusName.toLowerCase() === 'qa';
                                    });
                                }
                                if (qaStatusReload) {
                                    control.statusId = qaStatusReload.id;
                                    control.statusName = qaStatusReload.statusName;
                                } else {
                                    control.statusName = 'QA';
                                }
                            }
                        }

                        // Force view update after reload
                        $timeout(function () {
                            $rootScope.$broadcast('controlsUpdated');
                            if (!$scope.$$phase && !$rootScope.$$phase) {
                                $scope.$apply();
                            }
                        }, 0);
                    });
                }).catch(function (error) {
                    console.error('Error assigning QA Engineer:', error);
                    control.assignQAEmployeeId = null;
                    // Remove from map on error
                    delete ctrl.qaEmployeeMap[control.controlId];
                    var errorMsg = 'Error assigning QA Engineer';
                    if (error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                    }
                    NotificationService.show(errorMsg, 'error');
                });
            }
        };

        // Parse sub descriptions - supports both JSON format (with employee/progress) and plain text format
        ctrl.getSubDescriptionsWithDetails = function (subDescriptionsStr) {
            if (!subDescriptionsStr) return [];

            try {
                // Try to parse as JSON array
                var parsed = JSON.parse(subDescriptionsStr);
                if (Array.isArray(parsed)) {
                    // Validate and ensure all fields exist
                    return parsed.map(function (item) {
                        if (typeof item === 'string') {
                            // Legacy format: plain string
                            return {
                                description: item,
                                employeeId: null,
                                statusId: null,
                                statusName: null,
                                progress: null,
                                releaseId: null,
                                releaseName: null,
                                releaseDateInputFormatted: null,
                                comments: []
                            };
                        }
                        // Get status name from statusId if available
                        var statusName = null;
                        if (item.statusId && ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                            var status = ctrl.store.statuses.find(function (s) {
                                return s.id === item.statusId;
                            });
                            if (status) {
                                statusName = status.statusName;
                            }
                        }

                        // Get release name/date from releaseId if available
                        var releaseName = null;
                        var releaseDate = item.releaseDate || null; // Support direct releaseDate in JSON
                        if (item.releaseId && ctrl.store.releases && ctrl.store.releases.length > 0) {
                            var release = ctrl.store.releases.find(function (r) {
                                return r.releaseId === parseInt(item.releaseId);
                            });
                            if (release) {
                                releaseName = release.releaseName;
                                // If item doesn't have a releaseDate but we found a release, use its date
                                if (!releaseDate) {
                                    releaseDate = release.releaseDate;
                                }
                            }
                        }

                        return {
                            description: item.description || '',
                            employeeId: item.employeeId || null,
                            statusId: item.statusId || null,
                            statusName: statusName,
                            progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                            releaseId: item.releaseId || null,
                            releaseName: releaseName,
                            releaseDate: releaseDate ? new Date(releaseDate) : null,
                            releaseDateInputFormatted: releaseDate ? ctrl.formatDateForInput(releaseDate) : '',
                            comments: item.comments && Array.isArray(item.comments) ? item.comments : [],
                            isNew: item.isNew || false
                        };
                    }).filter(function (item) { return item && item.description && (typeof item.description === 'string' ? item.description.trim().length > 0 : true); });
                }
            } catch (e) {
                // Not JSON, treat as plain text (backward compatibility)
                var lines = subDescriptionsStr.split(/\r?\n|,/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
                return lines.map(function (desc) {
                    return {
                        description: desc,
                        employeeId: null,
                        statusId: null,
                        statusName: null,
                        progress: null,
                        releaseId: null,
                        releaseName: null,
                        releaseDateInputFormatted: null,
                        comments: [],
                        isNew: false
                    };
                });
            }
            return [];
        };

        // Check if a comment is a QA comment
        ctrl.isQAComment = function (commentText) {
            if (!commentText || typeof commentText !== 'string') return false;
            var lowerText = commentText.toLowerCase();
            // Check for various QA comment formats: [QA]:, [QA], [qa]:, [qa]
            // Also check for uppercase [QA] in original text
            var isQA = lowerText.indexOf('[qa]:') !== -1 ||
                lowerText.indexOf('[qa]') !== -1 ||
                lowerText.trim().startsWith('[qa]') ||
                lowerText.indexOf(' [qa]:') !== -1 ||
                lowerText.indexOf(' [qa]') !== -1 ||
                commentText.indexOf('[QA]:') !== -1 ||
                commentText.indexOf('[QA]') !== -1;
            return isQA;
        };

        // Check if sub description status is QA
        ctrl.isSubDescQAStatus = function (statusId) {
            if (!statusId || !ctrl.store.statuses) return false;
            var status = ctrl.store.statuses.find(function (s) {
                return s.id === statusId;
            });
            if (status && status.statusName) {
                var statusName = status.statusName.toLowerCase();
                return statusName === 'qa';
            }
            return false;
        };

        // Handle sub description status change
        ctrl.onSubDescStatusChange = function (control, subDescIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) return;
            var subDesc = control.editSubDescriptionsArray[subDescIndex];

            // Get status name from statusId and update progress automatically
            if (subDesc.statusId && ctrl.store.statuses) {
                var status = ctrl.store.statuses.find(function (s) {
                    return s.id === subDesc.statusId;
                });
                if (status) {
                    subDesc.statusName = status.statusName;

                    // Automatically set progress based on status
                    var progressMap = {
                        'Analyze': 25,
                        'Development': 50,
                        'Dev Testing': 75,
                        'QA': 100
                    };
                    var newProgress = progressMap[status.statusName];
                    if (newProgress !== undefined) {
                        subDesc.progress = newProgress;
                    }
                }
            }

            // If status is QA and employee is not a QA Engineer, clear employee selection
            if (ctrl.isSubDescQAStatus(subDesc.statusId) && subDesc.employeeId) {
                var employee = ctrl.store.employees.find(function (emp) {
                    return emp.id === subDesc.employeeId;
                });
                if (employee && employee.user && employee.user.role) {
                    var role = employee.user.role.toLowerCase();
                    if (role !== 'qa engineer' && role !== 'qa' && role !== 'intern qa engineer') {
                        subDesc.employeeId = null;
                        NotificationService.show('Status is QA. Please select a QA Engineer.', 'info');
                    }
                }
            }

            ctrl.updateEditSubDescriptions(control);
        };

        // Handle sub description progress change - auto-advance status if progress reaches 100%
        ctrl.onSubDescProgressChange = function (control, subDescIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) return;
            var subDesc = control.editSubDescriptionsArray[subDescIndex];

            // Auto-advance status if progress is 100%, then reset progress to 0
            if (subDesc.statusId && subDesc.progress === 100 && ctrl.store.statuses) {
                var currentStatus = ctrl.store.statuses.find(function (s) {
                    return s.id === subDesc.statusId;
                });
                if (currentStatus && currentStatus.statusName) {
                    var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                    if (nextStatus) {
                        subDesc.statusId = nextStatus.id;
                        subDesc.statusName = nextStatus.statusName;
                        // Reset progress to 0% for next status
                        subDesc.progress = 0;
                        NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                    }
                }
            }

            ctrl.updateEditSubDescriptions(control);
        };

        // Handle sub description inline progress change
        ctrl.onSubDescInlineProgressChange = function (subDesc) {
            if (!subDesc || !subDesc.editModel || !ctrl.store.statuses) return;
            var model = subDesc.editModel;
            if (model.statusId && model.progress === 100) {
                var currentStatus = ctrl.store.statuses.find(function (s) {
                    return s.id === model.statusId;
                });
                if (currentStatus && currentStatus.statusName) {
                    var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                    if (nextStatus) {
                        model.statusId = nextStatus.id;
                        // Reset progress to 0% for next status
                        model.progress = 0;
                        NotificationService.show('Sub-task ' + currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                    }
                }
            }
        };

        // Update editSubDescriptions string from array
        // Get next status after current status
        ctrl.getNextStatus = function (currentStatusName) {
            if (!currentStatusName || !ctrl.store.statuses) return null;
            var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA'];
            var currentIndex = statusOrder.findIndex(function (s) {
                return s.toLowerCase() === currentStatusName.toLowerCase();
            });
            if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                var nextStatusName = statusOrder[currentIndex + 1];
                return ctrl.store.statuses.find(function (s) {
                    return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                });
            }
            return null;
        };

        ctrl.updateEditSubDescriptions = function (control) {
            if (control.editSubDescriptionsArray) {
                // Filter out empty descriptions and include statusId
                var validSubDescs = control.editSubDescriptionsArray.filter(function (item) {
                    return item && item.description && item.description.trim().length > 0;
                }).map(function (item) {
                    var progressValue = item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null;
                    var statusId = item.statusId ? parseInt(item.statusId) : null;
                    var statusName = null;

                    // Auto-advance status if progress is 100%, then reset progress to 0
                    if (statusId && progressValue === 100 && ctrl.store.statuses) {
                        var currentStatus = ctrl.store.statuses.find(function (s) {
                            return s.id === statusId;
                        });
                        if (currentStatus && currentStatus.statusName) {
                            var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                            if (nextStatus) {
                                statusId = nextStatus.id;
                                statusName = nextStatus.statusName;
                                // Reset progress to 0% for next status
                                progressValue = 0;
                                NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                            }
                        }
                    }

                    // If statusName not set, get it from statusId
                    if (!statusName && statusId && ctrl.store.statuses) {
                        var status = ctrl.store.statuses.find(function (s) {
                            return s.id === statusId;
                        });
                        if (status) {
                            statusName = status.statusName;
                        }
                    }

                    return {
                        description: item.description.trim(),
                        employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                        statusId: statusId,
                        statusName: statusName,
                        progress: progressValue,
                        releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                        releaseDate: item.releaseDateInputFormatted ? new Date(item.releaseDateInputFormatted) : (item.releaseDate ? new Date(item.releaseDate) : null),
                        comments: item.comments && Array.isArray(item.comments) ? item.comments : [],
                        isNew: item.isNew || false
                    };
                });
                control.editSubDescriptions = JSON.stringify(validSubDescs);

                // Update the editSubDescriptionsArray with new status and progress values
                control.editSubDescriptionsArray.forEach(function (item, index) {
                    if (validSubDescs[index]) {
                        item.statusId = validSubDescs[index].statusId;
                        item.statusName = validSubDescs[index].statusName;
                        item.progress = validSubDescs[index].progress;
                    }
                });
            }
        };

        // Add a new sub description to array (isNew highlights the row until save)
        ctrl.addSubDescriptionToArray = function (control) {
            if (!control.editSubDescriptionsArray) {
                control.editSubDescriptionsArray = [];
            }
            control.editSubDescriptionsArray.push({
                description: '',
                employeeId: null,
                statusId: null,
                statusName: null,
                progress: null,
                comments: [],
                isNew: true
            });
            ctrl.updateEditSubDescriptions(control);
        };

        // Remove a sub description from array by index (edit mode)
        ctrl.removeSubDescriptionFromArray = function (control, index) {
            if (control.editSubDescriptionsArray && index >= 0 && index < control.editSubDescriptionsArray.length) {
                control.editSubDescriptionsArray.splice(index, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };


        // Format comment date to MM/DD/YYYY format
        ctrl.formatCommentDate = function (dateStr) {
            if (!dateStr) return '';
            try {
                var date = new Date(dateStr);
                if (isNaN(date.getTime())) return dateStr;
                var day = String(date.getDate()).padStart(2, '0');
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var year = date.getFullYear();
                return month + '/' + day + '/' + year;
            } catch (e) {
                return dateStr;
            }
        };

        // Add a comment to a sub-description
        ctrl.addCommentToSubDescription = function (control, subDescIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) {
                return;
            }
            var subDesc = control.editSubDescriptionsArray[subDescIndex];
            if (!subDesc.newComment || !subDesc.newComment.trim()) {
                return;
            }

            // Initialize comments array if it doesn't exist
            if (!subDesc.comments || !Array.isArray(subDesc.comments)) {
                subDesc.comments = [];
            }

            // Add new comment with current date
            var now = new Date();
            subDesc.comments.push({
                text: subDesc.newComment.trim(),
                date: now.toISOString()
            });

            // Clear the input
            subDesc.newComment = '';

            // Update the sub-descriptions string
            ctrl.updateEditSubDescriptions(control);
        };

        // Remove a comment from a sub-description
        ctrl.removeCommentFromSubDescription = function (control, subDescIndex, commentIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) {
                return;
            }
            var subDesc = control.editSubDescriptionsArray[subDescIndex];
            if (!subDesc.comments || !Array.isArray(subDesc.comments)) {
                return;
            }
            if (commentIndex >= 0 && commentIndex < subDesc.comments.length) {
                subDesc.comments.splice(commentIndex, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };

        // Parse main comments from string (JSON array or plain text)
        ctrl.getMainCommentsWithDetails = function (commentsStr) {
            if (!commentsStr) return [];
            try {
                // Try to parse as JSON array
                var parsed = JSON.parse(commentsStr);
                if (Array.isArray(parsed)) {
                    return parsed.map(function (comment) {
                        if (typeof comment === 'string') {
                            return {
                                text: comment,
                                date: new Date().toISOString()
                            };
                        } else if (comment && typeof comment === 'object') {
                            return {
                                text: comment.text || comment.comment || String(comment),
                                date: comment.date || comment.dateAdded || new Date().toISOString()
                            };
                        }
                        return comment;
                    });
                }
            } catch (e) {
                // Not JSON, treat as plain text (backward compatibility)
                if (commentsStr.trim().length > 0) {
                    return [{
                        text: commentsStr,
                        date: new Date().toISOString()
                    }];
                }
            }
            return [];
        };


        // Format sub descriptions from string to edit format (backward compatibility)
        ctrl.formatSubDescriptionsForEdit = function (subDescriptionsStr) {
            if (!subDescriptionsStr) return '[]';
            var subDescs = ctrl.getSubDescriptionsWithDetails(subDescriptionsStr);
            return JSON.stringify(subDescs);
        };

        ctrl.onStatusChange = function (control) {
            if (!control.editStatusId) return;
            var selectedStatus = ctrl.store.statuses.find(function (s) {
                return s.id == control.editStatusId;
            });
            if (selectedStatus) {
                var progressMap = { 'Analyze': 25, 'Development': 50, 'Dev Testing': 75, 'QA': 100 };
                var newProgress = progressMap[selectedStatus.statusName];
                if (newProgress !== undefined) {
                    control.editProgress = newProgress;
                }

                // Auto-save status and progress
                ctrl.autoSaveStatus(control, selectedStatus.id, newProgress, selectedStatus.statusName);
            }
        };

        // Auto-save function for status changes
        ctrl.autoSaveStatus = function (control, statusId, progressValue, statusName) {
            if (!control.controlId) {
                NotificationService.show('Cannot save: No control ID', 'error');
                return;
            }

            // Prevent multiple simultaneous saves
            if (control.savingStatus) {
                return;
            }

            control.savingStatus = true;

            // Ensure progress is valid
            if (progressValue === undefined || progressValue === null) {
                progressValue = control.progress || 0;
            }
            progressValue = parseInt(progressValue) || 0;
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            var payload = {
                controlId: parseInt(control.controlId),
                statusId: parseInt(statusId),
                progress: progressValue
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Get status name from response or use passed statusName
                var finalStatusName = updatedControl.statusName || statusName || '';

                // Update control object
                control.statusId = updatedControl.statusId;
                control.statusName = finalStatusName;
                control.progress = progressValue;
                control.editProgress = progressValue;

                // Update in store
                if (ctrl.store && ctrl.store.allControls) {
                    ctrl.store.allControls.forEach(function (storeControl) {
                        if (parseInt(storeControl.controlId) === parseInt(control.controlId)) {
                            storeControl.statusId = updatedControl.statusId;
                            storeControl.statusName = finalStatusName;
                            storeControl.progress = progressValue;
                            storeControl._updated = new Date().getTime();
                        }
                    });
                }

                // Show success notification
                NotificationService.show('Status updated to ' + finalStatusName + ' and saved', 'success');

                // Broadcast update
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (err) {
                console.error('Error auto-saving status:', err);
                NotificationService.show('Error saving status', 'error');
            }).finally(function () {
                control.savingStatus = false;
            });
        };

        ctrl.saveControl = function (c) {
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


            // Check releaseDateInputFormatted first (string format from date input)
            // Then check editReleaseDate (from edit mode) or releaseDateInput (Date object)
            var dateToUse = null;
            if (c.releaseDateInputFormatted instanceof Date) {
                dateToUse = c.releaseDateInputFormatted;
            } else if (typeof c.releaseDateInputFormatted === 'string' && c.releaseDateInputFormatted.trim() !== '') {
                // Use the formatted string from date input
                dateToUse = new Date(c.releaseDateInputFormatted.trim());
            } else if (c.editReleaseDate) {
                // Use editReleaseDate if in edit mode
                dateToUse = c.editReleaseDate;
            } else if (c.releaseDateInput) {
                // Fallback to releaseDateInput Date object
                dateToUse = c.releaseDateInput;
            }

            // Convert string to Date if needed
            if (dateToUse && typeof dateToUse === 'string') {
                dateToUse = new Date(dateToUse);
            }

            if (dateToUse && !isNaN(dateToUse.getTime())) {
                var selectedDate = new Date(dateToUse);
                // Set time to noon to avoid timezone-based date shift
                selectedDate.setHours(12, 0, 0, 0);
                releaseDateISO = selectedDate.toISOString();

                var matchingRelease = ctrl.store.releases.find(function (r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });

                if (matchingRelease) {
                    releaseId = matchingRelease.releaseId;
                } else {
                    var matchingUpcomingRelease = ctrl.store.upcomingReleases.find(function (r) {
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

            // Handle main control status auto-advancement when progress reaches 100%
            if (progressValue === 100 && (statusId || c.statusId) && ctrl.store.statuses) {
                var currentStatusId = statusId || c.statusId;
                var currentStatus = ctrl.store.statuses.find(function (s) {
                    return s.id === currentStatusId;
                });
                if (currentStatus && currentStatus.statusName) {
                    var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                    if (nextStatus) {
                        statusId = nextStatus.id;
                        // Reset progress to 0% for next status
                        progressValue = 0;
                        NotificationService.show('Main task ' + currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                    }
                }
            }

            // If assigning/changing employee, check if they are QA Engineer and set status to QA
            if (employeeId && (!statusId || statusId === c.statusId)) {
                var assignedEmployee = ctrl.store.employees.find(function (emp) {
                    return emp.id === employeeId;
                });
                if (assignedEmployee && assignedEmployee.user && assignedEmployee.user.role) {
                    var employeeRole = assignedEmployee.user.role.toLowerCase();
                    if (employeeRole === 'qa engineer' || employeeRole === 'qa' || employeeRole === 'intern qa engineer') {
                        // Find QA status from statuses list
                        ctrl.ensureStatusesLoaded();
                        if (ctrl.store.statuses && ctrl.store.statuses.length > 0) {
                            var qaStatus = ctrl.store.statuses.find(function (s) {
                                return s.statusName && s.statusName.toLowerCase() === 'qa';
                            });
                            if (qaStatus) {
                                statusId = qaStatus.id;
                            }
                        }
                    }
                }
            }

            if (!typeId) {
                NotificationService.show('Type ID is required', 'error');
                return;
            }

            c.saving = true;

            var saveControlWithPayload = function (finalReleaseId, finalReleaseDate) {
                // Process sub descriptions - serialize array to JSON
                var subDescriptionsValue = null;
                if (c.editSubDescriptionsArray && c.editSubDescriptionsArray.length > 0) {
                    // Filter out empty descriptions and ensure proper format
                    var validSubDescs = c.editSubDescriptionsArray.filter(function (item) {
                        return item && item.description && item.description.trim().length > 0;
                    }).map(function (item) {
                        var subStatusId = item.statusId ? parseInt(item.statusId) : null;
                        var subProgress = item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null;
                        var subStatusName = item.statusName;

                        // Auto-advance sub-description status if progress is 100%, then reset progress to 0
                        if (subStatusId && subProgress === 100 && ctrl.store.statuses) {
                            var currentStatus = ctrl.store.statuses.find(function (s) {
                                return s.id === subStatusId;
                            });
                            if (currentStatus && currentStatus.statusName) {
                                var nextStatus = ctrl.getNextStatus(currentStatus.statusName);
                                if (nextStatus) {
                                    subStatusId = nextStatus.id;
                                    subStatusName = nextStatus.statusName;
                                    // Reset progress to 0% for next status
                                    subProgress = 0;
                                    NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                                }
                            }
                        }

                        return {
                            description: item.description.trim(),
                            employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                            statusId: subStatusId,
                            statusName: subStatusName,
                            progress: subProgress,
                            releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                            releaseDate: item.releaseDateInputFormatted ? new Date(item.releaseDateInputFormatted) : (item.releaseDate ? new Date(item.releaseDate) : null),
                            comments: item.comments && Array.isArray(item.comments) ? item.comments : []
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

                return ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
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
                            ApiService.loadStatuses().then(function () {
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
                        // Update cached main comments array
                        if (updatedControl.comments) {
                            c._mainCommentsArray = ctrl.getMainCommentsWithDetails(updatedControl.comments);
                        } else {
                            c._mainCommentsArray = [];
                        }
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
                            ctrl.store.allControls.forEach(function (storeControl) {
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
                                    // Update cached main comments array
                                    if (updatedControl.comments) {
                                        storeControl._mainCommentsArray = ctrl.getMainCommentsWithDetails(updatedControl.comments);
                                    } else {
                                        storeControl._mainCommentsArray = [];
                                    }
                                    storeControl.employeeId = updatedControl.employeeId;
                                    if (updatedControl.releaseDate) {
                                        storeControl.releaseDate = new Date(updatedControl.releaseDate);
                                        storeControl.releaseDateInput = new Date(updatedControl.releaseDate);
                                        storeControl.releaseDateInputFormatted = ctrl.formatDateForInput(updatedControl.releaseDate);
                                    } else {
                                        storeControl.releaseDate = null;
                                        storeControl.releaseDateInput = null;
                                        storeControl.releaseDateInputFormatted = '';
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
                        $timeout(function () {
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
                        ApiService.loadReleases().then(function () {
                            return ApiService.loadAllControls();
                        }).then(function () {
                            // After reload, ensure status is still correct
                            var progressNum = parseInt(updatedControl.progress) || 0;
                            if (isNaN(progressNum)) progressNum = 0;
                            if (progressNum < 0) progressNum = 0;
                            if (progressNum > 100) progressNum = 100;

                            if (ctrl.store.allControls) {
                                ctrl.store.allControls.forEach(function (storeControl) {
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
                            $timeout(function () {
                                // Broadcast event to notify other components
                                $rootScope.$broadcast('controlsUpdated');
                                if (!$scope.$$phase && !$rootScope.$$phase) {
                                    $scope.$apply();
                                }
                            }, 0);
                        }).catch(function (error) {
                            console.error('Error reloading controls:', error);
                        });
                    }
                }).catch(function (error) {
                    c.saving = false;
                    console.error('Error saving control:', error);
                    var errorMsg = 'Error saving';
                    if (error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                    }
                    NotificationService.show(errorMsg, 'error');
                });
            };

            if (needsReleaseCreation && releaseDataToCreate) {
                ApiService.addRelease(releaseDataToCreate).then(function (createdRelease) {
                    saveControlWithPayload(createdRelease.releaseId, releaseDateISO);
                }).catch(function (error) {
                    console.error('Error creating release:', error);
                    saveControlWithPayload(null, releaseDateISO);
                });
            } else {
                saveControlWithPayload(releaseId, releaseDateISO);
            }
        };

        ctrl.addComment = function (c) {
            if (!c.newProgressComment) return;
            var d = new Date();
            var txt = (d.getMonth() + 1) + '/' + d.getDate() + ': ' + c.newProgressComment;
            var newComm = (c.comments ? c.comments + '\n' : '') + txt;

            var payload = angular.copy(c);
            payload.comments = newComm;
            delete payload.editing; delete payload.statusName; delete payload.typeName; delete payload.releaseDateInput;

            ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
                c.comments = updatedControl.comments;
                c.newProgressComment = '';
                NotificationService.show('Comment added', 'success');
            }).catch(function (error) {
                console.error('Error adding comment:', error);
                NotificationService.show('Error adding comment', 'error');
            });
        };

        ctrl.deleteControl = function (control) {
            // Don't allow deleting placeholder controls (employees without controls)
            if (control.isPlaceholder || !control.controlId) {
                NotificationService.show('Cannot delete: No control assigned to this employee', 'error');
                return;
            }

            if (!confirm('Are you sure you want to delete this control?')) {
                return;
            }

            control.deleting = true;
            ApiService.deleteControl(control.controlId).then(function () {
                // Immediately remove from allControls array so it disappears from all views instantly
                var index = ctrl.store.allControls.findIndex(c => c.controlId === control.controlId);
                if (index > -1) {
                    ctrl.store.allControls.splice(index, 1);
                }
                NotificationService.show('Control deleted successfully', 'success');
                // Broadcast event immediately to notify all components
                $rootScope.$broadcast('controlsUpdated');
                // Reload controls to ensure consistency with backend
                ApiService.loadAllControls();
            }).catch(function (error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                NotificationService.show('Error deleting control', 'error');
            });
        };
    }
});
