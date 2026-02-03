app.component('controlTypeSidebar', {
    template: `
    <div style="display: flex; flex-direction: column; gap: 15px;">
        <!-- Add Control Type Card -->
        <div class="card shadow-sm" style="flex-shrink: 0;">
            <div class="card-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 1.25rem 1.5rem;">
                <h6 class="mb-0 fw-bold"><i class="fas fa-tag me-2"></i>New Control Type</h6>
            </div>
            <div class="card-body">
                <form ng-submit="$ctrl.addControlType($event)">
                    <div class="mb-2">
                        <label class="form-label small fw-bold">Controller Type Name:</label>
                        <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newControlType.typeName" placeholder="e.g., L3, CR" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label small fw-bold">Description: <span class="text-danger">*</span></label>
                        <textarea class="form-control form-control-sm" ng-model="$ctrl.newControlType.description" placeholder="Enter description..." rows="2" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-sm btn-info w-100" ng-disabled="$ctrl.isSaving">
                        <span ng-if="!$ctrl.isSaving"><i class="fas fa-plus"></i> Add Type</span>
                        <span ng-if="$ctrl.isSaving"><i class="fas fa-spinner fa-spin"></i> Adding...</span>
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Control Types List Card -->
        <div class="card shadow-sm" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem; flex-shrink: 0;">
                <h6 class="mb-0 fw-bold"><i class="fas fa-list me-2"></i>Control Types</h6>
            </div>
            <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div class="p-2" style="flex-shrink: 0;">
                    <input type="text" class="form-control form-control-sm" ng-model="$ctrl.searchType" placeholder="Search types...">
                </div>
                <div style="flex: 1; overflow-y: auto; min-height: 0;">
                    <table class="table table-hover table-sm mb-0" style="font-size:0.9rem;">
                        <tbody>
                            <tr ng-if="($ctrl.store.controlTypes | filter:$ctrl.searchType).length === 0">
                                <td colspan="2" class="text-center text-muted py-3" style="font-size:0.85em;">
                                    <i class="fas fa-inbox"></i> No control types found
                                </td>
                            </tr>
                            <tr ng-repeat="type in $ctrl.store.controlTypes | filter:$ctrl.searchType track by type.controlTypeId">
                                <td>
                                    <strong>{{type.typeName}}</strong>
                                    <br>
                                    <small class="text-muted" style="font-size:0.7em" ng-if="type.description">{{type.description}}</small>

                                </td>
                                <td class="text-end" style="width:50px;">
                                    <i class="fas fa-trash text-danger" style="cursor:pointer" ng-click="$ctrl.deleteControlType(type)" title="Delete"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, NotificationService, $rootScope, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.newControlType = { typeName: '', description: '' };
        ctrl.assignedEmployeeId = null;
        ctrl.isSaving = false;
        ctrl.searchType = '';
        var listener = null;

        // Initial load of control types
        ApiService.loadControlTypes().then(function () {
            console.log('Control types loaded in sidebar component');
        });

        // Listen for control types updates
        ctrl.$onInit = function () {
            // Listen for updates from other components
            listener = $rootScope.$on('controlTypesUpdated', function () {
                console.log('Control types updated event received in sidebar');
                ApiService.loadControlTypes().then(function (types) {
                    console.log('Control types reloaded in sidebar, count:', types.length);
                    console.log('Control types:', types);
                    // Use $timeout to ensure digest cycle runs
                    $timeout(function () {
                        // Force view update by reassigning the store reference
                        ctrl.store = ApiService.data;
                        // Angular will automatically detect the change
                    }, 100);
                });
            });
        };

        ctrl.$onDestroy = function () {
            if (listener) {
                listener();
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



        ctrl.addControlType = function (event) {
            if (event) event.preventDefault();

            console.log('Add control type called', ctrl.newControlType);

            if (!ctrl.newControlType.typeName || ctrl.newControlType.typeName.trim() === '') {
                NotificationService.show('Type Name is required', 'error');
                return;
            }

            if (!ctrl.newControlType.description || ctrl.newControlType.description.trim() === '') {
                NotificationService.show('Description is required', 'error');
                return;
            }

            // Check for duplicate type name AND description combination
            var trimmedName = ctrl.newControlType.typeName.trim();
            var trimmedDescription = ctrl.newControlType.description.trim();
            var duplicateType = ctrl.store.controlTypes.find(function (t) {
                var existingName = t.typeName ? t.typeName.trim().toLowerCase() : '';
                var existingDesc = t.description ? t.description.trim().toLowerCase() : '';
                return existingName === trimmedName.toLowerCase() && existingDesc === trimmedDescription.toLowerCase();
            });

            if (duplicateType) {
                NotificationService.show('A control type with the name "' + trimmedName + '" and description "' + trimmedDescription + '" already exists. Please use a different description.', 'error');
                return;
            }

            ctrl.isSaving = true;

            var payload = {
                typeName: ctrl.newControlType.typeName.trim(),
                description: ctrl.newControlType.description.trim(),
                releaseDate: null
            };

            console.log('Sending payload:', payload);

            ApiService.addControlType(payload).then(function (addedType) {
                console.log('Control type added successfully:', addedType);

                // Reset form immediately
                ctrl.newControlType = { typeName: '', description: '' };

                // Force reload of control types and trigger Angular digest
                ApiService.loadControlTypes().then(function (types) {
                    console.log('Control types reloaded after add, count:', types.length);
                    console.log('Control types:', types);

                    // Use $timeout to ensure digest cycle runs after promise resolves
                    $timeout(function () {
                        // Reassign store reference to ensure Angular detects the change
                        ctrl.store = ApiService.data;

                        // Show success message
                        NotificationService.show('Control Type "' + payload.typeName + '" Added Successfully!', 'success');

                        // Broadcast event to notify other components (including self)
                        $rootScope.$broadcast('controlTypesUpdated');
                    }, 100);
                }).catch(function (reloadError) {
                    console.error('Error reloading control types:', reloadError);
                    NotificationService.show('Control Type Added but failed to refresh list. Please refresh the page.', 'error');
                });
            }).catch(function (error) {
                console.error('Error adding control type:', error);
                var errorMsg = 'Error adding control type';

                // Handle different error response formats
                if (error && error.data) {
                    if (typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if (error.data.message) {
                        errorMsg = error.data.message;
                    } else if (error.data.title) {
                        errorMsg = error.data.title;
                    } else if (Array.isArray(error.data) && error.data.length > 0) {
                        errorMsg = error.data[0];
                    }
                } else if (error && error.statusText) {
                    errorMsg = 'Error: ' + error.statusText;
                } else if (error && error.message) {
                    errorMsg = error.message;
                }

                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isSaving = false;
            });
        };

        ctrl.deleteControlType = function (type) {
            if (!confirm('Delete Control Type "' + type.typeName + '"?\n\nThis will reassign all employees and controls using this type to another type.')) {
                return;
            }

            ApiService.deleteControlType(type.controlTypeId).then(function () {
                // Reload control types to get the updated list
                ApiService.loadControlTypes().then(function (types) {
                    console.log('Control types reloaded after delete, count:', types.length);
                    // Reassign store reference to ensure Angular detects the change
                    ctrl.store = ApiService.data;

                    // Reload controls to update type names
                    ApiService.loadAllControls();

                    // Trigger digest cycle to update the view safely
                    try {
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$apply();
                        }
                    } catch (e) {
                        console.error('Error in $apply:', e);
                    }

                    NotificationService.show('Control Type Deleted Successfully!', 'success');
                });
            }).catch(function (error) {
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
    }
});
