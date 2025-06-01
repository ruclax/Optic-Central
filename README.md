# Optica Patient Dashboard

## Provider Structure

The application uses a hierarchical provider structure to manage state and functionality across the platform:

### Root Provider
- Wraps all other providers
- Handles theme management
- Provides error boundary

### Auth Provider
- Manages authentication state
- Handles login/logout
- Persists user session

### Data Provider
- Manages application data (patients, appointments)
- Handles data fetching and caching
- Provides CRUD operations

### Error Boundary
- Catches and handles errors
- Provides fallback UI
- Prevents app crashes

## Usage Examples

### Auth Provider
```tsx
import { useAuth } from "@/providers/auth-provider"

function LoginComponent() {
  const { login, isLoading } = useAuth()
  
  const handleLogin = async () => {
    await login(username, password)
  }
}
```

### Data Provider
```tsx
import { useData } from "@/providers/data-provider"

function AppointmentList() {
  const { appointments, fetchAppointments } = useData()
  
  useEffect(() => {
    fetchAppointments()
  }, [])
}
```

## Performance Considerations

- State updates are batched to prevent unnecessary re-renders
- Context splitting prevents global re-renders
- Error boundaries isolate failures
- Lazy loading for better initial load performance

## Edge Cases Handled

- Authentication token expiration
- Network failures
- Data validation
- Error recovery
- Loading states
- Session persistence