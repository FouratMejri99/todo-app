# Todo Manager - Angular Application

A complete Angular to-do list manager application built with Angular 19, NgRx, and Angular Material.

## Features

### Authentication (Mock)

- Simple login screen with email input
- User session persistence using localStorage
- Automatic logout functionality
- User-specific task isolation

### Task Management

- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Properties**:
  - Title (required)
  - Description (optional)
  - Priority (1-5 scale)
  - Due date (required, must be today or future)
  - Completion status
- **Visual Indicators**: Priority badges, due date warnings, completion status
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### State Management (NgRx)

- **Auth Store**: User authentication state
- **Tasks Store**: Task management with Entity pattern
- **Effects**: Side effects for API calls and localStorage persistence
- **Selectors**: Optimized data selection and filtering

### UI/UX

- **Angular Material**: Modern, accessible UI components
- **Reactive Forms**: Form validation and user input handling
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error display and recovery

## Tech Stack

- **Angular 19**: Latest Angular framework
- **NgRx**: State management (Store, Effects, Entity)
- **Angular Material**: UI component library
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **Angular Reactive Forms**: Form management

## Project Structure

```
src/app/
├── auth/                    # Authentication feature
│   ├── components/
│   │   └── login/          # Login component
│   └── store/              # Auth NgRx files
│       ├── auth.actions.ts
│       ├── auth.effects.ts
│       ├── auth.reducer.ts
│       ├── auth.selectors.ts
│       └── auth.state.ts
├── tasks/                   # Task management feature
│   ├── components/
│   │   ├── task-list/      # Task list component
│   │   └── task-form/      # Task form dialog
│   └── store/              # Tasks NgRx files
│       ├── task.actions.ts
│       ├── task.effects.ts
│       ├── task.reducer.ts
│       ├── task.selectors.ts
│       └── task.reducer.ts
├── shared/                  # Shared components and models
│   ├── components/
│   │   └── header/         # App header
│   └── models/             # TypeScript interfaces
├── store/                   # Global store configuration
│   ├── app.reducer.ts
│   └── app.state.ts
├── app.component.ts         # Root component
├── app.config.ts           # App configuration
└── app.routes.ts           # Routing configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

### Login

1. Enter any valid email address
2. Click "Login" to authenticate
3. You'll be redirected to the tasks page

### Managing Tasks

1. **Create Task**: Click "Add Task" button
2. **Edit Task**: Click the edit icon on any task
3. **Complete Task**: Check the checkbox next to a task
4. **Delete Task**: Click the delete icon (with confirmation)
5. **View Details**: Tasks show priority, due date, and creation date

### Logout

Click the logout button in the header to sign out and clear your tasks.

## Key Architecture Decisions

### NgRx Entity Pattern

- Used Entity Adapter for efficient task CRUD operations
- Automatic sorting by due date, priority, and creation time
- Optimized selectors for data access

### Standalone Components

- All components are standalone for better tree-shaking
- Explicit imports for better dependency management
- Easier testing and reusability

### Mock Authentication

- Simple email-based authentication for demo purposes
- localStorage persistence for session management
- Easy to extend with real authentication service

### Responsive Design

- Mobile-first approach
- Angular Material's responsive components
- Custom breakpoints for optimal user experience

## Development Notes

### State Management Flow

1. **Actions**: User interactions trigger NgRx actions
2. **Effects**: Side effects handle async operations (localStorage, API calls)
3. **Reducers**: Pure functions update state based on actions
4. **Selectors**: Components subscribe to specific state slices

### Data Persistence

- Tasks are stored in localStorage per user
- Automatic data synchronization on state changes
- User isolation ensures data privacy

### Error Handling

- Form validation with real-time feedback
- Global error states with user-friendly messages
- Graceful degradation for network issues

## Future Enhancements

- Real backend API integration
- User registration and password authentication
- Task categories and tags
- Due date reminders
- Task sharing and collaboration
- Advanced filtering and sorting options
- Dark mode theme
- Offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
