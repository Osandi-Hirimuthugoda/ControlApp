app.component('controlTypeSidebar', {
    template: `
    <div style="display: flex; flex-direction: column; gap: 15px;">
        <!-- Add Control Type Card -->
        <div class="card shadow-sm" style="flex-shrink: 0;">
            <div class="card-header bg-info text-white py-3">
                <h6 class="mb-0 fw-bold"><i class="fas fa-tag me-2"></i>New Control Type</h6>
            </div>
            <div class="card-body">
                <form ng-submit="$ctrl.addControlType($event)">
                    <div class="mb-2">
                        <label class="form-label small fw-bold">Controller Type Name:</label>
                        <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newControlType.typeName" placeholder="e.g., L3, CR" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label small fw-bold">Description:</label>
                        <textarea class="form-control form-control-sm" ng-model="$ctrl.newControlType.description" placeholder="Enter description..." rows="2"></textarea>
                    </div>
                    <div class="mb-2">
                        <label class="form-label small fw-bold">Release Date:</label>
                        <input type="date" class="form-control form-control-sm" ng-model="$ctrl.newControlType.releaseDate">
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
            <div class="card-header bg-secondary text-white py-3" style="flex-shrink: 0;">
                <h6 class="mb-0 fw-bold"><i class="fas fa-list me-2"></i>Control Types</h6>
            </div>
            <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div class="p-2" style="flex-shrink: 0;">
                    <input type="text" class="form-control form-control-sm" ng-model="$ctrl.searchType" placeholder="Search types...">
                </div>
                <div style="flex: 1; overflow-y: auto; min-height: 0;">
                    <table class="table table-hover table-sm mb-0" style="font-size:0.9rem;">
                        <tbody>
                            <tr ng-repeat="type in $ctrl.store.controlTypes | filter:$ctrl.searchType">
                                <td>
                                    <strong>{{type.typeName}}</strong>
                                    <br>
                                    <small class="text-muted" style="font-size:0.7em" ng-if="type.description">{{type.description}}</small>
                                    <small class="text-muted" style="font-size:0.7em" ng-if="type.releaseDate">
                                        <i class="fas fa-calendar-alt"></i> {{$ctrl.formatDate(type.releaseDate)}}
                                    </small>
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
    controller: function(ApiService, NotificationService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.newControlType = { typeName: '', description: '', releaseDate: null };
        ctrl.isSaving = false;
        ctrl.searchType = '';

        ctrl.formatDate = function(date) {
            if(!date) return '';
            var d = new Date(date);
            if(isNaN(d)) return '';
            return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
        };

        ctrl.addControlType = function(event) {
            if(event) event.preventDefault();
            
            if(!ctrl.newControlType.typeName || ctrl.newControlType.typeName.trim() === '') {
                NotificationService.show('Type Name is required', 'error');
                return;
            }

            ctrl.isSaving = true;
            var releaseDate = null;
            if(ctrl.newControlType.releaseDate) {
                releaseDate = new Date(ctrl.newControlType.releaseDate).toISOString();
            }
            
            ApiService.addControlType({
                typeName: ctrl.newControlType.typeName.trim(),
                description: ctrl.newControlType.description ? ctrl.newControlType.description.trim() : null,
                releaseDate: releaseDate
            }).then(function(addedType) {
                NotificationService.show('Control Type Added Successfully!', 'success');
                ctrl.newControlType = { typeName: '', description: '', releaseDate: null };
            }).catch(function(error) {
                console.error('Error adding control type:', error);
                var errorMsg = 'Error adding control type';
                if(error && error.data && error.data.message) {
                    errorMsg = error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() { 
                ctrl.isSaving = false; 
            });
        };

        ctrl.deleteControlType = function(type) {
            if(!confirm('Delete Control Type "' + type.typeName + '"?\n\nThis will reassign all employees and controls using this type to another type.')) {
                return;
            }

            ApiService.deleteControlType(type.controlTypeId).then(function() {
                // Remove from local store
                var index = ctrl.store.controlTypes.findIndex(t => t.controlTypeId === type.controlTypeId);
                if(index > -1) {
                    ctrl.store.controlTypes.splice(index, 1);
                }
                
                // Reload controls to update type names
                ApiService.loadAllControls();
                
                NotificationService.show('Control Type Deleted Successfully!', 'success');
            }).catch(function(error) {
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

