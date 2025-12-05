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
        var p3 = vm.loadReleases();

        // Load releases first, then load controls so release matching works
        $q.all([p1, p2, p3]).then(function() {
            console.log('Control types, statuses, and releases loaded');
            return vm.loadEmployees();
        }).then(function() {
            console.log('Employees loaded');
            return vm.loadAllControls();
        }).then(function() {
            console.log('All controls loaded');
            vm.applyFilters();
            $timeout(function() { 
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }, 100);
        }).catch(function(error) {
            console.error('Error during initialization:', error);
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
                // Ensure releaseDate is properly converted to Date object
                if(c.releaseDate) {
                    c.releaseDate = new Date(c.releaseDate);
                    // Validate the date
                    if(isNaN(c.releaseDate.getTime())) {
                        console.warn('Invalid release date for control', c.controlId, c.releaseDate);
                        c.releaseDate = null;
                    } else {
                        console.log('Loaded control', c.controlId, 'Release date:', c.releaseDate, 'Formatted:', vm.formatReleaseDate(c.releaseDate));
                    }
                } else {
                    c.releaseDate = null;
                }
                
                c.editing = false;
                
                if(c.statusId && vm.statuses.length > 0) {
                    var s = vm.statuses.find(x => x.id == c.statusId);
                    if(s) c.statusName = s.statusName;
                }
                
                // Ensure release name is set
                if(c.releaseId && vm.releases.length > 0) {
                    var release = vm.releases.find(x => x.releaseId == c.releaseId);
                    if(release) c.releaseName = release.releaseName;
                }
            });
            
            // Force Angular update
            $timeout(function() {
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }, 0);
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
    
    vm.loadReleases = function() { 
        return $http.get(apiBaseUrl + '/releases').then(function(r) { 
            vm.releases = r.data || [];
        }).catch(function(error) {
            console.warn('Error loading releases from API:', error);
            vm.releases = [];
        }).then(function() {
            
            var today = new Date();
            var currentYear = today.getFullYear();
            
            
            var defaultReleases = [
                {
                    releaseId: 999991,
                    releaseName: "Release 26.01",
                    releaseDate: new Date(currentYear, 0, 26), 
                    description: "Release 26.01"
                },
                {
                    releaseId: 999992,
                    releaseName: "Release 25.12",
                    releaseDate: new Date(currentYear, 11, 25), 
                    description: "Release 25.12"
                }
            ];
            
            
            if (defaultReleases[0].releaseDate < today) {
                defaultReleases[0].releaseDate = new Date(currentYear + 1, 0, 26);
            }
            if (defaultReleases[1].releaseDate < today) {
                defaultReleases[1].releaseDate = new Date(currentYear + 1, 11, 25);
            }
            
            
            var releaseMap = {};
            if (vm.releases && vm.releases.length > 0) {
                vm.releases.forEach(function(r) {
                    var date = new Date(r.releaseDate);
                    var key = date.getMonth() + '_' + date.getDate();
                    releaseMap[key] = r;
                });
            }
            
            
            defaultReleases.forEach(function(defRelease) {
                var defDate = new Date(defRelease.releaseDate);
                var defKey = defDate.getMonth() + '_' + defDate.getDate();
                if (!releaseMap[defKey]) {
                    if (!vm.releases) vm.releases = [];
                    vm.releases.push(defRelease);
                }
            });
            
            
            today.setHours(0, 0, 0, 0);
            vm.upcomingReleases = (vm.releases || []).filter(function(release) {
                var releaseDate = new Date(release.releaseDate);
                releaseDate.setHours(0, 0, 0, 0);
                return releaseDate >= today;
            });
            
            
            defaultReleases.forEach(function(defRelease) {
                var defMonth = defRelease.releaseDate.getMonth();
                var defDay = defRelease.releaseDate.getDate();
                
                
                var exists = vm.upcomingReleases.some(function(r) {
                    var rDate = new Date(r.releaseDate);
                    return rDate.getMonth() === defMonth && rDate.getDate() === defDay;
                });
                
                
                if (!exists) {
                    vm.upcomingReleases.push(defRelease);
                }
            });
            
            
            vm.upcomingReleases.sort(function(a, b) {
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            });
        }); 
    };
    
    
    vm.formatReleaseDate = function(date) {
        if (!date) return '';
        
        
        var d = date instanceof Date ? date : new Date(date);
        
        
        if (isNaN(d.getTime())) {
            console.warn('Invalid date passed to formatReleaseDate:', date);
            return '';
        }
        
        var day = ('0' + d.getDate()).slice(-2);
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        return day + '.' + month;
    };

    
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
            var releaseDate = new Date(c.releaseDate);
            releaseDate.setHours(0, 0, 0, 0);
            var matchingRelease = vm.upcomingReleases.find(function(r) {
                var rDate = new Date(r.releaseDate);
                rDate.setHours(0, 0, 0, 0);
                return rDate.getTime() === releaseDate.getTime();
            });
            c.editReleaseId = matchingRelease ? matchingRelease.releaseId : null;
        } else {
            c.editReleaseId = null;
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

        
        var selectedReleaseDate = null;
        var selectedReleaseId = null;
        
        if(c.editReleaseId) {
            var selectedRelease = vm.upcomingReleases.find(function(r) {
                return r.releaseId == c.editReleaseId;
            });
            
            if(selectedRelease) {
                
                if(selectedRelease.releaseDate) {
                    var dateObj = new Date(selectedRelease.releaseDate);
                    selectedReleaseDate = dateObj.toISOString();
                }
                
                
                if(selectedRelease.releaseId >= 999990) {
                    
                    var matchingDbRelease = vm.releases.find(function(r) {
                        if(r.releaseId < 999990) { 
                            var rDate = new Date(r.releaseDate);
                            var selDate = new Date(selectedRelease.releaseDate);
                            rDate.setHours(0, 0, 0, 0);
                            selDate.setHours(0, 0, 0, 0);
                            return rDate.getTime() === selDate.getTime();
                        }
                        return false;
                    });
                    
                    if(matchingDbRelease) {
                        selectedReleaseId = matchingDbRelease.releaseId;
                    } else {
                        
                        selectedReleaseId = null;
                    }
                } else {
                    
                    selectedReleaseId = selectedRelease.releaseId;
                }
            }
        }

        var data = {
            controlId: c.controlId, 
            employeeId: c.employeeId,
            typeId: c.typeId,
            
            description: c.editDescription,
            comments: c.editComments,
            
            
            progress: getProgressInt(c.editProgress),
            statusId: getIntOrNull(c.editStatusId),

            releaseId: getIntOrNull(selectedReleaseId), 
            releaseDate: selectedReleaseDate
        };
        
        console.log('Sending Payload:', data);

        $http.put(apiBaseUrl + '/controls/' + c.controlId, data).then(function(r) {
            var updated = r.data;
            
            console.log('Saved control data:', updated);
            console.log('Release data from server - ReleaseId:', updated.releaseId, 'ReleaseDate:', updated.releaseDate);
            
        
            var oldReleaseDate = c.releaseDate;
            var oldReleaseId = c.releaseId;
            
            c.description = updated.description;
            c.comments = updated.comments;
            c.progress = updated.progress;
            c.statusId = updated.statusId;
            c.releaseId = updated.releaseId || null; 
            
            
            if(updated.releaseDate) {
                var newReleaseDate = new Date(updated.releaseDate);
                
                if(!oldReleaseDate || oldReleaseDate.getTime() !== newReleaseDate.getTime()) {
                    c.releaseDate = newReleaseDate;
                    console.log('Release date changed from', oldReleaseDate, 'to', c.releaseDate, 'Formatted:', vm.formatReleaseDate(c.releaseDate));
                }
            } else {
                if(c.releaseDate !== null) {
                    c.releaseDate = null;
                    console.log('Release date cleared');
                }
            }

        
            if(updated.statusName) {
                c.statusName = updated.statusName;
            } else if(c.statusId) {
                var s = vm.statuses.find(x => x.id == c.statusId);
                c.statusName = s ? s.statusName : '';
            } else {
                c.statusName = '';
            }
           
            
            c.releaseName = updated.releaseName || '';
            
            c.editing = false;
            
            
            var controlIndex = vm.allControls.findIndex(function(ctrl) {
                return ctrl.controlId === c.controlId;
            });
            
            if(controlIndex >= 0) {
                
                vm.allControls[controlIndex].description = c.description;
                vm.allControls[controlIndex].comments = c.comments;
                vm.allControls[controlIndex].progress = c.progress;
                vm.allControls[controlIndex].statusId = c.statusId;
                vm.allControls[controlIndex].statusName = c.statusName;
                vm.allControls[controlIndex].releaseId = c.releaseId;
                vm.allControls[controlIndex].releaseName = c.releaseName;
                vm.allControls[controlIndex].releaseDate = c.releaseDate;
                vm.allControls[controlIndex].editing = false;
                
                console.log(' Control updated in array at index', controlIndex);
                console.log(' Array control release date:', vm.allControls[controlIndex].releaseDate, 'Formatted:', vm.formatReleaseDate(vm.allControls[controlIndex].releaseDate));
            }
            
            
            $http.get(apiBaseUrl + '/controls/' + c.controlId).then(function(response) {
                var reloadedControl = response.data;
                console.log('🔄 Reloaded control from server:', reloadedControl);
                
                
                var reloadIndex = vm.allControls.findIndex(function(ctrl) {
                    return ctrl.controlId === reloadedControl.controlId;
                });
                
                if(reloadIndex >= 0 && reloadedControl) {
                    
                    if(reloadedControl.releaseDate) {
                        reloadedControl.releaseDate = new Date(reloadedControl.releaseDate);
                    }
                    
                    vm.allControls[reloadIndex] = {
                        controlId: reloadedControl.controlId,
                        description: reloadedControl.description,
                        comments: reloadedControl.comments,
                        progress: reloadedControl.progress,
                        statusId: reloadedControl.statusId,
                        statusName: reloadedControl.statusName || '',
                        releaseId: reloadedControl.releaseId || null,
                        releaseName: reloadedControl.releaseName || '',
                        releaseDate: reloadedControl.releaseDate || null,
                        employeeId: reloadedControl.employeeId,
                        employeeName: reloadedControl.employeeName,
                        typeId: reloadedControl.typeId,
                        typeName: reloadedControl.typeName,
                        editing: false
                    };
                    
                    console.log('Control object replaced in array at index', reloadIndex);
                    console.log('New release date:', vm.allControls[reloadIndex].releaseDate, 'Formatted:', vm.formatReleaseDate(vm.allControls[reloadIndex].releaseDate));
                    
                    
                    Object.assign(c, vm.allControls[reloadIndex]);
                }
            }).catch(function(err) {
                console.warn('Could not reload control:', err);
            }).finally(function() {
                
                $timeout(function() {
                    
                    vm.applyFilters();
                    
                    
                    if($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                        $scope.$apply(function() {
                            console.log('🔄 View updated via $apply. Current release date:', c.releaseDate, 'Formatted:', vm.formatReleaseDate(c.releaseDate));
                        });
                    } else {
                        
                        $scope.$evalAsync(function() {
                            console.log('🔄 View updated via $evalAsync. Current release date:', c.releaseDate, 'Formatted:', vm.formatReleaseDate(c.releaseDate));
                        });
                    }
                }, 50);
                
                 
                $timeout(function() {
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, 200);
            });
            
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