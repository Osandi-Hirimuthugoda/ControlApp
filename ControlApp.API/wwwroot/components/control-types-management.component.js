app.component('controlTypesManagement', {
    template: `
    <div class="container-fluid p-4" style="animation: fadeIn 0.5s ease-out;">
        <!-- Debug Info -->
        <div ng-if="!$ctrl.canManageTypes()" class="alert alert-warning">
            <h5><i class="fas fa-exclamation-triangle me-2"></i>Access Restricted</h5>
            <p>You need Admin, Software Architecture, or Team Lead permissions to manage control types.</p>
            <p><strong>Your current role:</strong> {{$ctrl.getCurrentUserRole()}}</p>
        </div>

        <!-- Main Content (only show if user has permissions) -->
        <div ng-if="$ctrl.canManageTypes()">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 class="fw-bold text-dark mb-1">
                                <i class="fas fa-tags me-3 text-primary"></i>Control Types Management
                            </h2>
                            <p class="text-muted mb-0">Configure and manage system control categories</p>
                        </div>
                    </div>
                </div>
            </div>

        <!-- Control Types Management Card -->
        <div class="row">
            <div class="col-12">
                <div class="card shadow-lg border-0" style="border-radius: 24px; overflow: hidden; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
                    <div class="card-header border-0 d-flex justify-content-between align-items-center" 
                         style="background: #0c85e8ff; color: #1f2937; padding: 1.5rem 2rem;">
                        <div>
                            <h4 class="mb-0 fw-bold" style="color: #1f2937;">
                                <i class="fas fa-cogs me-3"></i>Control Types Configuration
                            </h4>
                            <p class="mb-0 small mt-1" style="color: #4b5563;">Manage control type definitions and descriptions</p>
                        </div>
                        <span class="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm">
                            {{$ctrl.store.controlTypes.length}} Types
                        </span>
                    </div>
                    
                    <div class="card-body p-4">
                        <!-- Search and Actions Bar -->
                        <div class="row mb-4 align-items-center">
                            <div class="col-md-6">
                                <div class="input-group shadow-sm" style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.2);">
                                    <span class="input-group-text bg-white border-0 text-primary">
                                        <i class="fas fa-search"></i>
                                    </span>
                                    <input type="text" class="form-control border-0 ps-0" ng-model="$ctrl.searchType" 
                                           placeholder="Filter control types or descriptions..." 
                                           style="height: 48px; box-shadow: none;">
                                </div>
                            </div>
                            <div class="col-md-6 text-end" ng-if="$ctrl.canManageTypes()">
                                <button class="btn btn-primary shadow-sm" ng-click="$ctrl.showAddForm = !$ctrl.showAddForm">
                                    <i class="fas fa-plus me-2"></i>Add New Type
                                </button>
                            </div>
                        </div>

                        <!-- Add New Type Form -->
                        <div ng-if="$ctrl.showAddForm && $ctrl.canManageTypes()" class="card border-primary mb-4" style="border-radius: 16px;">
                            <div class="card-header bg-primary text-white">
                                <h6 class="mb-0"><i class="fas fa-plus me-2"></i>Add New Control Type</h6>
                            </div>
                            <div class="card-body">
                                <form ng-submit="$ctrl.addControlType()">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Type Name *</label>
                                            <input type="text" class="form-control" ng-model="$ctrl.newType.typeName" 
                                                   placeholder="Enter type name" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Description *</label>
                                            <input type="text" class="form-control" ng-model="$ctrl.newType.description" 
                                                   placeholder="Enter description" required>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-flex gap-2">
                                                <button type="submit" class="btn btn-success" ng-disabled="$ctrl.isAdding">
                                                    <span ng-if="!$ctrl.isAdding"><i class="fas fa-save me-2"></i>Save Type</span>
                                                    <span ng-if="$ctrl.isAdding"><i class="fas fa-spinner fa-spin me-2"></i>Saving...</span>
                                                </button>
                                                <button type="button" class="btn btn-secondary" ng-click="$ctrl.cancelAddType()">
                                                    <i class="fas fa-times me-2"></i>Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Control Types Table -->
                        <div class="table-responsive rounded-4 shadow-sm" style="border: 1px solid rgba(0,0,0,0.05);">
                            <table class="table table-hover align-middle mb-0">
                                <thead style="background: #f8fafc;">
                                    <tr>
                                        <th class="py-3 px-4 text-secondary small fw-bold text-uppercase" style="width: 25%">Type Name</th>
                                        <th class="py-3 px-4 text-secondary small fw-bold text-uppercase">Description</th>
                                        <th class="py-3 px-4 text-secondary small fw-bold text-uppercase text-center" style="width: 15%">Controls Count</th>
                                        <th class="py-3 px-4 text-secondary small fw-bold text-uppercase text-end" style="width: 15%" ng-if="$ctrl.canManageTypes()">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="type in $ctrl.store.controlTypes | filter:$ctrl.searchType track by type.controlTypeId" 
                                        class="border-bottom" style="transition: all 0.3s ease;">
                                        <td class="py-3 px-4">
                                            <div ng-if="!type.editing" class="d-flex align-items-center">
                                                <div class="type-icon-circle me-3" style="width: 40px; height: 40px; border-radius: 10px; background: rgba(99, 102, 241, 0.1); color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                                    {{type.typeName.substring(0, 1)}}
                                                </div>
                                                <span class="fw-bold text-dark">{{type.typeName}}</span>
                                            </div>
                                            <input ng-if="type.editing" type="text" class="form-control form-control-sm border-primary" ng-model="type.editTypeName" required>
                                        </td>
                                        <td class="py-3 px-4">
                                            <div ng-if="!type.editing" class="text-secondary">{{(type.description && type.description.trim()) ? type.description : 'No description provided.'}}</div>
                                            <textarea ng-if="type.editing" class="form-control form-control-sm border-primary" ng-model="type.editDescription" rows="2" required></textarea>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <span class="badge bg-light text-dark border">{{$ctrl.getControlsCount(type.controlTypeId)}}</span>
                                        </td>
                                        <td class="py-3 px-4 text-end" ng-if="$ctrl.canManageTypes()">
                                            <div ng-if="!type.editing" class="btn-group shadow-sm rounded-3 overflow-hidden">
                                                <button class="btn btn-sm btn-light border-0 text-warning px-3" ng-click="$ctrl.startEdit(type)" title="Edit Type">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-light border-0 text-danger px-3" ng-click="$ctrl.deleteControlType(type)" ng-disabled="type.deleting" title="Delete Type">
                                                    <span ng-if="!type.deleting"><i class="fas fa-trash-alt"></i></span>
                                                    <span ng-if="type.deleting"><i class="fas fa-spinner fa-spin"></i></span>
                                                </button>
                                            </div>
                                            <div ng-if="type.editing" class="btn-group shadow-sm rounded-3 overflow-hidden">
                                                <button class="btn btn-sm btn-success px-3 border-0" ng-click="$ctrl.saveControlType(type)" ng-disabled="type.saving" title="Save Changes">
                                                    <span ng-if="!type.saving"><i class="fas fa-check"></i></span>
                                                    <span ng-if="type.saving"><i class="fas fa-spinner fa-spin"></i></span>
                                                </button>
                                                <button class="btn btn-sm btn-secondary px-3 border-0" ng-click="$ctrl.cancelEdit(type)" ng-disabled="type.saving" title="Cancel">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr ng-if="($ctrl.store.controlTypes | filter:$ctrl.searchType).length === 0">
                                        <td colspan="4" class="text-center py-5">
                                            <div class="empty-state">
                                                <i class="fas fa-folder-open fa-3x text-light mb-3"></i>
                                                <h6 class="text-secondary fw-bold">No Control Types Found</h6>
                                                <p class="text-muted small">Try refining your search or add a new type.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .table tbody tr:hover {
            background-color: rgba(99, 102, 241, 0.02) !important;
            transform: scale(1.002);
            transition: all 0.2s ease;
        }
        .form-control:focus, .form-select:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
            border-color: #6366f1 !important;
        }
        .btn-group .btn:hover {
            transform: none !important;
            background-color: rgba(0,0,0,0.05) !important;
        }
    </style>
    `,
    controller: function (ApiService, NotificationService, $rootScope, $timeout, AuthService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchType = '';
        ctrl.showAddForm = false;
        ctrl.isAdding = false;
        ctrl.newType = {
            typeName: '',
            description: ''
        };

        // Admin, Software Architecture and Team Lead can manage (edit/delete) control types
        ctrl.canManageTypes = function () {
            return AuthService.isAdmin() || AuthService.isSoftwareArchitecture() || AuthService.isTeamLead();
        };

        // Get current user role for debugging
        ctrl.getCurrentUserRole = function () {
            var user = AuthService.getUser();
            return user ? user.role : 'Unknown';
        };

        ctrl.$onInit = function () {
            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            console.log('Loading control types for team:', currentTeamId);
            
            // Load control types and controls for current team
            ApiService.loadControlTypes(currentTeamId).then(function () {
                return ApiService.loadAllControls(currentTeamId);
            }).then(function () {
                $timeout(function () {
                    ctrl.store = ApiService.data;
                }, 100);
            });

            // Listen for section changes (when navigating to this page)
            var sectionListener = $rootScope.$on('controlsSectionChanged', function(event, section) {
                if (section === 'controlTypesManagement') {
                    var teamId = AuthService.getTeamId();
                    console.log('Navigated to control types management section, reloading for team:', teamId);
                    
                    // Reload data for current team
                    ApiService.loadControlTypes(teamId).then(function () {
                        return ApiService.loadAllControls(teamId);
                    }).then(function () {
                        $timeout(function () {
                            ctrl.store = ApiService.data;
                        }, 100);
                    });
                }
            });
            
            // Listen for updates
            var listener = $rootScope.$on('controlTypesUpdated', function () {
                var teamId = AuthService.getTeamId();
                ApiService.loadControlTypes(teamId).then(function () {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            // Listen for team changes
            var teamListener = $rootScope.$on('teamChanged', function(event, data) {
                console.log('Team changed in control types, reloading for team:', data.teamId);
                ApiService.loadControlTypes(data.teamId).then(function () {
                    return ApiService.loadAllControls(data.teamId);
                }).then(function () {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                });
            });

            ctrl.$onDestroy = function () {
                if (sectionListener) sectionListener();
                if (listener) listener();
                if (teamListener) teamListener();
            };
        };

        ctrl.getControlsCount = function (typeId) {
            if (!ctrl.store.allControls) return 0;
            return ctrl.store.allControls.filter(function (c) {
                return c.typeId === typeId;
            }).length;
        };

        ctrl.addControlType = function () {
            if (!ctrl.newType.typeName || !ctrl.newType.description) {
                NotificationService.show('Type name and description are required', 'error');
                return;
            }

            ctrl.isAdding = true;

            var payload = {
                typeName: ctrl.newType.typeName.trim(),
                description: ctrl.newType.description.trim()
            };

            ApiService.addControlType(payload).then(function (createdType) {
                NotificationService.show('Control type added successfully!', 'success');
                ctrl.cancelAddType();
                return ApiService.loadControlTypes();
            }).then(function () {
                $timeout(function () {
                    ctrl.store = ApiService.data;
                }, 100);
                $rootScope.$broadcast('controlTypesUpdated');
            }).catch(function (error) {
                console.error('Error adding control type:', error);
                var errorMsg = 'Error adding control type';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || errorMsg);
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isAdding = false;
            });
        };

        ctrl.cancelAddType = function () {
            ctrl.showAddForm = false;
            ctrl.newType = {
                typeName: '',
                description: ''
            };
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
                description: type.editDescription.trim()
            };

            ApiService.updateControlType(type.controlTypeId, payload).then(function (updatedType) {
                type.typeName = updatedType.typeName;
                type.description = updatedType.description;
                type.editing = false;
                type.saving = false;

                delete type.editTypeName;
                delete type.editDescription;

                NotificationService.show('Control type updated successfully!', 'success');
                $rootScope.$broadcast('controlTypesUpdated');
            }).catch(function (error) {
                console.error('Error updating control type:', error);
                var errorMsg = 'Error updating control type';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || errorMsg);
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                type.saving = false;
            });
        };

        ctrl.deleteControlType = function (type) {
            var controlsCount = ctrl.getControlsCount(type.controlTypeId);
            
            var confirmMessage = 'Are you sure you want to delete this control type?';
            if (controlsCount > 0) {
                confirmMessage += '\n\nWarning: This type is used by ' + controlsCount + ' control(s). Deleting it may affect those controls.';
            }

            if (confirm(confirmMessage)) {
                type.deleting = true;

                ApiService.deleteControlType(type.controlTypeId).then(function () {
                    NotificationService.show('Control type deleted successfully!', 'success');
                    return ApiService.loadControlTypes();
                }).then(function () {
                    return ApiService.loadAllControls(); // Reload controls to update counts
                }).then(function () {
                    $timeout(function () {
                        ctrl.store = ApiService.data;
                    }, 100);
                    $rootScope.$broadcast('controlTypesUpdated');
                }).catch(function (error) {
                    console.error('Error deleting control type:', error);
                    var errorMsg = 'Error deleting control type';
                    if (error && error.data) {
                        errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || errorMsg);
                    }
                    NotificationService.show(errorMsg, 'error');
                }).finally(function () {
                    type.deleting = false;
                });
            }
        };
    }
});