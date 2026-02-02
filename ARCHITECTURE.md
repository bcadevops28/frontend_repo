# 🏗️ Frontend Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Port 3000)                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     App Component                             │  │
│  │              (src/App.js)                                    │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │           CourtCaseList Component                      │ │  │
│  │  │      (src/components/CourtCaseList.js)                │ │  │
│  │  │                                                        │ │  │
│  │  │  • Displays table of court cases                      │ │  │
│  │  │  • Search/filter functionality                        │ │  │
│  │  │  • CRUD action buttons                               │ │  │
│  │  │                                                        │ │  │
│  │  │  ┌─────────────────────────────────────────────────┐  │ │  │
│  │  │  │  CourtCaseForm Component                        │  │ │  │
│  │  │  │ (src/components/CourtCaseForm.js)              │  │ │  │
│  │  │  │                                                 │  │ │  │
│  │  │  │  • Modal form for create/edit                  │  │ │  │
│  │  │  │  • Form validation                             │  │ │  │
│  │  │  │  • Error message display                       │  │ │  │
│  │  │  │  • Triggered by Add/Edit buttons               │  │ │  │
│  │  │  └─────────────────────────────────────────────────┘  │ │  │
│  │  │                                                        │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│         courtCaseService (src/services/courtCaseService.js)         │
│              (API Communication Layer with Axios)                   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ • getAllCourtCases()  → GET /api/courtcases                │  │
│  │ • getCourtCaseById(id) → GET /api/courtcases/{id}          │  │
│  │ • createCourtCase(data) → POST /api/courtcases             │  │
│  │ • updateCourtCase(id, data) → PUT /api/courtcases/{id}     │  │
│  │ • deleteCourtCase(id) → DELETE /api/courtcases/{id}        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│              Styling (CSS)                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ • CourtCaseList.css   (Table, badges, responsive)          │  │
│  │ • CourtCaseForm.css   (Form, modal, validation)            │  │
│  │ • App.css             (Global styles)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
                          AXIOS HTTP CLIENT
                         (HTTP Requests/Responses)
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                  SPRING BOOT BACKEND (Port 8080)                    │
│                                                                      │
│  REST Controller                                                    │
│  (/api/courtcases)                                                  │
│    ↓                                                                │
│  Service Layer (optional)                                          │
│    ↓                                                                │
│  Repository (CourtCaseRepository extends JpaRepository)            │
│    ↓                                                                │
│  JPA/Hibernate ORM                                                 │
│    ↓                                                                │
│  H2 Database                                                        │
│  (In-Memory or File-based)                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App (root)
 │
 └── CourtCaseList
      ├── Table (displays cases)
      │
      ├── Controls (Add, Search, Refresh)
      │
      └── CourtCaseForm (modal)
           ├── Form Fields
           └── Buttons (Create/Update, Cancel)
```

---

## Data Flow Diagram

### Create Operation
```
User Input
    ↓
CourtCaseForm Component
    ↓
Form Validation
    ↓ (if valid)
courtCaseService.createCourtCase()
    ↓
POST /api/courtcases
    ↓
Spring Boot Backend
    ↓
Save to H2 Database
    ↓ (success)
Return created case with ID
    ↓
Update CourtCaseList state
    ↓
Re-render table with new case
```

### Read Operation
```
Page Load or Refresh Click
    ↓
useEffect hook triggers
    ↓
courtCaseService.getAllCourtCases()
    ↓
GET /api/courtcases
    ↓
Spring Boot Backend
    ↓
Query H2 Database
    ↓
Return all cases
    ↓
Update state: setCourtCases(data)
    ↓
Re-render table
```

### Update Operation
```
User Clicks Edit Button
    ↓
Pre-fill CourtCaseForm with case data
    ↓
Show form modal
    ↓
User modifies fields
    ↓
User clicks Update
    ↓
Form Validation
    ↓ (if valid)
