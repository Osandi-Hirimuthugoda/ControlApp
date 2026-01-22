# Employee Control Management System

A comprehensive web application for managing software development controls, test cases, defects, and team progress tracking with real-time notifications.

## 🚀 Features

### Core Functionality
- **Control Management**: Create, assign, and track software development controls
- **Test Case Management**: Define and execute test cases for quality assurance
- **Defect Tracking**: Report, assign, and track defects with status updates
- **Real-time Notifications**: SignalR-powered instant notifications for team collaboration
- **Progress Tracking**: Monitor daily progress and team performance
- **Multi-team Support**: Manage multiple teams with role-based access control
- **Release Management**: Track controls across different releases

### User Roles
- **Super Admin**: Full system access and configuration
- **Admin**: Team management and oversight
- **Team Lead**: Team coordination and progress monitoring
- **Software Architect**: Technical oversight and control management
- **Developer**: Control implementation and defect resolution
- **QA Engineer**: Test case execution and defect reporting
- **Intern Developer/QA**: Limited access for training purposes

### Key Features
- 📊 **Dashboard Analytics**: Visual insights into team performance and progress
- 🔔 **Real-time Notifications**: Instant updates on defect assignments and status changes
- 🐛 **Defect Management**: Complete defect lifecycle with status tracking and resolution notes
- ✅ **Test Case Execution**: Structured testing with pass/fail tracking
- 📈 **Progress Monitoring**: Daily progress logs and team statistics
- 🔐 **JWT Authentication**: Secure user authentication and authorization
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **.NET 8.0**: Modern C# framework
- **ASP.NET Core 8.0**: Web API framework
- **Entity Framework Core 8.0**: ORM for database operations
- **SQL Server 2022**: Relational database
- **SignalR**: Real-time communication
- **JWT Authentication**: Secure token-based auth
- **BCrypt**: Password hashing

### Frontend
- **AngularJS 1.8.3**: Frontend framework
- **Bootstrap 5.3.0**: UI component library
- **Font Awesome 6.4.0**: Icon library
- **Chart.js 4.4.0**: Data visualization
- **SweetAlert2**: Beautiful alerts and modals

## 📋 Prerequisites

- .NET 8.0 SDK or later
- SQL Server 2022 (or SQL Server Express)
- Node.js (for package management, optional)
- Modern web browser (Chrome, Firefox, Edge)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ControlApp
```

### 2. Database Configuration

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ControlDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Database Migration

```bash
cd ControlApp.API
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

The application will be available at: `http://localhost:5088`

## 📁 Project Structure

```
ControlApp.API/
├── Controllers/          # API endpoints
├── Services/            # Business logic layer
├── Repositories/        # Data access layer
├── Models/              # Entity models
├── DTOs/                # Data transfer objects
├── Hubs/                # SignalR hubs for real-time communication
├── Migrations/          # EF Core migrations
├── Data/                # Database context
└── wwwroot/             # Frontend files
    ├── components/      # AngularJS components
    ├── services/        # Frontend services
    ├── templates/       # HTML templates
    └── styles.css       # Application styles
```

## 🔑 Default Login Credentials

After running migrations, you can create users through the registration page or use the database seeding if configured.

## 🎯 Usage Guide

### For Developers
1. Login with your credentials
2. View assigned controls on the dashboard
3. Update control progress and status
4. Resolve assigned defects with resolution notes
5. Track your daily progress

### For QA Engineers
1. Access assigned controls for testing
2. Create and execute test cases
3. Report defects with screenshots
4. Track defect resolution status
5. Verify fixed defects

### For Team Leads/Admins
1. Monitor team progress and statistics
2. Assign controls to team members
3. Review defect reports and resolutions
4. Generate insights and reports
5. Manage team members and roles

## 🔔 Real-time Notifications

The system provides instant notifications for:
- Defect assignments
- Defect status changes
- Test case failures
- Control updates
- Team announcements

## 🐛 Defect Management Workflow

1. **Report**: QA reports defect with details and screenshot
2. **Assign**: Defect assigned to developer
3. **In Progress**: Developer works on fix
4. **Fixed**: Developer marks as fixed with resolution notes
5. **Verify**: QA verifies the fix
6. **Closed**: Defect closed after verification

## 📊 Status Options

### Defect Statuses
- Open
- In Progress
- Fixed
- Not a Defect
- Deferred
- Duplicate
- Resolved
- Closed

