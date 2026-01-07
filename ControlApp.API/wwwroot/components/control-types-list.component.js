app.component('controlTypesList', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem; flex-shrink: 0;">
            <h5 class="mb-0 fw-bold"><i class="fas fa-tags me-2"></i>Control Types</h5>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="p-3" style="flex-shrink: 0;">
                <input type="text" class="form-control" ng-model="$ctrl.searchType" placeholder="Search types or descriptions...">
            </div>
            <div style="flex: 1; overflow-y: auto; min-height: 0;">
                <!-- Control Types Table -->
                <table class="table table-hover mb-0">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th>Type Name</th>
                            <th>Description</th>
                            <th>Release Date</th>
                            <th class="text-end" ng-if="$ctrl.canManageTypes()">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="type in $ctrl.store.controlTypes | filter:$ctrl.searchType track by type.controlTypeId">
                            <td>
                                <strong ng-if="!type.editing">{{type.typeName}}</strong>
                                <input ng-if="type.editing" type="text" class="form-control form-control-sm" ng-model="type.editTypeName" required>
                            </td>
                            <td>
                                <span ng-if="!type.editing">{{(type.description && type.description.trim()) ? type.description : '-'}}</span>
                                <textarea ng-if="type.editing" class="form-control form-control-sm" ng-model="type.editDescription" rows="2" required></textarea>
                            </td>
                            <td>
                                <span ng-if="!type.editing && type.releaseDate" class="fw-bold" style="font-size: 0.95em;">
                                    <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatDateWithYear(type.releaseDate)}}
                                </span>
                                <span ng-if="!type.editing && !type.releaseDate" class="text-muted">-</span>
                                <div ng-if="type.editing">
                                    <select class="form-select form-select-sm mb-2" 
                                            ng-model="type.editReleaseId" 
                                            ng-options="r.releaseId as $ctrl.formatReleaseName(r) for r in $ctrl.store.upcomingReleases"
                                            ng-change="$ctrl.onReleaseChange(type)">
                                        <option value="">-- Select Release --</option>
                                    </select>
                                    <!-- FIX: This input now receives a Date object, preventing the error -->
                                    <input type="date" class="form-control form-control-sm" ng-model="type.editReleaseDate">
                                </div>
                            </td>
                            <td class="text-end" ng-if="$ctrl.canManageTypes()">
                                <div ng-if="!type.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm btn-warning me-1" ng-click="$ctrl.startEdit(type)" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" ng-click="$ctrl.deleteControlType(type)" ng-disabled="type.deleting" title="Delete">
                                        <span ng-if="!type.deleting"><i class="fas fa-trash"></i></span>
                                        <span ng-if="type.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                </div>
                                <div ng-if="type.editing" style="white-space: nowrap;">
                                    <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControlType(type)" ng-disabled="type.saving" title="Save">
                                        <span ng-if="!type.saving"><i class="fas fa-check"></i></span>
                                        <span ng-if="type.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" ng-click="$ctrl.cancelEdit(type)" ng-disabled="type.saving" title="Cancel">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr ng-if="($ctrl.store.controlTypes | filter:$ctrl.searchType).length === 0">
                            <td colspan="4" class="text-center text-muted py-4">
                                <i class="fas fa-inbox fa-2x mb-2"></i>
                                <p>No control types found</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- All Controls Table -->
                <div class="mt-3">
                    <h6 class="fw-bold mb-2"><i class="fas fa-list-check me-2"></i>All Controls (from API)</h6>
                    <table class="table table-sm table-bordered mb-0">
                        <thead class="table-light">
                            <tr class="text-center">
                                <th style="width:10%">Type</th>
                                <th style="width:30%">Description</th>
                                <th style="width:20%">Employee</th>
                                <th style="width:20%">Release Date</th>
                                <th style="width:20%">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="c in $ctrl.store.allControls | orderBy:'-controlId'">
                                <td class="text-center">
                                    <span class="badge bg-secondary">{{$ctrl.getTypeName(c.typeId)}}</span>
                                </td>
                                <td>{{c.description}}</td>
                                <td>{{$ctrl.getEmployeeName(c.employeeId)}}</td>
                                <td class="text-center">
                                    <span ng-if="c.releaseDate">{{$ctrl.formatDateWithYear(c.releaseDate)}}</span>
                                    <span ng-if="!c.releaseDate" class="text-muted small">No date</span>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-info" ng-if="c.statusName">{{c.statusName}}</span>
                                    <span class="text-muted small" ng-if="!c.statusName">-</span>
                                </td>
                            </tr>
                            <tr ng-if="!$ctrl.store.allControls || $ctrl.store.allControls.length === 0">
                                <td colspan="5" class="text-center text-muted py-3">
                                    <i class="fas fa-inbox me-2"></i>No controls found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, $rootScope, $timeout, AuthService, $q) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchType = '';
        var listener = null;
        
        // Admin, Software Architecture and Team Lead can manage (edit/delete) control types
        ctrl.canManageTypes = function() {
            return AuthService.isAdmin() || AuthService.isSoftwareArchitecture() || AuthService.isTeamLead();
        };
        
        ApiService.loadControlTypes();

        ctrl.$onInit = function() {
            // Ensure we have latest types, employees and controls
            ApiService.loadControlTypes();
            ApiService.loadEmployees();
            ApiService.loadAllControls();

            listener = $rootScope.$on('controlTypesUpdated', function() {
                ApiService.loadControlTypes().then(function(types) {
                    $timeout(function() {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });
            
            // Also listen for controls updates to refresh control types if needed
            var controlsListener = $rootScope.$on('controlsUpdated', function() {
                // Reload control types to ensure they're in sync
                ApiService.loadControlTypes().then(function(types) {
                    $timeout(function() {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });
            
            // Store listener for cleanup
            ctrl.controlsListener = controlsListener;
        };
        
        ctrl.$onDestroy = function() {
            if(listener) {
                listener();
            }
            if(ctrl.controlsListener) {
                ctrl.controlsListener();
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

        // Full date with year (DD.MM.YYYY) for controls table
        ctrl.formatDateWithYear = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return day + '.' + month + '.' + year;
        };

        // Helper: get type name by id
        ctrl.getTypeName = function(typeId) {
            if(!typeId || !ctrl.store.controlTypes) return '';
            var t = ctrl.store.controlTypes.find(function(tp) { return tp.controlTypeId == typeId; });
            return t ? t.typeName : '';
        };

        // Helper: get employee name by id
        ctrl.getEmployeeName = function(employeeId) {
            if(!employeeId || !ctrl.store.employees) return '';
            var e = ctrl.store.employees.find(function(emp) { return emp.id == employeeId; });
            return e ? e.employeeName : '';
        };

        // Format date with year for full date display (DD.MM.YYYY)
        ctrl.formatDateWithYear = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return day + '.' + month + '.' + year;
        };

        ctrl.formatReleaseName = function(release) {
            if(!release) return '';
            if(release.releaseName) return release.releaseName;
            var date = new Date(release.releaseDate);
            var day = ('0' + date.getDate()).slice(-2);
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            return 'Release ' + day + '.' + month;
        };

        ctrl.onReleaseChange = function(type) {
            if(type.editReleaseId) {
                var selectedRelease = ctrl.store.upcomingReleases.find(function(r) {
                    return r.releaseId === type.editReleaseId;
                });
                if(selectedRelease && selectedRelease.releaseDate) {
                    // FIX: Create a new Date Object. Do not convert to string.
                    type.editReleaseDate = new Date(selectedRelease.releaseDate);
                } else {
                    type.editReleaseDate = null;
                }
            } else {
                type.editReleaseDate = null;
            }
        };

        ctrl.startEdit = function(type) {
            type.editing = true;
            type.editTypeName = type.typeName;
            type.editDescription = type.description || '';
            
            // FIX: Ensure editReleaseDate is a Date Object
            if(type.releaseDate) {
                try {
                    var releaseDate = new Date(type.releaseDate);
                    if(!isNaN(releaseDate.getTime())) {
                        type.editReleaseDate = releaseDate; // Assign Date object
                        
                        // Find matching release for dropdown
                        var matchingRelease = ctrl.store.upcomingReleases.find(function(r) {
                            if(!r.releaseDate) return false;
                            var rDate = new Date(r.releaseDate);
                            return !isNaN(rDate.getTime()) && rDate.getTime() === releaseDate.getTime();
                        });
                        if(matchingRelease) {
                            type.editReleaseId = matchingRelease.releaseId;
                        } else {
                            type.editReleaseId = null;
                        }
                    } else {
                        type.editReleaseDate = null;
                        type.editReleaseId = null;
                    }
                } catch(e) {
                    type.editReleaseDate = null;
                }
            } else {
                type.editReleaseDate = null;
                type.editReleaseId = null;
            }
        };

        ctrl.cancelEdit = function(type) {
            type.editing = false;
            delete type.editTypeName;
            delete type.editDescription;
            delete type.editReleaseDate;
            delete type.editReleaseId; 
        };

        ctrl.saveControlType = function(type) {
            if(!type.editTypeName || type.editTypeName.trim() === '') {
                NotificationService.show('Type Name is required', 'error');
                return;
            }

            if(!type.editDescription || type.editDescription.trim() === '') {
                NotificationService.show('Description is required', 'error');
                return;
            }

            type.saving = true;
            
            var releaseDateValue = null;
            // FIX: Convert Date Object to ISO String for API
            if(type.editReleaseDate) {
                try {
                    releaseDateValue = type.editReleaseDate.toISOString();
                } catch(e) {
                    console.error('Error converting release date:', e);
                    releaseDateValue = null;
                }
            }
            
            var payload = {
                typeName: type.editTypeName.trim(),
                description: type.editDescription.trim(),
                releaseDate: releaseDateValue
            };

            // FIX: Service returns object directly (no .data)
            ApiService.updateControlType(type.controlTypeId, payload).then(function(updatedType) {
                type.typeName = updatedType.typeName;
                type.description = updatedType.description;
                
                var newReleaseDate = null;
                if(updatedType.releaseDate) {
                    newReleaseDate = new Date(updatedType.releaseDate);
                    type.releaseDate = newReleaseDate;
                } else {
                    type.releaseDate = null;
                }
                
                type.editing = false;
                type.saving = false;
                
                delete type.editTypeName;
                delete type.editDescription;
                delete type.editReleaseDate;
                delete type.editReleaseId;

                // Update all controls that use this control type
                var controlsToUpdate = [];
                if(ApiService.data.allControls && ApiService.data.allControls.length > 0) {
                    ApiService.data.allControls.forEach(function(control) {
                        if(control.typeId === type.controlTypeId) {
                            // Update the control's description and release date to match the control type
                            var updatePayload = {
                                controlId: parseInt(control.controlId),
                                description: updatedType.description, // Update description from control type
                                comments: control.comments,
                                employeeId: control.employeeId,
                                typeId: control.typeId,
                                statusId: control.statusId,
                                releaseId: control.releaseId,
                                progress: control.progress,
                                releaseDate: newReleaseDate ? newReleaseDate.toISOString() : null
                            };
                            
                            controlsToUpdate.push(
                                ApiService.updateControl(control.controlId, updatePayload)
                            );
                        }
                    });
                }
                
                // Wait for all control updates to complete, then reload
                if(controlsToUpdate.length > 0) {
                    $q.all(controlsToUpdate).then(function() {
                        // Reload controls to get the latest data
                        return ApiService.loadAllControls();
                    }).then(function() {
                        // Broadcast updates to sync all components
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');
                        
                        NotificationService.show('Control Type Updated Successfully! ' + controlsToUpdate.length + ' related control(s) have been updated.', 'success');
                    }).catch(function(error) {
                        console.error('Error updating related controls:', error);
                        // Still show success for control type update
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');
                        NotificationService.show('Control Type Updated Successfully!', 'success');
                    });
                } else {
                    // No controls to update, just reload and broadcast
                    ApiService.loadAllControls().then(function() {
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');
                        NotificationService.show('Control Type Updated Successfully!', 'success');
                    });
                }
            }).catch(function(error) {
                type.saving = false;
                console.error('Error updating control type:', error);
                var errorMsg = 'Error updating control type';
                if(error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            });
        };

        ctrl.deleteControlType = function(type) {
            if(!confirm('Delete Control Type "' + type.typeName + '"?\n\nThis will reassign all employees and controls using this type to another type.')) {
                return;
            }

            type.deleting = true;
            ApiService.deleteControlType(type.controlTypeId).then(function() {
                ApiService.loadControlTypes().then(function(types) {
                    $timeout(function() {
                        ctrl.store = ApiService.data;
                        NotificationService.show('Control Type Deleted Successfully!', 'success');
                    }, 100);
                });
            }).catch(function(error) {
                type.deleting = false;
                console.error('Error deleting control type:', error);
                var errorMsg = 'Error deleting control type';
                if(error && error.data && error.data.message) {
                    errorMsg = error.data.message;
                } else if(error && error.status === 400) {
                    errorMsg = 'Cannot delete this type. ' + (error.data?.title || error.data?.message || '');
                }
                NotificationService.show(errorMsg, 'error');
            });
        };
    }
});