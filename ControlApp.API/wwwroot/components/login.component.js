app.component('loginComponent', {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card shadow">
                        <div class="card-body p-5">
                            <h2 class="card-title text-center mb-4">Login</h2>
                            
                            <div ng-if="login.error" class="alert alert-danger" role="alert">
                                {{login.error}}
                            </div>
                            
                            <form ng-submit="login.submit()">
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username or Email</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="username" 
                                           ng-model="login.credentials.usernameOrEmail" 
                                           required
                                           placeholder="Enter username or email">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <div class="position-relative">
                                        <input ng-attr-type="{{login.showPassword ? 'text' : 'password'}}" 
                                               class="form-control" 
                                               id="password" 
                                               ng-model="login.credentials.password" 
                                               required
                                               placeholder="Enter password"
                                               style="padding-right: 40px;">
                                        <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                              style="cursor: pointer; user-select: none;"
                                              ng-click="login.showPassword = !login.showPassword">
                                            <i class="fas" 
                                               ng-class="login.showPassword ? 'fa-eye-slash' : 'fa-eye'"
                                               style="color: #6c757d;"></i>
                                        </span>
                                    </div>
                                </div>
                                
                                <button type="submit" 
                                        class="btn btn-primary w-100 mb-3" 
                                        ng-disabled="login.loading">
                                    <span ng-if="login.loading">
                                        <i class="fas fa-spinner fa-spin"></i> Logging in...
                                    </span>
                                    <span ng-if="!login.loading">Login</span>
                                </button>
                            </form>
                            
                            <div class="text-center">
                                <p class="mb-0">Don't have an account? 
                                    <a href="#" ng-click="login.showRegister = true" ng-if="login.canRegister()">Register</a>
                                    <span ng-if="!login.canRegister()" class="text-muted">Contact Admin or Project Manager to register</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Register Form -->
                    <div class="card shadow mt-4" ng-if="login.showRegister">
                        <div class="card-body p-5">
                            <h2 class="card-title text-center mb-4">Register</h2>
                            
                            <div ng-if="login.registerError" class="alert alert-danger" role="alert">
                                {{login.registerError}}
                            </div>
                            
                            <form ng-submit="login.register()">
                                <div class="mb-3">
                                    <label for="regUsername" class="form-label">Username</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="regUsername" 
                                           ng-model="login.registerData.username" 
                                           required
                                           minlength="3"
                                           placeholder="Enter username">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="regEmail" class="form-label">Email</label>
                                    <input type="email" 
                                           class="form-control" 
                                           id="regEmail" 
                                           ng-model="login.registerData.email" 
                                           required
                                           placeholder="Enter email">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="regFullName" class="form-label">Full Name (Optional)</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="regFullName" 
                                           ng-model="login.registerData.fullName" 
                                           placeholder="Enter full name">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="regRole" class="form-label">Role <span class="text-danger">*</span></label>
                                    <select class="form-select" 
                                            id="regRole" 
                                            ng-model="login.registerData.role" 
                                            required>
                                        <option value="">Select Role</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Software Architecture">Software Architecture</option>
                                        <option value="Team Lead">Team Lead</option>
                                        <option value="Developer">Developer</option>
                                        <option value="QA Engineer">QA Engineer</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                    <small class="form-text text-muted">Only Admin can register new users</small>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="regPassword" class="form-label">Password</label>
                                    <div class="position-relative">
                                        <input ng-attr-type="{{login.showRegPassword ? 'text' : 'password'}}" 
                                               class="form-control" 
                                               id="regPassword" 
                                               ng-model="login.registerData.password" 
                                               required
                                               minlength="6"
                                               placeholder="Enter password (min 6 characters)"
                                               style="padding-right: 40px;">
                                        <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                              style="cursor: pointer; user-select: none;"
                                              ng-click="login.showRegPassword = !login.showRegPassword">
                                            <i class="fas" 
                                               ng-class="login.showRegPassword ? 'fa-eye-slash' : 'fa-eye'"
                                               style="color: #6c757d;"></i>
                                        </span>
                                    </div>
                                </div>
                                
                                <button type="submit" 
                                        class="btn btn-success w-100 mb-3" 
                                        ng-disabled="login.loading">
                                    <span ng-if="login.loading">
                                        <i class="fas fa-spinner fa-spin"></i> Registering...
                                    </span>
                                    <span ng-if="!login.loading">Register</span>
                                </button>
                            </form>
                            
                            <div class="text-center">
                                <p class="mb-0">Already have an account? 
                                    <a href="#" ng-click="login.showRegister = false">Login</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    controller: function(AuthService, NotificationService, $location, $rootScope, $timeout) {
        var vm = this;
        
        vm.credentials = {
            usernameOrEmail: '',
            password: ''
        };
        
        vm.registerData = {
            username: '',
            email: '',
            fullName: '',
            password: '',
            role: 'Employee' // Default role
        };
        
        vm.error = '';
        vm.registerError = '';  
        vm.loading = false;
        vm.showRegister = false;
        vm.showPassword = false; // Toggle password visibility for login
        vm.showRegPassword = false; // Toggle password visibility for register
        
        // Check if user can register (Admin only)
        vm.canRegister = function() {
            return AuthService.canRegisterEmployee();
        };
        
        vm.submit = function() {
            vm.error = '';
            vm.loading = true;
            
            AuthService.login(vm.credentials).then(function(response) {
                vm.loading = false;
                NotificationService.show('Login successful!', 'success');
                
                // Check if user is Super Admin
                var user = AuthService.getUser();
                var redirectPath = '/controls'; // Default path
                
                if (user && user.isSuperAdmin) {
                    redirectPath = '/super-admin'; // Super Admin dashboard
                }
                
                // Redirect using routing
                $timeout(function() {
                    $location.path(redirectPath);
                }, 100);
            }).catch(function(error) {
                vm.loading = false;
                if (error.data && error.data.message) {
                    vm.error = error.data.message;
                } else {
                    vm.error = 'Login failed. Please check your credentials.';
                }
            });
        };
        
        vm.register = function() {
            vm.registerError = '';
            vm.loading = true;
            
            AuthService.register(vm.registerData).then(function(response) {
                vm.loading = false;
                NotificationService.show('Registration successful!', 'success');
                // Redirect to controls page using routing
                $timeout(function() {
                    $location.path('/controls');
                }, 100);
            }).catch(function(error) {
                vm.loading = false;
                if (error.data && error.data.message) {
                    vm.registerError = error.data.message;
                } else {
                    vm.registerError = 'Registration failed. Please try again.';
                }
            });
        };
    },
    controllerAs: 'login'
});


 