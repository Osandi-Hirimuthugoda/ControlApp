app.component('profileComponent', {
    template: `
    <div class="card shadow-sm" style="max-width: 600px; margin: 0 auto;">
        <div class="card-header" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 1.25rem 1.5rem;">
            <h5 class="mb-0 fw-bold"><i class="fas fa-user-cog me-2"></i>Profile Settings</h5>
        </div>
        <div class="card-body">
            <!-- Current User Info -->
            <div class="mb-4 p-3 bg-light rounded">
                <h6 class="fw-bold mb-2"><i class="fas fa-info-circle me-2"></i>Current Account</h6>
                <p class="mb-1"><strong>Username:</strong> {{$ctrl.currentUser.username}}</p>
                <p class="mb-1"><strong>Email:</strong> {{$ctrl.currentUser.email}}</p>
                <p class="mb-1"><strong>Phone Number:</strong> {{$ctrl.currentUser.phoneNumber || 'Not set'}}</p>
                <p class="mb-0"><strong>Role:</strong> <span class="badge bg-primary">{{$ctrl.currentUser.role}}</span></p>
            </div>

            <!-- Update Email Section -->
            <div class="mb-4">
                <h6 class="fw-bold mb-3"><i class="fas fa-envelope me-2"></i>Change Email</h6>
                <form ng-submit="$ctrl.updateEmail()">
                    <div class="mb-3">
                        <label class="form-label fw-bold">New Email Address:</label>
                        <input type="email" 
                               class="form-control" 
                               ng-model="$ctrl.emailForm.newEmail" 
                               placeholder="Enter new email"
                               ng-class="{'is-invalid': $ctrl.emailForm.newEmail && !$ctrl.isValidEmail($ctrl.emailForm.newEmail)}"
                               required>
                        <div class="invalid-feedback" ng-if="$ctrl.emailForm.newEmail && !$ctrl.isValidEmail($ctrl.emailForm.newEmail)">
                            Please enter a valid email address
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Current Password:</label>
                        <div class="position-relative">
                            <input ng-attr-type="{{$ctrl.showEmailPassword ? 'text' : 'password'}}" 
                                   class="form-control" 
                                   ng-model="$ctrl.emailForm.currentPassword" 
                                   placeholder="Enter current password to confirm"
                                   required
                                   style="padding-right: 40px;">
                            <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                  style="cursor: pointer; user-select: none;"
                                  ng-click="$ctrl.showEmailPassword = !$ctrl.showEmailPassword">
                                <i class="fas" 
                                   ng-class="$ctrl.showEmailPassword ? 'fa-eye-slash' : 'fa-eye'"
                                   style="color: #6c757d;"></i>
                            </span>
                        </div>
                    </div>
                    <button type="submit" 
                            class="btn btn-primary w-100" 
                            ng-disabled="$ctrl.isUpdatingEmail || !$ctrl.emailForm.newEmail || !$ctrl.emailForm.currentPassword">
                        <span ng-if="!$ctrl.isUpdatingEmail">
                            <i class="fas fa-save me-2"></i>Update Email
                        </span>
                        <span ng-if="$ctrl.isUpdatingEmail">
                            <i class="fas fa-spinner fa-spin me-2"></i>Updating...
                        </span>
                    </button>
                </form>
            </div>

            <hr>

            <!-- Update Phone Number Section -->
            <div class="mb-4">
                <h6 class="fw-bold mb-3"><i class="fas fa-phone me-2"></i>Change Phone Number</h6>
                <form ng-submit="$ctrl.updatePhoneNumber()">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Phone Number:</label>
                        <input type="tel" 
                               class="form-control" 
                               ng-model="$ctrl.phoneForm.phoneNumber" 
                               placeholder="Enter phone number (e.g., +94 77 123 4567)"
                               maxlength="20"
                               required>
                        <small class="text-muted">Enter phone number with country code (max 20 characters)</small>
                    </div>
                    <button type="submit" 
                            class="btn btn-primary w-100" 
                            ng-disabled="$ctrl.isUpdatingPhone || !$ctrl.phoneForm.phoneNumber">
                        <span ng-if="!$ctrl.isUpdatingPhone">
                            <i class="fas fa-save me-2"></i>Update Phone Number
                        </span>
                        <span ng-if="$ctrl.isUpdatingPhone">
                            <i class="fas fa-spinner fa-spin me-2"></i>Updating...
                        </span>
                    </button>
                </form>
            </div>

            <hr>

            <!-- Update Password Section -->
            <div class="mb-4">
                <h6 class="fw-bold mb-3"><i class="fas fa-lock me-2"></i>Change Password</h6>
                <form ng-submit="$ctrl.updatePassword()">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Current Password:</label>
                        <div class="position-relative">
                            <input ng-attr-type="{{$ctrl.showCurrentPassword ? 'text' : 'password'}}" 
                                   class="form-control" 
                                   ng-model="$ctrl.passwordForm.currentPassword" 
                                   placeholder="Enter current password"
                                   required
                                   style="padding-right: 40px;">
                            <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                  style="cursor: pointer; user-select: none;"
                                  ng-click="$ctrl.showCurrentPassword = !$ctrl.showCurrentPassword">
                                <i class="fas" 
                                   ng-class="$ctrl.showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"
                                   style="color: #6c757d;"></i>
                            </span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">New Password:</label>
                        <div class="position-relative">
                            <input ng-attr-type="{{$ctrl.showNewPassword ? 'text' : 'password'}}" 
                                   class="form-control" 
                                   ng-model="$ctrl.passwordForm.newPassword" 
                                   placeholder="Enter new password (min 6 characters)"
                                   ng-class="{'is-invalid': $ctrl.passwordForm.newPassword && $ctrl.passwordForm.newPassword.length < 6}"
                                   required
                                   style="padding-right: 40px;">
                            <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                  style="cursor: pointer; user-select: none;"
                                  ng-click="$ctrl.showNewPassword = !$ctrl.showNewPassword">
                                <i class="fas" 
                                   ng-class="$ctrl.showNewPassword ? 'fa-eye-slash' : 'fa-eye'"
                                   style="color: #6c757d;"></i>
                            </span>
                        </div>
                        <div class="invalid-feedback" ng-if="$ctrl.passwordForm.newPassword && $ctrl.passwordForm.newPassword.length < 6">
                            Password must be at least 6 characters
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Confirm New Password:</label>
                        <div class="position-relative">
                            <input ng-attr-type="{{$ctrl.showConfirmPassword ? 'text' : 'password'}}" 
                                   class="form-control" 
                                   ng-model="$ctrl.passwordForm.confirmPassword" 
                                   placeholder="Confirm new password"
                                   ng-class="{'is-invalid': $ctrl.passwordForm.confirmPassword && $ctrl.passwordForm.newPassword !== $ctrl.passwordForm.confirmPassword}"
                                   required
                                   style="padding-right: 40px;">
                            <span class="position-absolute end-0 top-50 translate-middle-y pe-3" 
                                  style="cursor: pointer; user-select: none;"
                                  ng-click="$ctrl.showConfirmPassword = !$ctrl.showConfirmPassword">
                                <i class="fas" 
                                   ng-class="$ctrl.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                                   style="color: #6c757d;"></i>
                            </span>
                        </div>
                        <div class="invalid-feedback" ng-if="$ctrl.passwordForm.confirmPassword && $ctrl.passwordForm.newPassword !== $ctrl.passwordForm.confirmPassword">
                            Passwords do not match
                        </div>
                    </div>
                    <button type="submit" 
                            class="btn btn-primary w-100" 
                            ng-disabled="$ctrl.isUpdatingPassword || !$ctrl.passwordForm.currentPassword || !$ctrl.passwordForm.newPassword || !$ctrl.passwordForm.confirmPassword || $ctrl.passwordForm.newPassword !== $ctrl.passwordForm.confirmPassword">
                        <span ng-if="!$ctrl.isUpdatingPassword">
                            <i class="fas fa-key me-2"></i>Update Password
                        </span>
                        <span ng-if="$ctrl.isUpdatingPassword">
                            <i class="fas fa-spinner fa-spin me-2"></i>Updating...
                        </span>
                    </button>
                </form>
            </div>

            <!-- Back Button -->
            <div class="text-center">
                <button class="btn btn-secondary" ng-click="$ctrl.goBack()">
                    <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
            </div>
        </div>
    </div>
    `,
    controller: function(AuthService, ApiService, NotificationService, $rootScope, $location) {
        var ctrl = this;
        
        ctrl.currentUser = AuthService.getUser();
        ctrl.isUpdatingEmail = false;
        ctrl.isUpdatingPassword = false;
        ctrl.isUpdatingPhone = false;
        
        // Password visibility toggles
        ctrl.showEmailPassword = false;
        ctrl.showCurrentPassword = false;
        ctrl.showNewPassword = false;
        ctrl.showConfirmPassword = false;
        
        ctrl.emailForm = {
            newEmail: '',
            currentPassword: ''
        };
        
        ctrl.phoneForm = {
            phoneNumber: ''
        };
        
        ctrl.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        
        ctrl.$onInit = function() {
            // Load current user info
            ctrl.currentUser = AuthService.getUser();
            // Initialize phone form with current phone number if available
            if(ctrl.currentUser && ctrl.currentUser.phoneNumber) {
                ctrl.phoneForm.phoneNumber = ctrl.currentUser.phoneNumber;
            }
        };
        
        ctrl.isValidEmail = function(email) {
            if(!email) return false;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        ctrl.updateEmail = function() {
            if (!ctrl.isValidEmail(ctrl.emailForm.newEmail)) {
                NotificationService.show('Please enter a valid email address', 'error');
                return;
            }
            
            if (ctrl.emailForm.newEmail.toLowerCase() === ctrl.currentUser.email.toLowerCase()) {
                NotificationService.show('New email must be different from current email', 'error');
                return;
            }
            
            ctrl.isUpdatingEmail = true;
            
            ApiService.updateEmail({
                newEmail: ctrl.emailForm.newEmail.trim().toLowerCase(),
                currentPassword: ctrl.emailForm.currentPassword
            }).then(function() {
                NotificationService.show('Email updated successfully! Please login again with your new email.', 'success');
                
                // Update local user data
                ctrl.currentUser.email = ctrl.emailForm.newEmail.trim().toLowerCase();
                ctrl.currentUser.username = ctrl.emailForm.newEmail.trim().toLowerCase();
                
                // Clear form
                ctrl.emailForm = {
                    newEmail: '',
                    currentPassword: ''
                };
                
                // Optionally logout and ask to login again
                setTimeout(function() {
                    AuthService.logout();
                    $location.path('/login');
                }, 2000);
            }).catch(function(err) {
                console.error("Update email error:", err);
                var errorMsg = 'Failed to update email.';
                if(err && err.data && err.data.message) {
                    errorMsg = err.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() {
                ctrl.isUpdatingEmail = false;
            });
        };
        
        ctrl.updatePhoneNumber = function() {
            if (!ctrl.phoneForm.phoneNumber || ctrl.phoneForm.phoneNumber.trim() === '') {
                NotificationService.show('Please enter a phone number', 'error');
                return;
            }
            
            if (ctrl.phoneForm.phoneNumber.length > 20) {
                NotificationService.show('Phone number cannot exceed 20 characters', 'error');
                return;
            }
            
            ctrl.isUpdatingPhone = true;
            
            ApiService.updatePhoneNumber({
                phoneNumber: ctrl.phoneForm.phoneNumber.trim()
            }).then(function() {
                NotificationService.show('Phone number updated successfully!', 'success');
                
                // Update local user data
                ctrl.currentUser.phoneNumber = ctrl.phoneForm.phoneNumber.trim();
                
                
             }).catch(function(err) {
                console.error("Update phone number error:", err);
                var errorMsg = 'Failed to update phone number.';
                if(err && err.data && err.data.message) {
                    errorMsg = err.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() {
                ctrl.isUpdatingPhone = false;
            });
        };
        
        ctrl.updatePassword = function() {
            if (ctrl.passwordForm.newPassword.length < 6) {
                NotificationService.show('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (ctrl.passwordForm.newPassword !== ctrl.passwordForm.confirmPassword) {
                NotificationService.show('Passwords do not match', 'error');
                return;
            }
            
            ctrl.isUpdatingPassword = true;
            
            ApiService.updatePassword({
                currentPassword: ctrl.passwordForm.currentPassword,
                newPassword: ctrl.passwordForm.newPassword,
                confirmPassword: ctrl.passwordForm.confirmPassword
            }).then(function() {
                NotificationService.show('Password updated successfully! Please login again with your new password.', 'success');
                
                // Clear form
                ctrl.passwordForm = {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
                
                // Optionally logout and ask to login again
                setTimeout(function() {
                    AuthService.logout();
                    $location.path('/login');
                }, 2000);
            }).catch(function(err) {
                console.error("Update password error:", err);
                var errorMsg = 'Failed to update password.';
                if(err && err.data && err.data.message) {
                    errorMsg = err.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function() {
                ctrl.isUpdatingPassword = false;
            });
        };
        
        ctrl.goBack = function() {
            $location.path('/controls');
        };
    }
});

