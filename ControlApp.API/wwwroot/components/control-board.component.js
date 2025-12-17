app.component('controlBoard', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.25rem 1.5rem;">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold"><i class="fas fa-list-check me-2"></i>Controls</h6>
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
                    <thead class="sticky-top" style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white;">
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
                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-items-center gap-1">
                                        <i class="fas fa-calendar-alt text-muted"></i>
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput" 
                                               ng-change="$ctrl.updateReleaseDate(control)"
                                               placeholder="Select date"
                                               ng-init="control.releaseDateInput = $ctrl.getDateInputValue(control.releaseDate)">
                                    </div>
                                    <div class="text-muted small" ng-if="control.releaseDate">
                                        <i class="fas fa-calendar-check"></i> {{$ctrl.formatDate(control.releaseDate)}}
                                    </div>
                                </div>
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
                        <tr style="background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); color: white;">
                            <td colspan="8" class="fw-bold text-center py-2" style="font-size: 1.1em;">
                                <i class="fas fa-tag me-2"></i>{{type.typeName}} Controls
                                <span class="badge" style="background: rgba(255,255,255,0.3); color: white; ms-2;">{{$ctrl.getControlsByType(type.controlTypeId).length}}</span>
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
                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-items-center gap-1">
                                        <i class="fas fa-calendar-alt text-muted"></i>
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput" 
                                               ng-change="$ctrl.updateReleaseDate(control)"
                                               placeholder="Select date"
                                               ng-init="control.releaseDateInput = $ctrl.getDateInputValue(control.releaseDate)">
                                    </div>
                                    <div class="text-muted small" ng-if="control.releaseDate">
                                        <i class="fas fa-calendar-check"></i> {{$ctrl.formatDate(control.releaseDate)}}
                                    </div>
                                </div>
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

        // Convert date to YYYY-MM-DD format for date input
        ctrl.getDateInputValue = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + d.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        };

        // Update release date directly from calendar picker
        ctrl.updateReleaseDate = function(control) {
            if (!control.releaseDateInput) {
                // If date is cleared, remove it
                control.releaseDate = null;
                ctrl.saveReleaseDateOnly(control, null);
                return;
            }

            var selectedDate = new Date(control.releaseDateInput);
            selectedDate.setHours(0, 0, 0, 0);
            control.releaseDate = selectedDate;

            // Save the date update
            var releaseDate = selectedDate.toISOString();
            ctrl.saveReleaseDateOnly(control, releaseDate);
        };

        // Save only the release date without entering full edit mode
        ctrl.saveReleaseDateOnly = function(control, releaseDate) {
            // Find matching release if exists
            var releaseId = null;
            var needsReleaseCreation = false;
            var releaseDataToCreate = null;

            if (releaseDate) {
                var selectedDate = new Date(releaseDate);
                selectedDate.setHours(0, 0, 0, 0);

                // Try to find matching release in database
                var matchingRelease = ctrl.store.releases.find(function(r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });

                if (matchingRelease) {
                    releaseId = matchingRelease.releaseId;
                } else {
                    // Check if this date matches any upcoming release
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

            // Prepare payload with only release date update
            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: control.employeeId,
                typeId: control.typeId,
                description: control.description || null,
                comments: control.comments || null,
                progress: control.progress || 0,
                statusId: control.statusId || null,
                releaseId: releaseId,
                releaseDate: releaseDate
            };

            // Function to save control
            var saveControlWithPayload = function(finalReleaseId, finalReleaseDate) {
                payload.releaseId = finalReleaseId;
                payload.releaseDate = finalReleaseDate;

                return ApiService.updateControl(control.controlId, payload).then(function(r) {
                    var updated = r.data;
                    control.releaseDate = updated.releaseDate ? new Date(updated.releaseDate) : null;
                    control.releaseDateInput = ctrl.getDateInputValue(control.releaseDate);

                    // Reload controls and releases
                    ApiService.loadReleases().then(function() {
                        return ApiService.loadAllControls();
                    });

                    NotificationService.show('Release date updated successfully', 'success');
                }).catch(function(error) {
                    console.error('Error updating release date:', error);
                    var errorMsg = 'Error updating release date';
                    if(error && error.data) {
                        if(typeof error.data === 'string') {
                            errorMsg = error.data;
                        } else if(error.data.message) {
                            errorMsg = error.data.message;
                        }
                    }
                    NotificationService.show(errorMsg, 'error');
                    // Revert the date input on error
                    control.releaseDateInput = ctrl.getDateInputValue(control.releaseDate);
                });
            };

            // If release needs to be created, create it first
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
            
            // Ensure releaseDateInput is initialized
            c.releaseDateInput = ctrl.getDateInputValue(c.releaseDate);
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

        // Auto-update when date is selected directly from calendar
        ctrl.onDateChange = function(control) {
            if (control.editReleaseDate) {
                var selectedDate = new Date(control.editReleaseDate);
                selectedDate.setHours(0, 0, 0, 0);
                control.releaseDate = selectedDate;
                console.log('Date changed to:', control.releaseDate);
            } else {
                control.releaseDate = null;
            }
        };

        ctrl.saveControl = function(c) {
            
            var progressValue = parseInt(c.editProgress);
            if (isNaN(progressValue)) {
                NotificationService.show('Invalid progress value. Please enter a number between 0 and 100.', 'error');
                return;
            }
            
            
            var statusId = c.editStatusId && c.editStatusId !== '' && c.editStatusId !== null ? parseInt(c.editStatusId) : null;
            
            
            var releaseId = null;
            var releaseDate = null;
            var needsReleaseCreation = false;
            var releaseDataToCreate = null;
            
            
            var dateToUse = c.editReleaseDate || c.releaseDateInput;
            if (dateToUse) {
                var selectedDate = new Date(dateToUse);
                selectedDate.setHours(0, 0, 0, 0);
                releaseDate = selectedDate.toISOString();
                
                console.log('Date from picker:', c.editReleaseDate);
                console.log('Formatted releaseDate:', releaseDate);
                
                
                var matchingRelease = ctrl.store.releases.find(function(r) {
                    var rDate = new Date(r.releaseDate);
                    rDate.setHours(0, 0, 0, 0);
                    return rDate.getTime() === selectedDate.getTime();
                });
                
                if (matchingRelease) {
                    // Use existing release ID
                    releaseId = matchingRelease.releaseId;
                    console.log('Found matching release in DB:', releaseId);
                } else {
                    // Check if this date matches any upcoming release (default releases)
                    var matchingUpcomingRelease = ctrl.store.upcomingReleases.find(function(r) {
                        var rDate = new Date(r.releaseDate);
                        rDate.setHours(0, 0, 0, 0);
                        return rDate.getTime() === selectedDate.getTime();
                    });
                    
                    if (matchingUpcomingRelease) {
                        // Check if it's a default release (needs to be created)
                        var isDefaultRelease = matchingUpcomingRelease.releaseId >= 999900;
                        if (isDefaultRelease) {
                            // Format release name (e.g., "Release 24.12")
                            var day = ('0' + selectedDate.getDate()).slice(-2);
                            var month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
                            var releaseName = 'Release ' + day + '.' + month;
                            
                            // Prepare release data to create
                            releaseDataToCreate = {
                                releaseName: releaseName,
                                releaseDate: releaseDate,
                                description: null
                            };
                            needsReleaseCreation = true;
                            console.log('Will create release:', releaseDataToCreate);
                        }
                    } else {
                        // No matching release found, but we still save the date
                        console.log('No matching release found, saving date only:', releaseDate);
                    }
                }
            } else {
                console.log('No date selected in picker');
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

            // Set saving flag to disable buttons
            c.saving = true;

            // Function to save control after release is created (if needed)
            var saveControlWithPayload = function(finalReleaseId, finalReleaseDate) {
                // Ensure releaseDate is properly formatted if it exists
                var formattedReleaseDate = null;
                if (finalReleaseDate) {
                    if (typeof finalReleaseDate === 'string') {
                        // If it's already a string (ISO format), use it as is
                        formattedReleaseDate = finalReleaseDate;
                    } else {
                        // If it's a Date object, convert to ISO string
                        formattedReleaseDate = new Date(finalReleaseDate).toISOString();
                    }
                }
                
                var payload = {
                    controlId: parseInt(c.controlId),
                    employeeId: employeeId,
                    typeId: typeId,
                    description: c.editDescription || null,
                    comments: c.editComments || null,
                    progress: progressValue,
                    statusId: statusId,
                    releaseId: finalReleaseId,
                    releaseDate: formattedReleaseDate
                };
                
                console.log('Saving control with payload:', payload);
                console.log('Release Date being saved:', formattedReleaseDate);
                console.log('Progress value being saved:', progressValue);

                return ApiService.updateControl(c.controlId, payload).then(function(r) {
                    var updated = r.data;
                    console.log('Control updated successfully. Response:', updated);
                    
                    c.description = updated.description;
                    c.comments = updated.comments;
                    c.progress = updated.progress || 0; 
                    c.statusId = updated.statusId;
                    
                    var s = ctrl.store.statuses.find(x => x.id == c.statusId);
                    c.statusName = s ? s.statusName : '';

                    if(updated.releaseDate) c.releaseDate = new Date(updated.releaseDate);
                    else c.releaseDate = null;

                    
                    c.releaseDateInput = ctrl.getDateInputValue(c.releaseDate);

                    c.editing = false;
                    c.saving = false;
                    
                    
                    ApiService.loadReleases().then(function() {
                        return ApiService.loadAllControls();
                    }).then(function() {
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

            // If release needs to be created, create it first, then save control
            if(needsReleaseCreation && releaseDataToCreate) {
                ApiService.addRelease(releaseDataToCreate).then(function(createdRelease) {
                    // Use the newly created release ID
                    saveControlWithPayload(createdRelease.releaseId, releaseDate);
                }).catch(function(error) {
                    // If creation fails, save with just the date (no releaseId)
                    console.error('Error creating release:', error);
                    saveControlWithPayload(null, releaseDate);
                });
            } else {
                // No release creation needed, save directly
                // Always save the date if it was set, even if no matching release found
                console.log('Saving control - releaseId:', releaseId, 'releaseDate:', releaseDate);
                saveControlWithPayload(releaseId, releaseDate);
            }
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