courtCaseService.updateCourtCase(id, data)
    ↓
PUT /api/courtcases/{id}
    ↓
Spring Boot Backend
    ↓
Update in H2 Database
    ↓ (success)
Return updated case
    ↓
Fetch all cases again
    ↓
Update state
    ↓
Re-render table with updates
```

### Delete Operation
```
User Clicks Delete Button
    ↓
Show confirmation dialog
    ↓ (user confirms)
courtCaseService.deleteCourtCase(id)
    ↓
DELETE /api/courtcases/{id}
    ↓
Spring Boot Backend
    ↓
Delete from H2 Database
    ↓ (success)
Remove from state array
    ↓
Re-render table without deleted case
```

### Search Operation
```
User Types in Search Box
    ↓
Update searchTerm state
    ↓
Filter function:
  cases.filter(case =>
    case.caseNumber.includes(term) ||
    case.description.includes(term)
  )
    ↓
Re-render table with filtered results
    ↓
(No API call - filters locally!)
```

---

## State Management

### CourtCaseList Component State

```javascript
courtCases: []           // Array of case objects
loading: boolean         // Loading indicator
error: string or null    // Error message
showForm: boolean        // Form visibility toggle
editingCase: object or null  // Current editing case
searchTerm: string       // Search filter text
```

### CourtCaseForm Component State

```javascript
formData: {
  caseNumber: string,
  categoryType: string,
  description: string,
  status: string
}

errors: {
  caseNumber: string or empty,
  description: string or empty
}
```

---

## API Request/Response Flow

### GET - Fetch All Cases

**Request:**
```
GET http://localhost:8080/api/courtcases
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "caseNumber": "CASE-2024-001",
    "categoryType": "Criminal",
    "description": "Case description...",
    "status": "Pending"
  },
  // ... more cases
]
```

---

### POST - Create Case

**Request:**
```
POST http://localhost:8080/api/courtcases
Content-Type: application/json

{
  "caseNumber": "CASE-2024-002",
  "categoryType": "Civil",
  "description": "Case description...",
  "status": "Pending"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "caseNumber": "CASE-2024-002",
  "categoryType": "Civil",
  "description": "Case description...",
  "status": "Pending"
}
```

---

### PUT - Update Case

**Request:**
```
PUT http://localhost:8080/api/courtcases/1
Content-Type: application/json

{
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "Updated description...",
  "status": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "caseNumber": "CASE-2024-001",
  "categoryType": "Criminal",
  "description": "Updated description...",
  "status": "In Progress"
}
```

---

### DELETE - Delete Case

**Request:**
```
DELETE http://localhost:8080/api/courtcases/1
```

**Response (204 No Content):**
```
(Empty body)
```

---

## File Dependencies

```
App.js
 ├── imports CourtCaseList.js
 │    ├── imports CourtCaseForm.js
 │    │    ├── imports CourtCaseForm.css
 │    │    └── no external dependencies
 │    ├── imports CourtCaseList.css
 │    └── imports courtCaseService.js
 │         └── imports axios
 └── imports App.css
```

---

## Component Lifecycle

### CourtCaseList Lifecycle

```
1. Component Mounts
   ↓
2. useEffect hook runs
   ↓
3. Calls getAllCourtCases()
   ↓
4. Shows loading state
   ↓
5. Receives data from backend
   ↓
6. Updates state: setCourtCases(data)
   ↓
7. Component re-renders with data
   ↓
8. User interactions trigger updates
   ↓
9. Component unmounts
```

---

## Form Validation Flow

```
User submits form
    ↓
handleSubmit triggered
    ↓
validateForm() called
    ↓
Checks:
  ├─ caseNumber is not empty
  └─ description is not empty AND >= 10 chars
    ↓
If validation fails:
  ├─ Set errors state
  ├─ Display error messages
  └─ Prevent submission
    ↓
