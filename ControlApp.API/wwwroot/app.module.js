var app = angular.module('controlApp', []);

// Main Controller for View Switching
app.controller('MainController', function($rootScope) {
    var vm = this;
    vm.currentView = $rootScope.currentView || 'controls';
    
    // Listen for view changes
    var listener = $rootScope.$on('viewChanged', function(event, view) {
        vm.currentView = view;
    });
    
    // Cleanup on scope destroy
    $rootScope.$on('$destroy', function() {
        listener();
    });
});

// Controls View Controller for Section Switching
app.controller('ControlsViewController', function($rootScope) {
    var vm = this;
    vm.currentSection = 'controls';
    
    // Listen for section changes
    var listener = $rootScope.$on('controlsSectionChanged', function(event, section) {
        vm.currentSection = section;
    });
    
    // Cleanup on scope destroy
    $rootScope.$on('$destroy', function() {
        listener();
    });
});

// Controller for Toast Notifications
app.controller('ToastController', function(NotificationService) {
    var vm = this;
    vm.message = '';
    vm.type = '';

    NotificationService.subscribe(function(msg, type) {
        vm.message = msg;
        vm.type = type;
    });

    vm.clear = function() {
        vm.message = '';
    };
});