app.service('ApiService', function($http, $q) {
    var self = this;
    var apiBaseUrl = '/api';

    // Shared Data Store
    self.data = {
        employees: [],
        allControls: [],
        controlTypes: [], 
        statuses: [],
        releases: [],
        upcomingReleases: []
    };

    //Initialization
    self.init = function() {
        console.log('ApiService.init() called');
        var p1 = self.loadControlTypes(); 
        var p2 = self.loadStatuses();
        var p3 = self.loadReleases();

        return $q.all([p1, p2, p3]).then(function(results) {
            console.log('Initial data loaded. Statuses:', self.data.statuses.length);
            return self.loadEmployees();
        }).then(function() {
            return self.loadAllControls();
        }).then(function() {
            console.log('All data initialized. Final status count:', self.data.statuses.length);
        }).catch(function(error) {
            console.error('Error during initialization:', error);
        });
    };

    // Load Data Methods
    
    self.loadEmployees = function() {
        return $http.get(apiBaseUrl + '/employees').then(function(r) {
            self.data.employees = r.data || [];
            self.data.employees.forEach(function(e) { 
                e.editing = false;
                // If you have date fields like DOB, convert them here:
                // if(e.dob) e.dob = new Date(e.dob);
            });
            return self.data.employees;
        });
    };

    // Load Control Types from API
    self.loadControlTypes = function() {
        return $http.get(apiBaseUrl + '/controltypes').then(function(r) {
            var newTypes = r.data || [];
            
            // STRICT FIX: Convert strings to Date Objects
            newTypes.forEach(function(type) {
                if(type.releaseDate) {
                    type.releaseDate = new Date(type.releaseDate);
                } else {
                    type.releaseDate = null;
                }
            });

            self.data.controlTypes = newTypes;
            console.log('Control types loaded:', self.data.controlTypes.length);
            
            if (self.data.releases && self.data.releases.length >= 0) {
                self._processReleases();
            }
            return self.data.controlTypes;
        }).catch(function(error) {
            console.error('Error loading control types:', error);
            self.data.controlTypes = [];
            return $q.when(self.data.controlTypes);
        });
    }; 
 
    self.loadStatuses = function() {
        return $http.get(apiBaseUrl + '/statuses').then(function(r) {
            var newStatuses = r.data || [];
            self.data.statuses = newStatuses;
            return self.data.statuses;
        }).catch(function(error) {
            console.error('Error loading statuses:', error);
            self.data.statuses = [];
            return $q.when(self.data.statuses);
        });
    };

    self.loadReleases = function() {
        return $http.get(apiBaseUrl + '/releases').then(function(r) {
            self.data.releases = r.data || [];
            self._processReleases(); 
        }).catch(function() {
            self.data.releases = [];
            self._processReleases();
        });
    };
 
    self.loadAllControls = function() {
        return $http.get(apiBaseUrl + '/controls').then(function(r) {
            self.data.allControls = r.data || [];
            
            self.data.allControls.forEach(function(c) {
                // IMPORTANT: Convert String to Date Object for ng-model compatibility
                if(c.releaseDate) {
                    c.releaseDate = new Date(c.releaseDate);
                    // Also make releaseDateInput a Date object
                    c.releaseDateInput = new Date(c.releaseDate);
                } else {
                    c.releaseDate = null;
                    c.releaseDateInput = null;
                }
                
                c.editing = false;
                
                if(c.typeId && self.data.controlTypes.length > 0) {
                    var t = self.data.controlTypes.find(x => x.controlTypeId == c.typeId);
                    if(t) c.typeName = t.typeName;
                }
                
                if(c.statusId && (!c.statusName || c.statusName === '') && self.data.statuses.length > 0) {
                    var s = self.data.statuses.find(x => x.id == c.statusId);
                    if(s) c.statusName = s.statusName;
                }
                
                if(c.releaseId && (!c.releaseName || c.releaseName === '') && self.data.releases.length > 0) {
                    var r = self.data.releases.find(x => x.releaseId == c.releaseId);
                    if(r) c.releaseName = r.releaseName;
                }
            });
            console.log('Controls loaded:', self.data.allControls.length);
            return self.data.allControls;
        });
    };

    // CRUD Actions 

    self.addEmployee = function(empData) {
        return $http.post(apiBaseUrl + '/employees', empData).then(function(r) {
            return self.loadEmployees().then(function() {
                self.loadAllControls(); 
                return r.data;
            });
        });
    };

    // --- FIX APPLIED HERE ---
    self.updateEmployee = function(id, data) {
        return $http.put(apiBaseUrl + '/employees/' + id, data).then(function(r) {
            // Reload employees to ensure consistent Date objects
            return self.loadEmployees().then(function(employees) {
                // Find and return the processed object
                var updatedEmp = employees.find(e => e.id == id);
                return updatedEmp;
            });
        });
    };

    self.deleteEmployee = function(id) {
        return $http.delete(apiBaseUrl + '/employees/' + id).then(function() {
            var idx = self.data.employees.findIndex(e => e.id == id);
            if (idx > -1) self.data.employees.splice(idx, 1);
            self.data.allControls = self.data.allControls.filter(c => c.employeeId != id);
        });
    };

    // --- FIX APPLIED HERE ---
    self.updateControl = function(controlId, payload) {
        console.log('Updating control:', controlId, payload);
        
        return $http.put(apiBaseUrl + '/controls/' + controlId, payload).then(function(r) {
            // Reload all controls to ensure local data is fresh and formatted (Strings -> Dates)
            return self.loadAllControls().then(function(allControls) {
                // Find the specific control we just updated from the formatted list
                var updatedItem = allControls.find(c => c.controlId == controlId);
                
                // Return this formatted item, NOT r.data
                // This prevents the [ngModel:datefmt] error because updatedItem.releaseDate is a Date Object
                return updatedItem;
            });
        }).catch(function(error) {
            console.error('Update control error:', error);
            throw error;
        });
    };

    self.addControl = function(controlData) {
        return $http.post(apiBaseUrl + '/controls', controlData).then(function(r) {
            return self.loadControlTypes().then(function() {
                return self.loadAllControls().then(function() {
                    return r.data;
                });
            });
        });
    };

    self.deleteControl = function(controlId) {
        return $http.delete(apiBaseUrl + '/controls/' + controlId);
    };

    //  Helper, Release Processing Logic
    self._processReleases = function() {
        var today = new Date();
        var currentYear = today.getFullYear();
        
        var defaultReleases = [
            { releaseId: 999991, releaseName: "Release 26.01", releaseDate: new Date(currentYear, 0, 26) },
            { releaseId: 999992, releaseName: "Release 25.12", releaseDate: new Date(currentYear, 11, 25) },
            { releaseId: 999993, releaseName: "Release 24.12", releaseDate: new Date(currentYear, 11, 24) }
        ];

        if (defaultReleases[0].releaseDate < today) defaultReleases[0].releaseDate = new Date(currentYear + 1, 0, 26);
        if (defaultReleases[1].releaseDate < today) defaultReleases[1].releaseDate = new Date(currentYear + 1, 11, 25);
        if (defaultReleases[2].releaseDate < today) defaultReleases[2].releaseDate = new Date(currentYear + 1, 11, 24);

        self.data.upcomingReleases = angular.copy(self.data.releases);
        
        defaultReleases.forEach(function(dr) {
            var drDate = new Date(dr.releaseDate);
            drDate.setHours(0, 0, 0, 0);
            var exists = self.data.upcomingReleases.some(function(r) {
                var rDate = new Date(r.releaseDate);
                rDate.setHours(0, 0, 0, 0);
                return rDate.getTime() === drDate.getTime();
            });
            if (!exists) {
                self.data.upcomingReleases.push(dr);
            }
        });

        if (self.data.controlTypes && self.data.controlTypes.length > 0) {
            self.data.controlTypes.forEach(function(controlType) {
                if (controlType.releaseDate) {
                    var ctDate = new Date(controlType.releaseDate);
                    ctDate.setHours(0, 0, 0, 0);
                    
                    var exists = self.data.upcomingReleases.some(function(r) {
                        var rDate = new Date(r.releaseDate);
                        rDate.setHours(0, 0, 0, 0);
                        return rDate.getTime() === ctDate.getTime();
                    });
                    
                    if (!exists && ctDate >= today) {
                        var day = ('0' + ctDate.getDate()).slice(-2);
                        var month = ('0' + (ctDate.getMonth() + 1)).slice(-2);
                        var releaseName = 'Release ' + day + '.' + month;
                        var controlTypeReleaseId = 999900 + controlType.controlTypeId;
                        
                        self.data.upcomingReleases.push({
                            releaseId: controlTypeReleaseId,
                            releaseName: releaseName,
                            releaseDate: ctDate
                        });
                    }
                }
            });
        }

        today.setHours(0,0,0,0);
        self.data.upcomingReleases = self.data.upcomingReleases.filter(function(r) {
            var rd = new Date(r.releaseDate);
            rd.setHours(0, 0, 0, 0);
            return rd >= today;
        }).sort(function(a, b) {
            return new Date(a.releaseDate) - new Date(b.releaseDate);
        });
    };

    // Control Type CRUD
    self.addControlType = function(controlTypeData) {
        return $http.post(apiBaseUrl + '/controltypes', controlTypeData).then(function(r) {
          return self.loadControlTypes().then(function() {
                self._processReleases();
                return r.data;
            });
        }).catch(function(error) {
            throw error;
        });
    };

    self.updateControlType = function(controlTypeId, controlTypeData) {
        return $http.put(apiBaseUrl + '/controltypes/' + controlTypeId, controlTypeData).then(function(r) {
            return self.loadControlTypes().then(function() {
                self._processReleases();
                return r.data;
            });
        }).catch(function(error) {
            throw error;
        });
    };

    self.deleteControlType = function(controlTypeId) {
        return $http.delete(apiBaseUrl + '/controltypes/' + controlTypeId).then(function() {
            var idx = self.data.controlTypes.findIndex(t => t.controlTypeId == controlTypeId);
            if (idx > -1) {
                self.data.controlTypes.splice(idx, 1);
            }
            return self.loadEmployees().then(function() {
                return self.loadAllControls();
            });
        });
    };

    self.addRelease = function(releaseData) {
        return $http.post(apiBaseUrl + '/releases', releaseData).then(function(r) {
            return self.loadReleases().then(function() {
                return r.data;
            });
        }).catch(function(error) {
            throw error;
        });
    };

    self.updateRelease = function(releaseId, releaseData) {
        return $http.put(apiBaseUrl + '/releases/' + releaseId, releaseData).then(function(r) {
            return self.loadReleases().then(function() {
                return r.data;
            });
        }).catch(function(error) {
            throw error;
        });
    };
});