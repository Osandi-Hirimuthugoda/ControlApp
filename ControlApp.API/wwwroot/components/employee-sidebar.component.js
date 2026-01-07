app.component('employeeSidebar', {
    template: `
    <div style="height: 80vh; display: flex; flex-direction: column;">

        <!-- New Registration Button (Main Action) -->
        <div class="mb-3">
            <button class="btn btn-primary w-100 shadow-sm d-flex align-items-center justify-content-center py-2" 
                    style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); border: none; border-radius: 8px;"
                    data-bs-toggle="modal" data-bs-target="#registrationModal">
                <i class="fas fa-user-plus me-2"></i> Register New Employee
            </button>
        </div>
    
        <!-- Add Employee Card -->
        <div class="card shadow-sm mb-3" style="flex-shrink: 0;">
            <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem;">
                <h6 class="mb-0 fw-bold"><i class="fas fa-user-plus me-2"></i>New Employee</h6>
            </div>
            <div class="card-body">
                <form ng-submit="$ctrl.addEmployee($event)">
                    <div class="mb-2">
                        <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newEmployee.employeeName" placeholder="Name" required>
                    </div>
                    <div class="mb-2">
                        <!-- Description Selection -->
                        <label class="form-label" style="font-size: 0.85rem; margin-bottom: 0.25rem; color: var(--text-secondary);">Select Description</label>
                        <select class="form-select form-select-sm" 
                                ng-model="$ctrl.selectedType" 
                                ng-options="type as (type.description || 'No Description') for type in $ctrl.getUniqueDescriptions()"
                                ng-change="$ctrl.onDescriptionChange()"
                                required>
                            <option value="">-- Select Description --</option>
                        </select>
                    </div>
                    <div class="mb-2">
                        <!-- Type Display (Auto-filled from Description) -->
                        <div class="input-group">
                            <span class="input-group-text bg-light" style="font-size: 0.85rem;">Type:</span>
                            <input type="text" 
                                   class="form-control form-control-sm" 
                                   ng-model="$ctrl.selectedTypeName" 
                                   readonly 
                                   style="background-color: #f8f9fa; cursor: not-allowed;"
                                   placeholder="Type will be auto-selected">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary w-100" ng-disabled="$ctrl.isSaving || !$ctrl.newEmployee.typeId">Add</button>
                </form>
            </div>
        </div>

        <!-- Employee List Card -->
        <div class="card shadow-sm" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem; flex-shrink: 0;">
                <h6 class="mb-0 fw-bold"><i class="fas fa-users me-2"></i>Employees</h6>
            </div>
            <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div class="p-2" style="flex-shrink: 0;"><input type="text" class="form-control form-control-sm" ng-model="$ctrl.searchEmployee" placeholder="Search..."></div>
                <div style="flex: 1; overflow-y: auto; min-height: 0;">
                    <table class="table table-hover table-sm mb-0" style="font-size:0.9rem;">
                        <tbody>
                            <tr ng-repeat="emp in $ctrl.store.employees | filter:$ctrl.searchEmployee">
                                <!-- View Mode -->
                                <td ng-if="!emp.editing">
                                    {{emp.employeeName}} <br>
                                    <!-- Show Type Name -->
                                    <small class="text-muted" style="font-size:0.7em">
                                        {{ $ctrl.getTypeName(emp.typeId) }}
                                    </small>
                                </td>
                                
                                <!-- Edit Mode -->
                                <td ng-if="emp.editing">
                                    <input class="form-control form-control-sm mb-1" ng-model="emp.editName">
                                    <select class="form-select form-select-sm mb-1" 
                                            ng-model="emp.editSelectedType" 
                                            ng-options="type as (type.description || 'No Description') for type in $ctrl.getUniqueDescriptions()"
                                            ng-change="$ctrl.onEditDescriptionChange(emp)">
                                        <option value="">-- Select Description --</option>
                                    </select>
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text bg-light" style="font-size: 0.75rem;">Type:</span>
                                        <input type="text" 
                                               class="form-control form-control-sm" 
                                               ng-model="emp.editTypeName" 
                                               readonly 
                                               style="background-color: #f8f9fa; font-size: 0.85rem;">
                                    </div>
                                </td>

                                <!-- Actions -->
                                <td class="text-end" style="width:70px;">
                                    <i ng-if="!emp.editing" class="fas fa-pencil-alt text-warning me-2" style="cursor:pointer" ng-click="$ctrl.startEdit(emp)"></i>
                                    <i ng-if="!emp.editing" class="fas fa-trash text-danger" style="cursor:pointer" ng-click="$ctrl.deleteEmployee(emp)"></i>
                                    <i ng-if="emp.editing" class="fas fa-check text-success me-2" style="cursor:pointer" ng-click="$ctrl.saveEmployee(emp)"></i>
                                    <i ng-if="emp.editing" class="fas fa-times text-secondary" style="cursor:pointer" ng-click="$ctrl.cancelEdit(emp)"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, $q, $rootScope, $scope) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.newEmployee = { employeeName: '', typeId: null };
        ctrl.selectedType = null;
        ctrl.selectedDescription = null;
        ctrl.selectedTypeName = '';
        ctrl.isSaving = false;
        
        // Listen for control types updates
        ctrl.$onInit = function() {
            var listener = $rootScope.$on('controlTypesUpdated', function() {
                console.log('Control types updated event received in employee-sidebar');
                // Reload control types to get the latest list
                ApiService.loadControlTypes().then(function(types) {
                    console.log('Control types reloaded in employee-sidebar, count:', types.length);
                    // Update store reference
                    ctrl.store = ApiService.data;
                    // Clear selected type to force refresh
                    ctrl.selectedType = null;
                });
            });
            
            ctrl.$onDestroy = function() {
                if(listener) {
                    listener();
                }
            };
        };

        ctrl.getTypeName = function(id) {
            var t = ctrl.store.controlTypes.find(x => x.controlTypeId == id);
            return t ? t.typeName : '';
        };

        
        ctrl.getUniqueDescriptions = function() {
            if (!ctrl.store.controlTypes || ctrl.store.controlTypes.length === 0) {
                return [];
            }
            
            
            var descriptionMap = {};
            ctrl.store.controlTypes.forEach(function(type) {
                if (type.description && type.description.trim() !== '') {
                    // Use description as key, store the first type with this description
                    if (!descriptionMap[type.description]) {
                        descriptionMap[type.description] = type;
                    }
                }
            });
            
            // Return array of unique types with descriptions
            return Object.keys(descriptionMap).map(function(desc) {
                return descriptionMap[desc];
            }).sort(function(a, b) {
                return (a.description || '').localeCompare(b.description || '');
            });
        };

        // When description is selected, automatically set the type
        ctrl.onDescriptionChange = function() {
            if (!ctrl.selectedType) {
                ctrl.newEmployee.typeId = null;
                ctrl.selectedDescription = null;
                ctrl.selectedTypeName = '';
                return;
            }

            // Set the type from selected description
            ctrl.newEmployee.typeId = ctrl.selectedType.controlTypeId;
            ctrl.selectedDescription = ctrl.selectedType.description;
            ctrl.selectedTypeName = ctrl.selectedType.typeName;
        };

        ctrl.addEmployee = function(event) {
            if(event) event.preventDefault();
            if (!ctrl.newEmployee.typeId) {
                NotificationService.show('Please select a description first', 'error');
                return;
            }
            ctrl.isSaving = true;
            ApiService.addEmployee({
                employeeName: ctrl.newEmployee.employeeName,
                typeId: ctrl.newEmployee.typeId,
                description: ctrl.selectedDescription || "New Employee"
            }).then(function() {
                NotificationService.show('Employee Added Successfully!', 'success');
                ctrl.newEmployee = { employeeName: '', typeId: null };
                ctrl.selectedType = null;
                ctrl.selectedDescription = null;
                ctrl.selectedTypeName = '';
            }).finally(function() { ctrl.isSaving = false; });
        };

        ctrl.deleteEmployee = function(emp) {
            var controlsCount = ctrl.store.allControls.filter(c => c.employeeId == emp.id).length;
            if(!confirm('Delete ' + emp.employeeName + '?')) return;

            // Delete controls first, then employee
            var promises = ctrl.store.allControls.filter(c => c.employeeId == emp.id)
                .map(c => ApiService.deleteControl(c.controlId));

            $q.all(promises).then(function() {
                return ApiService.deleteEmployee(emp.id);
            }).then(function() {
                NotificationService.show('Employee Deleted!', 'success');
            });
        };

        ctrl.startEdit = function(e) { 
            e.editing = true; 
            e.editName = e.employeeName; 
            e.editTypeId = e.typeId;
            
            // Find the type with current typeId and set selected description
            if (e.typeId) {
                var currentType = ctrl.store.controlTypes.find(function(t) {
                    return t.controlTypeId == e.typeId;
                });
                if (currentType && currentType.description) {
                    e.editSelectedType = ctrl.getUniqueDescriptions().find(function(t) {
                        return t.description === currentType.description;
                    });
                    e.editTypeName = currentType.typeName;
                } else {
                    e.editSelectedType = null;
                    e.editTypeName = '';
                }
            } else {
                e.editSelectedType = null;
                e.editTypeName = '';
            }
        };
        
        ctrl.cancelEdit = function(e) { 
            e.editing = false;
            e.editSelectedType = null;
            e.editTypeName = '';
        };
        
        ctrl.onEditDescriptionChange = function(e) {
            if (!e.editSelectedType) {
                e.editTypeId = null;
                e.editTypeName = '';
                return;
            }
            e.editTypeId = e.editSelectedType.controlTypeId;
            e.editTypeName = e.editSelectedType.typeName;
        };
        
        ctrl.saveEmployee = function(e) {
            if (!e.editTypeId) {
                NotificationService.show('Please select a description first', 'error');
                return;
            }
            ApiService.updateEmployee(e.id, { 
                employeeName: e.editName, 
                typeId: e.editTypeId,
                description: e.editSelectedType ? e.editSelectedType.description : null
            }).then(function(r) {
                e.employeeName = r.data.employeeName;
                e.typeId = r.data.typeId;
                e.editing = false;
                e.editSelectedType = null;
                e.editTypeName = '';
                NotificationService.show('Employee Updated', 'success');
            });
        };
    }
});