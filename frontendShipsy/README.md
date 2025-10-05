# Task Management Frontend

A comprehensive React-based frontend application for managing tasks, projects, and organizations. Built with TypeScript, React Router, Zustand, and Tailwind CSS.

## Features

### ✅ Core Features Implemented

#### Authentication
- **Login Page** (`/login`)
  - Email and password validation
  - Error handling
  - Auto-redirect on success
  - Link to registration

- **Register Page** (`/register`)
  - Email, username, password fields
  - Password confirmation validation
  - Auto-login after registration

- **Auth Guard**
  - Protected routes
  - Auto token refresh
  - Redirect to login when unauthorized

#### Dashboard
- Welcome screen with user info
- Project list with cards
- Create new projects
- Navigate to project tasks

#### Task Management (Complete Implementation)

**Task List Page** (`/projects/:projectId/tasks`)
- ✅ Display ALL field types:
  - **Text Fields**: Title, Description
  - **Enum Fields**: Status (todo/in_progress/review/done/archived), Priority (low/medium/high/urgent)
  - **Boolean Field**: Completion checkbox (isCompleted)
  - **Calculated Fields**: Days Overdue, Effort Variance

- ✅ **Pagination** (Fully Functional)
  - Page number buttons [1] [2] [3]...
  - Previous/Next navigation
  - Items per page selector (5/10)
  - Results counter: "Showing 1-10 of 45 tasks"

- ✅ **Filter Panel**
  - Status filters (multi-select checkboxes)
  - Priority filters (multi-select checkboxes)
  - Sort by: Created Date / Due Date / Priority
  - Sort order: Ascending / Descending

- ✅ **Task Cards** showing:
  - Title (prominent heading)
  - Description (truncated with ellipsis)
  - Color-coded status badges
  - Priority indicators with visual cues (🔥 for urgent)
  - Completion checkbox
  - Assignee avatar and name
  - Due date with overdue highlighting
  - Calculated fields (days overdue, effort variance)
  - Created/Updated timestamps
  - Edit and Delete buttons

#### Task CRUD Operations

- ✅ **Create Task**
  - Modal form with all fields
  - Title (required)
  - Description (textarea)
  - Status dropdown
  - Priority dropdown
  - Due date picker
  - Estimated hours
  - Actual hours
  - Form validation

- ✅ **Edit Task**
  - Pre-filled form with existing data
  - Update any field
  - Display calculated fields (read-only)

- ✅ **Delete Task**
  - Confirmation dialog
  - Successful removal from list

- ✅ **Toggle Completion**
  - Checkbox on task card
  - Auto-updates status to "done" when completed

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v7** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling
- **@tailwindcss/forms** - Form styling
- **react-hot-toast** - Notifications

## Project Structure

```
src/
├── api/
│   ├── index.ts           # Axios instance with interceptors
│   └── services.ts        # API service functions
├── components/
│   ├── Layout.tsx         # Main layout with header & sidebar
│   ├── TaskCard.tsx       # Task display card with all fields
│   └── TaskModal.tsx      # Create/Edit task modal
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx      # Login page
│   │   └── Register.tsx   # Registration page
│   ├── Dashboard.tsx      # Dashboard with projects
│   └── tasks/
│       └── TaskList.tsx   # Task list with filters & pagination
├── router/
│   ├── AuthGuard.tsx      # Protected route wrapper
│   └── index.tsx          # Route configuration
├── store/
│   └── auth.ts            # Zustand auth store
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx
└── main.tsx
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000`

### Steps

1. **Install dependencies:**
   ```bash
   cd frontendShipsy
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Environment Configuration

The app connects to the backend API at `http://localhost:3000/api`. To change this:

Edit `src/api/index.ts`:
```typescript
const API = axios.create({
  baseURL: 'http://your-api-url/api',
});
```

## Features Breakdown

### Visual Design

**Status Badges:**
- `todo` - Gray background
- `in_progress` - Blue background
- `review` - Yellow background
- `done` - Green background
- `archived` - Dark gray background

**Priority Indicators:**
- `urgent` - Red border, 🔥 icon
- `high` - Orange border
- `medium` - Blue border
- `low` - Gray border

**Overdue Tasks:**
- Red text for due dates
- Red badge showing "X days overdue"

**Effort Variance:**
- Green text for under-budget (negative variance)
- Red text for over-budget (positive variance)

### API Integration

All CRUD operations work with the backend:

- `GET /projects/:projectId/tasks` - List tasks with filters & pagination
- `POST /projects/:projectId/tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

**Implemented Filters:**
- Multiple status selection
- Multiple priority selection
- Sort by created date, due date, or priority
- Ascending/descending order
- Pagination (5 or 10 items per page)

### Authentication Flow

1. User registers/logs in
2. Tokens stored in localStorage
3. Access token sent with all API requests
4. Refresh token used to get new access token when expired
5. Redirects to login if refresh fails

## Usage Guide

### Getting Started

1. **Register a new account**
   - Navigate to `/register`
   - Fill in email, username, and password
   - Auto-login and redirect to dashboard

2. **Create a project**
   - Click "New Project" on dashboard
   - Enter project name
   - Click "Create"

3. **Manage tasks**
   - Click on a project card
   - View task list with filters
   - Click "Create Task" to add new task
   - Use checkboxes in filter panel to filter by status/priority
   - Change items per page (5 or 10)
   - Navigate between pages

4. **Edit/Delete tasks**
   - Click "Edit" button on task card
   - Update fields and save
   - Click "Delete" to remove (with confirmation)

### Keyboard & Mouse Interactions

- Click project cards to navigate
- Use dropdown menus for sorting
- Check/uncheck completion status
- Filter tasks with checkboxes
- Navigate pages with number buttons or Prev/Next

## Critical Success Factors ✅

All required features are implemented:

- [x] ALL field types visible (text, enum, boolean, calculated)
- [x] Pagination functional with 5-10 items per page
- [x] At least one filter works (status & priority filters implemented)
- [x] CRUD operations complete successfully
- [x] Clean, professional UI
- [x] Authentication flow working
- [x] Token refresh handling
- [x] Error handling
- [x] Responsive design
- [x] TypeScript type safety

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- `verbatimModuleSyntax` requires type-only imports
- All types defined in `src/types/index.ts`

### State Management
- Zustand for auth state
- Local component state for UI
- No global task state (fetch on demand)

### Styling
- Tailwind CSS v4 with PostCSS plugin
- @tailwindcss/forms for form elements
- Responsive grid layouts
- Color-coded visual indicators

## Troubleshooting

**Build fails with PostCSS error:**
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` uses `@tailwindcss/postcss`

**401 Unauthorized errors:**
- Check tokens in localStorage
- Verify backend is running
- Check token expiration

**Tasks not loading:**
- Verify projectId in URL
- Check network tab for API errors
- Ensure you're logged in

## Future Enhancements

- Comments with @mentions
- Custom properties support
- Real-time updates (WebSocket)
- Drag-and-drop task reordering
- Bulk operations
- Export tasks to CSV/PDF
- Advanced search
- Task templates
- Email notifications

## License

MIT
