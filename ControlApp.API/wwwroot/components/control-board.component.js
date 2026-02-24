app.component('controlBoard', {
    template: `
    <div class="card shadow-lg border-0" style="border-radius: 24px; overflow: visible; height: 85vh; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); display: flex; flex-direction: column; animation: fadeIn 0.6s ease-out;">
        <!-- Card Header with Gradient and Actions -->
        <div class="card-header border-0 shadow-sm" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 1.5rem 2rem; border-radius: 24px 24px 0 0; overflow: visible; z-index: 100;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div class="d-flex align-items-center">
                    <div class="header-icon-circle me-3" style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                        <i class="fas fa-list-check text-white fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-0 fw-bold text-white">System Controls Board</h4>
                        <p class="text-white-50 mb-0 small mt-1">Manage and monitor live system controls and project tasks</p>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-glass-light btn-sm px-3 py-2" ng-if="$ctrl.canEditControl()" ng-click="$ctrl.showAddControlModal = true">
                        <i class="fas fa-plus-circle me-2"></i>New Control
                    </button>
                    <button class="btn btn-glass-light btn-sm px-3 py-2" ng-click="$ctrl.toggleFilters()">
                        <i class="fas" ng-class="$ctrl.filtersCollapsed ? 'fa-filter' : 'fa-chevron-up'"></i>
                        <span class="ms-2">{{$ctrl.filtersCollapsed ? 'Show Filters' : 'Hide Filters'}}</span>
                    </button>
                    <div class="badge bg-white text-success px-3 py-2 rounded-pill shadow-sm fw-bold">
                        {{$ctrl.getAllControls().length}} Active Controls
                    </div>
                </div>
            </div>

            <!-- Enhanced Filters Area (Glassmorphism) -->
            <div class="mt-4 p-3 rounded-4 mx-auto shadow-sm" ng-show="!$ctrl.filtersCollapsed" 
                 ng-class="{'filter-area-active': !$ctrl.filtersCollapsed}"
                 style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); animation: slideDown 0.3s ease-out; position: relative; z-index: 110; width: fit-content; max-width: 98%;">
                <div class="d-flex flex-wrap justify-content-center align-items-center gap-3">
                    <div style="min-width: 180px;">
                        <div class="input-group input-group-sm rounded-3 overflow-hidden shadow-sm">
                            <span class="input-group-text bg-white border-0 text-success"><i class="fas fa-search"></i></span>
                            <input type="text" class="form-control border-0" ng-model="$ctrl.searchText" placeholder="Search...">
                        </div>
                    </div>
                    <div style="min-width: 180px;">
                        <select class="form-select form-select-sm border-0 shadow-sm rounded-3 scrollable-filter-dropdown" 
                                ng-model="$ctrl.selectedTypeFilter" 
                                ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes"
                                ng-mousedown="$ctrl.toggleSelectSize($event, 8)"
                                ng-blur="$ctrl.resetSelectSize($event)">
                            <option value="">All Categories</option>
                        </select>
                    </div>
                    <div style="min-width: 180px;">
                        <select class="form-select form-select-sm border-0 shadow-sm rounded-3 scrollable-filter-dropdown" 
                                ng-model="$ctrl.selectedEmployeeFilter" 
                                ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForCurrentTeam()"
                                ng-mousedown="$ctrl.toggleSelectSize($event, 8)"
                                ng-blur="$ctrl.resetSelectSize($event)">
                            <option value="">All Assignees</option>
                        </select>
                    </div>
                    <div style="min-width: 180px;">
                        <select class="form-select form-select-sm border-0 shadow-sm rounded-3 scrollable-filter-dropdown adaptive-width" 
                                ng-model="$ctrl.selectedDescriptionFilter"
                                ng-options="desc as desc for desc in $ctrl.getUniqueDescriptions()"
                                ng-mousedown="$ctrl.toggleSelectSize($event, 8)"
                                ng-blur="$ctrl.resetSelectSize($event)">
                            <option value="">Objectives</option>
                        </select>
                    </div>
                    <div style="min-width: 180px;">
                        <div class="input-group input-group-sm rounded-3 overflow-hidden shadow-sm">
                            <span class="input-group-text bg-white border-0 text-success"><i class="fas fa-calendar-day"></i></span>
                            <input type="date" class="form-control border-0" ng-model="$ctrl.selectedReleaseDateFilter">
                            <button class="btn btn-white border-0" ng-click="$ctrl.clearReleaseDateFilter()" ng-if="$ctrl.selectedReleaseDateFilter">
                                <i class="fas fa-times text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="card-body p-0 d-flex flex-column" style="min-height: 0; background: #f8fafc; border-radius: 0 0 24px 24px; overflow: hidden;">
            <div class="table-responsive flex-grow-1" style="overflow-y: auto;">
                <table class="table align-middle mb-0" style="border-collapse: separate; border-spacing: 0 12px; padding: 0 1.5rem;">
                    <thead class="sticky-top shadow-sm" style="background: #f1f5f9; z-index: 10;">
                        <tr class="text-secondary small fw-bold text-uppercase">
                            <th class="py-3 ps-4" style="width: 120px; border-bottom: 2px solid #e2e8f0;">Category</th>
                            <th class="py-3" style="border-bottom: 2px solid #e2e8f0;">Control Details & Progression</th>

                        </tr>
                    </thead>
                    
                    <tbody ng-if="!$ctrl.selectedTypeFilter">
                        <!-- Empty State -->
                        <tr ng-if="$ctrl.getAllControls().length === 0">
                            <td colspan="2" class="text-center py-5">
                                <div class="py-5">
                                    <i class="fas fa-folder-open fa-4x text-light mb-3"></i>
                                    <h5 class="text-secondary fw-bold">No Controls Found</h5>
                                    <p class="text-muted">Start by adding a new system control to your board.</p>
                                </div>
                            </td>
                        </tr>

                        <!-- Flat Control List -->
                        <tr ng-repeat="control in $ctrl.getPaginatedResults($ctrl.getAllControls() | orderBy:'-controlId') track by (control.controlId || control.employeeId)"
                            class="control-row-container"
                            ng-style="$ctrl.getRowColorByType(control.typeName)">
                            <td class="ps-4">
                                <span class="badge rounded-pill px-3 py-2 fw-bold shadow-sm" 
                                      style="background: rgba(255,255,255,0.9); color: #059669; border: 1px solid rgba(5,150,105,0.2);">
                                    <i class="fas fa-tag me-1"></i>{{control.typeName}}
                                </span>
                            </td>
                            <td class="py-3">
                                <div class="control-content-card p-3 rounded-4 shadow-sm" style="background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.03); max-height: 60vh; overflow-y: auto;">
                                    <div ng-if="!control.editing">
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <h6 class="fw-bold text-dark mb-0 fs-5 line-height-base">{{control.description}}</h6>
                                            <div class="d-flex gap-2 align-items-center">
                                                <span class="badge bg-light text-success border border-success-subtle rounded-3 py-2 px-3 fw-bold" ng-if="control.releaseDate">
                                                    <i class="fas fa-calendar-check me-2"></i>Deadline: {{$ctrl.formatDate(control.releaseDate)}}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Sub-descriptions Table Redesign - One Row at a Time with Navigation -->
                                        <div ng-if="control._subDescriptionsArray && control._subDescriptionsArray.length > 0">
                                            <!-- Navigation Controls -->
                                            <div class="d-flex justify-content-between align-items-center mb-2 p-2 rounded-3" style="background: #f1f5f9;">
                                                <button class="btn btn-sm btn-outline-success" ng-click="control._currentSubIndex = (control._currentSubIndex || 0) - 1" ng-disabled="(control._currentSubIndex || 0) === 0">
                                                    <i class="fas fa-chevron-left"></i> Previous
                                                </button>
                                                <span class="fw-bold text-secondary">
                                                    Sub-Objective {{(control._currentSubIndex || 0) + 1}} of {{control._subDescriptionsArray.length}}
                                                </span>
                                                <button class="btn btn-sm btn-outline-success" ng-click="control._currentSubIndex = (control._currentSubIndex || 0) + 1" ng-disabled="(control._currentSubIndex || 0) >= control._subDescriptionsArray.length - 1">
                                                    Next <i class="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                            
                                            <div class="table-responsive rounded-4 border overflow-hidden shadow-sm" style="border-color: rgba(0,0,0,0.05) !important;">
                                                <table class="table table-hover table-borderless mb-0 align-middle" style="font-size: 0.95rem;">
                                                    <thead style="background: #f1f5f9;">
                                                        <tr class="small text-secondary fw-bold text-uppercase">
                                                            <th class="ps-3 py-3" style="width: 20%;">Objective</th>
                                                            <th class="py-3" style="width: 13%;">Owner</th>
                                                            <th class="py-3" style="width: 11%;">Status</th>
                                                            <th class="py-3" style="width: 10%;">Progress</th>
                                                            <th class="py-3" style="width: 9%;">Release</th>
                                                            <th class="py-3" style="width: 37%;">Latest Insights</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!-- Show only current sub-objective using limitTo filter -->
                                                        <tr ng-repeat="subDesc in control._subDescriptionsArray | limitTo:1:(control._currentSubIndex || 0) track by $index" 
                                                            style="border-bottom: 1px solid #f1f5f9; transition: all 0.2s; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
                                                            <td class="ps-3 py-4" style="vertical-align: top;">
                                                                <div ng-if="!subDesc.editing">
                                                                    <div ng-if="!subDesc._showDescriptionPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showDescriptionPicker = true); $event.stopPropagation()" class="fw-bold text-dark" style="font-size: 1rem; line-height: 1.5;" ng-class="{'cursor-pointer hover-underline': $ctrl.canEditSubDescription()}">{{subDesc.description}}</div>
                                                                    <input ng-if="subDesc._showDescriptionPicker" type="text" class="form-control form-control-sm border-success shadow-none py-1 h-auto" style="font-size: 0.9rem;"
                                                                           ng-model="subDesc.description"
                                                                           ng-keypress="$event.keyCode === 13 && $ctrl.updateSubDescriptionFieldQuick(control, subDesc); $event.keyCode === 13 && (subDesc._showDescriptionPicker = false)"
                                                                           ng-blur="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showDescriptionPicker = false"
                                                                           id="subdesc-desc-{{$index}}">
                                                                </div>
                                                                <input ng-if="subDesc.editing" type="text" class="form-control form-control-sm border-success shadow-none" ng-model="subDesc.editModel.description">
                                                            </td>
                                                            <td class="py-4" style="vertical-align: top;">
                                                                <div ng-if="!subDesc.editing" class="d-flex align-items-center">
                                                                    <div ng-if="!subDesc._showOwnerPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showOwnerPicker = true); $event.stopPropagation()" class="d-flex align-items-center" ng-class="{'cursor-pointer hover-underline': $ctrl.canEditSubDescription()}">
                                                                        <div class="avatar-circle-xs me-2" style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display:flex; align-items:center; justify-content:center; font-size: 0.8rem; font-weight: 700;">
                                                                            {{subDesc.employeeId ? ($ctrl.getEmployeeName(subDesc.employeeId).charAt(0)) : '?'}}
                                                                        </div>
                                                                        <span style="font-size: 0.95rem;" ng-class="subDesc.employeeId ? 'text-primary fw-medium' : 'text-danger'">
                                                                            {{subDesc.employeeId ? $ctrl.getEmployeeName(subDesc.employeeId) : 'Unassigned'}}
                                                                        </span>
                                                                    </div>
                                                                    <select ng-if="subDesc._showOwnerPicker" class="form-select form-select-sm border-success py-0 h-auto" style="font-size: 0.85rem;" 
                                                                            ng-model="subDesc.employeeId" 
                                                                            ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForStatus(subDesc.statusName)"
                                                                            ng-change="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showOwnerPicker = false;"
                                                                            ng-blur="subDesc._showOwnerPicker = false">
                                                                        <option value="">Unassigned</option>
                                                                    </select>
                                                                </div>
                                                                <select ng-if="subDesc.editing" class="form-select form-select-sm border-success" ng-model="subDesc.editModel.employeeId" ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForStatus(subDesc.statusName)">
                                                                    <option value="">Unassigned</option>
                                                                </select>
                                                            </td>
                                                            <td class="py-4" style="vertical-align: top;">
                                                                <div ng-if="!subDesc.editing">
                                                                    <span ng-if="!subDesc._showStatusPicker" 
                                                                          ng-click="$ctrl.canEditSubDescription() && (subDesc._showStatusPicker = true); $event.stopPropagation()" 
                                                                          class="badge rounded-pill fw-bold" 
                                                                          ng-class="{'cursor-pointer hover-shadow': $ctrl.canEditSubDescription()}" 
                                                                          ng-style="{'background-color': $ctrl.getStatusColor(subDesc.statusName).bg, 'color': $ctrl.getStatusColor(subDesc.statusName).text}"
                                                                          style="font-size: 0.85rem; letter-spacing: 0.02em; padding: 0.6rem 1.2rem;">
                                                                        {{subDesc.statusName || 'No Status'}}
                                                                    </span>
                                                                    <select ng-if="subDesc._showStatusPicker" class="form-select form-select-sm border-success py-0 h-auto" style="font-size: 0.85rem;" 
                                                                            ng-model="subDesc.statusId" 
                                                                            ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                                                            ng-change="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showStatusPicker = false;"
                                                                            ng-blur="subDesc._showStatusPicker = false">
                                                                    </select>
                                                                </div>
                                                                <select ng-if="subDesc.editing" class="form-select form-select-sm border-success" ng-model="subDesc.editModel.statusId" ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                                                </select>
                                                            </td>
                                                            <td class="py-4" style="vertical-align: top;">
                                                                <div ng-if="!subDesc.editing">
                                                                    <div ng-if="!subDesc._showProgressPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showProgressPicker = true); $event.stopPropagation()" ng-class="{'cursor-pointer': $ctrl.canEditSubDescription()}">
                                                                        <div class="progress rounded-pill shadow-none" style="height: 20px; background: #e2e8f0;">
                                                                             <div class="progress-bar rounded-pill progress-bar-animated" role="progressbar" 
                                                                                  ng-style="{'width': (subDesc.progress || 0) + '%', 'background-color': $ctrl.getStatusColor(subDesc.statusName).bg + ' !important'}">
                                                                             </div>
                                                                        </div>
                                                                        <div class="text-end small fw-bold mt-1" style="font-size: 0.8rem; color: #64748b;">{{subDesc.progress || 0}}%</div>
                                                                    </div>
                                                                    <input ng-if="subDesc._showProgressPicker" type="number" class="form-control form-control-sm border-success py-1 h-auto text-center" style="font-size: 0.85rem; width: 70px;" 
                                                                           ng-model="subDesc.progress" min="0" max="100"
                                                                           ng-keypress="$event.keyCode === 13 && ($ctrl.updateSubDescriptionFieldQuick(control, subDesc) || (subDesc._showProgressPicker = false))"
                                                                           ng-blur="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showProgressPicker = false">
                                                                </div>
                                                                <input ng-if="subDesc.editing" type="number" class="form-control form-control-sm border-success" ng-model="subDesc.editModel.progress" min="0" max="100">
                                                            </td>
                                                            <td class="py-3">
                                                                <div ng-if="!subDesc.editing" class="d-flex align-items-center">
                                                                    <span ng-if="!subDesc._showDatePicker" ng-click="subDesc._showDatePicker = true; $event.stopPropagation()" class="text-success fw-bold cursor-pointer hover-underline" style="font-size: 0.85rem;">
                                                                        <i class="fas fa-calendar-alt me-1 opacity-75"></i>{{$ctrl.formatDate(subDesc.releaseDate) || 'Date'}}
                                                                    </span>
                                                                    <input ng-if="subDesc._showDatePicker" type="date" class="form-control form-control-sm border-success p-1 h-auto" style="width: 110px; font-size: 0.8rem;" 
                                                                           ng-model="subDesc.releaseDateInputFormatted" 
                                                                           ng-change="$ctrl.updateSubDescriptionReleaseQuick(control, subDesc, $index); subDesc._showDatePicker = false;"
                                                                           ng-blur="subDesc._showDatePicker = false">
                                                                </div>
                                                                <input ng-if="subDesc.editing" type="date" class="form-control form-control-sm border-success h-auto" ng-model="subDesc.editModel.releaseDateInputFormatted">
                                                            </td>
                                                            <td class="py-4" style="vertical-align: top;">
                                                                <!-- Comments Section with Scroll -->
                                                                <div>
                                                                    <!-- Comments List - Scrollable -->
                                                                    <div class="comment-scroller" style="max-height: 180px; overflow-y: auto; margin-bottom: 0.5rem; padding-right: 0.5rem;">
                                                                        <!-- Date Groups -->
                                                                        <div ng-repeat="dateGroup in $ctrl.groupCommentsByDate(subDesc) track by $index" class="mb-3">
                                                                            <!-- Date Header -->
                                                                            <div class="fw-bold text-success mb-2" style="font-size: 0.9rem; padding: 0.25rem 0.5rem; background: #f0fdf4; border-radius: 4px;">[{{dateGroup.date}}]</div>
                                                                            
                                                                            <!-- Comments for this date -->
                                                                            <div ng-repeat="comment in dateGroup.comments track by $index" class="ps-2 mb-2">
                                                                                <div class="d-flex justify-content-between align-items-start p-3 rounded-3 bg-light border-start border-3" style="font-size: 0.95rem; border-color: #10b981 !important; line-height: 1.6;">
                                                                                     <div class="flex-grow-1" ng-if="!comment._editing">
                                                                                         <div ng-click="$ctrl.canEditSubDescription() && !comment.text.includes('[SYSTEM]') && $ctrl.startEditComment(subDesc.comments[comment._originalIndex]); $event.stopPropagation()" 
                                                                                              class="text-dark" 
                                                                                              ng-class="{'cursor-pointer hover-underline': $ctrl.canEditSubDescription() && !comment.text.includes('[SYSTEM]'), 'text-muted fst-italic small': comment.text.includes('[SYSTEM]')}">
                                                                                             <i class="fas fa-history me-1 opacity-50" ng-if="comment.text.includes('[SYSTEM]')"></i>
                                                                                             {{comment.text}}
                                                                                         </div>
                                                                                     </div>
                                                                                    <div class="flex-grow-1" ng-if="comment._editing">
                                                                                        <input type="text" class="form-control form-control-sm border-success shadow-none py-1" style="font-size: 0.9rem;" 
                                                                                               ng-model="comment._editText"
                                                                                               ng-keypress="$event.keyCode === 13 && $ctrl.saveEditedComment(control, comment._originalIndex, $parent.$parent.$index)"
                                                                                               ng-blur="$ctrl.saveEditedComment(control, comment._originalIndex, $parent.$parent.$index)"
                                                                                               id="comment-edit-{{$parent.$parent.$index}}-{{comment._originalIndex}}">
                                                                                    </div>
                                                                                    <button ng-if="$ctrl.canEditSubDescription() && !comment._editing" class="btn btn-link p-0 text-danger ms-2" style="font-size: 0.75rem;" ng-click="$ctrl.deleteCommentFromSubDescription(control, $parent.$parent.$index, comment._originalIndex)" title="Delete">
                                                                                        <i class="fas fa-trash-alt"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div ng-if="!subDesc.comments || subDesc.comments.length === 0" class="text-center py-2 text-muted small">
                                                                            <i class="fas fa-comment-slash opacity-50 me-2"></i>No recent insights
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <!-- Add Comment Input - Always Visible -->
                                                                    <div class="input-group input-group-sm">
                                                                        <input type="text" class="form-control border-0 shadow-none bg-light small" ng-model="subDesc.newComment" placeholder="Add Insight..." ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescriptionQuick(control, $index)" style="font-size: 0.85rem;">
                                                                        <button class="btn btn-success p-1 border-0" ng-click="$ctrl.addCommentToSubDescriptionQuick(control, $index)" ng-disabled="!subDesc.newComment" title="Add Comment">
                                                                            <i class="fas fa-paper-plane px-1" style="font-size: 0.7rem;"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Editing Main Control Form -->
                                    <div ng-if="control.editing" class="p-3 bg-white rounded-4 border border-success-subtle shadow-sm">
                                        <div class="mb-3">
                                            <label class="form-label small fw-bold text-success border-bottom pb-1 mb-2 d-block">Modify Main Objective</label>
                                            <textarea class="form-control border-success shadow-none fs-6 fw-bold" ng-model="control.editDescription" rows="2"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label small fw-bold text-success border-bottom pb-1 mb-2 d-block">Sub-Objective Architecture</label>
                                            <div class="sub-objective-editor-list">
                                                <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" class="mb-3 p-3 bg-light rounded-4 border position-relative" ng-class="{'border-success': subDesc.isNew}">
                                                    <div class="row g-2">
                                                        <div class="col-12 mb-2">
                                                            <input type="text" class="form-control border-0 shadow-none bg-transparent fw-bold" ng-model="subDesc.description" placeholder="Objective Description..." ng-change="$ctrl.updateEditSubDescriptions(control)">
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Status</label>
                                                            <select class="form-select form-select-sm" ng-model="subDesc.statusId" ng-options="s.id as s.statusName for s in $ctrl.store.statuses" ng-change="$ctrl.onSubDescStatusChange(control, $index)"></select>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Assignee</label>
                                                            <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForStatus(subDesc.statusName)"></select>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Progression%</label>
                                                            <input type="number" class="form-control form-control-sm" ng-model="subDesc.progress" min="0" max="100" ng-change="$ctrl.onSubDescProgressChange(control, $index)">
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Release Target</label>
                                                            <input type="date" class="form-control form-control-sm" ng-model="subDesc.releaseDateInputFormatted" ng-change="$ctrl.updateEditModeReleaseDate(subDesc, control)">
                                                        </div>
                                                        <div class="col-md-1 d-flex align-items-end justify-content-center">
                                                            <button class="btn btn-outline-danger btn-sm border-0" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)">
                                                                <i class="fas fa-times-circle fs-5"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline-success btn-sm w-100 rounded-pill border-dashed py-2" ng-click="$ctrl.addSubDescriptionToArray(control)">
                                                <i class="fas fa-plus-circle me-2"></i>Add Next Sub-Objective
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                    
                    <!-- Grouped View (When Category is Selected) -->
                    <tbody ng-repeat="type in $ctrl.getFilteredTypes() track by type.controlTypeId" 
                           ng-if="$ctrl.selectedTypeFilter && $ctrl.getControlsByType(type.controlTypeId).length > 0">
                        <tr class="category-header-row">
                            <td colspan="3" class="ps-4 py-3">
                                <div class="d-flex align-items-center">
                                    <div class="category-indicator me-3" style="width: 8px; height: 32px; border-radius: 4px; background: #6366f1;"></div>
                                    <h5 class="mb-0 fw-bold text-dark">{{type.typeName}} Track <span class="badge bg-indigo-subtle text-indigo ms-2">{{$ctrl.getControlsByType(type.controlTypeId).length}} Items</span></h5>
                                </div>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getPaginatedResults($ctrl.getControlsByType(type.controlTypeId) | orderBy:'-controlId') track by (control.controlId || control.employeeId)"
                            class="control-row-container"
                            ng-style="$ctrl.getRowColorByType(control.typeName)">
                            <td class="ps-4 py-3 align-middle" style="width: 250px;">
                                <div class="d-flex flex-column">
                                    <span class="badge rounded-pill bg-light text-dark shadow-sm border mb-2 align-self-start py-2 px-3 fw-bold" style="font-size: 0.75rem;">
                                        <i class="fas fa-tag me-1 text-primary"></i> {{control.typeName}}
                                    </span>
                                    <span class="text-secondary x-small fw-bold text-uppercase ms-1">Registry ID: #{{control.controlId || 'NEW'}}</span>
                                </div>
                            </td>
                            <td class="py-3 align-middle">
                                <div style="max-height: 38vh; overflow-y: auto; padding-right: 5px;">
                                    <div ng-if="!control.editing">
                                    <div class="mb-2">
                                        <div class="main-desc-box p-3 rounded-4 shadow-sm" style="background: rgba(255,255,255,0.7); border-left: 5px solid #10b981;">
                                            <div class="fw-bold text-dark fs-5 mb-1">{{control.description}}</div>
                                            <div class="d-flex align-items-center gap-3">
                                                <span class="badge fw-medium py-2 px-3 rounded-pill {{$ctrl.getStatusBadgeClass(control.statusName)}}">
                                                    <i class="fas fa-signal me-2"></i>{{control.statusName || 'No Stage'}}
                                                </span>
                                                <div class="v-separator" style="width: 1px; height: 16px; background: #cbd5e1;"></div>
                                                <span class="text-muted small">
                                                    <i class="fas fa-user-circle me-1"></i>
                                                    {{$ctrl.getEmployeeName(control.employeeId) || 'Unassigned'}}
                                                </span>
                                            </div>
                                            <div class="mt-3">
                                                <div class="d-flex justify-content-between align-items-center mb-1">
                                                    <span class="small fw-bold text-secondary text-uppercase" style="font-size: 0.6rem;">Overall Goal Progression</span>
                                                    
                                                    <span ng-if="!control._showQuickProgress" ng-click="control._showQuickProgress = true; $event.stopPropagation()" class="small fw-bold text-indigo cursor-pointer hover-underline" title="Click to edit">{{control.progress || 0}}%</span>
                                                    
                                                    <input ng-if="control._showQuickProgress" type="number" class="form-control form-control-sm border-success py-0 px-1 text-center h-auto d-inline-block shadow-none" style="font-size: 0.8rem; width: 50px;" 
                                                            ng-model="control.progress" min="0" max="100"
                                                            ng-keypress="$event.keyCode === 13 && ($ctrl.updateControlProgressQuick(control) || (control._showQuickProgress = false))"
                                                            ng-blur="$ctrl.updateControlProgressQuick(control); control._showQuickProgress = false"
                                                            auto-focus>
                                                </div>
                                                <div class="progress shadow-sm cursor-pointer" style="height: 6px; background: #e2e8f0; border-radius: 3px;" ng-click="control._showQuickProgress = true; $event.stopPropagation()" title="Click to edit">
                                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
                                                         ng-style="{'width': (control.progress || 0) + '%', 'background': 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)'}"
                                                         aria-valuenow="{{control.progress || 0}}" aria-valuemin="0" aria-valuemax="100">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Dynamic Sub-Description List -->
                                    <div class="sub-tasks-container mt-3" ng-if="control._subDescriptionsArray.length > 0">
                                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="background: rgba(255, 255, 255, 0.5);">
                                            <div class="table-responsive">
                                                <table class="table table-hover table-borderless mb-0 align-middle">
                                                    <thead class="bg-light border-bottom border-light">
                                                        <tr>
                                                            <th class="ps-4 x-small fw-bold text-muted text-uppercase py-3" style="width: 50%;">Objective Unit</th>
                                                            <th class="x-small fw-bold text-muted text-uppercase text-center py-3">Current Health</th>
                                                            <th class="x-small fw-bold text-muted text-uppercase text-center py-3">Deadline</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr ng-repeat="subDesc in control._subDescriptionsArray track by $index" class="sub-objective-row">
                                                            <td class="ps-4 py-3">
                                                                <div ng-if="!subDesc.editing">
                                                                    <div ng-if="!subDesc._showDescriptionPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showDescriptionPicker = true); $event.stopPropagation()" class="fw-bold text-dark" ng-class="{'cursor-pointer hover-underline': $ctrl.canEditSubDescription()}">{{subDesc.description}}</div>
                                                                    <input ng-if="subDesc._showDescriptionPicker" type="text" class="form-control form-control-sm border-success shadow-none py-1 h-auto" style="font-size: 0.9rem;"
                                                                           ng-model="subDesc.description"
                                                                           ng-keypress="$event.keyCode === 13 && $ctrl.updateSubDescriptionFieldQuick(control, subDesc); $event.keyCode === 13 && (subDesc._showDescriptionPicker = false)"
                                                                           ng-blur="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showDescriptionPicker = false">
                                                                </div>
                                                                <div class="d-flex align-items-center gap-2 mt-1">
                                                                    <span ng-if="!subDesc._showOwnerPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showOwnerPicker = true); $event.stopPropagation()" class="x-small text-muted" ng-class="{'cursor-pointer hover-underline': $ctrl.canEditSubDescription()}">
                                                                        <i class="fas fa-user-gear me-1"></i>{{$ctrl.getEmployeeName(subDesc.employeeId) || 'Pending'}}
                                                                    </span>
                                                                    <select ng-if="subDesc._showOwnerPicker" class="form-select form-select-sm border-success py-0 h-auto" style="font-size: 0.65rem; width: 120px;" 
                                                                            ng-model="subDesc.employeeId" 
                                                                            ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForStatus(subDesc.statusName)"
                                                                            ng-change="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showOwnerPicker = false;"
                                                                            ng-blur="subDesc._showOwnerPicker = false">
                                                                        <option value="">Pending</option>
                                                                    </select>

                                                                    <span ng-if="!subDesc._showStatusPicker" ng-click="$ctrl.canEditSubDescription() && (subDesc._showStatusPicker = true); $event.stopPropagation()" class="badge x-small" ng-class="[$ctrl.getStatusBadgeClass(subDesc.statusName), {'cursor-pointer hover-shadow': $ctrl.canEditSubDescription()}]">
                                                                        {{subDesc.statusName || 'STBY'}}
                                                                    </span>
                                                                    <select ng-if="subDesc._showStatusPicker" class="form-select form-select-sm border-success py-0 h-auto" style="font-size: 0.65rem; width: 100px;" 
                                                                            ng-model="subDesc.statusId" 
                                                                            ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                                                            ng-change="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showStatusPicker = false;"
                                                                            ng-blur="subDesc._showStatusPicker = false">
                                                                    </select>
                                                                </div>
                                                            </td>
                                                            <td class="py-3" style="width: 140px;">
                                                                <div class="d-flex flex-column align-items-center">
                                                                    <div ng-if="!subDesc._showProgressPicker" class="w-100 text-center" ng-class="{'cursor-pointer': $ctrl.canEditSubDescription()}" ng-click="$ctrl.canEditSubDescription() && (subDesc._showProgressPicker = true); $event.stopPropagation()">
                                                                        <span class="fw-bold text-indigo small mb-1">{{subDesc.progress}}%</span>
                                                                        <div class="progress rounded-pill w-100" style="height: 6px; background: #e2e8f0;">
                                                                            <div class="progress-bar rounded-pill {{$ctrl.getProgressBgClass(subDesc.statusName)}}" style="width: {{subDesc.progress}}%"></div>
                                                                        </div>
                                                                    </div>
                                                                    <input ng-if="subDesc._showProgressPicker" type="number" class="form-control form-control-sm border-success py-1 h-auto text-center" style="font-size: 0.75rem; width: 60px;" 
                                                                           ng-model="subDesc.progress" min="0" max="100"
                                                                           ng-keypress="$event.keyCode === 13 && ($ctrl.updateSubDescriptionFieldQuick(control, subDesc) || (subDesc._showProgressPicker = false))"
                                                                           ng-blur="$ctrl.updateSubDescriptionFieldQuick(control, subDesc); subDesc._showProgressPicker = false">
                                                                </div>
                                                            </td>
                                                    <td class="py-3 text-center">
                                                        <div class="d-flex flex-column align-items-center">
                                                            <div class="input-group input-group-sm" style="width: 140px;">
                                                                <input type="date" class="form-control form-control-sm border-0 bg-transparent x-small text-muted p-0 text-center fw-bold"
                                                                       ng-model="subDesc.releaseDateInputFormatted"
                                                                       ng-change="$ctrl.updateSubDescriptionReleaseQuick(control, subDesc, $index)">
                                                            </div>
                                                            <div class="x-small text-success fw-bold" ng-if="subDesc.releaseDate"><i class="fas fa-check-circle me-1"></i>Target Acquired</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Quick Comment Bar -->
                                    <div class="mt-3 ps-1">
                                        <div class="input-group shadow-sm rounded-pill overflow-hidden border">
                                            <span class="input-group-text border-0 bg-white ps-3"><i class="fas fa-comment-dots text-primary opacity-50"></i></span>
                                            <input type="text" class="form-control border-0 bg-white" placeholder="Broadcast progress update..." ng-model="control._quickComment" ng-keyup="$event.keyCode === 13 && $ctrl.addQuickComment(control)">
                                            <button class="btn btn-white border-0 px-4" ng-click="$ctrl.addQuickComment(control)"><i class="fas fa-paper-plane text-success fw-bold"></i></button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div ng-if="control.editing" class="edit-mode-container p-3 rounded-4 bg-white shadow-lg border">
                                     <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                         <h6 class="mb-0 text-primary fw-bold"><i class="fas fa-edit me-2"></i>Edit Control Details</h6>
                                         <div class="d-flex gap-2">
                                             <button class="btn btn-sm btn-success px-3 rounded-pill shadow-sm" ng-click="$ctrl.saveControl(control)" ng-disabled="control.saving">
                                                 <i class="fas fa-save me-1"></i>Save
                                             </button>
                                             <button class="btn btn-sm btn-outline-secondary px-3 rounded-pill shadow-sm" ng-click="$ctrl.cancelEdit(control)" ng-disabled="control.saving">
                                                 <i class="fas fa-times me-1"></i>Cancel
                                             </button>
                                         </div>
                                     </div>
                                    <div class="row g-4">
                                        <div class="col-md-6 border-end">
                                            <h6 class="fw-bold text-success mb-3"><i class="fas fa-pen-ruler me-2"></i>Global Blueprint</h6>
                                            <div class="mb-3">
                                                <div class="row g-2">
                                                    <div class="col-md-8">
                                                        <label class="x-small fw-bold text-secondary text-uppercase mb-1">Objective Scope</label>
                                                        <textarea class="form-control form-control-sm" ng-model="control.editDescription" rows="2"></textarea>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="x-small fw-bold text-secondary text-uppercase mb-1">Overall Progression% <span class="badge bg-light text-primary border ms-1">(Currently: {{control.progress}}%)</span></label>
                                                        <input type="number" class="form-control form-control-sm h-100" ng-model="control.editProgress" min="0" max="100" style="font-size: 1.25rem; font-weight: bold;">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-2">
                                                <div class="col-md-6">
                                                    <label class="x-small fw-bold text-secondary text-uppercase mb-1">Lead Liaison</label>
                                                    <select class="form-select form-select-sm" ng-model="control.editEmployeeId" ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForCurrentTeam()"></select>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="x-small fw-bold text-secondary text-uppercase mb-1">Stage Gate</label>
                                                    <select class="form-select form-select-sm" ng-model="control.editStatusId" ng-options="s.id as s.statusName for s in $ctrl.store.statuses" ng-change="$ctrl.onEditStatusChange(control)"></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="fw-bold text-indigo mb-3"><i class="fas fa-layer-group me-2"></i>Sub-Objective Cascade</h6>
                                            <div class="sub-edit-list mb-3" style="max-height: 250px; overflow-y: auto;">
                                                <div ng-repeat="subDesc in control.editSubDescriptionsArray track by $index" class="card card-body p-2 mb-2 bg-light border-0">
                                                    <div class="row g-2">
                                                        <div class="col-md-11">
                                                            <input type="text" class="form-control form-control-sm mb-2" ng-model="subDesc.description" placeholder="Objective name">
                                                        </div>
                                                        <div class="col-md-1 d-flex justify-content-end align-items-center">
                                                            <button class="btn btn-link text-danger p-0" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)"><i class="fas fa-circle-minus"></i></button>
                                                        </div>
                                                        <div class="col-md-5">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Unit Head</label>
                                                            <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-options="e.id as e.employeeName for e in $ctrl.getEmployeesForStatus(subDesc.statusName)"></select>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Progression%</label>
                                                            <input type="number" class="form-control form-control-sm" ng-model="subDesc.progress" min="0" max="100" ng-change="$ctrl.onSubDescProgressChange(control, $index)">
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="x-small fw-bold text-secondary text-uppercase mb-1">Release Target</label>
                                                            <input type="date" class="form-control form-control-sm" ng-model="subDesc.releaseDateInputFormatted" ng-change="$ctrl.updateEditModeReleaseDate(subDesc, control)">
                                                        </div>
                                                        <div class="col-md-1 d-flex align-items-end justify-content-center">
                                                            <button class="btn btn-outline-danger btn-sm border-0" ng-click="$ctrl.removeSubDescriptionFromArray(control, $index)">
                                                                <i class="fas fa-times-circle fs-5"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline-success btn-sm w-100 rounded-pill border-dashed py-2" ng-click="$ctrl.addSubDescriptionToArray(control)">
                                                <i class="fas fa-plus-circle me-2"></i>Add Next Sub-Objective
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div class="card-footer bg-white border-0 py-3 shadow-sm" style="border-radius: 0 0 24px 24px;" 
                 ng-if="(!$ctrl.selectedTypeFilter && $ctrl.getAllControls().length > $ctrl.itemsPerPage) || ($ctrl.selectedTypeFilter && $ctrl.getControlsByType($ctrl.selectedTypeFilter).length > $ctrl.itemsPerPage)">
                <div class="d-flex justify-content-between align-items-center px-4">
                    <div class="text-muted small fw-medium">
                        Showing <span class="text-dark fw-bold">{{($ctrl.currentPage - 1) * $ctrl.itemsPerPage + 1}}</span> to 
                        <span class="text-dark fw-bold">{{$ctrl.Math.min($ctrl.currentPage * $ctrl.itemsPerPage, (!$ctrl.selectedTypeFilter ? $ctrl.getAllControls().length : $ctrl.getControlsByType($ctrl.selectedTypeFilter).length))}}</span> of 
                        <span class="text-dark fw-bold">{{!$ctrl.selectedTypeFilter ? $ctrl.getAllControls().length : $ctrl.getControlsByType($ctrl.selectedTypeFilter).length}}</span> total items
                    </div>
                    
                    <nav aria-label="Control board pagination">
                        <ul class="pagination pagination-sm mb-0 gap-1">
                            <!-- Previous -->
                            <li class="page-item" ng-class="{'disabled': $ctrl.currentPage === 1}">
                                <a class="page-link rounded-pill border-0 shadow-sm px-3" href="" ng-click="$ctrl.prevPage()" style="background: #f1f5f9; color: #64748b;">
                                    <i class="fas fa-chevron-left me-1 small"></i> Previous
                                </a>
                            </li>
                            
                            <!-- Page Numbers -->
                            <li class="page-item" ng-repeat="p in $ctrl.getPages(!$ctrl.selectedTypeFilter ? $ctrl.getAllControls() : $ctrl.getControlsByType($ctrl.selectedTypeFilter))" ng-class="{'active': $ctrl.currentPage === p}">
                                <a class="page-link rounded-circle border-0 shadow-sm d-flex align-items-center justify-content-center" 
                                   href="" ng-click="$ctrl.currentPage = p"
                                   style="width: 32px; height: 32px; transition: all 0.2s;"
                                   ng-style="$ctrl.currentPage === p ? {'background': 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 'color': '#fff', 'transform': 'scale(1.1)'} : {'background': '#f8fafc', 'color': '#64748b'}">
                                    {{p}}
                                </a>
                            </li>

                            <!-- Next -->
                            <li class="page-item" ng-class="{'disabled': $ctrl.currentPage === $ctrl.getTotalPages(!$ctrl.selectedTypeFilter ? $ctrl.getAllControls() : $ctrl.getControlsByType($ctrl.selectedTypeFilter))}">
                                <a class="page-link rounded-pill border-0 shadow-sm px-3" href="" ng-click="$ctrl.nextPage(!$ctrl.selectedTypeFilter ? $ctrl.getAllControls() : $ctrl.getControlsByType($ctrl.selectedTypeFilter))" style="background: #f1f5f9; color: #64748b;">
                                    Next <i class="fas fa-chevron-right ms-1 small"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Add Control Sidebar-style Modal (Simplified for beauty) -->
        <div class="modal-overlay" ng-if="$ctrl.showAddControlModal" ng-click="$ctrl.showAddControlModal = false">
            <div class="modal-content-glass glass-sidebar-modal p-4" ng-click="$event.stopPropagation()">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold text-success mb-0"><i class="fas fa-plus-circle me-2"></i>Init New System Control</h5>
                    <button class="btn-close" ng-click="$ctrl.showAddControlModal = false"></button>
                </div>
                <form>
                    <div class="mb-4">
                        <label class="form-label x-small fw-bold text-uppercase text-muted">System Category</label>
                        <select class="form-select border-0 shadow-sm bg-light" ng-model="$ctrl.newControl.typeId" required>
                            <option value="">-- Select Taxonomy --</option>
                            <option ng-repeat="type in $ctrl.store.controlTypes" value="{{type.controlTypeId}}">{{type.typeName}}</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label x-small fw-bold text-uppercase text-muted">Primary Objective</label>
                        <textarea class="form-control border-0 shadow-sm bg-light" ng-model="$ctrl.newControl.description" placeholder="What is the main goal?" rows="3" required></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="form-label x-small fw-bold text-uppercase text-muted">Lead Assignee (Optional)</label>
                        <select class="form-select border-0 shadow-sm bg-light" ng-model="$ctrl.newControl.employeeId">
                            <option value="">-- Universal Assign --</option>
                            <option ng-repeat="emp in $ctrl.getEmployeesForCurrentTeam()" value="{{emp.id}}">{{emp.employeeName}}</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label x-small fw-bold text-uppercase text-muted">Target Launch Date</label>
                        <input type="date" class="form-control border-0 shadow-sm bg-light" ng-model="$ctrl.newControl.releaseDate">
                    </div>
                    <button class="btn btn-success w-100 py-3 rounded-4 shadow-lg fw-bold mt-2" ng-click="$ctrl.createNewControl()" ng-disabled="$ctrl.isCreatingControl">
                        <i class="fas fa-rocket me-2"></i>{{$ctrl.isCreatingControl ? 'Initializing Control...' : 'Deploy Control to Board'}}
                    </button>
                </form>
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

        // Pagination State
        ctrl.currentPage = 1;
        ctrl.itemsPerPage = 5;
        ctrl.Math = Math;

        ctrl.getPaginatedResults = function (results) {
            if (!results) return [];
            var start = (ctrl.currentPage - 1) * ctrl.itemsPerPage;
            return results.slice(start, start + ctrl.itemsPerPage);
        };

        ctrl.getTotalPages = function (results) {
            if (!results || results.length === 0) return 1;
            return Math.ceil(results.length / ctrl.itemsPerPage);
        };

        ctrl.getPages = function (results) {
            var total = ctrl.getTotalPages(results);
            var pages = [];
            // Show at most 7 page numbers centered around current page
            var startPage = Math.max(1, ctrl.currentPage - 3);
            var endPage = Math.min(total, startPage + 6);
            if (endPage - startPage < 6) {
                startPage = Math.max(1, endPage - 6);
            }
            for (var i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        };

        ctrl.nextPage = function (results) {
            if (ctrl.currentPage < ctrl.getTotalPages(results)) {
                ctrl.currentPage++;
            }
        };

        ctrl.prevPage = function () {
            if (ctrl.currentPage > 1) {
                ctrl.currentPage--;
            }
        };

        // Reset pagination when any filter changes
        $scope.$watchGroup([
            function () { return ctrl.searchText; },
            function () { return ctrl.selectedTypeFilter; },
            function () { return ctrl.selectedEmployeeFilter; },
            function () { return ctrl.selectedDescriptionFilter; },
            function () { return ctrl.selectedReleaseDateFilter; }
        ], function () {
            ctrl.currentPage = 1;
        });

        // UI View Helper Methods for Premium Design
        ctrl.getTypeName = function (typeId) {
            if (!ctrl.store || !ctrl.store.controlTypes) return 'Unknown';
            var type = ctrl.store.controlTypes.find(function (t) { return t.controlTypeId == typeId; });
            return type ? type.typeName : 'Unknown';
        };

        ctrl.getStatusBadgeClass = function (statusName) {
            if (!statusName) return 'bg-light text-muted';
            var s = statusName.toLowerCase().trim();
            if (s.includes('analyze')) return 'bg-indigo-subtle text-indigo border border-indigo-subtle';
            if (s.includes('hld') || s.includes('lld')) return 'bg-orange-subtle text-orange border border-orange-subtle';
            if (s.includes('development') || s === 'dev') return 'bg-blue-subtle text-blue border border-blue-subtle';
            if (s.includes('testing') || s.includes('dev testing')) return 'bg-purple-subtle text-purple border border-purple-subtle';
            if (s.includes('qa')) return 'bg-success-subtle text-success border border-success-subtle';
            if (s.includes('done') || s.includes('complete') || s.includes('deploy')) return 'bg-teal-subtle text-teal border border-teal-subtle';
            return 'bg-primary-subtle text-primary border border-primary-subtle';
        };

        ctrl.getProgressBgClass = function (statusName) {
            if (!statusName) return 'bg-secondary';
            var s = statusName.toLowerCase().trim();
            if (s.includes('analyze')) return 'bg-indigo';
            if (s.includes('hld') || s.includes('lld')) return 'bg-orange';
            if (s.includes('development') || s === 'dev') return 'bg-blue';
            if (s.includes('testing') || s.includes('dev testing')) return 'bg-purple';
            if (s.includes('qa')) return 'bg-success';
            if (s.includes('done') || s.includes('complete') || s.includes('deploy')) return 'bg-teal';
            return 'bg-primary';
        };

        ctrl.addQuickComment = function (control) {
            if (!control._quickComment || !control._quickComment.trim()) return;

            // Add as a main comment if no sub-description is targeted, 
            // but for this premium UI we can just append it to the main comments
            var d = new Date();
            var dateStr = (d.getMonth() + 1) + '/' + d.getDate();
            var commentText = dateStr + ': ' + control._quickComment.trim();

            var payload = angular.copy(control);
            payload.comments = (control.comments ? control.comments + '\n' : '') + commentText;

            // Clean up payload for API
            delete payload.editing; delete payload._subDescriptionsArray; delete payload._quickComment;
            delete payload.statusName; delete payload.typeName; delete payload.releaseDateInput;

            ApiService.updateControl(control.controlId, payload).then(function (updated) {
                control.comments = updated.comments;
                control._quickComment = '';
                NotificationService.show('Broadcast sent successfully', 'success');
                $rootScope.$broadcast('controlsUpdated');
            });
        };
        ctrl.isLocalSave = false;
        ctrl._typeColorCache = {};

        ctrl.toggleFilters = function () {
            ctrl.filtersCollapsed = !ctrl.filtersCollapsed;
        };

        // Scrollable Select Helper Methods
        ctrl.toggleSelectSize = function (event, size) {
            // For native selects, we can use the size attribute to show more items
            // but we only want to do it if there are enough items
            var element = event.target;
            if (element.options.length > size) {
                element.size = size;
                element.style.position = 'absolute';
                element.style.zIndex = '1000';
                element.style.height = 'auto';
            }
        };

        ctrl.resetSelectSize = function (event) {
            var element = event.target;
            element.size = 1;
            element.style.position = 'static';
            element.style.zIndex = 'auto';
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

        // Only Admin, Team Lead, Software Architecture can edit sub-descriptions
        ctrl.canEditSubDescription = function () {
            try {
                return AuthService.canMarkProgress();
            } catch (e) {
                return false;
            }
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
            // Get current team ID from AuthService
            var currentTeamId = AuthService.getTeamId();
            console.log('Loading data for team:', currentTeamId);
            
            // Ensure employees are loaded first
            return ApiService.loadEmployees(currentTeamId);
        }).then(function () {
            // Get current team ID from AuthService
            var currentTeamId = AuthService.getTeamId();
            
            // Load control types for current team
            return ApiService.loadControlTypes(currentTeamId);
        }).then(function () {
            // Get current team ID from AuthService
            var currentTeamId = AuthService.getTeamId();
            console.log('Loading controls for team:', currentTeamId);
            
            // Then load controls for current team
            return ApiService.loadAllControls(currentTeamId);
        }).then(function () {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            // Ensure models are Date objects initially
            ctrl.ensureDateObjects();

            var controlsCount = ctrl.store.allControls ? ctrl.store.allControls.length : 0;
            var employeesCount = ctrl.store.employees ? ctrl.store.employees.length : 0;
            var controlTypesCount = ctrl.store.controlTypes ? ctrl.store.controlTypes.length : 0;
            
            console.log('Controls board initialized:');
            console.log('  - Total controls loaded:', controlsCount);
            console.log('  - Total employees loaded:', employeesCount);
            console.log('  - Total control types loaded:', controlTypesCount);
            console.log('  - Current team ID:', AuthService.getTeamId());

            // Force view update (only if not already in digest cycle)
            if (!$scope.$$phase && !$rootScope.$$phase) {
                $scope.$apply();
            }
        }).catch(function (error) {
            console.error('Error initializing controls board:', error);
            NotificationService.show('Error loading controls data', 'error');
        });

        // Listen for team changes and reload controls
        var teamChangedListener = $rootScope.$on('teamChanged', function(event, data) {
            console.log('Team changed event received:', data);
            console.log('Team changed to:', data ? data.teamId : 'null');
            
            // Reset filters and pagination when team changes
            ctrl.searchText = '';
            ctrl.selectedTypeFilter = null;
            ctrl.selectedEmployeeFilter = null;
            ctrl.selectedDescriptionFilter = null;
            ctrl.selectedReleaseDateFilter = null;
            ctrl.currentPage = 1;
            
            var teamId = data ? data.teamId : null;
            
            // Ensure teamId is properly converted (handle string/number mismatch)
            if (teamId !== null && teamId !== undefined) {
                teamId = parseInt(teamId);
            }
            
            console.log('Reloading data for team:', teamId, '(parsed)');
            
            // Reload all data for new team
            console.log('Starting data reload for team:', teamId);
            
            ApiService.loadEmployees(teamId).then(function(employees) {
                console.log('✓ Employees loaded for team:', teamId, 'Count:', employees ? employees.length : 0);
                
                // Verify employees belong to the selected team (if teamId is provided)
                if (teamId && employees && employees.length > 0) {
                    var employeesFromOtherTeams = employees.filter(function(emp) {
                        var empTeamId = emp.teamId ? parseInt(emp.teamId) : null;
                        return empTeamId !== null && empTeamId !== teamId;
                    });
                    if (employeesFromOtherTeams.length > 0) {
                        console.warn('⚠ Warning: Found employees from other teams:', employeesFromOtherTeams.length);
                        console.warn('Expected teamId:', teamId, 'Found teamIds:', employeesFromOtherTeams.map(function(e) { return e.teamId; }));
                    } else {
                        console.log('✓ All employees belong to team:', teamId);
                    }
                } else if (teamId && (!employees || employees.length === 0)) {
                    console.warn('⚠ No employees found for team:', teamId);
                }
                
                return ApiService.loadControlTypes(teamId);
            }).then(function(controlTypes) {
                console.log('✓ Control types loaded for team:', teamId, 'Count:', controlTypes ? controlTypes.length : 0);
                return ApiService.loadAllControls(teamId);
            }).then(function(controls) {
                console.log('✓ Controls loaded for team:', teamId, 'Count:', controls ? controls.length : 0);
                
                // Update store reference to ensure it's current
                ctrl.store = ApiService.data;
                ctrl.ensureDateObjects();
                
                var controlsCount = ctrl.store.allControls ? ctrl.store.allControls.length : 0;
                var employeesCount = ctrl.store.employees ? ctrl.store.employees.length : 0;
                var controlTypesCount = ctrl.store.controlTypes ? ctrl.store.controlTypes.length : 0;
                
                console.log('Controls board reloaded for team:', teamId);
                console.log('  - Total controls:', controlsCount);
                console.log('  - Total employees:', employeesCount);
                console.log('  - Total control types:', controlTypesCount);
                
                // Log employee team distribution for debugging
                if (ctrl.store.employees && ctrl.store.employees.length > 0) {
                    var teamDistribution = {};
                    ctrl.store.employees.forEach(function(emp) {
                        var empTeamId = emp.teamId || 'null';
                        teamDistribution[empTeamId] = (teamDistribution[empTeamId] || 0) + 1;
                    });
                    console.log('Employee team distribution:', teamDistribution);
                }
                
                // Force view update - use $timeout to ensure digest cycle runs after data is loaded
                $timeout(function() {
                    // Verify teamId is still correct - force fresh read from localStorage
                    // This ensures we get the latest teamId even if user object was cached
                    var verifyTeamId = AuthService.getTeamId();
                    if (verifyTeamId !== null && verifyTeamId !== undefined) {
                        verifyTeamId = parseInt(verifyTeamId);
                    }
                    console.log('View update - verifying teamId:', verifyTeamId, 'Expected:', teamId);
                    
                    // If teamId doesn't match, it means localStorage wasn't updated properly
                    if (teamId !== null && verifyTeamId !== teamId) {
                        console.warn('WARNING: TeamId mismatch! Expected:', teamId, 'Got:', verifyTeamId);
                        console.warn('This might indicate localStorage update issue');
                    }
                    
                    // Ensure store reference is current
                    ctrl.store = ApiService.data;
                    
                    // Trigger digest cycle to update the view
                    try {
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$apply();
                        }
                    } catch (e) {
                        // Already in digest cycle, which is fine
                        console.log('Already in digest cycle');
                    }
                    
                    // Log final state for debugging
                    var finalControlsCount = ctrl.store.allControls ? ctrl.store.allControls.length : 0;
                    var finalEmployeesCount = ctrl.store.employees ? ctrl.store.employees.length : 0;
                    console.log('View update complete - Controls:', finalControlsCount, 'Employees:', finalEmployeesCount);
                    
                    // Force multiple updates to ensure view reflects the changes
                    // This is needed because getAllControls() is called during digest cycle
                    $timeout(function() {
                        // Re-verify teamId and store
                        ctrl.store = ApiService.data;
                        var currentTeamIdCheck = AuthService.getTeamId();
                        console.log('Second update - teamId:', currentTeamIdCheck, 'Controls:', ctrl.store.allControls ? ctrl.store.allControls.length : 0);
                        
                        // Force view refresh by triggering digest cycle
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$apply();
                        }
                        
                        // One more update to be sure - also re-read from localStorage
                        $timeout(function() {
                            // Re-read user from localStorage to ensure we have latest teamId
                            var user = AuthService.getUser();
                            var latestTeamId = user ? user.currentTeamId : null;
                            console.log('Third update - latestTeamId from localStorage:', latestTeamId);
                            
                            ctrl.store = ApiService.data;
                            if (!$scope.$$phase && !$rootScope.$$phase) {
                                $scope.$apply();
                            }
                        }, 50);
                    }, 50);
                }, 100);
            }).catch(function(error) {
                console.error('❌ Error reloading data for team:', teamId, error);
                console.error('Error details:', error.data || error.message || error);
                NotificationService.show('Error loading data for selected team: ' + (error.data?.message || error.message || 'Unknown error'), 'error');
            });
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
            var currentTeamId = AuthService.getTeamId();
            console.log('Controls updated event - reloading for team:', currentTeamId);
            ApiService.loadAllControls(currentTeamId).then(function () {
                ctrl.store = ApiService.data;
                ctrl.ensureDateObjects();
                console.log('Controls board refreshed - Total controls:', ctrl.store.allControls ? ctrl.store.allControls.length : 0);
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
        ctrl.teamChangedListener = teamChangedListener;

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
            if (ctrl.teamChangedListener) {
                ctrl.teamChangedListener();
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

                // Parse Status Progress Map for quick status changes
                c.statusProgressMap = {};
                if (c.statusProgress) {
                    try {
                        c.statusProgressMap = JSON.parse(c.statusProgress);
                    } catch (e) {
                        console.error('Error parsing statusProgress for control', c.controlId, ':', e);
                    }
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

        // Cache for dynamically generated colors
        if (!ctrl._typeColorCache) {
            ctrl._typeColorCache = {};
        }

        // Get row background color based on control type
        ctrl.getRowColorByType = function (typeName) {
            if (!typeName) return {};

            var typeNameLower = typeName.toLowerCase().trim();

            // Predefined colors for known types
            var colorMap = {
                'l3': { 'background': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 'border-left': '4px solid #f59e0b' },
                'cr': { 'background': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 'border-left': '4px solid #3b82f6' },
                'l2': { 'background': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', 'border-left': '4px solid #ec4899' },
                'l1': { 'background': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 'border-left': '4px solid #10b981' },
                'incident': { 'background': 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 'border-left': '4px solid #ef4444' },
                'problem': { 'background': 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', 'border-left': '4px solid #6366f1' },
                'service request': { 'background': 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', 'border-left': '4px solid #a855f7' },
                'enhancement': { 'background': 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', 'border-left': '4px solid #14b8a6' }
            };

            // Return predefined color if exists
            if (colorMap[typeNameLower]) {
                return colorMap[typeNameLower];
            }

            // Check cache for dynamically generated color
            if (ctrl._typeColorCache[typeNameLower]) {
                return ctrl._typeColorCache[typeNameLower];
            }

            // Generate new color for unknown type using hash
            var hash = 0;
            for (var i = 0; i < typeNameLower.length; i++) {
                hash = typeNameLower.charCodeAt(i) + ((hash << 5) - hash);
            }

            // Color palette for auto-generation (vibrant, distinct colors)
            var colorPalettes = [
                { bg1: '#fef3c7', bg2: '#fde68a', border: '#f59e0b' }, // Yellow
                { bg1: '#dbeafe', bg2: '#bfdbfe', border: '#3b82f6' }, // Blue
                { bg1: '#fce7f3', bg2: '#fbcfe8', border: '#ec4899' }, // Pink
                { bg1: '#d1fae5', bg2: '#a7f3d0', border: '#10b981' }, // Green
                { bg1: '#fee2e2', bg2: '#fecaca', border: '#ef4444' }, // Red
                { bg1: '#e0e7ff', bg2: '#c7d2fe', border: '#6366f1' }, // Indigo
                { bg1: '#f3e8ff', bg2: '#e9d5ff', border: '#a855f7' }, // Purple
                { bg1: '#ccfbf1', bg2: '#99f6e4', border: '#14b8a6' }, // Teal
                { bg1: '#fed7aa', bg2: '#fdba74', border: '#f97316' }, // Orange
                { bg1: '#fef08a', bg2: '#fde047', border: '#eab308' }, // Lime
                { bg1: '#e9d5ff', bg2: '#d8b4fe', border: '#c084fc' }, // Violet
                { bg1: '#fecdd3', bg2: '#fda4af', border: '#fb7185' }  // Rose
            ];

            var paletteIndex = Math.abs(hash) % colorPalettes.length;
            var palette = colorPalettes[paletteIndex];

            var generatedColor = {
                'background': 'linear-gradient(135deg, ' + palette.bg1 + ' 0%, ' + palette.bg2 + ' 100%)',
                'border-left': '4px solid ' + palette.border
            };

            // Cache the generated color
            ctrl._typeColorCache[typeNameLower] = generatedColor;

            return generatedColor;
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
                console.warn('getAllControls: Store not initialized');
                return [];
            }
            if (!ctrl.store.allControls) {
                console.warn('getAllControls: allControls not initialized');
                ctrl.store.allControls = [];
            }
            if (!ctrl.store.employees) {
                ctrl.store.employees = [];
            }

            // Get current team ID to filter controls
            // IMPORTANT: Always get fresh teamId from AuthService (reads from localStorage)
            var currentTeamId = AuthService.getTeamId();
            var totalControls = ctrl.store.allControls.length;
            
            // Ensure currentTeamId is properly parsed (handle string/number mismatch)
            if (currentTeamId !== null && currentTeamId !== undefined) {
                currentTeamId = parseInt(currentTeamId);
            }
            
            console.log('getAllControls - currentTeamId:', currentTeamId, 'Total controls in store:', totalControls);
            
            // Log a sample of control teamIds for debugging
            if (ctrl.store.allControls && ctrl.store.allControls.length > 0) {
                var sampleTeamIds = ctrl.store.allControls.slice(0, 5).map(function(c) { return c.teamId; });
                console.log('Sample control teamIds (first 5):', sampleTeamIds);
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

                // Filter by current team - only show controls from the selected team
                // If currentTeamId is null (All Teams), show all controls
                if (currentTeamId !== null && currentTeamId !== undefined) {
                    // Check if control belongs to current team
                    var controlTeamId = c.teamId || (c.employeeId ? (function() {
                        // If control doesn't have teamId, try to get it from employee
                        var emp = ctrl.store.employees.find(function(e) { return e.id === c.employeeId; });
                        return emp ? emp.teamId : null;
                    })() : null);
                    
                    // Convert both to numbers for comparison to handle type mismatches
                    var currentTeamIdNum = parseInt(currentTeamId);
                    var controlTeamIdNum = controlTeamId ? parseInt(controlTeamId) : null;
                    
                    if (controlTeamIdNum !== currentTeamIdNum) {
                        return; // Skip controls from other teams
                    }
                }

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

            // Get current team ID to filter controls
            var currentTeamId = AuthService.getTeamId();

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

                // Filter by current team - only show controls from the selected team
                // If currentTeamId is null (All Teams), show all controls
                if (currentTeamId !== null && currentTeamId !== undefined) {
                    // Check if control belongs to current team
                    var controlTeamId = c.teamId || (c.employeeId ? (function() {
                        // If control doesn't have teamId, try to get it from employee
                        var emp = ctrl.store.employees.find(function(e) { return e.id === c.employeeId; });
                        return emp ? emp.teamId : null;
                    })() : null);
                    
                    // Convert both to numbers for comparison to handle type mismatches
                    var currentTeamIdNum = parseInt(currentTeamId);
                    var controlTeamIdNum = controlTeamId ? parseInt(controlTeamId) : null;
                    
                    if (controlTeamIdNum !== currentTeamIdNum) {
                        return; // Skip controls from other teams
                    }
                }

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

        // Get employees filtered by current team
        ctrl.getEmployeesForCurrentTeam = function() {
            if (!ctrl.store || !ctrl.store.employees) {
                return [];
            }
            
            var currentTeamId = AuthService.getTeamId();
            
            // If no team selected (All Teams), return all employees
            if (!currentTeamId) {
                return ctrl.store.employees;
            }
            
            // Filter employees by current team
            return ctrl.store.employees.filter(function(emp) {
                return emp.teamId === currentTeamId;
            });
        };

        // Get count of sub-objectives for a control
        ctrl.getSubObjectivesCount = function (control) {
            if (!control || !control._subDescriptionsArray) {
                return 0;
            }
            return control._subDescriptionsArray.length;
        };

        // Get completion rate of sub-objectives for a control
        ctrl.getSubObjectivesCompletionRate = function (control) {
            if (!control || !control._subDescriptionsArray || control._subDescriptionsArray.length === 0) {
                return 0;
            }
            
            var totalProgress = 0;
            var count = control._subDescriptionsArray.length;
            
            control._subDescriptionsArray.forEach(function (subDesc) {
                var progress = subDesc.progress || 0;
                totalProgress += parseInt(progress);
            });
            
            var averageProgress = Math.round(totalProgress / count);
            return averageProgress;
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

        // Get QA Engineers from employees list (filtered by current team)
        ctrl.getQAEngineers = function () {
            var employees = ctrl.getEmployeesForCurrentTeam();
            if (!employees || employees.length === 0) {
                return [];
            }

            var qaEngineers = employees.filter(function (emp) {
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

        // Get non-QA employees (filtered by current team)
        ctrl.getNonQAEmployees = function () {
            var employees = ctrl.getEmployeesForCurrentTeam();
            if (!employees || employees.length === 0) {
                return [];
            }
            return employees.filter(function (emp) {
                if (emp.user && emp.user.role) {
                    var role = emp.user.role.toLowerCase();
                    return role !== 'qa engineer' && role !== 'qa';
                }
                return true; // Include employees without role info
            });
        };

        // Get employees filtered by status (for Owner dropdown) - filtered by current team
        ctrl.getEmployeesForStatus = function (statusName) {
            var employees = ctrl.getEmployeesForCurrentTeam();
            if (!employees || employees.length === 0) {
                return [];
            }
            
            if (!statusName) {
                return employees;
            }
            
            var status = (statusName || '').toLowerCase().trim();
            
            // If status is QA, show only QA Engineers
            if (status === 'qa') {
                return ctrl.getQAEngineers();
            }
            
            // For Development and other statuses, show Developers, Team Leads, and Software Architects
            return employees.filter(function (emp) {
                if (!emp || !emp.employeeName) return false;

                var role = '';
                // Check if employee has user with role
                if (emp.user && emp.user.role) {
                    role = (emp.user.role || '').toLowerCase().trim();
                } else if (emp.role) {
                    // Also check if role is directly on employee object (fallback)
                    role = (emp.role || '').toLowerCase().trim();
                }

                // Include Developers, Team Leads, Software Architects, and Interns
                return role === 'developer' || 
                       role === 'developers' || 
                       role === 'intern developer' ||
                       role === 'team lead' || 
                       role === 'software architecture' ||
                       role === 'software architect';
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

            // Parse Status Progress History for Edit Mode
            c.statusProgressMap = {};
            if (c.statusProgress) {
                try {
                    c.statusProgressMap = JSON.parse(c.statusProgress);
                } catch (e) {
                    console.error('Error parsing statusProgress:', e);
                }
            }
        };

        // Handle Status Change in Edit Mode - Restore previous progress
        ctrl.onEditStatusChange = function (control) {
            if (!control || !control.editStatusId) return;

            var newStatusId = parseInt(control.editStatusId);

            // Check if we have a saved progress for this status
            if (control.statusProgressMap && control.statusProgressMap[newStatusId] !== undefined) {
                control.editProgress = control.statusProgressMap[newStatusId];
                NotificationService.show('Restored progress for this status: ' + control.editProgress + '%', 'info');
            } else {
                // If no history, maybe default to 0? Or keep current? 
                // Let's reset to 0 for a fresh status entry if it's not the current status
                if (newStatusId !== control.statusId) {
                    control.editProgress = 0;
                }
            }
        };

        // Quick update for Control Progress
        ctrl.updateControlProgressQuick = function (control) {
            ctrl.isLocalSave = true;

            var newProgress = parseInt(control.progress || 0);

            // Validate bounds
            if (newProgress < 0) newProgress = 0;
            if (newProgress > 100) newProgress = 100;
            control.progress = newProgress;

            // No auto-advance - progress stays at 100% when reached
            // User must manually change status if needed

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description,
                subDescriptions: control.subDescriptions, // Keep existing strings
                comments: control.comments,
                progress: control.progress,
                statusId: control.statusId,
                releaseId: control.releaseId,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null,
                statusProgress: control.statusProgress, // Pass this back so backend can update it
                logDailyProgress: true, // Enable daily progress logging
                dailyComments: 'Quick progress update to ' + control.progress + '%',
                workDescription: 'Progress updated via quick edit'
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                NotificationService.show('Progress updated and logged', 'success');

                // Update local object with server response (important for StatusProgress map update)
                if (updatedControl) {
                    control.statusProgress = updatedControl.statusProgress;
                    if (updatedControl.statusId) {
                        control.statusId = updatedControl.statusId;
                        // Find status name
                        var s = ctrl.store.statuses.find(x => x.id == control.statusId);
                        if (s) control.statusName = s.statusName;
                    }
                    if (updatedControl.progress !== undefined) control.progress = updatedControl.progress;
                }

                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error updating progress:', error);
                NotificationService.show('Error updating progress', 'error');
                // Revert?
            }).finally(function () {
                $timeout(function () {
                    ctrl.isLocalSave = false;
                }, 500);
            });
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

                // No auto-advance - progress stays at 100% when reached
                // User must manually change status if needed

                if (model.releaseDateInputFormatted) {
                    var d = new Date(model.releaseDateInputFormatted);
                    d.setHours(12, 0, 0, 0);
                    subDesc.releaseDate = d;
                } else {
                    subDesc.releaseDate = null;
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
                    // FORCE REFRESH: Explicitly update the sub-descriptions array to ensure dates display
                    if (control.subDescriptions) {
                        var parsedSubDescs = typeof control.subDescriptions === 'string'
                            ? JSON.parse(control.subDescriptions)
                            : control.subDescriptions;

                        control._subDescriptionsArray = parsedSubDescs.map(function (sd) {
                            var releaseObj = null;
                            if (sd.releaseId && ctrl.store && ctrl.store.releases) {
                                releaseObj = ctrl.store.releases.find(function (r) { return r.releaseId === parseInt(sd.releaseId); });
                            }

                            return {
                                description: sd.description || '',
                                employeeId: sd.employeeId || null,
                                statusId: sd.statusId || null,
                                progress: sd.progress || null,
                                releaseId: sd.releaseId || null,
                                releaseDate: releaseObj ? new Date(releaseObj.releaseDate) : null,
                                releaseDateInputFormatted: releaseObj ? ctrl.formatDateForInput(new Date(releaseObj.releaseDate)) : '',
                                comments: sd.comments || [],
                                editing: false
                            };
                        });
                    }

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
                if (newDateString) {
                    var d = new Date(newDateString);
                    d.setHours(12, 0, 0, 0);
                    subDesc.releaseDate = d;
                } else {
                    subDesc.releaseDate = null;
                }

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

                    // FORCE REFRESH: Explicitly update the sub-descriptions array to ensure dates display
                    if (control.subDescriptions) {
                        var parsedSubDescs = typeof control.subDescriptions === 'string'
                            ? JSON.parse(control.subDescriptions)
                            : control.subDescriptions;

                        control._subDescriptionsArray = parsedSubDescs.map(function (sd) {
                            var releaseObj = null;
                            if (sd.releaseId && ctrl.store && ctrl.store.releases) {
                                releaseObj = ctrl.store.releases.find(function (r) { return r.releaseId === parseInt(sd.releaseId); });
                            }

                            return {
                                description: sd.description || '',
                                employeeId: sd.employeeId || null,
                                statusId: sd.statusId || null,
                                progress: sd.progress || null,
                                releaseId: sd.releaseId || null,
                                releaseDate: releaseObj ? new Date(releaseObj.releaseDate) : null,
                                releaseDateInputFormatted: releaseObj ? ctrl.formatDateForInput(new Date(releaseObj.releaseDate)) : '',
                                comments: sd.comments || [],
                                editing: false
                            };
                        });
                    }

                    // Force Angular digest cycle
                    $timeout(function () { }, 0);
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

        // Quick update for sub-description fields (Owner, Status, Progress)
        ctrl.updateSubDescriptionFieldQuick = function (control, subDesc) {
            if (!ctrl.canEditSubDescription()) {
                NotificationService.show('You do not have permission to edit sub-descriptions', 'error');
                return;
            }
            ctrl.isLocalSave = true; // Set flag to prevent listener refresh

            // Track status change for auto-progress and history
            if (subDesc.statusId && ctrl.store.statuses) {
                var statusObj = ctrl.store.statuses.find(function (s) {
                    return s.id === parseInt(subDesc.statusId);
                });

                if (statusObj) {
                    var oldStatusId = subDesc._lastStatusId;
                    var newStatusId = parseInt(subDesc.statusId);

                    if (oldStatusId !== newStatusId) {
                        subDesc.statusName = statusObj.statusName;

                        // Reset progress to 0 on manual status change
                        subDesc.progress = 0;

                        // Add history comment for status change
                        if (!subDesc.comments) subDesc.comments = [];
                        subDesc.comments.push({
                            text: '[SYSTEM] Status changed to ' + statusObj.statusName + ' (Progress reset to 0%)',
                            date: new Date().toISOString(),
                            user: 'System'
                        });

                        // Update tracking
                        subDesc._lastStatusId = newStatusId;
                        subDesc._lastProgress = subDesc.progress;
                    }
                }
            }

            // Track manual progress change
            var newProgress = parseInt(subDesc.progress || 0);
            if (subDesc._lastProgress !== undefined && subDesc._lastProgress !== newProgress) {
                if (!subDesc.comments) subDesc.comments = [];
                subDesc.comments.push({
                    text: '[SYSTEM] Progress updated to ' + newProgress + '%',
                    date: new Date().toISOString(),
                    user: 'System'
                });
                subDesc._lastProgress = newProgress;
            }

            // Auto-advance to next status when progress reaches 100%
            if (newProgress >= 100 && subDesc.statusId && ctrl.store.statuses) {
                var currentStatus = ctrl.store.statuses.find(function (s) {
                    return s.id === parseInt(subDesc.statusId);
                });

                if (currentStatus) {
                    // Get all statuses sorted by displayOrder
                    var sortedStatuses = ctrl.store.statuses.slice().sort(function (a, b) {
                        return (a.displayOrder || 0) - (b.displayOrder || 0);
                    });

                    // Find next status
                    var currentIndex = sortedStatuses.findIndex(function (s) {
                        return s.id === currentStatus.id;
                    });

                    if (currentIndex !== -1 && currentIndex < sortedStatuses.length - 1) {
                        var nextStatus = sortedStatuses[currentIndex + 1];
                        
                        // Update to next status and reset progress
                        subDesc.statusId = nextStatus.id;
                        subDesc.statusName = nextStatus.statusName;
                        subDesc.progress = 0;
                        subDesc._lastStatusId = nextStatus.id;
                        subDesc._lastProgress = 0;

                        // Add history comment for auto-advance
                        if (!subDesc.comments) subDesc.comments = [];
                        subDesc.comments.push({
                            text: '[SYSTEM] Auto-advanced from ' + currentStatus.statusName + ' to ' + nextStatus.statusName + ' (100% complete)',
                            date: new Date().toISOString(),
                            user: 'System'
                        });

                        NotificationService.show('Status auto-advanced to ' + nextStatus.statusName, 'info');
                    }
                }
            }

            // Generate the clean array for JSON serialization
            var updatedSubDescs = control._subDescriptionsArray.map(function (item) {
                return {
                    description: (item.description || '').trim(),
                    employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                    statusId: item.statusId ? parseInt(item.statusId) : null,
                    progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                    releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                    comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                };
            });

            var jsonStr = JSON.stringify(updatedSubDescs);

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
                NotificationService.show('Update synchronized successfully', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error updating sub-description field:', error);
                NotificationService.show('Error saving change', 'error');
            }).finally(function () {
                $timeout(function () {
                    ctrl.isLocalSave = false;
                }, 1000);
            });
        };

        // Update release date in edit mode (for editSubDescriptionsArray) - resolves releaseId without immediate save
        ctrl.updateEditModeReleaseDate = function (subDesc, control) {
            if (!subDesc.releaseDateInputFormatted) {
                subDesc.releaseId = null;
                subDesc.releaseDate = null;
                return;
            }

            // Find or create release ID for this date
            ApiService.findOrCreateReleaseByDate(subDesc.releaseDateInputFormatted).then(function (newReleaseId) {
                subDesc.releaseId = newReleaseId;
                var d = new Date(subDesc.releaseDateInputFormatted);
                d.setHours(12, 0, 0, 0);
                subDesc.releaseDate = d;
                console.log('Resolved releaseId for edit mode:', newReleaseId);

                // Sync the serialized string
                if (control) {
                    ctrl.updateEditSubDescriptions(control);
                }
            }).catch(function (error) {
                console.error('Error resolving releaseId in edit mode:', error);
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

            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            
            // If employee is assigned, get teamId from employee, otherwise use current team
            var teamIdToAssign = currentTeamId;
            if (ctrl.newControl.employeeId) {
                var selectedEmployee = ctrl.store.employees.find(function(e) { 
                    return e.id === parseInt(ctrl.newControl.employeeId); 
                });
                if (selectedEmployee && selectedEmployee.teamId) {
                    teamIdToAssign = selectedEmployee.teamId;
                }
            }

            var payload = {
                typeId: parseInt(ctrl.newControl.typeId),
                description: ctrl.newControl.description.trim(),
                employeeId: ctrl.newControl.employeeId ? parseInt(ctrl.newControl.employeeId) : null,
                teamId: teamIdToAssign, // Assign to current team or employee's team
                progress: 0,
                comments: ''
            };

            // Reload controls for current team after creation
            var teamIdForReload = currentTeamId;
            
            ApiService.addControl(payload).then(function (createdControl) {
                NotificationService.show('Control created successfully', 'success');
                ctrl.showAddControlModal = false;
                ctrl.newControl = {
                    typeId: null,
                    description: '',
                    employeeId: null
                };
                // Reload controls for current team to show the new one
                return ApiService.loadAllControls(teamIdForReload);
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

            // Get teamId from assigned employee or current team
            var teamIdToAssign = null;
            if (assignedEmployee && assignedEmployee.teamId) {
                teamIdToAssign = assignedEmployee.teamId;
            } else {
                teamIdToAssign = AuthService.getTeamId();
            }

            // Update the control with the new employee assignment
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: employeeId,
                teamId: teamIdToAssign, // Assign control to employee's team
                typeId: control.typeId,
                description: control.description || null,
                subDescriptions: control.subDescriptions || null,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: statusId,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            var currentTeamId = AuthService.getTeamId();

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                control.employeeId = updatedControl.employeeId;
                control.assignEmployeeId = null;
                NotificationService.show('Employee assigned successfully', 'success');
                // Reload controls for current team to refresh the view
                return ApiService.loadAllControls(currentTeamId);
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
                            _lastProgress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                            releaseId: item.releaseId || null,
                            releaseName: releaseName,
                            releaseDate: releaseDate ? new Date(releaseDate) : null,
                            releaseDateInputFormatted: releaseDate ? ctrl.formatDateForInput(releaseDate) : '',
                            comments: item.comments && Array.isArray(item.comments) ? item.comments : [],
                            _lastStatusId: item.statusId ? parseInt(item.statusId) : null,
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
                return s.id == statusId;
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

                    // Reset progress to 0 on status change
                    subDesc.progress = 0;
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

        // Handle sub description progress change - keep progress at 100% if reached
        ctrl.onSubDescProgressChange = function (control, subDescIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) return;
            // No auto-advance - just update the progress value
            // User can manually change status if needed
            ctrl.updateEditSubDescriptions(control);
        };

        // Handle sub description inline progress change - keep progress at 100% if reached
        ctrl.onSubDescInlineProgressChange = function (subDesc) {
            // No auto-advance - just keep the progress value
            // User can manually change status if needed
        };

        // Update editSubDescriptions string from array
        // Get next status after current status
        ctrl.getNextStatus = function (currentStatusName) {
            if (!currentStatusName || !ctrl.store.statuses) return null;
            var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA', 'UAT', 'Ready for Prod', 'Live', 'Done'];
            var currentIndex = statusOrder.findIndex(function (s) {
                return s.toLowerCase() === currentStatusName.toLowerCase();
            });
            if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                var nextStatusName = statusOrder[currentIndex + 1];
                // Try to find exact match first
                var nextStatus = ctrl.store.statuses.find(function (s) {
                    return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                });

                // If not found and looking for final stages, try flexible matching
                if (!nextStatus && (nextStatusName === 'Live' || nextStatusName === 'Done')) {
                    nextStatus = ctrl.store.statuses.find(function (s) {
                        return s.statusName && (s.statusName.toLowerCase() === 'live' || s.statusName.toLowerCase() === 'done' || s.statusName.toLowerCase() === 'completed');
                    });
                }
                return nextStatus;
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

                    // No auto-advance - progress stays at 100% when reached
                    // User must manually change status if needed

                    // If statusName not set, get it from statusId
                    if (!statusName && statusId && ctrl.store.statuses) {
                        var status = ctrl.store.statuses.find(function (s) {
                            return s.id == statusId;
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
                // Don't reset progress - let autoSaveStatus handle it based on statusProgressMap
                // Auto-save status and progress
                ctrl.autoSaveStatus(control, selectedStatus.id, null, selectedStatus.statusName);
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

            // Parse existing statusProgressMap
            var statusProgressMap = {};
            if (control.statusProgress) {
                try {
                    statusProgressMap = JSON.parse(control.statusProgress);
                } catch (e) {
                    console.error('Error parsing statusProgress:', e);
                }
            }

            // Check if status is changing
            var oldStatusId = control.statusId;
            var newStatusId = parseInt(statusId);
            var isStatusChanging = oldStatusId !== newStatusId;

            // Determine the progress value to use
            if (progressValue === null || progressValue === undefined) {
                // No progress value provided - check if we have saved progress for the new status
                if (isStatusChanging && statusProgressMap[newStatusId] !== undefined) {
                    // Restore the saved progress for this status
                    progressValue = statusProgressMap[newStatusId];
                    console.log('Restoring saved progress for status ' + newStatusId + ': ' + progressValue + '%');
                } else {
                    // No saved progress - use current progress or default to 0
                    progressValue = control.progress || 0;
                }
            }

            // Ensure progress is valid
            progressValue = parseInt(progressValue) || 0;
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                qaEmployeeId: control.qaEmployeeId,
                typeId: control.typeId,
                description: control.description,
                subDescriptions: control.subDescriptions,
                comments: control.comments,
                statusId: newStatusId,
                progress: progressValue,
                statusProgress: control.statusProgress, // Send current statusProgress to backend
                releaseId: control.releaseId,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Get status name from response or use passed statusName
                var finalStatusName = updatedControl.statusName || statusName || '';

                // Update control object with backend response
                control.statusId = updatedControl.statusId;
                control.statusName = finalStatusName;
                control.progress = updatedControl.progress; // Use progress from backend
                control.editProgress = updatedControl.progress;
                control.statusProgress = updatedControl.statusProgress; // Update statusProgress from backend

                // Parse the updated statusProgressMap for future use
                if (control.statusProgress) {
                    try {
                        control.statusProgressMap = JSON.parse(control.statusProgress);
                    } catch (e) {
                        console.error('Error parsing updated statusProgress:', e);
                    }
                }

                // Update in store
                if (ctrl.store && ctrl.store.allControls) {
                    ctrl.store.allControls.forEach(function (storeControl) {
                        if (parseInt(storeControl.controlId) === parseInt(control.controlId)) {
                            storeControl.statusId = updatedControl.statusId;
                            storeControl.statusName = finalStatusName;
                            storeControl.progress = updatedControl.progress;
                            storeControl.statusProgress = updatedControl.statusProgress;
                            storeControl._updated = new Date().getTime();
                        }
                    });
                }

                // Show success notification
                if (isStatusChanging && statusProgressMap[newStatusId] !== undefined) {
                    NotificationService.show('Status changed to ' + finalStatusName + ' (Progress restored: ' + updatedControl.progress + '%)', 'success');
                } else {
                    NotificationService.show('Status updated to ' + finalStatusName + ' and saved', 'success');
                }

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

            // No auto-advance - progress stays at 100% when reached
            // User must manually change status if needed

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

                        // No auto-advance - progress stays at 100% when reached
                        // User must manually change status if needed

                        return {
                            description: item.description.trim(),
                            employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                            statusId: subStatusId,
                            statusName: subStatusName,
                            progress: subProgress,
                            releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                            releaseDate: item.releaseDateInputFormatted ? (function (dt) { var d = new Date(dt); d.setHours(12, 0, 0, 0); return d; })(item.releaseDateInputFormatted) : (item.releaseDate ? new Date(item.releaseDate) : null),
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

        // ==========================================
        // Comment Editing Functions for Sub-Descriptions
        // ==========================================

        // ==========================================
        // Status Color Coding Functions
        // ==========================================

        // Get color for a status
        ctrl.getStatusColor = function (statusName) {
            if (!statusName) return { bg: '#94a3b8', text: '#ffffff' }; // Default gray

            var statusLower = statusName.toLowerCase().trim();

            var colorMap = {
                'analyze': { bg: '#3b82f6', text: '#ffffff' },        // Blue
                'development': { bg: '#8b5cf6', text: '#ffffff' },    // Purple
                'dev testing': { bg: '#f59e0b', text: '#ffffff' },    // Orange
                'qa': { bg: '#10b981', text: '#ffffff' },             // Green
                'hld': { bg: '#06b6d4', text: '#ffffff' },            // Cyan
                'lld': { bg: '#6366f1', text: '#ffffff' },            // Indigo
                'completed': { bg: '#22c55e', text: '#ffffff' },      // Bright Green
                'blocked': { bg: '#ef4444', text: '#ffffff' },        // Red
                'on hold': { bg: '#f97316', text: '#ffffff' },        // Dark Orange
                'pending': { bg: '#eab308', text: '#000000' },        // Yellow
                'in progress': { bg: '#a855f7', text: '#ffffff' }     // Violet
            };

            return colorMap[statusLower] || { bg: '#94a3b8', text: '#ffffff' };
        };

        // ==========================================
        // Comment Functions
        // ==========================================

        // Format comment date for display
        ctrl.formatCommentDate = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            return (d.getMonth() + 1) + '/' + d.getDate();
        };

        // Group comments by date
        ctrl.groupCommentsByDate = function (subDesc) {
            // Cache the grouped comments to avoid infinite digest loops
            if (!subDesc || !subDesc.comments) {
                return [];
            }

            // Check if we need to regenerate the grouped comments
            var commentsStr = JSON.stringify(subDesc.comments);
            if (subDesc._cachedCommentsStr === commentsStr && subDesc._groupedComments) {
                return subDesc._groupedComments;
            }

            // Generate grouped comments
            var comments = subDesc.comments;
            if (!Array.isArray(comments) || comments.length === 0) {
                subDesc._groupedComments = [];
                subDesc._cachedCommentsStr = commentsStr;
                return [];
            }

            var grouped = {};
            var dateOrder = [];

            comments.forEach(function (comment, index) {
                var dateKey = ctrl.formatCommentDate(comment.date);
                if (!dateKey) dateKey = 'Unknown';

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                    dateOrder.push(dateKey);
                }

                // Add original index to track for editing/deleting
                grouped[dateKey].push({
                    text: comment.text,
                    date: comment.date,
                    _editing: comment._editing,
                    _editText: comment._editText,
                    _originalIndex: index
                });
            });

            // Convert to array format for ng-repeat
            var result = dateOrder.map(function (date) {
                return {
                    date: date,
                    comments: grouped[date]
                };
            });

            // Cache the result
            subDesc._groupedComments = result;
            subDesc._cachedCommentsStr = commentsStr;

            return result;
        };


        // Start editing a comment
        ctrl.startEditComment = function (comment) {
            if (!comment) return;
            comment._editing = true;
            comment._editText = comment.text || '';
            // Focus the input field after a short delay to ensure it's rendered
            $timeout(function () {
                var inputId = 'comment-edit-' + Math.random();
                var input = document.querySelector('input[ng-model="comment._editText"]');
                if (input) input.focus();
            }, 50);
        };

        // Save edited comment
        ctrl.saveEditedComment = function (control, subDescIndex, commentIndex) {
            if (!control || !control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;

            var subDesc = control._subDescriptionsArray[subDescIndex];
            if (!subDesc.comments || !subDesc.comments[commentIndex]) return;

            var comment = subDesc.comments[commentIndex];
            if (!comment._editing) return;

            // Update the comment text
            if (comment._editText && comment._editText.trim()) {
                comment.text = comment._editText.trim();
            }

            // Exit edit mode
            comment._editing = false;
            delete comment._editText;

            // Save to backend
            ctrl.saveSubDescriptionComments(control, subDescIndex);
        };

        // Delete a comment from sub-description
        ctrl.deleteCommentFromSubDescription = function (control, subDescIndex, commentIndex) {
            if (!control || !control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;

            var subDesc = control._subDescriptionsArray[subDescIndex];
            if (!subDesc.comments || !subDesc.comments[commentIndex]) return;

            if (!confirm('Are you sure you want to delete this comment?')) {
                return;
            }

            // Remove the comment from the array
            subDesc.comments.splice(commentIndex, 1);

            // Save to backend
            ctrl.saveSubDescriptionComments(control, subDescIndex);
        };

        // Add a new comment to sub-description
        ctrl.addCommentToSubDescriptionQuick = function (control, subDescIndex) {
            if (!control || !control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;

            var subDesc = control._subDescriptionsArray[subDescIndex];
            if (!subDesc.newComment || !subDesc.newComment.trim()) return;

            // Initialize comments array if it doesn't exist
            if (!subDesc.comments) {
                subDesc.comments = [];
            }

            // Create new comment object
            var newComment = {
                text: subDesc.newComment.trim(),
                date: new Date().toISOString()
            };

            // Add to comments array
            subDesc.comments.push(newComment);

            // Clear the input
            subDesc.newComment = '';

            // Save to backend
            ctrl.saveSubDescriptionComments(control, subDescIndex);
        };

        // Save sub-description comments to backend
        ctrl.saveSubDescriptionComments = function (control, subDescIndex) {
            if (!control || !control._subDescriptionsArray) return;

            // Prepare the sub-descriptions array for saving
            var subDescsToSave = control._subDescriptionsArray.map(function (sd) {
                return {
                    description: sd.description,
                    employeeId: sd.employeeId || null,
                    statusId: sd.statusId || null,
                    progress: sd.progress !== undefined && sd.progress !== null ? parseInt(sd.progress) : null,
                    releaseId: sd.releaseId || null,
                    releaseDate: sd.releaseDate ? (new Date(sd.releaseDate)).toISOString() : null,
                    comments: sd.comments || []
                };
            });

            var payload = {
                controlId: control.controlId,
                employeeId: control.employeeId,
                qaEmployeeId: control.qaEmployeeId,
                typeId: control.typeId,
                description: control.description,
                subDescriptions: JSON.stringify(subDescsToSave),
                comments: control.comments,
                progress: control.progress,
                statusId: control.statusId,
                releaseId: control.releaseId,
                releaseDate: control.releaseDate ? (new Date(control.releaseDate)).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update the control with the latest data
                if (updatedControl.subDescriptions) {
                    control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                }
                NotificationService.show('Comment updated successfully', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                console.error('Error saving comment:', error);
                NotificationService.show('Error saving comment', 'error');
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
