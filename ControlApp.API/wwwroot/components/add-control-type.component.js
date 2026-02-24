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

                <!-- 4. Sub-Objectives & Key Results -->
                <div class="mb-4">
                    <label class="form-label fw-bold d-flex justify-content-between align-items-center">
                        Sub-Objectives / Key Results
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill border-dashed" ng-click="$ctrl.addSubDescription()">
                            <i class="fas fa-plus-circle me-1"></i> Add Item
                        </button>
                    </label>
                    
                    <div class="sub-objective-list bg-light p-3 rounded-3 border" ng-if="$ctrl.newSubDescriptions.length > 0">
                        <div ng-repeat="sub in $ctrl.newSubDescriptions track by $index" class="card mb-2 border-0 shadow-sm">
                            <div class="card-body p-2">
                                <div class="row g-2 align-items-center">
                                    <div class="col-auto">
                                        <span class="badge bg-secondary rounded-circle">{{$index + 1}}</span>
                                    </div>
                                    <div class="col">
                                        <input type="text" class="form-control form-control-sm border-0 bg-light mb-2" 
                                               ng-model="sub.description" 
                                               placeholder="Sub-objective description..." required>
                                        
                                        <div class="row g-2">
                                            <div class="col-md-4">
                                                <select class="form-select form-select-sm border-0 bg-light" 
                                                        ng-model="sub.employeeId" 
                                                        ng-options="e.id as e.employeeName for e in $ctrl.store.employees">
                                                    <option value="">- Owner (Optional) -</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <select class="form-select form-select-sm border-0 bg-light" 
                                                        ng-model="sub.statusId" 
                                                        ng-options="s.id as s.statusName for s in $ctrl.store.statuses">
                                                    <option value="">- Status -</option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                 <div class="input-group input-group-sm">
                                                    <input type="number" class="form-control border-0 bg-light" 
                                                           ng-model="sub.progress" min="0" max="100" placeholder="%">
                                                    <span class="input-group-text border-0 bg-white">%</span>
                                                </div>
                                            </div>
                                             <div class="col-md-1 text-end">
                                                <button type="button" class="btn btn-link text-danger p-0" ng-click="$ctrl.removeSubDescription($index)">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.newSubDescriptions.length === 0" class="text-center p-3 border border-dashed rounded-3 text-muted small">
                        No sub-objectives added. Click "Add Item" to define results.
                    </div>
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

    controller: function (ApiService, NotificationService, $rootScope, $scope, $timeout, AuthService) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Models
        ctrl.newControlType = { typeName: '', description: '' };
        ctrl.assignedEmployeeId = null;
        ctrl.isSaving = false;
        ctrl.newSubDescriptions = [];

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

        // Sub-Description Management
        ctrl.addSubDescription = function () {
            ctrl.newSubDescriptions.push({
                description: '',
                employeeId: null,
                statusId: 1, // Default to 'Pending' or first status if available
                progress: 0,
                comments: []
            });
        };

        ctrl.removeSubDescription = function (index) {
            ctrl.newSubDescriptions.splice(index, 1);
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

                    // Prepare Sub-Descriptions
                    var subDescriptionsJson = null;
                    if (ctrl.newSubDescriptions && ctrl.newSubDescriptions.length > 0) {
                        // Filter out empty ones to be safe
                        var validSubs = ctrl.newSubDescriptions.filter(function (s) { return s.description && s.description.trim() !== ''; });
                        if (validSubs.length > 0) {
                            // Map to ensure cleaner object structure if needed, but the UI model matches perfectly
                            subDescriptionsJson = JSON.stringify(validSubs);
                        }
                    }

                    var controlPayload = {
                        typeId: typeId,
                        employeeId: employeeIdValue, // can be null -> backend handles as 'Unassigned'
                        description: addedType.description,
                        statusId: 1,
                        progress: 0,
                        comments: 'Initial assignment',
                        releaseDate: addedType.releaseDate || null,
                        subDescriptions: subDescriptionsJson
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
                    ctrl.newSubDescriptions = []; // Reset subs

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
            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            console.log('Add control type component initialized for team:', currentTeamId);
            
            // Load data for current team
            ApiService.loadControlTypes(currentTeamId).then(function() {
                if (ApiService.loadEmployees) {
                    return ApiService.loadEmployees(currentTeamId);
                }
            }).then(function() {
                if (ApiService.loadStatuses) {
                    return ApiService.loadStatuses();
                }
            });
            
            // Listen for team changes
            var teamListener = $rootScope.$on('teamChanged', function(event, data) {
                var teamId = data ? data.teamId : null;
                console.log('Team changed in add-control-type, reloading for team:', teamId);
                
                // Reload data for new team
                ApiService.loadControlTypes(teamId).then(function() {
                    if (ApiService.loadEmployees) {
                        return ApiService.loadEmployees(teamId);
                    }
                }).then(function() {
                    // Update store reference
                    ctrl.store = ApiService.data;
                });
            });
            
            // Listen for section changes (when navigating to this page)
            var sectionListener = $rootScope.$on('controlsSectionChanged', function(event, section) {
                if (section === 'addControlType') {
                    var teamId = AuthService.getTeamId();
                    console.log('Navigated to add control type section, reloading for team:', teamId);
                    
                    // Reload data for current team
                    ApiService.loadControlTypes(teamId).then(function() {
                        if (ApiService.loadEmployees) {
                            return ApiService.loadEmployees(teamId);
                        }
                    }).then(function() {
                        // Update store reference
                        ctrl.store = ApiService.data;
                    });
                }
            });
            
            // Store listeners for cleanup
            ctrl.teamListener = teamListener;
            ctrl.sectionListener = sectionListener;
        };
        
        ctrl.$onDestroy = function() {
            if (ctrl.teamListener) {
                ctrl.teamListener();
            }
            if (ctrl.sectionListener) {
                ctrl.sectionListener();
            }
        };
    }
});