### Test Case Statuses
- Not Tested
- Pass
- Fail

## 🔒 Security Features

- JWT token-based authentication
- BCrypt password hashing
- Role-based authorization
- Secure API endpoints
- CORS configuration
- SQL injection prevention via EF Core

## 🚀 Deployment

### Production Configuration

1. Update `appsettings.Production.json` with production settings
2. Set environment variable: `ASPNETCORE_ENVIRONMENT=Production`
3. Build the application:
```bash
dotnet publish -c Release
```
4. Deploy to your hosting environment (IIS, Azure, AWS, etc.)

## 📝 API Documentation

Key API endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/controls` - Get all controls
- `POST /api/defects` - Create defect
- `PUT /api/defects/{id}` - Update defect
- `GET /api/testcases/control/{id}` - Get test cases for control
- `POST /api/testcases` - Create test case
- `GET /api/controls/{id}/activity` - Get activity log for a control
- `POST /api/controls/{id}/activity` - Log a sub-objective status change

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

Developed for efficient software development lifecycle management and team collaboration.

## 📞 Support

For issues or questions, please contact your system administrator or create an issue in the repository.

## 🔄 Version History

- **v1.0** - Initial release with core features
- **v1.1** - Added SignalR real-time notifications
- **v1.2** - Enhanced defect management with status filtering
- **v1.3** - Test case management improvements
- **v1.4** - Activity Log tab, sub-objective status change tracking, defect duration metrics

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Main dashboard showing team statistics and progress overview*

### Control Board
![Control Board](docs/screenshots/control-board.png)
*Kanban-style board for managing controls across different statuses*

### Defect Management
![Defect Management](docs/screenshots/defects.png)
*Comprehensive defect tracking with status filtering and assignment*

### Test Case Execution
![Test Cases](docs/screenshots/test-cases.png)
*Test case management with pass/fail tracking*

### Real-time Notifications
![Notifications](docs/screenshots/notifications.png)
*Instant notifications for defects and updates*

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
**Problem**: Cannot connect to SQL Server
**Solution**:
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure Windows Authentication or SQL Authentication is properly configured
- Add `TrustServerCertificate=True` to connection string if using SSL

#### Migration Errors
**Problem**: `dotnet ef database update` fails
**Solution**:
```bash
# Install EF Core tools if not installed
dotnet tool install --global dotnet-ef

# Clean and rebuild
dotnet clean
dotnet build

# Try migration again
dotnet ef database update
```

#### SignalR Connection Issues
**Problem**: Real-time notifications not working
**Solution**:
- Check browser console for connection errors
- Verify JWT token is valid
- Ensure CORS is properly configured in `Program.cs`
- Check if SignalR hub endpoint is accessible

#### Login Issues
**Problem**: Cannot login with valid credentials
**Solution**:
- Verify user exists in database
- Check if password was hashed correctly
- Clear browser cache and cookies
- Check JWT configuration in `appsettings.json`

#### Port Already in Use
**Problem**: Port 5088 is already in use
**Solution**:
```bash
# Find process using the port (Windows)
netstat -ano | findstr :5088

# Kill the process
taskkill /PID <process_id> /F

# Or change port in launchSettings.json
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Control creation and assignment
- [ ] Test case creation and execution
- [ ] Defect reporting and assignment
- [ ] Real-time notification delivery
- [ ] Status updates and filtering
- [ ] Role-based access control
- [ ] Progress tracking and reporting

## 🔐 Environment Variables

Create a `.env` file or set environment variables:

```bash
ASPNETCORE_ENVIRONMENT=Development
JWT_SECRET=your-super-secret-key-here
JWT_ISSUER=ControlApp
JWT_AUDIENCE=ControlAppUsers
DATABASE_SERVER=YOUR_SERVER_NAME
DATABASE_NAME=ControlDB
```

## 📊 Database Schema

### Key Tables
- **Users**: User authentication and profile information
- **Employees**: Employee details and team assignments
- **Teams**: Team organization and management
- **Controls**: Development controls and tasks
- **TestCases**: QA test cases linked to controls
- **Defects**: Bug reports and defect tracking
- **ProgressLogs**: Daily progress entries
- **Insights**: System-generated insights and analytics
- **Releases**: Release management and versioning

### Relationships
- Users ↔ Employees (One-to-One)
- Employees ↔ Teams (Many-to-Many via UserTeam)
- Controls ↔ Employees (Many-to-One for assignment)
- Controls ↔ TestCases (One-to-Many)
- Controls ↔ Defects (One-to-Many)
- TestCases ↔ Defects (One-to-One optional link)

