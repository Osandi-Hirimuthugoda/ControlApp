app.component('newEmployee', {
    template: `
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white py-3">
            <h5 class="mb-0 fw-bold"><i class="fas fa-user-plus me-2"></i>New Employee</h5>
        </div>
        <div class="card-body">
            <form ng-submit="$ctrl.addEmployee($event)">
                <div class="mb-3">
                    <label class="form-label fw-bold">Employee Name:</label>
                    <input type="text" class="form-control" ng-model="$ctrl.newEmployee.employeeName" placeholder="Enter employee name" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Select Description:</label>
                    <select class="form-select" 
                            ng-model="$ctrl.selectedType" 
                            ng-options="type as (type.description || 'No Description') for type in $ctrl.getUniqueDescriptions()"
                            ng-change="$ctrl.onDescriptionChange()"
                            required>
                        <option value="">-- Select Description --</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Type:</label>
                    <input type="text" 
                           class="form-control" 
                           ng-model="$ctrl.selectedTypeName" 
                           readonly 
                           style="background-color: #f8f9fa; cursor: not-allowed;"
                           placeholder="Type will be auto-selected">
                </div>
                <button type="submit" class="btn btn-primary w-100" ng-disabled="$ctrl.isSaving || !$ctrl.newEmployee.typeId">
                    <span ng-if="!$ctrl.isSaving"><i class="fas fa-plus me-2"></i>Add Employee</span>
                    <span ng-if="$ctrl.isSaving"><i class="fas fa-spinner fa-spin me-2"></i>Adding...</span>
                </button>
            </form>
        </div>
    </div>
    `,
    controller: function(ApiService, NotificationService, $rootScope, $scope) {
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
                console.log('Control types updated event received in new-employee');
                // Reload control types to get the latest list
                ApiService.loadControlTypes().then(function(types) {
                    console.log('Control types reloaded in new-employee, count:', types.length);
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

        ctrl.onDescriptionChange = function() {
            if (!ctrl.selectedType) {
                ctrl.newEmployee.typeId = null;
                ctrl.selectedDescription = null;
                ctrl.selectedTypeName = '';
                return;
            }

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
            }).finally(function() { 
                ctrl.isSaving = false; 
            });
        };
    }
});


