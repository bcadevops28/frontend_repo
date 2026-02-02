# Court Case Management System - Frontend

A modern React-based CRUD application for managing court cases with a Spring Boot backend.

## Features

- **Create**: Add new court cases with case number, category type, description, and status
- **Read**: View all court cases in a responsive table format
- **Update**: Edit existing court case details
- **Delete**: Remove court cases from the system
- **Search**: Filter court cases by case number or description
- **Validation**: Form validation for required fields and minimum description length
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
src/
├── components/
│   ├── CourtCaseForm.js      # Form for creating/editing court cases
│   └── CourtCaseList.js      # Main list component with CRUD operations
├── services/
│   └── courtCaseService.js   # API service for backend communication
├── styles/
│   ├── CourtCaseForm.css     # Form styling
│   └── CourtCaseList.css     # List and table styling
├── App.js                     # Main App component
├── App.css                    # Global App styling
└── index.js                   # Entry point
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spring Boot backend running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

2. If you need to install additional packages (axios is already included):
```bash
npm install axios
```

## Configuration

### Backend API URL

The frontend is configured to communicate with the backend at `http://localhost:8080/api/courtcases`. 

If your backend is running on a different URL, update the `API_BASE_URL` in [src/services/courtCaseService.js](src/services/courtCaseService.js#L3):

```javascript
const API_BASE_URL = 'http://your-backend-url/api/courtcases';
```

### CORS Configuration (Backend)

Ensure your Spring Boot backend has CORS configured to allow requests from `http://localhost:3000`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true);
            }
        };
    }
}
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000` in your browser.

## Backend API Endpoints

The frontend expects the following API endpoints on your Spring Boot backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courtcases` | Get all court cases |
| GET | `/api/courtcases/{id}` | Get a specific court case |
| POST | `/api/courtcases` | Create a new court case |
| PUT | `/api/courtcases/{id}` | Update a court case |
| DELETE | `/api/courtcases/{id}` | Delete a court case |

### Expected Request/Response Format

**Create/Update Court Case (POST/PUT):**
```json
{
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "This is a detailed case description...",
  "status": "Pending"
}
```

**Court Case Response (GET):**
```json
{
  "id": 1,
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "This is a detailed case description...",
  "status": "Pending"
}
```

## Usage Guide

### Adding a New Court Case

1. Click the **"+ Add New Court Case"** button
2. Fill in the form with:
   - **Case Number**: Unique identifier (required)
   - **Category Type**: Select "Criminal" or "Civil"
   - **Description**: Case details (minimum 10 characters, required)
   - **Status**: Select from "Pending", "In Progress", or "Closed"
3. Click **"Create Case"** to save

### Editing a Court Case

1. Click the **"Edit"** button next to the court case you want to modify
2. Update the form fields
3. Click **"Update Case"** to save changes

### Deleting a Court Case

1. Click the **"Delete"** button next to the court case
2. Confirm the deletion when prompted

### Searching Court Cases

Use the search input field to filter court cases by:
- Case number
- Description content

## Form Validation

The form includes the following validations:

- **Case Number**: Required field
- **Description**: Required field, minimum 10 characters
- **Category Type**: Required, predefined options (Criminal/Civil)
- **Status**: Required, predefined options (Pending/In Progress/Closed)

## Component Details

### CourtCaseList Component

Main component that handles:
- Fetching and displaying all court cases
- Managing state for court cases, loading, and errors
- Opening/closing the form modal
- Search functionality
- Delete confirmation and deletion

### CourtCaseForm Component

Form component for creating and editing court cases with:
- Field validation
- Error message display
- Support for both create and edit modes
- Modal overlay design

### courtCaseService

API service module that handles:
- All HTTP requests to the backend
- Error handling and logging
- API response parsing

## Styling

The application uses custom CSS with:
- Professional color scheme (navy blue primary color)
- Responsive design for mobile and desktop
- Color-coded status badges and category types
- Smooth transitions and hover effects
- Dark headers and light content areas

## Building for Production

Create a production build:

```bash
npm run build
```

This will create an optimized build in the `build/` directory.

## Troubleshooting

### Backend Connection Error

If you see "Failed to load court cases. Make sure the backend is running.":

1. Verify the Spring Boot backend is running
2. Check if the backend is on `http://localhost:8080`
3. Verify CORS is properly configured on the backend
4. Check browser console for specific error messages

### Form Not Submitting

1. Check the browser console for validation errors
2. Ensure all required fields are filled
3. Verify description is at least 10 characters
4. Check if the backend is responding properly

### Data Not Appearing

1. Refresh the page using the **"Refresh"** button
2. Check if the backend API is returning data
3. Verify the response format matches the expected structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **React 19.2**: UI framework
- **Axios 1.13**: HTTP client for API calls
- **CSS3**: Styling and responsive design
- **JavaScript ES6+**: Modern JavaScript

## License

This project is part of a Court Case Management System. Refer to the main project license for usage terms.

## Support

For issues or questions related to the frontend, please check the console logs for error messages or contact the development team.
