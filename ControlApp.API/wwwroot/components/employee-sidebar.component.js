app.component('employeeSidebar', {
    template: `
    <div style="height: 80vh; display: flex; flex-direction: column;">
        <!-- Add Employee Card -->
        <div class="card shadow-sm mb-3" style="flex-shrink: 0;">
            <div class="card-header bg-primary text-white py-2"><h6 class="mb-0"><i class="fas fa-plus"></i> New Employee</h6></div>
            <div class="card-body">
                <form ng-submit="$ctrl.addEmployee($event)">
                    <div class="mb-2">
                        <input type="text" class="form-control form-control-sm" ng-model="$ctrl.newEmployee.employeeName" placeholder="Name" required>
                    </div>
                    <div class="mb-2">
                        <!-- Control Type Selection -->
                        <select class="form-select form-select-sm" 
                                ng-model="$ctrl.newEmployee.typeId" 
                                ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes" required>
                            <option value="">-- Select Type (L3 / CR) --</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary w-100" ng-disabled="$ctrl.isSaving">Add</button>
                </form>
            </div>
        </div>

        <!-- Employee List Card -->
        <div class="card shadow-sm" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="card-header bg-secondary text-white py-2" style="flex-shrink: 0;"><h6 class="mb-0">Employees</h6></div>
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
                                    <select class="form-select form-select-sm" ng-model="emp.editTypeId" 
                                            ng-options="t.controlTypeId as t.typeName for t in $ctrl.store.controlTypes"></select>
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
    controller: function(ApiService, NotificationService, $q) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.newEmployee = { employeeName: '', typeId: null };
        ctrl.isSaving = false;

        // Helper to show Type Names
        ctrl.getTypeName = function(id) {
            var t = ctrl.store.controlTypes.find(x => x.controlTypeId == id);
            return t ? t.typeName : '';
        };

        ctrl.addEmployee = function(event) {
            if(event) event.preventDefault();
            ctrl.isSaving = true;
            ApiService.addEmployee({
                employeeName: ctrl.newEmployee.employeeName,
                typeId: ctrl.newEmployee.typeId,
                description: "New Employee"
            }).then(function() {
                NotificationService.show('Employee Added Successfully!', 'success');
                ctrl.newEmployee = { employeeName: '', typeId: null };
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

        ctrl.startEdit = function(e) { e.editing = true; e.editName = e.employeeName; e.editTypeId = e.typeId; };
        ctrl.cancelEdit = function(e) { e.editing = false; };
        
        ctrl.saveEmployee = function(e) {
            ApiService.updateEmployee(e.id, { employeeName: e.editName, typeId: e.editTypeId }).then(function(r) {
                e.employeeName = r.data.employeeName;
                e.typeId = r.data.typeId;
                e.editing = false;
                NotificationService.show('Employee Updated', 'success');
            });
        };
    }
});