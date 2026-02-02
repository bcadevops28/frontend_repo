# Frontend Features & Usage Guide

## 📋 Application Overview

The **Court Case Management Frontend** is a complete CRUD application built with React for managing court cases. It provides an intuitive interface for creating, reading, updating, and deleting court case records that are stored in a Spring Boot backend with H2 database.

---

## 🎯 Key Features

### 1. **List View with Search**
- Display all court cases in a clean, organized table
- Search functionality to filter by case number or description
- Responsive table design that works on all devices
- Color-coded status and category badges

### 2. **Create Court Cases**
- Add new court cases via an intuitive form
- Field validation ensures data quality
- Required fields: Case Number, Description, Category Type, Status
- Modal form prevents accidental clicks outside the form

### 3. **Edit Court Cases**
- Click "Edit" button to modify any court case
- Form pre-fills with existing data
- All validations apply to edits as well
- Easy cancel option to discard changes

### 4. **Delete Court Cases**
- Confirmation dialog prevents accidental deletions
- Immediate feedback on successful deletion
- Safe operation with backend

### 5. **Status Management**
- Three status options: **Pending**, **In Progress**, **Closed**
- Visual status indicators with color coding
- Easy status updates through the form

### 6. **Case Categories**
- Two category types: **Criminal**, **Civil**
- Category badges with distinct colors
- Easy category filtering via search

---

## 🚀 Quick Start

### Installation & Setup

```bash
# 1. Navigate to frontend directory
cd c:\Users\ASUS\vetri23suca28\frontend

# 2. Install dependencies
npm install

# 3. Start the application
npm start
```

The application opens automatically at `http://localhost:3000`

---

## 📖 User Guide

### Creating a New Court Case

1. Click **"+ Add New Court Case"** button
2. Fill in the form:
   - **Case Number**: Unique identifier (e.g., "CASE-2024-001")
   - **Category Type**: Select "Criminal" or "Civil"
   - **Description**: Provide detailed case information (minimum 10 characters)
   - **Status**: Select from "Pending", "In Progress", or "Closed"
3. Click **"Create Case"** to save
4. Success message confirms the creation

### Viewing Court Cases

- All court cases appear in the main table
- Table shows: ID, Case Number, Category Type, Description, Status
- Hover over rows to highlight them
- Cases are sorted by their database ID

### Searching for Cases

- Use the **search box** at the top
- Type to filter by:
  - Case number (e.g., "CASE-2024")
  - Description keywords (e.g., "theft", "property")
- Search is **case-insensitive**
- Results update in real-time

### Editing a Court Case

1. Find the court case in the table
2. Click the **"Edit"** button (blue button)
3. Modify any field in the form
4. Click **"Update Case"** to save changes
5. Confirmation message shows update success

### Deleting a Court Case

1. Find the court case in the table
2. Click the **"Delete"** button (red button)
3. Confirm the deletion in the dialog
4. Court case is immediately removed from the list

### Refreshing Data

- Click the **"Refresh"** button to reload all court cases from the backend
- Useful if multiple users are using the system

---

## 🎨 User Interface Components

### Header Section
- **Title**: "Court Case Management System"
- Clean, professional appearance
- Responsive on all screen sizes

### Control Panel
- **Add New Case Button**: Primary action (navy blue)
- **Search Input**: Filter cases in real-time
- **Refresh Button**: Reload data from backend

### Court Cases Table
- **Columns**: ID | Case Number | Category Type | Description | Status | Actions
- **Color-coded Badges**:
  - Criminal: Red/Pink background
  - Civil: Green background
  - Pending: Orange background
  - In Progress: Blue background
  - Closed: Green background
- **Action Buttons**: Edit (blue) | Delete (red)

### Form Modal
- **Overlay**: Prevents interaction with the main page
- **Fields**: Case Number | Category Type | Description | Status
- **Buttons**: 
  - Create/Update Case (green) - Submit form
  - Cancel (gray) - Close without saving

---

## ✅ Form Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| Case Number | Required, non-empty | "Case number is required" |
| Category Type | Predefined values | Auto-validated by dropdown |
| Description | Required, min 10 chars | "Description is required" or "Description must be at least 10 characters" |
| Status | Predefined values | Auto-validated by dropdown |

