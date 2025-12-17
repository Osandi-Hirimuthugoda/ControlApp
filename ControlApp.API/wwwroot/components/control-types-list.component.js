app.component('controlTypesList', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem; flex-shrink: 0;">
            <h5 class="mb-0 fw-bold"><i class="fas fa-tags me-2"></i>Control Types</h5>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="p-3" style="flex-shrink: 0;">
                <input type="text" class="form-control" ng-model="$ctrl.searchType" placeholder="Search types...">
            </div>
            <div style="flex: 1; overflow-y: auto; min-height: 0;">
                <table class="table table-hover mb-0">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th>Type Name</th>
                            <th>Description</th>
                            <th>Release Date</th>
                            <th class="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="type in $ctrl.store.controlTypes | filter:$ctrl.searchType track by type.controlTypeId">
                            <td>
                                <strong ng-if="!type.editing">{{type.typeName}}</strong>
                                <input ng-if="type.editing" type="text" class="form-control form-control-sm" ng-model="type.editTypeName" required>
                            </td>
                            <td>
                                <span ng-if="!type.editing">{{type.description || '-'}}</span>
                                <textarea ng-if="type.editing" class="form-control form-control-sm" ng-model="type.editDescription" rows="2" required></textarea>
                            </td>
                            <td>
                                <span ng-if="!type.editing && type.releaseDate">
                                    <i class="fas fa-calendar-alt me-1"></i>{{$ctrl.formatDate(type.releaseDate)}}
                                </span>
                                <span ng-if="!type.editing && !type.releaseDate">-</span>
                                <div ng-if="type.editing">
                                    <select class="form-select form-select-sm mb-2" 
                                            ng-model="type.editReleaseId" 
                                            ng-options="r.releaseId as $ctrl.formatReleaseName(r) for r in $ctrl.store.upcomingReleases"
                                            ng-change="$ctrl.onReleaseChange(type)">
                                        <option value="">-- Select Release --</option>
                                    </select>
                                    <input type="date" class="form-control form-control-sm" ng-model="type.editReleaseDate">
                                </div>
                            </td>
                            <td class="text-end">
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
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, $rootScope, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchType = '';
        var listener = null;

        
        ApiService.loadControlTypes().then(function() {
            console.log('Control types loaded in list component');
        });

        
        ctrl.$onInit = function() {
            listener = $rootScope.$on('controlTypesUpdated', function() {
                console.log('Control types updated event received in list component');
                
                ApiService.loadControlTypes().then(function(types) {
                    console.log('Control types reloaded in list component, count:', types.length);
                    console.log('Control types:', types);
                    
                    $timeout(function() {
                        
                        ctrl.store = ApiService.data;
                        
                    }, 100);
                });
            });
        };
        
        ctrl.$onDestroy = function() {
            if(listener) {
                listener();
            }
        };

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            // Format: DD.MM (Day.Month) - e.g., 26.01, 25.12
            var day = ('0' + d.getDate()).slice(-2);
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            return day + '.' + month;
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
                    try {
                        var releaseDate = new Date(selectedRelease.releaseDate);
                        if(!isNaN(releaseDate.getTime())) {
                            type.editReleaseDate = releaseDate.toISOString().split('T')[0];
                        } else {
                            type.editReleaseDate = null;
                        }
                    } catch(e) {
                        type.editReleaseDate = null;
                    }
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
            
            // Safely convert release date to date input format (YYYY-MM-DD)
            if(type.releaseDate) {
                try {
                    var releaseDate = new Date(type.releaseDate);
                    if(!isNaN(releaseDate.getTime())) {
                        type.editReleaseDate = releaseDate.toISOString().split('T')[0];
                    } else {
                        type.editReleaseDate = null;
                    }
                } catch(e) {
                    type.editReleaseDate = null;
                }
            } else {
                type.editReleaseDate = null;
            }
            
            // Find matching release based on releaseDate
            type.editReleaseId = null;
            if(type.releaseDate) {
                try {
                    var releaseDate = new Date(type.releaseDate);
                    if(!isNaN(releaseDate.getTime())) {
                        var matchingRelease = ctrl.store.upcomingReleases.find(function(r) {
                            if(!r.releaseDate) return false;
                            var rDate = new Date(r.releaseDate);
                            return !isNaN(rDate.getTime()) && rDate.getTime() === releaseDate.getTime();
                        });
                        if(matchingRelease) {
                            type.editReleaseId = matchingRelease.releaseId;
                        }
                    }
                } catch(e) {
                    // Ignore errors in date matching
                }
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
            
            // Safely convert release date to ISO string
            var releaseDateValue = null;
            if(type.editReleaseDate && type.editReleaseDate.trim() !== '') {
                try {
                    // Parse the date string (YYYY-MM-DD format from date input)
                    var dateStr = type.editReleaseDate.trim();
                    var dateObj = new Date(dateStr + 'T00:00:00');
                    if(!isNaN(dateObj.getTime())) {
                        releaseDateValue = dateObj.toISOString();
                    }
                } catch(e) {
                    console.error('Error parsing release date:', e);
                    releaseDateValue = null;
                }
            }
            
            var payload = {
                typeName: type.editTypeName.trim(),
                description: type.editDescription.trim(),
                releaseDate: releaseDateValue
            };

            ApiService.updateControlType(type.controlTypeId, payload).then(function(updatedType) {
                // Update local view
                type.typeName = updatedType.typeName;
                type.description = updatedType.description;
                
                // Safely handle release date update
                if(updatedType.releaseDate) {
                    try {
                        var dateObj = new Date(updatedType.releaseDate);
                        if(!isNaN(dateObj.getTime())) {
                            type.releaseDate = dateObj;
                        } else {
                            type.releaseDate = null;
                        }
                    } catch(e) {
                        type.releaseDate = null;
                    }
                } else {
                    type.releaseDate = null;
                }
                
                type.editing = false;
                type.saving = false;
                
                // Clean up edit fields
                delete type.editTypeName;
                delete type.editDescription;
                delete type.editReleaseDate;
                delete type.editReleaseId;

                NotificationService.show('Control Type Updated Successfully!', 'success');
                
                // Broadcast event to update dashboard and other components
                $rootScope.$broadcast('controlTypesUpdated');
            }).catch(function(error) {
                type.saving = false;
                console.error('Error updating control type:', error);
                var errorMsg = 'Error updating control type';
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

        ctrl.deleteControlType = function(type) {
            if(!confirm('Delete Control Type "' + type.typeName + '"?\n\nThis will reassign all employees and controls using this type to another type.')) {
                return;
            }

            type.deleting = true;
            ApiService.deleteControlType(type.controlTypeId).then(function() {
                // Reload control types to get the updated list
                ApiService.loadControlTypes().then(function(types) {
                    console.log('Control types reloaded after delete, count:', types.length);
                    // Use $timeout to ensure digest cycle runs
                    $timeout(function() {
                        // Force view update by reassigning the store reference
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
