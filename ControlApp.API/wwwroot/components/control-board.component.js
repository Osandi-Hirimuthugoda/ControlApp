app.component('controlBoard', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header bg-success text-white py-2">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Controls</h6>
                <div class="d-flex align-items-center gap-2">
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
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="table-responsive" style="flex: 1; overflow-y: auto;">
                <table class="table table-bordered table-sm mb-0 align-middle">
                    <thead class="table-dark sticky-top">
                        <tr class="text-center">
                            <th style="width:5%">Type</th>
                            <th style="width:15%">Description</th>
                            <th style="width:10%">Employee</th>
                            <th style="width:25%">Comments</th>
                            <th style="width:8%">Prog %</th> 
                            <th style="width:10%">Status</th>
                            <th style="width:15%">Release</th> 
                            <th style="width:12%">Action</th>
                        </tr>
                    </thead>
                    <!-- When All Types is selected, show all controls together without category headers -->
                    <tbody ng-if="!$ctrl.selectedTypeFilter">
                        <tr ng-repeat="control in $ctrl.getAllControls() | orderBy:'-controlId' track by control.controlId">
                            
                            <!-- 1. Type (L# / CR) -->
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            
                            <!-- 2. Description -->
                            <td ng-if="!control.editing">{{control.description}}</td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editDescription" rows="2"></textarea></td>
                            
                            <!-- 3. Employee Name -->
                            <td><strong>{{$ctrl.getEmployeeName(control.employeeId)}}</strong></td>
                            
                            <!-- 4. Comments -->
                            <td ng-if="!control.editing">
                                <div class="mb-1 bg-white border p-1 rounded" style="max-height:80px; overflow-y:auto; font-size:0.8em; white-space:pre-line;">{{control.comments}}</div>
                                <div class="input-group input-group-sm">
                                    <input type="text" class="form-control" ng-model="control.newProgressComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addComment(control)">
                                    <button class="btn btn-outline-secondary" ng-click="$ctrl.addComment(control)">+</button>
                                </div>
                            </td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editComments" rows="4"></textarea></td>

                            <!-- 5. Progress -->
                            <td class="text-center" ng-if="!control.editing">
                                <div class="progress" style="height: 20px;"><div class="progress-bar" ng-style="{'width': control.progress + '%'}">{{control.progress}}%</div></div>
                            </td>
                            <td ng-if="control.editing"><input type="number" min="0" max="100" class="form-control form-control-sm text-center" ng-model="control.editProgress"></td>

                            <!-- 6. Status -->
                            <td class="text-center" ng-if="!control.editing"><span class="badge bg-info">{{control.statusName}}</span></td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" ng-model="control.editStatusId" ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                    <option value="">- Status -</option>
                                </select>
                            </td>

                            <!-- 7. Release -->
                            <td ng-if="!control.editing">
                                <div class="text-muted small" ng-if="control.releaseDate"><i class="fas fa-calendar-alt"></i> {{$ctrl.formatDate(control.releaseDate)}}</div>
                                <span ng-if="!control.releaseDate">-</span>
                            </td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" ng-model="control.editReleaseId" ng-options="r.releaseId as $ctrl.formatDate(r.releaseDate) for r in $ctrl.store.upcomingReleases">
                                    <option value="">-- Release --</option>
                                </select>
                            </td>

                            <!-- 8. Actions -->
                            <td class="text-center">
                                <button ng-if="!control.editing" class="btn btn-sm btn-warning" ng-click="$ctrl.startEdit(control)"><i class="fas fa-edit"></i> Edit</button>
                                <div ng-if="control.editing">
                                    <button class="btn btn-sm btn-success w-100 mb-1" ng-click="$ctrl.saveControl(control)">Save</button>
                                    <button class="btn btn-sm btn-secondary w-100" ng-click="control.editing = false">Cancel</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    
                    <!-- When a specific type is selected, show grouped by type with category headers -->
                    <tbody ng-repeat="type in $ctrl.getFilteredTypes() track by type.controlTypeId" 
                           ng-if="$ctrl.selectedTypeFilter && $ctrl.getControlsByType(type.controlTypeId).length > 0" 
                           style="border-top: 3px solid #6c757d;">
                        <!-- Category Header Row -->
                        <tr class="table-primary">
                            <td colspan="8" class="fw-bold text-center py-2" style="font-size: 1.1em;">
                                <i class="fas fa-tag me-2"></i>{{type.typeName}} Controls
                                <span class="badge bg-light text-dark ms-2">{{$ctrl.getControlsByType(type.controlTypeId).length}}</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getControlsByType(type.controlTypeId) | orderBy:'-controlId' track by control.controlId">
                            
                            <!-- 1. Type (L# / CR) -->
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            
                            <!-- 2. Description -->
                            <td ng-if="!control.editing">{{control.description}}</td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editDescription" rows="2"></textarea></td>
                            
                            <!-- 3. Employee Name -->
                            <td><strong>{{$ctrl.getEmployeeName(control.employeeId)}}</strong></td>
                            
                            <!-- 4. Comments -->
                            <td ng-if="!control.editing">
                                <div class="mb-1 bg-white border p-1 rounded" style="max-height:80px; overflow-y:auto; font-size:0.8em; white-space:pre-line;">{{control.comments}}</div>
                                <div class="input-group input-group-sm">
                                    <input type="text" class="form-control" ng-model="control.newProgressComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addComment(control)">
                                    <button class="btn btn-outline-secondary" ng-click="$ctrl.addComment(control)">+</button>
                                </div>
                            </td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editComments" rows="4"></textarea></td>

                            <!-- 5. Progress -->
                            <td class="text-center" ng-if="!control.editing">
                                <div class="progress" style="height: 20px;"><div class="progress-bar" ng-style="{'width': control.progress + '%'}">{{control.progress}}%</div></div>
                            </td>
                            <td ng-if="control.editing"><input type="number" min="0" max="100" class="form-control form-control-sm text-center" ng-model="control.editProgress"></td>

                            <!-- 6. Status -->
                            <td class="text-center" ng-if="!control.editing"><span class="badge bg-info">{{control.statusName}}</span></td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" ng-model="control.editStatusId" ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                    <option value="">- Status -</option>
                                </select>
                            </td>

                            <!-- 7. Release -->
                            <td ng-if="!control.editing">
                                <div class="text-muted small" ng-if="control.releaseDate"><i class="fas fa-calendar-alt"></i> {{$ctrl.formatDate(control.releaseDate)}}</div>
                                <span ng-if="!control.releaseDate">-</span>
                            </td>
                            <td ng-if="control.editing">
                                <select class="form-select form-select-sm" ng-model="control.editReleaseId" ng-options="r.releaseId as $ctrl.formatDate(r.releaseDate) for r in $ctrl.store.upcomingReleases">
                                    <option value="">-- Release --</option>
                                </select>
                            </td>

                            <!-- 8. Actions -->
                            <td class="text-center">
                                <button ng-if="!control.editing" class="btn btn-sm btn-warning" ng-click="$ctrl.startEdit(control)"><i class="fas fa-edit"></i> Edit</button>
                                <div ng-if="control.editing">
                                    <button class="btn btn-sm btn-success w-100 mb-1" ng-click="$ctrl.saveControl(control)">Save</button>
                                    <button class="btn btn-sm btn-secondary w-100" ng-click="control.editing = false">Cancel</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.selectedTypeFilter = null;

        // Initialize Data on Load
        ApiService.init();

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2);
        };

        ctrl.getAllControls = function() {
            if(!ctrl.store.allControls) return [];
            return ctrl.store.allControls.filter(function(c) {
                // Filter by Search Name or Description
                if(ctrl.searchText) {
                    var term = ctrl.searchText.toLowerCase();
                    var descMatch = c.description && c.description.toLowerCase().includes(term);
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    var empMatch = emp && emp.employeeName.toLowerCase().includes(term);
                    return descMatch || empMatch;
                }
                return true;
            });
        };

        ctrl.getFilteredTypes = function() {
            if(!ctrl.store.controlTypes) return [];
            // If type filter is selected, only show that type
            if(ctrl.selectedTypeFilter) {
                return ctrl.store.controlTypes.filter(function(t) {
                    return t.controlTypeId == ctrl.selectedTypeFilter;
                });
            }
            // Otherwise show all types
            return ctrl.store.controlTypes;
        };

        ctrl.getControlsByType = function(typeId) {
            if(!ctrl.store.allControls) return [];
            return ctrl.store.allControls.filter(function(c) {
                // Must belong to this type
                if(c.typeId != typeId) return false;
                
                 // If type filter is selected, only show controls of that type
                if(ctrl.selectedTypeFilter && c.typeId != ctrl.selectedTypeFilter) return false;
                
                // If type filter is selected, only show controls from employees who have that type
                if(ctrl.selectedTypeFilter) {
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    if(!emp || emp.typeId != ctrl.selectedTypeFilter) return false;
                }
                
                // Filter by Search Text (Name or Description)
                if(ctrl.searchText) {
                    var term = ctrl.searchText.toLowerCase();
                    var descMatch = c.description && c.description.toLowerCase().includes(term);
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    var empMatch = emp && emp.employeeName.toLowerCase().includes(term);
                    return descMatch || empMatch;
                }
                return true;
            });
        };

        ctrl.getEmployeeName = function(employeeId) {
            var emp = ctrl.store.employees.find(e => e.id == employeeId);
            return emp ? emp.employeeName : '';
        };

        ctrl.startEdit = function(c) {
            c.editing = true;
            c.editDescription = c.description;
            c.editComments = c.comments;
            c.editStatusId = c.statusId;
            c.editProgress = c.progress || 0;
            
            // Match Release Date to Dropdown ID
            if(c.releaseDate) {
                var rDate = new Date(c.releaseDate);
                rDate.setHours(0,0,0,0);
                var match = ctrl.store.upcomingReleases.find(r => {
                    var d = new Date(r.releaseDate);
                    d.setHours(0,0,0,0);
                    return d.getTime() === rDate.getTime();
                });
                c.editReleaseId = match ? match.releaseId : null;
            } else {
                c.editReleaseId = null;
            }
        };

        ctrl.saveControl = function(c) {
            // Find selected release object
            var selectedRelease = c.editReleaseId ? ctrl.store.upcomingReleases.find(r => r.releaseId == c.editReleaseId) : null;
            
            var payload = {
                controlId: c.controlId,
                employeeId: c.employeeId,
                typeId: c.typeId,
                description: c.editDescription,
                comments: c.editComments,
                progress: parseInt(c.editProgress || 0),
                statusId: c.editStatusId,
                releaseId: selectedRelease ? selectedRelease.releaseId : null,
                releaseDate: selectedRelease ? new Date(selectedRelease.releaseDate).toISOString() : null
            };

            ApiService.updateControl(c.controlId, payload).then(function(r) {
                var updated = r.data;
                // Update Local View
                c.description = updated.description;
                c.comments = updated.comments;
                c.progress = updated.progress;
                c.statusId = updated.statusId;
                
                var s = ctrl.store.statuses.find(x => x.id == c.statusId);
                c.statusName = s ? s.statusName : '';

                if(updated.releaseDate) c.releaseDate = new Date(updated.releaseDate);
                else c.releaseDate = null;

                c.editing = false;
                NotificationService.show('Saved successfully', 'success');
            }).catch(function() {
                NotificationService.show('Error saving', 'error');
            });
        };

        ctrl.addComment = function(c) {
            if(!c.newProgressComment) return;
            var d = new Date();
            var txt = (d.getMonth()+1)+'/'+d.getDate() + ': ' + c.newProgressComment;
            var newComm = (c.comments ? c.comments + '\n' : '') + txt;
            
            var payload = angular.copy(c);
            payload.comments = newComm;
            // Clean payload
            delete payload.editing; delete payload.statusName; delete payload.typeName;

            ApiService.updateControl(c.controlId, payload).then(function(r) {
                c.comments = r.data.comments;
                c.newProgressComment = '';
                NotificationService.show('Comment added', 'success');
            });
        };
    }
});