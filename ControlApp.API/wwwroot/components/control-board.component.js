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
                                <select class="form-select form-select-sm" 
                                        ng-model="control.editStatusId" 
                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                        ng-change="$ctrl.onStatusChange(control)"
                                        ng-init="$ctrl.ensureStatusesLoaded()">
                                    <option value="">- Status -</option>
                                    <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                </select>
                                <small class="text-muted" ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0">
                                    <i class="fas fa-spinner fa-spin"></i> Loading...
                                </small>
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
                                <div ng-if="!control.editing" class="d-flex gap-1 justify-content-center">
                                    <button class="btn btn-sm btn-warning" ng-click="$ctrl.startEdit(control)"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger" ng-click="$ctrl.deleteControl(control)" ng-disabled="control.deleting">
                                        <span ng-if="!control.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="control.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                </div>
                                <div ng-if="control.editing">
                                    <button class="btn btn-sm btn-success w-100 mb-1" ng-click="$ctrl.saveControl(control)" ng-disabled="control.saving">
                                        <span ng-if="!control.saving"><i class="fas fa-save"></i> Save</span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary w-100" ng-click="control.editing = false" ng-disabled="control.saving">Cancel</button>
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
                                <select class="form-select form-select-sm" 
                                        ng-model="control.editStatusId" 
                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses"
                                        ng-change="$ctrl.onStatusChange(control)"
                                        ng-init="$ctrl.ensureStatusesLoaded()">
                                    <option value="">- Status -</option>
                                    <option ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0" disabled>Loading statuses...</option>
                                </select>
                                <small class="text-muted" ng-if="!$ctrl.store.statuses || $ctrl.store.statuses.length === 0">
                                    <i class="fas fa-spinner fa-spin"></i> Loading...
                                </small>
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
                                <div ng-if="!control.editing" class="d-flex gap-1 justify-content-center">
                                    <button class="btn btn-sm btn-warning" ng-click="$ctrl.startEdit(control)"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger" ng-click="$ctrl.deleteControl(control)" ng-disabled="control.deleting">
                                        <span ng-if="!control.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="control.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                </div>
                                <div ng-if="control.editing">
                                    <button class="btn btn-sm btn-success w-100 mb-1" ng-click="$ctrl.saveControl(control)" ng-disabled="control.saving">
                                        <span ng-if="!control.saving"><i class="fas fa-save"></i> Save</span>
                                        <span ng-if="control.saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary w-100" ng-click="control.editing = false" ng-disabled="control.saving">Cancel</button>
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
        ApiService.init().then(function() {
            console.log('Control board initialized. Statuses available:', ctrl.store.statuses ? ctrl.store.statuses.length : 0);
            console.log('Statuses:', ctrl.store.statuses);
            
            // If statuses are empty, try to reload them
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                console.warn('Statuses are empty, attempting to reload...');
                ApiService.loadStatuses().then(function(statuses) {
                    console.log('Statuses reloaded:', statuses.length);
                    console.log('Reloaded statuses:', statuses);
                });
            }
        });

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            // Format: DD.MM (Day.Month) - e.g., 26.01, 25.12
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            return day + '.' + month;
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
            if(!ctrl.store.controlTypes || !ctrl.store.allControls) return [];
            
            // If type filter is selected, only show that type
            if(ctrl.selectedTypeFilter) {
                return ctrl.store.controlTypes.filter(function(t) {
                    return t.controlTypeId == ctrl.selectedTypeFilter;
                });
            }
            
            // Otherwise, show only types that have controls (no duplicates)
            // Get unique type IDs from controls - use Set to ensure uniqueness
            var typeIdsWithControls = [];
            var seenTypeIds = {};
            var seenTypeNames = {}; // Also check by type name to prevent duplicates
            
            ctrl.store.allControls.forEach(function(control) {
                if(control.typeId && !seenTypeIds[control.typeId]) {
                    // Find the type to check its name
                    var type = ctrl.store.controlTypes.find(function(t) {
                        return t.controlTypeId == control.typeId;
                    });
                    
                    // Only add if we haven't seen this type ID or type name before
                    if(type && !seenTypeNames[type.typeName]) {
                        seenTypeIds[control.typeId] = true;
                        seenTypeNames[type.typeName] = true;
                        typeIdsWithControls.push(control.typeId);
                    }
                }
            });
            
            // Return types that have controls, sorted by type name (L3, CR, etc.)
            var typesWithControls = [];
            typeIdsWithControls.forEach(function(typeId) {
                var type = ctrl.store.controlTypes.find(function(t) {
                    return t.controlTypeId == typeId;
                });
                if(type) {
                    typesWithControls.push(type);
                }
            });
            
            // Sort by type name to ensure consistent order (L3, CR, etc.)
            typesWithControls.sort(function(a, b) {
                return (a.typeName || '').localeCompare(b.typeName || '');
            });
            
            return typesWithControls;
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

        // Ensure statuses are loaded
        ctrl.ensureStatusesLoaded = function() {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                console.log('Statuses empty, reloading...');
                ApiService.loadStatuses().then(function(statuses) {
                    console.log('Statuses reloaded in ensureStatusesLoaded:', statuses.length);
                });
            }
        };

        ctrl.startEdit = function(c) {
            // Reload statuses if empty (in case they weren't loaded initially)
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                console.log('Statuses empty, reloading...');
                ApiService.loadStatuses().then(function() {
                    console.log('Statuses reloaded:', ctrl.store.statuses.length);
                });
            }
            
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

        // Auto-update progress when status changes
        ctrl.onStatusChange = function(control) {
            if (!control.editStatusId) {
                return;
            }
            
            // Find the selected status
            var selectedStatus = ctrl.store.statuses.find(function(s) {
                return s.id == control.editStatusId;
            });
            
            if (selectedStatus) {
                // Map status name to progress value
                var progressMap = {
                    'Analyze': 25,
                    'Development': 50,
                    'Dev Testing': 75,
                    'QA': 100
                };
                
                var newProgress = progressMap[selectedStatus.statusName];
                if (newProgress !== undefined) {
                    control.editProgress = newProgress;
                    console.log('Progress auto-updated to', newProgress, 'for status:', selectedStatus.statusName);
                }
            }
        };

        ctrl.saveControl = function(c) {
            // Validate progress value before saving
            var progressValue = parseInt(c.editProgress);
            if (isNaN(progressValue)) {
                NotificationService.show('Invalid progress value. Please enter a number between 0 and 100.', 'error');
                return;
            }
            
            // Find selected release object
            var selectedRelease = c.editReleaseId ? ctrl.store.upcomingReleases.find(r => r.releaseId == c.editReleaseId) : null;
            
            // Convert empty string or undefined to null for optional fields
            var statusId = c.editStatusId && c.editStatusId !== '' && c.editStatusId !== null ? parseInt(c.editStatusId) : null;
            
            // Handle ReleaseId and ReleaseDate
            // Check if the release exists in the actual database releases (not default ones)
            var releaseId = null;
            var releaseDate = null;
            
            if(selectedRelease) {
                // Check if this release exists in the database (not a default release)
                var existsInDb = ctrl.store.releases.some(function(r) {
                    return r.releaseId == selectedRelease.releaseId;
                });
                
                // Only send ReleaseId if it exists in database, otherwise just send ReleaseDate
                if(existsInDb) {
                    releaseId = selectedRelease.releaseId;
                    releaseDate = new Date(selectedRelease.releaseDate).toISOString();
                } else {
                    // Default release (999991, 999992) - only send ReleaseDate, not ReleaseId
                    releaseId = null;
                    releaseDate = new Date(selectedRelease.releaseDate).toISOString();
                }
            }
            
            // Ensure typeId is always a valid integer (use existing if not provided)
            var typeId = (c.typeId && !isNaN(parseInt(c.typeId))) ? parseInt(c.typeId) : null;
            if(!typeId) {
                NotificationService.show('Type ID is required', 'error');
                return;
            }
            
            // Ensure employeeId is valid
            var employeeId = (c.employeeId && !isNaN(parseInt(c.employeeId))) ? parseInt(c.employeeId) : null;
            if(!employeeId) {
                NotificationService.show('Employee ID is required', 'error');
                return;
            }
            
            // Ensure progress is a valid number between 0 and 100
            var progressValue = parseInt(c.editProgress);
            if (isNaN(progressValue) || progressValue < 0) {
                progressValue = 0;
            }
            if (progressValue > 100) {
                progressValue = 100;
            }
            
            var payload = {
                controlId: parseInt(c.controlId),
                employeeId: employeeId,
                typeId: typeId,
                description: c.editDescription || null,
                comments: c.editComments || null,
                progress: progressValue,
                statusId: statusId,
                releaseId: releaseId,
                releaseDate: releaseDate
            };
            
            console.log('Saving control with payload:', payload);
            console.log('Progress value being saved:', progressValue);

            // Set saving flag to disable buttons
            c.saving = true;

            ApiService.updateControl(c.controlId, payload).then(function(r) {
                var updated = r.data;
                console.log('Control updated successfully. Response:', updated);
                
                // Update Local View with all fields including progress
                c.description = updated.description;
                c.comments = updated.comments;
                c.progress = updated.progress || 0; // Ensure progress is set
                c.statusId = updated.statusId;
                
                var s = ctrl.store.statuses.find(x => x.id == c.statusId);
                c.statusName = s ? s.statusName : '';

                if(updated.releaseDate) c.releaseDate = new Date(updated.releaseDate);
                else c.releaseDate = null;

                c.editing = false;
                c.saving = false;
                
                // Reload controls to ensure UI is updated
                ApiService.loadAllControls().then(function() {
                    console.log('Controls reloaded after save. Progress:', c.progress);
                });
                
                NotificationService.show('Saved successfully! Progress: ' + c.progress + '%', 'success');
            }).catch(function(error) {
                // Reset saving flag on error
                c.saving = false;
                console.error('Error saving control:', error);
                console.error('Error response:', error.response || error.data);
                var errorMsg = 'Error saving';
                if(error && error.data) {
                    if(typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if(error.data.message) {
                        errorMsg = error.data.message;
                    } else if(error.data.title) {
                        errorMsg = error.data.title;
                    }
                } else if(error && error.statusText) {
                    errorMsg = 'Error: ' + error.statusText;
                } else if(error && error.message) {
                    errorMsg = error.message;
                }
                NotificationService.show(errorMsg, 'error');
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
            }).catch(function(error) {
                console.error('Error adding comment:', error);
                NotificationService.show('Error adding comment', 'error');
            });
        };

        ctrl.deleteControl = function(control) {
            if(!confirm('Are you sure you want to delete this control?\n\nControl ID: ' + control.controlId + '\nDescription: ' + (control.description || 'N/A'))) {
                return;
            }
            
            control.deleting = true;
            ApiService.deleteControl(control.controlId).then(function() {
                // Remove from local list
                var index = ctrl.store.allControls.findIndex(c => c.controlId === control.controlId);
                if(index > -1) {
                    ctrl.store.allControls.splice(index, 1);
                }
                
                NotificationService.show('Control deleted successfully', 'success');
            }).catch(function(error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                var errorMsg = 'Error deleting control';
                if(error && error.data) {
                    if(typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if(error.data.message) {
                        errorMsg = error.data.message;
                    }
                }
                NotificationService.show(errorMsg, 'error');
            });
        };
    }
});