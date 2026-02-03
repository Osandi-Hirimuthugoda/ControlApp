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
                                <th style="width:25%">Description</th>
                                <th style="width:15%">Employee</th>
                                <th style="width:15%">Status</th>
                                <th style="width:20%" 
                                    ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Debug info -->
                            <tr ng-if="false" style="background: #f0f0f0;">
                                <td colspan="6" class="small text-muted">
                                    Debug: Total controls = {{$ctrl.store.allControls ? $ctrl.store.allControls.length : 0}}, 
                                    Without employees = {{$ctrl.store.allControls ? ($ctrl.store.allControls | filter:{employeeId:null}).length : 0}}
                                </td>
                            </tr>
                            <tr ng-repeat="c in $ctrl.store.allControls | orderBy:'-controlId'">
                                <td class="text-center">
                                    <span ng-if="!c.editing" class="badge bg-secondary">{{$ctrl.getTypeName(c.typeId)}}</span>
                                    <select ng-if="c.editing" class="form-select form-select-sm" 
                                            ng-model="c.editTypeId" 
                                            ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes">
                                        <option value="">- Select Type -</option>
                                    </select>
                                </td>
                                <td>
                                    <span ng-if="!c.editing">{{c.description}}</span>
                                    <input ng-if="c.editing" type="text" class="form-control form-control-sm" ng-model="c.editDescription">
                                </td>
                                <td class="text-start">
                                    <span ng-if="!c.editing"
                                          ng-class="{'fw-bold text-danger': (c.employeeName === 'Unassigned' || c.employeeName === '- Not Assigned -' || !c.employeeName || $ctrl.getEmployeeName(c.employeeId) === '- Not Assigned -' || $ctrl.getEmployeeName(c.employeeId) === 'Unassigned')}">
                                        {{c.employeeName || $ctrl.getEmployeeName(c.employeeId)}}
                                    </span>
                                    <select ng-if="c.editing" class="form-select form-select-sm" 
                                            ng-model="c.editEmployeeId" 
                                            ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                                        <option value="">- Select Employee -</option>
                                    </select>
                                </td>
                                <td class="text-center">
                                    <span ng-if="!c.editing && c.statusName" class="badge bg-info">{{c.statusName}}</span>
                                    <span ng-if="!c.editing && !c.statusName" class="text-muted small">-</span>
                                    <select ng-if="c.editing" class="form-select form-select-sm" 
                                            ng-model="c.editStatusId" 
                                            ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                        <option value="">- Select Status -</option>
                                    </select>
                                </td>
                                <td class="text-center"
                                    ng-if="$ctrl.canEditControl() || $ctrl.canDeleteControl()">
                                    <div ng-if="!c.editing" style="white-space: nowrap;">
                                        <button ng-if="$ctrl.canEditControl()" 
                                                class="btn btn-sm btn-warning me-1" 
                                                ng-click="$ctrl.startEditControl(c)" 
                                                title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button ng-if="$ctrl.canDeleteControl()" 
                                                class="btn btn-sm btn-danger" 
                                                ng-click="$ctrl.deleteControl(c)" 
                                                ng-disabled="c.deleting" 
                                                title="Delete">
                                            <span ng-if="!c.deleting"><i class="fas fa-trash"></i></span>
                                            <span ng-if="c.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                    <div ng-if="c.editing" style="white-space: nowrap;">
                                        <button class="btn btn-sm btn-success me-1" ng-click="$ctrl.saveControl(c)" ng-disabled="c.saving" title="Save">
                                            <span ng-if="!c.saving"><i class="fas fa-check"></i></span>
                                            <span ng-if="c.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                        </button>
                                        <button class="btn btn-sm btn-secondary" ng-click="$ctrl.cancelEditControl(c)" ng-disabled="c.saving" title="Cancel">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr ng-if="!$ctrl.store.allControls || $ctrl.store.allControls.length === 0">
                                <td colspan="6" class="text-center text-muted py-3">
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
    controller: function (ApiService, NotificationService, $rootScope, $timeout, AuthService, $q) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchType = '';
        var listener = null;

        // Admin, Software Architecture and Team Lead can manage (edit/delete) control types
        ctrl.canManageTypes = function () {
            return AuthService.isAdmin() || AuthService.isSoftwareArchitecture() || AuthService.isTeamLead();
        };

        // Check if user can edit controls
        ctrl.canEditControl = function () {
            return AuthService.canEditControl();
        };

        // Check if user can delete controls
        ctrl.canDeleteControl = function () {
            return AuthService.canDeleteControl();
        };

        // Check if user can add controls
        ctrl.canAddControl = function () {
            return AuthService.canAddControl();
        };

        // Add new control form
        ctrl.showAddForm = false;
        ctrl.isAdding = false;
        ctrl.newControl = {
            typeId: null,
            description: '',
            employeeId: null,
            releaseDate: null,
            statusId: null,
            progress: 0,
            comments: ''
        };

        ctrl.cancelAddControl = function () {
            ctrl.showAddForm = false;
            ctrl.newControl = {
                typeId: null,
                description: '',
                employeeId: null,
                releaseDate: null,
                statusId: null,
                progress: 0,
                comments: ''
            };
        };

        ctrl.addNewControl = function () {
            if (!ctrl.newControl.typeId || !ctrl.newControl.description) {
                NotificationService.show('Type and Description are required', 'error');
                return;
            }

            ctrl.isAdding = true;

            // Ensure employeeId is null if not selected (not 0 or empty string)
            var employeeIdValue = null;
            if (ctrl.newControl.employeeId && ctrl.newControl.employeeId !== '' && ctrl.newControl.employeeId !== 'null') {
                var parsedId = parseInt(ctrl.newControl.employeeId);
                if (!isNaN(parsedId) && parsedId > 0) {
                    employeeIdValue = parsedId;
                }
            }

            var payload = {
                typeId: parseInt(ctrl.newControl.typeId),
                description: ctrl.newControl.description.trim(),
                employeeId: employeeIdValue,  // This will be null if no employee selected
                statusId: ctrl.newControl.statusId ? parseInt(ctrl.newControl.statusId) : null,
                progress: 0,
                comments: ''
            };

            console.log('Adding control with payload:', payload);

            // EmployeeId is optional - can be null
            // No need to check for employees - control can be created without employee assignment

            ApiService.addControl(payload).then(function (createdControl) {
                console.log('Control created successfully:', createdControl);
                NotificationService.show('Control added successfully!', 'success');
                ctrl.cancelAddControl();

                // Reload controls to ensure all controls including those without employees are loaded
                return ApiService.loadAllControls();
            }).then(function (allControls) {
                console.log('All controls loaded after adding:', allControls);
                console.log('Controls without employees:', allControls ? allControls.filter(function (c) { return !c.employeeId; }) : []);

                // Force view update
                $timeout(function () {
                    ctrl.store = ApiService.data;
                    $rootScope.$apply();
                }, 100);

                $rootScope.$broadcast('controlsUpdated');
            }).catch(function (error) {
                ctrl.isAdding = false;
                console.error('Error adding control:', error);
                var errorMsg = 'Error adding control';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || errorMsg);
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isAdding = false;
            });
        };

        ApiService.loadControlTypes();

        ctrl.$onInit = function () {
            // Ensure we have latest types, employees and controls
            ApiService.loadControlTypes().then(function () {
                return ApiService.loadEmployees();
            }).then(function () {
                return ApiService.loadAllControls();
            }).then(function () {
                // Force view update after loading
                $timeout(function () {
                    ctrl.store = ApiService.data;
                }, 100);
            });

            listener = $rootScope.$on('controlTypesUpdated', function () {
                ApiService.loadControlTypes().then(function (types) {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            // Also listen for controls updates to refresh controls and control types
            var controlsListener = $rootScope.$on('controlsUpdated', function () {
                // Reload both controls and control types to ensure they're in sync
                ApiService.loadAllControls().then(function () {
                    return ApiService.loadControlTypes();
                }).then(function () {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            // Store listener for cleanup
            ctrl.controlsListener = controlsListener;
        };

        ctrl.$onDestroy = function () {
            if (listener) {
                listener();
            }
            if (ctrl.controlsListener) {
                ctrl.controlsListener();
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

        ctrl.formatDateWithYear = function (date) {
            if (!date) return '';
            var d = new Date(date);
            if (isNaN(d)) return '';
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var year = d.getFullYear();
            return month + '/' + day + '/' + year;
        };

        // Helper: get type name by id
        ctrl.getTypeName = function (typeId) {
            if (!typeId || !ctrl.store.controlTypes) return '';
            var t = ctrl.store.controlTypes.find(function (tp) { return tp.controlTypeId == typeId; });
            return t ? t.typeName : '';
        };

        // Helper: get employee name by id
        ctrl.getEmployeeName = function (employeeId) {
            if (!employeeId || !ctrl.store.employees) return '- Not Assigned -';
            var e = ctrl.store.employees.find(function (emp) { return emp.id == employeeId; });
            return e ? e.employeeName : '- Not Assigned -';
        };




        ctrl.startEdit = function (type) {
            type.editing = true;
            type.editTypeName = type.typeName;
            type.editDescription = type.description || '';
        };

        ctrl.cancelEdit = function (type) {
            type.editing = false;
            delete type.editTypeName;
            delete type.editDescription;
        };

        ctrl.saveControlType = function (type) {
            if (!type.editTypeName || type.editTypeName.trim() === '') {
                NotificationService.show('Type Name is required', 'error');
                return;
            }

            if (!type.editDescription || type.editDescription.trim() === '') {
                NotificationService.show('Description is required', 'error');
                return;
            }

            type.saving = true;

            var payload = {
                typeName: type.editTypeName.trim(),
                description: type.editDescription.trim(),
                releaseDate: type.releaseDate ? (new Date(type.releaseDate)).toISOString() : null
            };

            // FIX: Service returns object directly (no .data)
            ApiService.updateControlType(type.controlTypeId, payload).then(function (updatedType) {
                type.typeName = updatedType.typeName;
                type.description = updatedType.description;

                var newReleaseDate = null;
                if (updatedType.releaseDate) {
                    newReleaseDate = new Date(updatedType.releaseDate);
                    type.releaseDate = newReleaseDate;
                } else {
                    type.releaseDate = null;
                }

                type.editing = false;
                type.saving = false;

                delete type.editTypeName;
                delete type.editDescription;

                // Update all controls that use this control type
                var controlsToUpdate = [];
                if (ApiService.data.allControls && ApiService.data.allControls.length > 0) {
                    ApiService.data.allControls.forEach(function (control) {
                        if (control.typeId === type.controlTypeId) {
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
                if (controlsToUpdate.length > 0) {
                    $q.all(controlsToUpdate).then(function () {
                        // Reload controls to get the latest data
                        return ApiService.loadAllControls();
                    }).then(function () {
                        // Broadcast updates to sync all components
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');

                        NotificationService.show('Control Type Updated Successfully! ' + controlsToUpdate.length + ' related control(s) have been updated.', 'success');
                    }).catch(function (error) {
                        console.error('Error updating related controls:', error);
                        // Still show success for control type update
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');
                        NotificationService.show('Control Type Updated Successfully!', 'success');
                    });
                } else {
                    // No controls to update, just reload and broadcast
                    ApiService.loadAllControls().then(function () {
                        $rootScope.$broadcast('controlTypesUpdated');
                        $rootScope.$broadcast('controlsUpdated');
                        NotificationService.show('Control Type Updated Successfully!', 'success');
                    });
                }
            }).catch(function (error) {
                type.saving = false;
                console.error('Error updating control type:', error);
                var errorMsg = 'Error updating control type';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            });
        };

        ctrl.deleteControlType = function (type) {
            if (!confirm('Delete Control Type "' + type.typeName + '"?\n\nThis will reassign all employees and controls using this type to another type.')) {
                return;
            }

            type.deleting = true;
            ApiService.deleteControlType(type.controlTypeId).then(function () {
                ApiService.loadControlTypes().then(function (types) {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                        NotificationService.show('Control Type Deleted Successfully!', 'success');
                    }, 100);
                });
            }).catch(function (error) {
                type.deleting = false;
                console.error('Error deleting control type:', error);
                var errorMsg = 'Error deleting control type';
                if (error && error.data && error.data.message) {
                    errorMsg = error.data.message;
                } else if (error && error.status === 400) {
                    errorMsg = 'Cannot delete this type. ' + (error.data?.title || error.data?.message || '');
                }
                NotificationService.show(errorMsg, 'error');
            });
        };

        // Control editing methods for All Controls table
        ctrl.startEditControl = function (control) {
            if (!control.controlId) {
                NotificationService.show('Cannot edit: No control assigned', 'error');
                return;
            }

            control.editing = true;
            control.editDescription = control.description || '';
            control.editComments = control.comments || '';
            control.editStatusId = control.statusId || null;
            control.editProgress = control.progress || 0;
            control.editEmployeeId = control.employeeId || null;
            control.editTypeId = control.typeId || null;

            // Ensure statuses are loaded
            if (!ctrl.store.statuses || ctrl.store.statuses.length === 0) {
                ApiService.loadStatuses();
            }
        };

        ctrl.cancelEditControl = function (control) {
            control.editing = false;
            delete control.editDescription;
            delete control.editComments;
            delete control.editStatusId;
            delete control.editProgress;
            delete control.editEmployeeId;
            delete control.editTypeId;
        };

        ctrl.saveControl = function (control) {
            if (!control.controlId) {
                NotificationService.show('Cannot save: No control assigned', 'error');
                return;
            }

            var progressValue = parseInt(control.editProgress) || 0;
            if (progressValue < 0) progressValue = 0;
            if (progressValue > 100) progressValue = 100;

            var statusId = control.editStatusId ? parseInt(control.editStatusId) : null;
            var employeeId = control.editEmployeeId ? parseInt(control.editEmployeeId) : null;
            var typeId = control.editTypeId ? parseInt(control.editTypeId) : null;

            if (!typeId) {
                NotificationService.show('Type ID is required', 'error');
                return;
            }

            // Employee ID is optional - can assign later
            if (!employeeId && control.employeeId) {
                // Keep existing employeeId if not changed
                employeeId = control.employeeId;
            }

            control.saving = true;

            var payload = {
                controlId: parseInt(control.controlId),
                employeeId: employeeId,
                typeId: typeId,
                description: control.editDescription || null,
                comments: control.editComments || null,
                progress: progressValue,
                statusId: statusId,
                releaseId: control.releaseId || null,
                releaseDate: control.releaseDate ? (new Date(control.releaseDate)).toISOString() : null
            };

            ApiService.updateControl(control.controlId, payload).then(function (updatedControl) {
                // Update the control object with returned data
                control.description = updatedControl.description;
                control.comments = updatedControl.comments;
                control.progress = updatedControl.progress || 0;
                control.statusId = updatedControl.statusId;
                control.employeeId = updatedControl.employeeId;
                control.typeId = updatedControl.typeId;

                var status = ctrl.store.statuses.find(function (s) { return s.id == control.statusId; });
                control.statusName = status ? status.statusName : '';

                control.editing = false;
                control.saving = false;

                // Reload controls to ensure sync
                ApiService.loadAllControls().then(function () {
                    $rootScope.$broadcast('controlsUpdated');
                    NotificationService.show('Control updated successfully!', 'success');
                });
            }).catch(function (error) {
                control.saving = false;
                console.error('Error saving control:', error);
                var errorMsg = 'Error saving control';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
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