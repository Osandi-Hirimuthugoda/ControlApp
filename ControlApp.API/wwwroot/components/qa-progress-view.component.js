app.component('qaProgressView', {
    template: `
    <div class="row" style="align-items: flex-start; margin: 0;">
        <!-- Left Side: Sidebar with Anchor Bar -->
        <div class="sidebar-container" ng-class="{'collapsed': $ctrl.sidebarCollapsed, 'expanded': !$ctrl.sidebarCollapsed, 'minimized': $ctrl.sidebarMinimized}">
            <!-- Anchor Bar with Icons -->
            <div class="sidebar-avatar">
                <i class="fas fa-user-shield"></i>
            </div>
            <div class="sidebar-anchor-bar">
                <button class="anchor-btn" ng-click="$ctrl.toggleSidebar()" title="Toggle Sidebar">
                    <i class="fas" ng-class="$ctrl.sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.toggleFullscreen()" title="Toggle Fullscreen">
                    <i class="fas" ng-class="$ctrl.isFullscreen ? 'fa-compress' : 'fa-expand'"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.resetLayout()" title="Reset Layout">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="anchor-btn" ng-click="$ctrl.minimizeSidebar()" title="Minimize Sidebar">
                    <i class="fas fa-window-minimize"></i>
                </button>
            </div>
            <!-- Sidebar Content -->
            <div class="sidebar-content" ng-if="!$ctrl.sidebarMinimized">
                <controls-sidebar></controls-sidebar>
            </div>
        </div>

        <!-- Right Side: QA Progress Content Area -->
        <div class="content-area" ng-class="{'full-width': $ctrl.sidebarCollapsed || $ctrl.sidebarMinimized, 'normal-width': !$ctrl.sidebarCollapsed && !$ctrl.sidebarMinimized}">
            <qa-progress></qa-progress>
        </div>
    </div>
    `,
    controller: function($rootScope) {
        var ctrl = this;

        // Sidebar state management (same behavior pattern as controlsView)
        ctrl.sidebarCollapsed = false;
        ctrl.sidebarMinimized = false;
        ctrl.isFullscreen = false;

        // Toggle sidebar collapse/expand
        ctrl.toggleSidebar = function() {
            ctrl.sidebarCollapsed = !ctrl.sidebarCollapsed;
            if (ctrl.sidebarCollapsed) {
                ctrl.sidebarMinimized = false; // Reset minimize when collapsing
            }
        };

        // Minimize sidebar (show only anchor bar)
        ctrl.minimizeSidebar = function() {
            ctrl.sidebarMinimized = !ctrl.sidebarMinimized;
            if (ctrl.sidebarMinimized) {
                ctrl.sidebarCollapsed = false;
            }
        };

        // Toggle fullscreen mode
        ctrl.toggleFullscreen = function() {
            ctrl.isFullscreen = !ctrl.isFullscreen;
            if (ctrl.isFullscreen) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(function(err) {
                        console.warn('Error attempting to enable fullscreen:', err);
                    });
                }
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        };

        // Reset layout to default
        ctrl.resetLayout = function() {
            ctrl.sidebarCollapsed = false;
            ctrl.sidebarMinimized = false;
            ctrl.isFullscreen = false;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }
});

