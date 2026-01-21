app.component('newEmployee', {
    template: `
    <div class="card shadow-sm">
        <div class="card-header"
             style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white; padding: 1.25rem 1.5rem;">
            <h5 class="mb-0 fw-bold">
                <i class="fas fa-user-plus me-2"></i>New Employee Registration
            </h5>
        </div>

        <div class="card-body">
            <form ng-submit="$ctrl.addEmployee($event)">

                <!-- Employee Name -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Employee Name:</label>
                    <input type="text"
                           class="form-control"
                           ng-model="$ctrl.newEmployee.employeeName"
                           placeholder="Enter full name"
                           required>
                </div>

                <!-- Role Selection -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Select Role:</label>
                    <select class="form-select"
                            ng-model="$ctrl.newEmployee.role"
                            ng-options="role for role in $ctrl.roles"
                            required>
                        <option value="">-- Select Role --</option>
                    </select>
                </div>

                <!-- Control Type Selection (Optional) -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Assign Control Type (Optional):</label>
                    <select class="form-select"
                            ng-model="$ctrl.newEmployee.typeId"
                            ng-options="type.controlTypeId as (type.typeName + ' - ' + (type.description || 'No Description')) for type in $ctrl.store.controlTypes">
                        <option value="">-- Select Control Type (Optional) --</option>
                    </select>
                    <small class="text-muted">Select a control type to automatically assign a control task to this employee</small>
                </div>

                <!-- Email Address (Login Username) -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Login Email Address:</label>
                    <input type="email"
                           class="form-control"
                           ng-model="$ctrl.newEmployee.email"
                           placeholder="example@company.com"
                           ng-class="{'is-invalid': $ctrl.newEmployee.email && !$ctrl.isValidEmail($ctrl.newEmployee.email)}"
                           required>
                    <div class="invalid-feedback" ng-if="$ctrl.newEmployee.email && !$ctrl.isValidEmail($ctrl.newEmployee.email)">
                        Please enter a valid email address
                    </div>
                    <small class="text-muted">If this email is already registered, the employee will be linked to that account.</small>
                </div>

                <!-- Phone Number -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Phone Number:</label>
                    <input type="tel"
                           class="form-control"
                           ng-model="$ctrl.newEmployee.phoneNumber"
                           placeholder="+94 00 000 0000"
                           required>
                    <small class="text-muted">Enter phone number with country code</small>
                </div>

                <!-- Password with Eye Icon -->
                <div class="mb-3">
                    <label class="form-label fw-bold">Login Password:</label>
                    <div class="input-group">
                        <input ng-attr-type="{{$ctrl.showPassword ? 'text' : 'password'}}"
                               class="form-control"
                               ng-model="$ctrl.newEmployee.password"
                               placeholder="Assign a password"
                               required>
                        <button class="btn btn-outline-secondary" 
                                type="button" 
                                ng-click="$ctrl.togglePassword()"
                                title="{{$ctrl.showPassword ? 'Hide' : 'Show'}} Password">
                            <i class="fas" ng-class="$ctrl.showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                        </button>
                    </div>
                    <small class="text-muted">This email and password will be used for employee login.</small>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                        class="btn btn-primary w-100"
                        ng-disabled="$ctrl.isSaving">
                    <span ng-if="!$ctrl.isSaving">
                        <i class="fas fa-user-check me-2"></i>Create Employee Account
                    </span>
                    <span ng-if="$ctrl.isSaving">
                        <i class="fas fa-spinner fa-spin me-2"></i>Registering...
                    </span>
                </button>

            </form>
        </div>
    </div>
    `,

    controller: function(ApiService, NotificationService, $rootScope) {
        var ctrl = this;
        ctrl.store = ApiService.data;

        // Roles List
        ctrl.roles = [
            'Project Manager',
            'Software Architect',
            'Team Lead',
            'Developer',
            'QA Engineer',
            'Intern'
        ];
        
        // Form Model (default role = Project Manager)
        ctrl.newEmployee = {
            employeeName: '',
            role: 'Project Manager',
            email: '',
            password: '',
            phoneNumber: '',
            typeId: null
        };
        
        ctrl.$onInit = function() {
            // Load control types if not already loaded
            if(!ctrl.store.controlTypes || ctrl.store.controlTypes.length === 0) {
                ApiService.loadControlTypes();
            }
            // Load employees to check for duplicates
            if(!ctrl.store.employees || ctrl.store.employees.length === 0) {
                ApiService.loadEmployees();
            }
        };
        
        
         // Check if employee already exists by name
         
        ctrl.checkEmployeeExists = function(employeeName) {
            if(!employeeName || !ctrl.store.employees) return false;
            var trimmedName = employeeName.trim().toLowerCase();
            return ctrl.store.employees.some(function(emp) {
                return emp.employeeName && emp.employeeName.trim().toLowerCase() === trimmedName;
            });
        };

        ctrl.isSaving = false;
        ctrl.showPassword = false; 

        
        //Toggle Password Visibility
         
        ctrl.togglePassword = function() {
            ctrl.showPassword = !ctrl.showPassword;
        };

        
        // Validate Email Format
        ctrl.isValidEmail = function(email) {
            if(!email) return false;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Register New Employee
         
        ctrl.addEmployee = function (event) {
            if (event) event.preventDefault();

            // Validate required fields
            if (!ctrl.newEmployee.employeeName || ctrl.newEmployee.employeeName.trim() === '') {
                NotificationService.show('Employee name is required', 'error');
                return;
            }

            // Check if employee with same name already exists
            if (ctrl.checkEmployeeExists(ctrl.newEmployee.employeeName)) {
                Swal.fire({
                    title: 'Employee Already Exists!',
                    text: 'An employee with the name "' + ctrl.newEmployee.employeeName.trim() + '" already exists. Do you want to continue anyway?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Continue',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                        // User confirmed, proceed with registration
                        ctrl.proceedWithRegistration();
                    }
                });
                return;
            }

            if (!ctrl.newEmployee.role) {
                NotificationService.show('Please select a role', 'error');
                return;
            }

            if (!ctrl.newEmployee.email || !ctrl.isValidEmail(ctrl.newEmployee.email)) {
                NotificationService.show('Please enter a valid email address', 'error');
                return;
            }

            if (!ctrl.newEmployee.password || ctrl.newEmployee.password.length < 6) {
                NotificationService.show('Password must be at least 6 characters long', 'error');
                return;
            }

            if (!ctrl.newEmployee.phoneNumber || ctrl.newEmployee.phoneNumber.trim() === '') {
                NotificationService.show('Phone number is required', 'error');
                return;
            }

            // Proceed with registration
            ctrl.proceedWithRegistration();
        };
        
        // Proceed with employee registration after validation
         
        ctrl.proceedWithRegistration = function() {
            ctrl.isSaving = true;

            // Payload for backend API
            var payload = {
                employeeName: ctrl.newEmployee.employeeName.trim(),
                role: ctrl.newEmployee.role,
                email: ctrl.newEmployee.email.trim().toLowerCase(),
                password: ctrl.newEmployee.password,
                phoneNumber: ctrl.newEmployee.phoneNumber.trim(),
                typeId: ctrl.newEmployee.typeId || null,
                description: null 
            };

            ApiService.registerEmployee(payload)
                .then(function () {
                    // Show success toast
                    NotificationService.show('Employee account created successfully!', 'success');

                    // Show Alert success dialog as well
                    Swal.fire({
                        icon: 'success',
                        title: 'Employee Registered',
                        text: 'The employee account has been created successfully.',
                        confirmButtonText: 'OK'
                    });
                    
                    // Trigger update in sidebar or employee list
                    $rootScope.$broadcast('employeesUpdated');
                    
                    // Reload employees and controls, then ensure controls are created
                    ApiService.loadEmployees().then(function() {
                        return ApiService.loadAllControls();
                    }).then(function() {
                        // If employee was added without a control type, create a control for them
                        // This ensures all employees appear in the controls table
                        var newEmployee = ctrl.store.employees.find(function(emp) {
                            return emp.employeeName && emp.employeeName.trim().toLowerCase() === ctrl.newEmployee.employeeName.trim().toLowerCase();
                        });
                        
                        if(newEmployee) {
                            // Check if employee has any controls
                            var hasControls = ctrl.store.allControls && ctrl.store.allControls.some(function(c) {
                                return c.employeeId === newEmployee.id;
                            });
                            
                            // If no controls exist and no typeId was provided, try to create a control
                            if(!hasControls && !ctrl.newEmployee.typeId) {
                                // Try to get the first available control type
                                if(ctrl.store.controlTypes && ctrl.store.controlTypes.length > 0) {
                                    var firstType = ctrl.store.controlTypes[0];
                                    // Create control using the API
                                    var controlPayload = {
                                        typeId: firstType.controlTypeId,
                                        employeeId: newEmployee.id,
                                        description: firstType.description || 'Control for ' + newEmployee.employeeName,
                                        statusId: 1,
                                        progress: 0,
                                        comments: 'Initial assignment',
                                        releaseDate: firstType.releaseDate
                                    };
                                    
                                    ApiService.addControl(controlPayload).then(function() {
                                        // Reload controls after creating
                                        return ApiService.loadAllControls();
                                    }).then(function() {
                                        $rootScope.$broadcast('controlsUpdated');
                                        // Show toast for auto-created control
                                        NotificationService.show('Control created and assigned to ' + newEmployee.employeeName + ' automatically.', 'success');
                                    }).catch(function(err) {
                                        console.log('Could not auto-create control:', err);
                                        // This is okay, user can manually assign later
                                    });
                                }
                            }
                        }
                    });

                    // Reset Form
                    ctrl.resetForm();
                })
                .catch(function (err) {
                    console.error("Registration Error:", err);
                    var errorMsg = 'Error creating account.';
                    
                    if(err && err.data) {
                        if(err.data.message) {
                            errorMsg = err.data.message;
                        } else if(typeof err.data === 'string') {
                            errorMsg = err.data;
                        }
                    }
                    
                    // Check for existing employee error
                    if(errorMsg.toLowerCase().includes('employee account already exists')) {
                        errorMsg = 'Employee account already exists for this email. The employee has been linked to the existing account.';
                    }
                    
                    NotificationService.show(errorMsg, 'error');
                })
                .finally(function () {
                    ctrl.isSaving = false;
                });
        };

        //Reset Form
        ctrl.resetForm = function() {
            ctrl.newEmployee = {
                employeeName: '',
                role: '',
                email: '',
                password: '',
                phoneNumber: '',
                typeId: null
            };
            ctrl.showPassword = false;
        };
    }
});