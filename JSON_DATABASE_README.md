# JSON Database System for Roster Planner

## Overview

The Roster Planner application now uses a JSON-based database system that stores all data in structured JSON files. This system provides:

- **Data Persistence**: All roster, leave, user, and other data is stored in JSON format
- **Export/Import**: Easy backup and restore functionality
- **Portability**: Data can be moved between different installations
- **Human Readable**: JSON format makes data easy to read and understand

## Database Structure

The database consists of the following main collections:

### 1. Users (`users`)
Stores all user information including:
- Basic profile (name, email, employee ID)
- Role (Admin, TeamLead, Employee)
- Team assignments
- Account status

### 2. Rosters (`rosters`)
Stores all roster submissions including:
- Weekly work schedules (WFO/WFH days)
- Leave days
- Submission status (Draft, Submitted, Approved, Rejected)
- Approval information

### 3. Teams (`teams`)
Stores team information including:
- Team name and description
- Team lead assignments
- Member count
- Active status

### 4. Holidays (`holidays`)
Stores public holiday information including:
- Holiday name and date
- Description
- Active status

### 5. Leaves (`leaves`)
Stores leave requests including:
- Leave type and dates
- Reason and status
- Approval information

### 6. Notifications (`notifications`)
Stores system notifications including:
- User-specific messages
- Read/unread status
- Notification type

## How to Use

### Accessing Database Management

1. **Login as Admin**: Only administrators can access the database management features
2. **Navigate to Database**: Go to `/database` route in the application
3. **Use Management Interface**: The interface provides export, import, and management tools

### Exporting Data

1. **Click "Export to JSON File"**: Downloads a complete database backup
2. **File Format**: The file will be named `workwise_database_YYYY-MM-DD.json`
3. **Content**: Contains all users, rosters, teams, holidays, leaves, and notifications

### Importing Data

1. **Select JSON File**: Choose a previously exported database file
2. **Click "Import from JSON File"**: Replaces current data with imported data
3. **Warning**: This will replace all existing data - use with caution

### Database Statistics

The management interface shows:
- **Total Users**: Number of registered users
- **Total Rosters**: Number of roster submissions
- **Total Teams**: Number of teams
- **Total Holidays**: Number of public holidays
- **Total Leaves**: Number of leave requests
- **Total Notifications**: Number of system notifications
- **Last Updated**: Timestamp of last database modification

## Sample Database File

A sample database file (`sample-database.json`) is included that shows:
- Example user data
- Sample roster submission
- Team structure
- Holiday definitions
- Leave request example
- Notification example

## File Structure

```
workwise_database_2025-08-10.json
├── users[]           # Array of user objects
├── rosters[]         # Array of roster objects
├── teams[]           # Array of team objects
├── holidays[]        # Array of holiday objects
├── leaves[]          # Array of leave objects
├── notifications[]   # Array of notification objects
├── currentUser       # Currently logged in user (or null)
└── lastUpdated       # Timestamp of last update
```

## Data Types

### User Object
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@workwise.com",
  "employeeId": "EMP001",
  "role": "Employee",
  "teamId": 1,
  "teamName": "Development Team",
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Roster Object
```json
{
  "id": 1,
  "userId": 4,
  "userName": "Surya Kumar",
  "email": "skumar302@workwise.com",
  "role": "Employee",
  "teamId": 1,
  "teamName": "Development Team",
  "weekStartDate": "2025-08-11",
  "weekEndDate": "2025-08-17",
  "workFromOfficeDays": ["2025-08-11", "2025-08-12", "2025-08-13"],
  "workFromHomeDays": ["2025-08-14", "2025-08-15"],
  "leaveDays": [],
  "status": "Submitted",
  "submittedAt": "2025-08-10T10:30:00.000Z",
  "createdAt": "2025-08-10T10:30:00.000Z",
  "updatedAt": "2025-08-10T10:30:00.000Z",
  "createdBy": 4,
  "updatedBy": 4
}
```

## Benefits

### 1. **Backup and Recovery**
- Easy to create backups of all data
- Simple restore process
- Version control friendly

### 2. **Data Migration**
- Move data between environments
- Share data between installations
- Easy data transfer

### 3. **Data Analysis**
- JSON format is easy to parse
- Can be imported into other tools
- Human-readable format

### 4. **Development and Testing**
- Easy to create test data
- Simple to reset to known state
- Portable between development environments

## Security Considerations

1. **Admin Access Only**: Database management is restricted to administrators
2. **Data Validation**: Imported data is validated before use
3. **Backup Before Import**: Always export current data before importing
4. **File Security**: JSON files contain sensitive data - handle with care

## Troubleshooting

### Common Issues

1. **Import Fails**: Check that the JSON file is valid and complete
2. **Data Loss**: Always backup before importing new data
3. **Permission Issues**: Ensure you're logged in as an administrator

### Best Practices

1. **Regular Backups**: Export data regularly
2. **Test Imports**: Test imports on non-production data first
3. **Validate Data**: Check exported files for completeness
4. **Version Control**: Keep track of database versions

## Technical Implementation

The JSON database system is implemented using:
- **JsonDatabaseService**: Main service for database operations
- **DatabaseManagementComponent**: UI for managing the database
- **LocalStorage**: Browser storage for persistence
- **File API**: For export/import functionality

All existing services (AuthService, RostersService, etc.) have been updated to use the new JSON database system while maintaining the same API interface. 