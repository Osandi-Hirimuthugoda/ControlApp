angular.module('controlApp', [])
    .controller('MainController', MainController);

MainController.$inject = ['$http', '$timeout', '$scope', '$q'];

function MainController($http, $timeout, $scope, $q) {
    var vm = this;
    var apiBaseUrl = '/api'; 
    
    
    vm.employees = [];
    vm.allControls = []; 
    vm.controlTypes = [];
    vm.statuses = []; 
    vm.releases = []; 
    
    vm.newEmployee = { employeeName: '', typeId: null, description: '' };
    vm.message = '';
    vm.isSaving = false;
    vm.searchControlText = '';
    vm.isSearching = false;


    vm.init = function() {
        console.log('Initializing...');
        var p1 = vm.loadControlTypes();
        var p2 = vm.loadStatuses();
        

        $q.all([p1, p2]).then(function() {
            return vm.loadEmployees();
        }).then(function() {
            return vm.loadAllControls();
        }).then(function() {
            vm.applyFilters();
            $timeout(function() { if(!$scope.$$phase) $scope.$apply(); }, 100);
        });
    };


    vm.loadEmployees = function() {
        return $http.get(apiBaseUrl + '/employees').then(function(r) {
            vm.employees = r.data || [];
            vm.employees.forEach(function(e) { e.editing = false; });
        });
    };

    vm.loadAllControls = function() {
        
        return $http.get(apiBaseUrl + '/controls').then(function(r) {
            vm.allControls = r.data || [];
            vm.allControls.forEach(function(c) {
                if(c.releaseDate) c.releaseDate = new Date(c.releaseDate);
                c.editing = false;
                
                if(c.statusId && vm.statuses.length > 0) {
                    var s = vm.statuses.find(x => x.id == c.statusId);
                    if(s) c.statusName = s.statusName;
                }
            });
        });
    };

    
    vm.searchControls = function() {
        
        $timeout(function() {
            if(!$scope.$$phase) $scope.$apply();
        }, 0);
    };

    
    vm.clearSearch = function() {
        vm.searchControlText = '';
        vm.searchControls(); 
    };

    vm.loadControlTypes = function() { return $http.get(apiBaseUrl + '/controltypes').then(function(r) { vm.controlTypes = r.data; }); };
    vm.loadStatuses = function() { return $http.get(apiBaseUrl + '/statuses').then(function(r) { vm.statuses = r.data; }); };
    vm.loadReleases = function() { return $http.get(apiBaseUrl + '/releases').then(function(r) { vm.releases = r.data; }); };

    
    vm.getFilteredEmployeeControls = function(empId) {
        if(!vm.allControls) return [];
        var controls = vm.allControls.filter(function(c) { return c.employeeId == empId; });
        
        
        if(vm.selectedTypeFilter) {
            controls = controls.filter(function(c) { return c.typeId == vm.selectedTypeFilter; });
        }
        

        if(vm.searchControlText && vm.searchControlText.trim()) {
            var searchTerm = vm.searchControlText.toLowerCase().trim();
            controls = controls.filter(function(c) {
                
                var employee = vm.employees.find(function(e) { return e.id == c.employeeId; });
                var matchesEmployee = employee && employee.employeeName && 
                                     employee.employeeName.toLowerCase().indexOf(searchTerm) !== -1;
                

                var matchesDescription = c.description && 
                                        c.description.toLowerCase().indexOf(searchTerm) !== -1;
                
                return matchesEmployee || matchesDescription;
            });
        }
        
        return controls;
    };

    vm.applyFilters = function() { $timeout(function() {}, 0); };


    vm.addEmployee = function(event) {
        if(event) event.preventDefault();
        if(!vm.newEmployee.employeeName) return;

        vm.isSaving = true;
        var postData = {
            employeeName: vm.newEmployee.employeeName,
            typeId: vm.newEmployee.typeId,
            description: vm.newEmployee.description
        };

        $http.post(apiBaseUrl + '/employees', postData).then(function(r) {
            vm.employees.push(r.data);
            vm.loadAllControls(); 
            vm.showMessage('Employee added!', 'success');
            vm.newEmployee = { employeeName: '', typeId: null, description: '' };
        }).finally(function() { vm.isSaving = false; });
    };

    vm.deleteEmployee = function(employee) {
        var totalControls = vm.allControls.filter(c => c.employeeId == employee.id).length;
        if (totalControls > 0 && !confirm('Delete ' + employee.employeeName + '? (' + totalControls + ' controls will be deleted)')) return;
        if (totalControls === 0 && !confirm('Delete ' + employee.employeeName + '?')) return;

        var deletePromises = vm.allControls.filter(c => c.employeeId == employee.id)
            .map(c => $http.delete(apiBaseUrl + '/controls/' + c.controlId));

        $q.all(deletePromises).then(function() {
            return $http.delete(apiBaseUrl + '/employees/' + employee.id);
        }).then(function() {
            var idx = vm.employees.indexOf(employee);
            if (idx > -1) vm.employees.splice(idx, 1);
            vm.allControls = vm.allControls.filter(c => c.employeeId != employee.id);
            vm.showMessage('Deleted successfully!', 'success');
        });
    };
    
    

    vm.startEdit = function(c) {
        c.editing = true;
        c.editDescription = c.description;
        c.editComments = c.comments;
        c.editStatusId = c.statusId;

        c.editProgress = c.progress || 0; 
        
        if(c.releaseDate) {
            c.editReleaseDate = c.releaseDate;
        } else {
             c.editReleaseDate = null;
        }
    };

    vm.cancelEdit = function(c) { c.editing = false; };
    
    vm.saveControl = function(c) {
        

        var getIntOrNull = function(val) {
            if (val === null || val === undefined || val === "" || val === "null") return null;
            return parseInt(val);
        };

        
        var getProgressInt = function(val) {
            if (!val || isNaN(val)) return 0;
            return parseInt(val);
        };

        var data = {
            controlId: c.controlId, 
            employeeId: c.employeeId,
            typeId: c.typeId,
            
            description: c.editDescription,
            comments: c.editComments,
            
            
            progress: getProgressInt(c.editProgress),
            statusId: getIntOrNull(c.editStatusId),

            releaseId: null, 
            releaseDate: c.editReleaseDate
        };
        
        console.log('🚀 Sending Payload:', data);

        $http.put(apiBaseUrl + '/controls/' + c.controlId, data).then(function(r) {
            var updated = r.data;
            
            c.description = updated.description;
            c.comments = updated.comments;
            c.progress = updated.progress;
            c.statusId = updated.statusId;
            c.releaseId = null; 
            
            if(updated.releaseDate) c.releaseDate = new Date(updated.releaseDate);
            else c.releaseDate = null;

            
            if(updated.statusName) {
                c.statusName = updated.statusName;
            } else if(c.statusId) {
                var s = vm.statuses.find(x => x.id == c.statusId);
                c.statusName = s ? s.statusName : '';
            } else {
                c.statusName = '';
            }
           
            c.releaseName = '';

            c.editing = false;
            vm.showMessage('Saved successfully!', 'success');
        }).catch(function(err) {
            console.error('Update Error:', err);
            
            var msg = 'Error saving.';
            if(err.data && err.data.errors) msg += ' ' + JSON.stringify(err.data.errors);
            else if (err.data && err.data.message) msg += ' ' + err.data.message;
            vm.showMessage(msg, 'error');
        });
    };

    vm.addProgressComment = function(c) {
        if(!c.newProgressComment) return;
        var d = new Date();
        var txt = (d.getMonth()+1)+'/'+d.getDate() + ': ' + c.newProgressComment;
        var newComm = (c.comments ? c.comments + '\n' : '') + txt;
        
        var data = {
            controlId: c.controlId,
            employeeId: c.employeeId,
            typeId: c.typeId,
            description: c.description,
            statusId: c.statusId,
            releaseId: null,
            releaseDate: c.releaseDate,
            progress: c.progress || 0,
            comments: newComm
        };
        
        $http.put(apiBaseUrl + '/controls/' + c.controlId, data).then(function(r) {
            c.comments = r.data.comments;
            c.newProgressComment = '';
            vm.showMessage('Comment added!', 'success');
        });
    };

    vm.showMessage = function(msg, type) {
        vm.message = msg;
        vm.messageType = type;
        $timeout(function() { vm.message = ''; }, 4000);
    };

    vm.startEditEmployee = function(e) { e.editing = true; e.editName=e.employeeName; e.editTypeId=e.typeId; };
    vm.cancelEditEmployee = function(e) { e.editing = false; };
    vm.saveEmployee = function(e) {
        $http.put(apiBaseUrl+'/employees/'+e.id, {employeeName:e.editName, typeId:e.editTypeId}).then(function(r){
            Object.assign(e, r.data); e.editing=false;
        });
    };

    vm.init();
}