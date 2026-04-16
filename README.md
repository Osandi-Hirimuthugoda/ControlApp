# Control App — SDLC Management Platform

> A comprehensive end-to-end Software Development Lifecycle (SDLC) management platform for teams. Manage controls, track defects, execute test cases, monitor daily progress, and collaborate in real-time all in one place.

---

## Documentation

| Document | Description |
|----------|-------------|
| **[ Documentation Site](docs/index.html)** | Full interactive documentation website — all diagrams, role guides, API reference, workflows, and setup in one beautiful site. Open in your browser. |
| **[ User Manual](docs/USER_MANUAL.md)** | Complete guide covering every feature — registration, dashboards, controls board, QA testing, defect management, RC Matrix, release hub, activity logs, and more. Includes ER diagrams, class diagrams, use case diagrams, and system workflow diagrams. |
| **[README.md](README.md)** | Project overview, technology stack, setup, and API reference (this file) |

---

##  Feature Overview

###  Core SDLC Management
- **System Controls Board** — Create controls with full WBS (Work Breakdown Structure); manage sub-objectives with inline editing, status tracking, comments (insights), and progress %
- **Role-Based Dashboards** — Every role sees a uniquely tailored Command Center: PM Executive view, Lead pipeline view, Developer task view, QA queue view
- **Release Hub** — Plan and track releases with a monthly calendar; auto-create releases from control target dates
- **RC Matrix** — Root Cause Matrix for test case type analysis; drill-down by category; multi-control compare mode with side-by-side bar charts

###  Quality Assurance
- **Test Case Management** — Create test cases (Functional / Regression / Bug Verification / Validation); quick-add inline bar for QA; Pass / Fail / Reset execution; actual result capture
- **Defect Tracking** — Full defect lifecycle (Open → In Dev → Fixed → Re-Open → Closed); 9 defect categories; up to 5 screenshot attachments; per-transition duration badges; status timeline visual
- **Defect Resolution Flow** — Developers see a read-only defect view with restricted status options; QA gets full edit access; both receive real-time push notifications on changes

###  Real-Time Collaboration
- **SignalR Notifications** — Instant push notifications for defect assignments, status changes, test case failures, and QA assignments; no page refresh needed
- **Notification Bell** — Per-user notification inbox with unread count badge, "time ago" timestamps, clear all, and direct navigation to linked defects
- **My Defects Inbox** — Dedicated tab showing all active defects assigned to the current user

###  Analytics & Reporting
- **Daily Progress Tracking** — Date-based progress log viewer with summary stats (Total Objectives, Updated Today, Avg Progress, Daily Update Rate); circular progress indicators
- **Weekly Summary** — Mon–Sun summary cards per week showing updates count + average progress
- **Dashboard Charts** — Chart.js pie charts for sub-objective status distribution and release health
- **Activity & Audit Log** — Full timeline of actions on defects and test cases; old→new value badges; performed-by tracking

###  Team & Administration
- **Multi-Team Support** — Users can belong to multiple teams; Team Switcher in NavBar instantly re-scopes all data
- **Super Admin Panel** — Company-wide stats, per-team breakdown cards, role permission matrix (9 permissions × 8 roles), per-user permission overrides, cross-team access management
- **Employee Registration** — Create employee records linked to user accounts; role assignment; team provisioning
- **Control Types** — Define and manage SDLC categories (API, UI, Database, etc.) used to classify controls

###  Security
- **JWT Authentication** — All API requests require a valid Bearer token
- **BCrypt Password Hashing** — Passwords never stored in plain text
- **Soft Delete** — All entities use `ISDeleted` flag; nothing is permanently destroyed
- **RBAC** — Role checks enforced at both UI layer and API controller layer

---

##  User Roles

> v2.0 introduces **3 new roles** — Release Manager, Security Auditor, and Business Analyst — bringing the total to **11 roles**.

