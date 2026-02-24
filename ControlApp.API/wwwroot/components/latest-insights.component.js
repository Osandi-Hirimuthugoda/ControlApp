app.component('latestInsights', {
    template: `
    <div class="container-fluid p-4" style="animation: fadeIn 0.5s ease-out;">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="fw-bold text-dark mb-1">
                            <i class="fas fa-lightbulb me-3 text-warning"></i>Latest Insights
                        </h2>
                        <p class="text-muted mb-0">Capture and manage team insights, learnings, and important observations</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success" ng-click="$ctrl.showAddInsightModal()">
                            <i class="fas fa-plus me-2"></i>Add Insight
                        </button>
                        <button class="btn btn-outline-primary" ng-click="$ctrl.refreshInsights()">
                            <i class="fas fa-refresh me-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4" ng-if="$ctrl.summary">
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 16px;">
                    <div class="card-body text-center">
                        <i class="fas fa-lightbulb fa-2x text-warning mb-2"></i>
                        <h4 class="fw-bold text-primary">{{$ctrl.summary.totalInsights}}</h4>
                        <p class="text-muted small mb-0">Total Insights</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 16px;">
                    <div class="card-body text-center">
                        <i class="fas fa-eye fa-2x text-success mb-2"></i>
                        <h4 class="fw-bold text-success">{{$ctrl.summary.activeInsights}}</h4>
                        <p class="text-muted small mb-0">Active Insights</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 16px;">
                    <div class="card-body text-center">
                        <i class="fas fa-thumbtack fa-2x text-info mb-2"></i>
                        <h4 class="fw-bold text-info">{{$ctrl.summary.pinnedInsightsCount}}</h4>
                        <p class="text-muted small mb-0">Pinned Insights</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100" style="border-radius: 16px;">
                    <div class="card-body text-center">
                        <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
                        <h4 class="fw-bold text-danger">{{$ctrl.summary.criticalInsights}}</h4>
                        <p class="text-muted small mb-0">Critical Insights</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm" style="border-radius: 16px;">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0">
                                        <i class="fas fa-search text-muted"></i>
                                    </span>
                                    <input type="text" class="form-control border-0" 
                                           ng-model="$ctrl.searchTerm" 
                                           ng-change="$ctrl.searchInsights()"
                                           placeholder="Search insights...">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select border-0 bg-light" 
                                        ng-model="$ctrl.selectedCategory" 
                                        ng-change="$ctrl.filterByCategory()">
                                    <option value="">All Categories</option>
                                    <option ng-repeat="category in $ctrl.categories" value="{{category}}">{{category}}</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select border-0 bg-light" 
                                        ng-model="$ctrl.selectedPriority" 
                                        ng-change="$ctrl.filterByPriority()">
                                    <option value="">All Priorities</option>
                                    <option value="4">Critical</option>
                                    <option value="3">High</option>
                                    <option value="2">Medium</option>
                                    <option value="1">Low</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                           ng-model="$ctrl.showPinnedOnly" 
                                           ng-change="$ctrl.togglePinnedFilter()" 
                                           id="pinnedFilter">
                                    <label class="form-check-label" for="pinnedFilter">
                                        Pinned Only
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Insights List -->
        <div class="row">
            <div class="col-12">
                <div class="card border-0 shadow-sm" style="border-radius: 16px;">
                    <div class="card-header bg-light border-0 d-flex justify-content-between align-items-center" 
                         style="border-radius: 16px 16px 0 0;">
                        <h5 class="mb-0">
                            <i class="fas fa-list me-2"></i>Insights
                        </h5>
                        <span class="badge bg-primary">{{$ctrl.filteredInsights.length}} insights</span>
                    </div>
                    <div class="card-body p-0">
                        <!-- Insights Grid -->
                        <div class="row g-3 p-3" ng-if="$ctrl.filteredInsights.length > 0">
                            <div class="col-lg-6 col-xl-4" ng-repeat="insight in $ctrl.filteredInsights track by insight.insightId">
                                <div class="card h-100 border-0 shadow-sm insight-card" 
                                     style="border-radius: 12px; transition: all 0.3s ease;"
                                     ng-class="{'border-warning': insight.isPinned}">
                                    
                                    <!-- Card Header -->
                                    <div class="card-header bg-light border-0 d-flex justify-content-between align-items-start p-3">
                                        <div class="flex-grow-1">
                                            <h6 class="mb-1 fw-bold text-dark">{{insight.title}}</h6>
                                            <div class="d-flex align-items-center gap-2">
                                                <span class="badge" ng-class="'bg-' + insight.priorityColor">
                                                    {{insight.priorityText}}
                                                </span>
                                                <span class="badge bg-light text-dark" ng-if="insight.category">
                                                    {{insight.category}}
                                                </span>
                                                <i class="fas fa-thumbtack text-warning" ng-if="insight.isPinned" title="Pinned"></i>
                                            </div>
                                        </div>
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-light border-0" data-bs-toggle="dropdown">
                                                <i class="fas fa-ellipsis-v"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#" ng-click="$ctrl.editInsight(insight)">
                                                    <i class="fas fa-edit me-2"></i>Edit
                                                </a></li>
                                                <li><a class="dropdown-item" href="#" ng-click="$ctrl.togglePinned(insight)">
                                                    <i class="fas fa-thumbtack me-2"></i>{{insight.isPinned ? 'Unpin' : 'Pin'}}
                                                </a></li>
                                                <li><hr class="dropdown-divider"></li>
                                                <li><a class="dropdown-item text-danger" href="#" ng-click="$ctrl.deleteInsight(insight)">
                                                    <i class="fas fa-trash me-2"></i>Delete
                                                </a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Card Body -->
                                    <div class="card-body p-3">
                                        <p class="text-muted mb-3" style="font-size: 0.9rem;">
                                            {{insight.content | limitTo:150}}{{insight.content.length > 150 ? '...' : ''}}
                                        </p>
                                        
                                        <!-- Tags -->
                                        <div class="mb-3" ng-if="insight.tags">
                                            <span class="badge bg-secondary me-1" 
                                                  ng-repeat="tag in $ctrl.getTags(insight.tags)">
                                                {{tag}}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Card Footer -->
                                    <div class="card-footer bg-transparent border-0 p-3 pt-0">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">
                                                <i class="fas fa-user me-1"></i>{{insight.authorName || 'Unknown'}}
                                            </small>
                                            <small class="text-muted">
                                                <i class="fas fa-clock me-1"></i>{{insight.createdAt | date:'MMM d, y'}}
                                            </small>
                                        </div>
                                        <div ng-if="insight.updatedAt" class="mt-1">
                                            <small class="text-muted">
                                                <i class="fas fa-edit me-1"></i>Updated {{insight.updatedAt | date:'MMM d, y'}}
                                                <span ng-if="insight.updatedByName">by {{insight.updatedByName}}</span>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div class="text-center py-5" ng-if="$ctrl.filteredInsights.length === 0">
                            <i class="fas fa-lightbulb fa-3x text-muted mb-3"></i>
                            <h5 class="text-muted">No insights found</h5>
                            <p class="text-muted">{{$ctrl.searchTerm ? 'Try adjusting your search or filters' : 'Start by adding your first insight'}}</p>
                            <button class="btn btn-primary" ng-click="$ctrl.showAddInsightModal()" ng-if="!$ctrl.searchTerm">
                                <i class="fas fa-plus me-2"></i>Add First Insight
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Insight Modal -->
        <div class="modal fade" id="insightModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="border-radius: 16px;">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">
                            <i class="fas fa-lightbulb me-2 text-warning"></i>
                            {{$ctrl.editingInsight ? 'Edit Insight' : 'Add New Insight'}}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form ng-submit="$ctrl.saveInsight()">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label fw-bold">Title *</label>
                                    <input type="text" class="form-control" ng-model="$ctrl.currentInsight.title" 
                                           placeholder="Enter insight title" required maxlength="200">
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Category</label>
                                    <input type="text" class="form-control" ng-model="$ctrl.currentInsight.category" 
                                           placeholder="e.g., Technical, Process, Team" list="categoryList">
                                    <datalist id="categoryList">
                                        <option ng-repeat="category in $ctrl.categories" value="{{category}}">
                                    </datalist>
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Priority</label>
                                    <select class="form-select" ng-model="$ctrl.currentInsight.priority">
                                        <option value="1">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="3">High</option>
                                        <option value="4">Critical</option>
                                    </select>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label fw-bold">Content *</label>
                                    <textarea class="form-control" ng-model="$ctrl.currentInsight.content" 
                                              rows="6" placeholder="Describe your insight in detail..." required></textarea>
                                </div>
                                
                                <div class="col-12">
                                    <label class="form-label fw-bold">Tags</label>
                                    <input type="text" class="form-control" ng-model="$ctrl.currentInsight.tags" 
                                           placeholder="Enter tags separated by commas">
                                    <small class="text-muted">Separate multiple tags with commas</small>
                                </div>
                                
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" 
                                               ng-model="$ctrl.currentInsight.isPinned" id="pinnedCheck">
                                        <label class="form-check-label" for="pinnedCheck">
                                            Pin this insight (important insights)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" ng-click="$ctrl.saveInsight()" ng-disabled="$ctrl.saving">
                            <span ng-if="!$ctrl.saving">
                                <i class="fas fa-save me-2"></i>{{$ctrl.editingInsight ? 'Update' : 'Save'}} Insight
                            </span>
                            <span ng-if="$ctrl.saving">
                                <i class="fas fa-spinner fa-spin me-2"></i>Saving...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .insight-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .insight-card.border-warning {
            border-left: 4px solid #ffc107 !important;
        }
    </style>
    `,
    controller: function ($http, NotificationService, AuthService, $timeout) {
        var ctrl = this;
        
        // Data properties
        ctrl.insights = [];
        ctrl.filteredInsights = [];
        ctrl.summary = null;
        ctrl.categories = [];
        ctrl.searchTerm = '';
        ctrl.selectedCategory = '';
        ctrl.selectedPriority = '';
        ctrl.showPinnedOnly = false;
        
        // Modal properties
        ctrl.currentInsight = {};
        ctrl.editingInsight = false;
        ctrl.saving = false;

        ctrl.$onInit = function () {
            ctrl.loadInsights();
            ctrl.loadSummary();
            ctrl.loadCategories();
        };

        ctrl.loadInsights = function () {
            $http.get('/api/insights')
                .then(function (response) {
                    ctrl.insights = response.data;
                    ctrl.applyFilters();
                })
                .catch(function (error) {
                    console.error('Error loading insights:', error);
                    NotificationService.show('Error loading insights', 'error');
                });
        };

        ctrl.loadSummary = function () {
            $http.get('/api/insights/summary')
                .then(function (response) {
                    ctrl.summary = response.data;
                })
                .catch(function (error) {
                    console.error('Error loading summary:', error);
                });
        };

        ctrl.loadCategories = function () {
            $http.get('/api/insights/categories')
                .then(function (response) {
                    ctrl.categories = response.data;
                })
                .catch(function (error) {
                    console.error('Error loading categories:', error);
                });
        };

        ctrl.refreshInsights = function () {
            ctrl.loadInsights();
            ctrl.loadSummary();
            ctrl.loadCategories();
            NotificationService.show('Insights refreshed', 'success');
        };

        ctrl.applyFilters = function () {
            var filtered = ctrl.insights;

            // Search filter
            if (ctrl.searchTerm) {
                var term = ctrl.searchTerm.toLowerCase();
                filtered = filtered.filter(function (insight) {
                    return insight.title.toLowerCase().includes(term) ||
                           insight.content.toLowerCase().includes(term) ||
                           (insight.tags && insight.tags.toLowerCase().includes(term)) ||
                           (insight.category && insight.category.toLowerCase().includes(term));
                });
            }

            // Category filter
            if (ctrl.selectedCategory) {
                filtered = filtered.filter(function (insight) {
                    return insight.category === ctrl.selectedCategory;
                });
            }

            // Priority filter
            if (ctrl.selectedPriority) {
                filtered = filtered.filter(function (insight) {
                    return insight.priority == ctrl.selectedPriority;
                });
            }

            // Pinned filter
            if (ctrl.showPinnedOnly) {
                filtered = filtered.filter(function (insight) {
                    return insight.isPinned;
                });
            }

            ctrl.filteredInsights = filtered;
        };

        ctrl.searchInsights = function () {
            ctrl.applyFilters();
        };

        ctrl.filterByCategory = function () {
            ctrl.applyFilters();
        };

        ctrl.filterByPriority = function () {
            ctrl.applyFilters();
        };

        ctrl.togglePinnedFilter = function () {
            ctrl.applyFilters();
        };

        ctrl.showAddInsightModal = function () {
            ctrl.currentInsight = {
                title: '',
                content: '',
                category: '',
                tags: '',
                priority: 2,
                isPinned: false,
                authorId: AuthService.getUser()?.employeeId
            };
            ctrl.editingInsight = false;
            var modal = new bootstrap.Modal(document.getElementById('insightModal'));
            modal.show();
        };

        ctrl.editInsight = function (insight) {
            ctrl.currentInsight = angular.copy(insight);
            ctrl.editingInsight = true;
            var modal = new bootstrap.Modal(document.getElementById('insightModal'));
            modal.show();
        };

        ctrl.saveInsight = function () {
            if (!ctrl.currentInsight.title || !ctrl.currentInsight.content) {
                NotificationService.show('Title and content are required', 'error');
                return;
            }

            ctrl.saving = true;
            var request;

            if (ctrl.editingInsight) {
                ctrl.currentInsight.updatedById = AuthService.getUser()?.employeeId;
                request = $http.put('/api/insights/' + ctrl.currentInsight.insightId, ctrl.currentInsight);
            } else {
                request = $http.post('/api/insights', ctrl.currentInsight);
            }

            request.then(function (response) {
                NotificationService.show(
                    ctrl.editingInsight ? 'Insight updated successfully' : 'Insight created successfully', 
                    'success'
                );
                
                var modal = bootstrap.Modal.getInstance(document.getElementById('insightModal'));
                modal.hide();
                
                ctrl.loadInsights();
                ctrl.loadSummary();
                ctrl.loadCategories();
            })
            .catch(function (error) {
                console.error('Error saving insight:', error);
                NotificationService.show('Error saving insight', 'error');
            })
            .finally(function () {
                ctrl.saving = false;
            });
        };

        ctrl.togglePinned = function (insight) {
            $http.patch('/api/insights/' + insight.insightId + '/toggle-pinned')
                .then(function () {
                    insight.isPinned = !insight.isPinned;
                    NotificationService.show(
                        insight.isPinned ? 'Insight pinned' : 'Insight unpinned', 
                        'success'
                    );
                    ctrl.loadSummary();
                })
                .catch(function (error) {
                    console.error('Error toggling pinned status:', error);
                    NotificationService.show('Error updating insight', 'error');
                });
        };

        ctrl.deleteInsight = function (insight) {
            if (confirm('Are you sure you want to delete this insight?')) {
                $http.delete('/api/insights/' + insight.insightId)
                    .then(function () {
                        NotificationService.show('Insight deleted successfully', 'success');
                        ctrl.loadInsights();
                        ctrl.loadSummary();
                    })
                    .catch(function (error) {
                        console.error('Error deleting insight:', error);
                        NotificationService.show('Error deleting insight', 'error');
                    });
            }
        };

        ctrl.getTags = function (tagsString) {
            if (!tagsString) return [];
            return tagsString.split(',').map(function (tag) {
                return tag.trim();
            }).filter(function (tag) {
                return tag.length > 0;
            });
        };
    }
});