---

## 🔌 API Integration

### Backend Connection

The frontend communicates with the Spring Boot backend via REST API:

```
Base URL: http://localhost:8080/api/courtcases
```

### API Endpoints Used

| HTTP Method | Endpoint | Function |
|-------------|----------|----------|
| GET | `/api/courtcases` | Load all court cases |
| GET | `/api/courtcases/{id}` | Load specific case (for editing) |
| POST | `/api/courtcases` | Create new case |
| PUT | `/api/courtcases/{id}` | Update existing case |
| DELETE | `/api/courtcases/{id}` | Delete a case |

### Expected Data Format

**Request (Create/Update):**
```json
{
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "Detailed case description here...",
  "status": "Pending"
}
```

**Response (from GET):**
```json
{
  "id": 1,
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "Detailed case description here...",
  "status": "Pending"
}
```

---

## 🛠️ Technical Details

### Technology Stack
- **React 19.2**: UI framework
- **Axios 1.13**: HTTP client for API communication
- **CSS3**: Custom styling and responsive design
- **JavaScript ES6+**: Modern JavaScript features

### Project Structure
```
src/
├── components/
│   ├── CourtCaseList.js       # Main component (730 lines)
│   └── CourtCaseForm.js       # Form component (100 lines)
├── services/
│   └── courtCaseService.js    # API service (50 lines)
├── styles/
│   ├── CourtCaseList.css      # Table & list styling
│   └── CourtCaseForm.css      # Form styling
├── App.js                      # Root component
└── App.css                     # Global styling
```

### State Management
- Uses React Hooks (useState, useEffect)
- Local state for form data
- Component-level state for court cases list

### Features
- ✅ Async/await for API calls
- ✅ Error handling and user feedback
- ✅ Form validation before submission
- ✅ Loading states
- ✅ Responsive design (mobile-first)

---

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest versions |
| Firefox | ✅ Latest versions |
| Safari | ✅ Latest versions |
| Edge | ✅ Latest versions |
| Mobile Browsers | ✅ Full responsive support |

---

## ⚠️ Troubleshooting

### Issue: "Failed to load court cases. Make sure the backend is running."

**Solution:**
1. Verify Spring Boot backend is running on `http://localhost:8080`
2. Check if the backend is properly started
3. Verify CORS configuration in backend
4. Check browser console (F12) for detailed error messages

### Issue: Form shows validation errors but fields look correct

**Solution:**
1. Ensure Description is at least 10 characters
2. All fields must be filled (no empty values)
3. Check for leading/trailing spaces

### Issue: Data appears after refresh but not immediately

**Solution:**
1. This might be a caching issue
2. Check browser console for API errors
3. Verify backend response format matches expected structure

### Issue: API calls fail with CORS error

**Solution:**
1. Add CORS configuration to Spring Boot backend
2. Ensure `@CrossOrigin(origins = "http://localhost:3000")` is set
3. Verify the exact URL matches (including port number)

---

## 📱 Responsive Design

### Desktop View (1024px+)
- Full table with all columns visible
- Multi-line controls
- Optimal spacing and readability

### Tablet View (768px - 1023px)
- Table with slightly reduced padding
- Controls stack flexibly
- Touch-friendly buttons

### Mobile View (<768px)
- Compact table layout
- Stacked controls
- Larger touch targets for buttons
- Simplified search interface

---

## 🔐 Security Considerations

1. **Input Validation**: All user inputs are validated on the frontend
2. **CORS**: Only communicates with configured backend URL
3. **XSS Prevention**: React automatically escapes user inputs
4. **Error Messages**: Don't expose sensitive backend information

---

## 📊 Example Usage Scenario

### Scenario: Managing a Criminal Case

1. **Create**: Add new case "CASE-2024-001" with category "Criminal"
2. **Read**: View all cases, see the new case in the table
3. **Update**: Click Edit, change status from "Pending" to "In Progress"
4. **Search**: Filter cases by "CASE-2024" to quickly find it
5. **Delete**: After case is closed, remove it with the Delete button

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Ready to use!** Your Court Case Management Frontend is fully functional and ready to connect with your Spring Boot backend.
