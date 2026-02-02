# Backend Update Guide - Defendant & Affender Fields

## Issue
The frontend is sending `defendant` and `affender` data, but the backend database and entity model don't have these fields yet.

## Required Backend Updates

### 1. Update CourtCase Entity/Model

Your backend entity/model (Java, Python, Node.js, etc.) needs to include the new fields:

```java
// For Java/Spring Boot
@Entity
@Table(name = "court_cases")
public class CourtCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;
    
    @Column(name = "case_type")
    private String caseType;
    
    @Column(name = "defendant", nullable = false)  // NEW FIELD
    private String defendant;
    
    @Column(name = "affender", nullable = false)   // NEW FIELD
    private String affender;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "status")
    private String status;
    
    // Getters and Setters
    // ...
}
```

### 2. Create Database Migration

Run a migration to add the new columns:

```sql
-- For SQL Database
ALTER TABLE court_cases ADD COLUMN defendant VARCHAR(255) NOT NULL DEFAULT 'Unknown';
ALTER TABLE court_cases ADD COLUMN affender VARCHAR(255) NOT NULL DEFAULT 'Unknown';

-- If using a migration tool (Flyway/Liquibase):
-- Create a migration file like: V003__Add_defendant_affender_fields.sql
```

### 3. Update Repository/DAO

If using Spring Data JPA, your repository should already support the new fields automatically:

```java
@Repository
public interface CourtCaseRepository extends JpaRepository<CourtCase, Long> {
    // Existing methods remain unchanged
    // The save() method will automatically include the new fields
}
```

### 4. Update DTOs (if applicable)

If you're using Data Transfer Objects, add the fields:

```java
public class CourtCaseDTO {
    private Long id;
    private String caseNumber;
    private String caseType;
    private String defendant;    // NEW FIELD
    private String affender;     // NEW FIELD
    private String description;
    private String status;
    
    // Getters and Setters
    // ...
}
```

### 5. Update Controller Validation

Add validation for the new fields:

```java
@PostMapping
public ResponseEntity<?> createCourtCase(@Valid @RequestBody CourtCaseDTO courtCaseDTO) {
    // Validation is handled by @Valid annotation
    CourtCase savedCase = courtCaseService.saveCourtCase(courtCaseDTO);
    return ResponseEntity.ok(savedCase);
}
```

### 6. Restart Backend Service

After making these changes:
1. Stop the backend server
2. Run the database migration
3. Rebuild and restart the backend
4. Test with the frontend

## Frontend Data Being Sent

The frontend will send the following JSON structure:

```json
{
  "caseNumber": "CASE-2024-001",
  "caseType": "CRIMINAL",
  "defendant": "John Doe",
  "affender": "Jane Smith",
  "description": "This is a detailed description of the court case.",
  "status": "PENDING"
}
```

## Verification Checklist

- [ ] Database table updated with new columns
- [ ] Entity model updated with new fields
- [ ] DTO updated with new fields
- [ ] Validation added
- [ ] Backend restarted
- [ ] Test creating a new case with defendant and affender
- [ ] Test editing an existing case
- [ ] Verify data appears in frontend table

## Common Issues

### Issue: Still showing N/A in frontend
**Solution:** Database migration didn't run or data wasn't saved. Check backend logs for errors.

### Issue: 400 Bad Request when submitting form
**Solution:** Backend validation is failing. Check error message in browser console or backend logs.

### Issue: Data saves but doesn't appear in table
**Solution:** Frontend not refreshed. Try clearing browser cache (Ctrl+Shift+Del) and reload.
