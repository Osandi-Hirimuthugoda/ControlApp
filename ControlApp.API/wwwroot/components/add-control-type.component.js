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

                <!-- 4. Release Selection -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Release</label>
                    <select class="form-select"
                            ng-model="$ctrl.selectedReleaseId"
                            ng-options="r.releaseId as $ctrl.formatReleaseName(r) for r in $ctrl.store.upcomingReleases"
                            ng-change="$ctrl.onReleaseChange()">
                        <option value="">-- Select Release --</option>
                    </select>
                </div>

                <!-- 5. Release Date -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Release Date</label>
                    <input type="date"
                           class="form-control"
                           ng-model="$ctrl.newControlType.releaseDate">
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

    controller: function(ApiService, NotificationService, $rootScope, $scope, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Models
        ctrl.newControlType = { typeName:'', description:'', releaseDate:null };
        ctrl.assignedEmployeeId = null;
        ctrl.selectedReleaseId = null;
        ctrl.isSaving = false;

        // Get only registered employees 
        ctrl.getRegisteredEmployees = function() {
            if(!ctrl.store.employees) return [];
            // Filter employees that have email 
            return ctrl.store.employees.filter(function(emp) {
                return emp.email && emp.email.trim() !== '';
            });
        };

        // Format employee option display with role
        ctrl.formatEmployeeOption = function(employee) {
            var name = employee.employeeName || 'Unknown';
            var role = employee.role || 'No Role';
            return name + ' (' + role + ')';
        };

        ctrl.formatReleaseName = function(r) {
            if(!r) return '';
            return r.releaseName || ('Release ' + r.releaseDate);
        };

        ctrl.onReleaseChange = function() {
            var rel = ctrl.store.upcomingReleases.find(r => r.releaseId === ctrl.selectedReleaseId);
            if (rel && rel.releaseDate) {
                ctrl.newControlType.releaseDate = new Date(rel.releaseDate);
            }
        };

        ctrl.addControlType = function(form) {
            // Validate manually even if button is clicked
            if(form.$invalid) {
                NotificationService.show('Please fill all required fields correctly.', 'error');
                return;
            }

            ctrl.isSaving = true;

            var formattedDate = null;
            if (ctrl.newControlType.releaseDate) {
                formattedDate = new Date(ctrl.newControlType.releaseDate).toISOString();
            }

            var typePayload = {
                typeName: ctrl.newControlType.typeName.trim(),
                description: ctrl.newControlType.description.trim(),
                releaseDate: formattedDate
            };

            // 1. Add Control Type
            ApiService.addControlType(typePayload)
                .then(function(addedType) {
                    
                    var typeId = addedType.controlTypeId || addedType.id;

                    if (!typeId) {
                        throw new Error("Control Type ID not returned from server.");
                    }

                    // 2. Add Control to Board only if employee is assigned
                    if (ctrl.assignedEmployeeId) {
                        
                        var controlReleaseDate = null;
                        if (ctrl.newControlType.releaseDate) {
                           
                            controlReleaseDate = new Date(ctrl.newControlType.releaseDate).toISOString();
                        } else if (addedType.releaseDate) {
                            
                            controlReleaseDate = addedType.releaseDate;
                        }
                        
                        var controlPayload = {
                            typeId: typeId,
                            employeeId: ctrl.assignedEmployeeId,
                            description: addedType.description,
                            statusId: 1, 
                            progress: 0,
                            comments: 'Initial assignment',
                            releaseDate: controlReleaseDate
                        };

                        return ApiService.addControl(controlPayload).then(function() {
                            return 'Control added to Board.';
                        });
                    } else {
                        // No employee assigned, just return success message
                        return Promise.resolve('Control type added. No control created (no employee assigned).');
                    }
                })
                .then(function(message) {
                    // Toast success
                    NotificationService.show('Success! ' + message, 'success');

                    // Popup success
                    if (message && message.indexOf('Control added to Board') !== -1) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Control Added',
                            text: 'The control has been added to the board successfully.',
                            confirmButtonText: 'OK'
                        });
                    }

                    // Reset Form
                    ctrl.newControlType = { typeName:'', description:'', releaseDate:null };
                    ctrl.assignedEmployeeId = null;
                    ctrl.selectedReleaseId = null;
                    
                    if(form) {
                        form.$setPristine();
                        form.$setUntouched();
                    }

                    // Refresh data
                    return ApiService.loadAllControls();
                })
                .then(function() {
                    $rootScope.$broadcast('controlTypesUpdated');
                    $rootScope.$broadcast('controlsUpdated');
                })
                .catch(function(err) {
                    console.error("Error Details:", err);
                    var msg = "Error: ";
                    if (err.status === 404) msg += "API Endpoint not found (404).";
                    else msg += (err.data && err.data.message) ? err.data.message : "Save failed.";
                    NotificationService.show(msg, 'error');
                })
                .finally(function() {
                    ctrl.isSaving = false;
                });
        };

        ctrl.$onInit = function() {
            ApiService.loadControlTypes();
            if (ApiService.loadEmployees) {
                ApiService.loadEmployees();
            }
        };
    }
});