| Role | Access Level | Primary Responsibilities |
|------|-------------|--------------------------|
| **Super Admin** |  System-wide | Manage all teams, configure role permissions, company-wide analytics |
| **Admin** |  Team-scope | Register employees, manage controls, releases |
| **Project Manager** |  Executive | View aggregate KPIs, resource workloads |
| **Software Architect** |  Technical Lead | Design WBS, assign developers, monitor flow |
| **Team Lead** |  Operational | Assign controls, manage sub-objectives, monitor team |
| **Developer** |  Task Execution | Update sub-objectives, resolve defects, log progress |
| **QA Engineer** |  Quality | Create/execute test cases, raise defects, verify fixes |
| **Intern** |  Restricted | View and limited execution based on team config |
| **Release Manager** ✦ NEW |  Release Pipeline | Manage releases, Release Hub calendar, deployment planning, report generation |
| **Security Auditor** ✦ NEW |  Read-only Audit | View all activity logs, audit defect/test history, export compliance reports |
| **Business Analyst** ✦ NEW |  Requirements | Add controls, edit sub-objectives, add insights, view dashboards and RC Matrix |

> **See the full permission matrix** in the [Documentation Site](docs/index.html#roles) or [User Manual](docs/USER_MANUAL.md#7-user-roles--permissions).

---

##  Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **.NET / C#** | 8.0 | Core runtime and language |
| **ASP.NET Core** | 8.0 | REST API framework |
| **Entity Framework Core** | 8.0 | ORM — database access |
| **SQL Server** | 2022 | Relational database |
| **SignalR** | built-in | Real-time WebSocket communication |
| **BCrypt.Net** | — | Password hashing |
| **JWT Bearer** | — | Token-based authentication |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **AngularJS** | 1.8.3 | SPA framework |
| **Bootstrap** | 5.3.0 | Responsive UI components |
| **Font Awesome** | 6.4.0 | Icon library |
| **Chart.js** | 4.4.0 | Pie/bar/doughnut charts |
| **SweetAlert2** | — | Confirmation dialogs and alerts |

---

##  Prerequisites

- **.NET 8.0 SDK** or later
- **SQL Server 2022** (or SQL Server Express)
- **Modern browser**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Control_App
```

### 2. Configure the Database

Edit `ControlApp.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ControlDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "your-super-secret-key-min-32-chars",
    "Issuer": "ControlApp",
    "Audience": "ControlAppUsers"
  }
}
```

### 3. Apply Database Migrations

```bash
cd ControlApp.API
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

App available at: **`http://localhost:5088`**

---

##  Project Structure

```
Control_App/
├── ControlApp.API/
│   ├── Controllers/          # REST API endpoints
│   ├── Services/             # Business logic layer
│   ├── Repositories/         # Data access (EF Core)
│   ├── Models/               # Entity models (14 models)
│   │   ├── User.cs
│   │   ├── Employee.cs
│   │   ├── Team.cs
│   │   ├── UserTeam.cs
│   │   ├── Controls.cs
│   │   ├── ControlType.cs
│   │   ├── Status.cs
│   │   ├── Defect.cs
│   │   ├── TestCase.cs
│   │   ├── ProgressLog.cs
│   │   ├── ActivityLog.cs
│   │   ├── Release.cs
│   │   ├── Insight.cs
│   │   └── ISoftDelete.cs
│   ├── DTOs/                 # Data transfer objects
│   ├── Hubs/                 # SignalR hub (NotificationHub)
│   ├── Migrations/           # EF Core migration history
│   ├── Data/                 # AppDbContext
│   ├── Program.cs            # App startup + middleware config
│   └── wwwroot/              # Frontend (AngularJS SPA)
│       ├── components/       # 26 AngularJS components
│       ├── services/         # api.service.js, auth.service.js, etc.
│       └── index.html        # SPA entry point
├── docs/
│   └── USER_MANUAL.md        # Complete user documentation
└── README.md
```

---

##  Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| **Users** | Login accounts (username, email, BCrypt hash, role, JWT) |
| **Employees** | Employee profiles linked to Users; team assignment |
| **Teams** | Team records with Architect, PM, TeamLead FKs |
| **UserTeam** | Many-to-many: User ↔ Team memberships |
| **Controls** | SDLC work items with sub-objectives (JSON), type, status, progress |
| **ControlTypes** | Categories for classifying controls |
| **Status** | Lookup table for control/sub-objective statuses |
| **Defects** | Bug reports linked to Controls with severity, category, attachments |
| **TestCases** | QA test cases linked to Controls (+ sub-objective index) |
| **ProgressLogs** | Daily progress snapshots per employee per control |
| **ActivityLogs** | Audit trail for defect and test case actions |
| **Releases** | Release records with planned dates |
| **Insights** | Comment threads on sub-objectives |

