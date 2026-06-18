app.service('NotificationService', function($timeout) {
    var self = this;
    var callback = null;

    self.subscribe = function(cb) {
        callback = cb;
    };

    self.show = function(msg, type, metadata) {
        if(callback) callback(msg, type, metadata);
        $timeout(function() {
            if(callback) callback('', '', null);
        }, 8000); // Keep longer for better UX
    };
});