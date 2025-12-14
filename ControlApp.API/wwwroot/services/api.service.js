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
        var p1 = self.loadControlTypes(); 
        var p2 = self.loadStatuses();
        var p3 = self.loadReleases();

        return $q.all([p1, p2, p3]).then(function() {
            return self.loadEmployees();
        }).then(function() {
            return self.loadAllControls();
        });
    };

    // Load Data Methods
    
    self.loadEmployees = function() {
        return $http.get(apiBaseUrl + '/employees').then(function(r) {
            self.data.employees = r.data || [];
            self.data.employees.forEach(function(e) { e.editing = false; });
            return self.data.employees;
        });
    };

    // Load Control Types from API
    self.loadControlTypes = function() {
        return $http.get(apiBaseUrl + '/controltypes').then(function(r) {
            self.data.controlTypes = r.data || [];
            return self.data.controlTypes;
        }).catch(function(error) {
            console.error('Error loading control types:', error);
            self.data.controlTypes = [];
            return $q.when(self.data.controlTypes);
        });
    }; 
 
    self.loadStatuses = function() {
        return $http.get(apiBaseUrl + '/statuses').then(function(r) {
            self.data.statuses = r.data || [];
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
                if(c.releaseDate) c.releaseDate = new Date(c.releaseDate);
                else c.releaseDate = null;
                
                c.editing = false;
                
               
                if(c.typeId && self.data.controlTypes.length > 0) {
                    var t = self.data.controlTypes.find(x => x.controlTypeId == c.typeId);
                    if(t) c.typeName = t.typeName;
                }
                
                if(c.statusId && self.data.statuses.length > 0) {
                    var s = self.data.statuses.find(x => x.id == c.statusId);
                    if(s) c.statusName = s.statusName;
                }
                if(c.releaseId && self.data.releases.length > 0) {
                    var r = self.data.releases.find(x => x.releaseId == c.releaseId);
                    if(r) c.releaseName = r.releaseName;
                }
            });
            return self.data.allControls;
        });
    };

    // CRUD Actions 

    self.addEmployee = function(empData) {
        return $http.post(apiBaseUrl + '/employees', empData).then(function(r) {
            self.data.employees.push(r.data);
            self.loadAllControls(); 
            return r.data;
        });
    };

    self.updateEmployee = function(id, data) {
        return $http.put(apiBaseUrl + '/employees/' + id, data);
    };

    self.deleteEmployee = function(id) {
        return $http.delete(apiBaseUrl + '/employees/' + id).then(function() {
            var idx = self.data.employees.findIndex(e => e.id == id);
            if (idx > -1) self.data.employees.splice(idx, 1);
            self.data.allControls = self.data.allControls.filter(c => c.employeeId != id);
        });
    };

    self.updateControl = function(controlId, payload) {
        console.log('Updating control:', controlId, payload);
        return $http.put(apiBaseUrl + '/controls/' + controlId, payload).catch(function(error) {
            console.error('Update control error:', error);
            if(error.data) {
                console.error('Error details:', error.data);
            }
            throw error;
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
            { releaseId: 999992, releaseName: "Release 25.12", releaseDate: new Date(currentYear, 11, 25) }
        ];

        if (defaultReleases[0].releaseDate < today) defaultReleases[0].releaseDate = new Date(currentYear + 1, 0, 26);
        if (defaultReleases[1].releaseDate < today) defaultReleases[1].releaseDate = new Date(currentYear + 1, 11, 25);

        self.data.upcomingReleases = angular.copy(self.data.releases);
        
        defaultReleases.forEach(function(dr) {
            var drDate = new Date(dr.releaseDate);
            var exists = self.data.upcomingReleases.some(function(r) {
                var rDate = new Date(r.releaseDate);
                return rDate.getMonth() === drDate.getMonth() && rDate.getDate() === drDate.getDate();
            });
            if (!exists) self.data.upcomingReleases.push(dr);
        });

        today.setHours(0,0,0,0);
        self.data.upcomingReleases = self.data.upcomingReleases.filter(function(r) {
            var rd = new Date(r.releaseDate);
            return rd >= today;
        }).sort(function(a, b) {
            return new Date(a.releaseDate) - new Date(b.releaseDate);
        });
    };

    // Control Type CRUD
    self.addControlType = function(controlTypeData) {
        return $http.post(apiBaseUrl + '/controltypes', controlTypeData).then(function(r) {
            self.data.controlTypes.push(r.data);
            return r.data;
        });
    };

    self.deleteControlType = function(controlTypeId) {
        return $http.delete(apiBaseUrl + '/controltypes/' + controlTypeId).then(function() {
            // Remove from local store
            var idx = self.data.controlTypes.findIndex(t => t.controlTypeId == controlTypeId);
            if (idx > -1) {
                self.data.controlTypes.splice(idx, 1);
            }
            // Reload employees and controls to update type references
            return self.loadEmployees().then(function() {
                return self.loadAllControls();
            });
        });
    };
});