### Key Relationships

```
User ──── UserTeam ──── Team
 │                       │
Employee ─────────────── │
 │                       │
 └── Controls ──── ControlType
         │   └── Status
         │   └── Release
         ├── Defects
         ├── TestCases ──── Defects (link)
         ├── ProgressLogs
         ├── ActivityLogs
         └── Insights
```

---

##  Authentication & First Login

After running migrations, create the first account:

1. Navigate to `http://localhost:5088`
2. Click **Register** (visible on the login page)
3. Create an **Admin** account first
4. Use that Admin account to register other team members

> **Super Admin** accounts are created directly in the database by setting `IsSuperAdmin = true` on the `Users` table.

---

##  Key API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate; returns JWT token |
| `POST` | `/api/auth/register` | Register new user + employee |

### Controls
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/controls?teamId=` | List controls for a team |
| `POST` | `/api/controls` | Create a new control |
| `PUT` | `/api/controls/{id}` | Update control details |
| `DELETE` | `/api/controls/{id}` | Soft-delete a control |

### Defects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/defects/by-control/{id}` | Defects for a control |
| `POST` | `/api/defects` | Create a defect |
| `PUT` | `/api/defects/{id}` | Update defect (status, assignee, notes) |
| `DELETE` | `/api/defects/{id}` | Soft-delete a defect |

### Test Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/testcases/by-control/{id}` | Test cases for a control |
| `POST` | `/api/testcases` | Create a test case |
| `PUT` | `/api/testcases/{id}` | Update test case (status, result) |
| `DELETE` | `/api/testcases/{id}` | Delete a test case |

### Progress & Activity
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progresslog/daily-summary` | Daily progress summary |
| `GET` | `/api/progresslog/weekly-summary` | Weekly progress breakdown |
| `GET` | `/api/activitylogs/by-control/{id}` | Activity log for a control |

### Teams & Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teams` | List all teams |
| `POST` | `/api/teams` | Create a team |
| `GET` | `/api/employees?teamId=` | Employees in a team |
| `POST` | `/api/teams/{id}/members/{userId}` | Add user to team |
| `DELETE` | `/api/teams/{id}/members/{userId}` | Remove user from team |

### Super Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teams/dashboard-stats` | Company-wide analytics |

---

##  Defect Statuses

```
Open → In Dev → Fixed → Re-Open → Closed
              ↘ Not a Defect
              ↘ Deferred
              ↘ Duplicate
```

| Status | Set By | Meaning |
|--------|--------|---------|
| **Open** | QA | Newly reported, unassigned |
| **In Dev** | Developer | Developer started working on fix |
| **Fixed** | Developer | Fix implemented, awaiting QA verification |
| **Re-Open** | QA | Fix failed verification |
| **Not a Defect** | Developer | Determined to be expected behaviour |
| **Deferred** | Developer | Postponed to a future release |
| **Duplicate** | Developer | Already reported elsewhere |
| **Closed** | QA | Verified fixed and sign-off complete |

---

##  Sub-Objective Statuses

| Status | Phase |
|--------|-------|
| **Analyze** | Planning |
| **Development** | Active coding |
| **Dev Testing** | Developer self-test |
| **Ready for QA** | Handover to QA |
| **QA** | Under QA testing |
| **Completed** | Done  |

---

##  SignalR Real-Time Events

| Event | Sent To | Trigger |
|-------|---------|---------|
| `defectAssigned` | Assigned developer | QA assigns a defect |
| `defectStatusChanged` | Involved parties | Developer updates defect status |
| `testCaseFailed` | Related developer | Test case marked Fail |
| `qaAssigned` | Newly assigned QA | Sub-objective owner set to QA Engineer |

---

##  Deployment

### Production Build

```bash
dotnet publish -c Release -o ./publish
```

### Environment Variables

```bash
ASPNETCORE_ENVIRONMENT=Production
# Or set in appsettings.Production.json
```

`appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=PROD_SERVER;Database=ControlDB;..."
  },
  "Jwt": {
    "Key": "STRONG_SECRET_KEY_32_CHARS_MIN",
    "Issuer": "ControlApp",
    "Audience": "ControlAppUsers"
  }
}
```

