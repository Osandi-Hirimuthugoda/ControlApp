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
                            <th style="width:10%" ng-if="$ctrl.showActionColumn()">Action</th>
                        </tr>
                    </thead>
                    <!-- When All Types is selected, show all controls in one flat list -->
                    <tbody ng-if="!$ctrl.selectedTypeFilter">
                        <tr ng-repeat="control in $ctrl.getAllControls() | orderBy:'-controlId' track by (control.controlId || control.employeeId)">
                            <td class="text-center"><span class="badge bg-secondary">{{control.typeName}}</span></td>
                            <td>
                                <div>{{control.description}}</div>
                            </td>
                            <td class="text-start">
                                <span ng-init="empName = $ctrl.getEmployeeName(control.employeeId)"
                                      ng-class="{'fw-bold text-danger': empName === 'Unassigned'}">
                                    {{empName || 'Unassigned'}}
                                </span>
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
                                <div>{{control.description}}</div>
                            </td>
                            <td class="text-start">
                                <span ng-init="empName = $ctrl.getEmployeeName(control.employeeId)"
                                      ng-class="{'fw-bold text-danger': empName === 'Unassigned'}">
                                    {{empName || 'Unassigned'}}
                                </span>
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
    controller: function(ApiService, NotificationService, AuthService, $rootScope, $scope) {
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
            
            // Force view update (only if not already in digest cycle)
            if (!$scope.$$phase && !$rootScope.$$phase) {
                $scope.$apply();
            }
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
            if(ctrl.store.allControls) {
                ctrl.store.allControls.forEach(function(c) {
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
            if(!ctrl.store.allControls) ctrl.store.allControls = [];
            if(!ctrl.store.employees) ctrl.store.employees = [];
            
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
            if(!ctrl.store.allControls) ctrl.store.allControls = [];
            if(!ctrl.store.employees) ctrl.store.employees = [];
            
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
            // Don't allow editing description, employee, or type from controls board
            // c.editDescription = c.description; // Removed - edit from control types list
            c.editComments = c.comments;
            c.editStatusId = c.statusId;
            c.editProgress = c.progress || 0;
            // c.editEmployeeId = c.employeeId; // Removed - edit from employee list
            
            // Fix: Initialize models as Date Objects
            c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
            c.releaseDateInputFormatted = c.releaseDate ? ctrl.formatDateForInput(c.releaseDate) : '';
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
            var employeeId = c.employeeId ? parseInt(c.employeeId) : null; // Don't allow changing employee from controls board
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
                    description: c.description || null, // Don't allow editing description from controls board
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
                    c.employeeId = updatedControl.employeeId; // Update employee ID
                    
                    var s = ctrl.store.statuses.find(x => x.id == c.statusId);
                    c.statusName = s ? s.statusName : '';

                    c.releaseDate = updatedControl.releaseDate ? new Date(updatedControl.releaseDate) : null;
                    // Fix: Assign Date object to input model
                    c.releaseDateInput = c.releaseDate ? new Date(c.releaseDate) : null;
                    c.releaseDateInputFormatted = c.releaseDate ? ctrl.formatDateForInput(c.releaseDate) : '';

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