## 🚦 Performance Optimization

### Backend
- Entity Framework query optimization with `.AsNoTracking()`
- Async/await for all database operations
- Proper indexing on frequently queried columns
- Connection pooling for database connections

### Frontend
- Lazy loading of components
- Efficient AngularJS digest cycle management
- Debouncing for search and filter operations
- Caching of frequently accessed data

<!-- ## 🔄 CI/CD Pipeline

### Recommended Setup
```yaml
# Example GitHub Actions workflow
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 8.0.x
    - name: Restore dependencies
      run: dotnet restore
    - name: Build
      run: dotnet build --no-restore
    - name: Test
      run: dotnet test --no-build --verbosity normal
    - name: Publish
      run: dotnet publish -c Release -o ./publish
``` -->

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ⚠️ Internet Explorer (Not supported)

## 🌐 API Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per user
- 1000 requests per hour per IP address

## 📈 Monitoring & Logging

### Application Insights
Configure Application Insights for production monitoring:
```json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your-key-here"
  }
}
```

### Logging Levels
- **Development**: Debug and above
- **Production**: Information and above
- **Critical errors**: Always logged with full stack trace

## 🔒 Security Best Practices

### Implemented
- ✅ JWT token authentication
- ✅ Password hashing with BCrypt
- ✅ SQL injection prevention via parameterized queries
- ✅ CORS configuration
- ✅ HTTPS enforcement in production
- ✅ Role-based authorization
- ✅ Input validation and sanitization

### Recommendations
- Use HTTPS in production
- Regularly update dependencies
- Implement rate limiting
- Enable audit logging
- Regular security audits
- Keep JWT secrets secure

## 📚 Additional Resources

### Project Documentation
- **[User Manual](docs/USER_MANUAL.md)** - Complete guide for end users
- **[User Manual Update (v1.4)](ControlApp.API/document/USER_MANUAL_UPDATE.md)** - New features added in v1.4
- **[Quick Reference Guide](docs/QUICK_REFERENCE_GUIDE.md)** - Quick reference for common tasks
- **[Screenshots](docs/screenshots/)** - Application screenshots

### External Documentation
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/)
- [AngularJS Guide](https://docs.angularjs.org/guide)

### Useful Commands
```bash
# Create new migration
dotnet ef migrations add MigrationName

# Remove last migration
dotnet ef migrations remove

# Update database to specific migration
dotnet ef database update MigrationName

# Generate SQL script
dotnet ef migrations script

# Drop database (careful!)
dotnet ef database drop

# Check EF Core version
dotnet ef --version
```

## 🎯 Roadmap

### Planned Features
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] File attachment support for controls
- [ ] Integration with external tools (Jira, Slack)
- [ ] Mobile application
- [ ] Dark mode theme
- [ ] Export to Excel/PDF
- [ ] Advanced search and filtering
- [ ] Audit trail and history tracking
- [ ] Automated testing integration

## 🤝 Contributing Guidelines

### Code Style
- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation for public APIs
- Write unit tests for new features
- Keep methods small and focused

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Update documentation if needed
4. Ensure all tests pass
5. Submit PR with detailed description
6. Wait for code review and approval

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

## 📞 Support & Contact

### Getting Help
- 📧 Email: support@controlapp.com
- 💬 Slack: #controlapp-support
- 📖 Wiki: [Internal Documentation](link-to-wiki)
- 🐛 Issues: [GitHub Issues](link-to-issues)

### Team Contacts
- **Project Lead**: [Name] - [email]
- **Backend Lead**: [Name] - [email]
- **Frontend Lead**: [Name] - [email]
- **QA Lead**: [Name] - [email]

## 📄 License

Copyright © 2024 [Your Company Name]. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.

##  Acknowledgments

- Thanks to all team members who contributed to this project
- Built with modern web technologies and best practices
- Inspired by agile development methodologies

## 📊 Project Statistics

- **Lines of Code**: ~15,000
- **Components**: 25+ AngularJS components
- **API Endpoints**: 50+ RESTful endpoints
- **Database Tables**: 12 core tables
- **Supported Roles**: 7 user roles
- **Real-time Features**: SignalR notifications

---

**Built with ❤️ for efficient team collaboration and quality software delivery**

*Last Updated: March 2026*