### Hosting Options
- **IIS** on Windows Server
- **Azure App Service** (recommended)
- **Docker** (containerise with `dotnet publish`)

---

##  Troubleshooting

| Problem | Solution |
|---------|---------|
| **Cannot connect to SQL Server** | Check `DefaultConnection` string; ensure SQL Server is running; add `TrustServerCertificate=True` |
| **Migration fails** | Run `dotnet tool install --global dotnet-ef`, then `dotnet clean && dotnet build && dotnet ef database update` |
| **SignalR not connecting** | Check browser console for WebSocket errors; verify JWT is valid; ensure CORS is configured in `Program.cs` |
| **Login fails** | Verify user exists; clear browser cache; check JWT config in `appsettings.json` |
| **Port 5088 in use** | `netstat -ano \| findstr :5088` → `taskkill /PID <id> /F`, or change port in `launchSettings.json` |
| **Notifications not arriving** | Refresh page; check SignalR hub URL; ensure authenticated session is active |

---

##  Manual Testing Checklist

- [ ] Register first Admin account
- [ ] Create a team and assign employees
- [ ] Create a Control with sub-objectives
- [ ] Assign developer and QA to sub-objectives
- [ ] Change sub-objective status → verify notification delivered
- [ ] Add a test case → mark as Fail → raise a defect
- [ ] Developer resolves defect → QA closes it
- [ ] Check Activity Log for full trail
- [ ] Open RC Matrix → generate and compare
- [ ] Open Daily Progress → verify summary stats
- [ ] Toggle Weekly Summary
- [ ] Super Admin: modify permission matrix → verify effect after re-login

---

##  Project Statistics

| Metric | Value |
|--------|-------|
| **AngularJS Components** | 26 |
| **Backend Models** | 14 |
| **API Endpoints** | 50+ |
| **Database Tables** | 13 core tables |
| **User Roles** | 11 (3 new in v2.0) |
| **Defect Statuses** | 8 |
| **Sub-Objective Statuses** | 6 |
| **RC Categories** | 10 |
| **Real-time Events** | 4 SignalR events |
| **Max Screenshot Attachments** | 5 per defect |
| **Permissions in Matrix** | 16 permissions × 11 roles |

---

##  Version History

| Version | Changes |
|---------|---------|
| **v1.0** | Core controls board, user auth, basic role management |
| **v1.1** | SignalR real-time notifications for defect assignments |
| **v1.2** | Enhanced defect management; status filtering; screenshot uploads |
| **v1.3** | Test case management; QA quick-add; pass/fail execution flow |
| **v1.4** | Activity Log tab; defect duration badges; status timeline visual |
| **v2.0** | PM Executive Dashboard; RC Matrix with compare mode; Weekly Progress; Daily Update Rate; improved defect role-specific edit forms; per-user permission overrides; multi-team cross-access; **3 new roles** (Release Manager, Security Auditor, Business Analyst); comprehensive User Manual; **full interactive documentation site** with all architecture, ER, class, use case, and workflow diagrams |

---

##  Browser Support

| Browser | Support |
|---------|---------|
|  Chrome 90+ | Full |
|  Firefox 88+ | Full |
|  Edge 90+ | Full |
|  Safari 14+ | Full |
|  Internet Explorer | Not supported |
|  Mobile | Responsive; mobile-optimised NavBar |

---

##  Security Checklist

-  JWT Bearer authentication on all API routes
-  BCrypt password hashing (never plain text)
-  Soft delete — no data permanently destroyed
-  Role-based authorization at controller level (`[Authorize(Roles=...)]`)
-  RBAC enforced at UI level (features hidden per role)
-  CORS policy configured in `Program.cs`
-  EF Core parameterised queries — SQL injection prevention
-  SignalR session verified on hub connection
-  HTTPS enforcement in production

---

##  External References

- [ASP.NET Core 8 Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/)
- [AngularJS Guide](https://docs.angularjs.org/guide)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

### Useful EF Core Commands
```bash
# Add new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# Drop database (⚠️ careful!)
dotnet ef database drop
```

---

##  License

Copyright © 2026 Virtusa. All rights reserved.

This software is proprietary and confidential. Unauthorised copying, distribution, or use of this software, via any medium, is strictly prohibited.

---

**Built with for efficient team collaboration and quality software delivery**

*Last Updated: April 2026 — v2.0*
