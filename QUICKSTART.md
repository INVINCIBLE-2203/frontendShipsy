# Quick Start Guide

## Prerequisites
- Backend API running at `http://localhost:3000`
- Node.js 18+ installed

## Start the Application

```bash
# Navigate to the project directory
cd frontendShipsy

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## First Time Setup

1. **Register an Account**
   - Open http://localhost:5173/register
   - Enter email, username, and password
   - Click "Register"
   - You'll be auto-logged in and redirected to dashboard

2. **Create a Project**
   - On the dashboard, click "New Project"
   - Enter a project name (e.g., "My First Project")
   - Click "Create"

3. **Create Tasks**
   - Click on your project card
   - Click "Create Task" button
   - Fill in the form:
     - Title: "Sample Task"
     - Description: "This is a test task"
     - Status: "In Progress"
     - Priority: "High"
     - Due Date: (select a future date)
     - Estimated Hours: 5
   - Click "Create Task"

4. **Test Features**
   - ✅ Check/uncheck the completion checkbox
   - ✅ Use filters on the left sidebar
   - ✅ Change items per page (5/10)
   - ✅ Navigate between pages
   - ✅ Click "Edit" to modify a task
   - ✅ Click "Delete" to remove a task
   - ✅ Change sort order and sort by options

## Demo Checklist

### Must Show During Demo:

1. **All Field Types** ✅
   - Text: Title, Description
   - Enum: Status badge, Priority indicator
   - Boolean: Completion checkbox
   - Calculated: Days overdue, Effort variance

2. **Pagination** ✅
   - Show page number buttons
   - Click Previous/Next
   - Change items per page
   - Show results counter

3. **Filters** ✅
   - Check/uncheck status filters
   - Check/uncheck priority filters
   - Show filtered results

4. **CRUD Operations** ✅
   - Create a new task
   - Edit an existing task
   - Delete a task
   - Toggle completion

5. **Visual Design** ✅
   - Status color coding
   - Priority indicators
   - Overdue highlighting
   - Responsive layout

## Troubleshooting

**Port 5173 already in use?**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
# Then restart
npm run dev
```

**Backend not connecting?**
- Ensure backend is running on port 3000
- Check console for CORS errors
- Verify API endpoint in `src/api/index.ts`

**Blank page after login?**
- Check browser console for errors
- Clear localStorage and try again
- Ensure you created an organization during registration

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Files to Review

- `src/pages/tasks/TaskList.tsx` - Main task list with pagination & filters
- `src/components/TaskCard.tsx` - Task display showing all field types
- `src/components/TaskModal.tsx` - Create/Edit form
- `src/api/services.ts` - API integration
- `src/types/index.ts` - TypeScript types

## API Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `GET /organizations/:id/projects` - List projects
- `POST /organizations/:id/projects` - Create project
- `GET /projects/:id/tasks` - List tasks (with filters & pagination)
- `POST /projects/:id/tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

Enjoy using the Task Management Application! 🚀
