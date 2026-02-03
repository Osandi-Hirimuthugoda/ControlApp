app.component('developerProgress', {
    template: `
    <div class="card shadow-lg developer-progress-card" style="height: 80vh; display: flex; flex-direction: column; border: none; border-radius: 20px; overflow: hidden;">
        <div class="card-header developer-progress-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%); color: white; padding: 1.5rem 2rem; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="developer-icon-wrapper me-3" style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 0.75rem; backdrop-filter: blur(10px);">
                        <i class="fas fa-code" style="font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <h5 class="mb-0 fw-bold" style="font-size: 1.4rem; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: -0.5px;">
                            Developers Engineers Progress
                        </h5>
                        <small class="opacity-90" style="font-size: 0.85rem;">Track and manage development progress</small>
                    </div>
                </div>
                <div class="developer-stats-badge" style="background: rgba(255,255,255,0.25); border-radius: 12px; padding: 0.5rem 1rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
                    <span class="fw-bold">{{$ctrl.getDeveloperControls().length}}</span>
                    <span class="ms-1" style="font-size: 0.85rem;">Controls</span>
                </div>
            </div>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <!-- Loading Indicator -->
            <div ng-if="$ctrl.isLoading" class="d-flex justify-content-center align-items-center" style="flex: 1; min-height: 400px;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted fw-bold">Loading Developer Progress Data...</p>
                </div>
            </div>
            <!-- Table Content -->
            <div class="table-responsive" ng-if="!$ctrl.isLoading" style="flex: 1; overflow-y: auto;">
                <table class="table table-hover mb-0 align-middle developer-progress-table" style="margin: 0;">
                    <thead class="sticky-top developer-table-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%); color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <tr class="text-center">
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-tag me-1"></i>Type
                            </th>
                            <th style="width:20%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-file-alt me-1"></i>Description
                            </th>
                            <th style="width:12%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-user-check me-1"></i>Developer
                            </th>
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-chart-line me-1"></i>Progress
                            </th>
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-info-circle me-1"></i>Status
                            </th>
                            <th style="width:12%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;" ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                <i class="fas fa-cog me-1"></i>Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-if="$ctrl.getDeveloperControls().length === 0">
                            <td colspan="7" class="text-center py-5" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
                                <div style="padding: 2rem;">
                                    <div style="background: rgba(255,255,255,0.8); border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                        <i class="fas fa-user-slash" style="font-size: 2.5rem; color: #3b82f6;"></i>
                                    </div>
                                    <h6 class="fw-bold mb-2" style="color: #1e40af; font-size: 1.1rem;">No Controls Assigned</h6>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem;">No controls have been assigned to Developers yet.</p>
                                </div>
                            </td>
                        </tr>
                        <tr ng-repeat="devControl in $ctrl.getDeveloperControls() | orderBy:'-controlId' track by devControl.controlId" 
                            id="control-{{devControl.controlId}}"
                            ng-class="{'highlighted-control': $ctrl.highlightedControlId === devControl.controlId}"
                            class="developer-table-row" 
                            ng-style="$ctrl.highlightedControlId === devControl.controlId ? {'background-color': 'rgba(59, 130, 246, 0.15)', 'border': '3px solid #3b82f6', 'box-shadow': '0 4px 12px rgba(59, 130, 246, 0.4)', 'transition': 'all 0.3s ease'} : {'transition': 'all 0.2s ease', 'border-bottom': '1px solid #f3f4f6'}">
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <span class="badge developer-type-badge" style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 0.5rem 0.75rem; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    {{devControl.typeName}}
                                </span>
                            </td>
                            <td style="padding: 1rem 0.75rem; vertical-align: top;">
                                <div ng-if="!devControl.editing">
                                    <!-- Main Description -->
                                    <div class="description-3d h5 mb-3">
                                        <i class="fas fa-file-alt me-2"></i>
                                        <span>{{devControl.description}}</span>
                                    </div>
                                    <div class="d-flex gap-3 mb-3">
                                        <div class="text-success fw-bold small" style="font-size: 0.8rem;" ng-if="devControl.releaseDate">
                                            <i class="fas fa-calendar-check me-1"></i>Release Date: {{$ctrl.formatDateWithYear(devControl.releaseDate)}}
                                        </div>
                                        <div class="text-muted small" style="font-size: 0.75rem;" ng-if="devControl.updatedAt">
                                            <i class="fas fa-history me-1"></i>Last Updated: {{$ctrl.formatDateWithYear(devControl.updatedAt)}}
                                        </div>
                                    </div>
                                    
                                    <!-- Sub Descriptions Table (like main control board) -->
                                    <div ng-if="devControl._subDescriptionsArray && devControl._subDescriptionsArray.length > 0" style="margin-top: 0.75rem;">
                                        <div class="mb-2">
                                            <label class="small fw-bold d-flex align-items-center" style="color: #6366f1; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                                                <i class="fas fa-list-ul me-2" style="font-size: 0.9rem;"></i>Sub Descriptions
                                            </label>
                                        </div>
                                        <table class="subdesc-table" style="box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);">
                                            <thead>
                                                <tr>
                                                    <th style="width: 30%;">Description</th>
                                                    <th style="width: 25%;">Employee</th>
                                                     <th style="width: 20%;">Progress</th>
                                                     <th style="width: 15%;">Release Date</th>
                                                     <th style="width: 20%;">Comments</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="subDesc in devControl._subDescriptionsArray track by $index">
                                                    <td>
                                                        <strong style="color: #374151;">{{subDesc.description}}</strong>
                                                    </td>
                                                    <td>
                                                        <span ng-if="subDesc.employeeId" class="text-primary">
                                                            <i class="fas fa-user"></i> {{$ctrl.getEmployeeName(subDesc.employeeId)}}
                                                        </span>
                                                        <span ng-if="!subDesc.employeeId" class="text-danger">
                                                            <i class="fas fa-user-slash"></i> Unassigned
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div class="progress" ng-if="subDesc.progress !== undefined && subDesc.progress !== null && subDesc.progress >= 0" style="height: 18px; border-radius: 4px;">
                                                            <div class="progress-bar" 
                                                                 role="progressbar" 
                                                                 ng-class="{
                                                                      'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                      'bg-primary': !subDesc.statusName || subDesc.statusName.toLowerCase() === 'development',
                                                                      'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                      'bg-warning': subDesc.statusName && subDesc.statusName.toLowerCase() === 'qa',
                                                                      'bg-danger': subDesc.statusName && subDesc.statusName.toLowerCase() === 'hld',
                                                                      'bg-orange': subDesc.statusName && subDesc.statusName.toLowerCase() === 'lld'
                                                                  }"
                                                                 style="width: {{subDesc.progress}}%"
                                                                 aria-valuenow="{{subDesc.progress}}" 
                                                                 aria-valuemin="0" 
                                                                 aria-valuemax="100">
                                                                {{subDesc.progress}}%
                                                            </div>
                                                        </div>
                                                        <span ng-if="subDesc.progress === undefined || subDesc.progress === null" class="text-muted small">-</span>
                                                    </td>
                                                     <td>
                                                         <span class="fw-bold" style="color: #059669; font-size: 0.9rem;" ng-if="subDesc.releaseDate">
                                                             <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatDate(subDesc.releaseDate)}}
                                                         </span>
                                                         <span class="text-muted small" ng-if="!subDesc.releaseDate">-</span>
                                                     </td>
                                                     <td style="min-width: 250px;">
                                                        <!-- Comments Display -->
                                                        <div ng-if="subDesc.comments && subDesc.comments.length > 0" class="subdesc-comments-list mb-2" style="max-height: 100px; overflow-y: auto;">
                                                            <div ng-repeat="comment in subDesc.comments track by $index" class="subdesc-comment-item mb-1">
                                                                <div class="subdesc-comment-date">
                                                                    <i class="fas fa-calendar-alt"></i> {{$ctrl.formatCommentDate(comment.date)}}
                                                                </div>
                                                                <div class="subdesc-comment-text">{{comment.text}}</div>
                                                            </div>
                                                        </div>
                                                        <span ng-if="!subDesc.comments || subDesc.comments.length === 0" class="text-muted small mb-2 d-block">
                                                            <i class="fas fa-comment-slash"></i> No comments
                                                        </span>
                                                        
                                                        <!-- Quick comment input for developers -->
                                                        <div class="subdesc-comment-input" ng-if="$ctrl.canAddComment() || $ctrl.isAssignedDeveloper(devControl)">
                                                            <input type="text" 
                                                                   class="form-control form-control-sm" 
                                                                   ng-model="subDesc.newComment" 
                                                                   placeholder="Add comment..." 
                                                                   ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescriptionQuick(devControl, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" 
                                                                    ng-click="$ctrl.addCommentToSubDescriptionQuick(devControl, $index)" 
                                                                    ng-disabled="!subDesc.newComment || subDesc.addingComment"
                                                                    title="Add comment">
                                                                <span ng-if="!subDesc.addingComment"><i class="fas fa-plus"></i></span>
                                                                <span ng-if="subDesc.addingComment"><i class="fas fa-spinner fa-spin"></i></span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- Show message if no sub-descriptions -->
                                    <div ng-if="!devControl._subDescriptionsArray || devControl._subDescriptionsArray.length === 0" 
                                         class="text-muted small mt-3 p-3 text-center" 
                                         style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 10px; border: 2px dashed #3b82f6;">
                                        <i class="fas fa-info-circle me-2" style="color: #2563eb;"></i>
                                        <span style="color: #1e40af; font-weight: 500;">No sub-descriptions. Click Edit to add.</span>
                                    </div>
                                    
                                    <!-- Comments Section (below sub-descriptions) -->
                                    <div class="mt-3" style="margin-top: 1rem !important;">
                                        <div class="mb-2">
                                            <label class="small fw-bold d-flex align-items-center" style="color: #3b82f6; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                                                <i class="fas fa-comments me-2" style="font-size: 0.9rem;"></i>Developer Comments
                                            </label>
                                        </div>
                                        <div class="developer-comments-section" style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 2px solid #e5e7eb; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                            <!-- Display all comments from all sub-descriptions -->
                                            <div ng-if="devControl._subDescriptionsArray && devControl._subDescriptionsArray.length > 0">
                                                <div ng-repeat="subDesc in devControl._subDescriptionsArray track by $index">
                                                    <div ng-if="subDesc.comments && subDesc.comments.length > 0" class="mb-3">
                                                        <div class="small fw-bold mb-2" style="color: #6366f1; font-size: 0.75rem;">
                                                            <i class="fas fa-tag me-1"></i>{{subDesc.description || 'Sub Description ' + ($index + 1)}}
                                                        </div>
                                                        <div ng-repeat="comment in subDesc.comments track by $index" 
                                                             class="mb-2 p-2" 
                                                             style="background: white; border-radius: 8px; border-left: 3px solid #3b82f6; font-size: 0.85rem; color: #374151;">
                                                            <div class="d-flex align-items-start">
                                                                <i class="fas fa-circle text-primary me-2" style="font-size: 0.4em; margin-top: 0.3em;"></i>
                                                                <div class="flex-grow-1">
                                                                    <div class="small text-muted mb-1">
                                                                        <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatCommentDate(comment.date)}}
                                                                    </div>
                                                                    <div>{{comment.text}}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Show message if no comments -->
                                            <div ng-if="!devControl._subDescriptionsArray || devControl._subDescriptionsArray.length === 0 || !$ctrl.hasAnyComments(devControl)" 
                                                 class="text-muted small text-center py-3">
                                                <i class="fas fa-comment-slash me-1"></i>No comments yet
                                            </div>
                                            
                                            <!-- Add Comment Input (for assigned developers) -->
                                            <div class="mt-3" ng-if="$ctrl.canAddComment() || $ctrl.isAssignedDeveloper(devControl)">
                                                <!-- Sub-description Selection Dropdown -->
                                                <div class="mb-2" ng-if="devControl._subDescriptionsArray && devControl._subDescriptionsArray.length > 0">
                                                    <label class="small fw-bold mb-1 d-block" style="color: #6366f1; font-size: 0.75rem;">
                                                        <i class="fas fa-list-ul me-1"></i>Select Sub-Description:
                                                    </label>
                                                    <select class="form-select form-select-sm" 
                                                            ng-model="devControl.selectedSubDescIndex" 
                                                            ng-init="devControl.selectedSubDescIndex = (devControl._subDescriptionsArray && devControl._subDescriptionsArray.length > 0) ? 0 : null"
                                                            style="border: 1px solid #e5e7eb; font-size: 0.8rem; border-radius: 8px;">
                                                        <option ng-repeat="subDesc in devControl._subDescriptionsArray track by $index" value="{{$index}}">
                                                            {{subDesc.description || ('Sub Description ' + ($index + 1))}}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div class="mb-2" ng-if="!devControl._subDescriptionsArray || devControl._subDescriptionsArray.length === 0">
                                                    <div class="alert alert-info small mb-0" style="padding: 0.5rem; font-size: 0.75rem; border-radius: 8px;">
                                                        <i class="fas fa-info-circle me-1"></i>No sub-descriptions. Comment will create a new sub-description.
                                                    </div>
                                                </div>
                                                <div class="input-group input-group-sm" style="border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                                    <span class="input-group-text" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;">
                                                        <i class="fas fa-edit"></i>
                                                    </span>
                                                    <input type="text" 
                                                           class="form-control" 
                                                           ng-model="devControl.newProgressComment" 
                                                           placeholder="Add developer comment..." 
                                                           style="border: 1px solid #e5e7eb; font-size: 0.85rem;"
                                                           ng-keyup="$event.keyCode === 13 && $ctrl.addDeveloperComment(devControl)">
                                                    <button class="btn btn-sm" 
                                                            style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;"
                                                            ng-click="$ctrl.addDeveloperComment(devControl)" 
                                                            ng-disabled="devControl.addingComment || !devControl.newProgressComment"
                                                            title="Add Comment">
                                                        <span ng-if="!devControl.addingComment"><i class="fas fa-plus"></i></span>
                                                        <span ng-if="devControl.addingComment"><i class="fas fa-spinner fa-spin"></i></span>
                                                    </button>
                                                </div>
                                                <div class="text-muted small mt-2 text-center" style="font-size: 0.7rem;">
                                                    <i class="fas fa-info-circle me-1"></i>
                                                    <span ng-if="devControl._subDescriptionsArray && devControl._subDescriptionsArray.length > 0">Select sub-description above to add comment</span>
                                                    <span ng-if="!devControl._subDescriptionsArray || devControl._subDescriptionsArray.length === 0">Comment will be added to a new sub-description</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div ng-if="devControl.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="devControl.editDescription" placeholder="Main description">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions:</label>
                                        <div ng-if="devControl.editSubDescriptionsArray && devControl.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in devControl.editSubDescriptionsArray track by $index" class="mb-2 p-2 border rounded">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="e.g. API development, Frontend" ng-change="$ctrl.updateEditSubDescriptions(devControl)">
                                                    </div>
                                                    <div class="col-6">
                                                        <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-change="$ctrl.updateEditSubDescriptions(devControl)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">{{emp.employeeName}}</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <input type="number" min="0" max="100" class="form-control form-control-sm text-center no-spinners" ng-model="subDesc.progress" placeholder="0-100" ng-change="$ctrl.updateEditSubDescriptions(devControl)" onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-2">
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(devControl, $index)" title="Remove"><i class="fas fa-times"></i></button>
                                                    </div>
                                                </div>
                                                <div class="row g-2 mt-2">
                                                    <div class="col-12">
                                                        <label class="form-label small fw-bold">Comments:</label>
                                                        <div ng-if="subDesc.comments && subDesc.comments.length > 0" class="subdesc-comments-list mb-2" style="max-height: 150px; overflow-y: auto;">
                                                            <div ng-repeat="comment in subDesc.comments track by $index" class="subdesc-comment-item">
                                                                <div class="d-flex justify-content-between align-items-start">
                                                                    <div class="flex-grow-1">
                                                                        <div class="subdesc-comment-date"><i class="fas fa-calendar-alt"></i> {{$ctrl.formatCommentDate(comment.date)}}</div>
                                                                        <div class="subdesc-comment-text">{{comment.text}}</div>
                                                                    </div>
                                                                    <button class="btn btn-sm btn-link text-danger subdesc-comment-remove" ng-click="$ctrl.removeCommentFromSubDescription(devControl, $parent.$index, $index)" title="Remove"><i class="fas fa-times"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="subdesc-comment-input">
                                                            <input type="text" class="form-control form-control-sm" ng-model="subDesc.newComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescription(devControl, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" ng-click="$ctrl.addCommentToSubDescription(devControl, $index)" title="Add"><i class="fas fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-outline-primary w-100" ng-click="$ctrl.addSubDescriptionToArray(devControl)" type="button"><i class="fas fa-plus me-1"></i>Add Sub Description</button>
                                    </div>
                                </div>
                            </td>
                            <td class="text-start" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div class="d-flex align-items-center">
                                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; margin-right: 0.75rem; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);">
                                        <i class="fas fa-code text-white" style="font-size: 0.9rem;"></i>
                                    </div>
                                    <span class="text-primary fw-bold" style="font-size: 0.95rem;">
                                        {{$ctrl.getEmployeeName(devControl.employeeId)}}
                                    </span>
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div ng-if="!devControl.editing">
                                    <div class="progress mb-2" style="height: 28px; border-radius: 14px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); background: #e5e7eb;">
                                        <div class="progress-bar fw-bold" 
                                             ng-class="{
                                                 'bg-secondary': devControl.statusName && devControl.statusName.toLowerCase() === 'analyze',
                                                 'bg-primary': !devControl.statusName || devControl.statusName.toLowerCase() === 'development',
                                                 'bg-info': devControl.statusName && devControl.statusName.toLowerCase() === 'dev testing',
                                                 'bg-warning': devControl.statusName && devControl.statusName.toLowerCase() === 'qa'
                                             }"
                                             ng-style="{'width': devControl.progress + '%'}"
                                             style="display: flex; align-items: center; justify-content: center; font-size: 0.85rem; border-radius: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: width 0.6s ease;">
                                            {{devControl.progress}}%
                                        </div>
                                    </div>
                                    <!-- Quick Progress Update (for morning standup) -->
                                    <div class="input-group input-group-sm" ng-if="$ctrl.canMarkProgress()" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <input type="number" min="0" max="100" 
                                               class="form-control form-control-sm text-center no-spinners" 
                                               ng-model="devControl.quickProgress" 
                                               placeholder="0-100"
                                               style="border: 1px solid #e5e7eb; font-weight: 600;"
                                               ng-keyup="$event.keyCode === 13 && $ctrl.updateProgressQuick(devControl)"
                                               onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                        <button class="btn btn-sm" 
                                                style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;"
                                                ng-click="$ctrl.updateProgressQuick(devControl)" 
                                                ng-disabled="devControl.updatingProgress"
                                                title="Update Progress">
                                            <span ng-if="!devControl.updatingProgress"><i class="fas fa-save"></i></span>
                                            <span ng-if="devControl.updatingProgress"><i class="fas fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div ng-if="devControl.editing">
                                    <input type="number" min="0" max="100" class="form-control form-control-sm text-center no-spinners" 
                                           ng-model="devControl.editProgress" placeholder="0-100" 
                                           style="border: 2px solid #3b82f6; font-weight: 600; border-radius: 8px;"
                                           onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div ng-if="!devControl.editing">
                                    <div class="mb-2">
                                        <span class="badge developer-status-badge" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3); font-size: 0.85rem;">
                                            <i class="fas fa-check-circle me-1"></i>{{devControl.statusName || 'Development'}}
                                        </span>
                                    </div>
                                    <!-- Quick Status Change (for authorized users) -->
                                    <div ng-if="$ctrl.canEditControl()" class="input-group input-group-sm" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <select class="form-select form-select-sm" 
                                                ng-model="devControl.quickStatusId" 
                                                ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                                ng-change="$ctrl.updateStatusQuick(devControl)"
                                                ng-disabled="devControl.updatingStatus"
                                                style="border: 1px solid #e5e7eb; font-weight: 600; font-size: 0.75rem;">
                                            <option value="">Change Status</option>
                                        </select>
                                    </div>
                                </div>
                                <div ng-if="devControl.editing">
                                    <select class="form-select form-select-sm" 
                                            ng-model="devControl.editStatusId" 
                                            ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                            ng-change="$ctrl.onStatusChange(devControl)"
                                            style="border: 2px solid #3b82f6; font-weight: 600; border-radius: 8px;">
                                        <option value="">-- Select Status --</option>
                                    </select>
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;" ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                <div ng-if="!devControl.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !devControl.isPlaceholder" 
                                            class="btn btn-sm me-1 developer-action-btn-edit" 
                                            ng-click="$ctrl.startEdit(devControl)" 
                                            title="Edit"
                                            style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); transition: all 0.2s ease;">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !devControl.isPlaceholder" 
                                            class="btn btn-sm developer-action-btn-delete" 
                                            ng-click="$ctrl.deleteControl(devControl)" 
                                            ng-disabled="devControl.deleting" 
                                            title="Delete"
                                            style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
                                        <span ng-if="!devControl.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="devControl.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                </div>
                                <div ng-if="devControl.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm me-1" 
                                            ng-click="$ctrl.saveControl(devControl)" 
                                            ng-disabled="devControl.saving" 
                                            title="Save"
                                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                                        <span ng-if="!devControl.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="devControl.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm" 
                                            ng-click="$ctrl.cancelEdit(devControl)" 
                                            ng-disabled="devControl.saving" 
                                            title="Cancel"
                                            style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600;">
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

        ctrl.canEditControl = function () {
            return AuthService.canEditControl();
        };

        ctrl.canDeleteControl = function () {
            return AuthService.canDeleteControl();
        };

        ctrl.canAddComment = function () {
            // Developers can add comments to controls assigned to them
            return AuthService.canMarkProgress() || AuthService.isDeveloper();
        };

        ctrl.canMarkProgress = function () {
            return AuthService.canMarkProgress();
        };

        // Check if current user is the developer assigned to this control
        // Developers can add comments to controls assigned to them (status = Development/Dev Testing and has employeeId)
        ctrl.isAssignedDeveloper = function (control) {
            if (!control || !control.employeeId) return false;
            // If control is in Development or Dev Testing status and has an employee assigned, allow developers to comment
            var isDevStatus = control.statusName && (control.statusName.toLowerCase() === 'development' || control.statusName.toLowerCase() === 'dev testing');
            var isDeveloper = AuthService.isDeveloper();
            return isDevStatus && isDeveloper && !!control.employeeId;
        };

        ctrl.getEmployeeName = function (employeeId) {
            if (!ctrl.store || !ctrl.store.employees) return '';
            var emp = ctrl.store.employees.find(function (e) { return e.id == employeeId; });
            return emp ? emp.employeeName : '';
        };

        // Check if control has any comments in sub-descriptions
        ctrl.hasAnyComments = function (control) {
            if (!control._subDescriptionsArray || control._subDescriptionsArray.length === 0) return false;
            return control._subDescriptionsArray.some(function (subDesc) {
                return subDesc.comments && Array.isArray(subDesc.comments) && subDesc.comments.length > 0;
            });
        };

        // Format date with year (same as control board)
        ctrl.formatDateWithYear = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d.getTime())) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };

        // Get controls assigned to Developers (show ALL controls assigned to developers, regardless of status)
        ctrl.getDeveloperControls = function () {
            if (!ctrl.store || !ctrl.store.allControls || !ctrl.store.employees) {
                return [];
            }

            // If still loading, return empty array
            if (ctrl.isLoading) {
                return [];
            }

            var devControls = [];
            ctrl.store.allControls.forEach(function (control) {
                // Must have an employee assigned
                if (!control.employeeId) return;

                // Find employee and check if role is Developer
                var employee = ctrl.store.employees.find(function (emp) {
                    return emp.id === control.employeeId;
                });
                if (!employee) return;

                var role = '';
                if (employee.user && employee.user.role) {
                    role = (employee.user.role || '').toLowerCase().trim();
                } else if (employee.role) {
                    role = (employee.role || '').toLowerCase().trim();
                }

                // Show ALL controls assigned to developers (not just Development/Dev Testing status)
                if (role === 'developer' || role === 'developers' || role === 'intern developer') {
                    // Only initialize _subDescriptionsArray if not already initialized or if subDescriptions changed
                    // This prevents infinite digest loops by avoiding modifications during digest cycle
                    if (!control._subDescriptionsArray || control._lastSubDescriptionsValue !== control.subDescriptions) {
                        if (control.subDescriptions) {
                            control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(control.subDescriptions);
                        } else {
                            control._subDescriptionsArray = [];
                        }
                        control._lastSubDescriptionsValue = control.subDescriptions; // Cache marker on control object
                    }
                    // Initialize selectedSubDescIndex only if not already set (prevent infinite digest)
                    if (control.selectedSubDescIndex === null || control.selectedSubDescIndex === undefined) {
                        if (control._subDescriptionsArray && control._subDescriptionsArray.length > 0) {
                            control.selectedSubDescIndex = 0;
                        } else {
                            control.selectedSubDescIndex = null;
                        }
                    }
                    devControls.push(control);
                }
            });

            return devControls;
        };

        // Quick progress update (for morning standup - syncs to main table and sub-descriptions)
        ctrl.updateProgressQuick = function (control) {
            if (!control.quickProgress && control.quickProgress !== 0) return;
            var progressValue = parseInt(control.quickProgress);
            if (isNaN(progressValue)) {
                NotificationService.show('Invalid progress value.', 'error');
                return;
            }
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            control.updatingProgress = true;

            // Update sub-descriptions progress for sub-descriptions assigned to this developer
            var subDescriptionsValue = control.subDescriptions || null;
            var updatedSubDescriptions = false;

            if (control._subDescriptionsArray && control._subDescriptionsArray.length > 0 && control.employeeId) {
                // Update progress for sub-descriptions assigned to this developer
                var updatedSubDescs = control._subDescriptionsArray.map(function (subDesc) {
                    // If this sub-description is assigned to the current developer, update its progress
                    if (subDesc.employeeId && parseInt(subDesc.employeeId) === parseInt(control.employeeId)) {
                        updatedSubDescriptions = true;
                        var newProgress = progressValue;
                        var newStatusId = subDesc.statusId;
                        var newStatusName = subDesc.statusName;

                        // Auto-advance status if progress is 100%, then reset progress to 0
                        if (subDesc.statusId && progressValue === 100 && ctrl.store.statuses) {
                            var currentStatus = ctrl.store.statuses.find(function (s) {
                                return s.id === subDesc.statusId;
                            });
                            if (currentStatus && currentStatus.statusName) {
                                var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA'];
                                var currentIndex = statusOrder.findIndex(function (s) {
                                    return s.toLowerCase() === currentStatus.statusName.toLowerCase();
                                });
                                if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                                    var nextStatusName = statusOrder[currentIndex + 1];
                                    var nextStatus = ctrl.store.statuses.find(function (s) {
                                        return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                                    });
                                    if (nextStatus) {
                                        newStatusId = nextStatus.id;
                                        newStatusName = nextStatus.statusName;
                                        // Reset progress to 0% for next status
                                        newProgress = 0;
                                        NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                                    }
                                }
                            }
                        }

                        return {
                            description: subDesc.description || '',
                            employeeId: subDesc.employeeId || null,
                            statusId: newStatusId,
                            statusName: newStatusName,
                            progress: newProgress, // Update sub-description progress to match main progress
                            comments: subDesc.comments && Array.isArray(subDesc.comments) ? subDesc.comments : []
                        };
                    } else {
                        // Keep other sub-descriptions unchanged
                        return {
                            description: subDesc.description || '',
                            employeeId: subDesc.employeeId || null,
                            statusId: subDesc.statusId || null,
                            progress: subDesc.progress !== undefined && subDesc.progress !== null ? parseInt(subDesc.progress) : null,
                            comments: subDesc.comments && Array.isArray(subDesc.comments) ? subDesc.comments : []
                        };
                    }
                });

                if (updatedSubDescriptions) {
                    subDescriptionsValue = JSON.stringify(updatedSubDescs);
                }
            }

            var finalProgressValue = progressValue;
            var finalStatusId = control.statusId || null;

            if (finalProgressValue === 100 && ctrl.store.statuses) {
                var currentStatus = ctrl.store.statuses.find(function (s) {
                    return s.id === control.statusId;
                });
                if (currentStatus && currentStatus.statusName) {
                    var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA'];
                    var currentIndex = statusOrder.findIndex(function (s) {
                        return s.toLowerCase() === currentStatus.statusName.toLowerCase();
                    });
                    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                        var nextStatusName = statusOrder[currentIndex + 1];
                        var nextStatus = ctrl.store.statuses.find(function (s) {
                            return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                        });
                        if (nextStatus) {
                            finalStatusId = nextStatus.id;
                            finalProgressValue = 0;
                            // Reset quickProgress too
                            control.quickProgress = null;
                            NotificationService.show('Main task ' + currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                        }
                    }
                }
            }

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId || null,
                typeId: control.typeId || null,
                description: control.description || null,
                subDescriptions: subDescriptionsValue,
                comments: control.comments || null,
                progress: finalProgressValue,
                statusId: finalStatusId,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update local control object
                control.progress = updatedControl.progress;
                control.statusId = updatedControl.statusId;
                control.statusName = updatedControl.statusName || '';
                control.subDescriptions = updatedControl.subDescriptions || null;
                control.quickProgress = null; // Clear input

                // Update sub-descriptions array with new progress values
                if (updatedControl.subDescriptions) {
                    control.subDescriptions = updatedControl.subDescriptions;
                    control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                }

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.progress = updatedControl.progress;
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        } else {
                            storeControl._subDescriptionsArray = [];
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                var message = 'Progress updated. Main table will show the updated progress.';
                if (updatedSubDescriptions) {
                    message += ' Sub-description progress also updated.';
                }
                NotificationService.show(message, 'success');
            }).catch(function (err) {
                console.error('Error updating progress:', err);
                NotificationService.show('Error updating progress', 'error');
            }).finally(function () {
                control.updatingProgress = false;
                // Force refresh
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
            });
        };

        // Add Developer Comment to Sub-Descriptions (with sync to main table)
        ctrl.addDeveloperComment = function (c) {
            if (!c.newProgressComment || !c.newProgressComment.trim()) return;

            c.addingComment = true;

            // Ensure _subDescriptionsArray is initialized from database first
            // Load existing sub-descriptions from database if not already loaded
            if (!c._subDescriptionsArray || c._subDescriptionsArray.length === 0) {
                if (c.subDescriptions) {
                    // Load existing sub-descriptions from database (preserves past comments)
                    c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
                }

                // If still no sub-descriptions exist after loading from DB, create one with main description
                if (!c._subDescriptionsArray || c._subDescriptionsArray.length === 0) {
                    c._subDescriptionsArray = [{
                        description: c.description || 'Main Task',
                        employeeId: c.employeeId || null,
                        statusId: c.statusId || null,
                        statusName: c.statusName || null,
                        progress: c.progress !== undefined && c.progress !== null ? parseInt(c.progress) : null,
                        comments: [] // Start with empty comments array
                    }];
                }
            }

            // Determine which sub-description to add comment to
            var targetSubDescIndex = 0; // Default to first sub-description

            // If no sub-descriptions exist, create one
            if (!c._subDescriptionsArray || c._subDescriptionsArray.length === 0) {
                c._subDescriptionsArray = [{
                    description: c.description || 'Main Task',
                    employeeId: c.employeeId || null,
                    progress: c.progress !== undefined && c.progress !== null ? parseInt(c.progress) : null,
                    comments: []
                }];
                targetSubDescIndex = 0;
                c.selectedSubDescIndex = 0;
            } else {
                // Use selected sub-description index if available
                if (c.selectedSubDescIndex !== null && c.selectedSubDescIndex !== undefined) {
                    targetSubDescIndex = parseInt(c.selectedSubDescIndex);
                }

                // Validate index
                if (isNaN(targetSubDescIndex) || targetSubDescIndex < 0 || targetSubDescIndex >= c._subDescriptionsArray.length) {
                    NotificationService.show('Please select a valid sub-description.', 'error');
                    c.addingComment = false;
                    return;
                }
            }

            // Add comment to the selected sub-description
            var commentText = c.newProgressComment.trim();
            var targetSubDesc = c._subDescriptionsArray[targetSubDescIndex];

            if (targetSubDesc) {
                // Initialize comments array if needed (preserve existing comments from DB)
                if (!targetSubDesc.comments || !Array.isArray(targetSubDesc.comments)) {
                    targetSubDesc.comments = [];
                }

                // Add new comment with date (preserves all past comments)
                var newComment = {
                    text: commentText,
                    date: new Date().toISOString()
                };
                targetSubDesc.comments.push(newComment);
            }

            // Update the sub-descriptions in the control (preserve all existing comments)
            var subDescriptionsArray = c._subDescriptionsArray.map(function (sd) {
                return {
                    description: sd.description || '',
                    employeeId: sd.employeeId || null,
                    statusId: sd.statusId || null,
                    progress: sd.progress !== undefined && sd.progress !== null ? parseInt(sd.progress) : null,
                    comments: sd.comments && Array.isArray(sd.comments) ? sd.comments : [] // Preserve all comments
                };
            });

            var subDescriptionsValue = JSON.stringify(subDescriptionsArray);
            c.newProgressComment = ''; // Clear input

            var payload = {
                controlId: parseInt(c.controlId),
                employeeId: c.employeeId || null,
                typeId: c.typeId || null,
                description: c.description || null,
                subDescriptions: subDescriptionsValue,
                comments: c.comments || null, // Keep existing main comments unchanged
                progress: c.progress || 0,
                statusId: c.statusId || null,
                releaseId: c.releaseId || null,
                releaseDate: c.releaseDate ? new Date(c.releaseDate).toISOString() : null
            };

            ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
                // Update local control object
                c.subDescriptions = updatedControl.subDescriptions || null;
                if (updatedControl.subDescriptions) {
                    c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                    // Reset selectedSubDescIndex to first sub-description after adding comment
                    if (c._subDescriptionsArray && c._subDescriptionsArray.length > 0) {
                        c.selectedSubDescIndex = 0;
                    }
                }

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (ctrl) {
                        return ctrl.controlId === c.controlId;
                    });
                    if (storeControl) {
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                NotificationService.show('Comment added to sub-description. Main table will show the updated comments.', 'success');
            }).catch(function (error) {
                console.error('Error adding developer comment:', error);
                // Revert the comment addition on error
                if (targetSubDesc && targetSubDesc.comments && targetSubDesc.comments.length > 0) {
                    targetSubDesc.comments.pop();
                }
                NotificationService.show('Error adding comment', 'error');
            }).finally(function () {
                c.addingComment = false;
                // Force refresh
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
            });
        };

        // Reuse addComment logic from control board (for backward compatibility)
        ctrl.addComment = function (c) {
            ctrl.addDeveloperComment(c);
        };

        // Handle status change - update progress based on status
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
            }
        };

        // Quick status update (without edit mode)
        ctrl.updateStatusQuick = function (control) {
            if (!control.quickStatusId) return;

            var statusId = parseInt(control.quickStatusId);
            if (isNaN(statusId)) {
                NotificationService.show('Invalid status selection.', 'error');
                control.quickStatusId = null;
                return;
            }

            control.updatingStatus = true;
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId || null,
                typeId: control.typeId || null,
                description: control.description || null,
                subDescriptions: control.subDescriptions || null,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: statusId,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update local control object
                control.statusId = updatedControl.statusId;
                control.statusName = updatedControl.statusName || '';
                control.quickStatusId = null; // Clear selection

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.statusId = updatedControl.statusId;
                        storeControl.statusName = updatedControl.statusName || '';
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                NotificationService.show('Status updated successfully.', 'success');
            }).catch(function (err) {
                console.error('Error updating status:', err);
                NotificationService.show('Error updating status', 'error');
                control.quickStatusId = null; // Clear on error
            }).finally(function () {
                control.updatingStatus = false;
                // Force refresh
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
            });
        };

        ctrl.startEdit = function (control) {
            control.editing = true;
            control.editDescription = control.description;
            control.editProgress = control.progress;
            control.editStatusId = control.statusId;
            if (control.subDescriptions) {
                control.editSubDescriptionsArray = ctrl.getSubDescriptionsWithDetails(control.subDescriptions);
            } else {
                control.editSubDescriptionsArray = [];
            }
            ctrl.updateEditSubDescriptions(control);
        };

        ctrl.cancelEdit = function (control) {
            control.editing = false;
            control.editDescription = control.editProgress = null;
            control.editStatusId = null;
            control.editSubDescriptionsArray = null;
            control.editSubDescriptions = null;
        };

        ctrl.saveControl = function (c) {
            var progressValue = parseInt(c.editProgress);
            if (isNaN(progressValue)) { NotificationService.show('Invalid progress value.', 'error'); return; }
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            var subDescriptionsValue = null;
            if (c.editSubDescriptionsArray && c.editSubDescriptionsArray.length > 0) {
                var valid = c.editSubDescriptionsArray.filter(function (item) {
                    return item && item.description && item.description.trim().length > 0;
                }).map(function (item) {
                    var finalStatusId = item.statusId ? parseInt(item.statusId) : null;
                    var finalProgress = item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null;
                    var finalStatusName = item.statusName;

                    // Auto-advance status if progress is 100%, then reset progress to 0
                    if (finalStatusId && finalProgress === 100 && ctrl.store.statuses) {
                        var currentStatus = ctrl.store.statuses.find(function (s) {
                            return s.id === finalStatusId;
                        });
                        if (currentStatus && currentStatus.statusName) {
                            var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA'];
                            var currentIndex = statusOrder.findIndex(function (s) {
                                return s.toLowerCase() === currentStatus.statusName.toLowerCase();
                            });
                            if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                                var nextStatusName = statusOrder[currentIndex + 1];
                                var nextStatus = ctrl.store.statuses.find(function (s) {
                                    return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                                });
                                if (nextStatus) {
                                    finalStatusId = nextStatus.id;
                                    finalStatusName = nextStatus.statusName;
                                    // Reset progress to 0% for next status
                                    finalProgress = 0;
                                    NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                                }
                            }
                        }
                    }

                    return {
                        description: item.description.trim(),
                        employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                        statusId: finalStatusId,
                        statusName: finalStatusName,
                        progress: finalProgress,
                        comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                    };
                });
                if (valid.length > 0) subDescriptionsValue = JSON.stringify(valid);
            }

            var statusId = c.editStatusId ? parseInt(c.editStatusId) : (c.statusId || null);

            var payload = {
                controlId: parseInt(c.controlId),
                employeeId: c.employeeId || null,
                typeId: c.typeId || null,
                description: c.editDescription || null,
                subDescriptions: subDescriptionsValue,
                comments: c.comments || null, // Keep existing comments unchanged
                progress: progressValue,
                statusId: statusId,
                releaseId: c.releaseId || null,
                releaseDate: c.releaseDate ? new Date(c.releaseDate).toISOString() : null
            };

            c.saving = true;
            ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
                c.description = updatedControl.description;
                c.comments = updatedControl.comments;
                c.progress = updatedControl.progress;
                c.statusId = updatedControl.statusId;
                c.statusName = updatedControl.statusName || '';
                c.subDescriptions = updatedControl.subDescriptions || null;
                c._subDescriptionsArray = updatedControl.subDescriptions
                    ? ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions)
                    : [];

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (ctrl) {
                        return ctrl.controlId === c.controlId;
                    });
                    if (storeControl) {
                        storeControl.description = updatedControl.description;
                        storeControl.comments = updatedControl.comments;
                        storeControl.progress = updatedControl.progress;
                        storeControl.statusId = updatedControl.statusId;
                        storeControl.statusName = updatedControl.statusName || '';
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        } else {
                            storeControl._subDescriptionsArray = [];
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                ctrl.cancelEdit(c);
                NotificationService.show('Developer updates saved. Main table will show updated progress and sub-descriptions.', 'success');
            }).catch(function (err) {
                console.error('Error saving developer updates:', err);
                NotificationService.show('Error saving developer updates', 'error');
            }).finally(function () {
                c.saving = false;
                // Force refresh
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
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
                // Immediately remove from allControls array so it disappears from all views instantly
                var index = ctrl.store.allControls.findIndex(function (c) {
                    return c.controlId === control.controlId;
                });
                if (index > -1) {
                    ctrl.store.allControls.splice(index, 1);
                }
                NotificationService.show('Control deleted successfully', 'success');
                // Broadcast event to notify all components
                $rootScope.$broadcast('controlsUpdated');
                // Reload controls to ensure consistency with backend
                ApiService.loadAllControls();
            }).catch(function (error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                NotificationService.show('Error deleting control', 'error');
            });
        };

        // --- Sub-description helpers ---
        // This function preserves all past comments from database
        ctrl.getSubDescriptionsWithDetails = function (subDescriptionsStr) {
            if (!subDescriptionsStr) return [];
            try {
                var parsed = JSON.parse(subDescriptionsStr);
                if (Array.isArray(parsed)) {
                    return parsed.map(function (item) {
                        if (typeof item === 'string') {
                            return { description: item, raw: null, employeeId: null, statusId: null, statusName: null, progress: null, comments: [] };
                        }
                        // Preserve all existing comments from database
                        // Ensure comments are properly formatted (with text and date)
                        var comments = [];
                        if (item.comments && Array.isArray(item.comments)) {
                            comments = item.comments.map(function (comment) {
                                // Handle both object format {text, date} and string format
                                if (typeof comment === 'string') {
                                    return {
                                        text: comment,
                                        date: new Date().toISOString() // Use current date if no date provided
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
                        return {
                            description: item.description || '',
                            employeeId: item.employeeId || null,
                            statusId: item.statusId || null,
                            statusName: statusName,
                            progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                            releaseId: item.releaseId || null,
                            releaseDate: item.releaseDate || null,
                            comments: comments // Preserve all past comments with proper formatting
                        };
                    }).filter(function (item) { return item.description && item.description.trim().length > 0; });
                }
            } catch (e) {
                // If not JSON, treat as plain text (backward compatibility)
                var lines = subDescriptionsStr.split(/\r?\n|,/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
                return lines.map(function (desc) {
                    return { description: desc, employeeId: null, statusId: null, statusName: null, progress: null, releaseId: null, releaseDate: null, comments: [] };
                });
            }
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

        ctrl.formatCommentDate = function (dateStr) {
            if (!dateStr) return '';
            try {
                var date = new Date(dateStr);
                if (isNaN(date.getTime())) return dateStr;
                var day = String(date.getDate()).padStart(2, '0');
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var year = date.getFullYear();
                return month + '/' + day + '/' + year;
            } catch (e) { return dateStr; }
        };

        ctrl.updateEditSubDescriptions = function (control) {
            if (control.editSubDescriptionsArray) {
                var valid = control.editSubDescriptionsArray.filter(function (item) {
                    return item && item.description && item.description.trim().length > 0;
                }).map(function (item) {
                    var statusId = item.statusId ? parseInt(item.statusId) : null;
                    var progress = item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null;
                    var statusName = item.statusName;

                    // Auto-advance status if progress is 100%, then reset progress to 0
                    if (statusId && progress === 100 && ctrl.store.statuses) {
                        var currentStatus = ctrl.store.statuses.find(function (s) {
                            return s.id === statusId;
                        });
                        if (currentStatus && currentStatus.statusName) {
                            var statusOrder = ['Analyze', 'HLD', 'LLD', 'Development', 'Dev Testing', 'QA'];
                            var currentIndex = statusOrder.findIndex(function (s) {
                                return s.toLowerCase() === currentStatus.statusName.toLowerCase();
                            });
                            if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
                                var nextStatusName = statusOrder[currentIndex + 1];
                                var nextStatus = ctrl.store.statuses.find(function (s) {
                                    return s.statusName && s.statusName.toLowerCase() === nextStatusName.toLowerCase();
                                });
                                if (nextStatus) {
                                    statusId = nextStatus.id;
                                    statusName = nextStatus.statusName;
                                    // Reset progress to 0% for next status
                                    progress = 0;
                                    NotificationService.show(currentStatus.statusName + ' completed! Status automatically changed to ' + nextStatus.statusName + ' with 0% progress.', 'success');
                                }
                            }
                        }
                    }

                    return {
                        description: item.description.trim(),
                        employeeId: item.employeeId ? parseInt(item.employeeId) : null,
                        statusId: statusId,
                        statusName: statusName,
                        progress: progress,
                        releaseId: item.releaseId ? parseInt(item.releaseId) : null,
                        releaseDate: item.releaseDate || null,
                        comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                    };
                });
                control.editSubDescriptions = JSON.stringify(valid);

                // Update the array references too so the UI shows the change immediately
                control.editSubDescriptionsArray.forEach(function (item, index) {
                    var v = valid.find(function (x) { return x.description === item.description; }); // Primitive matching
                    if (v) {
                        item.statusId = v.statusId;
                        item.statusName = v.statusName;
                        item.progress = v.progress;
                    }
                });
            }
        };

        ctrl.addSubDescriptionToArray = function (control) {
            if (!control.editSubDescriptionsArray) control.editSubDescriptionsArray = [];
            control.editSubDescriptionsArray.push({ description: '', raw: null, employeeId: null, progress: null, comments: [] });
            ctrl.updateEditSubDescriptions(control);
        };

        ctrl.removeSubDescriptionFromArray = function (control, index) {
            if (control.editSubDescriptionsArray && index >= 0 && index < control.editSubDescriptionsArray.length) {
                control.editSubDescriptionsArray.splice(index, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };

        // Quick comment to sub-description (without edit mode)
        ctrl.addCommentToSubDescriptionQuick = function (control, subDescIndex) {
            if (!control._subDescriptionsArray || !control._subDescriptionsArray[subDescIndex]) return;
            var subDesc = control._subDescriptionsArray[subDescIndex];
            if (!subDesc.newComment || !subDesc.newComment.trim()) return;

            subDesc.addingComment = true;

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
                    releaseDate: sd.releaseDate || null,
                    comments: sd.comments && Array.isArray(sd.comments) ? sd.comments : []
                };
            });

            var subDescriptionsValue = JSON.stringify(subDescriptionsArray);
            var commentText = subDesc.newComment.trim();
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
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update local control object
                control.subDescriptions = updatedControl.subDescriptions || null;
                if (updatedControl.subDescriptions) {
                    control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                }

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                NotificationService.show('Comment added to sub-description. Main table will show the update.', 'success');
            }).catch(function (err) {
                console.error('Error adding comment to sub-description:', err);
                // Revert the comment addition on error
                if (subDesc.comments && subDesc.comments.length > 0) {
                    subDesc.comments.pop();
                }
                NotificationService.show('Error adding comment', 'error');
            }).finally(function () {
                subDesc.addingComment = false;
                // Force refresh
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
            });
        };

        ctrl.addCommentToSubDescription = function (control, subDescIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) return;
            var subDesc = control.editSubDescriptionsArray[subDescIndex];
            if (!subDesc.newComment || !subDesc.newComment.trim()) return;
            if (!subDesc.comments || !Array.isArray(subDesc.comments)) subDesc.comments = [];
            subDesc.comments.push({ text: subDesc.newComment.trim(), date: new Date().toISOString() });
            subDesc.newComment = '';
            ctrl.updateEditSubDescriptions(control);
        };

        ctrl.removeCommentFromSubDescription = function (control, subDescIndex, commentIndex) {
            if (!control.editSubDescriptionsArray || !control.editSubDescriptionsArray[subDescIndex]) return;
            var subDesc = control.editSubDescriptionsArray[subDescIndex];
            if (!subDesc.comments || !Array.isArray(subDesc.comments)) return;
            if (commentIndex >= 0 && commentIndex < subDesc.comments.length) {
                subDesc.comments.splice(commentIndex, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };

        // Helper to ensure sub-descriptions are initialized for all controls (like control board)
        // This preserves all past comments from database
        ctrl.ensureSubDescriptionsInitialized = function () {
            if (ctrl.store && ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function (c) {
                    // Always process sub-descriptions (like control board does in getAllControls)
                    // This loads existing comments from database - FORCE refresh to ensure latest data
                    if (c.subDescriptions) {
                        // Parse sub-descriptions and preserve all existing comments from DB
                        // Always re-parse to ensure we have the latest data from database
                        // This is critical to load comments that were previously saved
                        c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
                        c._lastSubDescriptionsValue = c.subDescriptions; // Update cache marker

                        // Debug: Log if this is the Security Remediation control
                        if (c.description && c.description.indexOf('Security Remediation') !== -1) {
                            console.log('Loading Security Remediation control:', c.description);
                            console.log('Sub-descriptions string:', c.subDescriptions);
                            console.log('Parsed sub-descriptions:', c._subDescriptionsArray);
                            if (c._subDescriptionsArray && c._subDescriptionsArray.length > 0) {
                                c._subDescriptionsArray.forEach(function (sd, idx) {
                                    console.log('Sub-desc', idx, ':', sd.description, '- Comments:', sd.comments ? sd.comments.length : 0);
                                });
                            }
                        }
                    } else {
                        c._subDescriptionsArray = [];
                        c._lastSubDescriptionsValue = null; // Update cache marker
                    }
                });
            }
        };

        // Loading state
        ctrl.isLoading = true;

        // Function to load and initialize data
        ctrl.loadAndInitialize = function () {
            ctrl.isLoading = true;
            // Ensure statuses are loaded
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            return ApiService.loadEmployees().then(function () {
                return ApiService.loadAllControls();
            }).then(function () {
                // Ensure _subDescriptionsArray for all controls
                // This MUST be called after loadAllControls to ensure fresh data from database
                ctrl.ensureSubDescriptionsInitialized();

                // Force a refresh of the developer controls to ensure comments are loaded
                // This ensures that getDeveloperControls() will have the latest _subDescriptionsArray
                return $timeout(function () {
                    ctrl.isLoading = false;
                    // Don't call $apply here - let Angular handle it naturally
                    // The view will update automatically when isLoading changes
                }, 100); // Small delay to ensure data is fully processed
            }).catch(function (error) {
                console.error('Error loading Developer Progress data:', error);
                NotificationService.show('Error loading Developer data', 'error');
                ctrl.isLoading = false;
                // Don't call $apply - let Angular handle it naturally
            });
        };

        // Initialization using $onInit lifecycle hook
        ctrl.$onInit = function () {
            // Always load fresh data on component initialization
            // This ensures the page is always up-to-date when first loaded
            ctrl.loadAndInitialize().then(function () {
                // Check for controlId in query parameters on initial load
                var controlId = $location.search().controlId;
                if (controlId) {
                    ctrl.scrollToControl(controlId);
                }
            });
        };

        // Listen for controls updates to refresh and re-initialize sub-descriptions
        var controlsUpdateListener = $rootScope.$on('controlsUpdated', function () {
            // Reload controls and re-initialize sub-descriptions when controls are updated
            // This ensures comments from database are always loaded and displayed
            ApiService.loadAllControls().then(function () {
                // MUST re-initialize sub-descriptions after loading to get latest comments
                ctrl.ensureSubDescriptionsInitialized();
                // Don't call $apply - let Angular handle updates naturally
                // The view will update automatically when data changes
            }).catch(function (error) {
                console.error('Error reloading controls after update:', error);
            });
        });

        // Highlighted control ID (from query parameter)
        ctrl.highlightedControlId = null;

        // Function to scroll to and highlight a specific control
        ctrl.scrollToControl = function (controlId) {
            if (!controlId) return;

            // Prevent multiple simultaneous scroll attempts
            if (ctrl._scrollingToControl) return;
            ctrl._scrollingToControl = true;

            // Try multiple times in case data is still loading
            var attempts = 0;
            var maxAttempts = 10;

            var tryScroll = function () {
                attempts++;
                var element = document.getElementById('control-' + controlId);
                if (element) {
                    // Highlight the control first
                    ctrl.highlightedControlId = parseInt(controlId);

                    // Use $timeout instead of $apply to avoid digest conflicts
                    $timeout(function () {
                        // Scroll to element after a brief delay to ensure highlight is visible
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Remove highlight after 4 seconds
                        $timeout(function () {
                            ctrl.highlightedControlId = null;
                            ctrl._scrollingToControl = false;
                        }, 4000);
                    }, 100);
                } else if (attempts < maxAttempts) {
                    // Retry after a short delay if element not found yet
                    $timeout(tryScroll, 200);
                } else {
                    ctrl._scrollingToControl = false;
                }
            };

            // Start trying after initial delay
            $timeout(tryScroll, 300);
        };

        // Listen for route changes to ensure data is loaded when navigating to this page
        var routeChangeListener = $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current && current.$$route && current.$$route.originalPath === '/developer-progress') {
                // Always reload data and re-initialize when navigating to this page
                // This ensures fresh data and proper rendering every time
                ctrl.loadAndInitialize().then(function () {
                    // Check for controlId in query parameters
                    var controlId = $location.search().controlId;
                    if (controlId) {
                        ctrl.scrollToControl(controlId);
                    }
                });
            }
        });

        // Also watch location changes as a backup mechanism
        var locationWatch = $scope.$watch(function () {
            return $location.path() + ($location.search().controlId || '');
        }, function (newPath, oldPath) {
            if (newPath && newPath.indexOf('/developer-progress') !== -1 && newPath !== oldPath) {
                // Prevent multiple simultaneous loads
                if (ctrl._loadingLocation) return;
                ctrl._loadingLocation = true;

                // Navigated to Developer Progress page, ensure data is loaded
                ctrl.loadAndInitialize().then(function () {
                    ctrl._loadingLocation = false;
                    // Check for controlId in query parameters
                    var controlId = $location.search().controlId;
                    if (controlId) {
                        ctrl.scrollToControl(controlId);
                    }
                }).catch(function () {
                    ctrl._loadingLocation = false;
                });
            }
        });

        // Also listen for route change start to prepare for navigation
        var routeChangeStartListener = $rootScope.$on('$routeChangeStart', function (event, next) {
            // If navigating away from Developer Progress page, we can clean up if needed
            if (next && next.$$route && next.$$route.originalPath !== '/developer-progress') {
                // Component will be destroyed, but we can prepare here if needed
            }
        });

        // Cleanup listener on destroy
        ctrl.$onDestroy = function () {
            if (controlsUpdateListener) {
                controlsUpdateListener();
            }
            if (routeChangeListener) {
                routeChangeListener();
            }
            if (routeChangeStartListener) {
                routeChangeStartListener();
            }
            if (locationWatch) {
                locationWatch();
            }
        };
    }
});
