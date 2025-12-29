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
                            <th style="width:10%" ng-if="$ctrl.isAdmin()">Action</th> <!-- only can admin delete/edit -->
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
                            </td>

                            <!-- 7. Release -->
                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-items-center gap-1">
                                        <i class="fas fa-calendar-alt text-muted"></i>
                                        <!-- FIX: Removed ng-init/getDateInputValue. Model bound to Date object. -->
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput" 
                                               ng-change="$ctrl.updateReleaseDate(control)"
                                               placeholder="Select date">
                                    </div>
                                    <div class="text-muted small" ng-if="control.releaseDate">
                                        <i class="fas fa-calendar-check"></i> {{$ctrl.formatDate(control.releaseDate)}}
                                    </div>
                                </div>
                            </td>

                            <!-- 8. Actions -->
                            <td class="text-center" ng-if="$ctrl.isAdmin()">
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
                    
                    <!-- When a specific type is selected, show grouped by type -->
                    <tbody ng-repeat="type in $ctrl.getFilteredTypes() track by type.controlTypeId" 
                           ng-if="$ctrl.selectedTypeFilter && $ctrl.getControlsByType(type.controlTypeId).length > 0" 
                           style="border-top: 3px solid #6c757d;">
                        <tr style="background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); color: white;">
                            <td ng-attr-colspan="{{$ctrl.isAdmin() ? 8 : 7}}" class="fw-bold text-center py-2" style="font-size: 1.1em;">
                                <i class="fas fa-tag me-2"></i>{{type.typeName}} Controls
                                <span class="badge" style="background: rgba(255,255,255,0.3); color: white; ms-2;">{{$ctrl.getControlsByType(type.controlTypeId).length}}</span>
                            </td>
                        </tr>
                        <tr ng-repeat="control in $ctrl.getControlsByType(type.controlTypeId) | orderBy:'-controlId' track by control.controlId">
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            <td ng-if="!control.editing">{{control.description}}</td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editDescription" rows="2"></textarea></td>
                            <td><strong>{{$ctrl.getEmployeeName(control.employeeId)}}</strong></td>
                            <td ng-if="!control.editing">
                                <div class="mb-1 bg-white border p-1 rounded" style="max-height:80px; overflow-y:auto; font-size:0.8em; white-space:pre-line;">{{control.comments}}</div>
                                <div class="input-group input-group-sm">
                                    <input type="text" class="form-control" ng-model="control.newProgressComment" placeholder="Add comment..." ng-keyup="$event.keyCode === 13 && $ctrl.addComment(control)">
                                    <button class="btn btn-outline-secondary" ng-click="$ctrl.addComment(control)">+</button>
                                </div>
                            </td>
                            <td ng-if="control.editing"><textarea class="form-control form-control-sm" ng-model="control.editComments" rows="4"></textarea></td>
                            <td class="text-center" ng-if="!control.editing">
                                <div class="progress" style="height: 20px;"><div class="progress-bar" ng-style="{'width': control.progress + '%'}">{{control.progress}}%</div></div>
                            </td>
                            <td ng-if="control.editing"><input type="number" min="0" max="100" class="form-control form-control-sm text-center" ng-model="control.editProgress"></td>
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
                                        <!-- FIX: Removed ng-init/getDateInputValue. Model bound to Date object. -->
                                        <input type="date" 
                                               class="form-control form-control-sm" 
                                               ng-model="control.releaseDateInput" 
                                               ng-change="$ctrl.updateReleaseDate(control)"
                                               placeholder="Select date">
                                    </div>
                                    <div class="text-muted small" ng-if="control.releaseDate">
                                        <i class="fas fa-calendar-check"></i> {{$ctrl.formatDate(control.releaseDate)}}
                                    </div>
                                </div>
                            </td>
                            <td class="text-center" ng-if="$ctrl.isAdmin()">
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
    controller: function(ApiService, NotificationService, AuthService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.selectedTypeFilter = null;
        
        ctrl.isAdmin = function() {
            try {
                var isAdmin = AuthService.isAdmin();
                return isAdmin === true;
            } catch(e) {
                console.error('Error checking admin status:', e);
                return false;
            }
        };
        
        // Store admin status for better performance
        ctrl._isAdmin = null;

        // Initialize Data
        ApiService.init().then(function() {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            // Ensure models are Date objects initially
            ctrl.ensureDateObjects();
        });

        // Ensure all input models are strictly Date objects
        ctrl.ensureDateObjects = function() {
            if(ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function(c) {
                    if(c.releaseDate) {
                        c.releaseDate = new Date(c.releaseDate);
                        c.releaseDateInput = new Date(c.releaseDate);
                    } else {
                        c.releaseDateInput = null;
                    }
                });
            }
        };

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            return day + '.' + month;
        };

        // REMOVED: getDateInputValue function (It was causing the String vs Date error)

        ctrl.updateReleaseDate = function(control) {
            if (!control.releaseDateInput) {
                control.releaseDate = null;
                ctrl.saveReleaseDateOnly(control, null);
                return;
            }

            // control.releaseDateInput is already a Date object
            var selectedDate = new Date(control.releaseDateInput);
            selectedDate.setHours(0, 0, 0, 0);
            control.releaseDate = selectedDate;

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
                    
                    // Assign Date Objects returned from Service
                    control.releaseDate = updatedControl.releaseDate ? new Date(updatedControl.releaseDate) : null;
                    
                    // IMPORTANT: Assign Date Object to input model (not string)
                    control.releaseDateInput = control.releaseDate ? new Date(control.releaseDate) : null;

                    ApiService.loadReleases().then(function() {
                        return ApiService.loadAllControls();
                    });

                    NotificationService.show('Release date updated successfully', 'success');
                }).catch(function(error) {
                    console.error('Error updating release date:', error);
                    var errorMsg = 'Error updating release date';
                    if(error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                    }
                    NotificationService.show(errorMsg, 'error');
                    // Revert on error
                    control.releaseDateInput = control.releaseDate ? new Date(control.releaseDate) : null;
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
            if(!ctrl.store.allControls) return [];
            return ctrl.store.allControls.filter(function(c) {
                // Safeguard: If input model is string (from older cache/state), convert to Date
                if(c.releaseDate && typeof c.releaseDateInput === 'string') {
                    c.releaseDateInput = new Date(c.releaseDate);
                }
                
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
            if(!ctrl.store.allControls) return [];
            return ctrl.store.allControls.filter(function(c) {
                if(c.typeId != typeId) return false;
                if(ctrl.selectedTypeFilter && c.typeId != ctrl.selectedTypeFilter) return false;
                if(ctrl.selectedTypeFilter) {
                    var emp = ctrl.store.employees.find(e => e.id == c.employeeId);
                    if(!emp || emp.typeId != ctrl.selectedTypeFilter) return false;
                }
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

        ctrl.ensureStatusesLoaded = function() {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
        };

        ctrl.startEdit = function(c) {
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
            
            c.editing = true;
            c.editDescription = c.description;
            c.editComments = c.comments;
            c.editStatusId = c.statusId;
            c.editProgress = c.progress || 0;
            
            // Fix: Initialize models as Date Objects
            c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
            c.editReleaseDate = c.releaseDate ? new Date(c.releaseDate) : null;
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
            var employeeId = c.employeeId ? parseInt(c.employeeId) : null;
            if(!typeId || !employeeId) {
                NotificationService.show('Type ID and Employee ID are required', 'error');
                return;
            }

            c.saving = true;

            var saveControlWithPayload = function(finalReleaseId, finalReleaseDate) {
                var payload = {
                    controlId: parseInt(c.controlId),
                    employeeId: employeeId,
                    typeId: typeId,
                    description: c.editDescription || null,
                    comments: c.editComments || null,
                    progress: progressValue,
                    statusId: statusId,
                    releaseId: finalReleaseId,
                    releaseDate: finalReleaseDate // ISO String
                };
                
                return ApiService.updateControl(c.controlId, payload).then(function(updatedControl) {
                    
                    c.description = updatedControl.description;
                    c.comments = updatedControl.comments;
                    c.progress = updatedControl.progress || 0; 
                    c.statusId = updatedControl.statusId;
                    
                    var s = ctrl.store.statuses.find(x => x.id == c.statusId);
                    c.statusName = s ? s.statusName : '';

                    c.releaseDate = updatedControl.releaseDate ? new Date(updatedControl.releaseDate) : null;
                    // Fix: Assign Date object to input model
                    c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;

                    c.editing = false;
                    c.saving = false;
                    
                    ApiService.loadReleases().then(function() {
                        return ApiService.loadAllControls();
                    });
                    
                    NotificationService.show('Saved successfully! Progress: ' + c.progress + '%', 'success');
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
            }).catch(function(error) {
                control.deleting = false;
                console.error('Error deleting control:', error);
                NotificationService.show('Error deleting control', 'error');
            });
        };
    }
});