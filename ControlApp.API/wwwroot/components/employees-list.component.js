app.component('employeesList', {
    template: `
    <div class="card shadow-lg border-0" style="border-radius: 24px; overflow: visible; height: 75vh; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); display: flex; flex-direction: column; animation: fadeIn 0.6s ease-out;">
        <!-- Card Header with Gradient -->
        <div class="card-header border-0 shadow-sm" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 1.5rem 2rem; border-radius: 24px 24px 0 0; overflow: visible; z-index: 100;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div class="d-flex align-items-center">
                    <div class="header-icon-circle me-3" style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                        <i class="fas fa-users text-white fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-0 fw-bold text-white">Personnel Management</h4>
                        <p class="text-white-50 mb-0 small mt-1">Directory of active squads and organizational roles</p>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="search-box-glass shadow-sm rounded-pill p-1 bg-white border d-flex align-items-center px-3" style="width: 280px; height: 40px;">
                        <i class="fas fa-search text-muted me-2 small"></i>
                        <input type="text" class="form-control border-0 shadow-none bg-transparent small p-0" placeholder="Find personnel..." ng-model="$ctrl.searchText">
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="card-body p-0 d-flex flex-column" style="min-height: 0; background: #f8fafc; border-radius: 0 0 24px 24px; overflow: hidden;">
            <div class="table-responsive flex-grow-1" style="overflow-y: auto;">
                <table class="table align-middle mb-0" style="border-collapse: separate; border-spacing: 0 12px; padding: 0 1.5rem;">
                    <thead class="sticky-top shadow-sm" style="background: #f1f5f9; z-index: 10;">
                        <tr>
                            <th class="ps-4 py-3 border-0 text-secondary small fw-bold text-uppercase ls-1" style="width: 25%">Personnel</th>
                            <th class="py-3 border-0 text-secondary small fw-bold text-uppercase ls-1" style="width: 20%">Secure Channel</th>
                            <th class="py-3 border-0 text-secondary small fw-bold text-uppercase ls-1" style="width: 15%">Deployment Role</th>
                            <th class="py-3 border-0 text-secondary small fw-bold text-uppercase ls-1" style="width: 15%">Team</th>
                            <th class="py-3 border-0 text-secondary small fw-bold text-uppercase ls-1 text-center" style="width: 15%">Active Units</th>
                            <th class="pe-4 py-3 border-0 text-secondary small fw-bold text-uppercase ls-1 text-end" style="width: 10%" ng-if="$ctrl.canEditEmployee()">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="emp in $ctrl.getFilteredEmployees()" class="employee-row-glass transition-all shadow-sm rounded-4" style="background: #ffffff;">
                            <!-- Standard View -->
                            <td class="ps-4 py-3 border-0" ng-if="!emp.editing" style="border-radius: 12px 0 0 12px; border-left: 4px solid #6366f1;">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-glass me-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white fw-bold" 
                                         style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); flex-shrink: 0;">
                                        {{emp.employeeName.charAt(0)}}
                                    </div>
                                    <div>
                                        <div class="fw-bold text-dark">{{emp.employeeName}}</div>
                                        <div class="text-muted x-small text-uppercase fw-bold ls-1 mt-1">ID: #{{emp.id}}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3 border-0 text-secondary font-monospace" ng-if="!emp.editing" style="font-size: 0.9rem;">
                                {{emp.email || 'N/A'}}
                            </td>
                            <td class="py-3 border-0" ng-if="!emp.editing">
                                <span class="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-2 fw-bold border border-indigo-subtle">
                                    <i class="fas fa-shield-halved me-2 small"></i>{{emp.role}}
                                </span>
                            </td>
                            <td class="py-3 border-0" ng-if="!emp.editing">
                                <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold border border-primary-subtle" ng-if="emp.teamName">
                                    <i class="fas fa-users me-2 small"></i>{{emp.teamName}}
                                </span>
                                <span class="text-muted small" ng-if="!emp.teamName">Not Assigned</span>
                            </td>
                            <td class="py-3 border-0 text-center" ng-if="!emp.editing">
                                <span class="badge bg-light text-dark rounded-pill px-3 py-2 fw-bold border shadow-sm">
                                    {{$ctrl.getControlsCount(emp.id)}} Initiatives
                                </span>
                            </td>
                            <td class="pe-4 py-3 border-0 text-end" ng-if="!emp.editing && $ctrl.canEditEmployee()" style="border-radius: 0 12px 12px 0;">
                                <div class="btn-group shadow-sm rounded-pill overflow-hidden bg-white border">
                                    <button class="btn btn-white btn-sm px-3 border-0 transition-all hover-bg-indigo" ng-click="$ctrl.startEdit(emp)" title="Reconfigure">
                                        <i class="fas fa-user-gear text-indigo"></i>
                                    </button>
                                    <button class="btn btn-white btn-sm px-3 border-0 transition-all hover-bg-danger" ng-if="$ctrl.canDeleteEmployee()" ng-click="$ctrl.deleteEmployee(emp)" ng-disabled="emp.deleting" title="Decommission">
                                        <i class="fas fa-trash-alt text-danger" ng-if="!emp.deleting"></i>
                                        <i class="fas fa-spinner fa-spin text-danger" ng-if="emp.deleting"></i>
                                    </button>
                                </div>
                            </td>

                            <!-- Edit Container -->
                            <td colspan="6" ng-if="emp.editing" class="p-0 border-0" style="border-radius: 12px;">
                                <div class="p-4 bg-white border-indigo border border-2 rounded-4 shadow-lg m-2">
                                    <h6 class="fw-bold text-indigo mb-4 d-flex align-items-center">
                                        <i class="fas fa-user-pen me-2"></i>Personnel Reconfiguration
                                    </h6>
                                    <form ng-submit="$ctrl.saveEmployee(emp)">
                                        <div class="row g-4 mb-4">
                                            <div class="col-md-6">
                                                <label class="form-label small fw-bold text-uppercase text-secondary ls-1">Full Legal Name</label>
                                                <div class="input-group shadow-sm rounded-3 overflow-hidden border">
                                                    <span class="input-group-text bg-light border-0"><i class="fas fa-id-card text-muted"></i></span>
                                                    <input type="text" class="form-control border-0" ng-model="emp.editName" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label small fw-bold text-uppercase text-secondary ls-1">Security Assignment</label>
                                                <div class="input-group shadow-sm rounded-3 overflow-hidden border">
                                                    <span class="input-group-text bg-light border-0"><i class="fas fa-briefcase text-muted"></i></span>
                                                    <select class="form-select border-0" 
                                                            ng-model="emp.editSelectedType" 
                                                            ng-options="type as (type.description || 'No Description') for type in $ctrl.getUniqueDescriptions()"
                                                            ng-change="$ctrl.onEditDescriptionChange(emp)"
                                                            required>
                                                        <option value="">-- Select Deployment --</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6" ng-if="$ctrl.canAssignTeam()">
                                                <label class="form-label small fw-bold text-uppercase text-secondary ls-1">Team Assignment</label>
                                                <div class="input-group shadow-sm rounded-3 overflow-hidden border">
                                                    <span class="input-group-text bg-light border-0"><i class="fas fa-users text-muted"></i></span>
                                                    <select class="form-select border-0" 
                                                            ng-model="emp.editTeamId">
                                                        <option value="">-- Select Team --</option>
                                                        <option ng-repeat="team in $ctrl.teams" value="{{team.teamId}}">{{team.teamName}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex gap-3 justify-content-end">
                                            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" ng-click="$ctrl.cancelEdit(emp)" ng-disabled="emp.saving">
                                                Abort
                                            </button>
                                            <button type="submit" class="btn btn-indigo rounded-pill px-4 fw-bold shadow-sm" ng-disabled="$ctrl.isSaving || emp.saving">
                                                <span ng-if="!emp.saving">Commit Changes</span>
                                                <span ng-if="emp.saving"><i class="fas fa-sync fa-spin me-2"></i>Synchronizing...</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <tr ng-if="$ctrl.getFilteredEmployees().length === 0">
                            <td colspan="6" class="text-center py-5">
                                <div class="text-muted">
                                    <i class="fas fa-user-slash fs-huge d-block mb-3 opacity-25"></i>
                                    <p class="fs-5 fw-bold mb-1">Personnel Not Found</p>
                                    <p class="small">Try adjusting your tracking parameters</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    controller: function (ApiService, NotificationService, $rootScope, AuthService, $timeout) {
        var ctrl = this;
        ctrl.store = ApiService.data;
        ctrl.searchText = '';
        ctrl.isSaving = false;
        ctrl.teams = [];

        ApiService.init();
        
        // Load teams for Super Admin / Admin
        if (AuthService.isSuperAdmin() || AuthService.isAdmin()) {
            ApiService.getTeams().then(function(response) {
                ctrl.teams = response.data;
            });
        }

        var sectionListener = null;

        ctrl.isAdmin = function () {
            return AuthService.isAdmin();
        };
        
        ctrl.canAssignTeam = function() {
            return AuthService.isSuperAdmin() || AuthService.isAdmin();
        };

        ctrl.canEditEmployee = function () {
            return AuthService.canEditEmployee();
        };

        ctrl.canDeleteEmployee = function () {
            return AuthService.canDeleteEmployee();
        };

        var controlsUpdateListener = null;

        ctrl.$onInit = function () {
            // Get current team ID
            var currentTeamId = AuthService.getTeamId();
            var user = AuthService.getUser();
            
            console.log('Employees list $onInit - currentTeamId:', currentTeamId, 'User:', user ? user.username : 'null', 'IsSuperAdmin:', user ? user.isSuperAdmin : false);
            console.log('User teams:', user && user.teams ? user.teams.length : 0);
            
            // Load employees - backend will handle teamId from JWT if null
            ApiService.loadEmployees(currentTeamId).then(function(employees) {
                console.log('Employees loaded successfully:', employees ? employees.length : 0);
            }).catch(function(error) {
                console.error('Error loading employees:', error);
            });

            sectionListener = $rootScope.$on('controlsSectionChanged', function (event, section) {
                if (section === 'employees') {
                    var teamId = AuthService.getTeamId();
                    var user = AuthService.getUser();
                    
                    // If teamId is null but user has teams, use first team
                    if (!teamId && user && user.teams && user.teams.length > 0) {
                        teamId = user.teams[0].teamId;
                    }
                    
                    ApiService.loadEmployees(teamId).then(function () {
                        return ApiService.loadAllControls(teamId);
                    });
                }
            });

            // Listen for controls updates to refresh employee list
            controlsUpdateListener = $rootScope.$on('controlsUpdated', function () {
                var teamId = AuthService.getTeamId();
                var user = AuthService.getUser();
                
                // If teamId is null but user has teams, use first team
                if (!teamId && user && user.teams && user.teams.length > 0) {
                    teamId = user.teams[0].teamId;
                }
                
                ApiService.loadAllControls(teamId);
            });

            // Listen for employees updates (when new employee is added)
            var employeesUpdateListener = $rootScope.$on('employeesUpdated', function (event, data) {
                var user = AuthService.getUser();
                var currentTeamId = AuthService.getTeamId();
                
                // If data contains teamId, that's the team the employee was added to
                // Otherwise, use current team
                var employeeTeamId = data && data.teamId ? data.teamId : null;
                var reloadTeamId = employeeTeamId || currentTeamId;
                
                // If teamId is null but user has teams, use first team
                if (!reloadTeamId && user && user.teams && user.teams.length > 0) {
                    reloadTeamId = user.teams[0].teamId;
                }
                
                console.log('Employees updated event received:');
                console.log('  - Employee added to team:', employeeTeamId);
                console.log('  - Current team:', currentTeamId);
                console.log('  - Reloading for team:', reloadTeamId);
                
                // Reload employees for the team the employee was added to
                // This ensures the new employee appears when viewing that team
                ApiService.loadEmployees(reloadTeamId).then(function (employees) {
                    console.log('Employees reloaded:', employees ? employees.length : 0, 'for team:', reloadTeamId);
                    return ApiService.loadAllControls(reloadTeamId);
                }).then(function() {
                    console.log('Controls reloaded for team:', reloadTeamId);
                }).catch(function(error) {
                    console.error('Error reloading data after employee update:', error);
                });
            });

            // Listen for team changes
            var teamListener = $rootScope.$on('teamChanged', function(event, data) {
                console.log('═══════════════════════════════════════════════════════');
                console.log('🔔 teamChanged event received in employees-list component');
                console.log('Event data:', data);
                
                var teamId = data ? data.teamId : null;
                
                // Ensure teamId is properly parsed (handle string/number mismatch)
                if (teamId !== null && teamId !== undefined) {
                    teamId = parseInt(teamId);
                }
                
                console.log('Team changed in employees list, reloading for team:', teamId);
                console.log('Team change data:', data);
                
                // Reload employees and controls for the new team
                console.log('Starting employees list reload for team:', teamId);
                
                // Clear existing employees immediately to show loading state
                ctrl.store = ApiService.data;
                ctrl.store.employees = [];
                
                ApiService.loadEmployees(teamId).then(function(employees) {
                    console.log('✓ Employees reloaded for team:', teamId, 'Count:', employees ? employees.length : 0);
                    
                    // Log employee team distribution for debugging
                    if (employees && employees.length > 0) {
                        var teamDistribution = {};
                        employees.forEach(function(emp) {
                            var empTeamId = emp.teamId || 'null';
                            teamDistribution[empTeamId] = (teamDistribution[empTeamId] || 0) + 1;
                        });
                        console.log('Employee team distribution after reload:', teamDistribution);
                    } else if (teamId) {
                        console.warn('⚠ No employees found for team:', teamId);
                        console.warn('This might indicate:');
                        console.warn('  1. No employees exist in database for teamId:', teamId);
                        console.warn('  2. Employees exist but TeamId is not set correctly');
                        console.warn('  3. Backend filtering issue');
                    }
                    
                    return ApiService.loadAllControls(teamId);
                }).then(function(controls) {
                    console.log('✓ Controls reloaded for team:', teamId, 'Count:', controls ? controls.length : 0);
                    
                    // Update store reference - CRITICAL: Must update after API calls complete
                    ctrl.store = ApiService.data;
                    console.log('Store updated - employees count:', ctrl.store.employees ? ctrl.store.employees.length : 0);
                    
                    // Force view update using $timeout - multiple timeouts to ensure view updates
                    $timeout(function() {
                        // Update store again to ensure it's fresh
                        ctrl.store = ApiService.data;
                        console.log('First view update - employees count:', ctrl.store.employees ? ctrl.store.employees.length : 0);
                        
                        // Trigger digest cycle
                        if (!$scope.$$phase && !$rootScope.$$phase) {
                            $scope.$apply();
                        }
                        
                        // Second update to be sure
                        $timeout(function() {
                            ctrl.store = ApiService.data;
                            console.log('Second view update - employees count:', ctrl.store.employees ? ctrl.store.employees.length : 0);
                            console.log('View update triggered for employees list');
                            
                            if (!$scope.$$phase && !$rootScope.$$phase) {
                                $scope.$apply();
                            }
                        }, 100);
                    }, 0);
                }).catch(function(error) {
                    console.error('❌ Error reloading data after team change:', error);
                    console.error('Error details:', error.data || error.message || error);
                    console.error('Full error:', error);
                });
                
                console.log('═══════════════════════════════════════════════════════');
            });
            
            // Store listeners for cleanup
            ctrl.teamListener = teamListener;
            ctrl.employeesUpdateListener = employeesUpdateListener;
        };

        ctrl.$onDestroy = function () {
            if (sectionListener) {
                sectionListener();
            }
            if (controlsUpdateListener) {
                controlsUpdateListener();
            }
            if (ctrl.teamListener) {
                ctrl.teamListener();
            }
            if (ctrl.employeesUpdateListener) {
                ctrl.employeesUpdateListener();
            }
        };

        ctrl.getFilteredEmployees = function () {
            // IMPORTANT: Always get fresh data from ApiService to ensure we have latest employees
            ctrl.store = ApiService.data;
            
            // Log store state immediately
            console.log('═══════════════════════════════════════════════════════');
            console.log('getFilteredEmployees called');
            console.log('Store exists:', !!ctrl.store);
            console.log('Store.employees exists:', !!(ctrl.store && ctrl.store.employees));
            console.log('Store.employees length:', ctrl.store && ctrl.store.employees ? ctrl.store.employees.length : 'N/A');
            
            if (!ctrl.store || !ctrl.store.employees) {
                console.log('❌ getFilteredEmployees: No employees in store');
                console.log('Store:', ctrl.store);
                console.log('Store.employees:', ctrl.store ? ctrl.store.employees : 'store is null');
                console.log('ApiService.data:', ApiService.data);
                console.log('ApiService.data.employees:', ApiService.data ? ApiService.data.employees : 'N/A');
                console.log('ApiService.data.employees length:', ApiService.data && ApiService.data.employees ? ApiService.data.employees.length : 'N/A');
                console.log('═══════════════════════════════════════════════════════');
                return [];
            }
            
            // Get current team ID to filter employees
            // IMPORTANT: Always get fresh teamId from AuthService (reads from localStorage)
            var currentTeamId = AuthService.getTeamId();
            var user = AuthService.getUser();
            
            // If currentTeamId is null but user has teams, use first team
            if (!currentTeamId && user && user.teams && user.teams.length > 0) {
                currentTeamId = user.teams[0].teamId;
            }
            
            // Log for debugging
            console.log('═══════════════════════════════════════════════════════');
            console.log('getFilteredEmployees called');
            console.log('  - currentTeamId from AuthService:', currentTeamId);
            console.log('  - User:', user ? user.username : 'null');
            console.log('  - User teams:', user && user.teams ? user.teams.map(function(t) { return t.teamName + ' (ID: ' + t.teamId + ')'; }).join(', ') : 'none');
            
            // Ensure currentTeamId is properly parsed (handle string/number mismatch)
            if (currentTeamId !== null && currentTeamId !== undefined) {
                currentTeamId = parseInt(currentTeamId);
            }
            
            console.log('  - Total employees in store:', ctrl.store.employees.length);
            
            // Log all employee teamIds for debugging
            if (ctrl.store.employees && ctrl.store.employees.length > 0) {
                var allTeamIds = ctrl.store.employees.map(function(emp) { return emp.teamId; }).filter(function(id) { return id != null; });
                var uniqueTeamIds = [...new Set(allTeamIds)];
                console.log('  - All employee teamIds in store:', uniqueTeamIds);
                
                // Log first few employees for debugging
                console.log('  - First 5 employees:');
                ctrl.store.employees.slice(0, 5).forEach(function(emp, idx) {
                    console.log('    [' + idx + ']', emp.employeeName, '- teamId:', emp.teamId, '(type:', typeof emp.teamId, ')');
                });
            }
            
            // Filter by current team first (if team is selected)
            var filtered = ctrl.store.employees;
            console.log('Starting filter - Total employees in store:', filtered.length);
            
            if (currentTeamId !== null && currentTeamId !== undefined) {
                // Convert both to numbers for comparison to handle type mismatches
                var teamIdNum = parseInt(currentTeamId);
                var beforeFilter = filtered.length;
                var filteredOutCount = 0;
                
                console.log('Filtering by teamId:', teamIdNum, '(type:', typeof teamIdNum, ')');
                
                filtered = filtered.filter(function (emp) {
                    // If employee has no teamId, skip them (they should be assigned to a team)
                    if (!emp.teamId) {
                        filteredOutCount++;
                        console.log('Employee filtered out (no teamId):', emp.employeeName);
                        return false;
                    }
                    
                    var empTeamId = parseInt(emp.teamId);
                    var matches = empTeamId === teamIdNum;
                    
                    if (!matches) {
                        filteredOutCount++;
                        console.log('Employee filtered out:', emp.employeeName, 
                            'emp.teamId:', emp.teamId, '(type:', typeof emp.teamId, ', parsed:', empTeamId, ')',
                            'currentTeamId:', currentTeamId, '(parsed:', teamIdNum, ')',
                            'Match:', matches);
                    } else {
                        console.log('✓ Employee matches:', emp.employeeName, 'teamId:', emp.teamId);
                    }
                    
                    return matches;
                });
                
                console.log('═══════════════════════════════════════════════════════');
                console.log('Team filter results:');
                console.log('  - Before filter:', beforeFilter);
                console.log('  - After filter:', filtered.length);
                console.log('  - Filtered out:', filteredOutCount);
                console.log('  - currentTeamId:', currentTeamId, '(parsed:', teamIdNum, ')');
                console.log('═══════════════════════════════════════════════════════');
            } else {
                console.log('No team filter applied (currentTeamId is null/undefined) - showing all employees');
            }
            
            // Then apply search filter if provided
            if (ctrl.searchText) {
                var term = ctrl.searchText.toLowerCase();
                filtered = filtered.filter(function (emp) {
                    return emp.employeeName && emp.employeeName.toLowerCase().includes(term);
                });
                console.log('After search filter:', filtered.length, 'employees');
            }

            console.log('═══════════════════════════════════════════════════════');
            console.log('getFilteredEmployees FINAL RESULT:');
            console.log('  - Returning:', filtered.length, 'employees');
            if (filtered.length > 0) {
                console.log('  - Employees being returned:');
                filtered.forEach(function(emp, idx) {
                    console.log('    [' + idx + ']', emp.employeeName, '- teamId:', emp.teamId);
                });
            } else {
                console.warn('  ⚠ WARNING: No employees returned!');
                console.warn('  - This might indicate:');
                console.warn('    1. No employees in store for current team');
                console.warn('    2. TeamId mismatch between employees and currentTeamId');
                console.warn('    3. Employees not loaded from API');
            }
            console.log('═══════════════════════════════════════════════════════');
            return filtered;
        };

        ctrl.getTypeName = function (typeId) {
            if (!typeId || !ctrl.store.controlTypes) return '-';
            var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
            return type ? type.typeName : '-';
        };

        ctrl.getDescription = function (typeId) {
            if (!typeId || !ctrl.store.controlTypes) return null;
            var type = ctrl.store.controlTypes.find(t => t.controlTypeId == typeId);
            return type ? type.description : null;
        };

        ctrl.getControlsCount = function (employeeId) {
            if (!ctrl.store.allControls) return 0;
            return ctrl.store.allControls.filter(c => c.employeeId == employeeId).length;
        };

        ctrl.getControlDescription = function (employeeId) {
            if (!ctrl.store.allControls || !employeeId) return null;
            // Get the first control for this employee (usually there's one per employee)
            var control = ctrl.store.allControls.find(c => c.employeeId == employeeId);
            return control && control.description ? control.description : null;
        };

        ctrl.getUniqueDescriptions = function () {
            if (!ctrl.store.controlTypes || ctrl.store.controlTypes.length === 0) {
                return [];
            }

            var descriptionMap = {};
            ctrl.store.controlTypes.forEach(function (type) {
                if (type.description && type.description.trim() !== '') {
                    if (!descriptionMap[type.description]) {
                        descriptionMap[type.description] = type;
                    }
                }
            });

            return Object.keys(descriptionMap).map(function (desc) {
                return descriptionMap[desc];
            }).sort(function (a, b) {
                return (a.description || '').localeCompare(b.description || '');
            });
        };

        ctrl.startEdit = function (emp) {
            emp.editing = true;
            emp.editName = emp.employeeName;
            emp.editTeamId = emp.teamId ? emp.teamId.toString() : '';

            var currentType = ctrl.store.controlTypes.find(t => t.controlTypeId == emp.typeId);
            if (currentType) {
                emp.editSelectedType = currentType;
                emp.editTypeName = currentType.typeName;
            } else {
                emp.editSelectedType = null;
                emp.editTypeName = '';
            }
        };

        ctrl.onEditDescriptionChange = function (emp) {
            if (!emp.editSelectedType) {
                emp.editTypeName = '';
                return;
            }
            emp.editTypeName = emp.editSelectedType.typeName;
        };

        ctrl.saveEmployee = function (emp) {
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
                description: emp.editSelectedType.description || "Updated Employee",
                teamId: emp.editTeamId ? parseInt(emp.editTeamId) : null
            };

            // NOTE: Service returns the updated object directly now (no .data)
            var currentTeamId = AuthService.getTeamId();
            var user = AuthService.getUser();
            
            // If currentTeamId is null but user has teams, use first team
            if (!currentTeamId && user && user.teams && user.teams.length > 0) {
                currentTeamId = user.teams[0].teamId;
            }
            
            ApiService.updateEmployee(emp.id, updateData).then(function (updatedEmployee) {
                emp.employeeName = updatedEmployee ? updatedEmployee.employeeName : emp.editName;
                emp.typeId = emp.editSelectedType.controlTypeId;
                emp.teamId = updateData.teamId;
                emp.teamName = updatedEmployee ? updatedEmployee.teamName : null;
                emp.editing = false;
                emp.saving = false;

                // Reload employees for current team
                ApiService.loadEmployees(currentTeamId).then(function () {
                    return ApiService.loadAllControls(currentTeamId);
                });

                NotificationService.show('Employee updated successfully', 'success');
            }).catch(function (error) {
                emp.saving = false;
                console.error('Error updating employee:', error);
                var errorMsg = 'Error updating employee';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : error.data.message;
                }
                NotificationService.show(errorMsg, 'error');
            }).finally(function () {
                ctrl.isSaving = false;
            });
        };

        ctrl.cancelEdit = function (emp) {
            emp.editing = false;
            delete emp.editName;
            delete emp.editSelectedType;
            delete emp.editTypeName;
        };

        ctrl.deleteEmployee = function (emp) {
            if (!confirm('Are you sure you want to delete ' + emp.employeeName + '?\n\nThis will also delete all controls associated with this employee.')) {
                return;
            }

            emp.deleting = true;
            var currentTeamId = AuthService.getTeamId();
            var user = AuthService.getUser();
            
            // If currentTeamId is null but user has teams, use first team
            if (!currentTeamId && user && user.teams && user.teams.length > 0) {
                currentTeamId = user.teams[0].teamId;
            }
            
            ApiService.deleteEmployee(emp.id).then(function () {
                var index = ctrl.store.employees.findIndex(e => e.id === emp.id);
                if (index > -1) {
                    ctrl.store.employees.splice(index, 1);
                }

                // Reload employees for current team
                ApiService.loadEmployees(currentTeamId).then(function () {
                    return ApiService.loadAllControls(currentTeamId);
                }).then(function () {
                    NotificationService.show('Employee deleted successfully', 'success');
                });
            }).catch(function (error) {
                emp.deleting = false;
                console.error('Error deleting employee:', error);
                var errorMsg = 'Error deleting employee';
                if (error && error.data) {
                    errorMsg = typeof error.data === 'string' ? error.data : (error.data.message || 'Error: ' + error.data.error);
                } else if (error && error.status) {
                    errorMsg = 'Server error (Status: ' + error.status + ')';
                }
                NotificationService.show(errorMsg, 'error');
            });
        };
    }
});