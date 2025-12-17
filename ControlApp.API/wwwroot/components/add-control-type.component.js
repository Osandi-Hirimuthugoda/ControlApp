app.component('addControlType', {
    template: `
    <div class="card shadow-sm">
        <div class="card-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 1.25rem 1.5rem;">
            <h5 class="mb-0 fw-bold"><i class="fas fa-plus-circle me-2"></i>Add Control Type</h5>
        </div>
        <div class="card-body">
            <form name="addTypeForm" ng-submit="$ctrl.addControlType($event)" novalidate>
                <div class="mb-3">
                    <label class="form-label fw-bold">Controller Type Name: <span class="text-danger">*</span></label>
                    <input type="text" 
                           class="form-control" 
                           name="typeName"
                           ng-model="$ctrl.newControlType.typeName" 
                           placeholder="e.g., L3, CR" 
                           required
                           ng-class="{'is-invalid': addTypeForm.typeName.$invalid && addTypeForm.typeName.$touched}">
                    <div class="invalid-feedback" ng-if="addTypeForm.typeName.$invalid && addTypeForm.typeName.$touched">
                        Type Name is required
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Description: <span class="text-danger">*</span></label>
                    <textarea class="form-control" 
                              name="description"
                              ng-model="$ctrl.newControlType.description" 
                              placeholder="Enter description..." 
                              rows="3"
                              required
                              ng-class="{'is-invalid': addTypeForm.description.$invalid && addTypeForm.description.$touched}"></textarea>
                    <div class="invalid-feedback" ng-if="addTypeForm.description.$invalid && addTypeForm.description.$touched">
                        Description is required
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Release:</label>
                    <select class="form-select" 
                            ng-model="$ctrl.selectedReleaseId" 
                            ng-options="r.releaseId as $ctrl.formatReleaseName(r) for r in $ctrl.store.upcomingReleases"
                            ng-change="$ctrl.onReleaseChange()">
                        <option value="">-- Select Release --</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Release Date:</label>
                    <input type="date" class="form-control" ng-model="$ctrl.newControlType.releaseDate">
                </div>
                <button type="submit" 
                        class="btn btn-info w-100" 
                        ng-disabled="$ctrl.isSaving || addTypeForm.$invalid">
                    <span ng-if="!$ctrl.isSaving"><i class="fas fa-plus me-2"></i>Add Type</span>
                    <span ng-if="$ctrl.isSaving"><i class="fas fa-spinner fa-spin me-2"></i>Adding...</span>
                </button>
            </form>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, $rootScope, $scope) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.newControlType = { typeName: '', description: '', releaseDate: null };
        ctrl.selectedReleaseId = null;
        ctrl.isSaving = false;

        ctrl.formatReleaseName = function(release) {
            if(!release) return '';
            if(release.releaseName) return release.releaseName;
            var date = new Date(release.releaseDate);
            var day = ('0' + date.getDate()).slice(-2);
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            return 'Release ' + day + '.' + month;
        };

        ctrl.onReleaseChange = function() {
            if(ctrl.selectedReleaseId) {
                var selectedRelease = ctrl.store.upcomingReleases.find(function(r) {
                    return r.releaseId === ctrl.selectedReleaseId;
                });
                if(selectedRelease && selectedRelease.releaseDate) {
                    var releaseDate = new Date(selectedRelease.releaseDate);
                    ctrl.newControlType.releaseDate = releaseDate.toISOString().split('T')[0];
                }
            } else {
                ctrl.newControlType.releaseDate = null;
            }
        };

        ctrl.addControlType = function(event) {
            if(event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            console.log('Add control type called', ctrl.newControlType);
            
            // Validate 
            if(!ctrl.newControlType || !ctrl.newControlType.typeName || ctrl.newControlType.typeName.trim() === '') {
                NotificationService.show('Type Name is required', 'error');
                return;
            }

            if(!ctrl.newControlType.description || ctrl.newControlType.description.trim() === '') {
                NotificationService.show('Description is required', 'error');
                return;
            }

            
            var trimmedName = ctrl.newControlType.typeName.trim().toLowerCase();
            var trimmedDescription = ctrl.newControlType.description.trim().toLowerCase();
            
            var duplicateType = ctrl.store.controlTypes.find(function(t) {
                var existingName = t.typeName ? t.typeName.trim().toLowerCase() : '';
                var existingDescription = t.description ? t.description.trim().toLowerCase() : '';
                return existingName === trimmedName && existingDescription === trimmedDescription;
            });
            
            if(duplicateType) {
                NotificationService.show('A control type with the name "' + ctrl.newControlType.typeName.trim() + '" and description "' + ctrl.newControlType.description.trim() + '" already exists. Please use a different description.', 'error');
                return; 
            }

            ctrl.isSaving = true;
            
            
            var releaseDate = null;
            if(ctrl.newControlType.releaseDate) {
                if(typeof ctrl.newControlType.releaseDate === 'string') {
                    
                    releaseDate = new Date(ctrl.newControlType.releaseDate + 'T00:00:00').toISOString();
                } else if(ctrl.newControlType.releaseDate instanceof Date) {
                    
                    releaseDate = ctrl.newControlType.releaseDate.toISOString();
                } else {
                    releaseDate = new Date(ctrl.newControlType.releaseDate).toISOString();
                }
            }
            
            var payload = {
                typeName: ctrl.newControlType.typeName.trim(),
                description: ctrl.newControlType.description.trim(),
                releaseDate: releaseDate
            };
            
            console.log('Sending payload:', payload);
            
            ApiService.addControlType(payload).then(function(addedType) {
                console.log('Control type added successfully:', addedType);
                NotificationService.show('Control Type "' + payload.typeName + '" Added Successfully!', 'success');
                
                
                ctrl.newControlType = { typeName: '', description: '', releaseDate: null };
                ctrl.selectedReleaseId = null;
                
                
                if($scope.addTypeForm) {
                    $scope.addTypeForm.$setPristine();
                    $scope.addTypeForm.$setUntouched();
                }
                
                
                ApiService.loadControlTypes().then(function(types) {
                    console.log('Control types reloaded after add, count:', types.length);
                    
                    if(!$scope.$$phase && !$rootScope.$$phase) {
                        $scope.$apply();
                    }
                    
                    
                    $rootScope.$broadcast('controlTypesUpdated');
                });
                
            }).catch(function(error) {
                console.error('Error adding control type:', error);
                var errorMsg = 'Error adding control type';
                
                
                if(error && error.data) {
                    if(typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if(error.data.message) {
                        errorMsg = error.data.message;
                    } else if(error.data.title) {
                        errorMsg = error.data.title;
                    } else if(Array.isArray(error.data) && error.data.length > 0) {
                        errorMsg = error.data[0];
                    }
                } else if(error && error.statusText) {
                    errorMsg = 'Error: ' + error.statusText;
                } else if(error && error.message) {
                    errorMsg = error.message;
                }
                
                NotificationService.show(errorMsg, 'error');
            }).finally(function() { 
                ctrl.isSaving = false; 
            });
        };
    }
});