If validation passes:
  ├─ Call onSubmit callback
  ├─ Make API request
  ├─ Close form
  └─ Re-fetch data
```

---

## Styling Architecture

```
App.css (Global)
├── Body & general styles
└── App container

CourtCaseList.css (Component-specific)
├── Container styling
├── Controls styling
│  ├── Buttons
│  └── Search input
├── Table styling
│  ├── Headers
│  ├── Rows
│  ├── Cells
│  └── Badges
├── Status colors
├── Category colors
├── Responsive breakpoints
│  ├── Desktop (1024px+)
│  ├── Tablet (768px-1023px)
│  └── Mobile (<768px)
└── Utility classes

CourtCaseForm.css (Component-specific)
├── Modal overlay
├── Form container
├── Form groups
├── Input styling
│  ├── Text inputs
│  ├── Textareas
│  └── Selects
├── Error styling
├── Button styling
└── Responsive adjustments
```

---

## Error Handling Flow

```
API Request
    ↓
Try Block
    ├─ Success
    │  └─ Update state, show data
    │
    └─ Error
       ├─ Catch block triggered
       ├─ Log error to console
       ├─ Set error message in state
       └─ Display error to user:
          "Failed to load court cases. 
           Make sure the backend is running."
```

---

## CORS Communication

```
Browser (localhost:3000)
        ↓
  Axios GET request with:
  - Origin header: http://localhost:3000
  - Content-Type: application/json
        ↓
Backend (localhost:8080)
    CORS Filter checks:
    ├─ Is origin allowed?
    ├─ Is method allowed?
    ├─ Are headers allowed?
        ↓
    If yes: Allow request
    If no: Block request (CORS error)
        ↓
Return response with:
  - Access-Control-Allow-Origin header
  - Access-Control-Allow-Methods header
        ↓
Browser receives response
If CORS headers present: Success ✓
If CORS headers missing: Error ✗
```

---

## Performance Optimization

```
React Component Optimization
├── Hooks (useState, useEffect)
├── Event delegation
├── Efficient state updates
└── Minimal re-renders

Search Optimization
├─ Client-side filtering (no API call)
├─ Real-time results
└─ Instant user feedback

API Optimization
├─ Single fetch on mount
├─ Refetch only on CRUD operations
└─ Efficient data transfer

CSS Optimization
├─ Minified in production
├─ CSS Grid for layout
├─ Flexbox for flexibility
└─ Media queries for responsiveness
```

---

## Responsive Design Breakpoints

```
Mobile First Approach

Mobile (< 768px)
├─ Single column layout
├─ Stacked controls
├─ Compact table
└─ Touch-friendly buttons

Tablet (768px - 1023px)
├─ Flexible layout
├─ Responsive controls
├─ Adaptive table
└─ Medium-sized buttons

Desktop (1024px+)
├─ Full width layout
├─ Horizontal controls
├─ Full table display
└─ Normal-sized buttons
```

---

## Security Architecture

```
Frontend Security Layers

1. Input Validation
   ├─ Required field checks
   ├─ Format validation
   └─ Length validation

2. Data Sanitization
   ├─ React escaping (XSS prevention)
   ├─ Error message sanitization
   └─ Safe DOM updates

3. Communication Security
   ├─ HTTPS ready (in production)
   ├─ CORS validation
   └─ Secure headers

4. Error Handling
   ├─ User-friendly messages
   ├─ No sensitive data exposure
   └─ Console logging for debugging
```

---

## Deployment Architecture

```
Development
├─ Port 3000 (Frontend)
└─ Port 8080 (Backend)

Production
├─ Static build files (from npm run build)
├─ Hosted on CDN or web server
├─ Backend on production server
└─ HTTPS enabled
```

---

This architecture ensures:
✅ Clear separation of concerns
✅ Scalable component structure
✅ Efficient data flow
✅ Responsive design
✅ Secure communication
✅ Easy maintenance
✅ Production-ready deployment
