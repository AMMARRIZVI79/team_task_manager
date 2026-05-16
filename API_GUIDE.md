# API Integration & Testing Guide

## API Overview

The Team Task Manager API follows RESTful principles with the following characteristics:

- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`
- **Documentation**: http://localhost:8000/api/docs (Swagger UI)

## Authentication Flow

### 1. Signup (Register New User)

**Request:**
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "role": "member",
    "is_active": "true",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
}
```

### 2. Login

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "role": "member",
    "is_active": "true",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
}
```

### 3. Refresh Token

**Request:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}
```

## Using Access Token

All subsequent requests must include the access token:

```http
GET /projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Project Endpoints

### Create Project

**Request:**
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My New Project",
  "description": "Project description here"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "My New Project",
  "description": "Project description here",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### List Projects

**Request:**
```http
GET /projects
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "My New Project",
    "description": "Project description here",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

### Get Project Details

**Request:**
```http
GET /projects/{project_id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "My New Project",
  "description": "Project description here",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00",
  "owner": { ... },
  "tasks": [ ... ],
  "team_members": [ ... ]
}
```

### Update Project

**Request:**
```http
PUT /projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Project

**Request:**
```http
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

**Response (204 No Content)** - Empty response on success

## Task Endpoints

### Create Task

**Request:**
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "project_id": "550e8400-e29b-41d4-a716-446655440001",
  "assigned_to_id": "550e8400-e29b-41d4-a716-446655440000",
  "priority": "high",
  "due_date": "2024-02-15T18:00:00"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "New Task",
  "description": "Task description",
  "project_id": "550e8400-e29b-41d4-a716-446655440001",
  "assigned_to_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "priority": "high",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### List Tasks

**Request:**
```http
GET /tasks?project_id={project_id}&status=pending&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `project_id`: (optional) Filter by project
- `status`: (optional) pending, in_progress, completed
- `assigned_to`: (optional) User ID
- `priority`: (optional) low, medium, high

### Update Task

**Request:**
```http
PUT /tasks/{task_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "medium",
  "assigned_to_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Delete Task

**Request:**
```http
DELETE /tasks/{task_id}
Authorization: Bearer <token>
```

**Response (204 No Content)** - Empty response on success

## Team Member Endpoints

### Add Team Member

**Request:**
```http
POST /projects/{project_id}/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "550e8400-e29b-41d4-a716-446655440003",
  "role": "member"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "user_id": "550e8400-e29b-41d4-a716-446655440003",
  "project_id": "550e8400-e29b-41d4-a716-446655440001",
  "role": "member",
  "joined_at": "2024-01-15T10:30:00",
  "user": { ... }
}
```

### List Team Members

**Request:**
```http
GET /projects/{project_id}/members
Authorization: Bearer <token>
```

### Remove Team Member

**Request:**
```http
DELETE /projects/{project_id}/members/{user_id}
Authorization: Bearer <token>
```

**Response (204 No Content)** - Empty response on success

## Dashboard Endpoints

### Get Dashboard Statistics

**Request:**
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "task_stats": {
    "total_tasks": 10,
    "pending_tasks": 3,
    "in_progress_tasks": 4,
    "completed_tasks": 3,
    "overdue_tasks": 1
  },
  "recent_tasks": [ ... ],
  "my_projects": [ ... ],
  "assigned_tasks": [ ... ]
}
```

## User Endpoints

### Get Current User

**Request:**
```http
GET /users/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "member",
  "is_active": "true",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Update Current User

**Request:**
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "New Full Name",
  "username": "newusername",
  "password": "newpassword123"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "detail": "Access denied"
}
```

### 404 Not Found
```json
{
  "detail": "Project not found"
}
```

### 422 Unprocessable Entity (Validation Error)
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

## Testing with cURL

### 1. Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq '.access_token'
```

### 3. Create Project (save token from login)
```bash
TOKEN="your_access_token_here"

curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project"
  }' | jq '.id'
```

### 4. Create Task
```bash
TOKEN="your_access_token_here"
PROJECT_ID="project_id_from_previous_step"

curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "A test task",
    "project_id": "'$PROJECT_ID'",
    "priority": "high"
  }'
```

## Testing with Postman

1. **Create Collection**: New → Collection → "Task Manager API"

2. **Create Environment Variables**:
   - `base_url`: http://localhost:8000/api/v1
   - `token`: (will be set after login)

3. **Create Requests**:
   ```
   POST {{base_url}}/auth/login
   Body: {
     "email": "admin@example.com",
     "password": "password123"
   }
   Tests: pm.environment.set("token", pm.response.json().access_token);
   ```

4. **Use Token in Requests**:
   ```
   Headers: Authorization: Bearer {{token}}
   ```

## Rate Limiting & Best Practices

- No hard rate limits implemented (can be added)
- Include proper error handling
- Validate input before sending
- Use appropriate HTTP methods:
  - GET: Retrieve data
  - POST: Create data
  - PUT: Update data
  - DELETE: Delete data
- Implement pagination for large datasets
- Cache requests when possible

## Performance Tips

1. **Batch Operations**: Group related operations
2. **Filtering**: Filter on server side, not client side
3. **Pagination**: Not implemented yet, but recommended for production
4. **Caching**: Cache user and project data locally
5. **Connection Pooling**: Configured in database settings

---

For complete API documentation, visit http://localhost:8000/api/docs
