app.component('accessDenied', {
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg border-0">
                    <div class="card-body text-center p-5">
                        <div class="mb-4">
                            <i class="fas fa-lock fa-4x text-warning"></i>
                        </div>
                        <h2 class="mb-3 text-danger">Access Denied</h2>
                        <p class="lead mb-4">You do not have access to this feature.</p>
                        
                        <div class="alert alert-warning" role="alert">
                            <h5 class="alert-heading">
                                <i class="fas fa-info-circle me-2"></i>Allowed Roles:
                            </h5>
                            <div class="mt-3">
                                <span class="badge bg-primary me-2 mb-2" ng-repeat="role in $ctrl.allowedRoles">
                                    {{role}}
                                </span>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <p class="text-muted mb-3">Your role: <strong>{{$ctrl.currentRole}}</strong></p>
                        </div>
                        
                        <div class="mt-4">
                            <button class="btn btn-primary btn-lg" ng-click="$ctrl.goBack()">
                                <i class="fas fa-arrow-left me-2"></i>Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    controller: function(AuthService, $location, $rootScope, $routeParams) {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            var user = AuthService.getUser();
            ctrl.currentRole = user ? user.role : 'Unknown';
            
            
            var section = $routeParams.section || '';
            ctrl.allowedRoles = ctrl.getAllowedRolesForSection(section);
 
        };
        
        ctrl.getAllowedRolesForSection = function(section) {
            // Allowed roles per section 
            var roleMap = {
                // Add Controls & Assign Owner
                'addControlType': ['Admin', 'Team Lead', 'Software Architecture', 'Software Architecturer'],
                // Control List (everyone can view)
                'controlTypes': ['Admin', 'Software Architecture', 'Software Architecturer', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer'],
                // Add Employee (Admin only)
                'newEmployee': ['Admin', 'Project Manager'],
                // Employees List (everyone can view)
                'employees': ['Admin', 'Software Architecture', 'Software Architecturer', 'Team Lead', 'Developer', 'QA Engineer', 'Intern Developer', 'Intern QA Engineer']
            };
            
            // Default: show Admin + Project Manager as allowed roles
            return roleMap[section] || ['Admin', 'Project Manager'];
            
        };
        
        ctrl.goBack = function() {
            $location.path('/controls');
        };
    }
});

