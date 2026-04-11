app.service('SignalRService', function(AuthService, NotificationService, $rootScope) {
    var self = this;
    self.connection = null;
    self.isConnected = false;
    
    self.start = function() {
        var token = AuthService.getToken();
        if (!token) {
            console.log('No token available, skipping SignalR connection');
            return;
        }
        
        self.connection = new signalR.HubConnectionBuilder()
            .withUrl('/notificationHub', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
        
        // Handle notifications
        self.connection.on('ReceiveNotification', function(message, type) {
            console.log('Notification received:', message, type);
            NotificationService.show(message, type);
            $rootScope.$apply();
        }); 
        
        // Handle defect assigned
        self.connection.on('DefectAssigned', function(defectTitle, defectId) {
            console.log('Defect assigned:', defectTitle, defectId);
            NotificationService.show('New defect assigned to you: ' + defectTitle, 'info');
            $rootScope.$broadcast('defectAssigned', { defectId: defectId, title: defectTitle });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        // Handle QA assigned to control
        self.connection.on('QAAssigned', function(controlDescription, controlId) {
            console.log('QA assigned to control:', controlDescription, controlId);
            NotificationService.show('You have been assigned as QA Engineer for: ' + controlDescription, 'info');
            $rootScope.$broadcast('qaAssigned', { controlId: controlId, description: controlDescription });
            if (!$rootScope.$phase) {
                $rootScope.$apply();
            }
        });
        
        // Handle defect status changed
        self.connection.on('DefectStatusChanged', function(defectTitle, defectId, controlId, newStatus) {
            console.log('Defect status changed:', defectTitle, defectId, controlId, newStatus);
            NotificationService.show('Defect "' + defectTitle + '" status changed to: ' + newStatus, 'success');
            $rootScope.$broadcast('defectStatusChanged', { 
                defectId: defectId, 
                controlId: controlId,
                title: defectTitle, 
                status: newStatus 
            });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        
        // Handle test case failed
        self.connection.on('TestCaseFailed', function(testCaseTitle, testCaseId) {
            console.log('Test case failed:', testCaseTitle, testCaseId);
            NotificationService.show('Test case failed: ' + testCaseTitle, 'error');
            $rootScope.$broadcast('testCaseFailed', { testCaseId: testCaseId, title: testCaseTitle });
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        
        // Start connection
        self.connection.start()
            .then(function() {
                console.log('SignalR Connected');
                self.isConnected = true;
            })
            .catch(function(err) {
                console.error('SignalR Connection Error:', err);
                self.isConnected = false;
            });
        
        // Handle reconnection
        self.connection.onreconnected(function() {
            console.log('SignalR Reconnected');
            self.isConnected = true;
        });
        
        self.connection.onreconnecting(function() {
            console.log('SignalR Reconnecting...');
            self.isConnected = false;
        });
        
        self.connection.onclose(function() {
            console.log('SignalR Disconnected');
            self.isConnected = false;
        });
    };
    
    self.stop = function() {
        if (self.connection) {
            self.connection.stop();
            self.isConnected = false;
        }
    };
    
    self.sendNotification = function(userId, message, type) {
        if (self.connection && self.isConnected) {
            return self.connection.invoke('SendNotificationToUser', userId, message, type);  
        }
    };
    
    self.sendNotificationToAll = function(message, type) {
        if (self.connection && self.isConnected) {
            return self.connection.invoke('SendNotificationToAll', message, type);
        }
    };
});

// QAAssigned handler is registered inside start() above via self.connection.on('QAAssigned', ...)

