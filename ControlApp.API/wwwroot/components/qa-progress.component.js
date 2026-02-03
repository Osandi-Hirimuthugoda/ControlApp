app.component('qaProgress', {
    template: `
    <div class="card shadow-lg qa-progress-card" style="height: 80vh; display: flex; flex-direction: column; border: none; border-radius: 20px; overflow: hidden;">
        <div class="card-header qa-progress-header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: white; padding: 1.5rem 2rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="qa-icon-wrapper me-3" style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 0.75rem; backdrop-filter: blur(10px);">
                        <i class="fas fa-user-check" style="font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <h5 class="mb-0 fw-bold" style="font-size: 1.4rem; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: -0.5px;">
                            QA Engineers Progress
                        </h5>
                        <small class="opacity-90" style="font-size: 0.85rem;">Track and manage QA testing progress</small>
                    </div>
                </div>
                <div class="qa-stats-badge" style="background: rgba(255,255,255,0.25); border-radius: 12px; padding: 0.5rem 1rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
                    <span class="fw-bold">{{$ctrl.getQAControls().length}}</span>
                    <span class="ms-1" style="font-size: 0.85rem;">Controls</span>
                </div>
            </div>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <!-- Loading Indicator -->
            <div ng-if="$ctrl.isLoading" class="d-flex justify-content-center align-items-center" style="flex: 1; min-height: 400px;">
                <div class="text-center">
                    <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted fw-bold">Loading QA Progress Data...</p>
                </div>
            </div>
            <!-- Table Content -->
            <div class="table-responsive" ng-if="!$ctrl.isLoading" style="flex: 1; overflow-y: auto;">
                <table class="table table-hover mb-0 align-middle qa-progress-table" style="margin: 0;">
                    <thead class="sticky-top qa-table-header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <tr class="text-center">
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-tag me-1"></i>Type
                            </th>
                            <th style="width:20%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-file-alt me-1"></i>Description
                            </th>
                            <th style="width:12%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-user-check me-1"></i>QA Engineer
                            </th>
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-chart-line me-1"></i>Progress
                            </th>
                            <th style="width:8%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-info-circle me-1"></i>Status
                            </th>
                            <th style="width:20%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">
                                <i class="fas fa-comments me-1"></i>Comments
                            </th>
                            <th style="width:12%; padding: 1rem 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;" ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                <i class="fas fa-cog me-1"></i>Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-if="$ctrl.getQAControls().length === 0">
                            <td colspan="8" class="text-center py-5" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
                                <div style="padding: 2rem;">
                                    <div style="background: rgba(255,255,255,0.8); border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                        <i class="fas fa-user-slash" style="font-size: 2.5rem; color: #f59e0b;"></i>
                                    </div>
                                    <h6 class="fw-bold mb-2" style="color: #92400e; font-size: 1.1rem;">No Controls Assigned</h6>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem;">No controls have been assigned to QA Engineers yet.</p>
                                </div>
                            </td>
                        </tr>
                        <tr id="control-{{qaControl.controlId}}" 
                            ng-class="{'highlighted-row': $ctrl.highlightedControlId === qaControl.controlId}"
                            ng-repeat="qaControl in $ctrl.getQAControls() | orderBy:'-controlId' track by qaControl.controlId" 
                            class="qa-table-row" 
                            style="transition: all 0.2s ease; border-bottom: 1px solid #f3f4f6;">
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <span class="badge qa-type-badge" style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 0.5rem 0.75rem; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    {{qaControl.typeName}}
                                </span>
                            </td>
                            <td style="padding: 1rem 0.75rem; vertical-align: top;">
                                <div ng-if="!qaControl.editing">
                                    <!-- Main Description -->
                                    <div class="description-3d h5 mb-3">
                                        <i class="fas fa-file-alt me-2"></i>
                                        <span>{{qaControl.description}}</span>
                                    </div>
                                    <div class="d-flex gap-3 mb-3">
                                        <div class="text-success fw-bold small" style="font-size: 0.8rem;" ng-if="qaControl.releaseDate">
                                            <i class="fas fa-calendar-check me-1"></i>Release Date: {{$ctrl.formatDateWithYear(qaControl.releaseDate)}}
                                        </div>
                                        <div class="text-muted small" style="font-size: 0.75rem;" ng-if="qaControl.updatedAt">
                                            <i class="fas fa-history me-1"></i>Last Updated: {{$ctrl.formatDateWithYear(qaControl.updatedAt)}}
                                        </div>
                                    </div>
                                    
                                    <!-- Sub Descriptions Table (like main control board) -->
                                    <div ng-if="qaControl._subDescriptionsArray && qaControl._subDescriptionsArray.length > 0" style="margin-top: 0.75rem;">
                                        <div class="mb-2">
                                            <label class="small fw-bold d-flex align-items-center" style="color: #6366f1; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                                                <i class="fas fa-list-ul me-2" style="font-size: 0.9rem;"></i>Sub Descriptions
                                            </label>
                                        </div>
                                        <table class="subdesc-table" style="box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);">
                                            <thead>
                                                <tr>
                                                    <th style="width: 25%;">Description</th>
                                                    <th style="width: 20%;">Employee</th>
                                                     <th style="width: 15%;">Progress</th>
                                                     <th style="width: 12%;">Release Date</th>
                                                     <th style="width: 23%;">Comments</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="subDesc in qaControl._subDescriptionsArray track by $index">
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
                                                                 role="progressbar"                                                                  ng-class="{
                                                                      'bg-secondary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'analyze',
                                                                      'bg-primary': subDesc.statusName && subDesc.statusName.toLowerCase() === 'development',
                                                                      'bg-info': subDesc.statusName && subDesc.statusName.toLowerCase() === 'dev testing',
                                                                      'bg-warning': !subDesc.statusName || subDesc.statusName.toLowerCase() === 'qa',
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
                                                        
                                                        <!-- Quick comment input for QA engineers (like developers) -->
                                                        <div class="subdesc-comment-input" ng-if="$ctrl.canAddComment() || $ctrl.isAssignedQA(qaControl)">
                                                            <input type="text" 
                                                                   class="form-control form-control-sm" 
                                                                   ng-model="subDesc.newComment" 
                                                                   placeholder="Add comment..." 
                                                                   ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescriptionQuick(qaControl, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" 
                                                                    ng-click="$ctrl.addCommentToSubDescriptionQuick(qaControl, $index)" 
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
                                    <div ng-if="!qaControl._subDescriptionsArray || qaControl._subDescriptionsArray.length === 0" 
                                         class="text-muted small mt-3 p-3 text-center" 
                                         style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; border: 2px dashed #f59e0b;">
                                        <i class="fas fa-info-circle me-2" style="color: #d97706;"></i>
                                        <span style="color: #92400e; font-weight: 500;">No sub-descriptions. Click Edit to add.</span>
                                    </div>
                                </div>
                                <div ng-if="qaControl.editing">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Main Description:</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="qaControl.editDescription" placeholder="Main description">
                                    </div>
                                    <div>
                                        <label class="form-label small fw-bold">Sub Descriptions (updates for developers):</label>
                                        <div ng-if="qaControl.editSubDescriptionsArray && qaControl.editSubDescriptionsArray.length > 0">
                                            <div ng-repeat="subDesc in qaControl.editSubDescriptionsArray track by $index" class="mb-2 p-2 border rounded">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control form-control-sm" ng-model="subDesc.description" placeholder="e.g. Smoke testing, Regression" ng-change="$ctrl.updateEditSubDescriptions(qaControl)">
                                                    </div>
                                                    <div class="col-6">
                                                        <select class="form-select form-select-sm" ng-model="subDesc.employeeId" ng-change="$ctrl.updateEditSubDescriptions(qaControl)">
                                                            <option value="">-- Unassigned --</option>
                                                            <option ng-repeat="emp in $ctrl.store.employees" value="{{emp.id}}">{{emp.employeeName}}</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <label class="form-label small fw-bold">Progress:</label>
                                                        <input type="number" min="0" max="100" class="form-control form-control-sm text-center no-spinners" ng-model="subDesc.progress" placeholder="0-100" ng-change="$ctrl.updateEditSubDescriptions(qaControl)" onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                                    </div>
                                                    <div class="col-2">
                                                        <button class="btn btn-sm btn-danger w-100" ng-click="$ctrl.removeSubDescriptionFromArray(qaControl, $index)" title="Remove"><i class="fas fa-times"></i></button>
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
                                                                    <button class="btn btn-sm btn-link text-danger subdesc-comment-remove" ng-click="$ctrl.removeCommentFromSubDescription(qaControl, $parent.$index, $index)" title="Remove"><i class="fas fa-times"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="subdesc-comment-input">
                                                            <input type="text" class="form-control form-control-sm" ng-model="subDesc.newComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addCommentToSubDescription(qaControl, $index)">
                                                            <button class="btn btn-sm btn-primary subdesc-comment-add" ng-click="$ctrl.addCommentToSubDescription(qaControl, $index)" title="Add"><i class="fas fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-outline-primary w-100" ng-click="$ctrl.addSubDescriptionToArray(qaControl)" type="button"><i class="fas fa-plus me-1"></i>Add Sub Description</button>
                                    </div>
                                </div>
                            </td>
                            <td class="text-start" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div class="d-flex align-items-center">
                                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; margin-right: 0.75rem; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);">
                                        <i class="fas fa-user-check text-white" style="font-size: 0.9rem;"></i>
                                    </div>
                                    <span class="text-primary fw-bold" style="font-size: 0.95rem;">
                                        {{$ctrl.getEmployeeName(qaControl.qaEmployeeId || qaControl.employeeId)}}
                                    </span>
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div ng-if="!qaControl.editing">
                                    <div class="progress mb-2" style="height: 28px; border-radius: 14px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); background: #e5e7eb;">
                                        <div class="progress-bar fw-bold" 
                                             ng-class="{
                                                 'bg-secondary': qaControl.statusName && (qaControl.statusName.toLowerCase() === 'analyze' || qaControl.statusName.toLowerCase() === 'hld' || qaControl.statusName.toLowerCase() === 'lld'),
                                                 'bg-primary': qaControl.statusName && qaControl.statusName.toLowerCase() === 'development',
                                                 'bg-info': qaControl.statusName && qaControl.statusName.toLowerCase() === 'dev testing',
                                                 'bg-warning': !qaControl.statusName || qaControl.statusName.toLowerCase() === 'qa'
                                             }"
                                             ng-style="{'width': qaControl.progress + '%'}"
                                             style="display: flex; align-items: center; justify-content: center; font-size: 0.85rem; border-radius: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: width 0.6s ease;">
                                            {{qaControl.progress}}%
                                        </div>
                                    </div>
                                    <!-- Quick Progress Update (for morning standup) -->
                                    <div class="input-group input-group-sm" ng-if="$ctrl.canMarkProgress()" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <input type="number" min="0" max="100" 
                                               class="form-control form-control-sm text-center no-spinners" 
                                               ng-model="qaControl.quickProgress" 
                                               placeholder="0-100"
                                               style="border: 1px solid #e5e7eb; font-weight: 600;"
                                               ng-keyup="$event.keyCode === 13 && $ctrl.updateProgressQuick(qaControl)"
                                               onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                        <button class="btn btn-sm" 
                                                style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;"
                                                ng-click="$ctrl.updateProgressQuick(qaControl)" 
                                                ng-disabled="qaControl.updatingProgress"
                                                title="Update Progress">
                                            <span ng-if="!qaControl.updatingProgress"><i class="fas fa-save"></i></span>
                                            <span ng-if="qaControl.updatingProgress"><i class="fas fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div ng-if="qaControl.editing">
                                    <input type="number" min="0" max="100" class="form-control form-control-sm text-center no-spinners" 
                                           ng-model="qaControl.editProgress" placeholder="0-100" 
                                           style="border: 2px solid #f59e0b; font-weight: 600; border-radius: 8px;"
                                           onkeydown="if(event.key==='e'||event.key==='E'||event.key==='+'||event.key==='-') event.preventDefault();">
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <span class="badge qa-status-badge" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3); font-size: 0.85rem;">
                                    <i class="fas fa-check-circle me-1"></i>{{qaControl.statusName || 'QA'}}
                                </span>
                            </td>
                            <td style="padding: 1rem 0.75rem; vertical-align: middle;">
                                <div ng-if="!qaControl.editing">
                                    <!-- QA Comments Display -->
                                    <div class="mb-2">
                                        <label class="small fw-bold mb-2 d-block" style="color: #3b82f6; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                            <i class="fas fa-comments me-1"></i>QA Engineer Comments
                                        </label>
                                        <div class="qa-comments-box" style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 2px solid #e5e7eb; border-radius: 12px; padding: 0.75rem; max-height:120px; overflow-y:auto; min-height: 50px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                                            <div ng-if="qaControl.comments"
                                                 ng-repeat="line in qaControl.comments.split('\n') track by $index"
                                                 class="mb-2" style="padding: 0.5rem; background: white; border-radius: 8px; border-left: 3px solid #3b82f6; font-size: 0.85rem; color: #374151;">
                                                <i class="fas fa-circle text-primary" style="font-size: 0.4em; vertical-align: middle; margin-right: 0.5em;"></i>{{line}}
                                            </div>
                                            <span ng-if="!qaControl.comments" class="text-muted small d-block text-center py-2">
                                                <i class="fas fa-comment-slash me-1"></i>No comments yet
                                            </span>
                                        </div>
                                    </div>
                                    <!-- QA Comments Input (for assigned QA engineers) -->
                                    <div class="input-group input-group-sm" ng-if="$ctrl.canAddComment() || $ctrl.isAssignedQA(qaControl)" style="border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                        <span class="input-group-text" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control" 
                                               ng-model="qaControl.newProgressComment" 
                                               placeholder="Add QA comment..." 
                                               style="border: 1px solid #e5e7eb; font-size: 0.85rem;"
                                               ng-keyup="$event.keyCode === 13 && $ctrl.addQAComment(qaControl)">
                                        <button class="btn btn-sm" 
                                                style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; font-weight: 600;"
                                                ng-click="$ctrl.addQAComment(qaControl)" 
                                                ng-disabled="qaControl.addingComment || !qaControl.newProgressComment"
                                                title="Add Comment">
                                            <span ng-if="!qaControl.addingComment"><i class="fas fa-plus"></i></span>
                                            <span ng-if="qaControl.addingComment"><i class="fas fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                    <div ng-if="!$ctrl.canAddComment() && !$ctrl.isAssignedQA(qaControl)" class="text-muted small mt-2 text-center" style="font-size: 0.75rem;">
                                        <i class="fas fa-info-circle me-1"></i>Only assigned QA engineer can add comments
                                    </div>
                                </div>
                                <div ng-if="qaControl.editing">
                                    <label class="small fw-bold mb-2 d-block" style="color: #3b82f6;">QA Comments:</label>
                                    <textarea class="form-control form-control-sm" ng-model="qaControl.editComments" rows="4" placeholder="Enter QA comments..." style="border: 2px solid #f59e0b; border-radius: 10px; resize: vertical;"></textarea>
                                </div>
                            </td>
                            <td class="text-center" style="padding: 1rem 0.75rem; vertical-align: middle;" ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                <div ng-if="!qaControl.editing" style="white-space: nowrap;">
                                    <button ng-if="$ctrl.canEditControl() && !qaControl.isPlaceholder" 
                                            class="btn btn-sm me-1 qa-action-btn-edit" 
                                            ng-click="$ctrl.startEdit(qaControl)" 
                                            title="Edit"
                                            style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3); transition: all 0.2s ease;">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button ng-if="$ctrl.canDeleteControl() && !qaControl.isPlaceholder" 
                                            class="btn btn-sm qa-action-btn-delete" 
                                            ng-click="$ctrl.deleteControl(qaControl)" 
                                            ng-disabled="qaControl.deleting" 
                                            title="Delete"
                                            style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
                                        <span ng-if="!qaControl.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="qaControl.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                </div>
                                <div ng-if="qaControl.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm me-1" 
                                            ng-click="$ctrl.saveControl(qaControl)" 
                                            ng-disabled="qaControl.saving" 
                                            title="Save"
                                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                                        <span ng-if="!qaControl.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="qaControl.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm" 
                                            ng-click="$ctrl.cancelEdit(qaControl)" 
                                            ng-disabled="qaControl.saving" 
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
            // QA Engineers can add comments to controls assigned to them
            return AuthService.canMarkProgress() || AuthService.isQAEngineer();
        };

        ctrl.canMarkProgress = function () {
            return AuthService.canMarkProgress();
        };

        // Check if current user is the QA engineer assigned to this control
        // QA engineers can add comments to controls assigned to them (status = QA and has employeeId)
        ctrl.isAssignedQA = function (control) {
            if (!control || !control.employeeId) return false;
            // If control is in QA status and has an employee assigned, allow QA engineers to comment
            var isQAStatus = control.statusName && control.statusName.toLowerCase() === 'qa';
            var isQAEngineer = AuthService.isQAEngineer();
            return isQAStatus && isQAEngineer && !!control.employeeId;
        };

        ctrl.getEmployeeName = function (employeeId) {
            if (!ctrl.store || !ctrl.store.employees) return '';
            var emp = ctrl.store.employees.find(function (e) { return e.id == employeeId; });
            return emp ? emp.employeeName : '';
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

        // Get controls assigned to QA Engineers (status = "QA" AND has QA Employee assigned via qaEmployeeId OR employeeId is QA Engineer)
        ctrl.getQAControls = function () {
            if (!ctrl.store || !ctrl.store.allControls || !ctrl.store.employees) {
                return [];
            }

            // If still loading, return empty array
            if (ctrl.isLoading) {
                return [];
            }

            var qaControls = [];
            ctrl.store.allControls.forEach(function (control) {
                // Must have status "QA"
                var isQAStatus = control.statusName && control.statusName.toLowerCase() === 'qa';
                if (!isQAStatus) return;

                // Check if control has qaEmployeeId (assigned via QA dropdown in controls page)
                var qaEmployeeId = control.qaEmployeeId;
                var employeeIdToCheck = null;
                var isQAEmployee = false;

                if (qaEmployeeId) {
                    // If qaEmployeeId is set, use that
                    employeeIdToCheck = qaEmployeeId;
                    // Verify that the qaEmployeeId is actually a QA Engineer
                    var qaEmployee = ctrl.store.employees.find(function (emp) {
                        return emp.id === qaEmployeeId;
                    });
                    if (qaEmployee) {
                        var qaRole = '';
                        if (qaEmployee.user && qaEmployee.user.role) {
                            qaRole = (qaEmployee.user.role || '').toLowerCase().trim();
                        } else if (qaEmployee.role) {
                            qaRole = (qaEmployee.role || '').toLowerCase().trim();
                        }
                        if (qaRole === 'qa engineer' || qaRole === 'qa' || qaRole === 'intern qa engineer') {
                            isQAEmployee = true;
                        }
                    }
                } else if (control.employeeId) {
                    // Fallback: Check if employeeId is a QA Engineer (for backward compatibility)
                    employeeIdToCheck = control.employeeId;
                    var employee = ctrl.store.employees.find(function (emp) {
                        return emp.id === control.employeeId;
                    });
                    if (employee) {
                        var role = '';
                        if (employee.user && employee.user.role) {
                            role = (employee.user.role || '').toLowerCase().trim();
                        } else if (employee.role) {
                            role = (employee.role || '').toLowerCase().trim();
                        }
                        if (role === 'qa engineer' || role === 'qa' || role === 'intern qa engineer') {
                            isQAEmployee = true;
                        }
                    }
                }

                // Include control if it has a QA Engineer assigned
                if (isQAEmployee && employeeIdToCheck) {
                    // Ensure qaEmployeeId is set for display purposes
                    if (!control.qaEmployeeId && qaEmployeeId) {
                        control.qaEmployeeId = qaEmployeeId;
                    } else if (!control.qaEmployeeId && control.employeeId && isQAEmployee) {
                        // If employeeId is the QA Engineer, set qaEmployeeId for consistency
                        control.qaEmployeeId = control.employeeId;
                    }

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
                    qaControls.push(control);
                }
            });

            return qaControls;
        };

        // Quick progress update (for morning standup - syncs to main table)
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
                subDescriptions: control.subDescriptions || null,
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
                if (updatedControl.subDescriptions) {
                    control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                    control._lastSubDescriptionsValue = updatedControl.subDescriptions;
                }
                control.quickProgress = null; // Clear input

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.progress = updatedControl.progress;
                        // Ensure qaEmployeeId is set for main table QA Progress column
                        if (control.employeeId && !storeControl.qaEmployeeId) {
                            storeControl.qaEmployeeId = control.employeeId;
                        }
                        // Ensure _subDescriptionsArray is updated if needed
                        if (updatedControl.subDescriptions && !storeControl._subDescriptionsArray) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                NotificationService.show('Progress updated. Main table will show the updated progress.', 'success');
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

        // Add QA Comment (with sync to main table and sub-descriptions for developers)
        ctrl.addQAComment = function (c) {
            if (!c.newProgressComment || !c.newProgressComment.trim()) return;

            c.addingComment = true;
            var d = new Date();
            var dateStr = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
            var commentText = c.newProgressComment.trim();
            var txt = dateStr + ' [QA]: ' + commentText;
            var newComm = (c.comments ? c.comments + '\n' : '') + txt;

            // Also add QA comment to all sub-descriptions so developers can see it
            var subDescriptionsValue = c.subDescriptions || null;
            var updatedSubDescriptions = false;

            // Ensure _subDescriptionsArray is initialized
            if (!c._subDescriptionsArray || c._subDescriptionsArray.length === 0) {
                if (c.subDescriptions) {
                    c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
                } else {
                    c._subDescriptionsArray = [];
                }
            }

            // Add QA comment to all sub-descriptions
            if (c._subDescriptionsArray && c._subDescriptionsArray.length > 0) {
                var updatedSubDescs = c._subDescriptionsArray.map(function (subDesc) {
                    // Initialize comments array if needed
                    if (!subDesc.comments || !Array.isArray(subDesc.comments)) {
                        subDesc.comments = [];
                    }

                    // Add QA comment to this sub-description
                    var qaComment = {
                        text: '[QA]: ' + commentText,
                        date: new Date().toISOString()
                    };
                    subDesc.comments.push(qaComment);
                    updatedSubDescriptions = true;

                    return {
                        description: subDesc.description || '',
                        raw: subDesc.raw || null,
                        employeeId: subDesc.employeeId || null,
                        statusId: subDesc.statusId || null,
                        progress: subDesc.progress !== undefined && subDesc.progress !== null ? parseInt(subDesc.progress) : null,
                        releaseId: subDesc.releaseId || null,
                        releaseDate: subDesc.releaseDate || null,
                        comments: subDesc.comments // Include the new QA comment
                    };
                });

                if (updatedSubDescriptions) {
                    subDescriptionsValue = JSON.stringify(updatedSubDescs);
                }
            } else {
                // If no sub-descriptions exist, create one with the QA comment
                var newSubDesc = {
                    description: c.description || 'Main Task',
                    employeeId: c.employeeId || null,
                    statusId: c.statusId || null,
                    progress: c.progress !== undefined && c.progress !== null ? parseInt(c.progress) : null,
                    comments: [{
                        text: '[QA]: ' + commentText,
                        date: new Date().toISOString()
                    }]
                };
                subDescriptionsValue = JSON.stringify([newSubDesc]);
                updatedSubDescriptions = true;
            }

            var payload = {
                controlId: parseInt(c.controlId),
                employeeId: c.employeeId || null,
                typeId: c.typeId || null,
                description: c.description || null,
                subDescriptions: subDescriptionsValue,
                comments: newComm,
                progress: c.progress || 0,
                statusId: c.statusId || null,
                releaseId: c.releaseId || null,
                releaseDate: c.releaseDate ? new Date(c.releaseDate).toISOString() : null
            };

            ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
                c.comments = updatedControl.comments;
                c.newProgressComment = '';

                // Update sub-descriptions array with new QA comment
                if (updatedControl.subDescriptions) {
                    c.subDescriptions = updatedControl.subDescriptions;
                    c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                }

                // Update in store for immediate sync to main table and developer page
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (ctrl) {
                        return ctrl.controlId === c.controlId;
                    });
                    if (storeControl) {
                        storeControl.comments = updatedControl.comments;
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                        } else {
                            storeControl._subDescriptionsArray = [];
                        }
                        // Ensure qaEmployeeId is set for main table
                        if (c.employeeId && !storeControl.qaEmployeeId) {
                            storeControl.qaEmployeeId = c.employeeId;
                        }
                    }
                }

                // Broadcast update for other components
                $rootScope.$broadcast('controlsUpdated');

                var message = 'QA comment added. Main table will show the updated comments.';
                if (updatedSubDescriptions) {
                    message += ' Developers will see this comment in their comments section.';
                }
                NotificationService.show(message, 'success');
            }).catch(function (error) {
                console.error('Error adding QA comment:', error);
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
            ctrl.addQAComment(c);
        };

        ctrl.startEdit = function (control) {
            control.editing = true;
            control.editDescription = control.description;
            control.editComments = control.comments;
            control.editProgress = control.progress;
            if (control.subDescriptions) {
                control.editSubDescriptionsArray = ctrl.getSubDescriptionsWithDetails(control.subDescriptions);
            } else {
                control.editSubDescriptionsArray = [];
            }
            ctrl.updateEditSubDescriptions(control);
        };

        ctrl.cancelEdit = function (control) {
            control.editing = false;
            control.editDescription = control.editComments = control.editProgress = null;
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
                    var statusId = item.statusId ? parseInt(item.statusId) : null;
                    var progress = item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null;
                    var statusName = item.statusName;

                    // Auto-advance status if progress is 100%, then reset progress to 0
                    if (statusId && progress === 100 && ctrl.store.statuses) {
                        var currentStatus = ctrl.store.statuses.find(function (s) {
                            return s.id === statusId;
                        });
                        if (currentStatus && currentStatus.statusName) {
                            var statusOrder = ['Analyze', 'Development', 'Dev Testing', 'QA'];
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
                if (valid.length > 0) subDescriptionsValue = JSON.stringify(valid);
            }

            var payload = {
                controlId: parseInt(c.controlId),
                employeeId: c.employeeId || null,
                typeId: c.typeId || null,
                description: c.editDescription || null,
                subDescriptions: subDescriptionsValue,
                comments: c.editComments || null,
                progress: progressValue,
                statusId: c.statusId || null,
                releaseId: c.releaseId || null,
                releaseDate: c.releaseDate ? new Date(c.releaseDate).toISOString() : null
            };

            c.saving = true;
            ApiService.updateControl(c.controlId, payload).then(function (updatedControl) {
                // Update local control object with data from server
                c.description = updatedControl.description;
                c.comments = updatedControl.comments;
                c.progress = updatedControl.progress;
                c.statusId = updatedControl.statusId;
                c.statusName = updatedControl.statusName;
                c.releaseId = updatedControl.releaseId;

                if (updatedControl.subDescriptions) {
                    c.subDescriptions = updatedControl.subDescriptions;
                    c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                } else {
                    c.subDescriptions = null;
                    c._subDescriptionsArray = [];
                }

                // Update in store for immediate sync to main table
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (ctrl) {
                        return ctrl.controlId === c.controlId;
                    });
                    if (storeControl) {
                        storeControl.description = updatedControl.description;
                        storeControl.comments = updatedControl.comments;
                        storeControl.progress = updatedControl.progress;
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        // Ensure qaEmployeeId is set for main table QA Progress column
                        if (c.employeeId && !storeControl.qaEmployeeId) {
                            storeControl.qaEmployeeId = c.employeeId;
                        }
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
                NotificationService.show('QA updates saved. Main table will show updated progress and sub-descriptions.', 'success');
            }).catch(function (err) {
                console.error('Error saving QA updates:', err);
                NotificationService.show('Error saving QA updates', 'error');
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

        // --- Sub-description helpers (for QA updates visible to developers) ---
        ctrl.getSubDescriptionsWithDetails = function (subDescriptionsStr) {
            if (!subDescriptionsStr) return [];
            try {
                var parsed = JSON.parse(subDescriptionsStr);
                if (Array.isArray(parsed)) {
                    return parsed.map(function (item) {
                        if (typeof item === 'string') {
                            return { description: item, employeeId: null, statusId: null, statusName: null, progress: null, releaseId: null, releaseName: null, releaseDateInputFormatted: null, comments: [] };
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
                        var releaseDate = null;
                        if (item.releaseId && ctrl.store.releases && ctrl.store.releases.length > 0) {
                            var release = ctrl.store.releases.find(function (r) {
                                return r.releaseId === parseInt(item.releaseId);
                            });
                            if (release) {
                                releaseName = release.releaseName;
                                releaseDate = release.releaseDate;
                            }
                        }

                        return {
                            description: item.description || '',
                            employeeId: item.employeeId || null,
                            statusId: item.statusId || null,
                            statusName: statusName,
                            progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress) : null,
                            releaseName: releaseName,
                            releaseDate: releaseDate,
                            releaseId: item.releaseId || null,
                            releaseDateInputFormatted: releaseDate ? new Date(releaseDate) : null,
                            comments: item.comments && Array.isArray(item.comments) ? item.comments : []
                        };
                    }).filter(function (item) { return item && item.description && (typeof item.description === 'string' ? item.description.trim().length > 0 : true); });
                }
            } catch (e) {
                var lines = subDescriptionsStr.split(/\r?\n|,/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
                return lines.map(function (desc) {
                    return { description: desc, employeeId: null, statusId: null, statusName: null, progress: null, releaseId: null, releaseName: null, releaseDateInputFormatted: null, comments: [] };
                });
            }
            return [];
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
                            var statusOrder = ['Analyze', 'Development', 'Dev Testing', 'QA'];
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
            control.editSubDescriptionsArray.push({ description: '', employeeId: null, statusId: null, progress: null, comments: [] });
            ctrl.updateEditSubDescriptions(control);
        };

        ctrl.removeSubDescriptionFromArray = function (control, index) {
            if (control.editSubDescriptionsArray && index >= 0 && index < control.editSubDescriptionsArray.length) {
                control.editSubDescriptionsArray.splice(index, 1);
                ctrl.updateEditSubDescriptions(control);
            }
        };

        // Quick update for sub-description release date
        ctrl.updateSubDescriptionReleaseQuick = function (control, subDesc, subDescIndex) {
            var newDateString = subDesc.releaseDateInputFormatted;

            ApiService.findOrCreateReleaseByDate(newDateString).then(function (newReleaseId) {
                // Update the local sub-description object
                subDesc.releaseId = newReleaseId;

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
                control.subDescriptions = jsonStr;

                // Update in store for immediate sync
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.subDescriptions = jsonStr;
                        storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(jsonStr);
                    }
                }

                // Update control via API
                var payload = {
                    controlId: parseInt(control.controlId),
                    employeeId: control.employeeId || null,
                    typeId: control.typeId || null,
                    description: control.description || null,
                    subDescriptions: jsonStr,
                    comments: control.comments || null,
                    progress: control.progress || 0,
                    statusId: control.statusId || null,
                    releaseId: control.releaseId || null,
                    releaseDate: control.releaseDate ? new Date(control.releaseDate).toISOString() : null
                };

                return ApiService.updateControl(control.controlId, payload);
            }).then(function (updatedControl) {
                // Update local control object
                control.subDescriptions = updatedControl.subDescriptions || null;
                if (updatedControl.subDescriptions) {
                    control._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                    control._lastSubDescriptionsValue = updatedControl.subDescriptions;
                }

                // Update in store for immediate sync
                if (ctrl.store && ctrl.store.allControls) {
                    var storeControl = ctrl.store.allControls.find(function (c) {
                        return c.controlId === control.controlId;
                    });
                    if (storeControl) {
                        storeControl.subDescriptions = updatedControl.subDescriptions || null;
                        if (updatedControl.subDescriptions) {
                            storeControl._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(updatedControl.subDescriptions);
                            storeControl._lastSubDescriptionsValue = updatedControl.subDescriptions;
                        }
                    }
                }

                NotificationService.show('Release date updated', 'success');
                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (err) {
                console.error('Error updating release date:', err);
                NotificationService.show('Error updating release date', 'error');
            });
        };

        // Quick comment to sub-description (without edit mode - like developers)
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
                    control._lastSubDescriptionsValue = updatedControl.subDescriptions;
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

                $rootScope.$broadcast('controlsUpdated');
                NotificationService.show('Comment added', 'success');
            }).catch(function (err) {
                console.error('Error adding comment:', err);
                if (subDesc.comments && subDesc.comments.length > 0) subDesc.comments.pop();
                NotificationService.show('Error adding comment', 'error');
            }).finally(function () {
                subDesc.addingComment = false;
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

        // Helper to ensure sub-descriptions are initialized for all controls
        ctrl.ensureSubDescriptionsInitialized = function () {
            if (ctrl.store && ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function (c) {
                    if (c.subDescriptions) {
                        c._subDescriptionsArray = ctrl.getSubDescriptionsWithDetails(c.subDescriptions);
                        if (c._subDescriptionsArray) {
                            c._subDescriptionsArray.forEach(function (sd) {
                                if (sd.releaseId && ctrl.store.releases) {
                                    var rel = ctrl.store.releases.find(function (r) { return r.releaseId === sd.releaseId; });
                                    if (rel && rel.releaseDate) {
                                        sd.releaseDateInputFormatted = new Date(rel.releaseDate);
                                    }
                                }
                            });
                        }
                        c._lastSubDescriptionsValue = c.subDescriptions;
                    } else {
                        c._subDescriptionsArray = [];
                        c._lastSubDescriptionsValue = null;
                    }
                });
            }
        };

        ctrl.formatDateForInput = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d.getTime())) return '';
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + d.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        };

        // Loading state
        ctrl.isLoading = true;

        // Function to load and initialize data
        ctrl.loadAndInitialize = function () {
            ctrl.isLoading = true;
            return ApiService.loadEmployees().then(function () {
                return ApiService.loadAllControls();
            }).then(function () {
                // Restore qaEmployeeId from database or fallback to map
                if (ctrl.store && ctrl.store.allControls && ctrl.store.qaEmployeeMap) {
                    ctrl.store.allControls.forEach(function (control) {
                        if (control.statusName && control.statusName.toLowerCase() === 'qa') {
                            if (control.qaEmployeeId) {
                                ctrl.store.qaEmployeeMap[control.controlId] = control.qaEmployeeId;
                            } else if (ctrl.store.qaEmployeeMap[control.controlId]) {
                                control.qaEmployeeId = ctrl.store.qaEmployeeMap[control.controlId];
                            }
                        }
                    });
                }
                ctrl.ensureSubDescriptionsInitialized();
                ctrl.isLoading = false;
                $timeout(function () {
                    if (!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                }, 0);
            }).catch(function (error) {
                console.error('Error loading QA Progress data:', error);
                NotificationService.show('Error loading QA data', 'error');
                ctrl.isLoading = false;
            });
        };

        ctrl.scrollToControl = function (controlId) {
            if (!controlId) return;
            var attempts = 0;
            var maxAttempts = 10;
            var tryScroll = function () {
                attempts++;
                var element = document.getElementById('control-' + controlId);
                if (element) {
                    ctrl.highlightedControlId = parseInt(controlId);
                    $timeout(function () {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        $timeout(function () { ctrl.highlightedControlId = null; }, 4000);
                    }, 100);
                } else if (attempts < maxAttempts) {
                    $timeout(tryScroll, 200);
                }
            };
            $timeout(tryScroll, 300);
        };

        ctrl.$onInit = function () {
            ctrl.loadAndInitialize().then(function () {
                var controlId = $location.search().controlId;
                if (controlId) {
                    ctrl.scrollToControl(controlId);
                }
            });
        };

        var controlsUpdateListener = $rootScope.$on('controlsUpdated', function () {
            ApiService.loadAllControls().then(function () {
                ctrl.ensureSubDescriptionsInitialized();
            }).catch(function (error) {
                console.error('Error reloading controls:', error);
            });
        });

        var routeChangeListener = $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current && current.$$route && current.$$route.originalPath === '/qa-progress') {
                ctrl.loadAndInitialize().then(function () {
                    var controlId = $location.search().controlId;
                    if (controlId) ctrl.scrollToControl(controlId);
                });
            }
        });

        var locationWatch = $scope.$watch(function () {
            return $location.path() + ($location.search().controlId || '');
        }, function (newPath, oldPath) {
            if (newPath && newPath.indexOf('/qa-progress') !== -1 && newPath !== oldPath) {
                ctrl.loadAndInitialize();
            }
        });

        ctrl.$onDestroy = function () {
            if (controlsUpdateListener) controlsUpdateListener();
            if (routeChangeListener) routeChangeListener();
            if (locationWatch) locationWatch();
        };
    }
});
