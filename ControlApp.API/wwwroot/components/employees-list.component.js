app.component('employeesList', {
    template: `
    <div class="card shadow-sm" style="height: 80vh; display: flex; flex-direction: column;">
        <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem;">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold"><i class="fas fa-users me-2"></i>Employees List</h5>
                <div class="input-group" style="width: 300px;">
                    <input type="text" class="form-control form-control-sm" ng-model="$ctrl.searchText" placeholder="Search employees...">
                    <button class="btn btn-outline-light btn-sm" ng-click="$ctrl.searchText=''" ng-if="$ctrl.searchText">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body p-0" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="table-responsive" style="flex: 1; overflow-y: auto;">
                <table class="table table-hover table-sm mb-0">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th style="width: 5%">ID</th>
                            <th style="width: 25%">Employee Name</th>
                            <th style="width: 20%">Type</th>
                            <th style="width: 30%">Description</th>
                            <th style="width: 10%">Controls Count</th>
                            <th style="width: 10%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="emp in $ctrl.getFilteredEmployees()">
                            <!-- View Mode -->
                            <td ng-if="!emp.editing">{{emp.id}}</td>
                            <td ng-if="!emp.editing">
                                <strong>{{emp.employeeName}}</strong>
                            </td>
                            <td ng-if="!emp.editing">
                                <span class="badge bg-secondary">{{$ctrl.getTypeName(emp.typeId)}}</span>
                            </td>
                            <td ng-if="!emp.editing">
                                {{$ctrl.getDescription(emp.typeId) || '-'}}
                            </td>
                            <td ng-if="!emp.editing" class="text-center">
                                <span class="badge bg-info">{{$ctrl.getControlsCount(emp.id)}}</span>
                            </td>
                            <td ng-if="!emp.editing" class="text-center">
                                <button class="btn btn-sm btn-warning me-1" ng-click="$ctrl.startEdit(emp)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" ng-click="$ctrl.deleteEmployee(emp)" ng-disabled="emp.deleting">
                                    <span ng-if="!emp.deleting"><i class="fas fa-trash"></i> Delete</span>
                                    <span ng-if="emp.deleting"><i class="fas fa-spinner fa-spin"></i> Deleting...</span>
                                </button>
                            </td>
                            
                            <!-- Edit Mode -->
                            <td ng-if="emp.editing" colspan="6">
                                <div class="p-3 bg-light">
                                    <form ng-submit="$ctrl.saveEmployee(emp)">
                                        <div class="row mb-2">
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold">Employee Name:</label>
                                                <input type="text" class="form-control" ng-model="emp.editName" required>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold">Select Description:</label>
                                                <select class="form-select" 
                                                        ng-model="emp.editSelectedType" 
                                                        ng-options="type as (type.description || 'No Description') for type in $ctrl.getUniqueDescriptions()"
                                                        ng-change="$ctrl.onEditDescriptionChange(emp)"
                                                        required>
                                                    <option value="">-- Select Description --</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold">Type:</label>
                                                <input type="text" 
                                                       class="form-control" 
                                                       ng-model="emp.editTypeName" 
                                                       readonly 
                                                       style="background-color: #f8f9fa; cursor: not-allowed;">
                                            </div>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button type="submit" class="btn btn-sm btn-success" ng-disabled="$ctrl.isSaving || emp.saving">
                                                <span ng-if="!emp.saving"><i class="fas fa-check me-1"></i>Save</span>
                                                <span ng-if="emp.saving"><i class="fas fa-spinner fa-spin me-1"></i>Saving...</span>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-secondary" ng-click="$ctrl.cancelEdit(emp)" ng-disabled="emp.saving">
                                                <i class="fas fa-times me-1"></i>Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <tr ng-if="$ctrl.getFilteredEmployees().length === 0">
                            <td colspan="6" class="text-center text-muted py-4">
                                <i class="fas fa-users fa-2x mb-2 d-block"></i>
                                No employees found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.isSaving = false;
        
        // Initialize data
        ApiService.init();
        
        ctrl.getFilteredEmployees = function() {
            if(!ctrl.store.employees) return [];
            var filtered = ctrl.store.employees;
            
            if(ctrl.searchText) {
                var term = ctrl.searchText.toLowerCase();
                filtered = filtered.filter(function(emp) {
                    return emp.employeeName && emp.employeeName.toLowerCase().includes(term);
                });
            }
            
            return filtered;
        };
        
        ctrl.getTypeName = function(typeId) {
            if(!typeId || !ctrl.store.controlTypes) return '-';
            var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
            return type ? type.typeName : '-';
        };
        
        ctrl.getDescription = function(typeId) {
            if(!typeId || !ctrl.store.controlTypes) return null;
            var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
            return type ? type.description : null;
        };
        
        ctrl.getControlsCount = function(employeeId) {
            if(!ctrl.store.allControls) return 0;
            return ctrl.store.allControls.filter(c => c.employeeId == employeeId).length;
        };
        
        ctrl.getUniqueDescriptions = function() {
            if (!ctrl.store.controlTypes || ctrl.store.controlTypes.length === 0) {
                return [];
            }
            
            var descriptionMap = {};
            ctrl.store.controlTypes.forEach(function(type) {
                if (type.description && type.description.trim() !== '') {
                    if (!descriptionMap[type.description]) {
                        descriptionMap[type.description] = type;
                    }
                }
            });
            
            return Object.keys(descriptionMap).map(function(desc) {
                return descriptionMap[desc];
            }).sort(function(a, b) {
                return (a.description || '').localeCompare(b.description || '');
            });
        };
        
        ctrl.startEdit = function(emp) {
            emp.editing = true;
            emp.editName = emp.employeeName;
            
            // Find the current type
            var currentType = ctrl.store.controlTypes.find(t => t.controlTypeId == emp.typeId);
            if(currentType) {
                emp.editSelectedType = currentType;
                emp.editTypeName = currentType.typeName;
            } else {
                emp.editSelectedType = null;
                emp.editTypeName = '';
            }
        };
        
        ctrl.onEditDescriptionChange = function(emp) {
            if (!emp.editSelectedType) {
                emp.editTypeName = '';
                return;
            }
            emp.editTypeName = emp.editSelectedType.typeName;
        };
        
        ctrl.saveEmployee = function(emp) {
            if (!emp.editSelectedType) {
                NotificationService.show('Please select a description', 'error');
                return;
            }
            
            if (!emp.editName || emp.editName.trim() === '') {
                NotificationService.show('Employee name is required', 'error');
                return;
            }
            
            ctrl.isSaving = true;
            emp.saving = true;
            var updateData = {
                employeeName: emp.editName.trim(),
                typeId: emp.editSelectedType.controlTypeId,
                description: emp.editSelectedType.description || "Updated Employee"
            };
            
            ApiService.updateEmployee(emp.id, updateData).then(function(updatedEmployee) {
                // Update local data
                emp.employeeName = updatedEmployee ? updatedEmployee.employeeName : emp.editName;
                emp.typeId = emp.editSelectedType.controlTypeId;
                emp.editing = false;
                emp.saving = false;
                
                // Reload employees and controls to update references
                ApiService.loadEmployees().then(function() {
                    return ApiService.loadAllControls();
                });
                
                NotificationService.show('Employee updated successfully', 'success');
            }).catch(function(error) {
                emp.saving = false;
                console.error('Error updating employee:', error);
                var errorMsg = 'Error updating employee';
                if(error && error.data) {
                    if(typeof error.data === 'string') {
                        errorMsg = error.data;
                    } else if(error.data.message) {
                        errorMsg = error.data.message;
                    }
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() {
                ctrl.isSaving = false;
            });
        };
        
        ctrl.cancelEdit = function(emp) {
            emp.editing = false;
            delete emp.editName;
            delete emp.editSelectedType;
            delete emp.editTypeName;
        };
        
        ctrl.deleteEmployee = function(emp) {
            if(!confirm('Are you sure you want to delete ' + emp.employeeName + '?\n\nThis will also delete all controls associated with this employee.')) {
                return;
            }
            
            emp.deleting = true;
            ApiService.deleteEmployee(emp.id).then(function() {
                // Remove from local list
                var index = ctrl.store.employees.findIndex(e => e.id === emp.id);
                if(index > -1) {
                    ctrl.store.employees.splice(index, 1);
                }
                
                // Reload controls to update the list
                ApiService.loadAllControls();
                
                NotificationService.show('Employee deleted successfully', 'success');
            }).catch(function(error) {
                emp.deleting = false;
                console.error('Error deleting employee:', error);
                var errorMsg = 'Error deleting employee';
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
    }
});




