var app = angular.module('controlApp', []);

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