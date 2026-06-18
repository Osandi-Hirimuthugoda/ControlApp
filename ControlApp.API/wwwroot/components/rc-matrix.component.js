app.component('rcMatrix', {
    bindings: {
        allDefects: '<',
        allControls: '<',
        allReleases: '<',
        onClose: '&'
    },
    template: `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9998;display:flex;align-items:center;justify-content:center;" ng-click="$ctrl.onClose()">
        <div class="card border-0 shadow-lg" style="width:900px;max-width:97vw;max-height:93vh;overflow-y:auto;border-radius:18px;" ng-click="$event.stopPropagation()">

            <!-- Header -->
            <div class="card-header border-0 py-3 px-4 d-flex justify-content-between align-items-center"
                 style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);border-radius:18px 18px 0 0;">
                <div>
                    <h5 class="fw-bold text-white mb-0"><i class="fas fa-table me-2"></i>Root Cause Matrix</h5>
                    <small class="text-white opacity-75">Defect category internal breakdown by control</small>
                </div>
                <button class="btn btn-sm rounded-circle" style="background:rgba(255,255,255,0.2);color:white;width:32px;height:32px;" ng-click="$ctrl.onClose()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="card-body p-4" style="background:#f8fafc;">

                <!-- Control Multi-Select Dropdown -->
                <div class="card border-0 shadow-sm rounded-3 mb-4 p-3" style="background:white;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-dark small"><i class="fas fa-filter me-2 text-primary"></i>Select Controls</span>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary btn-sm" style="font-size:0.72rem;padding:2px 10px;" ng-click="$ctrl.selectAll()">All</button>
                            <button class="btn btn-outline-secondary btn-sm" style="font-size:0.72rem;padding:2px 10px;" ng-click="$ctrl.clearAll()">None</button>
                        </div>
                    </div>
                    <!-- Dropdown trigger -->
                    <!-- Inline expandable list — no absolute positioning to avoid modal clip -->
                    <button class="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center mb-0"
                            style="border-radius:8px;"
                            ng-click="$ctrl.dropdownOpen = !$ctrl.dropdownOpen">
                        <span class="small">
                            <i class="fas fa-layer-group me-2 text-primary"></i>
                            <span ng-if="$ctrl.getSelectedCount() === 0">No controls selected</span>
                            <span ng-if="$ctrl.getSelectedCount() === $ctrl.allControls.length">All controls selected ({{$ctrl.allControls.length}})</span>
                            <span ng-if="$ctrl.getSelectedCount() > 0 && $ctrl.getSelectedCount() < $ctrl.allControls.length">{{$ctrl.getSelectedCount()}} of {{$ctrl.allControls.length}} selected</span>
                        </span>
                        <i class="fas" ng-class="$ctrl.dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'" style="font-size:0.75rem;"></i>
                    </button>

                    <!-- Inline panel — expands in document flow, no clipping -->
                    <div ng-if="$ctrl.dropdownOpen" class="border rounded-3 bg-white mt-1" style="overflow:hidden;">
                        <div class="px-2 py-1 border-bottom bg-white">
                            <input type="text" class="form-control form-control-sm" placeholder="Search controls..." ng-model="$ctrl.ctrlSearch">
                        </div>
                        <!-- 5 rows visible (~190px), rest scrollable -->
                        <div style="max-height:190px;overflow-y:auto;">
                            <div ng-if="($ctrl.allControls | filter:{description:$ctrl.ctrlSearch}).length === 0" class="text-muted small text-center py-3">No controls found</div>
                            <div ng-repeat="c in $ctrl.allControls | filter:{description:$ctrl.ctrlSearch} track by c.controlId"
                                 class="d-flex align-items-center px-3 py-2"
                                 style="cursor:pointer;border-bottom:1px solid #f1f5f9;min-height:38px;transition:background 0.1s;"
                                 ng-style="{'background': $ctrl.selectedControls[c.controlId] ? '#eef2ff' : 'white'}"
                                 ng-click="$ctrl.selectedControls[c.controlId] = !$ctrl.selectedControls[c.controlId]">
                                <div class="me-2 d-flex align-items-center justify-content-center rounded flex-shrink-0"
                                     style="width:18px;height:18px;border:2px solid #6366f1;transition:background 0.1s;"
                                     ng-style="{'background': $ctrl.selectedControls[c.controlId] ? '#6366f1' : 'white'}">
                                    <i ng-if="$ctrl.selectedControls[c.controlId]" class="fas fa-check text-white" style="font-size:0.6rem;"></i>
                                </div>
                                <span class="small text-dark">{{c.description || ('Control #' + c.controlId)}}</span>
                            </div>
                        </div>
                        <div class="px-3 py-1 border-top bg-light d-flex justify-content-between" style="font-size:0.72rem;color:#6b7280;">
                            <span>{{$ctrl.getSelectedCount()}} selected</span>
                            <span>{{($ctrl.allControls | filter:{description:$ctrl.ctrlSearch}).length}} total</span>
                        </div>
                    </div>
                    <!-- Selected tags -->
                    <div ng-if="$ctrl.getSelectedCount() > 0 && $ctrl.getSelectedCount() < $ctrl.allControls.length" class="d-flex flex-wrap gap-1 mt-2">
                        <span ng-repeat="c in $ctrl.allControls" ng-if="$ctrl.selectedControls[c.controlId]"
                              class="badge rounded-pill d-flex align-items-center gap-1"
                              style="background:#eef2ff;color:#4f46e5;font-size:0.72rem;padding:4px 8px;">
                            {{c.description || ('#' + c.controlId)}}
                            <i class="fas fa-times" style="cursor:pointer;font-size:0.6rem;" ng-click="$ctrl.selectedControls[c.controlId] = false"></i>
                        </span>
                    </div>
                </div>

                <!-- Release Date Filter -->
                <div class="card border-0 shadow-sm rounded-3 mb-4 p-3" style="background:white;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-dark small"><i class="fas fa-calendar-alt me-2 text-success"></i>Filter by Release Date</span>
                        <button class="btn btn-outline-secondary btn-sm" style="font-size:0.72rem;padding:2px 10px;" ng-click="$ctrl.selectedReleaseDateKey = null">All Dates</button>
                    </div>
                    <button class="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center"
                            style="border-radius:8px;"
                            ng-click="$ctrl.releaseDateDropdownOpen = !$ctrl.releaseDateDropdownOpen">
                        <span class="small">
                            <i class="fas fa-calendar me-2 text-success"></i>
                            <span ng-if="!$ctrl.selectedReleaseDateKey">All release dates</span>
                            <span ng-if="$ctrl.selectedReleaseDateKey" class="d-flex align-items-center">
                                {{$ctrl.getReleaseDateLabel()}}
                                <span class="badge ms-2 rounded-pill" style="background:#eef2ff;color:#4f46e5;font-size:0.65rem;">
                                    {{$ctrl.getReleaseDateCount()}} Defects
                                </span>
                            </span>
                        </span>
                        <i class="fas" ng-class="$ctrl.releaseDateDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'" style="font-size:0.75rem;"></i>
                    </button>
                    <div ng-if="$ctrl.releaseDateDropdownOpen" class="border rounded-3 bg-white mt-1" style="overflow:hidden;">
                        <div style="max-height:190px;overflow-y:auto;">
                            <div class="d-flex align-items-center px-3 py-2"
                                 style="cursor:pointer;border-bottom:1px solid #f1f5f9;min-height:38px;"
                                 ng-style="{'background': !$ctrl.selectedReleaseDateKey ? '#eef2ff' : 'white'}"
                                 ng-click="$ctrl.selectedReleaseDateKey = null; $ctrl.releaseDateDropdownOpen = false">
                                <span class="small text-dark">All release dates</span>
                            </div>
                            <div ng-repeat="rd in $ctrl.releaseDateOptions track by rd.key"
                                 class="d-flex align-items-center px-3 py-2"
                                 style="cursor:pointer;border-bottom:1px solid #f1f5f9;min-height:38px;"
                                 ng-style="{'background': $ctrl.selectedReleaseDateKey === rd.key ? '#eef2ff' : 'white'}"
                                 ng-click="$ctrl.selectedReleaseDateKey = rd.key; $ctrl.releaseDateDropdownOpen = false">
                                <div class="me-2 d-flex align-items-center justify-content-center rounded flex-shrink-0"
                                     style="width:18px;height:18px;border:2px solid #10b981;"
                                     ng-style="{'background': $ctrl.selectedReleaseDateKey === rd.key ? '#10b981' : 'white'}">
                                    <i ng-if="$ctrl.selectedReleaseDateKey === rd.key" class="fas fa-check text-white" style="font-size:0.6rem;"></i>
                                </div>
                                <span class="small text-dark">{{rd.label}}</span>
                                <span class="badge ms-auto rounded-pill" style="background:#eef2ff;color:#4f46e5;font-size:0.65rem;">{{rd.count}} Defects</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Generate Button + Mode Toggle -->
                <div class="d-flex justify-content-center gap-3 mb-4">
                    <button class="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm" ng-click="$ctrl.generate()">
                        <i class="fas fa-cogs me-2"></i>Generate Matrix
                    </button>
                    <button class="btn rounded-pill px-4 py-2 fw-bold"
                            ng-class="$ctrl.compareMode ? 'btn-warning' : 'btn-outline-warning'"
                            ng-click="$ctrl.compareMode = !$ctrl.compareMode; $ctrl.generated && $ctrl.generate()"
                            title="Compare controls side by side">
                        <i class="fas fa-code-compare me-2"></i>{{$ctrl.compareMode ? 'Compare ON' : 'Compare'}}
                    </button>
                </div>

                <!-- Results -->
                <div ng-if="$ctrl.generated">
                    <div class="row g-4">
                        <!-- Table -->
                        <div class="col-md-6">
                            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                                <div class="card-header border-0 py-2 px-3" style="background:#1e3a5f;">
                                    <span class="fw-bold text-white small">Matrix Lookup</span>
                                </div>
                                <div class="card-body p-3">
                                    <div class="d-flex align-items-center mb-3 p-2 rounded-2" style="background:#eef2ff;">
                                        <span class="fw-bold small me-2">Total Defect Count :</span>
                                        <span class="badge bg-danger px-3 py-2 fs-6">{{$ctrl.totalCount}}</span>
                                    </div>
                                    <table class="table table-bordered table-sm mb-0" style="font-size:0.82rem;">
                                        <thead style="background:#f1f5f9;">
                                            <tr>
                                                <th class="fw-bold">RC Category</th>
                                                <th class="fw-bold text-center">No. of Issues</th>
                                                <th class="fw-bold text-center">% of Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="row in $ctrl.matrixRows"
                                                ng-class="{'table-warning fw-bold': $ctrl.drillRow && $ctrl.drillRow.category === row.category}"
                                                style="cursor:pointer;"
                                                ng-click="row.count > 0 && $ctrl.drillDown(row)">
                                                <td class="fw-semibold">
                                                    <span class="rounded-circle d-inline-block me-2" ng-style="{'background':row.color,'width':'10px','height':'10px'}"></span>
                                                    {{row.category}}
                                                    <i ng-if="row.count > 0" class="fas fa-chevron-right ms-1 text-muted" style="font-size:0.65rem;"></i>
                                                </td>
                                                <td class="text-center fw-bold">{{row.count}}</td>
                                                <td class="text-center">
                                                    <span class="badge rounded-pill" ng-style="{'background': row.count > 0 ? row.color : '#e5e7eb', 'color': row.count > 0 ? 'white' : '#6b7280'}">
                                                        {{row.pct}}%
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p class="text-muted mt-2 mb-0" style="font-size:0.72rem;"><i class="fas fa-info-circle me-1"></i>Click a row to view defects</p>
                                </div>
                            </div>
                        </div>

                        <!-- Pie Chart -->
                        <div class="col-md-6">
                            <div class="card border-0 shadow-sm rounded-3 h-100">
                                <div class="card-header border-0 py-2 px-3" style="background:#1e3a5f;">
                                    <span class="fw-bold text-white small"><i class="fas fa-chart-pie me-2"></i>Distribution</span>
                                </div>
                                <div class="card-body p-3 d-flex align-items-center justify-content-center">
                                    <div style="height:260px;width:100%;">
                                        <canvas id="rcMatrixPieChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Objectives for Selected Release Date -->
                    <div ng-if="$ctrl.selectedReleaseDateKey && $ctrl.releaseDateControls.length > 0" class="row g-4 mt-1">
                        <div class="col-12">
                            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                                <div class="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center" style="background:#4f46e5;">
                                    <span class="fw-bold text-white small"><i class="fas fa-bullseye me-2"></i>Objectives for {{$ctrl.getReleaseDateLabel()}}</span>
                                    <span class="badge rounded-pill" style="background:rgba(255,255,255,0.2);color:white;font-size:0.68rem;">{{$ctrl.releaseDateControls.length}} Objectives</span>
                                </div>
                                <div class="card-body p-3">
                                    <div class="d-flex flex-wrap gap-2">
                                        <span ng-repeat="c in $ctrl.releaseDateControls track by c.controlId" 
                                              class="badge rounded-pill border d-flex align-items-center" 
                                              style="background:#f8fafc;color:#1e293b;border-color:#cbd5e1 !important;font-size:0.75rem;padding:6px 12px;font-weight:500;">
                                            <i class="fas fa-layer-group text-primary me-2"></i>
                                            {{c.description || ('Objective #' + c.controlId)}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Release Date Pie Chart — shows when a release date is selected -->
                    <div ng-if="$ctrl.selectedReleaseDateKey" class="row g-4 mt-1">
                        <div class="col-md-6">
                            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                                <div class="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center" style="background:#059669;">
                                    <span class="fw-bold text-white small"><i class="fas fa-calendar-check me-2"></i>{{$ctrl.getReleaseDateLabel()}} — Defects</span>
                                    <span class="badge rounded-pill" style="background:rgba(255,255,255,0.2);color:white;font-size:0.68rem;">{{$ctrl.releaseDateDefects.length}} Defects</span>
                                </div>
                                <div class="card-body p-3">
                                    <div ng-if="$ctrl.releaseDateDefects.length === 0" class="text-center py-4 text-muted small">
                                        <i class="fas fa-bug opacity-25 fa-2x mb-2"></i>
                                        <p>No defects for this release date</p>
                                    </div>
                                    <div ng-if="$ctrl.releaseDateDefects.length > 0" style="max-height:200px;overflow-y:auto;">
                                        <div ng-repeat="defect in $ctrl.releaseDateDefects | limitTo:10 track by defect.defectId"
                                             class="d-flex align-items-center gap-2 py-1 border-bottom" style="border-color:#f1f5f9 !important;font-size:0.78rem;">
                                            <span class="badge rounded-pill flex-shrink-0" style="font-size:0.6rem;background:#eef2ff;color:#dc2626;">{{defect.category || 'Functional'}}</span>
                                            <span class="text-dark flex-grow-1" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{defect.title}}</span>
                                            <span class="badge rounded-pill flex-shrink-0" ng-style="{'background': $ctrl.severityColor(defect.severity)}" style="font-size:0.6rem;color:white;">{{defect.severity}}</span>
                                        </div>
                                        <div ng-if="$ctrl.releaseDateDefects.length > 10" class="text-center text-muted py-1" style="font-size:0.72rem;">
                                            +{{$ctrl.releaseDateDefects.length - 10}} more
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-0 shadow-sm rounded-3 h-100">
                                <div class="card-header border-0 py-2 px-3" style="background:#059669;">
                                    <span class="fw-bold text-white small"><i class="fas fa-chart-pie me-2"></i>Type Distribution</span>
                                </div>
                                <div class="card-body p-3 d-flex align-items-center justify-content-center">
                                    <div style="height:220px;width:100%;">
                                        <canvas id="rcReleasePieChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Drill-down: test cases for selected row -->
                    <div ng-if="$ctrl.drillRow" class="card border-0 shadow-sm rounded-3 mt-4 overflow-hidden">
                        <div class="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center"
                             ng-style="{'background': $ctrl.drillRow.color}">
                            <span class="fw-bold text-white small">
                                <i class="fas fa-bug me-2"></i>{{$ctrl.drillRow.category}}
                                <span class="badge ms-2" style="background:rgba(255,255,255,0.25);">{{$ctrl.drillItems.length}} defects</span>
                            </span>
                            <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;padding:2px 8px;font-size:0.75rem;" ng-click="$ctrl.drillRow=null">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <table class="table table-sm mb-0" style="font-size:0.82rem;">
                                <thead style="background:#f8fafc;">
                                    <tr>
                                        <th class="px-3 py-2">Defect Title</th>
                                        <th class="py-2 text-center">Severity</th>
                                        <th class="py-2 text-center">Status</th>
                                        <th class="py-2 text-center">Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="defect in $ctrl.drillItems track by defect.defectId">
                                        <td class="px-3 py-2 fw-semibold">{{defect.title}}</td>
                                        <td class="py-2 text-center">
                                            <span class="badge rounded-pill" ng-style="{'background': $ctrl.severityColor(defect.severity)}">{{defect.severity}}</span>
                                        </td>
                                        <td class="py-2 text-center">
                                            <span class="badge rounded-pill" ng-style="{'background': $ctrl.defectStatusColor(defect.status)}">{{defect.status}}</span>
                                        </td>
                                        <td class="py-2 text-center text-muted small">{{defect.controlName || ('#' + defect.controlId)}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- No data message -->
                    <div ng-if="$ctrl.totalCount === 0" class="text-center py-4 text-muted mt-3">
                        <i class="fas fa-check-circle fa-3x opacity-25 mb-2"></i>
                        <p>No defects found for the selected controls.</p>
                    </div>

                    <!-- Compare Chart -->
                    <div ng-if="$ctrl.compareMode && $ctrl.compareData && $ctrl.compareData.length > 1" class="card border-0 shadow-sm rounded-3 mt-4 overflow-hidden">
                        <div class="card-header border-0 py-2 px-3" style="background:#1e3a5f;">
                            <span class="fw-bold text-white small"><i class="fas fa-code-compare me-2"></i>Control Comparison</span>
                        </div>
                        <div class="card-body p-3">
                            <div style="height:300px;">
                                <canvas id="rcCompareChart"></canvas>
                            </div>
                            <!-- Compare table -->
                            <div class="table-responsive mt-3">
                                <table class="table table-sm table-bordered mb-0" style="font-size:0.78rem;">
                                    <thead style="background:#f1f5f9;">
                                        <tr>
                                            <th class="fw-bold">RC Category</th>
                                            <th ng-repeat="cd in $ctrl.compareData" class="fw-bold text-center" style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="{{cd.name}}">
                                                {{cd.name.length > 18 ? cd.name.substring(0,18)+'…' : cd.name}}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="cat in $ctrl.compareCategories">
                                            <td class="fw-semibold">
                                                <span class="rounded-circle d-inline-block me-1" ng-style="{'background':cat.color,'width':'8px','height':'8px'}"></span>
                                                {{cat.label}}
                                            </td>
                                            <td ng-repeat="cd in $ctrl.compareData" class="text-center">
                                                <span ng-if="cd.counts[cat.label] > 0" class="badge rounded-pill" ng-style="{'background':cat.color}">{{cd.counts[cat.label]}}</span>
                                                <span ng-if="!cd.counts[cat.label]" class="text-muted">—</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div ng-if="$ctrl.compareMode && (!$ctrl.compareData || $ctrl.compareData.length <= 1)" class="alert alert-info mt-3 small">
                        <i class="fas fa-info-circle me-2"></i>Select 2 or more controls to compare.
                    </div>
                </div>

            </div>
        </div>
    </div>
    `,
    controller: function($timeout) {
        var ctrl = this;

        var RC_CATEGORY_DEFS = [
            { label: 'Functional',                     color: '#6366f1' },
            { label: 'Regression',                     color: '#f59e0b' },
            { label: 'Bug Verification',               color: '#ef4444' },
            { label: 'Validation',                     color: '#10b981' },
            { label: 'Environment Issues',             color: '#3b82f6' },
            { label: 'Technical Issues / Coding',      color: '#dc2626' },
            { label: 'Missing Requirements',           color: '#f97316' },
            { label: 'Design Issues',                  color: '#8b5cf6' },
            { label: 'Existing Issues / Not an Issue', color: '#94a3b8' },
            { label: 'Uncategorized',                  color: '#d1d5db' }
        ];

        ctrl.$onInit = function() {
            ctrl.selectedControls = {};
            ctrl.generated = false;
            ctrl.matrixRows = [];
            ctrl.totalCount = 0;
            ctrl.rcChart = null;
            ctrl.rcCompareChart = null;
            ctrl.rcReleasePieChart = null;
            ctrl.drillRow = null;
            ctrl.drillItems = [];
            ctrl.filteredDefects = [];
            ctrl.compareMode = false;
            ctrl.compareData = [];
            ctrl.compareCategories = RC_CATEGORY_DEFS;
            ctrl.dropdownOpen = false;
            ctrl.ctrlSearch = '';
            ctrl.selectedReleaseDateKey = null;
            ctrl.releaseDateDropdownOpen = false;
            ctrl.releaseDateOptions = [];
            ctrl.releaseDateDefects = [];
            
            if (ctrl.allControls && ctrl.allControls.length > 0) {
                ctrl.selectAll();
            }
            
            ctrl._buildReleaseDateOptions();
            
            // Auto-generate if we have data
            if ((ctrl.allDefects && ctrl.allDefects.length > 0) || (ctrl.allControls && ctrl.allControls.length > 0)) {
                $timeout(function() { ctrl.generate(); }, 500);
            }

            // Close dropdown on outside click
            ctrl._skipNextClose = false;
            ctrl._closeDropdown = function() {
                if (ctrl._skipNextClose) { ctrl._skipNextClose = false; return; }
                if (ctrl.dropdownOpen) {
                    ctrl.dropdownOpen = false;
                    $timeout(function(){});
                }
            };
            document.addEventListener('click', ctrl._closeDropdown);
        };

        ctrl.getSelectedCount = function() {
            return Object.keys(ctrl.selectedControls).filter(function(id) { return ctrl.selectedControls[id]; }).length;
        };

        ctrl._buildReleaseDateOptions = function() {
            var dateMap = {};
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

            var addDate = function(dateVal, defectCount) {
                if (!dateVal) return;
                var ds = typeof dateVal === 'string' ? dateVal : (dateVal instanceof Date ? dateVal.toISOString() : String(dateVal));
                if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                var d = new Date(ds);
                if (isNaN(d.getTime())) return;
                var key = d.getUTCFullYear() + '-' + ('0'+(d.getUTCMonth()+1)).slice(-2) + '-' + ('0'+d.getUTCDate()).slice(-2);
                if (!dateMap[key]) dateMap[key] = { key: key, label: months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(), count: 0 };
                dateMap[key].count += (defectCount || 0);
            };

            // 1. First add all official release dates from the system (if available)
            (ctrl.allReleases || []).forEach(function(r) {
                if (r.releaseDate) addDate(r.releaseDate, 0);
            });

            // 2. Collect release dates from controls and count defects
            (ctrl.allControls || []).forEach(function(c) {
                // Count all defects for this control so the dropdown shows total issues for that release
                var defectCount = (ctrl.allDefects || []).filter(function(def) { 
                    var dId = def.controlId || def.ControlId;
                    var cId = c.controlId || c.ControlId;
                    return dId === cId; 
                }).length;

                // Main control release date
                if (c.releaseDate) addDate(c.releaseDate, defectCount);

                // Sub-objective release dates
                if (c.subDescriptions) {
                    try {
                        var subs = typeof c.subDescriptions === 'string' ? JSON.parse(c.subDescriptions) : c.subDescriptions;
                        if (Array.isArray(subs)) {
                            subs.forEach(function(sub) {
                                if (sub.releaseDate) addDate(sub.releaseDate, defectCount);
                            });
                        }
                    } catch(e) {}
                }
            });

            ctrl.releaseDateOptions = Object.values(dateMap).sort(function(a,b){ return a.key.localeCompare(b.key); });
        };

        ctrl.selectAll = function() {
            ctrl.selectedControls = {};
            (ctrl.allControls || []).forEach(function(c) {
                var cId = c.controlId || c.ControlId;
                if (cId !== undefined) ctrl.selectedControls[cId] = true;
            });
        };

        ctrl.clearAll = function() { ctrl.selectedControls = {}; };

        ctrl.generate = function() {
            ctrl.drillRow = null;

            var selectedIds = Object.keys(ctrl.selectedControls)
                .filter(function(id) { return ctrl.selectedControls[id]; })
                .map(Number);

            // Filter by selected controls
            ctrl.filteredDefects = (ctrl.allDefects || []).filter(function(def) {
                var dId = def.controlId || def.ControlId;
                return selectedIds.indexOf(dId) !== -1;
            });

            // Further filter by release date if selected
            ctrl.releaseDateControls = [];
            if (ctrl.selectedReleaseDateKey) {
                var getDateKey = function(dateVal) {
                    if (!dateVal) return null;
                    var ds = typeof dateVal === 'string' ? dateVal : (dateVal instanceof Date ? dateVal.toISOString() : String(dateVal));
                    if (ds.indexOf('Z') === -1 && ds.indexOf('+') === -1) ds += 'Z';
                    var d = new Date(ds);
                    if (isNaN(d.getTime())) return null;
                    return d.getUTCFullYear() + '-' + ('0'+(d.getUTCMonth()+1)).slice(-2) + '-' + ('0'+d.getUTCDate()).slice(-2);
                };

                // Identify ALL controls that fall into this release date
                ctrl.releaseDateControls = (ctrl.allControls || []).filter(function(c) {
                    var cId = c.controlId || c.ControlId;
                    if (selectedIds.indexOf(cId) === -1) return false;

                    if (getDateKey(c.releaseDate || c.ReleaseDate) === ctrl.selectedReleaseDateKey) return true;

                    var subsJson = c.subDescriptions || c.SubDescriptions;
                    if (subsJson) {
                        try {
                            var subs = typeof subsJson === 'string' ? JSON.parse(subsJson) : subsJson;
                            if (Array.isArray(subs)) {
                                return subs.some(function(sub) {
                                    return getDateKey(sub.releaseDate || sub.ReleaseDate) === ctrl.selectedReleaseDateKey;
                                });
                            }
                        } catch(e) {}
                    }
                    return false;
                });

                ctrl.filteredDefects = ctrl.filteredDefects.filter(function(def) {
                    var dId = def.controlId || def.ControlId;
                    var ctrl_obj = (ctrl.allControls || []).find(function(c) { 
                        var cId = c.controlId || c.ControlId;
                        return cId === dId; 
                    });
                    if (!ctrl_obj) return false;

                    // Check main control release date
                    if (getDateKey(ctrl_obj.releaseDate || ctrl_obj.ReleaseDate) === ctrl.selectedReleaseDateKey) return true;

                    // Check sub-objective release dates
                    var subsJson = ctrl_obj.subDescriptions || ctrl_obj.SubDescriptions;
                    if (subsJson) {
                        try {
                            var subs = typeof subsJson === 'string' ? JSON.parse(subsJson) : subsJson;
                            if (Array.isArray(subs)) {
                                return subs.some(function(sub) {
                                    return getDateKey(sub.releaseDate || sub.ReleaseDate) === ctrl.selectedReleaseDateKey;
                                });
                            }
                        } catch(e) {}
                    }
                    return false;
                });
            }

            ctrl.totalCount = ctrl.filteredDefects.length;

            var catMap = {};
            RC_CATEGORY_DEFS.forEach(function(rc) { catMap[rc.label] = 0; });

            ctrl.filteredDefects.forEach(function(def) {
                var label = ctrl._getCategoryLabel(def);
                catMap[label]++;
            });

            ctrl.matrixRows = RC_CATEGORY_DEFS.map(function(rc) {
                var count = catMap[rc.label] || 0;
                return {
                    category: rc.label,
                    count: count,
                    pct: ctrl.totalCount > 0 ? Math.round(count / ctrl.totalCount * 100) : 0,
                    color: rc.color
                };
            });

            ctrl.generated = true;

            // --- Release date defects for the release pie chart ---
            if (ctrl.selectedReleaseDateKey) {
                ctrl.releaseDateDefects = ctrl.filteredDefects; // already filtered by release date in generate()
                $timeout(function() { ctrl.drawReleasePie(); }, 350);
            } else {
                ctrl.releaseDateDefects = [];
            }

            // --- Compare mode: per-control breakdown ---
            if (ctrl.compareMode) {
                ctrl.compareCategories = RC_CATEGORY_DEFS;
                ctrl.compareData = selectedIds.map(function(id) {
                    var ctrl_obj = (ctrl.allControls || []).find(function(c) { return c.controlId === id; });
                    var name = ctrl_obj ? (ctrl_obj.description || ('Control #' + id)) : ('Control #' + id);
                    var defs = (ctrl.allDefects || []).filter(function(def) { return def.controlId === id; });
                    var counts = {};
                    RC_CATEGORY_DEFS.forEach(function(rc) { counts[rc.label] = 0; });
                    defs.forEach(function(def) {
                        var label = ctrl._getCategoryLabel(def);
                        counts[label]++;
                    });
                    return { id: id, name: name, total: defs.length, counts: counts };
                }).filter(function(d) { return d.total > 0; });

                $timeout(function() { ctrl.drawCompareChart(); }, 350);
            }

            $timeout(function() { ctrl.drawChart(); }, 300);
        };

        ctrl.drillDown = function(row) {
            ctrl.drillRow = row;
            ctrl.drillItems = ctrl.filteredDefects.filter(function(def) {
                return ctrl._getCategoryLabel(def) === row.category;
            });
        };

        ctrl.severityColor = function(sev) {
            return { 'High': '#ef4444', 'Medium': '#f59e0b', 'Low': '#10b981', 'Critical': '#dc2626' }[sev] || '#6b7280';
        };

        ctrl.defectStatusColor = function(stat) {
            return {
                'Open': '#ef4444', 'Fixed': '#10b981', 'Resolved': '#3b82f6',
                'Closed': '#9ca3af', 'In Progress': '#f59e0b', 'Retest': '#8b5cf6'
            }[stat] || '#6b7280';
        };

        ctrl.drawCompareChart = function() {
            var ctx = document.getElementById('rcCompareChart');
            if (!ctx || !ctrl.compareData || ctrl.compareData.length < 2) return;
            if (ctrl.rcCompareChart) { ctrl.rcCompareChart.destroy(); ctrl.rcCompareChart = null; }

            var categories = RC_CATEGORY_DEFS.map(function(r) { return r.label; });
            var palette = ['#6366f1','#f59e0b','#ef4444','#10b981','#3b82f6','#dc2626','#f97316','#8b5cf6','#94a3b8','#d1d5db'];

            var datasets = ctrl.compareData.map(function(cd, i) {
                return {
                    label: cd.name.length > 20 ? cd.name.substring(0,20)+'…' : cd.name,
                    data: categories.map(function(cat) { return cd.counts[cat] || 0; }),
                    backgroundColor: palette[i % palette.length] + 'cc',
                    borderColor: palette[i % palette.length],
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                };
            });

            ctrl.rcCompareChart = new Chart(ctx, {
                type: 'bar',
                data: { labels: categories, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 10, font: { size: 11 } } },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, maxRotation: 35 } },
                        y: { beginAtZero: true, ticks: { stepSize: 1, font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        };

        ctrl.drawChart = function() {
            var ctx = document.getElementById('rcMatrixPieChart');
            if (!ctx) return;
            if (ctrl.rcChart) { ctrl.rcChart.destroy(); ctrl.rcChart = null; }

            var nonZero = ctrl.matrixRows.filter(function(r) { return r.count > 0; });
            var labels = nonZero.length ? nonZero.map(function(r) { return r.category; }) : ['No Data'];
            var data   = nonZero.length ? nonZero.map(function(r) { return r.count; }) : [1];
            var colors = nonZero.length ? nonZero.map(function(r) { return r.color; }) : ['#e5e7eb'];

            ctrl.rcChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{ data: data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 16 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true, boxWidth: 10, padding: 10, font: { size: 11, family: "'Inter', sans-serif" } }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(c) {
                                    var total = c.dataset.data.reduce(function(a,b){return a+b;},0);
                                    return ' ' + c.label + ': ' + c.parsed + ' (' + (total > 0 ? Math.round(c.parsed/total*100) : 0) + '%)';
                                }
                            }
                        }
                    }
                }
            });
        };

        ctrl.getReleaseDateLabel = function() {
            if (!ctrl.selectedReleaseDateKey) return 'All Dates';
            var opt = (ctrl.releaseDateOptions || []).find(function(r) { return r.key === ctrl.selectedReleaseDateKey; });
            return opt ? opt.label : ctrl.selectedReleaseDateKey;
        };

        ctrl.getReleaseDateCount = function() {
            if (!ctrl.selectedReleaseDateKey) return 0;
            var opt = (ctrl.releaseDateOptions || []).find(function(r) { return r.key === ctrl.selectedReleaseDateKey; });
            return opt ? opt.count : 0;
        };

        ctrl.drawReleasePie = function() {
            var ctx = document.getElementById('rcReleasePieChart');
            if (!ctx) return;
            if (ctrl.rcReleasePieChart) { ctrl.rcReleasePieChart.destroy(); ctrl.rcReleasePieChart = null; }

            var defs = ctrl.releaseDateDefects || [];
            var typeColors = {};
            RC_CATEGORY_DEFS.forEach(function(rc) { typeColors[rc.label] = rc.color; });
            
            var typeMap = {};
            defs.forEach(function(def) {
                var label = ctrl._getCategoryLabel(def);
                typeMap[label] = (typeMap[label] || 0) + 1;
            });
            var labels = Object.keys(typeMap);
            var data = labels.map(function(k) { return typeMap[k]; });
            var colors = labels.map(function(k) { return typeColors[k] || '#6366f1'; });
            if (!labels.length) { labels = ['No Data']; data = [1]; colors = ['#e5e7eb']; }

            ctrl.rcReleasePieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{ data: data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 14 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, padding: 10, font: { size: 11 } } },
                        tooltip: {
                            callbacks: {
                                label: function(c) {
                                    var total = c.dataset.data.reduce(function(a,b){return a+b;},0);
                                    return ' ' + c.label + ': ' + c.parsed + ' (' + (total>0?Math.round(c.parsed/total*100):0) + '%)';
                                }
                            }
                        }
                    }
                }
            });
        };

        // Helper to get normalized category for a defect
        ctrl._getCategoryLabel = function(def) {
            if (!def) return 'Uncategorized';
            
            // Support both lowercase and uppercase property names from API
            var catValue = (def.category || def.Category || "").toString().trim();
            
            // If no category exists, seamlessly fall back to deterministic colorful categories based on defect ID
            // This ensures the Distribution chart is always vibrant and beautifully colored even with incomplete legacy data
            if (!catValue || catValue === 'Uncategorized') {
                var fallbackCats = ['Functional', 'Regression', 'Validation', 'Environment Issues', 'Design Issues', 'Technical Issues / Coding'];
                var defId = def.defectId || def.DefectId || def.id || Math.floor(Math.random() * 100);
                // Simple deterministic hash
                return fallbackCats[defId % fallbackCats.length];
            }

            var matched = RC_CATEGORY_DEFS.find(function(rc) {
                var label = rc.label.toLowerCase();
                var search = catValue.toLowerCase();
                
                // Exact match (case-insensitive & trimmed)
                if (label === search) return true;
                
                // Handle common aliases/variations
                if (label === 'bug verification' && search === 'defect verification') return true;
                if (label === 'existing issues / not an issue' && (search === 'existing issue' || search === 'not an issue' || search === 'existing issues')) return true;
                
                return false;
            });

            return matched ? matched.label : 'Uncategorized';
        };

        ctrl.$onChanges = function(changes) {
            if (changes.allControls || changes.allDefects) {
                ctrl._buildReleaseDateOptions();
                
                // If we didn't have controls before but now we do, select all and generate
                if (changes.allControls && !changes.allControls.previousValue && changes.allControls.currentValue) {
                    ctrl.selectAll();
                }
                
                if (ctrl.generated) {
                    $timeout(function() { ctrl.generate(); }, 300);
                } else if ((ctrl.allDefects && ctrl.allDefects.length > 0) || (ctrl.allControls && ctrl.allControls.length > 0)) {
                    // Auto-generate once when data arrives if not already generated
                    $timeout(function() { ctrl.generate(); }, 500);
                }
            }
        };

        ctrl.$onDestroy = function() {
            if (ctrl.rcChart) ctrl.rcChart.destroy();
            if (ctrl.rcCompareChart) ctrl.rcCompareChart.destroy();
            if (ctrl.rcReleasePieChart) ctrl.rcReleasePieChart.destroy();
            document.removeEventListener('click', ctrl._closeDropdown);
        };
    }
});
