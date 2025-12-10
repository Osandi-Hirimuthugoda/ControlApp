app.service('NotificationService', function($timeout) {
    var self = this;
    var callback = null;

    self.subscribe = function(cb) {
        callback = cb;
    };

    self.show = function(msg, type) {
        if(callback) callback(msg, type);
        $timeout(function() {
            if(callback) callback('', '');
        }, 4000);
    };
});