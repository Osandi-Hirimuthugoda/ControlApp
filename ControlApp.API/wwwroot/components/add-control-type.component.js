app.component('addControlType', {
    template: `
    <div class="card shadow-sm">
        <div class="card-header"
             style="background: linear-gradient(135deg,#3b82f6,#2563eb);
                    color:white; padding:1.25rem 1.5rem;">
            <h5 class="mb-0 fw-bold">
                <i class="fas fa-plus-circle me-2"></i>Add Control & Assign Owner
            </h5>
        </div>

        <div class="card-body">
            <!-- Form -->
            <form name="addTypeForm" ng-submit="$ctrl.addControlType(addTypeForm)" novalidate>

                <!-- 1. Type Name -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Controller Type Name *</label>
                    <input type="text"
                           class="form-control"
                           ng-model="$ctrl.newControlType.typeName"
                           placeholder="e.g. L3, CR"
                           required>
                </div>

                <!-- 2. Description -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Description *</label>
                    <textarea class="form-control"
                              rows="3"
                              ng-model="$ctrl.newControlType.description"
                              placeholder="Enter control task details..."
                              required></textarea>
                </div>

                <!-- 3. Assign Employee (Owner) -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Assign Employee (Owner)</label>
                    <!-- Only show registered employees (those with User accounts) -->
                    <select class="form-select"
                            ng-model="$ctrl.assignedEmployeeId"
                            ng-options="e.id as $ctrl.formatEmployeeOption(e) for e in $ctrl.getRegisteredEmployees()">
                        <option value="">-- Select Registered Employee (Optional) --</option>
                    </select>
                    <small class="text-muted">Only employees with registered accounts are shown. Leave empty to add control type only.</small>
                </div>



                <!-- Submit Button -->
                <!--  $invalid  -->
                <button class="btn btn-primary w-100 shadow-sm"
                        type="submit"
                        ng-disabled="$ctrl.isSaving || addTypeForm.$invalid">
                    <span ng-if="!$ctrl.isSaving">
                        <i class="fas fa-save me-2"></i>Add and Assign to Board
                    </span>
                    <span ng-if="$ctrl.isSaving">
                        <i class="fas fa-spinner fa-spin me-2"></i>Processing...
                    </span>
                </button>
                
                <!-- Debugging  Form Invalid -->
                <p class="text-danger small mt-2" ng-if="addTypeForm.$invalid">* Please fill all required fields.</p>

            </form>
        </div>
    </div>
    `,

    controller: function (ApiService, NotificationService, $rootScope, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Models
        ctrl.newControlType = { typeName: '', description: '' };
        ctrl.assignedEmployeeId = null;
        ctrl.isSaving = false;

        // Get only registered employees 
        ctrl.getRegisteredEmployees = function () {
            if (!ctrl.store.employees) return [];
            // Filter employees that have email 
            return ctrl.store.employees.filter(function (emp) {
                return emp.email && emp.email.trim() !== '';
            });
        };

        // Format employee option display with role
        ctrl.formatEmployeeOption = function (employee) {
            var name = employee.employeeName || 'Unknown';
            var role = employee.role || 'No Role';
            return name + ' (' + role + ')';
        };



        ctrl.addControlType = function (form) {
            // Validate manually even if button is clicked
            if (form.$invalid) {
                NotificationService.show('Please fill all required fields correctly.', 'error');
                return;
            }

            ctrl.isSaving = true;

            var typePayload = {
                typeName: ctrl.newControlType.typeName.trim(),
                description: ctrl.newControlType.description.trim(),
                releaseDate: null
            };

            // 1. Add Control Type
            ApiService.addControlType(typePayload)
                .then(function (addedType) {

                    var typeId = addedType.controlTypeId || addedType.id;

                    if (!typeId) {
                        throw new Error("Control Type ID not returned from server.");
                    }

                    // 2. Always create a Control row
                    //    - If employee selected -> assign to that employee
                    //    - If not selected      -> backend will auto-assign to 'Unassigned' employee
                    var employeeIdValue = null;
                    if (ctrl.assignedEmployeeId && ctrl.assignedEmployeeId !== '' && ctrl.assignedEmployeeId !== 'null') {
                        var parsedId = parseInt(ctrl.assignedEmployeeId);
                        if (!isNaN(parsedId) && parsedId > 0) {
                            employeeIdValue = parsedId;
                        }
                    }

                    var controlPayload = {
                        typeId: typeId,
                        employeeId: employeeIdValue, // can be null -> backend handles as 'Unassigned'
                        description: addedType.description,
                        statusId: 1,
                        progress: 0,
                        comments: 'Initial assignment',
                        releaseDate: addedType.releaseDate || null
                    };

                    return ApiService.addControl(controlPayload).then(function () {
                        if (employeeIdValue) {
                            return 'Control added to Board and assigned to employee.';
                        } else {
                            return 'Control added without employee. You can assign an owner later.';
                        }
                    });
                })
                .then(function (message) {
                    // Toast success
                    NotificationService.show('Success! ' + message, 'success');

                    // Always show success popup when control is added
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully Added Control',
                        text: 'The control has been added to the board successfully.',
                        confirmButtonText: 'OK'
                    });

                    // Reset Form
                    ctrl.newControlType = { typeName: '', description: '' };
                    ctrl.assignedEmployeeId = null;

                    if (form) {
                        form.$setPristine();
                        form.$setUntouched();
                    }

                    // Refresh data
                    return ApiService.loadAllControls();
                })
                .then(function () {
                    $rootScope.$broadcast('controlTypesUpdated');
                    $rootScope.$broadcast('controlsUpdated');
                })
                .catch(function (err) {
                    console.error("Error Details:", err);
                    var msg = "Error: ";
                    if (err.status === 404) msg += "API Endpoint not found (404).";
                    else msg += (err.data && err.data.message) ? err.data.message : "Save failed.";
                    NotificationService.show(msg, 'error');
                })
                .finally(function () {
                    ctrl.isSaving = false;
                });
        };

        ctrl.$onInit = function () {
            ApiService.loadControlTypes();
            if (ApiService.loadEmployees) {
                ApiService.loadEmployees();
            }
        };
    }
});